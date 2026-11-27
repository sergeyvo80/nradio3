import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import useLang from '@/hooks/useLang';

import styles from './TagFilter.module.scss';

export interface TagOption {
  tag: string;
  count: number;
}

interface Props {
  open: boolean;
  options: TagOption[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
  /** клик по крестику — закрыть диалог (выбор сохраняется) */
  onClose: () => void;
}

// попап фильтра по тегам: список чекбоксов с мультивыбором,
// сверху — сколько выбрано, сброс и крестик закрытия
const TagFilter = ({ open, options, selected, onToggle, onClear, onClose }: Props) => {
  const { t } = useLang();

  if (!open) return null;

  return (
    <div className={styles.popup}>
      <div className={styles.head}>
        <span className={styles.title}>{t('filterTags')}</span>
        {selected.length > 0 && (
          <button type="button" className={styles.clear} onClick={onClear}>
            {t('clear')}
          </button>
        )}
        <button type="button" className={styles.close} onClick={onClose} aria-label={t('close')}>
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
        </button>
      </div>
      <ul className={styles.list}>
        {options.map(({ tag, count }) => (
          <li key={tag}>
            <label className={styles.row}>
              <input
                type="checkbox"
                className={styles.box}
                checked={selected.includes(tag)}
                onChange={() => onToggle(tag)}
              />
              <span className={styles.name}>{tag}</span>
              <span className={styles.count}>{count}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

TagFilter.displayName = 'TagFilter';

export default TagFilter;
