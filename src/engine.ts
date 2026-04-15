export type FoodCategory =
  | "cereais_e_bases"
  | "leguminosas"
  | "proteinas"
  | "hortalicas"
  | "frutas"
  | "laticinios"
  | "panificados"
  | "farinaceos"
  | "industrializados"
  | "temperos_e_insumos";

export type Food = {
  name: string;
  calories: number; // kcal por 100g
  protein: number; // g por 100g
  carbs: number; // g por 100g
  fat: number; // g por 100g
  cost: number; // custo por kg
  category: FoodCategory;
  unit?: "kg" | "lata" | "caixa";
};

export type FoodCatalogItem = Food & {
  aliases?: readonly string[];
};

export type MealItem = {
  food: Food;
  grams: number;
};

export type MealTotals = {
  students: number;
  totalGrams: number;
  gramsPerStudent: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalMealCost: number;
  costPerStudent: number;
};

export type PurchaseListItem = {
  name: string;
  totalKg: number;
  costPerKg: number;
  totalCost: number;
  category?: FoodCategory;
  unit?: Food["unit"];
};

export type PurchaseList = {
  students: number;
  days: number;
  items: PurchaseListItem[];
  grandTotalCost: number;
};

export const foodCatalog: readonly FoodCatalogItem[] = [
  { name: "Arroz branco", aliases: ["Arroz"], calories: 130, protein: 2.7, carbs: 28, fat: 0.3, cost: 6.5, category: "cereais_e_bases" },
  { name: "Feijão", aliases: ["Feijao"], calories: 76, protein: 4.8, carbs: 13.6, fat: 0.5, cost: 9.8, category: "leguminosas" },
  { name: "Macarrão espaguete", aliases: ["Macarrão", "Macarrao", "Espaguete"], calories: 158, protein: 5.8, carbs: 31, fat: 0.9, cost: 8.4, category: "cereais_e_bases" },
  { name: "Massa para sopa", aliases: ["Massa pra sopa"], calories: 160, protein: 5.5, carbs: 32, fat: 1.0, cost: 8.7, category: "cereais_e_bases" },
  { name: "Milharina", calories: 360, protein: 7.0, carbs: 79, fat: 1.5, cost: 7.6, category: "farinaceos" },
  { name: "Farinha de tapioca", calories: 336, protein: 0.2, carbs: 84, fat: 0.1, cost: 10.2, category: "farinaceos" },
  { name: "Trigo sem fermento", aliases: ["Farinha de trigo"], calories: 364, protein: 10.0, carbs: 76, fat: 1.0, cost: 6.9, category: "farinaceos" },
  { name: "Pão integral", aliases: ["Pao integral", "Pão"], calories: 247, protein: 13, carbs: 41, fat: 4.2, cost: 12.5, category: "panificados" },
  { name: "Peito de frango", aliases: ["Frango desfiado", "Frango"], calories: 165, protein: 31, carbs: 0, fat: 3.6, cost: 18.9, category: "proteinas" },
  { name: "Carne moída", aliases: ["Carne moida"], calories: 250, protein: 26, carbs: 0, fat: 15, cost: 32, category: "proteinas" },
  { name: "Charque", calories: 250, protein: 30, carbs: 0, fat: 14, cost: 41, category: "proteinas" },
  { name: "Sardinha em lata", aliases: ["Sardinha"], calories: 208, protein: 24, carbs: 0, fat: 12, cost: 26, category: "proteinas", unit: "lata" },
  { name: "Salsicha", calories: 270, protein: 11, carbs: 4, fat: 24, cost: 19, category: "proteinas" },
  { name: "Ovo cozido", calories: 155, protein: 13, carbs: 1.1, fat: 11, cost: 14, category: "proteinas" },
  { name: "Leite em pó", aliases: ["Leite em po"], calories: 496, protein: 25, carbs: 38, fat: 26, cost: 34, category: "laticinios" },
  { name: "Farinha láctea", aliases: ["Farinha lactea"], calories: 384, protein: 8.5, carbs: 79, fat: 2.5, cost: 19, category: "industrializados" },
  { name: "Creme de leite", calories: 206, protein: 2.1, carbs: 3.0, fat: 20, cost: 18, category: "laticinios", unit: "caixa" },
  { name: "Achocolatado", calories: 370, protein: 4.5, carbs: 84, fat: 2.5, cost: 17, category: "industrializados" },
  { name: "Suco concentrado", calories: 120, protein: 0.5, carbs: 30, fat: 0, cost: 13, category: "industrializados" },
  { name: "Biscoito rosquinha", calories: 430, protein: 7, carbs: 72, fat: 13, cost: 14, category: "industrializados" },
  { name: "Biscoito cream cracker", calories: 430, protein: 9, carbs: 70, fat: 12, cost: 15.5, category: "industrializados" },
  { name: "Bolacha maria", calories: 420, protein: 7, carbs: 74, fat: 11, cost: 14.9, category: "industrializados" },
  { name: "Açúcar", aliases: ["Acucar"], calories: 387, protein: 0, carbs: 100, fat: 0, cost: 4.9, category: "temperos_e_insumos" },
  { name: "Óleo de soja", aliases: ["Oleo de soja"], calories: 884, protein: 0, carbs: 0, fat: 100, cost: 7.4, category: "temperos_e_insumos" },
  { name: "Extrato de tomate", calories: 82, protein: 4, carbs: 19, fat: 0.5, cost: 12.8, category: "temperos_e_insumos" },
  { name: "Leite de coco", calories: 230, protein: 2.2, carbs: 6, fat: 24, cost: 16.5, category: "temperos_e_insumos" },
  { name: "Azeite de dendê", aliases: ["Azeite de dende"], calories: 900, protein: 0, carbs: 0, fat: 100, cost: 21, category: "temperos_e_insumos" },
  { name: "Vinagre", calories: 18, protein: 0, carbs: 0.1, fat: 0, cost: 4.2, category: "temperos_e_insumos" },
  { name: "Colorífico", aliases: ["Colorifico"], calories: 350, protein: 12, carbs: 55, fat: 10, cost: 15.2, category: "temperos_e_insumos" },
  { name: "Cominho em pó", aliases: ["Cominho em po"], calories: 375, protein: 18, carbs: 44, fat: 22, cost: 34, category: "temperos_e_insumos" },
  { name: "Sal refinado", aliases: ["Sal"], calories: 0, protein: 0, carbs: 0, fat: 0, cost: 2.4, category: "temperos_e_insumos" },
  { name: "Cebola", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, cost: 6.2, category: "hortalicas" },
  { name: "Alho", calories: 149, protein: 6.4, carbs: 33, fat: 0.5, cost: 24, category: "hortalicas" },
  { name: "Cenoura", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, cost: 6.8, category: "hortalicas" },
  { name: "Batata", calories: 77, protein: 2, carbs: 17, fat: 0.1, cost: 6.4, category: "hortalicas" },
  { name: "Legumes cozidos", calories: 35, protein: 2, carbs: 7, fat: 0.2, cost: 7.2, category: "hortalicas" },
  { name: "Seleta de legumes", calories: 60, protein: 2.2, carbs: 10, fat: 1.2, cost: 11, category: "hortalicas" },
  { name: "Salada crua", calories: 20, protein: 1.2, carbs: 4, fat: 0.2, cost: 5.5, category: "hortalicas" },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, cost: 6.9, category: "frutas" },
  { name: "Maçã", aliases: ["Maca"], calories: 52, protein: 0.3, carbs: 14, fat: 0.2, cost: 8.5, category: "frutas" },
] as const;

