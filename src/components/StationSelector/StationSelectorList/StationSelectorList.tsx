import React from 'react';
import StationInterface from '../../../types/interfaces/Station';
import StationSelectorItem from '../StationSelectorItem/StationSelectorItem';
import Styles from './StationSelectorList.module.scss';

interface Props {
  list: StationInterface[];
  slug: string;
}

const StationSelectorList = ({ list, slug }: Props) => (
  <ul className={Styles.StationSelectorList}>
    {list.map((item) => (
      <StationSelectorItem station={item} key={item.slug} isCurrent={item.slug === slug} />
    ))}
  </ul>
);

export default StationSelectorList;
