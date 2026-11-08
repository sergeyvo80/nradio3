import React from 'react';
import Link from 'next/link';
import { faHeart, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo, useCallback } from 'react';

import StationInterface from '@/types/StationInterface';

import styles from './StationSelectorItem.module.scss';

interface Props {
  station: StationInterface;
  isCurrent?: boolean;
  isLiked?: boolean;
  onLike?: (slug: string) => void;
  onDeleteStation: (slug: string) => void;
}

const StationSelectorItem = memo(({
  station,
  isCurrent,
  isLiked,
  onLike,
  onDeleteStation,
}: Props): React.ReactNode => {

  const onDeleteStationHandler = useCallback(() => onDeleteStation(station.slug), [station, onDeleteStation]);

  const onLikeHandler = useCallback((event: React.MouseEvent) => {
    // клик по сердцу внутри Link: не переходить на станцию, только лайк
    event.stopPropagation();
    event.preventDefault();
    onLike?.(station.slug);
  }, [station, onLike]);

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
      <Link href={`?station=${station.slug}`} className={`${styles.link} stationSelectorLink`} shallow={true}>
        <FontAwesomeIcon
          icon={faHeart}
          className={`${styles.like} stationSelectorLike`}
          onClick={onLikeHandler}
        />
        <h3 className={styles.title}>{station.title}</h3>
      </Link>
      {station.isLocal && (
        <div className={styles.local}>
          local
          <FontAwesomeIcon icon={faRemove} onClick={onDeleteStationHandler} className={styles.remove} />
        </div>
      )}
    </li>
  );
});

StationSelectorItem.displayName = 'StationSelectorItem';

export default StationSelectorItem;
