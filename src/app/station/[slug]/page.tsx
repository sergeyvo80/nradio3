import React from 'react';

import stationData from '@/data/station.json';
import stationsData from '@/data/stations.json';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import findStationBySlug from '@/utils/findStationBySlug';
import StationInterface from '@/types/StationInterface';
import NRadioContainer from '@/containers/NRadioContainer';

import type { Metadata } from 'next';

interface Props {
  slug: string;
}

interface PageProps {
  params: Promise<Props>;
}

// SSG: прегенерируем страницу для каждой станции из локального json
// (+ стартовая). Неизвестные слаги (например, локальные станции пользователя
// с uuid) по-прежнему рендерятся по запросу — dynamicParams включён по умолчанию
export function generateStaticParams(): Array<{ slug: string }> {
  const stations = stationsData as unknown as StationInterface[];
  return [
    ...stations.map((station) => ({ slug: station.slug })),
    { slug: stationData.slug },
  ];
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;

  const station = findStationBySlug(slug);

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
      canonical: `${process.env.BASE_URL}/station/${station.slug}`,
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
