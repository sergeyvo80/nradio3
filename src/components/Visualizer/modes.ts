// Полноэкранные режимы визуализатора (кроме bars/wave — они исторически
// в Visualizer.tsx). Каждый режим — фабрика рендерера со своим состоянием
// (сглаживание энергий, история спектра), данные берёт из Spectrum.
// Правила скила (docs/skill-visualizer.md): один getAnalyser(), цвета из
// CSS-переменных каждый кадр, псевдо-VU деградирует, звук не трогаем.

export interface Spectrum {
  /** значение полосы 0..1: логарифмический обход спектра или псевдо-VU */
  read(i: number, bands: number): number;
  /** усреднённая энергия трети спектра: 0 — басы, 1 — середина, 2 — верха */
  energy(third: 0 | 1 | 2, bands: number): number;
  /** цвета темы, читаются каждый кадр (смена темы без подписок) */
  accent: string;
  cap: string;
  bg: string;
  /** цветная версия режима (монохромная — по умолчанию) */
  colorful: boolean;
  /** цвет полосы по индексу: радуга для цветных версий */
  bandColor(i: number, bands: number): string;
}

export type ModeRenderer = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  t: number,
  spectrum: Spectrum,
) => void;

// «Aurora»: три слоя волн — бас качает нижний широкий слой, середина —
// средний, верха — тонкую яркую кромку. Монохром (акцент темы) по умолчанию;
// цветная версия — «настоящее сияние»: фиолетовый низ, циан, зелёная кромка.
export const createAurora = (): ModeRenderer => {
  const eased = [0.3, 0.3, 0.3];
  const layers = [
    { horizon: 0.80, ampK: 1.15, alpha: 0.16, lw: 0, f1: 1.15, f2: 2.31, sp: 0.42 },
    { horizon: 0.68, ampK: 0.85, alpha: 0.30, lw: 0, f1: 1.85, f2: 3.17, sp: 0.75 },
    { horizon: 0.58, ampK: 0.60, alpha: 1.00, lw: 2, f1: 2.60, f2: 4.41, sp: 1.25 },
  ];
  // цветные оттенки слоёв: фиолетовый / циан / зелёный (как полярное сияние)
  const HUES = [275, 190, 130];

  return (ctx, w, h, dpr, t, spectrum) => {
    const step = Math.max(4, Math.round(6 * dpr));

    layers.forEach((L, li) => {
      eased[li] += (spectrum.energy(li as 0 | 1 | 2, 3) - eased[li]) * 0.06;
      const hue = spectrum.colorful ? HUES[li] : null;
      const fill = hue != null ? `hsl(${hue} 80% 55%)` : spectrum.accent;
      const edge = hue != null ? `hsl(${hue} 90% 65%)` : spectrum.accent;

      const waveY = (x: number) => {
        const p = x / w;
        const amp = eased[li] * L.ampK * h * 0.34;
        const s = Math.sin(p * L.f1 * Math.PI * 2 + t * 0.045 * L.sp) * 0.62
                + Math.sin(p * L.f2 * Math.PI * 2 - t * 0.045 * L.sp * 1.63) * 0.38;
        return h * L.horizon - amp * s;
      };

      // заливка слоя полупрозрачным цветом вниз до низа экрана
      ctx.globalAlpha = L.alpha;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(0, waveY(0));
      for (let x = step; x <= w; x += step) ctx.lineTo(x, waveY(x));
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // кромка волны: у полупрозрачных слоёв чуть ярче заливки,
      // у верхнего — полная линия 2px
      ctx.globalAlpha = L.alpha < 1 ? Math.min(1, L.alpha + 0.35) : 1;
      ctx.beginPath();
      ctx.moveTo(0, waveY(0));
      for (let x = step; x <= w; x += step) ctx.lineTo(x, waveY(x));
      ctx.lineWidth = (L.lw || 1) * dpr;
      ctx.strokeStyle = edge;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  };
};

// «Хребты»: спектр-история стеком вверх (Joy Division / Unknown Pleasures).
// Раз в 3 кадра снимаем сечение спектра; каждое рисуется гребнём, заливка
// фоном перекрывает предыдущие линии, новейший — ярче. В цветной версии
// гребни идут по оттенкам от мадженты (старые) к весенней зелени (новые).
export const createRidges = (): ModeRenderer => {
  const ROWS = 16;
  const BANDS = 28;
  const history: number[][] = [];
  let skip = 0;

  return (ctx, w, h, dpr, t, spectrum) => {
    if (skip === 0) {
      const row: number[] = [];
      for (let i = 0; i < BANDS; i += 1) row.push(spectrum.read(i, BANDS));
      history.push(row);
      if (history.length > ROWS) history.shift();
    }
    skip = (skip + 1) % 3;

    // сечение — плавная кривая через полосы (косинусная интерполяция)
    const sample = (row: number[], p: number) => {
      const x = p * (BANDS - 1);
      const i = Math.floor(x);
      const f = x - i;
      const a = row[i];
      const b = row[Math.min(BANDS - 1, i + 1)];
      return a + (b - a) * ((1 - Math.cos(f * Math.PI)) / 2);
    };

    const step = Math.max(3 * dpr, Math.round(w / 140));
    const top = h * 0.26;
    const rowGap = (h * 0.60) / ROWS;
    const amp = h * 0.22;

    history.forEach((row, r) => {
      const base = top + r * rowGap;
      const alpha = 0.25 + 0.75 * ((r + 1) / history.length);
      const hue = 300 - (r / Math.max(1, history.length - 1)) * 160;

      // силуэт гребня
      const ridge = (build: () => void) => {
        ctx.beginPath();
        ctx.moveTo(0, base);
        for (let x = 0; x <= w; x += step) ctx.lineTo(x, base - sample(row, x / w) * amp);
        ctx.lineTo(w, base);
        build();
      };

      // заливка цветом фона — гребни перекрывают друг друга
      ridge(() => {
        ctx.globalAlpha = 1;
        ctx.fillStyle = spectrum.bg;
        ctx.fill();
      });

      // линия гребня: старые бледнее; в цветной версии — свой оттенок у ряда
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.5 * dpr;
      ctx.strokeStyle = spectrum.colorful
        ? `hsl(${Math.round(hue)} 85% 60%)`
        : spectrum.accent;
      ridge(() => ctx.stroke());
      ctx.globalAlpha = 1;
    });
  };
};

// «Пульс»: радиальный спектр вокруг центра — ядро дышит басом,
// лучи растут из кольца, вся конструкция медленно вращается. В цветной
// версии лучи радужные по полосе, ядро — синее, кольцо — маджента.
export const createPulse = (): ModeRenderer => {
  const BANDS = 32;
  const vals = new Array(BANDS).fill(0);
  let rot = 0;

  return (ctx, w, h, dpr, t, spectrum) => {
    rot += 0.0025;

    // сглаживание лучей: спад как в bars
    for (let i = 0; i < BANDS; i += 1) {
      const v = spectrum.read(i, BANDS);
      vals[i] = Math.max(v, vals[i] * 0.90);
    }

    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.20;
    const maxLen = Math.min(w, h) * 0.30;
    const core = R * (0.85 + spectrum.energy(0, 3) * 0.35);

    // пульсирующее ядро
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = spectrum.colorful ? 'hsl(205 80% 55%)' : spectrum.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, core, 0, Math.PI * 2);
    ctx.fill();

    // кольцо ядра
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 1.5 * dpr;
    ctx.strokeStyle = spectrum.colorful ? 'hsl(330 80% 62%)' : spectrum.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, core, 0, Math.PI * 2);
    ctx.stroke();

    // лучи спектра
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.5 * dpr, ((Math.PI * core) / BANDS) * 0.45);
    for (let i = 0; i < BANDS; i += 1) {
      const v = vals[i];
      if (v < 0.02) continue;
      const angle = rot + (i / BANDS) * Math.PI * 2;
      const len = Math.max(2 * dpr, v * maxLen);
      ctx.globalAlpha = 0.35 + 0.65 * v;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * core, cy + Math.sin(angle) * core);
      ctx.lineTo(cx + Math.cos(angle) * (core + len), cy + Math.sin(angle) * (core + len));
      ctx.strokeStyle = spectrum.colorful
        ? spectrum.bandColor(i, BANDS)
        : spectrum.accent;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  };
};
