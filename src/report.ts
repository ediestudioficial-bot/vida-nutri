import fs from "node:fs";
import PDFDocument from "pdfkit";

export type PDFReportData = {
  request: {
    students: number;
    days: number;
    ageGroup?: string;
    nutritionMode?: string;
  };
  totals: {
    totalCalories: number;
    totalProtein: number;
  };
  coverage: {
    calories: number;
    protein: number;
  };
  menu: Array<{ food: { name: string }; grams: number }>;
  purchaseList: {
    items: Array<{ name: string; totalKg: number }>;
  };
};

export function generatePDFReport(data: PDFReportData, filePath = "relatorio.pdf"): string {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("Relatório Nutricional", { align: "center" });

  doc.moveDown();

  doc.fontSize(12).text(`Alunos: ${data.request.students}`);
  doc.text(`Dias: ${data.request.days}`);
  doc.text(`Faixa etária: ${data.request.ageGroup ?? "fundamental"}`);
  doc.text(`Modo: ${data.request.nutritionMode ?? "padrao"}`);

  doc.moveDown();

  doc.text(`Calorias totais: ${Math.round(data.totals.totalCalories)}`);
  doc.text(`Proteína total: ${Math.round(data.totals.totalProtein)}`);

  doc.moveDown();

  doc.text(`Cobertura calórica: ${data.coverage.calories}%`);
  doc.text(`Cobertura proteica: ${data.coverage.protein}%`);

  doc.moveDown();

  doc.text("Cardápio:");
  for (const item of data.menu) {
    doc.text(`- ${item.food.name}: ${item.grams}g`);
  }

  doc.moveDown();

  doc.text("Lista de compras:");
  for (const item of data.purchaseList.items) {
    doc.text(`- ${item.name}: ${item.totalKg.toFixed(2)} kg`);
  }

  doc.end();

  return filePath;
}
