import stationData from '@/data/station.json';
import NRadioQueryContainer from '@/containers/NRadioQueryContainer';
import type { Metadata } from 'next';
import React from 'react';
import StationInterface from '@/types/interfaces/StationInterface';
import api from '@/api/apiGraphql';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { dehydrate } from '@tanstack/react-query';
import queryClient from '@/api/reactQueryClient';

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
    title: `${station.title} -- ${META_TITLE}`,
    description: META_DESCRIPTION,
    openGraph: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      url: process.env.BASE_URL,
      // images: {
      //   url: '',
      //   width: 1200,
      //   height: 630,
      // },
      siteName: process.env.BASE_URL,
    },
    alternates: {
      canonical: process.env.BASE_URL,
    },
    icons: {
      icon: '/favicon.ico',
    },

  };
};

const StationPage = async ({ params }: PageProps): Promise<React.ReactNode> => {
  const { slug } = await params;

  let stations: StationInterface[] = [];

  await queryClient.prefetchQuery({
    queryKey: ['stations'], 
    queryFn: async () => {
      stations = await api.getStations(0, 100);
      console.log('Stations', stations.length);
      return stations;
    }
  });

  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });

  // TODO: state only
  return (
    <NRadioQueryContainer
      slug={slug}
      state={state}
    />
  );
};

export default StationPage;
