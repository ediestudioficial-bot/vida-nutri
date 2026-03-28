import { generateMenuWithAI, type MenuRequest } from "./menu-ai";
import { AppError, ExitCode } from "./errors";

function formatNumber(value: number, fractionDigits = 2): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function printUsage(): void {
  console.error(
    "Uso: npm run ai:menu -- --students <alunos> --days <dias> --calories <kcal> --protein <g> [--region <regiao>] [--periodMode semanal|quinzenal|mensal] [--generationMode cardapio|cautela|cotacao|completo]",
  );
}

function parseArgs(argv: string[]): MenuRequest {
  const positional: string[] = [];
  const flags = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (typeof arg !== "string") {
      continue;
    }

    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }

    const [flagName, inlineValue] = arg.slice(2).split("=", 2);
    if (typeof flagName !== "string" || flagName.length === 0) {
      throw new AppError("Nome de flag invalido.", ExitCode.Usage, "INVALID_ARGUMENT");
    }
    const nextArg = argv[index + 1];
    const value = inlineValue ?? nextArg;

    if (!inlineValue) {
      if (typeof value !== "string" || value.startsWith("--")) {
        throw new AppError(`Valor ausente para --${flagName}.`, ExitCode.Usage, "INVALID_ARGUMENT");
      }

      index += 1;
    }

    if (typeof value !== "string") {
      throw new AppError(`Valor ausente para --${flagName}.`, ExitCode.Usage, "INVALID_ARGUMENT");
    }

    const resolvedValue: string = value;
    flags.set(flagName, resolvedValue);
  }

  const ordered = ["students", "days", "calories", "protein"];
  for (const [index, name] of ordered.entries()) {
    if (!flags.has(name) && positional[index]) {
      flags.set(name, positional[index]);
    }
  }

  const students = Number(flags.get("students"));
  const days = Number(flags.get("days"));
  const calories = Number(flags.get("calories"));
  const protein = Number(flags.get("protein"));
  const region = flags.get("region");
  const periodMode = flags.get("periodMode");
  const generationMode = flags.get("generationMode");

  if ([students, days, calories, protein].some((value) => Number.isNaN(value))) {
    throw new AppError("Parametros invalidos ou incompletos.", ExitCode.Usage, "INVALID_ARGUMENT");
  }

  const request: MenuRequest = { students, days, calories, protein };
  if (typeof region === "string") {
    request.region = region as Exclude<MenuRequest["region"], undefined>;
  }
  if (typeof periodMode === "string") {
    request.periodMode = periodMode as Exclude<MenuRequest["periodMode"], undefined>;
  }
  if (typeof generationMode === "string") {
    request.generationMode = generationMode as Exclude<MenuRequest["generationMode"], undefined>;
  }

  return request;
}

async function main(): Promise<void> {
  let request: MenuRequest;

  try {
    request = parseArgs(process.argv.slice(2));
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error.message);
      printUsage();
      process.exitCode = error.exitCode;
      return;
    }

    throw error;
  }

  try {
    const result = await generateMenuWithAI(request);

    console.log("CARDAPIO GERADO COM IA");
    console.log("=".repeat(28));
    console.log(`Alunos: ${result.request.students}`);
    console.log(`Dias: ${result.request.days}`);
    console.log(`Meta por aluno: ${formatNumber(result.request.calories)} kcal e ${formatNumber(result.request.protein)} g de proteina`);
    console.log(`Regiao: ${result.pricing.region} (fator ${formatNumber(result.pricing.multiplier)})`);
    console.log(`Modelo: ${result.model}`);

    console.log("\nCARDAPIO");
    result.menu.forEach((item, index) => {
      const kcal = item.food.calories * (item.grams / 100);
      const protein = item.food.protein * (item.grams / 100);

      console.log(
        `${index + 1}. ${item.food.name}: ${item.grams} g/aluno | ` +
          `${formatNumber(kcal)} kcal | ${formatNumber(protein)} g prot`,
      );
    });

    console.log("\nTOTAIS");
    console.log(`Per capita total: ${formatNumber(result.totals.gramsPerStudent)} g/aluno`);
    console.log(`Quantidade total servida: ${formatNumber(result.totals.totalGrams / 1000)} kg`);
    console.log(`Calorias totais: ${formatNumber(result.totals.totalCalories)} kcal`);
    console.log(`Proteina total: ${formatNumber(result.totals.totalProtein)} g`);
    console.log(`Carboidratos totais: ${formatNumber(result.totals.totalCarbs)} g`);
    console.log(`Gordura total: ${formatNumber(result.totals.totalFat)} g`);
    console.log(`Estimativa de custo diario: R$ ${formatNumber(result.totals.totalMealCost)}`);
    console.log(`Custo estimado por aluno: R$ ${formatNumber(result.totals.costPerStudent)}`);

    console.log(`\nPEDIDO DE COMPRA / SOLICITACAO DE COTACAO PARA ${result.request.days} DIAS`);
    result.purchaseList.items.forEach((item) => {
      console.log(
        `- ${item.name}: ${formatNumber(item.totalKg)} kg | ` +
          `R$ ${formatNumber(item.costPerKg)}/kg | Estimativa: R$ ${formatNumber(item.totalCost)}`,
      );
    });
    console.log(`Estimativa de custo do periodo: R$ ${formatNumber(result.purchaseList.grandTotalCost)}`);
    console.log(result.pricing.note);
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error.message);
      process.exitCode = error.exitCode;
      return;
    }

    const message = error instanceof Error ? error.message : "Falha inesperada.";
    console.error(message);
    process.exitCode = ExitCode.Software;
  }
}

void main();
