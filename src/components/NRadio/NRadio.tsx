import Header from '../Header/Header';
import StationSelector from '../StationSelector/StationSelector';
import Station from '../Station/Station';
import StationInterface from '@/types/interfaces/StationInterface';
import PlayerStateEnum from '@/types/enums/PlayerStateEnum';
import styles from './NRadio.module.scss';

interface NRadioProps {
  title: string;
  station: StationInterface;
  stations: StationInterface[];
  playerState: PlayerStateEnum | undefined;
  onPlay: () => void;
  onPause: () => void;
  error: string | undefined;
}

const NRadio = ({
  title,
  station,
  stations,
  playerState,
  onPlay,
  onPause,
  error,
}: NRadioProps): React.ReactNode => (
  <div className={styles.NRadio}>
    <Header title={title} />
    <StationSelector stations={stations} slug={station.slug} />
    <Station
      station={station}
      playerState={playerState}
      onPlay={onPlay}
      onPause={onPause}
      error={error}
    />
  </div>
);

export default NRadio;
