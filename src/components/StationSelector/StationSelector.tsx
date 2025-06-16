import React from 'react';
import StationInterface from '../../types/interfaces/Station';
import StationList from './StationSelectorList/StationSelectorList';
import Styles from './StationSelector.module.scss';

interface Props {
  list: StationInterface[];
  slug: string;
}

const StationSelector = ({ list, slug }: Props) => (
  <div className={Styles.StationSelector}>
    <StationList list={list} slug={slug} />
  </div>
);

export default StationSelector;
