require("dotenv").config();
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
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

type PlanKey = "essencial" | "profissional" | "institucional";

interface UserSubscription {
  stripeCustomerId: string;
  subscriptionStatus:
    | "trialing"
    | "active"
    | "canceled"
    | "past_due"
    | "unpaid"
    | "incomplete";
  plan?: string;
  updatedAt: string;
}

const userSubscriptions = new Map<string, UserSubscription>();

const publicAppConfig = {
  authEnabled: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  billingEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
  stripePrices: {
    essencial: process.env.STRIPE_PRICE_ESSENTIAL ?? "",
    profissional: process.env.STRIPE_PRICE_PRO ?? "",
    institucional: process.env.STRIPE_PRICE_INSTITUTIONAL ?? "",
  },
};

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    : null;

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const planPriceMap: Record<PlanKey, string | undefined> = {
  essencial: process.env.STRIPE_PRICE_ESSENTIAL,
  profissional: process.env.STRIPE_PRICE_PRO,
  institucional: process.env.STRIPE_PRICE_INSTITUTIONAL,
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

function getBearerToken(request: IncomingMessage): string | null {
  const raw = request.headers.authorization;
  if (!raw || !raw.startsWith("Bearer ")) {
    return null;
  }
  return raw.slice("Bearer ".length).trim();
}

async function requireUser(request: IncomingMessage): Promise<{ id: string; email?: string }> {
  if (!supabase) {
    throw new AppError(
      "Autenticacao indisponivel. Configure SUPABASE_URL e SUPABASE_ANON_KEY.",
      ExitCode.Unavailable,
      "AUTH_NOT_CONFIGURED",
    );
  }

  const token = getBearerToken(request);
  if (!token) {
    throw new AppError("Token ausente.", ExitCode.Usage, "UNAUTHORIZED");
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    throw new AppError("Sessao invalida ou expirada.", ExitCode.Usage, "UNAUTHORIZED");
  }

  return {
    id: data.user.id,
    ...(data.user.email ? { email: data.user.email } : {}),
  };
}

function requireActiveSubscription(userId: string): void {
  const sub = userSubscriptions.get(userId);
  if (!sub) {
    throw new AppError("Sem assinatura. Assine um plano.", ExitCode.Usage, "NO_SUBSCRIPTION");
  }
  if (!["trialing", "active"].includes(sub.subscriptionStatus)) {
    throw new AppError(`Acesso negado. Status: ${sub.subscriptionStatus}`, ExitCode.Usage, "SUBSCRIPTION_INACTIVE");
  }
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
    const user = await requireUser(request);
    requireActiveSubscription(user.id);
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

async function handleAuthSignUp(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    if (!supabase) {
      throw new AppError(
        "Autenticacao indisponivel. Configure SUPABASE_URL e SUPABASE_ANON_KEY.",
        ExitCode.Unavailable,
        "AUTH_NOT_CONFIGURED",
      );
    }
    const body = (await parseRequestBody(request)) as Record<string, unknown>;
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      throw new AppError("Email e senha sao obrigatorios.", ExitCode.Usage, "INVALID_ARGUMENT");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new AppError(error.message, ExitCode.Usage, "AUTH_SIGNUP_FAILED");
    }

    sendJson(response, 200, {
      ok: true,
      data: {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        session: data.session
          ? {
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token,
            }
          : null,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendJson(response, mapStatusCode(error), { ok: false, error: { kind: error.kind, message: error.message } });
      return;
    }
    sendJson(response, 500, {
      ok: false,
      error: { kind: "UNEXPECTED_ERROR", message: error instanceof Error ? error.message : "Erro interno." },
    });
  }
}

async function handleAuthSignIn(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    if (!supabase) {
      throw new AppError(
        "Autenticacao indisponivel. Configure SUPABASE_URL e SUPABASE_ANON_KEY.",
        ExitCode.Unavailable,
        "AUTH_NOT_CONFIGURED",
      );
    }
    const body = (await parseRequestBody(request)) as Record<string, unknown>;
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      throw new AppError("Email e senha sao obrigatorios.", ExitCode.Usage, "INVALID_ARGUMENT");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      throw new AppError(error?.message ?? "Falha no login.", ExitCode.Usage, "AUTH_LOGIN_FAILED");
    }

    sendJson(response, 200, {
      ok: true,
      data: {
        user: { id: data.user.id, email: data.user.email },
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendJson(response, mapStatusCode(error), { ok: false, error: { kind: error.kind, message: error.message } });
      return;
    }
    sendJson(response, 500, {
      ok: false,
      error: { kind: "UNEXPECTED_ERROR", message: error instanceof Error ? error.message : "Erro interno." },
    });
  }
}

async function handleAuthMe(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    const user = await requireUser(request);
    sendJson(response, 200, { ok: true, data: { user } });
  } catch (error) {
    if (error instanceof AppError) {
      sendJson(response, mapStatusCode(error), { ok: false, error: { kind: error.kind, message: error.message } });
      return;
    }
    sendJson(response, 500, {
      ok: false,
      error: { kind: "UNEXPECTED_ERROR", message: error instanceof Error ? error.message : "Erro interno." },
    });
  }
}

async function handleCreateCheckoutSession(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    if (!stripe) {
      throw new AppError(
        "Billing indisponivel. Configure STRIPE_SECRET_KEY.",
        ExitCode.Unavailable,
        "BILLING_NOT_CONFIGURED",
      );
    }

    const user = await requireUser(request);
    const body = (await parseRequestBody(request)) as Record<string, unknown>;
    const plan = String(body.plan ?? "") as PlanKey;
    const priceId = planPriceMap[plan];

    if (!priceId) {
      throw new AppError("Plano invalido ou sem price ID configurado.", ExitCode.Usage, "INVALID_PLAN");
    }

    const baseUrl = process.env.APP_BASE_URL ?? `http://${process.env.HOST ?? "localhost"}:${process.env.PORT ?? "3000"}`;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(user.email ? { customer_email: user.email } : {}),
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: user.id,
          plan,
        },
      },
      success_url: `${baseUrl}/?checkout=success`,
      cancel_url: `${baseUrl}/?checkout=cancel`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    sendJson(response, 200, {
      ok: true,
      data: { checkoutUrl: session.url },
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendJson(response, mapStatusCode(error), { ok: false, error: { kind: error.kind, message: error.message } });
      return;
    }
    sendJson(response, 500, {
      ok: false,
      error: { kind: "UNEXPECTED_ERROR", message: error instanceof Error ? error.message : "Erro interno." },
    });
  }
}

