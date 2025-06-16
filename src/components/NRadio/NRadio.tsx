import Header from '../Header/Header';
import StationSelector from '../StationSelector/StationSelector';
import Station from '../Station/Station';
import StationInterface from '@/types/interfaces/Station';
import PlayerEnum from '@/types/enums/Player';
import styles from './NRadio.module.scss';

interface NRadioProps {
  title: string;
  station: StationInterface;
  stationList: StationInterface[];
  player: PlayerEnum | undefined;
  onPlay: () => void;
  onPause: () => void;
  error: string | undefined;
}

export const NRadio = ({
  title,
  station,
  stationList,
  player,
  onPlay,
  onPause,
  error,
}: NRadioProps): React.ReactNode => {
  return (
    <div className={styles.NRadio}>
      <Header title={title} />
      <StationSelector list={stationList} slug={station.slug} />
      <Station station={station} player={player} onPlay={onPlay} onPause={onPause} error={error} />
    </div>
  );
};
