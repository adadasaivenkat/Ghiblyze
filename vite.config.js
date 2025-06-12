import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Exposes the dev server to your local network
    port: 5173,        // Optional: customize the port
  }
})
