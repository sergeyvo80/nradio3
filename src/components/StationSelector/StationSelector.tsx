import React from 'react';
import StationInterface from '@/types/interfaces/StationInterface';
import StationList from './StationSelectorList/StationSelectorList';
import styles from './StationSelector.module.scss';

interface Props {
  stations: StationInterface[];
  slug: string;
  onLike?: (slug: string) => void;
}

const StationSelector = ({
  stations,
  slug,
  onLike = () => {},
}: Props) => (
  <nav className={`${styles.StationSelector} StationSelector`}>
    <StationList stations={stations} slug={slug} onLike={onLike} />
  </nav>
);

export default StationSelector;
