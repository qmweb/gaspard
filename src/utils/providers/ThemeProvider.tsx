'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // The actual resolved theme (system resolves to light/dark)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');

  // Get the actual resolved theme
  const getActualTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return currentTheme;
  };

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Only run once on mount
  useEffect(() => {
    setMounted(true);
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      // Default to system preference
      setTheme('system');
    }
  }, []);

  // Update actualTheme when theme changes or system preference changes
  useEffect(() => {
    if (!mounted) return;

    const updateActualTheme = () => {
      const resolved = getActualTheme(theme);
      setActualTheme(resolved);

      // Apply theme classes to html element for Tailwind
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);

      // Also set data-theme for compatibility
      root.setAttribute('data-theme', resolved);
    };

    updateActualTheme();

    // Store theme preference
    localStorage.setItem('theme', theme);

    // Listen for system theme changes if using system preference
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateActualTheme);

      return () => {
        mediaQuery.removeEventListener('change', updateActualTheme);
      };
    }
  }, [theme, mounted]);

  // Prevent hydration mismatch by using initial theme for SSR
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: 'system',
          setTheme: () => {},
          actualTheme: 'light',
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
