'use client';

import React, { useEffect, useState } from 'react';

import { SPLASH_HIDE_EVENT, FADE_MS, isSplashHidden } from '@/api/splash';

type State = 'visible' | 'fading' | 'gone';

// синусоида — как в визуализаторе шапки (wave): амплитуда ±7px, 2px,
// цвет --current-color; анимация в globals.scss (#nr-splash)
const Splash = (): React.ReactNode => {
  // если настройки применились до монтирования (эффект контейнера успел раньше)
  // — не показываем заставку дольше одного кадра
  const [state, setState] = useState<State>(() => (isSplashHidden() ? 'fading' : 'visible'));

  useEffect(() => {
    const onHide = () => setState('fading');
    window.addEventListener(SPLASH_HIDE_EVENT, onHide);
    return () => window.removeEventListener(SPLASH_HIDE_EVENT, onHide);
  }, []);

  useEffect(() => {
    if (state !== 'fading') return undefined;
    const timer = window.setTimeout(() => setState('gone'), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === 'gone') return null;
  return (
    <div id="nr-splash" className={state === 'fading' ? 'nrSplashOut' : undefined} aria-hidden="true">
      <div className="nrSplashWave">
        <svg
          className="nrSplashWaveSvg"
          viewBox="0 0 240 40"
          width="240"
          height="40"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            className="nrSplashWavePath"
            d="M0 20Q15 13 30 20T60 20T90 20T120 20T150 20T180 20T210 20T240 20"
          />
        </svg>
      </div>
    </div>
  );
};

export default Splash;
