'use client';

import Head from 'next/head';
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
        console.log('>> onPlay', station);

        player.src = station.stream;
        player.play();

        setPlayerState(PlayerStateEnum.Playing);
      }
    } catch (err: any) {
      setError(`Error playing: ${err.message}`);
    }
  }, [player, station]);

  const pause = useCallback(() => {
    try {
      setPlayerState(PlayerStateEnum.Pause);
      if (player) {
        player.pause();
        setPlayerState(PlayerStateEnum.Paused);
      }
    } catch (err: any) {
      setError(`Error playing: ${err.message}`);
    }
  }, [player]);

  
  useEffect(() => {
    play();
  }, [stations, station]);

  return (
    <>
      <Head>
        {/*<!-- Global Site Tag (gtag.js) - Google Analytics -->*/}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-0R759M4XXF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-0R759M4XXF', {
                    page_path: window.location.pathname,
                });
                `,
          }}
        /> */}
        <title>{station && station.title ? station.title : 'NRadio.space'}</title>
      </Head>
      <NRadio
        title="NRadio.space"
        stations={stations}
        station={station}
        error={error}
        playerState={playerState}
        onPlay={play}
        onPause={pause}
      />
    </>
  );
};

export default NRadioContainer;
