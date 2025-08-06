import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // 🌍 Ensures Vercel properly serves index.html for nested routes like /admin
  base: '/',

  server: {
    open: true, // 🚀 Automatically opens browser on dev start
    port: 5174, // Use port 5174 since 5173 is in use
    proxy: {
      '/api': 'http://localhost:5000' // 🔁 Local backend proxy for API routes
    }
  },

  // ⚙️ Ensures JSX is compiled properly for production
  esbuild: {
    jsx: 'automatic',  // ✅ Enables automatic JSX transform (React 17+)
    jsxDev: false,      // 🚫 Prevents inclusion of dev-only `jsxDEV`
    logLevel: 'info'    // 📝 Helpful logs during build
  },

  // 🧪 Testing configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',

    // 📂 Locate all test files in project
    include: ['**/*.{test,spec}.{js,jsx}'],

    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/setup.js',
        'src/test/setup.jsx'
      ],
      include: ['src/components/**/*.{js,jsx}'],
      all: true,
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    },

    checkCoverage: true // 🚨 Block commits if coverage drops below threshold
  }
});
