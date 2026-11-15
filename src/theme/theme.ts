import ColorsInterface from '@/types/ColorsInterface';

// Темы продукта (см. макет public/design-mockup.html):
// - yaru     — современный Ubuntu (Yaru): графитово-фиолетовый, оранжевый акцент
// - aurora   — классический терминал Ubuntu: фиолетовый #300A24, тёплый оранжевый
// - midnight — глубокий индиго-нави, серебряный акцент (лого/play), орхидея для лайков
// - forest   — тёмно-зелёный (лесная хвоя): мятный акцент (лого/play), лайм для лайков
// - day      — светлая нейтральная: оранжевый акцент Yaru, тёмно-зелёный для лайков
// - sage     — светло-зелёная (шалфей), парная к forest: тёмно-зелёный акцент, оливковый лайм
// - custom   — произвольная тема через пикер цвета (colorState в localStorage)
// Переключение — в меню «⋮» шапки (ThemeSwitcher), выбор хранится в localStorage('theme').

export const THEME_KEY = 'theme';
export type ThemeName = 'yaru' | 'aurora' | 'midnight' | 'forest' | 'day' | 'sage' | 'custom';
export const THEME_EVENT = 'nr-theme-change';

// палитры named-тем (нужны переключателю: свотч цвета в кнопке темы)
export const THEMES: Record<Exclude<ThemeName, 'custom'>, ColorsInterface> = {
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
  midnight: {
    // глубокий индиго-нави + серебро + орхидея (по референсу пользователя)
    '--bg-color': '#0C1134',
    '--second-bg-color': '#131A45',
    // насыщенный синий: нелайкнутые звёзды и разделители
    '--border-color': '#2E3AB8',
    // серебро: лого, NRADIO, play, планка текущей станции
    '--current-color': '#BCC1CC',
    '--shadow-color': '#0508178c',
    '--error-bg-color': '#2C0A33',
    '--error-border-color': '#5E1A62',
    '--error-color': '#E983C8',
    '--color': '#C9CCD4',
    '--item-color': '#C9CCD4',
    '--link-color': '#C9CCD4',
    '--visited-color': '#8F93C9',
    // орхидея: лайкнутые звёзды, подписи станций, версия в меню
    '--positive-color': '#D26BD3',
  },
  forest: {
    // тёмно-зелёный: хвойный фон + мятный акцент + лайм (по мотивам midnight:
    // та же структура контрастов, зелёная гамма)
    '--bg-color': '#0A1B12',
    '--second-bg-color': '#10261A',
    // приглушённый хвойный зелёный: нелайкнутые звёзды и разделители
    '--border-color': '#2F5A3E',
    // мята: лого, NRADIO, play, планка текущей станции
    '--current-color': '#4ED88C',
    '--shadow-color': '#04120B8c',
    '--error-bg-color': '#2A0D06',
    '--error-border-color': '#5C1A0A',
    '--error-color': '#E9987F',
    '--color': '#C8D8CC',
    '--item-color': '#C8D8CC',
    '--link-color': '#C8D8CC',
    '--visited-color': '#8FB39B',
    // лайм: лайкнутые звёзды, подписи станций, версия в меню
    '--positive-color': '#B4E34F',
  },
  day: {
    // светлая нейтральная: светлый фон + тёмный текст; акцент — фирменный
    // оранжевый Yaru; на светлом фоне positive темнее (читаемость 9-11px текста)
    '--bg-color': '#F3F2F6',
    '--second-bg-color': '#FFFFFF',
    // светло-серый: нелайкнутые звёзды и разделители
    '--border-color': '#D9D6E0',
    // оранжевый: лого, NRADIO, play, планка текущей станции
    '--current-color': '#E95420',
    '--shadow-color': '#00000026',
    '--error-bg-color': '#FBE9E7',
    '--error-border-color': '#E6B0AC',
    '--error-color': '#A32014',
    '--color': '#26232E',
    '--item-color': '#26232E',
    '--link-color': '#26232E',
    '--visited-color': '#726E7E',
    // тёмно-зелёный: лайкнутые звёзды, подписи станций, версия в меню
    '--positive-color': '#1E8E4E',
  },
  sage: {
    // светло-зелёная, парная к forest: шалфейный фон, тёмно-зелёный акцент,
    // оливковый лайм для лайков
    '--bg-color': '#EAF1E8',
    '--second-bg-color': '#FFFFFF',
    // приглушённый шалфейный: нелайкнутые звёзды и разделители
    '--border-color': '#C2D4C0',
    // тёмно-зелёный: лого, NRADIO, play, планка текущей станции
    '--current-color': '#1F8A50',
    '--shadow-color': '#0000001a',
    '--error-bg-color': '#FBEAE4',
    '--error-border-color': '#E0B4A8',
    '--error-color': '#A33018',
    '--color': '#232D24',
    '--item-color': '#232D24',
    '--link-color': '#232D24',
    '--visited-color': '#6E8272',
    // оливковый (тёмный лайм): лайкнутые звёзды, подписи, версия
    '--positive-color': '#5F7F1D',
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
    if (saved && ['yaru', 'aurora', 'midnight', 'forest', 'day', 'sage'].includes(saved)) {
      return saved as ThemeName;
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
