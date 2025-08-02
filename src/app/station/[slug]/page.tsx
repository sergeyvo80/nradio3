import stationData from '@/data/station.json';
import type { Metadata } from 'next';
import React from 'react';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import queryClient from '@/api/reactQueryClient';
import { StationsInterface } from '@/types/interfaces/graphql/api';
import NRadioContainer from '@/containers/NRadioContainer';


interface Props {
  slug: string;
}

interface PageProps {
  params: Promise<Props>;
  // stations: StationInterface[];
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;

  const stations = queryClient.getQueryData<StationsInterface>(['stations']);
  const station = stations?.find((station) => station.slug === slug) || stationData;

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

  return (
    <NRadioContainer slug={slug} />
  );
};

export default StationPage;
