import NRadioContainer from '@/containers/NRadioContainer';
import stationData from '@/data/station.json';
import stations from '@/data/stations.json';


const Home = (): React.ReactNode => {
  return <NRadioContainer stations={stations} station={stationData} />
}

export default Home;