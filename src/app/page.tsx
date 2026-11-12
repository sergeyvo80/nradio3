import React from 'react';

import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import findStationBySlug from '@/utils/findStationBySlug';
import NRadioContainer from '@/containers/NRadioContainer';

import type { Metadata } from 'next';

const DEFAULT_SLUG = 'groove-salad-soma-fm';

// SSG: главная не читает searchParams — выбор станции целиком клиентский
// (NRadioContainer сам учитывает ?station= и lastStation при монтировании),
// поэтому страница прегенерируется в статический html
export const generateMetadata = (): Metadata => {
  const stationItem = findStationBySlug();

  return {
    title: `${stationItem.title} -- ${META_TITLE}`,
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
  };
};

const HomePage = (): React.ReactNode => {
  return <NRadioContainer slug={DEFAULT_SLUG} />;
};

export default HomePage;
