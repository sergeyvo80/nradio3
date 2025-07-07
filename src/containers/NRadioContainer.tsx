'use client';

import NRadio from '@/components/NRadio/NRadio';
import StationInterface from '@/types/interfaces/StationInterface';
import { useCallback, useEffect, useState } from 'react';
import PlayerStateEnum from '@/types/enums/PlayerStateEnum';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';

const player = typeof Audio !== 'undefined' ? new Audio() : undefined;

const getLikeStations = (): string[] => getLocalStorage('likeStations', []) as string[];

const sortStations = (stations: StationInterface[]) =>
  stations
    .map((station) => ({
      ...station,
      isLiked: getLikeStations().includes(station.slug),
    }))
    .sort((a, b) => Number(b.isLiked) - Number(a.isLiked));

interface Props {
  stations: StationInterface[];
  station: StationInterface;
}

const NRadioContainer = ({ stations, station }: Props) => {
  const [stationsState, setStationsState] = useState<StationInterface[]>([]);
  const [playerState, setPlayerState] = useState<PlayerStateEnum>(PlayerStateEnum.Pause);
  const [error, setError] = useState<string>();

  // const getLikeStations = (): string[] =>  getLocalStorage('likeStations', []) as string[];

  const like = (slug: string) => {
    const likeStations = getLikeStations();
    const likeIndex = likeStations.indexOf(slug);

    if (likeIndex === -1) {
      setLocalStorage('likeStations', [...likeStations, slug]);
    } else {
      likeStations.splice(likeIndex, 1);
      setLocalStorage('likeStations', likeStations);
    }

    setStationsState(sortStations(stationsState));
  };

  useEffect(() => {
    setStationsState(sortStations(stations));
  }, [stations]);

  const play = useCallback(() => {
    try {
      setError(undefined);
      setPlayerState(PlayerStateEnum.Play);

      if (player) {
        player.src = station.stream;

        if (!process.env.NEXT_PUBLIC_DISABLE_PLAY) {
          player.play();
        }

        setPlayerState(PlayerStateEnum.Playing);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? `Error playing: ${err.message}` : 'Unknown error');
    }
  }, [station]);

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

  useEffect(() => {
    play();
  }, [stations, station, play]);

  return (
    <NRadio
      title="NRadio"
      stations={stations}
      station={stationsState.find((stationItem) => stationItem.slug === station.slug) || station}
      error={error}
      playerState={playerState}
      onPlay={play}
      onPause={pause}
      onLike={like}
    />
  );
};

export default NRadioContainer;
