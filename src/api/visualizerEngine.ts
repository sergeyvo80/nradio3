/* Web Audio движок визуализатора: синглтон.
 *
 * ВАЖНО (спека Web Audio): поток без Access-Control-Allow-Origin, пропущенный
 * через MediaElementSource, ЗАГЛУХАЕТ - анализатор и выход получают нули.
 * Поэтому через Web Audio играем только CORS-потоки (probeCorsStream),
 * остальные - напрямую на обычном <audio> (NRadioContainer).
 *
 * Элемент для визуализатора создаётся лениво один раз: для каждого
 * <audio> createMediaElementSource допустим только единожды.
 */
let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let audio: HTMLAudioElement | null = null;

// «визуализаторный» элемент: тот, что заведён в Web Audio граф
const getVisualizerAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;

  if (audio) return audio;

  try {
    const AC = window.AudioContext
      || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AC) return null;

    ctx = new AC();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;               // 1024 частотных бинов
    analyser.smoothingTimeConstant = 0.82; // плавность столбиков

    audio = new Audio();
    // CORS-режим: проба (probeCorsStream) уже проверила, что сервер отдаёт
    // ACAO — с crossorigin='anonymous' медиа фетчится как CORS и граф
    // получает данные. Без него cross-origin медиа считается tainted:
    // MediaElementSource выдаёт нули (звук молчит до срабатывания
    // страховки — звук стартовал ~через 30 с). На обычном player это
    // ставить НЕЛЬЗЯ: станции без ACAO перестанут играть вовсе.
    audio.crossOrigin = 'anonymous';
    // preload не трогаем (по умолчанию 'auto'): с 'none' медиа-элемент
    // начинает соединение только на play(), старт затягивается

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    // звук обязан дойти до выхода - иначе тишина
    analyser.connect(ctx.destination);

    return audio;
  } catch {
    // без Web Audio визуализатор просто не работает - плеер не трогаем
    audio = null;
    return null;
  }
};

// AudioContext стартует suspended (autoplay policy) -
// возобновляем по жесту пользователя (клик play)
const resumeVisualizer = (): void => {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => undefined);
  }
};

const getAnalyser = (): AnalyserNode | null => analyser;

// для страховки в NRadioContainer: если контекст не удалось завести
// (autoplay policy), звук через граф не идёт - играем напрямую
const visualizerContextState = (): AudioContextState | 'none' => (ctx ? ctx.state : 'none');

// «граф молчит»: спектр полностью нулевой при играющем элементе.
// Живая тишина в эфире почти невозможна (даже в тихом месте данные > 0),
// поэтому все нули = поток не доходит до выхода
const isAnalyserSilent = (): boolean => {
  if (!analyser) return true;

  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);

  return data.every((v) => v === 0);
};

// CORS-проба потока: fetch с Origin (браузер добавит сам) -
// без CORS запрос упадёт в TypeError. Результат кэшируется по URL.
const corsCache = new Map<string, boolean>();

const probeCorsStream = async (url: string): Promise<boolean> => {
  const cached = corsCache.get(url);
  if (cached !== undefined) return cached;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3000);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
      mode: 'cors',
      signal: ctrl.signal,
    });
    // тело не читаем - сразу закрываем, чтобы не тянуть аудиопоток
    res.body?.cancel().catch(() => undefined);
    corsCache.set(url, res.ok);
    return res.ok;
  } catch {
    corsCache.set(url, false);
    return false;
  } finally {
    clearTimeout(timer);
  }
};

export { getVisualizerAudio, resumeVisualizer, getAnalyser, probeCorsStream, visualizerContextState, isAnalyserSilent };
