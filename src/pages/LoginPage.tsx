import '../styles/admin.css';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!loading && session) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get('email')).trim(), password: String(f.get('password')) });
    setBusy(false);
    if (error) return setError('Email yoki parol noto‘g‘ri.');
    navigate('/admin', { replace: true });
  };

  return (
    <main className="login">
      <form className="card pad login-card" onSubmit={onSubmit}>
        <h1>Admin kirish</h1>
        <p className="muted">Faqat texnikum xodimlari uchun.</p>
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="username" /></div>
        <div className="field"><label htmlFor="password">Parol</label><input id="password" name="password" type="password" required autoComplete="current-password" /></div>
        {error && <p className="msg msg-err" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Kirilmoqda…' : 'Kirish'}</button>
        <Link className="back" to="/">← Saytga qaytish</Link>
      </form>
    </main>
  );
}
