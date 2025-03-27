import { Request, Response } from 'express';
import { SocketService } from '../services/socketService';

// Visitor controller fonksiyonları
export const visitorController = {
  // Ziyaretçi sayısını al
  getVisitorCount: (socketService: SocketService) => (req: Request, res: Response) => {
    res.json({ count: socketService.getVisitorCount() });
  },

  // Detaylı ziyaretçi bilgilerini al
  getVisitorDetails: (socketService: SocketService) => (req: Request, res: Response) => {
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
  }
}; 