const foodIndex = new Map<string, FoodCatalogItem>();

for (const item of foodCatalog) {
  for (const alias of [item.name, ...(item.aliases ?? [])]) {
    const key = normalizeFoodName(alias);
    const existing = foodIndex.get(key);
    if (existing && existing !== item) {
      throw new Error(`Duplicidade no catálogo de alimentos: ${alias}`);
    }
    foodIndex.set(key, item);
  }
}

function assertFiniteNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} deve ser um numero finito.`);
  }
}

function assertPositiveInteger(value: unknown, label: string): asserts value is number {
  assertFiniteNumber(value, label);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} deve ser um inteiro maior que zero.`);
  }
}

function assertFoodShape(food: unknown): asserts food is Food {
  if (!food || typeof food !== "object") {
    throw new Error("Alimento invalido.");
  }

  const candidate = food as Food;
  if (typeof candidate.name !== "string" || candidate.name.trim() === "") {
    throw new Error("O nome do alimento deve ser uma string nao vazia.");
  }

  if (typeof candidate.category !== "string" || candidate.category.trim() === "") {
    throw new Error(`Categoria invalida para ${candidate.name}.`);
  }

  assertFiniteNumber(candidate.calories, `Calorias de ${candidate.name}`);
  assertFiniteNumber(candidate.protein, `Proteina de ${candidate.name}`);
  assertFiniteNumber(candidate.carbs, `Carboidratos de ${candidate.name}`);
  assertFiniteNumber(candidate.fat, `Gordura de ${candidate.name}`);
  assertFiniteNumber(candidate.cost, `Custo de ${candidate.name}`);

  if (
    candidate.calories < 0 ||
    candidate.protein < 0 ||
    candidate.carbs < 0 ||
    candidate.fat < 0 ||
    candidate.cost < 0
  ) {
    throw new Error(`Os valores nutricionais de ${candidate.name} devem ser positivos.`);
  }
}

function assertMealItem(item: MealItem, index: number): void {
  assertFoodShape(item.food);
  assertFiniteNumber(item.grams, `Gramas do item ${index + 1}`);

  if (!Number.isInteger(item.grams) || item.grams <= 0) {
    throw new Error(`Gramas invalidas no item ${index + 1}.`);
  }
}

