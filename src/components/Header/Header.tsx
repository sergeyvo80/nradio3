import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlayCircle, faAdd } from '@fortawesome/free-solid-svg-icons';
import ColorPicker from '../ColorPicker/ColorPicker';
import styles from './Header.module.scss';
import { memo,  } from 'react';

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
      <h1 className={styles.title}>{title}</h1>
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
