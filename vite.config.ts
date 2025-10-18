import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
    // Load env variables based on mode

    const env = loadEnv(mode, process.cwd(), '')

    return {
        base: env.VITE_PUBLIC_APP_BASE || '/',
        plugins: [
            react(),
            VitePWA({
                manifest: {
                    "name": "yagoob forms",
                    "short_name": "yagoob forms",
                    "start_url": "/Yagoob/",
                    "display": "standalone",
                    "background_color": "#ffffff",
                    "theme_color": "#000000",
                    "icons": [
                        {
                            "src": "/Yagoob/logo-main.png",
                            "sizes": "533x350",
                            "type": "image/png"
                        }
                    ]
                }
            }),
            tailwindcss(),
            tsconfigPaths({
                projects: ['./tsconfig.app.json']
            })
        ],
    }
})
