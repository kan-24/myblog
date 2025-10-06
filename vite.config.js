import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
const desiredRoutes = ['/', '/posts/:id'];
const ssgOptions = {
    script: 'async',
    formatting: 'minify',
    entry: 'src/main.ts',
    includedRoutes: async () => desiredRoutes
};
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    css: {
        postcss: './postcss.config.js'
    },
    ssgOptions
});
