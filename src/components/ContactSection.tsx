import { useRef, type FormEvent } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { SITE } from '../data/site';
import { formatPhone } from '../lib/format';
import { useSubmit } from '../hooks/useSubmit';

export default function ContactSection() {
  const { status, submit } = useSubmit('feedback');
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (await submit({ message: String(f.get('message')).trim(), website: String(f.get('website') ?? '') })) formRef.current?.reset();
  };
  return (
    <section id="contact" className="alt">
      <div className="container">
        <div className="section-head"><span className="eyebrow">Bog‘lanish</span><h2>Biz bilan bog‘laning</h2></div>
        <div className="contact-grid">
          <div className="stack">
            <div className="card pad">
              <ul className="info-list">
                <li><Phone size={20} /><div><b>Aloqa telefoni</b><a href={`tel:${SITE.phone}`}>{formatPhone(SITE.phone)}</a></div></li>
                <li><Mail size={20} /><div><b>E-mail</b><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div></li>
                <li><MapPin size={20} /><div><b>Manzil</b><span>{SITE.address}, {SITE.district} {SITE.name}</span></div></li>
                <li><Send size={20} /><div><b>Telegram</b><a href={SITE.telegram} target="_blank" rel="noreferrer">Rasmiy kanal</a></div></li>
              </ul>
            </div>
            <form ref={formRef} className="card pad" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="message">Fikr-mulohaza</label>
                <textarea id="message" name="message" required minLength={3} maxLength={1000} placeholder="Biz haqimizda fikringiz qanday?" />
              </div>
              <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              {status === 'ok' && <p className="msg msg-ok" role="status">Fikringiz yuborildi, rahmat!</p>}
              {status === 'error' && <p className="msg msg-err" role="alert">Yuborib bo‘lmadi. Qayta urinib ko‘ring.</p>}
              <button className="btn btn-primary" disabled={status === 'sending'}>{status === 'sending' ? 'Yuborilmoqda…' : 'Yuborish'}</button>
            </form>
          </div>
          <iframe className="map" title={`${SITE.name} xaritada`} src={SITE.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </div>
    </section>
  );
}
