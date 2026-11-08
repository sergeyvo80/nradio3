import React from 'react';

import stationData from '@/data/station.json';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import queryClient from '@/api/reactQueryClient';
import StationsInterface from '@/types/StationsInterface';
import NRadioContainer from '@/containers/NRadioContainer';

import type { Metadata } from 'next';

const DEFAULT_SLUG = 'groove-salad-soma-fm';

interface Props {
  station: string;
}

interface PageProps {
  searchParams: Promise<Props>;
}

export const generateMetadata = async ({ searchParams }: PageProps): Promise<Metadata> => {
  const { station } = await searchParams;

  const stations = queryClient.getQueryData<StationsInterface>(['stations']);
  const stationItem = stations?.find((listing) => listing.slug === (station ?? DEFAULT_SLUG)) || stationData;

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
    icons: {
      icon: '/favicon.ico',
    },

  };
};

const HomePage = async ({ searchParams }: PageProps): Promise<React.ReactNode> => {
  const { station } = await searchParams;

  return <NRadioContainer slug={station || DEFAULT_SLUG} />;
};

export default HomePage;
