import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
  env: {
    SPOTIFY_EMAIL: 'morrow165@outlook.com',
    SPOTIFY_PASSWORD: 'PowderJunkie7&',
  },
});
