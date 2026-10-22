import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { BUCKET, supabase } from '../lib/supabase';
import { compressImage } from '../lib/image';
import { errMsg } from '../lib/format';

type Msg = { ok: boolean; text: string } | null;

export default function PostForm({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [len, setLen] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  useEffect(() => {
    if (!file) return setPreview('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && (!f.type.startsWith('image/') || f.size > 15 * 1024 * 1024)) {
      e.target.value = '';
      return setMsg({ ok: false, text: 'Faqat rasm fayli tanlang (15 MB gacha).' });
    }
    setMsg(null);
    setFile(f);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return setMsg({ ok: false, text: 'Rasm tanlang.' });
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    setMsg(null);
    try {
      const blob = await compressImage(file);
      const name = `${crypto.randomUUID()}.${blob.type.split('/')[1]}`;
      const up = await supabase.storage.from(BUCKET).upload(name, blob, { contentType: blob.type, cacheControl: '31536000' });
      if (up.error) throw up.error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
      const ins = await supabase.from('posts').insert({
        title: String(f.get('title')).trim(), description: String(f.get('description')).trim(), image_url: data.publicUrl, user_id: userId,
      });
      if (ins.error) {
        await supabase.storage.from(BUCKET).remove([name]); // yetim fayl qolmasin
        throw ins.error;
      }
      form.reset();
      setFile(null);
      setLen(0);
      setMsg({ ok: true, text: 'Post saytga joylandi.' });
      onCreated();
    } catch (err) {
      setMsg({ ok: false, text: `Xatolik: ${errMsg(err)}` });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card pad" onSubmit={submit}>
      <h2>Yangi post</h2>
      <div className="field"><label htmlFor="title">Sarlavha</label><input id="title" name="title" required maxLength={120} /></div>
      <div className="field">
        <label htmlFor="description">Matn <span className="muted">({len}/1500)</span></label>
        <textarea id="description" name="description" required maxLength={1500} rows={6} onChange={(e) => setLen(e.target.value.length)} />
      </div>
      <div className="field">
        <label htmlFor="image">Rasm</label>
        <input id="image" type="file" accept="image/*" onChange={pick} />
        <span className="muted hint">Rasm avtomatik kichraytirilib WebP formatida yuklanadi.</span>
      </div>
      {preview && <img className="preview" src={preview} alt="Tanlangan rasm" />}
      {msg && <p className={`msg ${msg.ok ? 'msg-ok' : 'msg-err'}`} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Yuklanmoqda…' : 'Joylash'}</button>
    </form>
  );
}
