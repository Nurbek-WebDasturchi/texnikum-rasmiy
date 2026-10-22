import { ArrowRight, MoveDownRight } from 'lucide-react';
import { SITE } from '../data/site';

export default function Hero({ onApply }: { onApply: () => void }) {
  return (
    <section id="top" className="hero">
      <div className="hero-floaters" aria-hidden="true"><span className="float-shape float-ring" /><span className="float-shape float-square" /><span className="float-shape float-orb" /><span className="float-shape float-ring-small" /></div>
      <div className="container hero-layout">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="hero-kicker-line" /> {SITE.district} <span className="kicker-divider">/</span> Rasmiy sayt</div>
          <h1><span className="hero-title-line">Kasb egallang.</span><br /><span className="hero-title-line">Kelajak quring.</span></h1>
          <p className="hero-lead">Qiziqishingizga mos yo‘nalishni tanlang va amaliy ta’lim bilan yangi imkoniyatlar sari qadam qo‘ying.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#programs">Yo‘nalishlarni ko‘rish <ArrowRight size={17} /></a>
            <button className="hero-apply-link" onClick={onApply}>Qabulga ariza topshirish <MoveDownRight size={15} /></button>
          </div>
          <div className="hero-study-modes"><span>Ta’lim shakllari</span><div><b>9-sinf</b><i /><b>11-sinf</b><i /><b>Kunduzgi</b><i /><b>Dual</b></div></div>
        </div>
        <div className="hero-image-wrap">
          <div className="hero-image"><img src="/img/programs/computer-science.webp" alt="Kompyuter tizimlari yo‘nalishidagi dars mashg‘uloti" /></div>
          <div className="hero-image-caption"><span className="caption-line" /><div><small>Amaliy ta’lim</small><b>Bilimni ishga soling.</b></div><a href="#introduction" aria-label="Texnikum haqida"><ArrowRight size={17} /></a></div>
          <span className="hero-image-note">AMUDARYO · KASB-HUNAR TA’LIMI</span>
        </div>
      </div>
    </section>
  );
}
