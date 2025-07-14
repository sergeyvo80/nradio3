import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import NRadioContainer from '@/containers/NRadioContainer';
import stationData from '@/data/station.json';
import stationsData from '@/data/stations.json';
import { type Metadata } from 'next';
// import api from '@/api/apiGraphql';


export const generateMetadata = (): Metadata => {
  return {
    title: META_TITLE,
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


// export const metadata = {
//   title: "NRadio - internet radio station player",  
// };

const Home = (): React.ReactNode => {
  // const stations = process.env.NEXT_GRAPHQL_URL 
  //   ? await api.getStations(0, 100) 
  //   : stationsData;
  const stations = stationsData;

  return <NRadioContainer stations={stations} station={stationData} />;
};

export default Home;
