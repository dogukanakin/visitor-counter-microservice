import { Router } from 'express';
import { SocketService } from '../services/socketService';
import { visitorController } from '../controllers/visitorController';

// Visitor route'larını ayarla
const setupVisitorRoutes = (router: Router, socketService: SocketService) => {
  router.get('/visitors', visitorController.getVisitorCount(socketService));
  router.get('/visitors/details', visitorController.getVisitorDetails(socketService));
};

// Ana route creator fonksiyonu
export function createApiRoutes(socketService: SocketService): Router {
  const router = Router();

  // Visitor route'larını ayarla
  setupVisitorRoutes(router, socketService);

  return router;
} 