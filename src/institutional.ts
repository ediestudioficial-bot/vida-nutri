import {
  calculateTotals,
  findFoodInCatalog,
  generatePurchaseList,
  mergeDuplicateMealItems,
  normalizeFoodName,
  type MealItem,
  type PurchaseList,
} from "./engine";
import { REGION_PRICE_MULTIPLIERS, type Region } from "./pricing";

export type PeriodMode = "semanal" | "quinzenal" | "mensal";
export type GenerationMode = "cardapio" | "cautela" | "cotacao" | "completo";

export type DailyPreparation = {
  title: string;
  items: Array<{ foodName: string; grams: number }>;
};

export type PeriodDayPlan = {
  dayIndex: number;
  weekdayLabel: string;
  preparation: string;
  mealItems: MealItem[];
  totals: ReturnType<typeof calculateTotals>;
};

export type PeriodWeekPlan = {
  weekNumber: number;
  days: PeriodDayPlan[];
};

export type TechnicalSheetRow = {
  dayIndex: number;
  preparation: string;
  foodName: string;
  perCapitaGrams: number;
  calories: number;
  protein: number;
};

export type CautelaRow = {
  genero: string;
  categoria: string;
  perCapitaReferencia: number;
  alunos: number;
  unidadeTipo: string;
  quantidadeConsolidada: number;
  estimativaPorKg: number;
  estimativaTotal: number;
};

export type InstitutionalPlan = {
  mode: PeriodMode;
  generationMode: GenerationMode;
  weeks: PeriodWeekPlan[];
  technicalSheet: TechnicalSheetRow[];
  cautela: {
    rows: CautelaRow[];
    grandTotal: number;
    purchaseList: PurchaseList;
  };
};

const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const PREPARATION_LIBRARY: readonly DailyPreparation[] = [
  {
    title: "Arroz, feijão, frango, legumes e banana",
    items: [
      { foodName: "Arroz branco", grams: 100 },
      { foodName: "Feijão", grams: 80 },
      { foodName: "Peito de frango", grams: 90 },
      { foodName: "Legumes cozidos", grams: 60 },
      { foodName: "Banana", grams: 70 },
      { foodName: "Óleo de soja", grams: 6 },
      { foodName: "Sal refinado", grams: 1 },
      { foodName: "Cebola", grams: 8 },
      { foodName: "Alho", grams: 2 },
      { foodName: "Colorífico", grams: 1 },
    ],
  },
  {
    title: "Macarrão com carne moída, salada e suco",
    items: [
      { foodName: "Macarrão espaguete", grams: 110 },
      { foodName: "Carne moída", grams: 85 },
      { foodName: "Extrato de tomate", grams: 15 },
      { foodName: "Salada crua", grams: 50 },
      { foodName: "Suco concentrado", grams: 20 },
      { foodName: "Açúcar", grams: 7 },
      { foodName: "Óleo de soja", grams: 6 },
      { foodName: "Sal refinado", grams: 1 },
      { foodName: "Cebola", grams: 10 },
      { foodName: "Alho", grams: 2 },
    ],
  },
  {
    title: "Sopa com massa, legumes, charque e pão",
    items: [
      { foodName: "Massa para sopa", grams: 70 },
      { foodName: "Batata", grams: 70 },
      { foodName: "Cenoura", grams: 40 },
      { foodName: "Seleta de legumes", grams: 45 },
      { foodName: "Charque", grams: 50 },
      { foodName: "Pão integral", grams: 45 },
      { foodName: "Óleo de soja", grams: 5 },
      { foodName: "Sal refinado", grams: 1 },
      { foodName: "Cebola", grams: 9 },
      { foodName: "Alho", grams: 2 },
    ],
  },
  {
    title: "Mingau lácteo com biscoito",
    items: [
      { foodName: "Leite em pó", grams: 24 },
      { foodName: "Farinha láctea", grams: 35 },
      { foodName: "Açúcar", grams: 6 },
      { foodName: "Biscoito rosquinha", grams: 28 },
      { foodName: "Achocolatado", grams: 6 },
    ],
  },
  {
    title: "Arroz, feijão, sardinha, seleta de legumes e maçã",
    items: [
      { foodName: "Arroz branco", grams: 95 },
      { foodName: "Feijão", grams: 80 },
      { foodName: "Sardinha em lata", grams: 75 },
      { foodName: "Seleta de legumes", grams: 55 },
      { foodName: "Maçã", grams: 70 },
      { foodName: "Óleo de soja", grams: 4 },
      { foodName: "Sal refinado", grams: 1 },
      { foodName: "Cebola", grams: 8 },
      { foodName: "Alho", grams: 2 },
    ],
  },
  {
    title: "Cuscuz de milharina com salsicha ao molho",
    items: [
      { foodName: "Milharina", grams: 85 },
      { foodName: "Salsicha", grams: 75 },
      { foodName: "Extrato de tomate", grams: 14 },
      { foodName: "Leite de coco", grams: 8 },
      { foodName: "Azeite de dendê", grams: 3 },
      { foodName: "Vinagre", grams: 2 },
      { foodName: "Cominho em pó", grams: 1 },
      { foodName: "Sal refinado", grams: 1 },
      { foodName: "Cebola", grams: 8 },
      { foodName: "Alho", grams: 2 },
    ],
  },
  {
    title: "Biscoito cream cracker com leite achocolatado",
    items: [
      { foodName: "Biscoito cream cracker", grams: 30 },
      { foodName: "Leite em pó", grams: 22 },
      { foodName: "Achocolatado", grams: 8 },
      { foodName: "Açúcar", grams: 5 },
      { foodName: "Bolacha maria", grams: 12 },
    ],
  },
  {
    title: "Tapioca enriquecida e creme de leite leve",
    items: [
      { foodName: "Farinha de tapioca", grams: 70 },
      { foodName: "Leite em pó", grams: 16 },
      { foodName: "Creme de leite", grams: 14 },
      { foodName: "Açúcar", grams: 5 },
      { foodName: "Banana", grams: 50 },
    ],
  },
];

