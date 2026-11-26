'use client';

import React, { memo, useEffect, useRef } from 'react';

import { getAnalyser } from '@/api/visualizerEngine';

import styles from './LiveEq.module.scss';

const BARS = 4;
// сколько кадров молчания подряд -> считаем, что потока в графе нет
// (не-CORS станция играет напрямую, без аналайзера) - включаем псевдо-режим
const SILENT_FRAMES = 20;

// модификации одного компонента: высота подстраивается под звезду справа
// player - плеер снизу (звезда 22px), list - карточка в списке (звезда 27px)
export type LiveEqVariant = 'list' | 'player';

interface Props {
  variant?: LiveEqVariant;
}

// живой мини-эквалайзер «играющей» станции: полоски зависят от реального
// спектра потока через AnalyserNode; без данных (не-CORS поток) - плавная
// псевдо-анимация (формула псевдо-VU из Visualizer), а не жёсткая CSS-петля
const LiveEq = memo(({ variant = 'player' }: Props): React.ReactNode => {
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    // reduced-motion: статичные полоски без цикла
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let raf = 0;
    let dead = 0;
    let cancelled = false;
    let t = 0;
    let data = new Uint8Array(0);
    const last = new Array(BARS).fill(0.3); // сглаженные высоты полосок

    // псевдо-уровни: басы активнее, «дыхание» двумя синусами (как в Visualizer)
    const pseudoLevel = (i: number): number => {
      const weight = 1 - (i / BARS) * 0.55;
      const v = weight * (0.18 + 0.72
        * Math.abs(Math.sin(t * 0.017 + i * 0.7))
        * Math.abs(Math.sin(t * 0.003 + i * 0.23)));
      return Math.max(v, 0.06);
    };

    const tick = () => {
      if (cancelled) return;

      t += 1;
      const analyser = getAnalyser();
      if (analyser && data.length !== analyser.frequencyBinCount) {
        data = new Uint8Array(analyser.frequencyBinCount);
      }
      if (analyser) analyser.getByteFrequencyData(data);
      const silent = !analyser || data.every((v) => v === 0);

      let live = false;
      if (!silent) {
        dead = 0;
        live = true;
      } else {
        dead += 1;
      }

      // логарифмический обход спектра (как в Visualizer): низы шире,
      // верхняя граница 0.68 - выше у mp3 нет энергии
      const usable = Math.floor(data.length * 0.68);

      for (let i = 0; i < BARS; i += 1) {
        const el = barRefs.current[i];
        if (!el) continue;

        // переходные кадры после пропажи сигнала: держим текущую высоту
        if (!live && dead <= SILENT_FRAMES) continue;

        const target = live
          ? Math.max(
            Math.max(
              data[Math.min(data.length - 2, Math.floor(Math.pow(i / BARS, 1.6) * usable))],
              data[Math.min(data.length - 1, Math.floor(Math.pow(i / BARS, 1.6) * usable) + 1)],
            ) / 255,
            0.08,
          )
          : pseudoLevel(i);

        // плавный подход к цели - полоски не дёргаются
        last[i] += (target - last[i]) * 0.35;
        el.style.height = `${Math.round(last[i] * 100)}%`;
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`${styles.eq} ${styles[variant]}`} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
});

LiveEq.displayName = 'LiveEq';

export default LiveEq;
