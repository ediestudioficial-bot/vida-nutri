
import {
  adjustMenuToTargets,
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
import { generatePDFReport } from "./report";

export type AgeGroup = "infantil" | "fundamental" | "medio";

const DAILY_REFERENCE_BY_AGE: Record<AgeGroup, { calories: number; protein: number }> = {
  infantil: { calories: 1300, protein: 20 },
  fundamental: { calories: 1800, protein: 35 },
  medio: { calories: 2200, protein: 50 },
};

export type SchoolProfile = "basico" | "intermediario" | "avancado";
export type NutritionMode = "padrao" | "pnae";

export type { Region, PeriodMode, GenerationMode };

export type MenuRequest = {
  students: number;
  days: number;
  calories: number;
  protein: number;
  region?: Region;
  periodMode?: PeriodMode;
  generationMode?: GenerationMode;
  schoolProfile?: SchoolProfile;
  nutritionMode?: NutritionMode;
  ageGroup?: AgeGroup;
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
  coverage: {
    calories: number;
    protein: number;
  };
  purchaseList: ReturnType<typeof generatePurchaseList>;
  pricing: PricingContext;
  institutional: InstitutionalPlan;
};

function calculateNutritionalCoverage(
  totals: ReturnType<typeof calculateTotals>,
  ageGroup: AgeGroup = "fundamental",
): {
  calories: number;
  protein: number;
} {
  const reference = DAILY_REFERENCE_BY_AGE[ageGroup];

  const caloriesPerStudent = totals.totalCalories / totals.students;
  const proteinPerStudent = totals.totalProtein / totals.students;

  const calorieCoverage = (caloriesPerStudent / reference.calories) * 100;
  const proteinCoverage = (proteinPerStudent / reference.protein) * 100;

  return {
    calories: Math.round(calorieCoverage),
    protein: Math.round(proteinCoverage),
  };
}

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

  if (request.schoolProfile && !["basico", "intermediario", "avancado"].includes(request.schoolProfile)) {
    throw new AppError("schoolProfile invalido.", ExitCode.Usage, "INVALID_ARGUMENT");
  }

  if (request.nutritionMode && !["padrao", "pnae"].includes(request.nutritionMode)) {
    throw new AppError("nutritionMode invalido.", ExitCode.Usage, "INVALID_ARGUMENT");
  }

  if (request.ageGroup && !["infantil", "fundamental", "medio"].includes(request.ageGroup)) {
    throw new AppError("ageGroup invalido.", ExitCode.Usage, "INVALID_ARGUMENT");
  }
}

function resolveRegion(region: MenuRequest["region"]): Region {
  if (region && Object.hasOwn(REGION_PRICE_MULTIPLIERS, region)) {
    return region;
  }
  return "Centro-Oeste";
}

type MenuGenerationContext = {
  region: Region;
  schoolProfile: SchoolProfile;
};

function applyContextAdjustments(mealItems: MealItem[], context: MenuGenerationContext): MealItem[] {
  const adjusted = JSON.parse(JSON.stringify(mealItems)) as MealItem[];

  for (const item of adjusted) {
    const name = item.food.name.toLowerCase();

    if (context.region === "Norte" && name.includes("frango")) {
      const fish = adjusted.find((i) => i.food.name.toLowerCase().includes("sardinha"));
      if (fish) {
        item.food = fish.food;
      }
    }

    if (context.schoolProfile === "basico") {
      if (item.food.category === "cereais_e_bases") {
        item.grams += 20;
      }
    }

    if (context.schoolProfile === "avancado") {
      if (item.food.category === "hortalicas") {
        item.grams += 20;
      }
    }
  }

  return adjusted;
}

function applyPNAERules(mealItems: MealItem[]): MealItem[] {
  const adjusted = JSON.parse(JSON.stringify(mealItems)) as MealItem[];

  let vegetableCount = 0;

  for (const item of adjusted) {
    if (item.food.category === "hortalicas") {
      vegetableCount += 1;
      item.grams = Math.max(item.grams, 50);
    }

    if (item.food.category === "temperos_e_insumos") {
      item.grams = Math.min(item.grams, 10);
    }
  }

  if (vegetableCount === 0) {
    const veg = adjusted.find((i) => i.food.category === "hortalicas");
    if (veg) {
      veg.grams += 50;
    }
  }

  return adjusted;
}

