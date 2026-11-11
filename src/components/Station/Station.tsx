import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSpinner, faStar } from '@fortawesome/free-solid-svg-icons';

import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import getStationSource from '@/utils/getStationSource';

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
    {/* круглая кнопка play: акцентный круг, треугольник цвета фона (как в макете) */}
    <div className={styles.player}>
      {(playerState === PlayerStateEnum.Paused || playerState === undefined) && (
        <div className={styles.playCircle} onClick={onPlay}>
          <FontAwesomeIcon icon={faPlay} className={styles.playIcon} />
        </div>
      )}

      {playerState === PlayerStateEnum.Playing && (
        <div className={styles.playCircle} onClick={onPause}>
          <FontAwesomeIcon icon={faPause} className={styles.playIcon} />
        </div>
      )}

      {(playerState === PlayerStateEnum.Play || playerState === PlayerStateEnum.Pause) && (
        <div className={styles.playCircle}>
          <FontAwesomeIcon icon={faSpinner} pulse className={styles.playIcon} />
        </div>
      )}
    </div>

    <div className={styles.txt}>
      <h2 className={styles.title}>{station.title}</h2>
      {/* подпись: битрейт · источник */}
      <div className={styles.sub}>
        {station.bitrate ? `${station.bitrate} kbps · ` : ''}
        {getStationSource(station)}
      </div>
    </div>

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
