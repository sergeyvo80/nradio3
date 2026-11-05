'use client';

import React from 'react';
import { useCallback, useEffect, useState } from 'react';

import NRadio from '@/components/NRadio/NRadio';
import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import useStations from '@/hooks/useStations';
import stationData from '@/data/station.json';
import NewStationInterface from '@/types/NewStationInterface';

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

  const selectedStation = stations.find((station: StationInterface) => station.slug === slug) || stationData;

  const [station, setStation] = useState<StationInterface>(selectedStation);
  const [playerState, setPlayerState] = useState<PlayerStateEnum>(PlayerStateEnum.Paused);
  const [error, setError] = useState<string>();

  const like = useCallback((slug: string) => {
    likeMutate(slug);
  }, [likeMutate]);


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
    setStation(stations.find((station: StationInterface) => station.slug === slug) || stationData);
  }, [slug, stations]);

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
      onDeleteStation={onDeleteStationHandler}
    />
  );
};

export default NRadioContainer;
