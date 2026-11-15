'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { getTheme, setTheme, THEME_EVENT, THEMES } from '@/theme/theme';

import styles from './ThemeSwitcher.module.scss';

// Переключатель тем в меню «⋮» шапки: кнопка = свотч акцентного цвета + название.
// Тема custom (произвольный цвет через пикер) не показывается.
const NAMES = Object.keys(THEMES) as Array<keyof typeof THEMES>;

const ThemeSwitcher = (): React.ReactNode => {
  const [theme, setThemeState] = useState<'custom' | keyof typeof THEMES>('yaru');

  useEffect(() => {
    setThemeState(getTheme());
    const onThemeChange = () => setThemeState(getTheme());
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  const select = useCallback((name: keyof typeof THEMES) => {
    setTheme(name);
    setThemeState(name);
  }, []);

  return (
    <div className={styles.ThemeSwitcher}>
      {NAMES.map((name) => (
        <button
          key={name}
          type="button"
          className={[styles.option, theme === name ? styles['--active'] : ''].join(' ')}
          onClick={() => select(name)}
        >
          <span
            className={styles.dot}
            style={{ backgroundColor: THEMES[name]['--current-color'] }}
          />
          {name[0].toUpperCase() + name.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
