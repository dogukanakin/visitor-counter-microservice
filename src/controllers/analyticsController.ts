import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

// Analytics controller fonksiyonları
export const analyticsController = {
  /**
   * @swagger
   * /api/analytics:
   *   get:
   *     summary: Get analytics overview
   *     description: Returns overview of visitor analytics including total visitors, active visitors, popular pages, etc.
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AnalyticsOverview'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Analytics genel bakış
  getOverview: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    res.json({
      totalVisitors: analyticsService.getTotalVisitors(),
      activeVisitors: analyticsService.getActiveVisitors(),
      popularPages: analyticsService.getPopularPages(5),
      topEntryPages: analyticsService.getTopEntryPages(5),
      topExitPages: analyticsService.getTopExitPages(5),
      lastResetTime: analyticsService.getLastResetTime().toISOString(),
      autoResetInterval: '60 dakika'
    });
  },

  /**
   * @swagger
   * /api/analytics/pages:
   *   get:
   *     summary: Get page analytics
   *     description: Returns analytics data for all pages
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PageAnalytics'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Sayfa analitiği
  getPageAnalytics: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    res.json({
      pages: analyticsService.getPageAnalytics()
    });
  },

  /**
   * @swagger
   * /api/analytics/pages/popular:
   *   get:
   *     summary: Get popular pages
   *     description: Returns the most viewed pages
   *     tags: [Analytics]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Maximum number of pages to return (default 10)
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PageAnalytics'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Popüler sayfalar
  getPopularPages: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    res.json({
      pages: analyticsService.getPopularPages(limit)
    });
  },

  /**
   * @swagger
   * /api/analytics/pages/entry:
   *   get:
   *     summary: Get top entry pages
   *     description: Returns the pages where users most commonly enter the site
   *     tags: [Analytics]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Maximum number of pages to return (default 10)
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 pages:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                       count:
   *                         type: integer
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Giriş sayfaları
  getEntryPages: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    res.json({
      pages: analyticsService.getTopEntryPages(limit)
    });
  },

  /**
   * @swagger
   * /api/analytics/pages/exit:
   *   get:
   *     summary: Get top exit pages
   *     description: Returns the pages where users most commonly leave the site
   *     tags: [Analytics]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Maximum number of pages to return (default 10)
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 pages:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                       count:
   *                         type: integer
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Çıkış sayfaları
  getExitPages: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    res.json({
      pages: analyticsService.getTopExitPages(limit)
    });
  },

  /**
   * @swagger
   * /api/analytics/journeys:
   *   get:
   *     summary: Get visitor journeys
   *     description: Returns the paths that visitors take through the website
   *     tags: [Analytics]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Maximum number of journeys to return (default 10)
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VisitorJourneys'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Ziyaretçi yolculukları
  getVisitorJourneys: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    res.json({
      journeys: analyticsService.getVisitorJourneys(limit)
    });
  },

  /**
   * @swagger
   * /api/analytics/clients:
   *   get:
   *     summary: Get detailed client information
   *     description: Returns detailed information about all connected clients
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ClientDetails'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Detaylı ziyaretçi bilgileri
  getClientDetails: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const clients = analyticsService.getEnhancedClientInfo().map(client => ({
      ...client,
      connectionTime: client.connectionTime.toISOString(),
      lastActive: client.lastActive.toISOString(),
      pagesVisited: client.pagesVisited.map(visit => ({
        ...visit,
        timestamp: visit.timestamp.toISOString()
      }))
    }));
    
    res.json({ clients });
  },

  /**
   * @swagger
   * /api/analytics/reset:
   *   post:
   *     summary: Reset analytics data
   *     description: Manually resets all analytics data
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Analitik verileri sıfırlandı"
   *                 resetTime:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-03-26T12:00:00.000Z"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // Manuel veri sıfırlama
  resetAnalytics: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    analyticsService.resetAnalytics();
    res.json({
      success: true,
      message: 'Analitik verileri sıfırlandı',
      resetTime: analyticsService.getLastResetTime().toISOString()
    });
  }
}; 