import React from 'react';

import styles from './About.module.scss';

const About = () => (
  <div className={styles.About}>
    <p className={styles.p}>
      Проект создан для изучения технологий и не несет коммерческих целей.
    </p>
    <p className={styles.p}>
      Cейчас можно отмечать любимые станции и добавлять новые.
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
      Видео презентация работы приложения{' '}
      <a href="https://vkvideo.ru/video-2235845_456239062?list=ln-95uhHEhdj1zFTzKVdo" target="_blank" className={styles.a} rel="noreferrer">
        https://vkvideo.ru/video-2235845_456239062?list=ln-95uhHEhdj1zFTzKVdo</a>
    </p>  
  </div>
);

About.displayName = 'About';

export default About;
