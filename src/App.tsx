import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

// Admin va login faqat kerak bo'lganda yuklanadi
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const NotFound = () => (
  <main className="container not-found">
    <h1>404</h1>
    <p className="muted">Bunday sahifa topilmadi.</p>
    <Link className="btn btn-primary" to="/">Bosh sahifaga qaytish</Link>
  </main>
);

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
