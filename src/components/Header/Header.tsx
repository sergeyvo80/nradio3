import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlayCircle, faAdd } from '@fortawesome/free-solid-svg-icons';

import ColorPicker from '../ColorPicker/ColorPicker';
import { PRODUCT_VERSION, PRODUCT_VERSION_DATE } from '@/constants/version';

import styles from './Header.module.scss';

interface Props {
  title: string;
  onOpenAbout: () => void;
  onOpenNewStation: () => void;
}

const Header = memo(({ title, onOpenAbout, onOpenNewStation }: Props) => (
  <header className={styles.Header}>
    <div className={styles.logo}>
      <FontAwesomeIcon icon={faPlayCircle} />
      {'\u00a0'}
      <div className={styles.titles}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.version}>
          {PRODUCT_VERSION}
          {' '}
          <span className={styles.versionDate}>({PRODUCT_VERSION_DATE})</span>
        </span>
      </div>
    </div>
    <div className={styles.color}><ColorPicker /></div>
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
  </header>
));

Header.displayName = 'Header';

export default Header;
