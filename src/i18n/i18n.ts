// Локализация интерфейса: ru / en.
// Язык по умолчанию берётся из браузера (navigator.language);
// если пользователь выбрал язык руками — он сохраняется в
// localStorage('lang') и переживает перезагрузку.
// Событие LANG_EVENT синхронизирует компоненты (как THEME_EVENT у тем).

export const LANG_KEY = 'lang';
export type Lang = 'ru' | 'en';
export const LANG_EVENT = 'nr-lang-change';

const DICT: Record<Lang, Record<string, string>> = {
  ru: {
    favorites: 'Понравившиеся',
    all: 'Все станции',
    about: 'О проекте',
    newStation: 'Новая станция',
    name: 'Название',
    streamUrl: 'Ссылка на стрим',
    required: 'Обязательное поле',
    add: 'Добавить',
    sentLocal: 'Станция добавлена локально и отправлена на сервер для модерации.',
    sentApproved: 'После подтверждения станция будет доступна у всех пользователей.',
    aboutIntro: 'Проект создан для изучения технологий и не несет коммерческих целей.',
    aboutNow: 'Cейчас можно отмечать любимые станции и добавлять новые.',
    aboutVideo: 'Видео презентация работы приложения',
  },
  en: {
    favorites: 'Favorites',
    all: 'All stations',
    about: 'About',
    newStation: 'New station',
    name: 'Name',
    streamUrl: 'Stream URL',
    required: 'Required field',
    add: 'Add',
    sentLocal: 'The station was added locally and sent to the server for moderation.',
    sentApproved: 'Once approved, the station will be available to all users.',
    aboutIntro: 'This project was created to explore technologies and has no commercial goals.',
    aboutNow: 'For now you can mark favorite stations and add new ones.',
    aboutVideo: 'Video presentation of the app',
  },
};

export type LangKey = keyof typeof DICT['ru'];

// сохранённый выбор приоритетнее, чем язык браузера;
// выбор руками не пишем в localStorage — браузерная настройка живая
export const getLang = (): Lang => {
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === 'ru' || saved === 'en') {
      return saved;
    }
  } catch {
    // нет localStorage
  }
  try {
    if (navigator.language?.toLowerCase().startsWith('ru')) {
      return 'ru';
    }
  } catch {
    // нет navigator
  }
  return 'en';
};

// выбор пользователя: сохраняем и оповещаем подписчиков
export const setLang = (lang: Lang): void => {
  try {
    window.localStorage.setItem(LANG_KEY, lang);
  } catch {
    // нет localStorage
  }
  window.dispatchEvent(new Event(LANG_EVENT));
};

export const translate = (lang: Lang, key: LangKey): string => DICT[lang][key];
