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

// рендерит один перечень станций (без заголовка, если группа единственная)
const renderGroup = (
  stations: StationInterface[],
  slug: string,
  onLike: Props['onLike'],
  onSelect: Props['onSelect'],
  onDeleteStation: Props['onDeleteStation'],
  section?: string,
) => {
  if (stations.length === 0) {
    return null;
  }

  return (
    <React.Fragment key={section || 'all'}>
      {section && <div className={styles.section}>{section}</div>}
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
    </React.Fragment>
  );
};

// группировка как в макете: сначала «Понравившиеся», затем «Все станции»;
// заголовки показываем только когда групп действительно две
const StationSelectorList = ({
  stations,
  slug,
  onLike,
  onSelect,
  onDeleteStation,
}: Props) => {
  const liked = stations.filter((station) => station.isLiked);
  const rest = stations.filter((station) => !station.isLiked);

  return (
    <ul className={styles.StationSelectorList}>
      {renderGroup(liked, slug, onLike, onSelect, onDeleteStation, 'Понравившиеся')}
      {renderGroup(rest, slug, onLike, onSelect, onDeleteStation, liked.length > 0 ? 'Все станции' : undefined)}
    </ul>
  );
};

export default StationSelectorList;
