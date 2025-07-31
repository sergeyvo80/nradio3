'use client';

import NRadio from '@/components/NRadio/NRadio';
import StationInterface from '@/types/interfaces/StationInterface';
import { useCallback, useEffect, useState } from 'react';
import PlayerStateEnum from '@/types/enums/PlayerStateEnum';
import { getLocalStorage, setLocalStorage } from '@/api/localStorage';
import useStations from '@/hooks/useStations';
import stationData from '@/data/station.json';

const player = typeof Audio !== 'undefined' ? new Audio() : undefined;

const getLikeStations = (): string[] => getLocalStorage('likeStations', []) as string[];

// TODO: move to mutation of useStation
const getPreparedStations = (stations: StationInterface[]) =>
  stations
    .map((station) => ({
      ...station,
      isLiked: getLikeStations().includes(station.slug),
    }))
    .sort((a, b) => Number(b.isLiked) - Number(a.isLiked));

interface Props {
  slug: string
}

const NRadioContainer = ({ slug }: Props) => {

  const { stationsData } = useStations();

  const preparedStations = getPreparedStations(stationsData);
  const selectedStation = preparedStations.find((station) => station.slug === slug) || stationData;

  const [stations, setStations] = useState<StationInterface[]>(preparedStations);
  
  const [station, setStation] = useState<StationInterface>(selectedStation);
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

    setStations(getPreparedStations(stations));
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
  }, [play]);

  useEffect(() => {
console.log('>>>>');
  }, []);


  useEffect(() => {
    setStation(stations.find((station) => station.slug === slug) || stationData);
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
    />
  );
};

export default NRadioContainer;
