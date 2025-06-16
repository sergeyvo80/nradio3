import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSpinner, faHeart } from '@fortawesome/free-solid-svg-icons';
import StationInterface from '@/types/interfaces/Station';
import PlayerEnum from '@/types/enums/Player';
import styles from './Station.module.scss';

interface Props {
  station: StationInterface;
  player: PlayerEnum | undefined;
  onPlay?: () => void;
  onPause?: () => void;
  error?: string | undefined;
}

const Station = ({
  station,
  player,
  onPlay = () => {},
  onPause = () => {},
  error,
}: Props): React.ReactNode => (
  <div className={styles.Station}>
    <div className={styles.player}>
      {(player === PlayerEnum.Paused || player === undefined) && (
        <FontAwesomeIcon icon={faPlay} size="3x" onClick={onPlay} />
      )}

      {player === PlayerEnum.Playing && (
        <FontAwesomeIcon icon={faPause} size="3x" onClick={onPause} />
      )}

      {(player === PlayerEnum.Play || player === PlayerEnum.Pause) && (
        <FontAwesomeIcon icon={faSpinner} pulse size="3x" />
      )}
    </div>

    <div className={styles.actions}>
      <FontAwesomeIcon icon={faHeart} size="3x" className={styles.heart} />
    </div>

    <h1 className={styles.title}>{station.title}</h1>

    {error !== undefined && <div className={styles.error}>Error: {error}</div>}
  </div>
);

export default Station;
