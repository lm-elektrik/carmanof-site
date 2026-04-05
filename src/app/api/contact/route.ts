import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const requestStore = new Map<string, number[]>();

type ContactRequestBody = {
  name?: string;
  phone?: string;
  consentAccepted?: boolean;
  source?: string;
  company?: string;
};

type AppsScriptResponse = {
  ok?: boolean;
  error?: string;
};

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = requestStore.get(ip) || [];
  const freshTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (freshTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestStore.set(ip, freshTimestamps);
    return true;
  }

  freshTimestamps.push(now);
  requestStore.set(ip, freshTimestamps);

  return false;
}

function normalizePhone(rawPhone: string) {
  const digitsOnly = rawPhone.replace(/\D/g, "");

  if (
    digitsOnly.length === 11 &&
    (digitsOnly.startsWith("7") || digitsOnly.startsWith("8"))
  ) {
    return digitsOnly.slice(1);
  }

  if (digitsOnly.length === 10) {
    return digitsOnly;
  }

  return "";
}

function isPhoneObviouslyFake(phoneDigits: string) {
  if (phoneDigits.length !== 10) return true;

  if (/^(\d)\1{9}$/.test(phoneDigits)) return true;

  if (phoneDigits.startsWith("0")) return true;

  if (
    phoneDigits === "1234567890" ||
    phoneDigits === "0123456789" ||
    phoneDigits === "9876543210"
  ) {
    return true;
  }

  return false;
}

function getMoscowDateTime() {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Неверный формат запроса." },
        { status: 415 },
      );
    }

    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Слишком много запросов. Попробуйте позже." },
        { status: 429 },
      );
    }

    const body = (await request.json()) as ContactRequestBody;

    const name = (body.name || "").trim();
    const source = (body.source || "").trim();
    const company = (body.company || "").trim();
    const consentAccepted = body.consentAccepted === true;
    const normalizedPhone = normalizePhone(body.phone || "");

    if (company) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!consentAccepted) {
      return NextResponse.json(
        { ok: false, error: "Требуется согласие на обработку данных." },
        { status: 400 },
      );
    }

    if (!normalizedPhone || isPhoneObviouslyFake(normalizedPhone)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный номер телефона." },
        { status: 400 },
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        { ok: false, error: "Слишком длинное имя." },
        { status: 400 },
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_WEB_APP_URL?.trim();
    const sharedSecret = process.env.CONTACT_FORM_SECRET?.trim();

    if (!scriptUrl || !sharedSecret) {
      console.error("Contact form env variables are not configured.");

      return NextResponse.json(
        { ok: false, error: "Сервис временно недоступен." },
        { status: 500 },
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const upstreamResponse = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submittedAt: getMoscowDateTime(),
          name: name || "",
          phone: `+7${normalizedPhone}`,
          source: source || "unknown",
          secret: sharedSecret,
        }),
        signal: controller.signal,
        cache: "no-store",
      });

      const responseText = await upstreamResponse.text();
      let result: AppsScriptResponse | null = null;

      try {
        result = JSON.parse(responseText) as AppsScriptResponse;
      } catch {
        console.error("Apps Script returned non-JSON response:", responseText);

        return NextResponse.json(
          { ok: false, error: "Некорректный ответ сервиса заявок." },
          { status: 502 },
        );
      }

      if (!upstreamResponse.ok || !result?.ok) {
        console.error(
          "Apps Script logical error:",
          result?.error || responseText,
        );

        return NextResponse.json(
          { ok: false, error: "Не удалось отправить заявку." },
          { status: 502 },
        );
      }
    } finally {
      clearTimeout(timeoutId);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form submission failed:", error);

    return NextResponse.json(
      { ok: false, error: "Внутренняя ошибка сервера." },
      { status: 500 },
    );
  }
}
