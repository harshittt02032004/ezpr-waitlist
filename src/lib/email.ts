import nodemailer, { Transporter } from "nodemailer";

export type EmailResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendWelcomeEmail(to: string, name: string): Promise<EmailResult> {
  const t = getTransporter();
  if (!t) return { ok: false, error: "SMTP not configured" };

  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER!;
  const firstName = name.split(/\s+/)[0] || "there";

  try {
    const info = await t.sendMail({
      from,
      to,
      subject: "You're on the Waitlist 🎉",
      text: `Hi ${firstName},\n\nThanks for joining our waitlist. We'll contact you soon.\n\n— EZPR`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#111;">
          <h1 style="font-size:22px;margin:0 0 16px;">You're on the Waitlist 🎉</h1>
          <p style="font-size:15px;line-height:1.6;color:#333;">Hi ${firstName},</p>
          <p style="font-size:15px;line-height:1.6;color:#333;">
            Thanks for joining our waitlist. We'll contact you soon.
          </p>
          <p style="font-size:13px;color:#888;margin-top:32px;">— EZPR</p>
        </div>
      `,
    });

    return { ok: true, messageId: info.messageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown email error";
    return { ok: false, error: message };
  }
}
