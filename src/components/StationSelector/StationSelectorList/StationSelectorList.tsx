import StationInterface from '@/types/interfaces/StationInterface';
import StationSelectorItem from '../StationSelectorItem/StationSelectorItem';
import styles from './StationSelectorList.module.scss';

interface Props {
  stations: StationInterface[];
  slug: string;
}

const StationSelectorList = ({ stations = [], slug }: Props) => (
  <ul className={styles.StationSelectorList}>
    {stations.map((station) => (
      <StationSelectorItem station={station} key={station.slug} isCurrent={station.slug === slug} />
    ))}
  </ul>
);

export default StationSelectorList;
