import React from 'react';
import Link from 'next/link';
import { faRemove, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo, useCallback } from 'react';

import StationInterface from '@/types/StationInterface';

import LiveEq from '../../LiveEq/LiveEq';

import styles from './StationSelectorItem.module.scss';

// подписи для скринридера приходят из списка (один useLang на весь список,
// а не 91 подписка на смену языка в каждом элементе)
export interface StationItemLabels {
  like: string;
  unlike: string;
  deleteStation: string;
}

interface Props {
  station: StationInterface;
  isCurrent?: boolean;
  // станция реально воспроизводится — показываем эквалайзер
  isPlaying?: boolean;
  isLiked?: boolean;
  labels: StationItemLabels;
  onLike?: (slug: string) => void;
  onSelect?: (slug: string) => void;
  onDeleteStation: (slug: string) => void;
}

const StationSelectorItem = memo(({
  station,
  isCurrent,
  isPlaying,
  isLiked,
  labels,
  onLike,
  onSelect,
  onDeleteStation,
}: Props): React.ReactNode => {

  const onDeleteStationHandler = useCallback(() => onDeleteStation(station.slug), [station, onDeleteStation]);

  // PWA/serverless: переключение станции — на клиенте (данные уже загружены),
  // без запроса к серверу; href остаётся для SEO и «открыть в новой вкладке»
  const onSelectHandler = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    onSelect?.(station.slug);
  }, [station, onSelect]);

  return (
    <li
      className={[
        styles.StationSelectorItem,
        isCurrent ? styles['--current'] : '',
        isLiked ? styles['--liked'] : '',
        // Место под метку local/крест резервируем только у локальных станций
        station.isLocal ? styles['--local'] : '',
      ].join(' ')}
    >
      <Link href={`?station=${station.slug}`} className={`${styles.link} stationSelectorLink`} onClick={onSelectHandler}>
        <div className={styles.txt}>
          <h3 className={styles.title}>{station.title}</h3>
          {/* подпись только у текущей: жанр (как в макете) */}
          {isCurrent && (
            <span className={styles.sub}>
              {station.tags[0]}
            </span>
          )}
        </div>
      </Link>
      {/* эквалайзер «играет» — только пока станция реально воспроизводится */}
      {isCurrent && isPlaying && <LiveEq />}
      {station.isLocal && (
        <div className={styles.local}>
          local
          <button
            type="button"
            className={`iconButton ${styles.remove}`}
            onClick={onDeleteStationHandler}
            aria-label={labels.deleteStation}
          >
            <FontAwesomeIcon icon={faRemove} aria-hidden="true" />
          </button>
        </div>
      )}
      <button
        type="button"
        className={`iconButton ${styles.likeButton}`}
        onClick={() => onLike?.(station.slug)}
        aria-label={isLiked ? labels.unlike : labels.like}
        aria-pressed={!!isLiked}
      >
        <FontAwesomeIcon icon={faStar} className={styles.like} aria-hidden="true" />
      </button>
    </li>
  );
});

StationSelectorItem.displayName = 'StationSelectorItem';

export default StationSelectorItem;
