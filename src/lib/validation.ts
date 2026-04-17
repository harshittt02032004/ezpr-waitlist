export type WaitlistInput = { name: string; phone: string; email: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

export function parseWaitlistInput(
  body: unknown
): { ok: true; data: WaitlistInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }

  const raw = body as Record<string, unknown>;
  const name = sanitize(raw.name).slice(0, 120);
  const phone = sanitize(raw.phone).slice(0, 40);
  const email = sanitize(raw.email).slice(0, 200).toLowerCase();

  if (name.length < 2) return { ok: false, error: "Name is required" };
  if (!PHONE_RE.test(phone)) return { ok: false, error: "Invalid phone number" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Invalid email address" };

  return { ok: true, data: { name, phone, email } };
}
