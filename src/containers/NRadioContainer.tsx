'use client';

import NRadio from '@/components/NRadio/NRadio';
import StationInterface from '@/types/StationInterface';
import { useCallback, useEffect, useState } from 'react';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import { getLocalStorage, setLocalStorage } from '@/api/localStorage';
import useStations from '@/hooks/useStations';
import stationData from '@/data/station.json';
import NewStationInterface from '@/types/NewStationInterface';

const player = typeof Audio !== 'undefined' ? new Audio() : undefined;

const getLikeStations = (): string[] => getLocalStorage('likeStations', []) as string[];


interface Props {
  slug: string
}

const NRadioContainer = ({ slug }: Props) => {
  const { stations, likeMutate } = useStations();
  const selectedStation = stations.find((station: StationInterface) => station.slug === slug) || stationData;

  const [station, setStation] = useState<StationInterface>(selectedStation);
  const [playerState, setPlayerState] = useState<PlayerStateEnum>(PlayerStateEnum.Pause);
  const [error, setError] = useState<string>();

  const like = useCallback((slug: string) => {
    likeMutate(slug);

    const likeStations = getLikeStations();
    const likeIndex = likeStations.indexOf(slug);

    if (likeIndex === -1) {
      setLocalStorage('likeStations', [...likeStations, slug]);
    } else {
      likeStations.splice(likeIndex, 1);
      setLocalStorage('likeStations', likeStations);
    }

    // setStations(getPreparedStations(stations));
  }, [likeMutate]);


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
  

  const newStationAdd = (data: NewStationInterface) => {
    console.log('>>> newStationAdd', data);
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

  useEffect(() => {
    play();
  }, [play]);

  useEffect(() => {
    setStation(stations.find((station: StationInterface) => station.slug === slug) || stationData);
  }, [slug, stations]);

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
    />
  );
};

export default NRadioContainer;
