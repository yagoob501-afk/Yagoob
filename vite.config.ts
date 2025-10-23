import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
    // Load env vars
    const env = loadEnv(mode, process.cwd(), '')

    // Base path
    const base = (env.VITE_PUBLIC_APP_BASE).replace(/\/$/, '')

    // 🧩 Load icons JSON from public/icons/icons.json
    const iconsPath = path.resolve(__dirname, 'public/icons/icons.json')
    const iconsData = JSON.parse(fs.readFileSync(iconsPath, 'utf-8'))

    // Map icons to include base path and type
    const manifestIcons = iconsData.icons.map((icon: any) => ({
        src: `${base}/icons/${icon.src}`,
        sizes: icon.sizes,
        type: 'image/png',
    }))

    return {
        base,
        plugins: [
            react(),
            VitePWA({
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
            }),
            tailwindcss(),
            tsconfigPaths({
                projects: ['./tsconfig.app.json'],
            }),
        ],
    }
})
