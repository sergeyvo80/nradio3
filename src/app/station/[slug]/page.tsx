import stationData from '@/data/station.json';
// import stations from '@/data/stations.json';
import NRadioContainer from '@/containers/NRadioContainer';
import type { Metadata } from 'next';
import React from 'react';
// import useStations from '@/hooks/useStations';
import StationInterface from '@/types/interfaces/StationInterface';
import api from '@/api/apiGraphql';

// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
//   useQuery,
// } from '@tanstack/react-query';

const getStation = (stations: StationInterface[], slug: string) =>
  stations.find((station) => station.slug === slug) || stationData;

interface Props {
  slug: string;
}

interface PageProps {
  params: Promise<Props>;
  // stations: StationInterface[];
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const stations = await api.getStations(0, 100);
  const station = getStation(stations, slug);

  return {
    title: `${station.title} NRadio`,
    description: 'Radio stations player',
  };
};

// TODO: ajust Reqctquery SSR
// export const getServerSideProps = async () => {
// }
// export const getStaticProps = async () => {
//   // const posts = await getPosts()
//   return { props: { stations } }
// }

const StationPage = async ({ params }: PageProps): Promise<React.ReactNode> => {
  const { slug } = await params;

  const stations = await api.getStations(0, 100);

  console.log('>>>', stations[0]);

  // const queryClient = new QueryClient();
  // const fetchStations = (): StationInterface[]  => {
  // console.log('!!!!!!!!>>> stations 2');
  //   return stations;
  // };

  // useEffect(() => {
  //     //
  //   }, [queryClient]);

  // console.log('>>> stations 0');
  // await queryClient.prefetchQuery(['stations'], fetchStations);

  // const { stations: stationsNew, refetch } = useStations();// , chatError, onlineChat, closeChat, setChatId

  // console.log('>>> stations', stations);

  return <NRadioContainer stations={stations} station={getStation(stations, slug)} />;
};

export default StationPage;

// export default function PostsRoute({ dehydratedState }) {
//   return (
//     <HydrationBoundary state={dehydratedState}>
//       <StationPage params={{ slug: 'example' }} />
//     </HydrationBoundary>
//   )
// }
