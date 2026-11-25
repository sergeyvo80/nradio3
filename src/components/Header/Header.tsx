import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import ColorPicker from '../ColorPicker/ColorPicker';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import LangSwitcher from '../LangSwitcher/LangSwitcher';
import Visualizer from '../Visualizer/Visualizer';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import useLang from '@/hooks/useLang';
import { PRODUCT_VERSION, PRODUCT_VERSION_DATE } from '@/constants/version';
import alignNextDevBadge from '@/utils/alignNextDevBadge';

import styles from './Header.module.scss';

interface Props {
  title: string;
  playerState?: PlayerStateEnum;
  onOpenAbout: () => void;
  onOpenNewStation: () => void;
}

const Header = memo(({ title, playerState }: Props) => {
  const { t } = useLang();
  // dev-бейджи (React Query Devtools и индикатор Next) — только в dev-сборке;
  // process.env.NODE_ENV инлайнится при сборке, в проде ветка вырезается
  const isDev = process.env.NODE_ENV !== 'production';
  const devToolsRef = useRef<HTMLDivElement>(null);
  // выпадающее меню «⋮»: пикер цвета + версия продукта
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // индикатор dev-режима Next прибит к углу вьюпорта — подтягиваем его к
  // dev-зоне в шапке (см. utils/alignNextDevBadge)
  useEffect(() => {
    if (!isDev || !devToolsRef.current) return undefined;
    return alignNextDevBadge(devToolsRef.current);
  }, [isDev]);

  return (
    <header className={styles.Header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon} aria-hidden="true">
          <span className={styles.logoBar} />
          <span className={styles.logoBar} />
          <span className={styles.logoBar} />
        </div>
        <h1 className={styles.title}>{title}</h1>
        {/* визуализатор в шапке: сразу после надписи FM0 */}
        <Visualizer playerState={playerState} />
      </div>
      <div className={styles.menu}>
        {/* подложка на весь экран: клик вне меню закрывает его */}
        {menuOpen && <div className={styles.menuCover} onClick={closeMenu} aria-hidden="true" />}
        {/* dev-бейджи слева от «⋮» (только в dev): кнопка React Query Devtools,
            рядом — индикатор Next (его позицию выравнивает alignNextDevBadge) */}
        {isDev && (
          <div className={styles.devTools} ref={devToolsRef}>
            <ReactQueryDevtools buttonPosition="relative" initialIsOpen={false} />
          </div>
        )}
        <button
          type="button"
          className={`iconButton ${styles.menuButton}`}
          onClick={toggleMenu}
          aria-label={t('menu')}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} aria-hidden="true" />
        </button>
        {menuOpen && (
          <div className={styles.menuDropdown}>
            <div className={styles.menuItem}><LangSwitcher /></div>
            <div className={styles.menuItem}><ThemeSwitcher /></div>
            <div className={styles.menuItem}><ColorPicker /></div>
            {/* версия прижата к нижней части выпадашки */}
            <div className={styles.menuItem}>
              <span className={styles.version}>{PRODUCT_VERSION}<span className={styles.versionDate}> — {PRODUCT_VERSION_DATE}</span></span>
            </div>
          </div>
        )}
      </div>
      {/* кнопки info и add скрыты по запросу — вернуть при необходимости:
      <FontAwesomeIcon
        icon={faInfoCircle}
        className={styles.info}
        onClick={onOpenAbout}
      />
      <FontAwesomeIcon
        icon={faAdd}
        className={`${styles.newStation} newStationButton`}
        onClick={onOpenNewStation}
      />
      */}
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
