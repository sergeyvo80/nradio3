import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSpinner, faHeart } from '@fortawesome/free-solid-svg-icons';
import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import styles from './Station.module.scss';
import { memo } from 'react';

interface Props {
  station: StationInterface;
  playerState?: PlayerStateEnum;
  onPlay: () => void;
  onPause: () => void;
  onLike: (slug: string) => void;
  error?: string | undefined;
}

const Station = memo(({
  station,
  playerState,
  onPlay,
  onPause,
  onLike,
  error,
}: Props): React.ReactNode => (
  <main className={[styles.Station, station.isLiked ? styles['--liked'] : ''].join(' ')}>
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
      <FontAwesomeIcon
        icon={faHeart}
        size="3x"
        className={styles.like}
        onClick={() => onLike(station.slug)}
      />
    </div>

    <h2 className={styles.title}>{station.title}</h2>

    {error !== undefined && <div className={styles.error}>Error: {error}</div>}
  </main>
));

Station.displayName = 'Station';

export default Station;
