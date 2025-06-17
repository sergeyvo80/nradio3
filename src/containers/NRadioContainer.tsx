'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import NRadio from '@/components/NRadio/NRadio';
// import stationData from '@/data/station.json';
// import stations from '@/data/stations.json';
import StationInterface from '@/types/interfaces/StationInterface';

interface Props {
  // slug?: string;
  stations: StationInterface[];
  station: StationInterface;
}



const NRadioContainer = ({ stations, station }: Props) => {
  // const [station, setStation] = useState<StationInterface>(getStation(slug));

  const onPlay = React.useCallback(() => {
    // if (station) {
    //   dispatch(play(station.stream));
    // }
  }, []); // dispatch, station

  const onPause = React.useCallback(() => {
    // dispatch(pause());
  }, []); //dispatch, station

  
  // useEffect(() => {
  //   setStation(getStation(slug));
  // }, [stations, slug]);


// TODO:
const error = undefined;
const player = undefined;

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
        player={player}
        onPlay={onPlay}
        onPause={onPause}
      />
    </>
  );
};

export default NRadioContainer;
