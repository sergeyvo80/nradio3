import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import ColorPicker from '../ColorPicker/ColorPicker';
import styles from './Header.module.scss';

interface Props {
  title: string;
}

const Header = ({ title }: Props) => (
  <header className={styles.Header}>
    <div className={styles.logo}>
      <FontAwesomeIcon icon={faPlayCircle} />
      {'\u00a0'}
      <h1 className={styles.title}>{title}</h1>
    </div>
    <div className={styles.color}><ColorPicker /></div>
    <div className={styles.info}>
      <FontAwesomeIcon icon={faInfoCircle} />
    </div>
  </header>
);

export default Header;
