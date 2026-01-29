import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setTimeout(180000);
            proxyReq.setNoDelay(true);
            proxyReq.setSocketKeepAlive(true, 60000);
            if (proxyReq.socket) {
              proxyReq.socket.setTimeout(180000);
              proxyReq.socket.setKeepAlive(true, 60000);
            }
            proxyReq.on('socket', (socket) => {
              socket.setTimeout(180000);
              socket.setKeepAlive(true, 60000);
            });
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.setTimeout(180000);
            if (proxyRes.socket) {
              proxyRes.socket.setTimeout(180000);
              proxyRes.socket.setKeepAlive(true, 60000);
            }
          });
        },
      },
    },
  },
})
