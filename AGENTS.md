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
- **Темы Yaru/Aurora** (`src/theme/theme.ts`, переключатель `ThemeSwitcher` в меню «⋮» шапки):
  две named-темы из макета `public/design-mockup.html` — **yaru** (графитово-фиолетовый #1B1922,
  оранжевый #E95420, зелёный #33D17A) и **aurora** (классический терминал Ubuntu #300A24,
  тёплый оранжевый #F5894B, лаймовый #8AE234). Хранение: `localStorage('theme')` = yaru|aurora;
  custom-тема пикера определяется по `colorState.colorFull` (getTheme → 'custom'). Новый ключ
  палитры `--positive-color` (зелёный: версия, дата, лайкнутые звёзды — `.--liked .like`).
  Карточки станций — без рамок/теней, только фон + воздух; текущая станция: `inset 3px` планка
  `--current-color` + подмес 14% акцента в фон (color-mix). initTheme() зовётся из NRadioContainer
  при монтировании; setTheme снимает custom (удаляет colorState); сброс пикера возвращает named-тему.
- **Версия продукта** (`src/constants/version.ts`: `PRODUCT_VERSION` = 'v3.2.3', `PRODUCT_VERSION_DATE` = '11.11.2026'):
  формат «v + major.minor.patch» — **перед каждым коммитом инкрементить ТРЕТЬЕ число (patch)**
  и обновлять дату на дату коммита; версия в файле относится к текущему коммиту. Показывается
  в выпадающем меню «⋮» шапки (`menuDropdown` в Header): номер зелёным #4CAF7D 11px,
  дата под ним, без скобок, полным годом (дд.мм.гггг), тем же зелёным (#4CAF7D), мельче (9px)
  и блеклее (opacity .55, `.versionDate`).
- **Headless-скриншоты на macOS**: Chrome игнорирует `--window-size` < ~756px; узкие девайсы
  эмулировать iframe-обёрткой (см. историю: приём с `public/probe.html`).
- **PWA реализована** (docs/pwa.md — устройство и обслуживание): `manifest.ts` обязан экспортировать
  **функцию**, а не константу (иначе сборка: «Default export is missing»); favicon — file-convention
  `src/app/favicon.ico`, иконки в page-metadata не дублировать (заданы глобально в layout);
  в dev SW не регистрируется (глушит HMR), разово — `navigator.serviceWorker.register('/sw.js')`
  из консоли; кэш-версия SW меняется вручную `nradio-v1` → `nradio-v2`.
- **Смена станции — клиентская** (`selectStation` в `NRadioContainer`): состояние + `history.replaceState`,
  без запроса к серверу — работает офлайн. Последняя воспроизводимая станция — в
  `localStorage('lastStation')`, при старте приоритет: `?station=` → `lastStation` → дефолт.
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


