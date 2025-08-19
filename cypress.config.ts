import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    BASE_URL: 'http://nradio.local',
  },
  e2e: {
    setupNodeEvents(
      on: Cypress.PluginEvents,
      // config: Cypress.PluginConfigOptions
    ) {
      // реализуйте обработчики событий, например:
      on('before:run', () => {
        console.log('Запускаем тесты');
      });
    },
    baseUrl: process.env.BASE_URL,
    chromeWebSecurity: false,
  },
});