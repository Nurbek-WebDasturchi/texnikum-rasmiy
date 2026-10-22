import { useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import Dialog from './Dialog';
import { useSubmit } from '../hooks/useSubmit';
import type { Program } from '../types';

export type View = { type: 'info'; program: Program } | { type: 'apply'; program?: Program };
interface Props { view: View | null; onChange: (v: View | null) => void }

function Info({ program, onApply, onClose }: { program: Program; onApply: () => void; onClose: () => void }) {
  const out: ReactNode[] = [];
  let items: string[] = [];
  const flush = () => {
    if (items.length) out.push(<ul key={`u${out.length}`}>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>);
    items = [];
  };
  program.blocks.forEach((b, i) => {
    if (b.type === 'li') return void items.push(b.text);
    flush();
    out.push(b.type === 'h' ? <h4 key={i}>{b.text}</h4> : <p key={i}>{b.text}</p>);
  });
  flush();
  return (
    <>
      <img src={program.img} alt="" width="800" height="450" />
      <div className="dialog-body">
        <div className="dialog-head"><h2>{program.title}</h2><button className="icon-btn" aria-label="Yopish" onClick={onClose}><X size={18} /></button></div>
        <div className="prose">{out}</div>
        <button className="btn btn-primary" onClick={onApply}>Ariza qoldirish</button>
      </div>
    </>
  );
}

function ApplyForm({ program, onClose }: { program?: Program; onClose: () => void }) {
  const { status, submit } = useSubmit('application');
  const [phone, setPhone] = useState('');
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    void submit({
      surname: String(f.get('surname')).trim(), name: String(f.get('name')).trim(), phone,
      program: program?.title ?? '', website: String(f.get('website') ?? ''),
    });
  };
  if (status === 'ok') {
    return (
      <div className="dialog-body done">
        <CheckCircle2 size={44} />
        <h2>Arizangiz qabul qilindi</h2>
        <p className="muted">Tez orada qabul masalasida siz bilan bog‘lanamiz.</p>
        <button className="btn btn-primary" onClick={onClose}>Yopish</button>
      </div>
    );
  }
  return (
    <form className="dialog-body" onSubmit={onSubmit}>
      <div className="dialog-head"><h2>Ariza qoldirish</h2><button type="button" className="icon-btn" aria-label="Yopish" onClick={onClose}><X size={18} /></button></div>
      {program && <p className="muted">Yo‘nalish: <b>{program.title}</b></p>}
      <p className="muted">Ism-familiya va telefon raqamingizni yuboring, biz o‘zimiz bog‘lanamiz.</p>
      <div className="field"><label htmlFor="surname">Familiya</label><input id="surname" name="surname" required maxLength={60} autoComplete="family-name" /></div>
      <div className="field"><label htmlFor="name">Ism</label><input id="name" name="name" required maxLength={60} autoComplete="given-name" /></div>
      <div className="field">
        <label htmlFor="phone">Telefon raqam</label>
        <div className="phone">
          <span>+998</span>
          <input id="phone" inputMode="numeric" autoComplete="tel-national" placeholder="90 123 45 67" required pattern="\d{9}" maxLength={9}
            title="9 ta raqam, masalan: 901234567" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
        </div>
      </div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {status === 'error' && <p className="msg msg-err" role="alert">Yuborib bo‘lmadi. Birozdan so‘ng qayta urinib ko‘ring.</p>}
      <div className="actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Bekor qilish</button>
        <button className="btn btn-primary" disabled={status === 'sending'}>{status === 'sending' ? 'Yuborilmoqda…' : 'Yuborish'}</button>
      </div>
    </form>
  );
}

export default function HomeDialog({ view, onChange }: Props) {
  const close = () => onChange(null);
  return (
    <Dialog open={!!view} onClose={close} label={view?.program?.title ?? 'Ariza qoldirish'}>
      {view?.type === 'info' && <Info program={view.program} onClose={close} onApply={() => onChange({ type: 'apply', program: view.program })} />}
      {view?.type === 'apply' && <ApplyForm program={view.program} onClose={close} />}
    </Dialog>
  );
}
