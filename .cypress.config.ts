import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {},
  env: {
    SITE_URL: 'http://localhost:3000',
    API_URL: 'https://localhost:8000',
    SPOTIFY_EMAIL: '',
    SPOTIFY_PASSWORD: '',
  },
});
