import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import 'dotenv/config'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
    'import.meta.env.VITE_R2_URL': JSON.stringify(process.env.VITE_R2_URL),
  },
  build: {
    sourcemap: false, // Reduce bundle size
    minify: 'terser', // Better compression
  },
})
