import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],

  // 🌐 Launch dev browser automatically
  server: {
    open: true, // 👉 This opens the browser when you run `npm run dev`
    proxy: {
      '/api': 'http://localhost:4000' // ✅ Local dev proxy for backend
    }
  },

  // ⚡ Optional Esbuild tweaks for better debugging (especially for SWC)
  esbuild: {
    jsxDev: true,       // Improves source maps and console output for dev
    logLevel: 'info'    // Shows build logs more clearly
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',

    // ✅ Include all component test files
    include: ['**/*.{test,spec}.{js,jsx}'],

    // 📈 Coverage settings
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/setup.js', 'src/test/setup.jsx'], // 👈 added `.jsx`
      include: ['src/components/**/*.{js,jsx}'],
      all: true,
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    },

    // 🚫 Optional: enforce coverage thresholds during build/test runs
    checkCoverage: true // ❗ blocks commit if thresholds aren’t met
  }
})
