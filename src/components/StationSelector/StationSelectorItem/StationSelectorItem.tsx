import Link from 'next/link';
import StationInterface from '@/types/StationInterface';
import { faHeart, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './StationSelectorItem.module.scss';
import { memo, useCallback } from 'react';

interface Props {
  station: StationInterface;
  isCurrent?: boolean;
  isLiked?: boolean;
  onDeleteStation: (slug: string) => void;
  // onLike: (slug: string) => void;
}

const StationSelectorItem = memo(({
  station,
  isCurrent,
  isLiked,
  onDeleteStation,
  // onLike,
}: Props): React.ReactNode => {

  const onDeleteStationHandler =  useCallback(() => onDeleteStation(station.slug), [station, onDeleteStation]);

  return (
    <li 
      className={[
        styles.StationSelectorItem,
        isCurrent ? styles['--current'] : '',
        isLiked ? styles['--liked'] : '',
      ].join(' ')}
    >
      <Link href={`?slug=${station.slug}`} className={`${styles.link} stationSelectorLink`} shallow={true}>
        <FontAwesomeIcon
          icon={faHeart}
          className={styles.like}
          // onClick={(e) => {e.stopPropagation(); e.preventDefault(); onLike(station.slug);}}
        />
        <h3 className={styles.title}>{station.title}</h3>
      </Link>
      {!station._id && (
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
