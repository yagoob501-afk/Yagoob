import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
    // Load env variables based on mode

    const env = loadEnv(mode, process.cwd(), '')

    return {
        base: env.VITE_PUBLIC_APP_BASE || '/',
        plugins: [
            react(),
            tailwindcss(),
            tsconfigPaths({
                projects: ['./tsconfig.app.json']
            })
        ],
    }
})
