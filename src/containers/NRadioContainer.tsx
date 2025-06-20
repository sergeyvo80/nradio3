'use client';

import NRadio from '@/components/NRadio/NRadio';
import StationInterface from '@/types/interfaces/StationInterface';
import { useCallback, useEffect, useState } from 'react';
import PlayerStateEnum from '@/types/enums/PlayerStateEnum';

const player = typeof Audio !== 'undefined' ? new Audio() : undefined;

interface Props {
  stations: StationInterface[];
  station: StationInterface;
}

const NRadioContainer = ({ stations, station }: Props) => {
  const [playerState, setPlayerState] = useState<PlayerStateEnum>(PlayerStateEnum.Pause);
  const [error, setError] = useState<string>();

  const play = useCallback(() => {
    try {
      setError(undefined);
      setPlayerState(PlayerStateEnum.Play);

      if (player) {
        player.src = station.stream;

        player.play();

        setPlayerState(PlayerStateEnum.Playing);
      }
    } catch (err: unknown) {
      setError((err instanceof Error) ? `Error playing: ${err.message}` : 'Unknown error');
    }
  }, [player, station]);

  const pause = useCallback(() => {
    try {
      setPlayerState(PlayerStateEnum.Pause);
      if (player) {
        player.pause();
        setPlayerState(PlayerStateEnum.Paused);
      }
    } catch (err: unknown) {
      setError((err instanceof Error) ? `Error pause: ${err.message}` : 'Unknown error');
    }
  }, [player]);

  
  useEffect(() => {
    play();
  }, [stations, station]);

  return (
    <NRadio
      title="NRadio"
      stations={stations}
      station={station}
      error={error}
      playerState={playerState}
      onPlay={play}
      onPause={pause}
    />
  );
};

export default NRadioContainer;
