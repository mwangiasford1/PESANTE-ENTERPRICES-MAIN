import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],

  // 🌍 SPA Routing Support for Vercel
  base: '/', // Ensures Vercel serves index.html for nested routes like /admin

  server: {
    open: true, // 🚀 Automatically launches browser on `npm run dev`
    proxy: {
      '/api': 'http://localhost:4000' // 🔁 Local API proxy for backend integration
    }
  },

  esbuild: {
    jsxDev: true, // 🧩 Enhances source maps and debug output
    logLevel: 'info' // 📝 Clear build logs
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',

    // 🧪 Include test files across the codebase
    include: ['**/*.{test,spec}.{js,jsx}'],

    coverage: {
      reporter: ['text', 'json', 'html'], // 📊 Multiple formats for viewing coverage
      exclude: [
        'node_modules/',
        'src/test/setup.js',
        'src/test/setup.jsx' // 🗂 Exclude boilerplate setup files
      ],
      include: ['src/components/**/*.{js,jsx}'], // 🎯 Focus coverage on UI components
      all: true, // ✅ Enforce coverage across matching files
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    },

    checkCoverage: true // 🚨 Block commits if coverage drops below thresholds
  }
});
