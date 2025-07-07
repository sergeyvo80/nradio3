import NRadioContainer from '@/containers/NRadioContainer';
import stationData from '@/data/station.json';
import api from '@/api/apiGraphql';

const Home = async (): Promise<React.ReactNode> => {
  const stations = await api.getStations(0, 100);
  return <NRadioContainer stations={stations} station={stationData} />;
};

export default Home;
