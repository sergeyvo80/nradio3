import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    BASE_URL: 'http://localhost:3000', //process.env.BASE_URL,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.BASE_URL,
    chromeWebSecurity: false,
  },
});
