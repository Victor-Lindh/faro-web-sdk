import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { getEnvConfig, getPublicEnvConfig } from './src/common';

export default defineConfig(({ mode }) => {
  return {
    plugins: [tsconfigPaths(), react()],
    server: {
      watch: {
        awaitWriteFinish: true,
      },
    },
    build: {
      minify: false,
      rollupOptions: {
        output: {
          chunkFileNames(chunk) {
            if (chunk.name === 'otel') {
              return 'otel.js';
            }

            return 'assets/[name].[hash].js';
          },
          manualChunks(id) {
            if (id.includes('server/otel') || id.includes('@opentelemetry/')) {
              return 'otel';
            }

            return undefined;
          },
        },
      },
    },
    define: {
      'process.env.__APP_ENV__': JSON.stringify(
        getPublicEnvConfig(
          getEnvConfig(
            loadEnv(mode, '../', ['AGENT_', 'CORTEX_', 'DATABASE_', 'DEMO_', 'GRAFANA_', 'LOKI_', 'TEMPO_']),
            mode
          )
        )
      ),
    },
  };
});