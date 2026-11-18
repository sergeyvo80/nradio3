import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSpinner, faStar } from '@fortawesome/free-solid-svg-icons';

import StationInterface from '@/types/StationInterface';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import getStationSource from '@/utils/getStationSource';
import useLang from '@/hooks/useLang';
import LiveEq from '../LiveEq/LiveEq';

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
}: Props): React.ReactNode => {
  const { t } = useLang();
  const playing = playerState === PlayerStateEnum.Playing;
  // Play/Pause — переходные состояния: крутим спиннер и не даём кликать
  const loading = playerState === PlayerStateEnum.Play || playerState === PlayerStateEnum.Pause;

  return (
    <main className={[styles.Station, station.isLiked ? styles['--liked'] : ''].join(' ')}>
      {/* круглая кнопка play: акцентный круг, треугольник цвета фона (как в макете) */}
      <div className={styles.player}>
        <button
          type="button"
          className={styles.playCircle}
          onClick={playing ? onPause : onPlay}
          disabled={loading}
          aria-label={playing ? t('pause') : t('play')}
        >
          <FontAwesomeIcon
            icon={loading ? faSpinner : playing ? faPause : faPlay}
            pulse={loading}
            className={styles.playIcon}
            aria-hidden="true"
          />
        </button>
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
        {/* живой эквалайзер — пока станция реально воспроизводится */}
        {playing && <LiveEq />}
        <button
          type="button"
          className={`iconButton ${styles.likeButton}`}
          onClick={() => onLike(station.slug)}
          aria-label={station.isLiked ? t('unlike') : t('like')}
          aria-pressed={!!station.isLiked}
        >
          <FontAwesomeIcon icon={faStar} className={styles.like} aria-hidden="true" />
        </button>
      </div>

      {error !== undefined && <div className={styles.error}>Error: {error}</div>}
    </main>
  );
});

Station.displayName = 'Station';

export default Station;
