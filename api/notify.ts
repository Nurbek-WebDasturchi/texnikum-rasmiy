// Vercel serverless funksiya: Telegram tokenlari brauzerga chiqmaydi, faqat serverda turadi.
const TOKENS = { application: process.env.TELEGRAM_APPLICATION_TOKEN, feedback: process.env.TELEGRAM_FEEDBACK_TOKEN };
const json = (body: unknown, status = 200) => Response.json(body, { status });
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json({ error: 'bad_request' }, 400);
  if (body.website) return json({ ok: true }); // honeypot: botlar to'ldiradi

  const kind = body.kind === 'application' || body.kind === 'feedback' ? body.kind : null;
  const token = kind ? TOKENS[kind] : undefined;
  const chats = (process.env.TELEGRAM_CHAT_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!kind || !token || !chats.length) return json({ error: 'not_configured' }, 500);

  let text: string;
  if (kind === 'application') {
    const surname = clean(body.surname, 60), name = clean(body.name, 60), phone = clean(body.phone, 9), program = clean(body.program, 120);
    if (!surname || !name || !/^\d{9}$/.test(phone)) return json({ error: 'invalid' }, 400);
    text = `Yangi ariza\nFamilya: ${surname}\nIsm: ${name}\nTelefon: +998${phone}${program ? `\nYo‘nalish: ${program}` : ''}`;
  } else {
    const message = clean(body.message, 1000);
    if (message.length < 3) return json({ error: 'invalid' }, 400);
    text = `Foydalanuvchi fikri:\n${message}`;
  }

  const results = await Promise.allSettled(
    chats.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text }),
      }).then((r) => { if (!r.ok) throw new Error(String(r.status)); }),
    ),
  );
  return results.some((r) => r.status === 'fulfilled') ? json({ ok: true }) : json({ error: 'delivery_failed' }, 502);
}
