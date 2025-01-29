import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
// https://github.com/cheminfo/epfl-monitor-submit/issues/7
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['module:@preact/signals-react-transform']],
      },
    }),
  ],
  build: {
    target: 'esnext', // Set target to 'esnext' to include top-level await
  },
});
