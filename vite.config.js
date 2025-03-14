import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import path from 'path';

const env = loadEnv(process.env.NODE_ENV, process.cwd());

function generateProxyConfig() {
    const routes = (env.VITE_PROXY_ROUTES || '')
        .split(',')
        .map(r => r.trim())
        .filter(Boolean);
    const target = env.VITE_API_BASE_URL;
    return routes.reduce((config, route) => {
        config[route] = {target, changeOrigin: true};
        return config;
    }, {});
}
// https://vite.dev/config/
export default defineConfig({
    // 设置基础公共路径（从build.publicPath移到这里）
    base: process.env.NODE_ENV === 'production' ? `/${env.VITE_PUBLIC_PATH || "h5"}/` : '/',
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
            imports: [
                'vue',        // 自动导入 Vue API，如 ref, reactive, computed 等
                'vue-router', // 自动导入 Vue Router API，如 useRoute, useRouter
                'pinia',      // 自动导入 Pinia API，如 defineStore, useStore
            ],
            dirs:[
                'src/composables', // 自动导入目录
                'src/plugins', // 自动导入目录
            ],
            dts: 'src/types/auto-imports.d.ts', // 生成的类型声明文件
        }),
        Components({
            resolvers: [ElementPlusResolver()],
            dirs: [
                'src/components', // 主组件目录
            ],
            extensions: ['vue'],
            deep: true,
            dts: 'src/types/components.d.ts'
        }),
        Pages({
            dirs: 'src/pages', // 页面目录
            extensions: ['vue'],
        }),
        Layouts({
            layoutsDirs: 'src/layouts', // Layout 目录
            pagesDirs: 'src/pages',
            defaultLayout: 'default', // 默认 Layout
            extensions: ['vue'],
            importMode: ()=>'async', // 异步导入
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server:{
        proxy: generateProxyConfig(),
    },
    // 构建配置 - 移除混淆并优化
    build: {
        outDir: 'h5',
        assetsDir: 'assets',
        emptyOutDir: true,
        sourcemap: false,
        rollupOptions: {
            output: {
                // 使用一个固定的时间戳，所有文件共享
                chunkFileNames: () => {
                    const timestamp = new Date().getTime();
                    return `assets/js/[hash]-${timestamp}.js`;
                },
                entryFileNames: () => {
                    const timestamp = new Date().getTime();
                    return `assets/js/[hash]-${timestamp}.js`;
                },
                assetFileNames: () => {
                    const timestamp = new Date().getTime();
                    return `assets/[ext]/[hash]-${timestamp}.[ext]`;
                },
                manualChunks(id) {
                    // 将node_modules的代码分割成单独的chunk
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log'],
                passes: 2,
                dead_code: true,
                reduce_vars: true,
                unsafe: true
            },
            mangle: {
                eval: false,
                safari10: true,
                toplevel: true,
            },
            format: {
                comments: false,
                indent_level: 0
            }
        },
        cssCodeSplit: true,
        brotliSize: true,
        chunkSizeWarningLimit: 2000,
        target: 'es2015'
    }
})