'use client';

import React, { useCallback, useEffect, useState } from 'react';

import {
  getCustomColorFull,
  getTheme,
  setCustomTheme,
  setTheme,
  THEME_EVENT,
  THEMES,
} from '@/theme/theme';

import styles from './ThemeSwitcher.module.scss';

// Переключатель тем в меню «⋮» шапки. Свёрнут — контрол текущей темы
// (свотч + название), по клику — плоский список строк. Если пользователь
// задавал произвольную тему через пикер (она сохраняется в localStorage
// 'customTheme'), в списке есть и строка Custom — её можно выбрать повторно.
const NAMES = Object.keys(THEMES) as Array<keyof typeof THEMES>;

type SwitcherName = 'custom' | keyof typeof THEMES;

// двухцветный свотч: половина — фон темы, половина (по диагонали) — акцент
// (цвет логотипа); у custom оба цвета — цвет пикера
const dotStyle = (name: SwitcherName): React.CSSProperties => {
  const bg = name !== 'custom' ? THEMES[name]['--bg-color'] : dotCustomColor();
  const accent = name !== 'custom' ? THEMES[name]['--current-color'] : dotCustomColor();
  return { background: `linear-gradient(135deg, ${bg} 50%, ${accent} 50%)` };
};

// цвет custom-свотча: активный (colorState) или последняя сохранённая
// в 'customTheme' (после выбора named-темы colorState снят)
const dotCustomColor = (): string => {
  try {
    const active = JSON.parse(window.localStorage.getItem('colorState') || 'null')?.colorFull;
    if (typeof active?.hex === 'string') {
      return active.hex;
    }
    const saved = getCustomColorFull();
    if (saved?.hex) {
      return saved.hex;
    }
  } catch {
    // нет localStorage
  }
  return 'transparent';
};

const label = (name: string): string => name[0].toUpperCase() + name.slice(1);

const ThemeSwitcher = (): React.ReactNode => {
  const [theme, setThemeState] = useState<SwitcherName>('yaru');
  const [open, setOpen] = useState(false);
  // есть ли сохранённая custom-тема (читаем localStorage только на клиенте,
  // иначе hydration mismatch)
  const [hasCustom, setHasCustom] = useState(false);

  useEffect(() => {
    setThemeState(getTheme());
    setHasCustom(!!getCustomColorFull());
    const onThemeChange = () => {
      setThemeState(getTheme());
      setHasCustom(!!getCustomColorFull());
    };
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  const select = useCallback((name: SwitcherName) => {
    if (name === 'custom') {
      // повторное включение последней custom-темы из 'customTheme'
      setCustomTheme();
      setThemeState('custom');
    } else {
      setTheme(name);
      setThemeState(name);
    }
    setOpen(false);
  }, []);

  // строки списка: named-темы + Custom, если пользователь её задавал
  const rows: SwitcherName[] = hasCustom ? [...NAMES, 'custom'] : [...NAMES];

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
          {rows.map((name) => (
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