export function normalizeFoodName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function findFoodInCatalog(name: string): FoodCatalogItem | undefined {
  return foodIndex.get(normalizeFoodName(name));
}

export function mergeDuplicateMealItems(mealItems: MealItem[]): MealItem[] {
  const consolidated = new Map<string, MealItem>();

  mealItems.forEach((item, index) => {
    assertMealItem(item, index);
    const key = normalizeFoodName(item.food.name);
    const existing = consolidated.get(key);

    if (existing) {
      existing.grams += item.grams;
      return;
    }

    consolidated.set(key, { food: item.food, grams: item.grams });
  });

  return Array.from(consolidated.values());
}

/**
 * Escala as porções (gramas) para aproximar calorias e proteína por aluno
 * aos alvos, mantendo proporções com mínimos quadrados em um único fator.
 */
export function adjustMenuToTargets(
  mealItems: MealItem[],
  targetCaloriesPerStudent: number,
  targetProteinPerStudent: number,
): MealItem[] {
  assertFiniteNumber(targetCaloriesPerStudent, "targetCaloriesPerStudent");
  assertFiniteNumber(targetProteinPerStudent, "targetProteinPerStudent");

  if (targetCaloriesPerStudent <= 0 || targetProteinPerStudent <= 0) {
    throw new Error("Metas de calorias e proteina devem ser maiores que zero.");
  }

  const base = mergeDuplicateMealItems(mealItems);
  let calories = 0;
  let protein = 0;

  for (const item of base) {
    const factor = item.grams / 100;
    calories += item.food.calories * factor;
    protein += item.food.protein * factor;
  }

  const denom = calories * calories + protein * protein;
  if (denom < 1e-12) {
    return base;
  }

  const alpha = (targetCaloriesPerStudent * calories + targetProteinPerStudent * protein) / denom;
  if (!Number.isFinite(alpha) || alpha <= 0) {
    return base;
  }

  const scaled = base.map((item) => ({
    food: item.food,
    grams: Math.max(1, Math.round(item.grams * alpha)),
  }));

  return mergeDuplicateMealItems(scaled);
}

export function calculateTotals(mealItems: MealItem[], students: number): MealTotals {
  assertPositiveInteger(students, "O numero de alunos");

  const normalizedItems = mergeDuplicateMealItems(mealItems);

  const totals = normalizedItems.reduce(
    (accumulator, item) => {
      const factor = item.grams / 100;

      accumulator.totalGrams += item.grams;
      accumulator.totalCalories += item.food.calories * factor;
      accumulator.totalProtein += item.food.protein * factor;
      accumulator.totalCarbs += item.food.carbs * factor;
      accumulator.totalFat += item.food.fat * factor;
      accumulator.totalMealCost += 0;

      return accumulator;
    },
    {
      totalGrams: 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalMealCost: 0,
    },
  );

  return {
    students,
    totalGrams: totals.totalGrams * students,
    gramsPerStudent: totals.totalGrams,
    totalCalories: totals.totalCalories * students,
    totalProtein: totals.totalProtein * students,
    totalCarbs: totals.totalCarbs * students,
    totalFat: totals.totalFat * students,
    totalMealCost: totals.totalMealCost * students,
    costPerStudent: totals.totalMealCost,
  };
}

export function generateSimpleMenu(): MealItem[] {
  const rice = findFoodInCatalog("Arroz branco");
  const beans = findFoodInCatalog("Feijão");
  const chicken = findFoodInCatalog("Peito de frango");

  if (!rice || !beans || !chicken) {
    throw new Error("Catalogo local incompleto.");
  }

  return [
    { food: rice, grams: 120 },
    { food: beans, grams: 90 },
    { food: chicken, grams: 100 },
  ];
}

export function generatePurchaseList(mealItems: MealItem[], students: number, days: number): PurchaseList {
  assertPositiveInteger(students, "O numero de alunos");
  assertPositiveInteger(days, "O numero de dias");

  const normalizedItems = mergeDuplicateMealItems(mealItems);
  const consolidated = new Map<string, PurchaseListItem>();

  for (const item of normalizedItems) {
    const totalKg = (item.grams * students * days) / 1000;
    const totalCost = 0;
    const key = normalizeFoodName(item.food.name);
    const existing = consolidated.get(key);

    if (existing) {
      existing.totalKg += totalKg;
      existing.totalCost += totalCost;
      continue;
    }

    consolidated.set(key, {
      name: item.food.name,
      totalKg,
      costPerKg: 0,
      totalCost,
      category: item.food.category,
      unit: item.food.unit,
    });
  }

  const items = Array.from(consolidated.values()).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const grandTotalCost = 0;

  return {
    students,
    days,
    items,
    grandTotalCost,
  };
}
