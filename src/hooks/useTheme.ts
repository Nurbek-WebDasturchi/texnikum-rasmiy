import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

function readTheme(): Theme {
  const saved = localStorage.getItem('kollej-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readTheme());
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#090f1b' : '#f5f7fb');
    localStorage.setItem('kollej-theme', theme);
  }, [theme]);
  const toggle = () => setTheme((current) => current === 'dark' ? 'light' : 'dark');
  return { theme, toggle };
}
