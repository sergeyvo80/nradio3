import Link from 'next/link';
import StationInterface from '@/types/interfaces/StationInterface';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './StationSelectorItem.module.scss';
import { memo } from 'react';

interface Props {
  station: StationInterface;
  isCurrent?: boolean;
  isLiked?: boolean;
  // onLike: (slug: string) => void;
}

const StationSelectorItem = memo(({
  station,
  isCurrent,
  isLiked,
  // onLike,
}: Props): React.ReactNode => (
  <li 
    className={[
      styles.StationSelectorItem,
      isCurrent ? styles['--current'] : '',
      isLiked ? styles['--liked'] : '',
    ].join(' ')}
  >
    <Link href={`/station?slug=${station.slug}`} className={`${styles.link} stationSelectorLink`} shallow={true}>
      <FontAwesomeIcon
        icon={faHeart}
        className={styles.like}
        // onClick={(e) => {e.stopPropagation(); e.preventDefault(); onLike(station.slug);}}
      />
      <h3 className={styles.title}>{station.title}</h3>
    </Link>
  </li>
));

StationSelectorItem.displayName = 'StationSelectorItem';

export default StationSelectorItem;
