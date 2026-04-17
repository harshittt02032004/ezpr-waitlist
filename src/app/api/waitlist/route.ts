import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Waitlist } from "@/models/Waitlist";
import { parseWaitlistInput } from "@/lib/validation";
import { sendToCrm } from "@/lib/crm";
import { sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const parsed = parseWaitlistInput(body);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, 400);

  const { name, phone, email } = parsed.data;

  try {
    await connectToDatabase();
  } catch (err) {
    console.error("[waitlist] db connect failed:", err);
    return json({ ok: false, error: "Database unavailable" }, 503);
  }

  const existing = await Waitlist.findOne({ email }).lean();
  if (existing) {
    return json(
      { ok: false, error: "This email is already on the waitlist" },
      409
    );
  }

  let entryId: string;
  try {
    const entry = await Waitlist.create({ name, phone, email });
    entryId = String(entry._id);
  } catch (err) {
    console.error("[waitlist] db save failed:", err);
    return json({ ok: false, error: "Failed to save submission" }, 500);
  }

  const [crmResult, emailResult] = await Promise.all([
    sendToCrm({ name, email, phone }),
    sendWelcomeEmail(email, name),
  ]);

  if (!crmResult.ok) console.error("[waitlist] crm failed:", crmResult.error);
  if (!emailResult.ok)
    console.error("[waitlist] email failed:", emailResult.error);

  return json({
    ok: true,
    id: entryId,
    crm: crmResult.ok,
    email: emailResult.ok,
  });
}
