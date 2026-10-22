import { useState } from 'react';
import { Menu, Moon, Phone, Sun, X } from 'lucide-react';
import { NAV, SITE } from '../data/site';
import { useScrollSpy } from '../hooks/useScrollSpy';
import type { Theme } from '../hooks/useTheme';
import { formatPhone } from '../lib/format';

const IDS = NAV.map((n) => n.id);

export default function Header({ onApply, theme, onToggleTheme }: { onApply: () => void; theme: Theme; onToggleTheme: () => void }) {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(IDS);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <div className="container header-in">
        <a className="brand" href="#top" onClick={close}>
          <img src="/img/logo.png" alt={`${SITE.name} logotipi`} width="54" height="54" />
          <span><b>{SITE.name}</b><small>{SITE.district} · Qoraqalpog‘iston Respublikasi</small></span>
        </a>
        <button className="icon-btn menu-btn" aria-label="Menyu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav id="nav" className={`nav${open ? ' open' : ''}`}>
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? 'page' : undefined} onClick={close}>{n.label}</a>
          ))}
          <a className="nav-phone" href={`tel:${SITE.phone}`}><Phone size={16} /><span>{formatPhone(SITE.phone)}</span></a>
          <button className="theme-toggle" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘i rejimga o‘tish'} title={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}<span>{theme === 'dark' ? 'Yorug‘' : 'Qorong‘i'}</span></button>
          <button className="btn btn-primary btn-sm" onClick={() => { close(); onApply(); }}>Qabulga ariza <span aria-hidden="true">↗</span></button>
        </nav>
      </div>
    </header>
  );
}
