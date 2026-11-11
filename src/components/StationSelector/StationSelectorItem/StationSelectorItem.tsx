import React from 'react';
import Link from 'next/link';
import { faRemove, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo, useCallback } from 'react';

import StationInterface from '@/types/StationInterface';

import styles from './StationSelectorItem.module.scss';

interface Props {
  station: StationInterface;
  isCurrent?: boolean;
  isLiked?: boolean;
  onLike?: (slug: string) => void;
  onSelect?: (slug: string) => void;
  onDeleteStation: (slug: string) => void;
}

const StationSelectorItem = memo(({
  station,
  isCurrent,
  isLiked,
  onLike,
  onSelect,
  onDeleteStation,
}: Props): React.ReactNode => {

  const onDeleteStationHandler = useCallback(() => onDeleteStation(station.slug), [station, onDeleteStation]);

  const onLikeHandler = useCallback((event: React.MouseEvent) => {
    // звезда-лайк живёт вне Link: клик по ней только лайкает
    event.preventDefault();
    onLike?.(station.slug);
  }, [station, onLike]);

  // PWA/serverless: переключение станции — на клиенте (данные уже загружены),
  // без запроса к серверу; href остаётся для SEO и «открыть в новой вкладке»
  const onSelectHandler = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    onSelect?.(station.slug);
  }, [station, onSelect]);

  return (
    <li
      className={[
        styles.StationSelectorItem,
        isCurrent ? styles['--current'] : '',
        isLiked ? styles['--liked'] : '',
        // Место под метку local/крест резервируем только у локальных станций
        station.isLocal ? styles['--local'] : '',
      ].join(' ')}
    >
      <Link href={`?station=${station.slug}`} className={`${styles.link} stationSelectorLink`} onClick={onSelectHandler}>
        <h3 className={styles.title}>{station.title}</h3>
      </Link>
      {station.isLocal && (
        <div className={styles.local}>
          local
          <FontAwesomeIcon icon={faRemove} onClick={onDeleteStationHandler} className={styles.remove} />
        </div>
      )}
      <FontAwesomeIcon
        icon={faStar}
        className={`${styles.like} stationSelectorLike`}
        onClick={onLikeHandler}
      />
    </li>
  );
});

StationSelectorItem.displayName = 'StationSelectorItem';

export default StationSelectorItem;
