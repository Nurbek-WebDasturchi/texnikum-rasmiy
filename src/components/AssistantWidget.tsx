import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Bot, MessageCircle, Sparkles, X } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };
const QUICK_PROMPTS = ['Qaysi yo‘nalishlar bor?', 'Qanday ariza topshiraman?', 'Manzilingiz qayerda?'];
const localAnswer = (question: string) => {
  const q = question.toLocaleLowerCase();
  if (/yo.nalish|kasb|o.qish|ta.lim/.test(q)) return 'Yo‘nalishlar bo‘limida 9-sinf kunduzgi hamda 11-sinf dual ta’lim yo‘nalishlarini ko‘rishingiz mumkin. Har bir yo‘nalish kartasini ochib, batafsil ma’lumot oling.';
  if (/ariza|qabul|hujjat|topshir/.test(q)) return '“Onlayn ariza” tugmasini bosing, ism-familiya va telefon raqamingizni qoldiring. Qabul bo‘yicha mas’ul xodim siz bilan bog‘lanadi.';
  if (/manzil|qayer|aloqa|telefon/.test(q)) return 'Texnikum manzili: Qipchoq SHFY, Olchazor ko‘chasi 27-uy, Amudaryo tumani. Telefon: +998 97 357 08 87. Aloqa bo‘limida xaritani ham ko‘rishingiz mumkin.';
  if (/telegram/.test(q)) return 'Rasmiy Telegram kanalimiz: t.me/texnikum1amudaryo. Boshqa savollar uchun aloqa bo‘limidagi telefon raqamiga murojaat qiling.';
  return 'Savolingiz uchun rahmat. Yo‘nalishlar va qabul bo‘yicha ma’lumotni saytdan topishingiz mumkin yoki aloqa bo‘limi orqali texnikumga murojaat qiling.';
};

export default function AssistantWidget({ onApply }: { onApply: () => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Qanday yordam beraman, hurmatli foydalanuvchi?' }]);
  const endRef = useRef<HTMLDivElement>(null);
  const openedManually = useRef(false);
  useEffect(() => {
    if (sessionStorage.getItem('assistant-greeting-shown')) return;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('assistant-greeting-shown', '1');
      if (!openedManually.current) setOpen(true);
    }, 10_000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy, open]);
  const ask = async (raw: string) => {
    const content = raw.trim();
    if (!content || busy) return;
    const history = [...messages, { role: 'user' as const, content }];
    setMessages(history); setInput(''); setBusy(true);
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8) }) });
      if (!response.ok) throw new Error('Assistant API not configured');
      const data = await response.json() as { reply?: string };
      if (!data.reply) throw new Error('Empty reply');
      setMessages((current) => [...current, { role: 'assistant', content: data.reply! }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: `Gemini hozir javob bera olmadi. ${localAnswer(content)}` }]);
    } finally { setBusy(false); }
  };
  const submit = (event: FormEvent) => { event.preventDefault(); void ask(input); };
  const toggle = () => {
    openedManually.current = true;
    sessionStorage.setItem('assistant-greeting-shown', '1');
    setOpen((value) => !value);
  };
  return (
    <div className="assistant-root">
      {open && <section className="assistant-panel" aria-label="AI yordamchi">
        <header className="assistant-head"><span className="assistant-avatar"><Bot size={20} /></span><div><b>Texnikum yordamchisi</b><small><span className="status-dot" /> Gemini AI</small></div><button className="assistant-close" onClick={() => setOpen(false)} aria-label="Yopish"><X size={18} /></button></header>
        <div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <div key={index} className={`chat-row ${message.role}`}><div className="chat-bubble">{message.content}</div></div>)}{busy && <div className="chat-row assistant"><div className="chat-bubble typing"><i /><i /><i /></div></div>}<div ref={endRef} /></div>
        {messages.length === 1 && <div className="quick-prompts">{QUICK_PROMPTS.map((prompt) => <button key={prompt} onClick={() => void ask(prompt)}>{prompt}</button>)}<button className="quick-apply" onClick={() => { setOpen(false); onApply(); }}>Onlayn ariza topshirish ↗</button></div>}
        <form className="assistant-form" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Savolingizni yozing…" aria-label="Savolingiz" maxLength={500} /><button aria-label="Yuborish" disabled={busy || !input.trim()}><ArrowUp size={18} /></button></form>
        <p className="assistant-note"><Sparkles size={12} /> AI yordamchi · Javoblarni tekshirib oling</p>
      </section>}
      <button className={`assistant-launch${open ? ' is-open' : ''}`} onClick={toggle} aria-label={open ? 'Yordamchini yopish' : 'AI yordamchini ochish'} aria-expanded={open}>{open ? <X size={22} /> : <><MessageCircle size={21} /><span>AI yordamchi</span><Sparkles size={14} className="launch-spark" /></>}</button>
    </div>
  );
}
