'use client';

import NRadio from '@/components/NRadio/NRadio';
import StationInterface from '@/types/interfaces/StationInterface';
import { memo, useCallback, useEffect, useState } from 'react';
import PlayerStateEnum from '@/types/enums/PlayerStateEnum';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';
import queryClient from '@/utils/reactQueryClient';

import {
  hydrate,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
  /* eslint-disable */
  state: any,
  stations: StationInterface[];
  station: StationInterface;
  // slug: string
}

const NRadioContainer = memo(({
  stations, station, state
}: Props) => {

  hydrate(queryClient, state);

  const [stationsState, setStationsState] = useState<StationInterface[]>(sortStations(stations));
  const [playerState, setPlayerState] = useState<PlayerStateEnum>(PlayerStateEnum.Pause);
  const [error, setError] = useState<string>();


  const like = useCallback((slug: string) => {
    const likeStations = getLikeStations();
    const likeIndex = likeStations.indexOf(slug);

    if (likeIndex === -1) {
      setLocalStorage('likeStations', [...likeStations, slug]);
    } else {
      likeStations.splice(likeIndex, 1);
      setLocalStorage('likeStations', likeStations);
    }

    setStationsState(sortStations(stationsState));
  }, [stationsState]);


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
    <QueryClientProvider client={queryClient}>
      <NRadio
        title="NRadio"
        stations={stationsState}
        station={station}
        error={error}
        playerState={playerState}
        onPlay={play}
        onPause={pause}
        onLike={like}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
});

export default NRadioContainer;
