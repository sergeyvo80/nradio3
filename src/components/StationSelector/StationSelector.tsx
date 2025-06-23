import React from 'react';
import StationInterface from '../../types/interfaces/StationInterface';
import StationList from './StationSelectorList/StationSelectorList';
import styles from './StationSelector.module.scss';

interface Props {
  stations: StationInterface[];
  slug: string;
}

const StationSelector = ({ stations, slug }: Props) => (
  <div className={`${styles.StationSelector} StationSelector`}>
    <StationList stations={stations} slug={slug} />
  </div>
);

export default StationSelector;
