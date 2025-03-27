import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { SocketService } from '../services/socketService';
import { URL_CONFIG } from '../config';

// Helper fonksiyonlar
export const helpers = {
  // Ortama göre temel URL'yi belirle
  getBaseUrl: (req: Request): string => {
    const hostname = req.hostname || '';
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    return isLocalhost 
      ? `${req.protocol || 'http'}://${req.get('host') || 'localhost'}`
      : URL_CONFIG.PRODUCTION_URL;
  },

  // Client script içeriğini değiştir
  modifyClientScript: (content: string): string => {
    return content.replace(/DEFAULT_CONFIG = {[^}]*}/, 
      `DEFAULT_CONFIG = {
        localUrl: "${URL_CONFIG.LOCAL_URL}",
        productionUrl: "${URL_CONFIG.PRODUCTION_URL}",
        allowedDomains: "${URL_CONFIG.ALLOWED_DOMAINS.join(',')}"
      }`);
  }
};

// Main controller fonksiyonları
export const mainController = {
  // Sağlık kontrolü endpoint'i
  healthCheck: () => (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  },

  // Konfigürasyon endpoint'i
  getConfig: () => (req: Request, res: Response) => {
    res.json({
      localUrl: URL_CONFIG.LOCAL_URL,
      productionUrl: URL_CONFIG.PRODUCTION_URL,
      allowedDomains: URL_CONFIG.ALLOWED_DOMAINS
    });
  },

  // Ana bilgi endpoint'i
  getInfo: (socketService: SocketService) => (req: Request, res: Response) => {
    const baseUrl = helpers.getBaseUrl(req);
    const hostname = req.hostname || '';
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    
    res.json({ 
      service: 'Visitor Counter Microservice',
      endpoints: {
        // Basic endpoints
        api: `${baseUrl}/api/visitors`,
        details: `${baseUrl}/api/visitors/details`,
        health: `${baseUrl}/health`,
        config: `${baseUrl}/config`,
        clientScript: `${baseUrl}/client.js`,
        
        // Analytics endpoints
        analytics: {
          overview: `${baseUrl}/api/analytics`,
          pages: `${baseUrl}/api/analytics/pages`,
          popularPages: `${baseUrl}/api/analytics/pages/popular`,
          entryPages: `${baseUrl}/api/analytics/pages/entry`,
          exitPages: `${baseUrl}/api/analytics/pages/exit`,
          journeys: `${baseUrl}/api/analytics/journeys`,
          clients: `${baseUrl}/api/analytics/clients`
        }
      },
      accessUrls: {
        local: URL_CONFIG.LOCAL_URL,
        production: URL_CONFIG.PRODUCTION_URL
      },
      environment: isLocalhost ? 'development' : 'production',
      status: 'running',
      activeConnections: socketService.getActiveConnections(),
      visitorCount: socketService.getVisitorCount()
    });
  },

  // Client script endpoint'i
  getClientScript: () => (req: Request, res: Response) => {
    const scriptPath = path.join(__dirname, '..', 'client', 'client.js');
    
    // Check if file exists
    if (!fs.existsSync(scriptPath)) {
      res.status(404).send('Client script not found');
      return;
    }
    
    // Read the script content
    fs.readFile(scriptPath, 'utf8', (err, content) => {
      if (err) {
        res.status(500).send('Error loading script');
        return;
      }

      // Set content type
      res.set('Content-Type', 'application/javascript');

      // Modify the script content
      const modifiedContent = helpers.modifyClientScript(content);

      // Send the JavaScript content
      res.send(modifiedContent);
    });
  }
}; 