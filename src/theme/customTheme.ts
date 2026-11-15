import Color from 'color';

import ColorsInterface from '@/types/ColorsInterface';

// Базовая палитра custom-темы: схема произвольного цвета считается как
// сдвиг HSL каждой переменной относительно этой базы (было в ColorPicker).
const CUSTOM_BASE: ColorsInterface = {
  '--bg-color': '#292A2D',
  '--second-bg-color': '#202124',
  '--border-color': '#4A4C50',
  '--current-color': '#E8AD47',
  '--shadow-color': '#000000bf',
  '--error-bg-color': '#250201',
  '--error-border-color': '#540C06',
  '--color': '#ffffff',
  '--item-color': '#ffffff',
  '--error-color': '#E98380',
  '--link-color': '#E59A6F',
  '--visited-color': '#6AD1C7',
  '--positive-color': '#4CAF7D',
};

type CustomBaseKeys = keyof typeof CUSTOM_BASE;

// применяет палитру, производную от произвольного цвета пикера:
// каждая переменная сдвигается по HSL от базовой пропорционально
// сдвигу базового цвета к выбранному (тёмный выбранный цвет инвертирует
// сдвиг светлоты — тёмная тема остаётся тёмной)
export const applyCustomColors = (pickedColor: string): void => {
  const pickedColorObject = Color(pickedColor);
  const pickedColorObjectHSL = pickedColorObject.hsl().object();

  const isDark = pickedColorObject.isDark() ? -1 : 1;

  const baseColorObject = Color(CUSTOM_BASE['--bg-color']);
  const baseColorObjectHSL = baseColorObject.hsl().object();

  for (const color in CUSTOM_BASE) {
    const currentColorHSL = Color(CUSTOM_BASE[color as CustomBaseKeys]).hsl().object();

    const newColor = Color({
      h: pickedColorObjectHSL.h - (currentColorHSL.h - baseColorObjectHSL.h),
      s: pickedColorObjectHSL.s - (currentColorHSL.s - baseColorObjectHSL.s),
      l: pickedColorObjectHSL.l - (currentColorHSL.l - baseColorObjectHSL.l) * isDark,
    });

    document.documentElement.style.setProperty(color, newColor.hex());
  }
};
