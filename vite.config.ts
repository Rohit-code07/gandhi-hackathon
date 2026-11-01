import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mirror-build-and-dist',
      closeBundle() {
        const buildDir = path.resolve(__dirname, 'build');
        const distDir = path.resolve(__dirname, 'dist');
        try {
          if (fs.existsSync(buildDir)) {
            fs.cpSync(buildDir, distDir, { recursive: true });
          }
        } catch (e) {
          console.warn('Could not mirror build directory:', e);
        }
      }
    }
  ],
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
});
