
import {
  calculateTotals,
  generatePurchaseList,
  mergeDuplicateMealItems,
  type MealItem,
} from "./engine";
import { REGION_PRICE_MULTIPLIERS, type Region } from "./pricing";
import {
  buildInstitutionalPlan,
  type GenerationMode,
  type InstitutionalPlan,
  type PeriodMode,
} from "./institutional";
import { AppError, ExitCode } from "./errors";

export type { Region, PeriodMode, GenerationMode };

export type MenuRequest = {
  students: number;
  days: number;
  calories: number;
  protein: number;
  region?: Region;
  periodMode?: PeriodMode;
  generationMode?: GenerationMode;
};

export type PricingContext = {
  region: Region;
  multiplier: number;
  note: string;
};

export type GeneratedMenu = {
  request: MenuRequest & { region: Region };
  model: string;
  menu: MealItem[];
  totals: ReturnType<typeof calculateTotals>;
  purchaseList: ReturnType<typeof generatePurchaseList>;
  pricing: PricingContext;
  institutional: InstitutionalPlan;
};

function assertFiniteNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AppError(`${label} deve ser um numero finito.`, ExitCode.Usage, "INVALID_ARGUMENT");
  }
}

function assertPositiveInteger(value: unknown, label: string): asserts value is number {
  assertFiniteNumber(value, label);
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError(`${label} deve ser um inteiro maior que zero.`, ExitCode.Usage, "INVALID_ARGUMENT");
  }
}

function validateRequest(request: MenuRequest): void {
  assertPositiveInteger(request.students, "students");
  assertPositiveInteger(request.days, "days");
  assertFiniteNumber(request.calories, "calories");
  assertFiniteNumber(request.protein, "protein");

  if (request.calories <= 0 || request.protein <= 0) {
    throw new AppError("calories e protein devem ser maiores que zero.", ExitCode.Usage, "INVALID_ARGUMENT");
  }

  if (request.region !== undefined && !Object.hasOwn(REGION_PRICE_MULTIPLIERS, request.region)) {
    throw new AppError("region invalida.", ExitCode.Usage, "INVALID_ARGUMENT");
  }

  if (request.periodMode && !["semanal", "quinzenal", "mensal"].includes(request.periodMode)) {
    throw new AppError("periodMode invalido.", ExitCode.Usage, "INVALID_ARGUMENT");
  }

  if (request.generationMode && !["cardapio", "cautela", "cotacao", "completo"].includes(request.generationMode)) {
    throw new AppError("generationMode invalido.", ExitCode.Usage, "INVALID_ARGUMENT");
  }
}

function resolveRegion(region: MenuRequest["region"]): Region {
  if (region && Object.hasOwn(REGION_PRICE_MULTIPLIERS, region)) {
    return region;
  }
  return "Centro-Oeste";
}

function applyRegionalPriceFactor(
  totals: ReturnType<typeof calculateTotals>,
  purchaseList: ReturnType<typeof generatePurchaseList>,
  multiplier: number,
): {
  totals: ReturnType<typeof calculateTotals>;
  purchaseList: ReturnType<typeof generatePurchaseList>;
} {
  const adjustedTotals: ReturnType<typeof calculateTotals> = {
    ...totals,
    totalMealCost: totals.totalMealCost * multiplier,
    costPerStudent: totals.costPerStudent * multiplier,
  };

  const adjustedItems = purchaseList.items.map((item) => ({
    ...item,
    costPerKg: item.costPerKg * multiplier,
    totalCost: item.totalCost * multiplier,
  }));

  const adjustedGrandTotal = adjustedItems.reduce((accumulator, item) => accumulator + item.totalCost, 0);

  const adjustedPurchaseList: ReturnType<typeof generatePurchaseList> = {
    ...purchaseList,
    items: adjustedItems,
    grandTotalCost: adjustedGrandTotal,
  };

  return {
    totals: adjustedTotals,
    purchaseList: adjustedPurchaseList,
  };
}

function generateDeterministicMenu(request: MenuRequest): MealItem[] {
  // Gera um cardápio determinístico alternando preparações do PREPARATION_LIBRARY
  // e consolidando os itens para o período solicitado.
  // Não há mais dependência de IA externa: toda a lógica é local, estável e previsível.
  const plan = buildInstitutionalPlan({
    students: request.students,
    days: request.days,
    region: resolveRegion(request.region),
    ...(request.periodMode ? { periodMode: request.periodMode } : {}),
    ...(request.generationMode ? { generationMode: request.generationMode } : {}),
  });
  // Consolida todos os itens do período
  const allItems = plan.weeks.flatMap((week: any) => week.days.flatMap((day: any) => day.mealItems));
  return mergeDuplicateMealItems(allItems);
}

export async function generateMenuWithAI(request: MenuRequest): Promise<GeneratedMenu> {
  validateRequest(request);
  const region = resolveRegion(request.region);
  const multiplier = REGION_PRICE_MULTIPLIERS[region];

  // Geração determinística local
  const menu = generateDeterministicMenu(request);
  const totals = calculateTotals(menu, request.students);
  const purchaseList = generatePurchaseList(menu, request.students, request.days);
  const adjusted = applyRegionalPriceFactor(totals, purchaseList, multiplier);
  const institutional = buildInstitutionalPlan({
    students: request.students,
    days: request.days,
    region,
    ...(request.periodMode ? { periodMode: request.periodMode } : {}),
    ...(request.generationMode ? { generationMode: request.generationMode } : {}),
  });

  return {
    request: {
      ...request,
      region,
    },
    model: "deterministic-local-v1",
    menu,
    totals: adjusted.totals,
    purchaseList: adjusted.purchaseList,
    pricing: {
      region,
      multiplier,
      note: "Valores estimados com base em tabela de referência interna. Os preços reais podem variar por região, fornecedor, sazonalidade e contrato.",
    },
    institutional,
  };
}
