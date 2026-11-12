import React from 'react';

import StationInterface from '@/types/StationInterface';

import StationList from './StationSelectorList/StationSelectorList';
import styles from './StationSelector.module.scss';

interface Props {
  stations: StationInterface[];
  slug: string;
  // slug станции, которая реально воспроизводится (для эквалайзера в списке)
  playingSlug?: string;
  onLike?: (slug: string) => void;
  onSelect?: (slug: string) => void;
  onDeleteStation: (slug: string) => void;
}

const StationSelector = ({
  stations,
  slug,
  playingSlug,
  onLike,
  onSelect,
  onDeleteStation,
}: Props) => (
  <nav className={`${styles.StationSelector} StationSelector`}>
    <StationList
      stations={stations}
      slug={slug}
      playingSlug={playingSlug}
      onLike={onLike}
      onSelect={onSelect}
      onDeleteStation={onDeleteStation}
    />
  </nav>
);

StationSelector.displayName = 'StationSelector';

export default StationSelector;
