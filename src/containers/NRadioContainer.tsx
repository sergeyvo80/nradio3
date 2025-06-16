'use client';

import React from 'react';
// import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { NRadio } from '@/components/NRadio/NRadio';
import stationData from '@/data/station.json';
import stationList from '@/data/stations.json';
// import { getStationList, getStation, play, pause } from '../features/nradio/nradioSlice';
// import {
//   getStationListState,
//   getStationState,
//   getPlayerState,
//   getErrorState,
// } from '../selectors/nradio';

export const NRadioContainer = () => {
  // const dispatch = useDispatch();
  // const stationList = useSelector(getStationListState);
  // const station = useSelector(getStationState);
  // const player = useSelector(getPlayerState);
  // const error = useSelector(getErrorState);
  // const { slug } = useRouter().query;

  // Moved on server
  //     React.useEffect(
  //         () => {
  //             dispatch(getStationList());
  //         },
  //         [dispatch]
  //     );

  // React.useEffect(() => {
  //   dispatch(getStation(!Array.isArray(slug) ? slug : stationData.slug));
  // }, [dispatch, slug]);

  // React.useEffect(() => {
  //   if (station) {
  //     dispatch(play(station.stream));
  //   }
  // }, [dispatch, station]);

  const onPlay = React.useCallback(() => {
    // if (station) {
    //   dispatch(play(station.stream));
    // }
  }, []); // dispatch, station

  const onPause = React.useCallback(() => {
    // dispatch(pause());
  }, []); //dispatch, station


// TODO:
const error = undefined;
const player = undefined;
const station = stationData;


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
        stationList={stationList}
        station={station || stationData}
        error={error}
        player={player}
        onPlay={onPlay}
        onPause={onPause}
      />
    </>
  );
};
