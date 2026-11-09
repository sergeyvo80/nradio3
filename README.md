# NRadio source code

Слушать станции через браузер: chillout / ambient / trance / drum and bass и др.

Работает **без сервера**: список станций загружается из статичного JSON-файла (`src/data/stations.json`), данные о лайках и созданных пользователями станциях хранятся в `localStorage` браузера.

Стек: React 19, Next.js 16, React Query, SSR, Cypress, Jest, SCSS-модули. Менеджер пакетов — **pnpm**.

## Установка

```bash
pnpm install
```

## Запуск

```bash
pnpm dev        # http://localhost:3002
pnpm build      # production-сборка
pnpm start      # запуск production-сборки (порт 3003)
```

## .env.local

```bash
NEXT_PUBLIC_GTM_ID="G-0R759M4XXF"
# NEXT_PUBLIC_DISABLE_PLAY="true"  // для dev, если не хочется слушать музыку
NEXT_TELEMETRY_DISABLED=1
BASE_URL="http://nradio.pro"      # используется в meta-данных страниц
```

## URL-параметры

Выбранная станция задаётся query-параметром `station`:

- `/?station=drone-zone-soma-fm` — главная
- `/station?station=drone-zone-soma-fm` — альтернативный маршрут
- `/station/drone-zone-soma-fm` — динамический маршрут

Без параметра открывается станция по умолчанию (`groove-salad-soma-fm`, fallback — `src/data/station.json`).

## Как добавить станцию (без сервера)

Отредактируй `src/data/stations.json`:

```json
{
  "slug": "my-station",            // уникальный url-ключ станции
  "title": "My Station",
  "description": "",
  "website": "",                   // сайт радиостанции (необязательно)
  "dateAdded": "2026-11-05",
  "dateUpdated": "2026-11-05",
  "bitrate": 128,                  // kbps
  "tags": ["chillout", "ambient"],
  "stream": "https://example.com/stream.mp3"
}
```

Замечания:

- приоритет отдавай **https**-стримам: на https-страницах браузер блокирует `http`-потоки (mixed content);
- SomaFM отдаёт 403, если Referer — http-origin (например `localhost`), на https-оригинах всё работает;
- полная проверка всех стримов в файле:
  ```bash
  for u in $(grep -h -o '"stream": "[^"]*"' src/data/stations.json src/data/station.json |
             sed 's/.*"stream": "//;s/"//' | sort -u); do
    echo "$(curl -s -m 6 -o /dev/null -w '%{http_code}' -A 'Mozilla/5.0' "$u") $u"
  done
  ```

## Структура (src/)

```
app/         Next.js App Router: страницы, layout (SSR-гидрация данных, GTM), manifest (PWA)
api/         источники данных: stations.ts (json), localStorage (лайки, станции)
components/  UI: Header, StationSelector, Station, Modal, NewStation, ColorPicker...
containers/  клиентская логика: NRadioContainer (плеер), NRadioQueryContainer, ...
hooks/       useStations.ts — центальный хук: query + мутации (лайк/добавление/удаление/слияние)
data/        stations.json (все станции), station.json (fallback default-станция)
types/       TS-интерфейсы
constants/   meta-константы
docs/        планы и документация (например docs/pwa-plan.md)
```

## Адаптивная вёрстка

Дизайн мобильный «резиновый»: шрифты/отступы масштабируются функцией `vwMax()` (`src/styles/functions.scss`,
clamp с base 320px и cap 2x) в диапазоне 0–1023px; ≥1024px — фиксированный десктоп. Список станций на всех
устройствах — одна колонка. Каркас — grid `auto / minmax(0,1fr) / auto` c `height: 100svh`: хедер и плеер
по контенту, список занимает остаток и прокручивается внутри.

## Локальное состояние (offline-ready)

- лайки station (`isLiked`), свои станции (`isLocal`, создаются с `uuid`) — хранятся в `localStorage('stations')`
- при загрузке страницы `clientStateMergeMutate` (`src/hooks/useStations.ts`) сливает localStorage со списком станций: приоритет локальных лайков (по `slug`), пользовательские станции не теряются
- поэтому приложение остаётся полностью функциональным UI-wise без сети (кроме самих аудио-потоков) — см. план PWA ниже

## Тесты

```bash
pnpm test             # unit (jest + testing-library)
pnpm e2e              # cypress в браузере chrome
pnpm e2e:headless     # cypress headless-режим
```

e2e читает адрес из `BASE_URL` (`cypress.config.ts`, по умолчанию `http://nradio.local`; см. `.docker/nginx/nradio3-dev.conf` как пример для локального домена).

## Линтер

```bash
pnpm lint     # eslint (flat-конфиг: eslint.config.mjs)
pnpm prettier
```

## Deploy

Сервера нет — это serverless/static приложение, данные пользователей живут в браузере.

### Vercel — деплой настроен

**Автодеплой из GitHub** ([sergeyvo80/nradio3](https://github.com/sergeyvo80/nradio3)) подключён:
интеграция Vercel следит за этим репозиторием, и новая сборка делается по push'у в `main` в **https://nradio3.vercel.app**.
Выпуск нового релиза — **вручную, по решению владельца** (push-нуть, когда готово собирать), а не по каждому коммиту.

- Environment Variables: `NEXT_PUBLIC_GTM_ID`, `BASE_URL` — заведены в Settings → Environment Variables.
- Свой домен позже: Settings → Domains (у регистратора: CNAME `@ → cname.vercel-dns.com`,
  проксирование Cloudflare выключить — DNS only).
- PWA: установлено как приложение (`chrome://apps` или ярлык); после каждого деплоя SW
  подхватывает обновление (`skipWaiting`), старый кэш `nradio-v1` чистится на activate.
- Проверки после релиза: сайт открывается, иконка install в Chrome на месте, DevTools → Application
  → Service Workers — статус activated, кэш замещается свежим.

План поддержки PWA: [docs/pwa-plan.md](docs/pwa-plan.md).

### Альтернатива: свой сервер (nginx + systemd)

```bash
pnpm install && pnpm build
# nginx: proxy_pass на порт 3003 (порт `pnpm start`)
systemctl start nradio3.service   # юнит в .docker/nradio3.service
```

Внимание: `.docker/nginx/nradio3.conf` — легаси времён сервера graphql/mongo (в нём остались
локации `/graphql`, `/api`, `/mongo` и proxy_pass на 3002); при деплое на свой сервер его нужно
почистить под текущий serverless-режим. Актуальный дефолт — Vercel (см. выше).
