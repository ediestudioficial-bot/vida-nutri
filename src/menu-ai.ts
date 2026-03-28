import {
  calculateTotals,
  foodCatalog,
  findFoodInCatalog,
  generatePurchaseList,
  mergeDuplicateMealItems,
  type MealItem,
} from "./engine";
import { AppError, ExitCode } from "./errors";
import {
  buildInstitutionalPlan,
  type GenerationMode,
  type InstitutionalPlan,
  type PeriodMode,
} from "./institutional";
import { REGION_PRICE_MULTIPLIERS, type Region } from "./pricing";

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

type AiMenuPlan = {
  items: Array<{
    foodName: string;
    grams: number;
  }>;
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

function buildCatalogPrompt(): string {
  const foods = foodCatalog.map((food) => {
    return `${food.name}: ${food.calories} kcal, ${food.protein} g prot, ${food.carbs} g carb, ${food.fat} g gord, R$ ${food.cost}/kg`;
  });

  return ["Catalogo local permitido:", ...foods].join("\n");
}

function extractResponseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new Error("Resposta invalida do Google Gemini.");
  }

  const response = payload as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const outputText = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!outputText) {
    throw new Error("A resposta do Gemini nao trouxe texto estruturado.");
  }

  return outputText.replace(/^```json/i, "").replace(/```$/i, "").trim();
}

function validateAiPlan(payload: unknown): AiMenuPlan {
  if (!payload || typeof payload !== "object") {
    throw new AppError("A IA retornou um JSON invalido.", ExitCode.DataError, "INVALID_AI_OUTPUT");
  }

  const candidate = payload as Partial<AiMenuPlan>;
  if (!Array.isArray(candidate.items) || candidate.items.length === 0) {
    throw new AppError("A IA precisa retornar ao menos um item de cardapio.", ExitCode.DataError, "INVALID_AI_OUTPUT");
  }

  return {
    items: candidate.items.map((item, index) => {
      if (!item || typeof item !== "object") {
        throw new AppError(`Item ${index + 1} invalido no retorno da IA.`, ExitCode.DataError, "INVALID_AI_OUTPUT");
      }

      const foodName = (item as { foodName?: unknown }).foodName;
      const grams = (item as { grams?: unknown }).grams;

      if (typeof foodName !== "string" || foodName.trim() === "") {
        throw new AppError(`Item ${index + 1} sem foodName valido.`, ExitCode.DataError, "INVALID_AI_OUTPUT");
      }

      if (typeof grams !== "number" || !Number.isFinite(grams) || !Number.isInteger(grams) || grams <= 0 || grams > 1000) {
        throw new AppError(`Gramas invalidas no item ${index + 1}.`, ExitCode.DataError, "INVALID_AI_OUTPUT");
      }

      const food = findFoodInCatalog(foodName);
      if (!food) {
        throw new AppError(`Alimento desconhecido na IA: ${foodName}`, ExitCode.DataError, "UNKNOWN_FOOD");
      }

      return {
        foodName: food.name,
        grams,
      };
    }),
  };
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = "AIzaSyChXPcv_hCis8sJICC37sel7jP0SQoxbA0";
  const model = "gemini-1.5-flash";

  let response: Response;

  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompt}\n\nIMPORTANTE: Responda APENAS com o JSON puro, sem markdown ou explicacoes. Siga rigorosamente o catalogo local.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    });
  } catch {
    throw new AppError("Falha ao conectar com o Google Gemini.", ExitCode.Unavailable, "GEMINI_REQUEST_FAILED");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = payload?.error?.message || `Falha na chamada Gemini (${response.status}).`;
    throw new AppError(errorMsg, ExitCode.Unavailable, "GEMINI_REQUEST_FAILED");
  }

  try {
    return extractResponseText(payload);
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(error.message, ExitCode.DataError, "INVALID_GEMINI_RESPONSE");
    }
    throw error;
  }
}

function buildInstitutional(request: MenuRequest, region: Region): InstitutionalPlan {
  const input: {
    students: number;
    days: number;
    region: Region;
    periodMode?: PeriodMode;
    generationMode?: GenerationMode;
  } = {
    students: request.students,
    days: request.days,
    region,
  };

  if (request.periodMode) {
    input.periodMode = request.periodMode;
  }
  if (request.generationMode) {
    input.generationMode = request.generationMode;
  }

  return buildInstitutionalPlan(input);
}

export async function generateMenuWithAI(request: MenuRequest): Promise<GeneratedMenu> {
  validateRequest(request);
  const region = resolveRegion(request.region);
  const multiplier = REGION_PRICE_MULTIPLIERS[region];

  const prompt = [
    `Planeje um cardapio diario para ${request.students} alunos durante ${request.days} dias.`,
    `Meta por aluno por dia: ${request.calories} kcal e ${request.protein} g de proteina.`,
    "Retorne somente os itens do cardapio por dia em gramas por aluno.",
    "Nao use alimentos fora do catalogo.",
    "Se precisar repetir um alimento, pode repetir; o sistema vai consolidar depois.",
    buildCatalogPrompt(),
  ].join("\n\n");

  const rawText = await callGemini(prompt);
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawText) as unknown;
  } catch {
    throw new AppError("A IA retornou texto que nao e JSON valido.", ExitCode.DataError, "INVALID_AI_OUTPUT");
  }

  const parsed = validateAiPlan(parsedJson);

  const mealItems = mergeDuplicateMealItems(
    parsed.items.map((item) => {
      const food = findFoodInCatalog(item.foodName);
      if (!food) {
        throw new AppError(`Alimento desconhecido na IA: ${item.foodName}`, ExitCode.DataError, "UNKNOWN_FOOD");
      }

      return {
        food,
        grams: item.grams,
      };
    }),
  );

  const totals = calculateTotals(mealItems, request.students);
  const purchaseList = generatePurchaseList(mealItems, request.students, request.days);
  const adjusted = applyRegionalPriceFactor(totals, purchaseList, multiplier);
  const institutional = buildInstitutional(request, region);

  return {
    request: {
      ...request,
      region,
    },
    model: "gemini-1.5-flash",
    menu: mealItems,
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
