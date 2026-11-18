import { useCallback, useEffect, useState } from 'react';

import { getLang, setLang as saveLang, LANG_EVENT, translate, Lang, LangKey } from '@/i18n/i18n';

// возвращает { lang, setLang, t }:
// - lang: активный язык ('ru' до монтирования — чтобы совпасть с SSR-HTML,
//   реальный язык подставляется в useEffect, иначе hydration mismatch);
// - setLang: выбор пользователя руками (сохраняется в localStorage);
// - t(key): перевод строки на активном языке
const useLang = (): {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: LangKey) => string;
} => {
  const [lang, setLangState] = useState<Lang>('ru');

  useEffect(() => {
    // html lang тоже переключаем: от него зависят переносы, озвучка, SEO
    const apply = () => {
      const current = getLang();
      setLangState(current);
      document.documentElement.lang = current;
    };

    apply();
    window.addEventListener(LANG_EVENT, apply);
    return () => window.removeEventListener(LANG_EVENT, apply);
  }, []);

  const setLang = useCallback((next: Lang) => {
    saveLang(next);
    setLangState(next);
  }, []);

  const t = useCallback((key: LangKey) => translate(lang, key), [lang]);

  return { lang, setLang, t };
};

export default useLang;
