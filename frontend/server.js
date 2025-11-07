// Simple server for Render static site deployment
// This handles SPA routing for React Router
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, { 
  index: false, // Don't serve index.html for root, let the route handler do it
  setHeaders: (res, filePath) => {
    // Set proper content type
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
  // Skip API routes - they should be handled by the backend
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      error: 'API endpoint not found',
      message: 'API requests should be sent to the backend server'
    });
  }
  
  // For all other routes, serve index.html (React Router will handle routing)
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Frontend server is running on port ${PORT}`);
  console.log(` Serving static files from: ${distPath}`);
  console.log(` SPA routing enabled - all routes will serve index.html`);
});

