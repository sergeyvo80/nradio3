import Link from 'next/link';
import StationInterface from '@/types/interfaces/StationInterface';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './StationSelectorItem.module.scss';

interface Props {
  station: StationInterface;
  isCurrent?: boolean;
}

const StationListItem = ({ station, isCurrent }: Props): React.ReactNode => (
  <li className={`${styles.StationListItem} ${isCurrent ? styles['--current'] : ''}`}>
    <Link href={`/station/${station.slug}`} className={styles.link}>
      <FontAwesomeIcon icon={faHeart} className={styles.like} />
      <h3 className={styles.title}>{station.title}</h3>
    </Link>
  </li>
);

export default StationListItem;
