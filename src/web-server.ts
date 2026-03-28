import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { generateMenuWithAI, type MenuRequest } from "./menu-ai";
import { AppError, ExitCode } from "./errors";
import { WEB_UI_HTML } from "./web-ui";

type ErrorResponse = {
  ok: false;
  error: {
    kind: string;
    message: string;
  };
};

type SuccessResponse = {
  ok: true;
  data: unknown;
};

function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: ErrorResponse | SuccessResponse,
): void {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendHtml(response: ServerResponse, html: string): void {
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(html);
}

function parseRequestBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    request.on("data", (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > 1_000_000) {
        reject(new AppError("Payload muito grande.", ExitCode.Usage, "PAYLOAD_TOO_LARGE"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw) as unknown);
      } catch {
        reject(new AppError("JSON invalido no corpo da requisicao.", ExitCode.Usage, "INVALID_JSON"));
      }
    });

    request.on("error", () => {
      reject(new AppError("Falha ao ler requisicao.", ExitCode.Software, "REQUEST_READ_ERROR"));
    });
  });
}

function toMenuRequest(payload: unknown): MenuRequest {
  if (!payload || typeof payload !== "object") {
    throw new AppError("Corpo da requisicao invalido.", ExitCode.Usage, "INVALID_ARGUMENT");
  }

  const body = payload as Record<string, unknown>;
  const request: MenuRequest = {
    students: Number(body.students),
    days: Number(body.days),
    calories: Number(body.calories),
    protein: Number(body.protein),
  };

  if (typeof body.region === "string") {
    request.region = body.region as Exclude<MenuRequest["region"], undefined>;
  }
  if (typeof body.periodMode === "string") {
    request.periodMode = body.periodMode as Exclude<MenuRequest["periodMode"], undefined>;
  }
  if (typeof body.generationMode === "string") {
    request.generationMode = body.generationMode as Exclude<MenuRequest["generationMode"], undefined>;
  }

  return request;
}

function mapStatusCode(error: AppError): number {
  if (error.exitCode === ExitCode.Unavailable) {
    return 503;
  }
  if (error.exitCode === ExitCode.DataError) {
    return 422;
  }
  if (error.exitCode === ExitCode.Usage) {
    return 400;
  }
  return 500;
}

async function handleGenerate(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  try {
    const body = await parseRequestBody(request);
    const menuRequest = toMenuRequest(body);
    const data = await generateMenuWithAI(menuRequest);
    sendJson(response, 200, { ok: true, data });
  } catch (error) {
    if (error instanceof AppError) {
      sendJson(response, mapStatusCode(error), {
        ok: false,
        error: {
          kind: error.kind,
          message: error.message,
        },
      });
      return;
    }

    const message = error instanceof Error ? error.message : "Erro interno inesperado.";
    sendJson(response, 500, {
      ok: false,
      error: {
        kind: "UNEXPECTED_ERROR",
        message,
      },
    });
  }
}

const port = Number(process.env.PORT ?? "3000");
const host = process.env.HOST ?? "localhost";

const server = http.createServer(async (request, response) => {
  const method = request.method ?? "GET";
  const url = request.url ?? "/";

  if (method === "GET" && url === "/") {
    sendHtml(response, WEB_UI_HTML);
    return;
  }

  if (method === "POST" && url === "/api/generate") {
    await handleGenerate(request, response);
    return;
  }

  sendJson(response, 404, {
    ok: false,
    error: {
      kind: "NOT_FOUND",
      message: "Rota nao encontrada.",
    },
  });
});

server.listen(port, host, () => {
  console.log(`Servidor web vida-nutri em http://${host}:${port}`);
});
