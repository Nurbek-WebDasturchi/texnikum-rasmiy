import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { BUCKET, supabase } from '../lib/supabase';
import { errMsg, formatDate } from '../lib/format';
import type { Post } from '../types';

interface Props { posts: Post[]; state: 'loading' | 'ready' | 'error'; onChanged: () => void }

export default function PostList({ posts, state, onChanged }: Props) {
  const [confirmId, setConfirmId] = useState<Post['id'] | null>(null);
  const [err, setErr] = useState('');

  const remove = async (p: Post) => {
    setErr('');
    const { error } = await supabase.from('posts').delete().eq('id', p.id);
    if (error) return setErr(`O‘chirib bo‘lmadi: ${errMsg(error)}`);
    const file = p.image_url.split('/').pop();
    if (file) void supabase.storage.from(BUCKET).remove([file]);
    setConfirmId(null);
    onChanged();
  };

  return (
    <section className="card">
      <h2 className="pad list-title">Joylangan postlar {state === 'ready' && <span className="muted">({posts.length})</span>}</h2>
      {err && <p className="msg msg-err" role="alert">{err}</p>}
      {state === 'loading' && <p className="pad muted">Yuklanmoqda…</p>}
      {state === 'error' && <p className="pad muted">Postlarni yuklab bo‘lmadi.</p>}
      {state === 'ready' && !posts.length && <p className="pad muted">Hozircha postlar yo‘q.</p>}
      {posts.map((p) => (
        <div key={p.id} className="row">
          <img src={p.image_url} alt="" loading="lazy" width="72" height="54" />
          <div className="row-main"><b>{p.title}</b><span className="muted">{formatDate(p.date)}</span></div>
          {confirmId === p.id ? (
            <>
              <button className="btn btn-danger btn-sm" onClick={() => void remove(p)}>Ha, o‘chirish</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmId(null)}>Yo‘q</button>
            </>
          ) : (
            <button className="icon-btn" aria-label={`“${p.title}” postini o‘chirish`} onClick={() => setConfirmId(p.id)}><Trash2 size={18} /></button>
          )}
        </div>
      ))}
    </section>
  );
}
