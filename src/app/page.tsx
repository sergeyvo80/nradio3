import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import StationInterface from '@/types/interfaces/StationInterface';
import queryClient from '@/api/reactQueryClient';
import { dehydrate } from '@tanstack/react-query';
import { type Metadata } from 'next';
import api from '@/api/apiGraphql';
import NRadioQueryContainer from '@/containers/NRadioQueryContainer';
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


const Home = async (): Promise<React.ReactNode> => {
  let stations: StationInterface[] = [];

  await queryClient.prefetchQuery({
    queryKey: ['stations'], 
    queryFn: async () => {
      stations = await api.getStations(0, 100);
      console.log('Stations', stations.length);
      return stations;
    }
  });

  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });

  // TODO: state only
  return (
    <NRadioQueryContainer
      slug={''}
      state={state}
    />
  );

};

export default Home;
