import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react()],
        assetsInclude: ['**/license.key'],
        css: {
            modules: false,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
            extensions: ['.js', '.jsx'],
        },
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://localhost:8989/api',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
                '/auth': {
                    target: 'http://localhost:8989/auth',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/auth/, ''),
                },
            },
        },
    };
});
