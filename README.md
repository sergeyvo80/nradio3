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
pnpm start      # запуск production-сборки (порт 3002)
```

## .env.local

```bash
NEXT_PUBLIC_GTM_ID="G-0R759M4XXF"
# NEXT_PUBLIC_DISABLE_PLAY="true"  // для dev, если не хочется слушать музыку
NEXT_TELEMETRY_DISABLED=1
BASE_URL="http://nradio.pro"      # используется в meta-данных страниц
```

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
app/         Next.js App Router: страницы, layout (SSR-гидрация данных, GTM)
api/         источники данных: stations.ts (json), localStorage (лайки, станции)
components/  UI: Header, StationSelector, Station, Modal, NewStation, ColorPicker...
containers/  клиентская логика: NRadioContainer (плеер), NRadioQueryContainer, ...
hooks/       useStations.ts — центальный хук: query + мутации (лайк/добавление/удаление/слияние)
data/        stations.json (все станции), station.json (fallback default-станция)
types/       TS-интерфейсы
constants/   meta-константы
```

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

Serverless-приложение без backend: достаточно nginx + static build.

Действующий вариант деплоя — nginx конфиг в `.docker/nginx/`, systemd-сервис `.docker/nradio3.service`.

Пример деплоя:

```bash
pnpm install && pnpm build
# nginx: proxy_pass на порт 3002
systemctl start nradio3.service
```

Статьям, опубликованным локально пользователями, серверная модерация не требуется — все данные живут в браузере.
