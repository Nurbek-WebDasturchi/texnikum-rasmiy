const json = (body: unknown, status = 200) => Response.json(body, { status });
const SYSTEM_PROMPT = `Siz Amudaryo tumani 1-sonli kasb-hunar texnikumining Gemini yordamchisisiz. Faqat o‘zbek tilida sodda, xushmuomala javob bering. Texnikum yo‘nalishlari, qabul va aloqa haqidagi savollarga yordam bering. Aniq bilmagan ma’lumotni to‘qimang; foydalanuvchini saytning tegishli bo‘limiga yoki +998 97 357 08 87 raqamiga yo‘naltiring. Maxfiy ma’lumot so‘ramang. Javoblarni qisqa tuting.`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: 'not_configured' }, 503);

  const body = await req.json().catch(() => null) as { messages?: unknown } | null;
  const messages = Array.isArray(body?.messages) ? body.messages.slice(-8) : [];
  const contents = messages.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const item = entry as { role?: unknown; content?: unknown };
    if ((item.role !== 'user' && item.role !== 'assistant') || typeof item.content !== 'string') return [];
    const text = item.content.trim().slice(0, 500);
    if (!text) return [];
    return [{ role: item.role === 'assistant' ? 'model' : 'user', parts: [{ text }] }];
  });
  if (!contents.length || contents[contents.length - 1].role !== 'user') return json({ error: 'invalid' }, 400);

  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 350 },
      }),
    });
    if (!response.ok) return json({ error: 'upstream_error' }, 502);
    const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();
    return reply ? json({ reply }) : json({ error: 'empty_reply' }, 502);
  } catch {
    return json({ error: 'upstream_error' }, 502);
  }
}
