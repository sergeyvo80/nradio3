import Link from 'next/link';
import StationInterface from '@/types/interfaces/StationInterface';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './StationSelectorItem.module.scss';

interface Props {
  station: StationInterface;
  isCurrent?: boolean;
  isLiked?: boolean;
  // onLike: (slug: string) => void;
}

const StationSelectorItem = ({
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
    <Link href={`/station/${station.slug}`} className={`${styles.link} stationSelectorLink`}>
      <FontAwesomeIcon
        icon={faHeart}
        className={styles.like}
        // onClick={(e) => {e.stopPropagation(); e.preventDefault(); onLike(station.slug);}}
      />
      <h3 className={styles.title}>{station.title}</h3>
    </Link>
  </li>
);

export default StationSelectorItem;