function readRawBody(request: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    request.on("data", (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > 2_000_000) {
        reject(new Error("Payload muito grande."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    request.on("error", reject);
  });
}

async function handleWebhook(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (!stripe) {
    sendJson(response, 503, {
      ok: false,
      error: { kind: "BILLING_NOT_CONFIGURED", message: "Stripe nao configurado." },
    });
    return;
  }

  let rawBody: Buffer;
  try {
    rawBody = await readRawBody(request);
  } catch {
    sendJson(response, 400, {
      ok: false,
      error: { kind: "WEBHOOK_READ_ERROR", message: "Falha ao ler corpo da requisicao." },
    });
    return;
  }

  let event: Stripe.Event;
  try {
    const ws = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = request.headers["stripe-signature"];
    if (ws && typeof sig === "string") {
      event = stripe.webhooks.constructEvent(rawBody, sig, ws);
    } else {
      event = JSON.parse(rawBody.toString("utf8")) as Stripe.Event;
      if (!ws) {
        console.warn("[webhook] sem STRIPE_WEBHOOK_SECRET");
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha na verificacao.";
    sendJson(response, 400, {
      ok: false,
      error: { kind: "WEBHOOK_SIGNATURE_FAILED", message },
    });
    return;
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan ?? "essencial";
      const customerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
      if (userId && customerId) {
        let status: UserSubscription["subscriptionStatus"] = "trialing";
        if (typeof session.subscription === "string") {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          status = sub.status as UserSubscription["subscriptionStatus"];
        }
        userSubscriptions.set(userId, {
          stripeCustomerId: customerId,
          subscriptionStatus: status,
          plan,
          updatedAt: new Date().toISOString(),
        });
        console.log(`[webhook] checkout.completed userId=${userId} status=${status}`);
      }
    } else if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      if (userId) {
        const existing = userSubscriptions.get(userId);
        const planName = sub.metadata?.plan ?? existing?.plan ?? "essencial";
        userSubscriptions.set(userId, {
          stripeCustomerId: customerId,
          subscriptionStatus: sub.status as UserSubscription["subscriptionStatus"],
          plan: planName,
          updatedAt: new Date().toISOString(),
        });
      }
    } else if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        const existing = userSubscriptions.get(userId);
        if (existing) {
          userSubscriptions.set(userId, {
            ...existing,
            subscriptionStatus: "canceled",
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
    sendJson(response, 200, { ok: true, data: { received: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno.";
    sendJson(response, 500, {
      ok: false,
      error: { kind: "WEBHOOK_ERROR", message },
    });
  }
}

const port = Number(process.env.PORT ?? "3000");
const host = process.env.HOST ?? "localhost";

const server = http.createServer(async (request, response) => {
  const method = request.method ?? "GET";
  const requestUrl = new URL(request.url ?? "/", "http://localhost");
  const path = requestUrl.pathname;

  if (method === "GET" && path === "/") {
    sendHtml(response, WEB_UI_HTML);
    return;
  }

  if (method === "GET" && path === "/api/config") {
    sendJson(response, 200, { ok: true, data: publicAppConfig });
    return;
  }

  if (method === "POST" && path === "/api/auth/sign-up") {
    await handleAuthSignUp(request, response);
    return;
  }

  if (method === "POST" && path === "/api/auth/sign-in") {
    await handleAuthSignIn(request, response);
    return;
  }

  if (method === "GET" && path === "/api/auth/me") {
    await handleAuthMe(request, response);
    return;
  }

  if (method === "POST" && path === "/api/billing/checkout") {
    await handleCreateCheckoutSession(request, response);
    return;
  }

  if (method === "POST" && path === "/api/webhook") {
    await handleWebhook(request, response);
    return;
  }

  if (method === "POST" && path === "/api/generate") {
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
