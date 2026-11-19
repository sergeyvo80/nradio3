<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Preferences (user)

- Do NOT commit automatically to git. Only make commits when the user explicitly asks for it.
- Use gitmoji notation in commit messages, e.g. `feat(station): :sparkles: description`,
  `fix(player): :bug: description`, `refactor(app): :recycle: description`,
  `docs: :memo: description`, `test: :white_check_mark: description`.

## Project knowledge (skills)

- **Сборка — Turbopack (Next.js 16)**: webpack-плагины для Next (типа next-pwa) не применять; для
  PWA — рукописный service worker по плану `docs/pwa-plan.md`.
- **URL-параметр выбранной станции — `?station=<slug>`** (раньше был `?slug=`); глубокие связи:
  `src/app/page.tsx`, `src/app/station/page.tsx`, `StationSelectorItem.tsx`.
- **Адаптивная вёрстка**: мобильная шкала через `vwMax()` из `src/styles/functions.scss`
  (clamp, base 320px, cap 2x), breakpoint `$mob`/`$web` в `src/styles/vars.scss` (1023px);
  список станций всегда одна колонка; каркас — grid `auto/minmax(0,1fr)/auto` + `height: 100svh`.
- **Локальное состояние**: лайки (`isLiked`), станции пользователя (`isLocal`+`uuid`) и тема живут
  в `localStorage('stations')`; восстановление — merge по `slug` в `useStations.ts` (`clientStateMergeMutate`);
  никогда не сравнивать `station.uuid === localStation.uuid` (у json-станций uuid нет → `undefined === undefined`).
