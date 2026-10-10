import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Change this to '/YOUR-REPOSITORY-NAME/' before deploying to GitHub Pages.
// Example: if your repo is https://github.com/fanus/dsa-visual-lab, use '/dsa-visual-lab/'.
export default defineConfig({
  plugins: [react()],
  base: '/dsa-visual-lab/',
})
