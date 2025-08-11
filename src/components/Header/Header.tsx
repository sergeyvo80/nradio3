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

const Header = memo(({ title, onOpenAbout, onOpenNewStation }: Props) => {

  return (
    <header className={styles.Header}>
      <div className={styles.logo}>
        <FontAwesomeIcon icon={faPlayCircle} />
        {'\u00a0'}
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.color}><ColorPicker /></div>
      <div className={styles.info} onClick={onOpenAbout}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </div>
      <div className={styles.newStation} onClick={onOpenNewStation}>
        <FontAwesomeIcon icon={faAdd} />
      </div>

      {/* <Modal title="About" isOpen={isOpenAbout} onClose={onOpenAbout}>
        <About />
      </Modal> */}
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
