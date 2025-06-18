import stationData from '@/data/station.json';
import stations from '@/data/stations.json';
import NRadioContainer from '@/containers/NRadioContainer';
import type { Metadata } from 'next';
import React from 'react';

const getStation = (slug: string) => stations.find((station) => station.slug === slug) || stationData;
interface Props {
  slug: string;
}

interface PageProps {
  params: Promise<Props>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const station = getStation(slug);

  return {
    title: `${station.title} NRadio`,
    description:  "Radio stations player",
  };
};


const StationPage = async ({ params }: PageProps): Promise<React.ReactNode> => {
  const { slug } = await params;

  return (
    <NRadioContainer
      stations={stations}
      station={getStation(slug)}
    />
  );
}

export default StationPage;
