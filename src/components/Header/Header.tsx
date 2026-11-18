import React, { memo, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import ColorPicker from '../ColorPicker/ColorPicker';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import LangSwitcher from '../LangSwitcher/LangSwitcher';
import Visualizer from '../Visualizer/Visualizer';
import PlayerStateEnum from '@/types/PlayerStateEnum';
import useLang from '@/hooks/useLang';
import { PRODUCT_VERSION, PRODUCT_VERSION_DATE } from '@/constants/version';

import styles from './Header.module.scss';

interface Props {
  title: string;
  playerState?: PlayerStateEnum;
  onOpenAbout: () => void;
  onOpenNewStation: () => void;
}

const Header = memo(({ title, playerState }: Props) => {
  const { t } = useLang();
  // выпадающее меню «⋮»: пикер цвета + версия продукта
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={styles.Header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon} aria-hidden="true">
          <span className={styles.logoBar} />
          <span className={styles.logoBar} />
          <span className={styles.logoBar} />
        </div>
        <h1 className={styles.title}>{title}</h1>
        {/* визуализатор в шапке: сразу после надписи NRADIO */}
        <Visualizer playerState={playerState} />
      </div>
      <div className={styles.menu}>
        {/* подложка на весь экран: клик вне меню закрывает его */}
        {menuOpen && <div className={styles.menuCover} onClick={closeMenu} aria-hidden="true" />}
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
