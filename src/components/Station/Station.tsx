import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSpinner, faHeart } from '@fortawesome/free-solid-svg-icons';
import StationInterface from '@/types/interfaces/StationInterface';
import PlayerStateEnum from '@/types/enums/PlayerStateEnum';
import styles from './Station.module.scss';

interface Props {
  station: StationInterface;
  playerState?: PlayerStateEnum;
  onPlay?: () => void;
  onPause?: () => void;
  error?: string | undefined;
}

const Station = ({
  station,
  playerState,
  onPlay = () => {},
  onPause = () => {},
  error = 'error message',
}: Props): React.ReactNode => (
  <div className={styles.Station}>
    
    <div className={styles.player}>
      {(playerState === PlayerStateEnum.Paused || playerState === undefined) && (
        <FontAwesomeIcon icon={faPlay} size="3x" onClick={onPlay} />
      )}

      {playerState === PlayerStateEnum.Playing && (
        <FontAwesomeIcon icon={faPause} size="3x" onClick={onPause} />
      )}

      {(playerState === PlayerStateEnum.Play || playerState === PlayerStateEnum.Pause) && (
        <FontAwesomeIcon icon={faSpinner} pulse size="3x" />
      )}
    </div>

    <div className={styles.actions}>
      <FontAwesomeIcon icon={faHeart} size="3x" className={styles.heart} />
    </div>

    <h2 className={styles.title}>{station.title}</h2>

    {error !== undefined && <div className={styles.error}>Error: {error}</div>}
  </div>
);

export default Station;
