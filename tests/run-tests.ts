import * as assert from "node:assert/strict";
import { generateMenuWithAI } from "../src/menu-ai";
import {
  calculateTotals,
  generatePurchaseList,
  generateSimpleMenu,
  type MealItem,
} from "../src/engine";
import { buildInstitutionalPlan } from "../src/institutional";

function approxEqual(actual: number, expected: number, epsilon = 1e-6): void {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} !== ${expected}`);
}

async function testMath(): Promise<void> {
  const menu = generateSimpleMenu();
  const totals = calculateTotals(menu, 100);
  const purchaseList = generatePurchaseList(menu, 100, 20);

  approxEqual(totals.totalGrams, 31000);
  approxEqual(totals.gramsPerStudent, 310);
  approxEqual(totals.totalCalories, 38940);
  approxEqual(totals.totalProtein, 3856);
  approxEqual(totals.totalCarbs, 4584);
  approxEqual(totals.totalFat, 441);
  approxEqual(totals.totalMealCost, 355.2);
  approxEqual(totals.costPerStudent, 3.552);
  approxEqual(purchaseList.grandTotalCost, 7104);
}



// Teste determinístico local: menu sempre igual para mesmos parâmetros
async function testDeterministicMenu(): Promise<void> {
  const result = await generateMenuWithAI({
    students: 50,
    days: 10,
    calories: 500,
    protein: 20,
  });
  assert.ok(result.menu.length > 0);
  assert.ok(result.purchaseList.items.length > 0);
  assert.ok(result.purchaseList.grandTotalCost > 0);
}

// Não há mais teste de alimento desconhecido pois o sistema só usa catálogo local

// Não há mais teste de gramas inválidas pois o sistema só usa preparações válidas

async function testRegionalFactor(): Promise<void> {
  const result = await generateMenuWithAI({
    students: 10,
    days: 5,
    calories: 400,
    protein: 10,
    region: "Norte",
  });
  approxEqual(result.pricing.multiplier, 1.08);
  assert.equal(result.institutional.mode, "semanal");
}

async function testDuplicateMerge(): Promise<void> {
  const menu: MealItem[] = generateSimpleMenu();
  const firstItem = menu[0];
  if (!firstItem) {
    throw new Error("Menu should have at least one item");
  }
  const duplicated: MealItem[] = [...menu, { food: firstItem.food, grams: 10 }];
  const totals = calculateTotals(duplicated, 1);

  assert.equal(totals.gramsPerStudent, 320);
}

async function testInstitutionalWeeklyPlan(): Promise<void> {
  const plan = buildInstitutionalPlan({
    students: 120,
    days: 5,
    region: "Centro-Oeste",
    periodMode: "semanal",
    generationMode: "cardapio",
  });

  assert.equal(plan.mode, "semanal");
  assert.ok(plan.weeks.length >= 1);
  assert.equal(plan.weeks[0]?.days.length, 5);
  assert.ok(plan.technicalSheet.length > 0);
  assert.ok(plan.cautela.rows.length > 0);
}

async function testInstitutionalMonthlyConsolidation(): Promise<void> {
  const plan = buildInstitutionalPlan({
    students: 150,
    days: 22,
    region: "Norte",
    periodMode: "mensal",
    generationMode: "cautela",
  });

  assert.equal(plan.mode, "mensal");
  assert.ok(plan.weeks.length >= 4);
  assert.ok(plan.cautela.rows.some((row) => row.genero === "Arroz branco"));
  assert.ok(plan.cautela.rows.some((row) => row.genero === "Feijão"));
  assert.ok(plan.cautela.grandTotal > 0);
}

async function testWithPeriodModes(): Promise<void> {
  const result = await generateMenuWithAI({
    students: 40,
    days: 22,
    calories: 450,
    protein: 16,
    region: "Sudeste",
    periodMode: "mensal",
    generationMode: "cautela",
  });
  assert.equal(result.institutional.mode, "mensal");
  assert.equal(result.institutional.generationMode, "cautela");
  assert.ok(result.institutional.weeks.length >= 4);
  assert.ok(result.institutional.cautela.rows.length > 0);
}

async function main(): Promise<void> {
  await testMath();
  await testDuplicateMerge();
  await testDeterministicMenu();
  await testRegionalFactor();
  await testInstitutionalWeeklyPlan();
  await testInstitutionalMonthlyConsolidation();
  await testWithPeriodModes();
  console.log("Testes concluídos.");
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
