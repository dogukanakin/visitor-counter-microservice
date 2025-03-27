import { Router } from 'express';
import { SocketService } from '../services/socketService';
import { mainController } from '../controllers/mainController';
import path from 'path';
import express from 'express';

// Temel route'ları ayarla
const setupBaseRoutes = (router: Router, socketService: SocketService) => {
  router.get('/', mainController.getInfo(socketService));
  router.get('/health', mainController.healthCheck());
  router.get('/config', mainController.getConfig());
  router.get('/client.js', mainController.getMinifiedClientScript());
  
  // Add dashboard route
  router.get('/dashboard', mainController.getDashboard());
};

// Ana route creator fonksiyonu
export function createMainRoutes(socketService: SocketService): Router {
  const router = Router();

  // Temel route'ları ayarla
  setupBaseRoutes(router, socketService);
  
  // Serve static files from the public directory
  router.use(express.static(path.join(__dirname, '..', 'public')));

  return router;
} 