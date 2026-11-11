'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { getTheme, setTheme, THEME_EVENT } from '@/theme/theme';

import styles from './ThemeSwitcher.module.scss';

// Переключатель тем в меню «⋮» шапки: Yaru / Aurora.
// Тема custom (произвольный цвет через пикер) не подсвечивается.
const ThemeSwitcher = (): React.ReactNode => {
  const [theme, setThemeState] = useState<'yaru' | 'aurora' | 'custom'>('yaru');

  useEffect(() => {
    setThemeState(getTheme());
    const onThemeChange = () => setThemeState(getTheme());
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  const select = useCallback((name: 'yaru' | 'aurora') => {
    setTheme(name);
    setThemeState(name);
  }, []);

  return (
    <div className={styles.ThemeSwitcher}>
      <button
        type="button"
        className={[styles.option, theme === 'yaru' ? styles['--active'] : ''].join(' ')}
        onClick={() => select('yaru')}
      >
        Yaru
      </button>
      <button
        type="button"
        className={[styles.option, theme === 'aurora' ? styles['--active'] : ''].join(' ')}
        onClick={() => select('aurora')}
      >
        Aurora
      </button>
    </div>
  );
};

export default ThemeSwitcher;
