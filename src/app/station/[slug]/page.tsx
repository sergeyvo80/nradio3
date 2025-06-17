import stationData from '@/data/station.json';
import stations from '@/data/stations.json';
import NRadioContainer from '@/containers/NRadioContainer';

interface Props {
  slug: string;
}

const getStation = (slug: string) => stations.find((station) => station.slug === slug) || stationData;

const StationPage = ({ params }: { params: Props }): React.ReactNode => {
  return (
    <NRadioContainer
      stations={stations}
      station={getStation(params.slug)}
    />
  );
}

export default StationPage;
