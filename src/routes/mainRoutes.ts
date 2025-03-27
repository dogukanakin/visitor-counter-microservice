import { Router } from 'express';
import path from 'path';
import { SocketService } from '../services/socketService';
import { URL_CONFIG } from '../config';
import fs from 'fs';

export function createMainRoutes(socketService: SocketService): Router {
  const router = Router();

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Configuration endpoint
  router.get('/config', (req, res) => {
    res.json({
      localUrl: URL_CONFIG.LOCAL_URL,
      productionUrl: URL_CONFIG.PRODUCTION_URL,
      allowedDomains: URL_CONFIG.ALLOWED_DOMAINS
    });
  });

  // Add a root endpoint to provide basic info
  router.get('/', (req, res) => {
    res.json({ 
      service: 'Visitor Counter Microservice',
      endpoints: {
        api: '/api/visitors',
        details: '/api/visitors/details',
        health: '/health',
        config: '/config'
      },
      status: 'running',
      activeConnections: socketService.getActiveConnections(),
      visitorCount: socketService.getVisitorCount()
    });
  });

  // Expose the client integration script with configuration
  router.get('/client.js', (req, res) => {
    const scriptPath = path.join(__dirname, '..', 'client', 'studyaitool-integration.js');
    
    // Read the script content
    fs.readFile(scriptPath, 'utf8', (err, content) => {
      if (err) {
        res.status(500).send('Error loading script');
        return;
      }

      // Set content type
      res.set('Content-Type', 'application/javascript');

      // Instead of wrapping in script tags, modify the config in the JS directly
      const modifiedContent = content
        .replace(/data-local-url="[^"]*"/, `data-local-url="${URL_CONFIG.LOCAL_URL}"`)
        .replace(/data-production-url="[^"]*"/, `data-production-url="${URL_CONFIG.PRODUCTION_URL}"`)
        .replace(/data-allowed-domains="[^"]*"/, `data-allowed-domains="${URL_CONFIG.ALLOWED_DOMAINS.join(',')}"`);

      // Send just the JavaScript content
      res.send(modifiedContent);
    });
  });

  return router;
} 