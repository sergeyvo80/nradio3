import stationData from '@/data/station.json';
import stations from '@/data/stations.json';
import NRadioContainer from '@/containers/NRadioContainer';
import React from 'react';

interface Props {
  slug: string;
}

const getStation = (slug: string) => stations.find((station) => station.slug === slug) || stationData;

const StationPage = async ({ params }: { params: Props }): Promise<React.ReactNode> => {

  const { slug } = await params;

  return (
    <NRadioContainer
      stations={stations}
      station={getStation(slug)}
    />
  );
}

export default StationPage;
