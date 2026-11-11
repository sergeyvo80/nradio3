import ColorsInterface from '@/types/ColorsInterface';

// Темы продукта (см. макет public/design-mockup.html):
// - yaru   — современный Ubuntu (Yaru): графитово-фиолетовый, оранжевый акцент
// - aurora — классический терминал Ubuntu: фиолетовый #300A24, тёплый оранжевый
// - custom — произвольная тема через пикер цвета (colorState в localStorage)
// Переключение — в меню «⋮» шапки (ThemeSwitcher), выбор хранится в localStorage('theme').

export const THEME_KEY = 'theme';
export type ThemeName = 'yaru' | 'aurora' | 'custom';
export const THEME_EVENT = 'nr-theme-change';

const THEMES: Record<Exclude<ThemeName, 'custom'>, ColorsInterface> = {
  yaru: {
    '--bg-color': '#1B1922',
    '--second-bg-color': '#26232E',
    '--border-color': '#322E3D',
    '--current-color': '#E95420',
    '--shadow-color': '#0000008c',
    '--error-bg-color': '#250201',
    '--error-border-color': '#540C06',
    '--error-color': '#E98380',
    '--color': '#F4F2F7',
    '--item-color': '#F4F2F7',
    '--link-color': '#F4F2F7',
    '--visited-color': '#C9C5D4',
    '--positive-color': '#33D17A',
  },
  aurora: {
    '--bg-color': '#300A24',
    '--second-bg-color': '#3D2140',
    '--border-color': '#4A2C4D',
    '--current-color': '#F5894B',
    '--shadow-color': '#12010F',
    '--error-bg-color': '#2E0406',
    '--error-border-color': '#5C0A08',
    '--error-color': '#E98380',
    '--color': '#F3EDEA',
    '--item-color': '#F3EDEA',
    '--link-color': '#F3EDEA',
    '--visited-color': '#D8BFD3',
    '--positive-color': '#8AE234',
  },
};

// применяет набор переменных темы на корень документа
export const applyColors = (colors: ColorsInterface): void => {
  for (const name in colors) {
    document.documentElement.style.setProperty(name, colors[name as keyof ColorsInterface]);
  }
};

// активная тема: named-тема из localStorage, либо custom,
// если в localStorage('colorState') сохранён произвольный цвет пикера
export const getTheme = (): ThemeName => {
  try {
    const colorState = window.localStorage.getItem('colorState');
    if (colorState && JSON.parse(colorState)?.colorFull) {
      return 'custom';
    }
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'yaru' || saved === 'aurora') {
      return saved;
    }
  } catch {
    // нет localStorage — дефолт
  }
  return 'yaru';
};

// включает named-тему (или только помечает custom — цвета уже применены пикером)
export const setTheme = (name: ThemeName): void => {
  if (name !== 'custom') {
    try {
      window.localStorage.setItem(THEME_KEY, name);
      // custom-цвет пикера больше не актуален — снимаем его
      window.localStorage.removeItem('colorState');
    } catch {
      // нет localStorage
    }
    applyColors(THEMES[name]);
  }
  window.dispatchEvent(new Event(THEME_EVENT));
};

// при старте приложения: восстановить выбранную named-тему
// (custom-тему восстанавливает сам ColorPicker из colorState)
export const initTheme = (): void => {
  const theme = getTheme();
  if (theme !== 'custom') {
    applyColors(THEMES[theme]);
  }
};
