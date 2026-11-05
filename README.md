# NRadio source code

http://nradio.pro - React, Next.js, ReactQuery, SSR, Cypress, Jest

Проект работает без сервера: станции берутся из статичного json-файла:
`src/data/stations.json`

## .env.local
```bash
NEXT_PUBLIC_GTM_ID="G-0R759M4XXF"
# NEXT_PUBLIC_DISABLE_PLAY="true" // for Dev
NEXT_TELEMETRY_DISABLED=1
BASE_URL="http://nradio.pro"
```

## package manager: pnpm

```bash
pnpm install
pnpm dev      # http://localhost:3002
pnpm build
```

## deploy
Nginx configs and service code placed on .docker folder

## e2e tests
```bash
pnpm e2e
pnpm e2e:headless
```

## Unit tests
```bash
pnpm test
```

## Lint
```bash
pnpm lint
```
