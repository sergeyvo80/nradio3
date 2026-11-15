'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { getTheme, setTheme, THEME_EVENT, THEMES } from '@/theme/theme';

import styles from './ThemeSwitcher.module.scss';

// Переключатель тем в меню «⋮» шапки. Свёрнут — пилюля текущей темы
// (свотч цвета + название), по клику разворачивается список всех тем.
// Тема custom (произвольный цвет через пикер) показывается в пилюле
// со своим цветом, в списке выбора её нет.
const NAMES = Object.keys(THEMES) as Array<keyof typeof THEMES>;

// двухцветный свотч: половина — фон темы, половина (по диагонали) — акцент
// (цвет логотипа); у custom оба цвета — цвет пикера
const dotStyle = (name: 'custom' | keyof typeof THEMES): React.CSSProperties => {
  const bg = name !== 'custom' ? THEMES[name]['--bg-color'] : dotCustomColor();
  const accent = name !== 'custom' ? THEMES[name]['--current-color'] : dotCustomColor();
  return { background: `linear-gradient(135deg, ${bg} 50%, ${accent} 50%)` };
};

const dotCustomColor = (): string => {
  try {
    const colorFull = JSON.parse(window.localStorage.getItem('colorState') || '{}')?.colorFull;
    return typeof colorFull === 'string' ? colorFull : 'transparent';
  } catch {
    return 'transparent';
  }
};

const label = (name: string): string => name[0].toUpperCase() + name.slice(1);

const ThemeSwitcher = (): React.ReactNode => {
  const [theme, setThemeState] = useState<'custom' | keyof typeof THEMES>('yaru');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setThemeState(getTheme());
    const onThemeChange = () => setThemeState(getTheme());
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  const select = useCallback((name: keyof typeof THEMES) => {
    setTheme(name);
    setThemeState(name);
    setOpen(false);
  }, []);

  return (
    <div className={styles.ThemeSwitcher}>
      <button
        type="button"
        className={styles.current}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={styles.dot}
          style={dotStyle(theme)}
        />
        {label(theme)}
        <span className={[styles.chevron, open ? styles['--open'] : ''].join(' ')} />
      </button>

      {open && (
        <div className={styles.list}>
          {NAMES.map((name) => (
            <button
              key={name}
              type="button"
              className={[styles.row, theme === name ? styles['--active'] : ''].join(' ')}
              onClick={() => select(name)}
            >
              <span
                className={styles.dot}
                style={dotStyle(name)}
              />
              {label(name)}
              {theme === name && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
