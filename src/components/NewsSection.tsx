import { CalendarDays } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { formatDate } from '../lib/format';

export default function NewsSection() {
  const { posts, state, reload } = usePosts(12);
  return (
    <section id="news" className="alt">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Yangiliklar</span>
          <h2>Yangiliklar va tadbirlar</h2>
        </div>
        {state === 'error' && (
          <div className="card empty"><p>Yangiliklarni yuklab bo‘lmadi.</p><button className="btn btn-ghost btn-sm" onClick={() => void reload()}>Qayta urinish</button></div>
        )}
        {state === 'ready' && !posts.length && <div className="card empty"><p>Hozircha yangiliklar yo‘q.</p></div>}
        <div className="grid">
          {state === 'loading' && [0, 1, 2].map((i) => <div key={i} className="card skeleton news-skeleton" />)}
          {posts.map((p) => (
            <article key={p.id} className="card pcard">
              <img src={p.image_url} alt="" loading="lazy" decoding="async" width="800" height="500" />
              <div className="pcard-body">
                <span className="meta"><CalendarDays size={14} /> {formatDate(p.date)}</span>
                <h3>{p.title}</h3>
                <p className="muted clamp clamp-4">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
