import Header from '../Header/Header';
import StationSelector from '../StationSelector/StationSelector';
import Station from '../Station/Station';
import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import styles from './NRadio.module.scss';
import { memo } from 'react';

interface NRadioProps {
  title: string;
  station: StationInterface;
  stations: StationInterface[];
  playerState: PlayerStateEnum | undefined;
  onPlay: () => void;
  onPause: () => void;
  onLike: (slug: string) => void;
  error: string | undefined;
}

const NRadio = memo(({
  title,
  station,
  stations,
  playerState,
  onPlay,
  onPause,
  onLike,
  error,
}: NRadioProps): React.ReactNode => (
  <div className={styles.NRadio}>
    <Header title={title} />

    <StationSelector
      stations={stations}
      slug={station.slug}
      onLike={onLike}
    />
    <Station
      station={station}
      playerState={playerState}
      onPlay={onPlay}
      onPause={onPause}
      onLike={onLike}
      error={error}
    />
  </div>
));

NRadio.displayName = 'NRadio';

export default NRadio;
