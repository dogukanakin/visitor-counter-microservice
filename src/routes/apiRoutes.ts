import { Router } from 'express';
import { SocketService } from '../services/socketService';

export function createApiRoutes(socketService: SocketService): Router {
  const router = Router();

  // API endpoint to get current visitor count
  router.get('/visitors', (req, res) => {
    res.json({ count: socketService.getVisitorCount() });
  });

  // API endpoint to get client information
  router.get('/visitors/details', (req, res) => {
    // Get clients info and format dates for JSON response
    const clients = socketService.getClientsInfo().map(client => ({
      ...client,
      connectionTime: client.connectionTime.toISOString(),
      lastActive: client.lastActive.toISOString()
    }));
    
    res.json({ 
      count: socketService.getVisitorCount(), 
      clients: clients 
    });
  });

  return router;
} 