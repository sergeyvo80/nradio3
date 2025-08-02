import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next';
import NRadioContainer from '@/containers/NRadioContainer';


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

const Home = async (): Promise<React.ReactNode> => <NRadioContainer slug="groove-salad-soma-fm" />;

export default Home;
