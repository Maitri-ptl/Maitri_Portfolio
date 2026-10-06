import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Light / dark theme state, shared by every component that needs it (the
// Navbar toggle today, anything else later).
//
// How it works:
//  - The active theme is a `dark` class on <html>. All theme colors are CSS
//    variables defined in index.css (:root = light, .dark = dark), so flipping
//    that one class re-colors the whole site — no per-component logic needed.
//  - The choice is saved in localStorage ("theme") so it survives reloads.
//  - The inline script in index.html applies the saved theme BEFORE React
//    mounts, which avoids a flash of the wrong theme on load.
//  - First-time visitors get DARK (the site's original look). To follow the
//    visitor's OS setting instead, change DEFAULT_THEME below to
//    `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`
//    (and make the same change in the index.html script).

const STORAGE_KEY = 'theme';
const DEFAULT_THEME = 'dark';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // localStorage can be blocked (private mode, strict settings) — fall through.
  }
  return DEFAULT_THEME;
};

const ThemeContext = createContext({ theme: DEFAULT_THEME, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore — the theme still works for this session.
    }
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    []
  );

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
