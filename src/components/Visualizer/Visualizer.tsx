'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import PlayerStateEnum from '@/types/PlayerStateEnum';
import { getAnalyser } from '@/api/visualizerEngine';

import styles from './Visualizer.module.scss';

type Mode = 'bars' | 'wave';

interface Props {
  playerState?: PlayerStateEnum;
}

const Visualizer = memo(({ playerState }: Props): React.ReactNode => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [full, setFull] = useState(false);      // нативный фуллскрин или оверлей
  const [overlay, setOverlay] = useState(false); // фолбэк, когда Fullscreen API недоступен (iOS Safari)
  const [mode, setMode] = useState<Mode>('bars');

  // компактный клик -> фуллскрин; клик в фуллскрине -> смена режима
  const onWrapClick = useCallback(() => {
    if (full) {
      setMode((prev) => (prev === 'bars' ? 'wave' : 'bars'));
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const req = el.requestFullscreen?.();
    if (req && typeof req.then === 'function') {
      req.then(() => undefined).catch(() => setOverlay(true));
    } else if (!('requestFullscreen' in el)) {
      // Fullscreen API недоступен (iOS Safari) - CSS-оверлей на весь вьюпорт
      setOverlay(true);
    }
  }, [full]);

  const exitFull = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
    setOverlay(false);
  }, []);

  // синхронизация состояния нативного фуллскрина (в т.ч. выход по Esc)
  useEffect(() => {
    const onChange = () => {
      if (document.fullscreenElement !== wrapRef.current) {
        setFull(false);
        setOverlay(false);
      } else {
        setFull(true);
      }
    };

    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Esc в оверлей-режиме
  useEffect(() => {
    if (!full || document.fullscreenElement) return undefined;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitFull();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [full, exitFull]);

  // цикл отрисовки
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = 0;
    let deadFrames = 0;   // сколько кадров подряд спектр пуст (CORS-поток)
    let pseudo = false;   // псевдо-VU режим

    // состояние полос: высоты и «пики» (падают медленно, как в Winamp)
    let vals: number[] = [];
    let peaks: number[] = [];

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const themeColors = () => {
      const cs = getComputedStyle(document.documentElement);
      return {
        accent: cs.getPropertyValue('--current-color').trim() || '#E95420',
        cap: cs.getPropertyValue('--item-color').trim() || '#fff',
      };
    };

    const drawIdle = () => {
      syncSize();
      const { width: w, height: h } = canvas;
      const { accent } = themeColors();

      ctx2d.clearRect(0, 0, w, h);
      ctx2d.globalAlpha = 0.25;
      ctx2d.fillStyle = accent;
      ctx2d.fillRect(0, h - Math.max(2, h * 0.04), w, Math.max(2, h * 0.04));
      ctx2d.globalAlpha = 1;
    };

    const draw = () => {
      syncSize();
      const { width: w, height: h } = canvas;
      const { accent, cap } = themeColors();
      const playing = playerState === PlayerStateEnum.Playing;
      const analyserNode = getAnalyser();

      ctx2d.clearRect(0, 0, w, h);

      if (!playing) {
        drawIdle();
        return; // без rAF, пока пауза (экономия батареи)
      }

      if (mode === 'bars') {
        const bands = Math.max(14, Math.min(48, Math.floor(w / (7 * dpr))));
        if (vals.length !== bands) {
          vals = new Array(bands).fill(0);
          peaks = new Array(bands).fill(0);
        }

        const cell = w / bands;
        const barW = Math.max(2 * dpr, cell * 0.62);

        let live = false;
        const grad = ctx2d.createLinearGradient(0, h, 0, 0);
        grad.addColorStop(0, accent);
        grad.addColorStop(1, cap);

        // спектр читаем один раз за кадр
        const data = new Uint8Array(analyserNode ? analyserNode.frequencyBinCount : 1024);
        if (analyserNode) analyserNode.getByteFrequencyData(data);

        for (let i = 0; i < bands; i += 1) {
          let v = 0;

          if (analyserNode && !pseudo) {
            // логарифмический обход спектра: низы шире, верха сжаты
            const usable = Math.floor(data.length * 0.72);
            const idx = Math.min(data.length - 2, Math.floor(Math.pow(i / bands, 1.6) * usable));
            v = Math.max(data[idx], data[idx + 1]) / 255;

            if (v > 0) live = true;
          }

          // CORS-поток без данных: 20 пустых кадров -> псевдо-VU
          if (!live) {
            deadFrames += 1;
            if (deadFrames > 20) pseudo = true;
          } else {
            deadFrames = 0;
            pseudo = false;
          }

          if (pseudo) {
            // плавная имитация: басы активнее
            const weight = 1 - (i / bands) * 0.55;
            v = weight * (0.18 + 0.72 * Math.abs(Math.sin(t * 0.017 + i * 0.7))
              * Math.abs(Math.sin(t * 0.003 + i * 0.23)));
            v = Math.max(v, 0.06);
          }

          vals[i] = Math.max(v, vals[i] * 0.86);          // спад столбика
          peaks[i] = Math.max(vals[i], peaks[i] - 0.008); // пик падает медленно

          const bh = Math.max(2 * dpr, vals[i] * h * 0.96);
          const x = i * cell + (cell - barW) / 2;

          ctx2d.fillStyle = grad;
          ctx2d.fillRect(x, h - bh, barW, bh);

          // белый пик-«шапка»
          if (peaks[i] > 0.02) {
            const ph = Math.max(2 * dpr, peaks[i] * h * 0.96);
            ctx2d.fillStyle = cap;
            ctx2d.globalAlpha = 0.9;
            ctx2d.fillRect(x, h - ph - 2 * dpr, barW, 2 * dpr);
            ctx2d.globalAlpha = 1;
          }
        }
      } else {
        // осциллоскоп
        const data = new Uint8Array(analyserNode ? analyserNode.fftSize : 2048);
        if (analyserNode) analyserNode.getByteTimeDomainData(data);

        const silent = data.every((s) => s === 128 || s === 0);
        ctx2d.lineWidth = 2 * dpr;
        ctx2d.strokeStyle = accent;
        ctx2d.beginPath();

        const mid = h / 2;
        const amp = h * 0.38;

        for (let x = 0; x <= w; x += 2 * dpr) {
          const p = x / w;
          let y: number;

          if (analyserNode && !silent) {
            y = mid + ((data[Math.floor(p * data.length)] - 128) / 128) * amp;
          } else {
            // мёртвые данные: красивая псевдоволна
            y = mid + Math.sin(p * 18 + t * 0.09) * amp
              * (0.35 + 0.6 * Math.abs(Math.sin(t * 0.004)));
          }

          if (x === 0) ctx2d.moveTo(x, y);
          else ctx2d.lineTo(x, y);
        }

        ctx2d.stroke();
      }

      t += 1;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(raf);
  }, [playerState, mode, full]);

  return (
    <div
      ref={wrapRef}
      className={[styles.Visualizer, full ? styles['--full'] : '', overlay ? styles['--overlay'] : ''].join(' ')}
      onClick={onWrapClick}
      role="button"
      aria-label="Visualizer"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {full && (
        <FontAwesomeIcon icon={faXmark} className={styles.close} onClick={(e) => { e.stopPropagation(); exitFull(); }} />
      )}
    </div>
  );
});

Visualizer.displayName = 'Visualizer';

export default Visualizer;
