import React from 'react';

import StationInterface from '@/types/StationInterface';

import StationSelectorItem from '../StationSelectorItem/StationSelectorItem';

import styles from './StationSelectorList.module.scss';

interface Props {
  stations: StationInterface[];
  slug: string;
  onLike?: (slug: string) => void;
  onSelect?: (slug: string) => void;
  onDeleteStation: (slug: string) => void;
}

const StationSelectorList = ({
  stations,
  slug,
  onLike,
  onSelect,
  onDeleteStation,
}: Props) => (
  <ul className={styles.StationSelectorList}>
    {stations.map((station) => (
      <StationSelectorItem
        station={station}
        key={station.slug}
        isCurrent={station.slug === slug}
        isLiked={station.isLiked || false}
        onLike={onLike}
        onSelect={onSelect}
        onDeleteStation={onDeleteStation}
      />
    ))}
  </ul>
);

export default StationSelectorList;
