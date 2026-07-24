import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@microfyxd/core': path.resolve(__dirname, './microfyxd/packages/core/index.ts'),
        '@microfyxd/shared': path.resolve(__dirname, './microfyxd/packages/shared/index.ts'),
        '@microfyxd/agent': path.resolve(__dirname, './microfyxd/packages/agent/index.ts'),
        '@microfyxd/watchdog': path.resolve(__dirname, './microfyxd/packages/watchdog/index.ts'),
        '@microfyxd/phenotype': path.resolve(__dirname, './microfyxd/packages/phenotype/index.ts'),
        '@microfyxd/infra': path.resolve(__dirname, './microfyxd/packages/infra/index.ts'),
        '@microfyxd/memory': path.resolve(__dirname, './microfyxd/packages/memory/index.ts'),
        '@microfyxd/doctrine': path.resolve(__dirname, './microfyxd/packages/doctrine/index.ts'),
        '@microfyxd/sandbox': path.resolve(__dirname, './microfyxd/packages/sandbox/index.ts'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
