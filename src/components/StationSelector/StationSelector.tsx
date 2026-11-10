import React from 'react';

import StationInterface from '@/types/StationInterface';

import StationList from './StationSelectorList/StationSelectorList';
import styles from './StationSelector.module.scss';

interface Props {
  stations: StationInterface[];
  slug: string;
  onLike?: (slug: string) => void;
  onSelect?: (slug: string) => void;
  onDeleteStation: (slug: string) => void;
}

const StationSelector = ({
  stations,
  slug,
  onLike,
  onSelect,
  onDeleteStation,
}: Props) => (
  <nav className={`${styles.StationSelector} StationSelector`}>
    <StationList
      stations={stations}
      slug={slug}
      onLike={onLike}
      onSelect={onSelect}
      onDeleteStation={onDeleteStation}
    />
  </nav>
);

StationSelector.displayName = 'StationSelector';

export default StationSelector;
