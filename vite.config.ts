import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const base = (env.VITE_PUBLIC_APP_BASE || '/').replace(/\/$/, '')

    const iconsPath = path.resolve(__dirname, 'public/icons/icons.json')
    const iconsData = JSON.parse(fs.readFileSync(iconsPath, 'utf-8'))

    const manifestIcons = iconsData.icons.map((icon: any) => ({
        src: `${base}/icons/${icon.src}`,
        sizes: icon.sizes,
        type: 'image/png',
    }))

    return {
        plugins: [
            react(),
            tailwindcss(),
            tsconfigPaths({
                projects: ['./tsconfig.app.json'],
            }),
            VitePWA({
                registerType: 'autoUpdate', // يجبر تحديث الـ Service Worker عند وجود إصدار جديد
                manifest: {
                    name: 'Yaqoub Alenezi',
                    short_name: 'Yaqoub',
                    start_url: `${base}/`,
                    display: 'standalone',
                    background_color: '#ffffff',
                    theme_color: '#000000',
                    icons: manifestIcons,
                    screenshots: [
                        {
                            src: `${base}/manifest/1.jpeg`,
                            sizes: '1788x1444',
                            type: 'image/jpeg',
                        },
                    ],
                },
                devOptions: {
                    enabled: true,
                },
                workbox: {
                    // يمنع تخزين الملفات القديمة في الكاش
                    cleanupOutdatedCaches: true,
                    skipWaiting: true,
                    clientsClaim: true,
                    runtimeCaching: [
                        {
                            urlPattern: /.*/i,
                            handler: 'NetworkFirst', // يجبر التحميل من الشبكة أولاً
                            options: {
                                cacheName: 'dynamic-cache',
                                expiration: {
                                    maxEntries: 0,
                                    maxAgeSeconds: 0,
                                },
                            },
                        },
                    ],
                },
            }),
        ],

        // 🧩 إعدادات build لمنع التخزين المؤقت
        build: {
            sourcemap: false,
            rollupOptions: {
                output: {
                    // إضافة hash مختلف لكل إصدار لتجنب الكاش
                    entryFileNames: 'assets/[name].[hash].js',
                    chunkFileNames: 'assets/[name].[hash].js',
                    assetFileNames: 'assets/[name].[hash].[ext]',
                },
            },
        },

        // 🧩 إعدادات الخادم
        server: {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                Pragma: 'no-cache',
                Expires: '0',
            },
        },

        preview: {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                Pragma: 'no-cache',
                Expires: '0',
            },
        },
    }
})
