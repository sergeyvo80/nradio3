'use client';

import React from 'react';
import { useCallback, useEffect, useState } from 'react';

import NRadio from '@/components/NRadio/NRadio';
import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import useStations from '@/hooks/useStations';
import stationData from '@/data/station.json';
import NewStationInterface from '@/types/NewStationInterface';
import { META_TITLE } from '@/constants/meta';
import { initTheme } from '@/theme/theme';

const LAST_STATION_KEY = 'lastStation';

const player = typeof Audio !== 'undefined' ? new Audio() : undefined;

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
  // ставится только после успешного старта
  const play = useCallback(() => {
    setError(undefined);

    if (!player) {
      setPlayerState(PlayerStateEnum.Paused);
      return;
    }

    setPlayerState(PlayerStateEnum.Play);
    player.src = station.stream;

    if (process.env.NEXT_PUBLIC_DISABLE_PLAY) {
      setPlayerState(PlayerStateEnum.Playing);
      return;
    }

    player
      .play()
      .then(() => setPlayerState(PlayerStateEnum.Playing))
      .catch((err: unknown) => {
        setPlayerState(PlayerStateEnum.Paused);
        setError(err instanceof Error ? `Error playing: ${err.message}` : 'Error playing: unknown');
      });
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
      setPlayerState(PlayerStateEnum.Pause);
      if (player) {
        player.pause();
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

  // при смене станции продолжаем играть, если пользователь уже запустил плеер
  useEffect(() => {
    if (player && playerState === PlayerStateEnum.Playing) {
      player.src = station.stream;
      player.play().catch((err: unknown) => {
        setPlayerState(PlayerStateEnum.Paused);
        setError(err instanceof Error ? `Error playing: ${err.message}` : 'Error playing: unknown');
      });
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
