import React, { useCallback, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownAZ, faFilter } from '@fortawesome/free-solid-svg-icons';

import StationInterface from '@/types/StationInterface';
import useLang from '@/hooks/useLang';

import StationSelectorItem, { StationItemLabels } from '../StationSelectorItem/StationSelectorItem';
import TagFilter from '../TagFilter/TagFilter';

import styles from './StationSelectorList.module.scss';

interface Props {
  stations: StationInterface[];
  slug: string;
  // slug станции, которая реально воспроизводится (для эквалайзера в списке)
  playingSlug?: string;
  onLike?: (slug: string) => void;
  onSelect?: (slug: string) => void;
  onDeleteStation: (slug: string) => void;
}

// рендерит один перечень станций (без заголовка, если группа единственная)
const renderGroup = (
  stations: StationInterface[],
  slug: string,
  playingSlug: Props['playingSlug'],
  labels: StationItemLabels,
  onLike: Props['onLike'],
  onSelect: Props['onSelect'],
  onDeleteStation: Props['onDeleteStation'],
  section?: string,
  controls?: React.ReactNode,
  emptyText?: string,
) => {
  if (stations.length === 0 && !controls) {
    return null;
  }

  return (
    <React.Fragment key={section || 'all'}>
      {(section || controls) && (
        <div className={styles.sectionRow}>
          {section && <div className={styles.section}>{section}</div>}
          {controls}
        </div>
      )}
      {stations.length === 0 && controls ? (
        <li className={styles.empty}>{emptyText}</li>
      ) : (
        stations.map((station) => (
          <StationSelectorItem
            station={station}
            key={station.slug}
            isCurrent={station.slug === slug}
            isPlaying={playingSlug === station.slug}
            isLiked={station.isLiked || false}
            labels={labels}
            onLike={onLike}
            onSelect={onSelect}
            onDeleteStation={onDeleteStation}
          />
        ))
      )}
    </React.Fragment>
  );
};

// группировка как в макете: сначала «Понравившиеся», затем «Все станции»;
// заголовки показываем только когда групп действительно две.
// В «Все станции» — сортировка по тегам и фильтр-попап с мультивыбором
const StationSelectorList = ({
  stations,
  slug,
  playingSlug,
  onLike,
  onSelect,
  onDeleteStation,
}: Props) => {
  const liked = stations.filter((station) => station.isLiked);
  const rest = stations.filter((station) => !station.isLiked);
  const { t } = useLang();

  // фильтр по тегам + сортировка: состояние только для группы «Все станции»
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortByTags, setSortByTags] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const closeFilter = useCallback(() => setFilterOpen(false), []);
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));
  }, []);
  const clearTags = useCallback(() => setSelectedTags([]), []);

  // каталог тегов группы «Все станции» с количеством станций
  const tagOptions = useMemo(() => {
    const counts = new Map<string, number>();
    rest.forEach((station) => (station.tags || []).forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }));
    return Array.from(counts, ([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }, [rest]);

  // фильтрация: станция подходит, если у неё есть хоть один выбранный тег;
  // сортировка: по первому тегу (tags[0]), внутри тега — по названию
  const shown = useMemo(() => {
    let list = rest;
    if (selectedTags.length > 0) {
      list = list.filter((station) => (station.tags || []).some((tag) => selectedTags.includes(tag)));
    }
    if (sortByTags) {
      list = [...list].sort((a, b) => {
        const ta = (a.tags?.[0] || '').toLowerCase();
        const tb = (b.tags?.[0] || '').toLowerCase();
        if (ta !== tb) return ta.localeCompare(tb);
        return a.title.localeCompare(b.title);
      });
    }
    return list;
  }, [rest, selectedTags, sortByTags]);

  // стабильный объект: не ломает memo у 91 элемента при обычных ре-рендерах
  const labels = useMemo<StationItemLabels>(() => ({
    like: t('like'),
    unlike: t('unlike'),
    deleteStation: t('deleteStation'),
  }), [t]);

  const allControls = (
    <>
      {/* сортировка по тегам: нажата — активна (акцент) */}
      <button
        type="button"
        className={[styles.iconBtn, sortByTags ? styles['--active'] : ''].join(' ')}
        onClick={() => setSortByTags((prev) => !prev)}
        aria-pressed={sortByTags}
        aria-label={t('sortByTags')}
      >
        <FontAwesomeIcon icon={faArrowDownAZ} aria-hidden="true" />
      </button>
      {/* фильтр по тегам: попап с чекбоксами */}
      <button
        type="button"
        className={[styles.iconBtn, selectedTags.length > 0 ? styles['--active'] : ''].join(' ')}
        onClick={() => setFilterOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={filterOpen}
        aria-label={t('filterTags')}
      >
        <FontAwesomeIcon icon={faFilter} aria-hidden="true" />
        {selectedTags.length > 0 && <span className={styles.badge}>{selectedTags.length}</span>}
      </button>
      <TagFilter
        open={filterOpen}
        options={tagOptions}
        selected={selectedTags}
        onToggle={toggleTag}
        onClear={clearTags}
        onClose={closeFilter}
      />
      {/* подложка на весь экран: клик вне попапа закрывает его */}
      {filterOpen && <div className={styles.cover} onClick={closeFilter} aria-hidden="true" />}
    </>
  );

  return (
    <ul className={styles.StationSelectorList}>
      {renderGroup(liked, slug, playingSlug, labels, onLike, onSelect, onDeleteStation, t('favorites'))}
      {renderGroup(shown, slug, playingSlug, labels, onLike, onSelect, onDeleteStation, liked.length > 0 ? t('all') : undefined, allControls, t('nothingFound'))}
    </ul>
  );
};

export default StationSelectorList;