- **Темы Yaru/Aurora/Midnight/Forest/Day/Sage** (`src/theme/theme.ts`, селектор в меню «⋮» шапки,
  полный скил — **docs/skill-themes.md**: архитектура, чек-лист новой темы, грабли):
  шесть named-тем — **yaru** (графитово-фиолетовый #1B1922, оранжевый #E95420, зелёный #33D17A),
  **aurora** (классический терминал Ubuntu #300A24, тёплый оранжевый #F5894B, лаймовый #8AE234),
  **midnight** (глубокий индиго #0C1134, серебряный акцент #BCC1CC, орхидея #D26BD3),
  **forest** (тёмно-зелёный #0A1B12, мятный акцент #4ED88C, лайм #B4E34F) и две светлые:
  **day** (#F3F2F6, оранжевый #E95420, тёмно-зелёный positive #1E8E4E) и **sage** (#EAF1E8,
  тёмно-зелёный акцент #1F8A50, оливковый #5F7F1D — парная к forest). В светлых темах
  акценты/positive темнее ради читаемости 9-11px текста. Селектор — как обычный селект
  (контрол текущей темы + плоский список; двухцветный свотч «фон+акцент», шрифт 25px,
  фиксированные размеры БЕЗ vwMax; ширина 250px — dropdown сжимается по контенту).
  Плеер Station z-index 90 (ниже шапки 100), иначе перекрывает dropdown.
  Хранение: `localStorage('theme')` = имя; custom-тема пикера — по `colorState.colorFull`
  (getTheme → 'custom'), setTheme снимает custom (удаляет colorState), но ПОСЛЕДНЯЯ
  custom сохранена в `localStorage('customTheme')` и доступна в списке селектора
  строкой Custom (setCustomTheme(); initTheme применяет её при старте — пикер в закрытом
  меню не смонтирован). Новый ключ палитры
  `--positive-color` (версия/дата/подписи/лайкнутые звёзды). Карточки станций — без рамок/теней;
  текущая станция: `inset 3px` планка `--current-color` + подмес 14% акцента в фон (color-mix).
  Все элементы макета применены: список разбит на секции «Понравившиеся»/«Все станции»
  (StationSelectorList, заголовки только при двух группах), у текущей станции подпись
  «`tags[0]`» (слово «играет» убрано по просьбе пользователя) + мини-эквалайзер `LiveEq`
  (`src/components/LiveEq/`, общий — в списке и в плеере у звезды; полный скил —
  **docs/skill-liveeq.md**: архитектура, отладка, грабли: живой режим — 4 полоски
  из AnalyserNode, лог-обход спектра со сглаживанием; без данных (не-CORS поток) —
  плавная псевдо-анимация формулой псевдо-VU из Visualizer; `prefers-reduced-motion`
  — статичные полоски), в плеере круглая акцентная кнопка play (`.playCircle`, треугольник цвета фона) и
  подпись «`bitrate` kbps · источник» (источник — из скобок названия, `src/utils/getStationSource.ts`).
- **Версия продукта** (`src/constants/version.ts`: `PRODUCT_VERSION` = 'v3.2.17', `PRODUCT_VERSION_DATE` = '18.11.2026'):
  формат «v + major.minor.patch». **При коммитах версию НЕ трогать** (авто-bump отключён);
  **перед каждым пушем** поднимать ТРЕТЬЕ число (patch) и обновлять дату на дату пуша
  (дд.мм.гггг, полным годом) — версия в файле относится к деплою, который пуш создаёт.
  Показывается
  в меню «⋮» шапки (первый пункт `menuDropdown` в Header, выравнивание вправо): ОДНА строка
  «v3.2.17 — 18.11.2026» (длинное тире), зелёным `var(--positive-color)` 11px, дата без скобок
  полным годом (дд.мм.гггг), блеклее (opacity .75, `.versionDate`). В самой шапке версии нет
  (пробовали справа по макету — пользователь вернул в меню). В меню также ThemeSwitcher и ColorPicker.
- **Шапка и плеер по макету**: спокойные панели без свечения/скруглений; шапка — кружок-логотип
  `.logoIcon` (26px акцент + CSS-треугольник `var(--bg-color)`), название белым 19px, точки «⋮»
  приглушены (opacity .55); нижний бордюр шапки = верхний бордюр плеера: `1px solid var(--border-color)`.
  Плеер: круглая кнопка `.playCircle`, заголовок 16px, звезда 22px opacity .45 (лайкнутая —
  `--positive-color` opacity 1).
- **Визуализатор (Winamp-style)** (`src/components/Visualizer/` + `src/api/visualizerEngine.ts`,
  полный скил — **docs/skill-visualizer.md**: архитектура, отладка звука, правила расширения):
  Web Audio MediaElementSource → AnalyserNode (fftSize 2048). **Два элемента плеера**: CORS-потоки
  (probe `probeCorsStream`) играют через лениво создаваемый «визуализаторный» `<audio>` в Web Audio
  графе (`getVisualizerAudio()`), потоки без ACAO — напрямую на обычном `player` (чужой поток через
  MediaElementSource глушится по спеке). Контекст создаётся СИНХРОННО в жесте клика (до await);
  `currentPlayer` — какой элемент играет сейчас. Страховка звука (watchdog): контекст не `running`
  → 2 с, буферизация (тихий аналайзер при running) → 12 с; при срабатывании — прямой элемент +
  событие `nr-audio-fallback`, поток запоминается в `silentRoutedStreams`. Панель — в шапке
  сразу после надписи NRADIO (`playerState` пробрасывается через NRadio), прозрачная без
  скруглений; два режима (bars / осциллоскоп), по умолчанию wave: клик по панели — фуллскрин
  (Fullscreen API, фолбэк CSS-оверлей для iOS/PWA; выход Esc/✕), клик в фуллскрине — смена
  режима. Пока реального сигнала нет (пауза, лоадер, поток без аналайзера) — плавная
  синусоида амплитудой ±7px (размах = высота логотипа 14px), rAF продолжает крутиться;
  в bars-режиме потоки без CORS → псевдо-VU после 20 пустых кадров. crossOrigin на обычном
  player НЕ ставить (станции без ACAO
  умрут), на routed-элементе ОБЯЗАТЕЛЕН 'anonymous' — без него CORS-медиа tainted, граф
  молчит, звук стартовал ~через 30 с (страховка 12 с + второй буферинг); страховка при
  отказе play() на routed тоже уводит на прямой элемент.
- **Языки ru/en** (`src/i18n/i18n.ts` + `src/hooks/useLang.ts`, переключатель `LangSwitcher`
  с флажками 🇷🇺/🇬🇧 в меню «⋮»): язык по умолчанию из браузера (`navigator.language` —
  начинается с ru → 'ru', иначе 'en'); выбор руками сохраняется в `localStorage('lang')`
  и переживает перезагрузку; событие `nr-lang-change` синхронизирует компоненты (как у тем).
  useLang при первом рендере всегда 'ru' (совпадение с SSR-HTML), реальный язык — в
  useEffect (иначе hydration mismatch). Переведены секции списка (Favorites/All stations),
  модалки About/NewStation; названия станций и manifest — не переводятся.
- **SSG всех страниц** (Next 16, `next build` выводит ○/● вместо ƒ): главная `/` и `/station`
  статические — не читают `searchParams` (выбор станции целиком клиентский: NRadioContainer
  сам читает `?station=` и `lastStation` при монтировании, SSR-HTML всегда со стартовой
  станцией, клиент её переключает). `/station/[slug]` — `generateStaticParams` по всем
  слагам из `stations.json` + стартовой; метаданные по слагу — синхронный хелпер
  `src/utils/findStationBySlug.ts` (прямо из json, не queryClient — он на билде пуст);
  `dynamicParams` по умолчанию true — неизвестные слаги (локальные станции с uuid) рендерятся
  по запросу. Проверка статики в prod: заголовки `x-nextjs-prerender: 1`, `x-nextjs-cache: HIT`.
  При изменении `stations.json` нужно пересобирать (страницы вшиты в билд).
- **Headless-скриншоты на macOS**: Chrome игнорирует `--window-size` < ~756px; узкие девайсы
  эмулировать iframe-обёрткой (см. историю: приём с `public/probe.html`).
- **PWA реализована** (docs/pwa.md — устройство и обслуживание): `manifest.ts` обязан экспортировать
  **функцию**, а не константу (иначе сборка: «Default export is missing»); favicon — file-convention
  `src/app/favicon.ico`, иконки в page-metadata не дублировать (заданы глобально в layout);
  в dev SW не регистрируется (глушит HMR), разово — `navigator.serviceWorker.register('/sw.js')`
  из консоли; кэш-версия SW меняется вручную `nradio-v4` → `nradio-v5`. Навигация —
  **stale-while-revalidate**: HTML из кэша отдаётся сразу, сеть обновляет его в фоне
  (`event.waitUntil`), поэтому зависший коннект не даёт белого экрана; новая версия HTML
  появляется на втором заходе. Прочие same-origin GET — network-first с таймаутом 2.5 с.
- **Смена станции — клиентская** (`selectStation` в `NRadioContainer`): состояние + `history.replaceState`,
  без запроса к серверу — работает офлайн. Последняя воспроизводимая станция — в
  `localStorage('lastStation')`, при старте приоритет: `?station=` → `lastStation` → дефолт.
  Клик по станции при играющем/грузящемся плеере ВСЕГДА переключает поток и сбрасывает
  предыдущий запуск: в `play()` действует токен запуска (`playTokenRef`) — новый play()/pause()
  делает асинхронный запуск (CORS-проба + буферизация) устаревшим, его колбэки не трогают
  состояние и не глушат переиспользованный элемент, сторожевой таймер старого запуска
  гасится токеном. Эффект `[station]` перезапускает play при состояниях `Playing` и `Play` (лоадер).
  При hydration Next переписывает `<title>` (SSR-метадата),
  поэтому `document.title` обновляется эффектом с ретраем 100 мс.
- **Проверка prod-сервера после build**: `pnpm start` упрётся в занятый 3003 (`EADDRINUSE`) и
  старый процесс продолжит отдавать 404 — сначала `lsof -ti :3003 | xargs kill`.
- **Деплой настроен: автодеплой из GitHub** ([sergeyvo80/nradio3](https://github.com/sergeyvo80/nradio3)) —
  интеграция Vercel следит за репозиторием — **https://nradio3.vercel.app**; env `NEXT_PUBLIC_GTM_ID`, `BASE_URL`
  заведены. Релиз **ручной**: владелец push'ует `main` сам, когда готов собирать — не по каждому коммиту.
  Свой домен позже (Settings → Domains; `nradio.space` свободен). PWA-обновления после деплоя
  подхватываются через `skipWaiting`, старый кэш чистится на activate.
- Рабочий коммит только по команде пользователя («закомить»); gitmoji-формат (см. Preferences).


