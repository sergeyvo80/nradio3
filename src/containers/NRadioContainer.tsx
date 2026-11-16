'use client';

import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import NRadio from '@/components/NRadio/NRadio';
import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import useStations from '@/hooks/useStations';
import stationData from '@/data/station.json';
import NewStationInterface from '@/types/NewStationInterface';
import { META_TITLE } from '@/constants/meta';
import { initTheme } from '@/theme/theme';
import { getVisualizerAudio, resumeVisualizer, probeCorsStream, visualizerContextState, isAnalyserSilent } from '@/api/visualizerEngine';

const LAST_STATION_KEY = 'lastStation';

const player = typeof Audio !== 'undefined' ? new Audio() : undefined;

// элемент, на котором играем сейчас: «визуализаторный» (CORS-потоки,
// через Web Audio) или обычный player (остальные - напрямую)
let currentPlayer: HTMLAudioElement | undefined = player;

// потоки, у которых Web Audio граф молчит (контекст suspended и т.п.) -
// играем их сразу напрямую, без 4-секундного ожидания страховки
const silentRoutedStreams = new Set<string>();

interface Props {
  slug: string
}

const NRadioContainer = ({ slug }: Props) => {
  const {
    stations,
    likeMutate,
    newStationMutate,
    deleteStationMutate,
  } = useStations();

  // PWA/serverless: активная станция живёт в клиентском состоянии,
  // переключение — без обращения к серверу (важно для офлайна);
  // серверный prop slug — только стартовое значение (SSR/ прямой заход по ссылке)
  const [activeSlug, setActiveSlug] = useState<string>(slug);
  const [station, setStation] = useState<StationInterface>(() =>
    stations.find((station: StationInterface) => station.slug === slug) || stationData
  );
  const [playerState, setPlayerState] = useState<PlayerStateEnum>(PlayerStateEnum.Paused);
  const [error, setError] = useState<string>();

  // номер актуального запуска воспроизведения. Любой новый play()/pause()
  // и смена станции делают предыдущий асинхронный запуск (CORS-проба до 3 с +
  // буферизация) устаревшим: его колбэки не должны трогать состояние и звук
  const playTokenRef = useRef<number>(0);

  const like = useCallback((slug: string) => {
    likeMutate(slug);
  }, [likeMutate]);

  // выбор станции из списка: состояние + адресная строка, без перехода к серверу
  const selectStation = useCallback((nextSlug: string) => {
    if (nextSlug === activeSlug) return;
    setActiveSlug(nextSlug);
    try {
      // запоминаем последнюю выбранную (воспроизводимую) станцию — она
      // откроется при следующем старте приложения/PWA
      window.localStorage.setItem(LAST_STATION_KEY, nextSlug);
      // history.state сохраняем, чтобы не ломать внутреннее состояние Next-роутера
      window.history.replaceState(window.history.state, '', `?station=${nextSlug}`);
    } catch {
      // окружения без localStorage/history API — просто меняем станцию
    }
  }, [activeSlug]);


  // play() возвращает промис: браузер может отклонить его
  // (autoplay policy, сеть и т.д.), поэтому PlayerStateEnum.Playing
  // ставится только после успешного старта.
  // CORS-проба: потоки с Access-Control-Allow-Origin играем через Web Audio
  // (визуализатор), без CORS - напрямую на обычном <audio>: пропуск чужого
  // потока через MediaElementSource глушит звук (см. visualizerEngine.ts)
  const play = useCallback(() => {
    setError(undefined);

    if (!player) {
      setPlayerState(PlayerStateEnum.Paused);
      return;
    }

    setPlayerState(PlayerStateEnum.Play);

    // новый запуск делает все предыдущие устаревшими
    const token = ++playTokenRef.current;

    const start = async () => {
      // контекст Web Audio создаём и заводим СИНХРОННО в жесте клика:
      // await ниже выходит из контекста жеста, и отложенный resume
      // может не пройти (autoplay policy)
      const routed = silentRoutedStreams.has(station.stream) ? null : getVisualizerAudio();
      resumeVisualizer();

      // тянем поток сразу, пока идёт CORS-проба - экономит время
      // соединения на первом запуске станции
      if (routed) {
        const abs = new URL(station.stream, window.location.href).href;
        if (routed.src !== abs) routed.src = station.stream;
      }

      const cors = process.env.NEXT_PUBLIC_DISABLE_PLAY
        ? false
        : await probeCorsStream(station.stream);

      // запуск устарел (станцию сменили или нажали паузу, пока шла проба):
      // ничего не трогаем — актуальный запуск сам остановит старый элемент
      if (playTokenRef.current !== token) {
        return;
      }

      const el = (cors ? routed : null) || player;

      // останавливаем другой элемент, если играли через него
      if (currentPlayer && currentPlayer !== el) {
        currentPlayer.pause();
        if (currentPlayer === routed) {
          routed.removeAttribute('src');
          routed.load(); // обрываем лишнюю загрузку, если проба не прошла
        }
      }
      currentPlayer = el;

      // перезапускать поток не нужно, если этот элемент уже его тянет
      const abs = new URL(station.stream, window.location.href).href;
      if (el.src !== abs) el.src = station.stream;

      if (process.env.NEXT_PUBLIC_DISABLE_PLAY) {
        setPlayerState(PlayerStateEnum.Playing);
        return;
      }

      // AudioContext стартует suspended - возобновляем по жесту пользователя
      resumeVisualizer();

      el.play()
        .then(() => {
          // промис дозрел после смены станции/паузы. Если элемент переиспользован
          // актуальным запуском (тот же player) — не глушим; иначе останавливаем,
          // чтобы старый поток не заиграл внезапно
          if (playTokenRef.current !== token) {
            if (currentPlayer !== el) {
              el.pause();
            }
            return;
          }

          setPlayerState(PlayerStateEnum.Playing);

          // страховка звука. Два случая:
          //  - контекст suspended (autoplay policy) - звук не пойдёт никогда,
          //    перескакиваем быстро (2 с);
          //  - контекст running, но аналайзер молчит - это нормальная
          //    БУФЕРИЗАЦИЯ потока (соединение + буфер до нескольких секунд),
          //    убивать её нельзя - ждём долго (12 с) и только если тишина
          //    не кончается, считаем граф мёртвым
          if (el !== player) {
            let silentSeconds = 0;
            const watchdog = setInterval(() => {
              // устаревший запуск: элемент уже отдал актуальному
              if (playTokenRef.current !== token || currentPlayer !== el || el.paused) {
                clearInterval(watchdog);
                return;
              }
              const ctxBad = visualizerContextState() !== 'running';
              const silent = ctxBad || isAnalyserSilent();
              silentSeconds = silent ? silentSeconds + 1 : 0;
              const shouldFallback = (ctxBad && silentSeconds >= 2) || silentSeconds >= 12;
              if (shouldFallback) {
                clearInterval(watchdog);
                silentRoutedStreams.add(station.stream);
                if (currentPlayer === el) {
                  el.pause();
                  currentPlayer = player;
                  player.src = station.stream;
                  player.play().catch(() => undefined);
                  // маркер срабатывания страховки (для отладки звука)
                  window.dispatchEvent(new CustomEvent('nr-audio-fallback'));
                }
              }
            }, 1000);
          }
        })
        .catch((err: unknown) => {
          // промис отклонён после смены станции/паузы — не наша забота
          if (playTokenRef.current !== token) {
            return;
          }
          // проба ACAO прошла, но медиа-запрос CORS не прошёл (редкий сервер):
          // страховка — прямой элемент, как делает watchdog при тишине графа
          if (el !== player) {
            el.pause();
            if (el === routed) {
              routed.removeAttribute('src');
              routed.load();
            }
            currentPlayer = player;
            player.src = station.stream;
            player.play().catch(() => undefined);
            setPlayerState(PlayerStateEnum.Playing);
            window.dispatchEvent(new CustomEvent('nr-audio-fallback'));
            return;
          }
          setPlayerState(PlayerStateEnum.Paused);
          setError(err instanceof Error ? `Error playing: ${err.message}` : 'Error playing: unknown');
        });
    };

    start();
  }, [station]);
  

  const newStationAdd = (data: NewStationInterface) => {
    const uuid = crypto.randomUUID();

    newStationMutate({
      ...data,
      uuid,
      slug: uuid,
      description: '',
      website: '',
      tags: [],
    });
  };

  const onDeleteStationHandler = (slug: string) => {
    deleteStationMutate(slug);
    console.log('>>> onDeleteStationHandler', slug);
  };

  const pause = () => {
    try {
      // пауза отменяет недозревший запуск: колбэки старой станции не должны
      // заиграть после нажатия паузы
      playTokenRef.current += 1;
      setPlayerState(PlayerStateEnum.Pause);
      if (player) {
        currentPlayer?.pause();
        setPlayerState(PlayerStateEnum.Paused);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? `Error pause: ${err.message}` : 'Unknown error');
    }
  };

  // автозапуск play() при монтировании убран: браузер блокирует воспроизведение
  // до первого взаимодействия пользователя (autoplay policy)
  useEffect(() => {
    setStation(stations.find((station: StationInterface) => station.slug === activeSlug) || stationData);
  }, [activeSlug, stations]);

  // тема: восстановить выбранную (Yaru/Aurora) при старте;
  // custom-тему пикера восстанавливает сам ColorPicker
  useEffect(() => {
    initTheme();
  }, []);

  // запуск: URL имеет приоритет (глубокая ссылка), затем восстановление последней
  // воспроизводимой станции из localStorage — она же отражается в адресе
  useEffect(() => {
    const urlSlug = new URLSearchParams(window.location.search).get('station');
    if (urlSlug) {
      setActiveSlug(urlSlug);
      return;
    }
    try {
      const saved = window.localStorage.getItem(LAST_STATION_KEY);
      if (saved) {
        setActiveSlug(saved);
        window.history.replaceState(window.history.state, '', `?station=${saved}`);
      }
    } catch {
      // нет доступа к localStorage — откроется стартовая станция
    }
  }, []);

  // back/forward в браузере — синхронизация с ?station= из истории
  useEffect(() => {
    const onPopState = () => {
      const urlSlug = new URLSearchParams(window.location.search).get('station');
      if (urlSlug) {
        setActiveSlug(urlSlug);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // каждая появившаяся на экране станция — «последняя воспроизводимая»
  // (заодно перекрывает дефолт, записанный до завершения восстановления)
  useEffect(() => {
    try {
      window.localStorage.setItem(LAST_STATION_KEY, station.slug);
    } catch {
      // нет доступа к localStorage
    }
  }, [station]);

  // при смене станции продолжаем играть, если плеер играл ИЛИ грузится:
  // клик по станции всегда переключает поток и сбрасывает запуск
  // предыдущей (старый запуск отменяется токеном внутри play())
  useEffect(() => {
    if (player && (playerState === PlayerStateEnum.Playing || playerState === PlayerStateEnum.Play)) {
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- реагируем только на смену станции
  }, [station]);

  // заголовок окна/вкладки — за станцией (в standalone-окне PWA виден сразу).
  // Next при hydration переписывает <title> своим RSC-метадата (для офлайн-shell
  // отдающей SSR «дефолтную» станцию), поэтому повторяем через 100 мс
  useEffect(() => {
    const title = `${station.title} -- ${META_TITLE}`;
    document.title = title;
    const retry = window.setTimeout(() => {
      if (document.title !== title) {
        document.title = title;
      }
    }, 100);
    return () => window.clearTimeout(retry);
  }, [station]);

  return (
    <NRadio
      title="NRadio"
      stations={stations}
      station={station}
      error={error}
      playerState={playerState}
      onPlay={play}
      onPause={pause}
      onLike={like}
      onNewStationAdd={newStationAdd}
      onSelect={selectStation}
      onDeleteStation={onDeleteStationHandler}
    />
  );
};

export default NRadioContainer;
