import { ArrowRight, BookOpenCheck, ClipboardList, GraduationCap } from 'lucide-react';
import { SITE } from '../data/site';

const highlights = [
  { icon: BookOpenCheck, title: 'Yo‘nalishlar bilan tanishing', text: '9- va 11-sinf bitiruvchilari uchun mavjud kasblar ro‘yxatini ko‘ring.' },
  { icon: GraduationCap, title: 'Ta’lim shaklini tanlang', text: 'Kunduzgi va dual ta’lim yo‘nalishlarini o‘zaro solishtiring.' },
  { icon: ClipboardList, title: 'Ariza qoldiring', text: 'Ism va telefon raqamingizni yuboring — qabul bo‘yicha siz bilan bog‘lanamiz.' },
];

export default function IntroductionSection({ onApply }: { onApply: () => void }) {
  return (
    <section id="introduction" className="intro-section">
      <div className="container intro-layout">
        <div className="intro-heading"><span className="eyebrow">Texnikum haqida</span><h2>{SITE.district}da kasb tanlang.</h2><p className="muted">1-sonli kasb-hunar texnikumi haqida, qabul va ta’lim yo‘nalishlari bo‘yicha kerakli ma’lumotlar bir sahifada.</p><a className="text-link" href="#contact">Aloqa ma’lumotlari <ArrowRight size={17} /></a></div>
        <div className="intro-points">{highlights.map(({ icon: Icon, title, text }, i) => <article className="intro-point" key={title}><span className="intro-icon"><Icon size={20} /></span><div><span className="point-index">0{i + 1}</span><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </div>
      <div className="container intro-banner"><span className="banner-mark"><ClipboardList size={19} /></span><p><b>Qabul bo‘yicha savolingiz bormi?</b><span>Ariza shaklini to‘ldiring, texnikum xodimi siz bilan bog‘lanadi.</span></p><button onClick={onApply}>Ariza qoldirish <ArrowRight size={15} /></button></div>
    </section>
  );
}
