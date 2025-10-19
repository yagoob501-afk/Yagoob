import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
    // Load environment variables
    const env = loadEnv(mode, process.cwd(), '')

    // Remove trailing slash if exists (just to be safe)
    const base = (env.VITE_PUBLIC_APP_BASE || '/').replace(/\/$/, '')

    return {
        base, // this will be like: /Yagoob
        plugins: [
            react(),
            VitePWA({
                manifest: {
                    name: 'yagoob forms',
                    short_name: 'yagoob forms',
                    start_url: `${base}/`,
                    display: 'standalone',
                    background_color: '#ffffff',
                    theme_color: '#000000',
                    icons: [
                        {
                            src: `${base}/logo-main.png`,
                            sizes: '533x350',
                            type: 'image/png',
                        },
                    ],
                    screenshots: [
                        {
                            src: `${base}/manifest/1.jpeg`,
                            sizes: '1788x1444',
                        },
                    ],
                },
            }),
            tailwindcss(),
            tsconfigPaths({
                projects: ['./tsconfig.app.json'],
            }),
        ],
    }
})
