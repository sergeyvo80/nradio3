# PWA: реализация

Статус: **работает в production** (в dev service worker не регистрируется — намеренно).
Планирование и стратегии — в [pwa-plan.md](pwa-plan.md); здесь — как устроено и как обслуживать.

## Состав

| Файл | Роль |
|---|---|
| `src/app/manifest.ts` | генерирует `/manifest.webmanifest` (name NRadio, `standalone`, `start_url: '/'`, цвета `#202124`/`#292A2D`, 4 иконки) |
| `public/sw.js` | service worker: кэш `nradio-v1`, офлайн app-shell |
| `src/components/ServiceWorkerRegistrar/ServiceWorkerRegistrar.tsx` | регистрация `/sw.js` после `load`, только при `NODE_ENV === 'production'` |
| `src/app/layout.tsx` | монтирование регистратора в конце `<body>`, `viewport.themeColor`, `appleWebApp`, иконки favicon/apple-touch |
| `public/icons/` | PNG: `icon-192/512`, `icon-maskable-192/512`, `apple-touch-icon` 180, `favicon-64` |

## Стратегии `sw.js`

| Запрос | Отдача |
|---|---|
| `request.mode === 'navigate'` (HTML) | network-first; офлайн-фолбэк → кэш `/` (app-shell) |
| `/_next/static/**`, `/icons/**`, `/favicon.ico` | cache-first (иммутабельная статика) |
| прочие same-origin GET (RSC-пейлоады и пр.) | network-first |
| **cross-origin** (аудио-стримы, GTM) | не кэшируется никогда |

Жизненный цикл: `install` — прекэш `/` + `/manifest.webmanifest`, `skipWaiting`; `activate` — удалить все кэши кроме `nradio-v1`, `clients.claim`. Кэшируются только `response.ok && type === 'basic'` (same-origin).

## Выход новой версии

Имя кэша меняется вручную: `nradio-v1` → `nradio-v2` — старый кэш удалится на activate.
В обычном случае достаточно задеплоить: `skipWaiting` ставит новый SW сразу,
HTML обновляется через network-first.

## Иконки

Сгенерированы из SVG через headless Chrome; исходник-генератор — `file:///tmp/nradio-icon.html`
(шаблон: тёмный `#202124` rounded square, оранжевый `#E8AD47` круг, белый play-треугольник);
регенерация — скриншот 512×512 и sips-ресайзы:

```bash
# основной вариант (?r=204 — круг на весь квадрат; маскируемый — ?r=150, под safe zone)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=512,512 --screenshot=/tmp/icon.png --user-data-dir=/tmp/chrome-ic \
  "file:///tmp/nradio-icon.html?r=204"
sips -z 192 192 /tmp/icon.png --out public/icons/icon-192.png
sips -z 180 180 /tmp/icon.png --out public/icons/apple-touch-icon.png
sips -z 64 64  /tmp/icon.png --out public/icons/favicon-64.png
```

Если генератора в `/tmp` уже нет — восстановить по описанию выше/истории сессии.

## Известные нюансы

- **В dev (порт 3002) SW не регистрируется** — иначе кэш глушит HMR. Разовая проверка в dev:
  в консоли `navigator.serviceWorker.register('/sw.js')`, затем DevTools → Application → SW → Unregister.
- **Никогда не сравнивать `station.uuid === localStation.uuid`** (json-станции без uuid → `undefined === undefined`).
- **`favicon.ico`** лежит как file-convention `src/app/favicon.ico` — Next сам дописывает
  `<link rel="icon" href="/favicon.ico?...">`; в page-level metadata иконки не дублировать,
  layout их задаёт глобально.
- **iOS**: «На экран “Домой”» использует `apple-touch-icon` + `appleWebApp`-мету.
- **Старый сервер на порту после `pnpm build`**: `pnpm start` при занятом 3003 падает с
  `EADDRINUSE` и curl отдаёт 404 с устаревшего процесса — перед проверкой прибивать
  `lsof -ti :3003 | xargs kill`, потом `pnpm start`.
