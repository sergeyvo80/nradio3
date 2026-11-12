import React from 'react';

import useLang from '@/hooks/useLang';

import styles from './About.module.scss';

const About = () => {
  const { t } = useLang();

  return (
    <div className={styles.About}>
      <p className={styles.p}>
        {t('aboutIntro')}
      </p>
      <p className={styles.p}>
        {t('aboutNow')}
      </p>
      <p className={styles.p}>
        Frontend: React, Next.js, TanStack Query, react-hook-form, yup, TypeScript, SCSS, SSR, WebSocke, GraphQL, Jest, Cypress<br />
        <a href="https://github.com/sergeyvo80/nradio3" className={styles.a} target="_blank" rel="noreferrer">
          https://github.com/sergeyvo80/nradio3
        </a>
      </p>
      <p className={styles.p}>
        Backend: Nest.js, GraphQL, MongoDB<br />
        <a href="https://github.com/sergeyvo80/nradio3-backend" className={styles.a} target="_blank" rel="noreferrer">
          https://github.com/sergeyvo80/nradio3-backend
        </a>
      </p>

      <p className={styles.p}>
        {t('aboutVideo')}{' '}
        <a href="https://vkvideo.ru/video-2235845_456239062?list=ln-95uhHEhdj1zFTzKVdo" target="_blank" className={styles.a} rel="noreferrer">
          https://vkvideo.ru/video-2235845_456239062?list=ln-95uhHEhdj1zFTzKVdo</a>
      </p>
    </div>
  );
};

About.displayName = 'About';

export default About;
