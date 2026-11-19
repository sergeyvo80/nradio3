// Стартовая заставка (splash): закрывает экран, пока не применены настройки
// из localStorage (тема, язык, последняя станция). Тема при этом уже
// восстановлена inline-скриптом в <head> (см. theme/themeVars.ts), поэтому
// заставка сразу в цветах выбранной темы — «прыжка» палитры нет.
//
// Разметка рендерится на сервере (видна с первого кадра), плавно уходит
// по событию hideSplash() и размонтируется штатно, через React-состояние.

const SPLASH_HIDE_EVENT = 'nr-splash-hide';
const FADE_MS = 200;

let splashHidden = false;

export const isSplashHidden = (): boolean => splashHidden;

export const hideSplash = (): void => {
  splashHidden = true;
  window.dispatchEvent(new Event(SPLASH_HIDE_EVENT));
};

export { SPLASH_HIDE_EVENT, FADE_MS };
