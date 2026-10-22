import { Mail, Phone } from 'lucide-react';
import staff from '../data/staff.json';
import { formatPhone } from '../lib/format';
import type { Person } from '../types';

const { leaders, kafedra, teachers } = staff as unknown as Record<'leaders' | 'kafedra' | 'teachers', Person[]>;

function PersonCard({ p }: { p: Person }) {
  return (
    <article className="card person">
      <img src={p.img} alt={p.name} loading="lazy" decoding="async" width="480" height="600" />
      <div className="person-body">
        <h3>{p.name}</h3>
        <p>{p.role}</p>
        {p.phone && <a href={`tel:${p.phone}`}><Phone size={15} />{formatPhone(p.phone)}</a>}
        {p.email && <a href={`mailto:${p.email}`}><Mail size={15} />{p.email}</a>}
      </div>
    </article>
  );
}

export default function StaffSection() {
  return (
    <section id="staff">
      <div className="container">
        <div className="section-head"><span className="eyebrow">Jamoa</span><h2>Rahbariyat</h2><p className="muted">Qabul vaqti: 09:00 – 18:00</p></div>
        <div className="people people-lead">{leaders.map((p) => <PersonCard key={p.name} p={p} />)}</div>
        <h3 className="sub">Kafedra</h3>
        <div className="people">{kafedra.map((p) => <PersonCard key={p.name} p={p} />)}</div>
        <h3 className="sub">Ustozlar</h3>
        <div className="teachers">
          {teachers.map((t) => (
            <article key={t.name} className="card teacher">
              <img src={t.img} alt="" loading="lazy" decoding="async" width="64" height="64" />
              <div><h3>{t.name}</h3><p className="muted">{t.role}</p>{t.phone && <a href={`tel:${t.phone}`}>{formatPhone(t.phone)}</a>}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
