type CrmContact = {
  name: string;
  email: string;
  phone: string;
};

export type CrmResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

export async function sendToCrm(contact: CrmContact): Promise<CrmResult> {
  const token = process.env.CRM_API_TOKEN;
  const endpoint =
    process.env.CRM_API_URL ??
    "https://api.hubapi.com/crm/v3/objects/contacts";

  if (!token) {
    return { ok: false, error: "CRM_API_TOKEN not configured" };
  }

  const [firstname, ...rest] = contact.name.trim().split(/\s+/);
  const lastname = rest.join(" ");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        properties: {
          email: contact.email,
          firstname,
          lastname,
          phone: contact.phone,
          lifecyclestage: "lead",
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        error: `CRM responded ${res.status}: ${body.slice(0, 200)}`,
      };
    }

    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown CRM error";
    return { ok: false, error: message };
  }
}
