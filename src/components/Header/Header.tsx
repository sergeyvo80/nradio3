import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import ColorPicker from '../ColorPicker/ColorPicker';
import styles from './Header.module.scss';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => (
  <header className={styles.Header}>
    <div className={styles.logo}>
      <FontAwesomeIcon icon={faPlayCircle} />
      {'\u00a0'}
      {title}
    </div>
    <div className={styles.color}><ColorPicker /></div>
    <div className={styles.info}>
      <FontAwesomeIcon icon={faInfoCircle} />
    </div>
  </header>
);

export default Header;
