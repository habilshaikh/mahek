import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'mahek.theme';

export function readTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#1a1510' : '#faf6ee');
}

/** Light is the default; the choice is remembered in this browser. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent<Theme>('mahek-theme', { detail: theme }));
  }, [theme]);
  // keep several toggles (header, mobile menu) in sync
  useEffect(() => {
    const on = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener('mahek-theme', on);
    return () => window.removeEventListener('mahek-theme', on);
  }, []);
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
}

export default function ThemeToggle({ className = '', withLabel = false }: { className?: string; withLabel?: boolean }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button onClick={toggle} className={className} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
      {theme === 'dark' ? <Sun size={19} strokeWidth={1.3} /> : <Moon size={19} strokeWidth={1.3} />}
      {withLabel && <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
