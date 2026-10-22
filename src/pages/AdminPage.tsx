import '../styles/admin.css';
import { Link, Navigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

export default function AdminPage() {
  const { session, user, isAdmin, loading } = useAuth();
  const { posts, state, reload } = usePosts(100);
  const signOut = () => void supabase.auth.signOut();

  if (loading) return <p className="login muted">Yuklanmoqda…</p>;
  if (!session || !user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <main className="login">
        <div className="card pad login-card">
          <h1>Ruxsat yo‘q</h1>
          <p className="muted">Bu hisob admin huquqiga ega emas.</p>
          <button className="btn btn-primary" onClick={signOut}>Chiqish</button>
        </div>
      </main>
    );
  }
  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="container admin-bar-in">
          <strong>Admin panel</strong>
          <span className="muted email">{user.email}</span>
          <Link className="btn btn-ghost btn-sm" to="/">Saytga</Link>
          <button className="btn btn-ghost btn-sm" onClick={signOut}><LogOut size={16} /> Chiqish</button>
        </div>
      </header>
      <main className="container admin-grid">
        <PostForm userId={user.id} onCreated={() => void reload()} />
        <PostList posts={posts} state={state} onChanged={() => void reload()} />
      </main>
    </div>
  );
}
