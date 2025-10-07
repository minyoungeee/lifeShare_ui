import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
            extensions: ['.js', '.jsx'],
        },
        server: {
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
