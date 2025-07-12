import NRadioContainer from '@/containers/NRadioContainer';
import stationData from '@/data/station.json';
import stationsData from '@/data/stations.json';
import api from '@/api/apiGraphql';

export const metadata = {
  title: "NRadio",
};

const Home = (): React.ReactNode => {
  // const stations = process.env.NEXT_GRAPHQL_URL 
  //   ? await api.getStations(0, 100) 
  //   : stationsData;
    const stations = stationsData;

  return <NRadioContainer stations={stations} station={stationData} />;
};

export default Home;
