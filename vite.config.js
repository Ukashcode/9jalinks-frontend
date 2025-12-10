import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // This is the line that was failing

export default defineConfig({
  plugins: [react()],
})