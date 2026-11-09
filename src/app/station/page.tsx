import React from 'react';

import stationData from '@/data/station.json';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import queryClient from '@/api/reactQueryClient';
import StationsInterface from '@/types/StationsInterface';
import NRadioContainer from '@/containers/NRadioContainer';

import type { Metadata } from 'next';


interface Props {
  station: string;
}

interface PageProps {
  searchParams: Promise<Props>;
  // stations: StationInterface[];
}

export const generateMetadata = async ({ searchParams }: PageProps): Promise<Metadata> => {
  const { station } = await searchParams;

  const stations = queryClient.getQueryData<StationsInterface>(['stations']);
  const stationItem = stations?.find((listing) => listing.slug === station) || stationData;

  return {
    title: `${stationItem.title} -- ${META_TITLE}`,
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
  };
};

const StationPage = async ({ searchParams }: PageProps): Promise<React.ReactNode> => {
  const { station } = await searchParams;

  return <NRadioContainer slug={station} />;
};

export default StationPage;
