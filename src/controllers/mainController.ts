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
        dashboard: `${baseUrl}/dashboard`,
        
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

  // Dashboard endpoint'i
  getDashboard: () => (req: Request, res: Response) => {
    const dashboardPath = path.join(__dirname, '..', 'public', 'dashboard.html');
    
    // Check if file exists
    if (!fs.existsSync(dashboardPath)) {
      res.status(404).send('Dashboard not found');
      return;
    }
    
    res.sendFile(dashboardPath);
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
      // Add cache control header
      res.set('Cache-Control', 'public, max-age=86400'); // 24 hours

      // No need to modify script content anymore, send as is
      res.send(content);
    });
  },

  // Minified Client script endpoint'i
  getMinifiedClientScript: () => (req: Request, res: Response) => {
    const scriptPath = path.join(__dirname, '..', 'client', 'client.min.js');
    
    // Check if file exists
    if (!fs.existsSync(scriptPath)) {
      res.status(404).send('Minified client script not found');
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
      // Add cache control header
      res.set('Cache-Control', 'public, max-age=86400'); // 24 hours

      // Send minified script as is
      res.send(content);
    });
  }
}; 