import { Router } from 'express';
import { SocketService } from '../services/socketService';
import { mainController } from '../controllers/mainController';

// Temel route'ları ayarla
const setupBaseRoutes = (router: Router, socketService: SocketService) => {
  router.get('/', mainController.getInfo(socketService));
  router.get('/health', mainController.healthCheck());
  router.get('/config', mainController.getConfig());
  router.get('/client.js', mainController.getClientScript());
};

// Ana route creator fonksiyonu
export function createMainRoutes(socketService: SocketService): Router {
  const router = Router();

  // Temel route'ları ayarla
  setupBaseRoutes(router, socketService);

  return router;
} 