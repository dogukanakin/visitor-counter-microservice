import { Request, Response } from 'express';
import { SocketService } from '../services/socketService';

// Visitor controller fonksiyonları
export const visitorController = {
  /**
   * @swagger
   * /api/visitors:
   *   get:
   *     summary: Get current visitor count
   *     description: Returns the current number of active visitors
   *     tags: [Visitors]
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VisitorCount'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Ziyaretçi sayısını al
  getVisitorCount: (socketService: SocketService) => (req: Request, res: Response) => {
    res.json({ count: socketService.getVisitorCount() });
  },

  /**
   * @swagger
   * /api/visitors/details:
   *   get:
   *     summary: Get detailed visitor information
   *     description: Returns detailed information about all connected visitors
   *     tags: [Visitors]
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VisitorDetails'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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