function applySmartConstraints(mealItems: MealItem[]): MealItem[] {
  const adjusted = JSON.parse(JSON.stringify(mealItems)) as MealItem[];

  let hasProtein = false;
  let hasBase = false;
  let hasVegetable = false;

  for (const item of adjusted) {
    const category = item.food.category;

    if (category === "proteinas") {
      hasProtein = true;
    }
    if (category === "cereais_e_bases") {
      hasBase = true;
    }
    if (category === "hortalicas") {
      hasVegetable = true;
    }

    if (category === "temperos_e_insumos") {
      item.grams = Math.min(item.grams, 10);
    }

    item.grams = Math.max(item.grams, 5);
  }

  if (!hasProtein) {
    const proteinItem = adjusted.find((i) => i.food.name.toLowerCase().includes("frango"));
    if (proteinItem) {
      proteinItem.grams += 50;
    }
  }

  if (!hasBase) {
    const baseItem = adjusted.find((i) => i.food.name.toLowerCase().includes("arroz"));
    if (baseItem) {
      baseItem.grams += 50;
    }
  }

  if (!hasVegetable) {
    const vegItem = adjusted.find((i) => i.food.category === "hortalicas");
    if (vegItem) {
      vegItem.grams += 30;
    }
  }

  return adjusted;
}

function applyDailyVariation(plan: InstitutionalPlan): InstitutionalPlan {
  const proteinOptions = ["frango", "carne", "ovo", "sardinha"];
  const baseOptions = ["arroz", "macarrao", "macarrão"];

  let proteinIndex = 0;
  let baseIndex = 0;

  for (const week of plan.weeks) {
    for (const day of week.days) {
      for (const item of day.mealItems) {
        const name = item.food.name.toLowerCase();

        if (item.food.category === "proteinas") {
          const target = proteinOptions[proteinIndex % proteinOptions.length] ?? "frango";
          if (!name.includes(target)) {
            const replacement = day.mealItems.find((i) => i.food.name.toLowerCase().includes(target));
            if (replacement) {
              item.food = replacement.food;
            }
          }
          proteinIndex += 1;
        }

        if (item.food.category === "cereais_e_bases") {
          const target = baseOptions[baseIndex % baseOptions.length] ?? "arroz";
          if (!name.includes(target)) {
            const replacement = day.mealItems.find((i) => i.food.name.toLowerCase().includes(target));
            if (replacement) {
              item.food = replacement.food;
            }
          }
          baseIndex += 1;
        }
      }
    }
  }

  return plan;
}

function generateDeterministicMenu(request: MenuRequest): MealItem[] {
  // Gera um cardápio determinístico alternando preparações do PREPARATION_LIBRARY
  // e consolidando os itens para o período solicitado.
  // Não há mais dependência de IA externa: toda a lógica é local, estável e previsível.
  let plan = buildInstitutionalPlan({
    students: request.students,
    days: request.days,
    region: resolveRegion(request.region),
    ...(request.periodMode ? { periodMode: request.periodMode } : {}),
    ...(request.generationMode ? { generationMode: request.generationMode } : {}),
  });
  plan = applyDailyVariation(plan);
  // Consolida todos os itens do período
  const allItems = plan.weeks.flatMap((week: any) => week.days.flatMap((day: any) => day.mealItems));
  return mergeDuplicateMealItems(allItems);
}

export async function generateMenuWithAI(request: MenuRequest): Promise<GeneratedMenu> {
  validateRequest(request);
  const region = resolveRegion(request.region);
  const multiplier = REGION_PRICE_MULTIPLIERS[region];

  // Geração determinística local
  const baseMenu = generateDeterministicMenu(request);
  let adjusted = adjustMenuToTargets(baseMenu, request.calories, request.protein);

  adjusted = applyContextAdjustments(adjusted, {
    region,
    schoolProfile: request.schoolProfile ?? "intermediario",
  });

  if (request.nutritionMode === "pnae") {
    adjusted = applyPNAERules(adjusted);
  }

  const menu = applySmartConstraints(adjusted);
  const totals = calculateTotals(menu, request.students);
  const coverage = calculateNutritionalCoverage(totals, request.ageGroup ?? "fundamental");
  const purchaseList = generatePurchaseList(menu, request.students, request.days);
  const institutional = buildInstitutionalPlan({
    students: request.students,
    days: request.days,
    region,
    ...(request.periodMode ? { periodMode: request.periodMode } : {}),
    ...(request.generationMode ? { generationMode: request.generationMode } : {}),
  });

  try {
    generatePDFReport({
      request: {
        students: request.students,
        days: request.days,
        ...(request.ageGroup !== undefined ? { ageGroup: request.ageGroup } : {}),
        ...(request.nutritionMode !== undefined ? { nutritionMode: request.nutritionMode } : {}),
      },
      totals,
      coverage,
      menu,
      purchaseList,
    });
  } catch {
    // PDF opcional: falha na escrita do arquivo não bloqueia a resposta da API.
  }

  return {
    request: {
      ...request,
      region,
    },
    model: "deterministic-local-v1",
    menu,
    totals,
    coverage,
    purchaseList,
    pricing: {
      region,
      multiplier,
      note: "Custos neutralizados no fluxo principal; multiplicador regional mantido apenas como referência.",
    },
    institutional,
  };
}
