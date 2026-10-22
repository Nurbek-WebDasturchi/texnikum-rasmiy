import { useState } from 'react';
import groups from '../data/programs.json';
import type { Program, ProgramGroup } from '../types';

const GROUPS = groups as unknown as ProgramGroup[];

export default function ProgramsSection({ onOpen }: { onOpen: (p: Program) => void }) {
  const [id, setId] = useState(GROUPS[0].id);
  const group = GROUPS.find((g) => g.id === id)!;
  return (
    <section id="programs">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Ta’lim yo‘nalishlari</span>
          <h2>Kasb tanlang — kelajagingizni o‘zingiz quring</h2>
        </div>
        <div className="tabs" role="tablist">
          {GROUPS.map((g) => (
            <button key={g.id} role="tab" className="tab" aria-selected={g.id === id} onClick={() => setId(g.id)}>{g.label}</button>
          ))}
        </div>
        <p className="muted tab-note">{group.note}</p>
        <div className="grid">
          {group.items.map((p) => (
            <article key={p.id} className="card pcard">
              <img src={p.img} alt="" loading="lazy" decoding="async" width="800" height="500" />
              <div className="pcard-body">
                <h3>{p.title}</h3>
                <p className="muted clamp">{p.short}</p>
                <button className="btn btn-ghost btn-sm" onClick={() => onOpen(p)}>Batafsil ma’lumot</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
