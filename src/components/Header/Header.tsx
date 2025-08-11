import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import ColorPicker from '../ColorPicker/ColorPicker';
import styles from './Header.module.scss';
import { memo, useState } from 'react';
import Modal from '../Modal/Modal';

interface Props {
  title: string;
}

const Header = memo(({ title }: Props) => {
  const [isOpenAbout, setIsOpenAbout] = useState<boolean>(false);

  const toggleAboutHandler = () => setIsOpenAbout(!isOpenAbout);
  
  return (
    <header className={styles.Header}>
      <div className={styles.logo}>
        <FontAwesomeIcon icon={faPlayCircle} />
        {'\u00a0'}
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.color}><ColorPicker /></div>
      <div className={styles.info} onClick={toggleAboutHandler}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </div>
      <Modal title="About" isOpen={isOpenAbout} onClose={toggleAboutHandler}>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-300">
          Проект создан для изучения технологий и не несет коммерческих целей.
        </p>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-300">
          Frontend: React, Next.js, TanStack Query, react-hook-form, yup, TypeScript, SCSS, SSR, WebSocke, GraphQL, Jest, Cypress<br />
          <a href="https://github.com/sergeyvo80/nradio3" target="_blank"><u>https://github.com/sergeyvo80/nradio3</u></a>
        </p>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-300">
          Backend: Nest.js, GraphQL, MongoDB<br />
          <a href="https://github.com/sergeyvo80/nradio3-backend" target="_blank"><u>https://github.com/sergeyvo80/nradio3-backend</u></a>
        </p>      
      </Modal>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
