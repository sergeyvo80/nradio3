import React, { useCallback, useEffect, useState } from 'react';

import { getLang, setLang, LANG_EVENT, Lang } from '@/i18n/i18n';

import styles from './LangSwitcher.module.scss';

// Переключатель языков в меню «⋮»: флажки 🇷🇺 / 🇬🇧.
// Выбор сохраняется в localStorage('lang') и переживает перезагрузку.
const LangSwitcher = (): React.ReactNode => {
  const [lang, setLangState] = useState<Lang>('ru');

  useEffect(() => {
    setLangState(getLang());
    const onChange = () => setLangState(getLang());
    window.addEventListener(LANG_EVENT, onChange);
    return () => window.removeEventListener(LANG_EVENT, onChange);
  }, []);

  const select = useCallback((next: Lang) => {
    // сохранение в localStorage + событие — в модуле i18n
    setLang(next);
    setLangState(next);
  }, []);

  return (
    <div className={styles.LangSwitcher}>
      <button
        type="button"
        title="Русский"
        aria-label="Русский"
        className={[styles.option, lang === 'ru' ? styles['--active'] : ''].join(' ')}
        onClick={() => select('ru')}
      >
        🇷🇺
      </button>
      <button
        type="button"
        title="English"
        aria-label="English"
        className={[styles.option, lang === 'en' ? styles['--active'] : ''].join(' ')}
        onClick={() => select('en')}
      >
        🇬🇧
      </button>
    </div>
  );
};

export default LangSwitcher;