function resolvePeriodDays(mode: PeriodMode, requestedDays: number): number {
  if (mode === "semanal") {
    return Math.max(5, Math.min(requestedDays, 7));
  }
  if (mode === "quinzenal") {
    return Math.max(10, Math.min(requestedDays, 15));
  }
  return Math.max(20, Math.min(requestedDays, 23));
}

function inferPeriodMode(requestedDays: number, explicitMode?: PeriodMode): PeriodMode {
  if (explicitMode) {
    return explicitMode;
  }
  if (requestedDays <= 7) {
    return "semanal";
  }
  if (requestedDays <= 15) {
    return "quinzenal";
  }
  return "mensal";
}

function toMealItems(items: DailyPreparation["items"]): MealItem[] {
  const mealItems: MealItem[] = [];
  for (const item of items) {
    const food = findFoodInCatalog(item.foodName);
    if (!food) {
      continue;
    }
    mealItems.push({ food, grams: item.grams });
  }
  return mergeDuplicateMealItems(mealItems);
}

function buildDailyPlan(students: number, index: number, prep: DailyPreparation): PeriodDayPlan {
  const mealItems = toMealItems(prep.items);
  return {
    dayIndex: index + 1,
    weekdayLabel: WEEKDAYS[index % WEEKDAYS.length] ?? "Dia",
    preparation: prep.title,
    mealItems,
    totals: calculateTotals(mealItems, students),
  };
}

function buildWeeks(days: PeriodDayPlan[]): PeriodWeekPlan[] {
  const weeks: PeriodWeekPlan[] = [];
  for (let i = 0; i < days.length; i += 5) {
    weeks.push({
      weekNumber: Math.floor(i / 5) + 1,
      days: days.slice(i, i + 5),
    });
  }
  return weeks;
}

function buildTechnicalSheet(days: PeriodDayPlan[]): TechnicalSheetRow[] {
  const rows: TechnicalSheetRow[] = [];
  for (const day of days) {
    for (const item of day.mealItems) {
      const factor = item.grams / 100;
      rows.push({
        dayIndex: day.dayIndex,
        preparation: day.preparation,
        foodName: item.food.name,
        perCapitaGrams: item.grams,
        calories: item.food.calories * factor,
        protein: item.food.protein * factor,
      });
    }
  }
  return rows;
}

function applyRegionalCost(list: PurchaseList, region: Region): PurchaseList {
  const multiplier = REGION_PRICE_MULTIPLIERS[region];
  const items = list.items.map((item) => ({
    ...item,
    costPerKg: item.costPerKg * multiplier,
    totalCost: item.totalCost * multiplier,
  }));

  return {
    ...list,
    items,
    grandTotalCost: items.reduce((acc, item) => acc + item.totalCost, 0),
  };
}

function buildCautela(days: PeriodDayPlan[], students: number, region: Region) {
  const allItems = days.flatMap((day) => day.mealItems);
  const merged = mergeDuplicateMealItems(allItems);
  const purchaseList = applyRegionalCost(generatePurchaseList(merged, students, days.length), region);

  const perCapitaMap = new Map<string, { total: number; count: number }>();
  for (const day of days) {
    for (const item of day.mealItems) {
      const key = normalizeFoodName(item.food.name);
      const prev = perCapitaMap.get(key);
      if (prev) {
        prev.total += item.grams;
        prev.count += 1;
      } else {
        perCapitaMap.set(key, { total: item.grams, count: 1 });
      }
    }
  }

  const rows: CautelaRow[] = purchaseList.items.map((item) => {
    const key = normalizeFoodName(item.name);
    const stats = perCapitaMap.get(key);
    const avgPerCapita = stats ? stats.total / stats.count : 0;

    return {
      genero: item.name,
      categoria: item.category ?? "geral",
      perCapitaReferencia: avgPerCapita,
      alunos: students,
      unidadeTipo: item.unit ?? "kg",
      quantidadeConsolidada: item.totalKg,
      estimativaPorKg: item.costPerKg,
      estimativaTotal: item.totalCost,
    };
  });

  rows.sort((a, b) => a.genero.localeCompare(b.genero, "pt-BR"));

  return {
    rows,
    grandTotal: rows.reduce((acc, row) => acc + row.estimativaTotal, 0),
    purchaseList,
  };
}

export function buildInstitutionalPlan(input: {
  students: number;
  days: number;
  region: Region;
  periodMode?: PeriodMode;
  generationMode?: GenerationMode;
}): InstitutionalPlan {
  const mode = inferPeriodMode(input.days, input.periodMode);
  const generationMode = input.generationMode ?? "completo";
  const totalDays = resolvePeriodDays(mode, input.days);

  const days: PeriodDayPlan[] = [];
  for (let index = 0; index < totalDays; index += 1) {
    const prep = PREPARATION_LIBRARY[index % PREPARATION_LIBRARY.length];
    if (!prep) {
      continue;
    }
    days.push(buildDailyPlan(input.students, index, prep));
  }

  return {
    mode,
    generationMode,
    weeks: buildWeeks(days),
    technicalSheet: buildTechnicalSheet(days),
    cautela: buildCautela(days, input.students, input.region),
  };
}
