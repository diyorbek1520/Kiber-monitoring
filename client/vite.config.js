// Vite konfiguratsiyasi frontend dev server va build sozlamalari uchun ishlatiladi.
import { defineConfig } from 'vite';

// React plagini Vite ichida JSX/React kodini ishlatish uchun kerak.
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
