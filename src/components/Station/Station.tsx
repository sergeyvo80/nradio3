import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSpinner, faStar } from '@fortawesome/free-solid-svg-icons';

import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';

import styles from './Station.module.scss';

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

    <h2 className={styles.title}>{station.title}</h2>

    <div className={styles.actions}>
      <FontAwesomeIcon
        icon={faStar}
        size="3x"
        className={styles.like}
        onClick={() => onLike(station.slug)}
      />
    </div>

    {error !== undefined && <div className={styles.error}>Error: {error}</div>}
  </main>
));

Station.displayName = 'Station';

export default Station;
