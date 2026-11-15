'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { getTheme, setTheme, THEME_EVENT } from '@/theme/theme';

import styles from './ThemeSwitcher.module.scss';

// Переключатель тем в меню «⋮» шапки: Yaru / Aurora / Midnight / Forest.
// Тема custom (произвольный цвет через пикер) не подсвечивается.
const ThemeSwitcher = (): React.ReactNode => {
  const [theme, setThemeState] = useState<'yaru' | 'aurora' | 'midnight' | 'forest' | 'custom'>('yaru');

  useEffect(() => {
    setThemeState(getTheme());
    const onThemeChange = () => setThemeState(getTheme());
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  const select = useCallback((name: 'yaru' | 'aurora' | 'midnight' | 'forest') => {
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
      <button
        type="button"
        className={[styles.option, theme === 'midnight' ? styles['--active'] : ''].join(' ')}
        onClick={() => select('midnight')}
      >
        Midnight
      </button>
      <button
        type="button"
        className={[styles.option, theme === 'forest' ? styles['--active'] : ''].join(' ')}
        onClick={() => select('forest')}
      >
        Forest
      </button>
    </div>
  );
};

export default ThemeSwitcher;
