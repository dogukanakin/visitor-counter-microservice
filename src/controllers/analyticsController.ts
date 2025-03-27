import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

// Analytics controller fonksiyonları
export const analyticsController = {
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

  // Sayfa analitiği
  getPageAnalytics: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    res.json({
      pages: analyticsService.getPageAnalytics()
    });
  },

  // Popüler sayfalar
  getPopularPages: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    res.json({
      pages: analyticsService.getPopularPages(limit)
    });
  },

  // Giriş sayfaları
  getEntryPages: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    res.json({
      pages: analyticsService.getTopEntryPages(limit)
    });
  },

  // Çıkış sayfaları
  getExitPages: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    res.json({
      pages: analyticsService.getTopExitPages(limit)
    });
  },

  // Ziyaretçi yolculukları
  getVisitorJourneys: (analyticsService: AnalyticsService) => (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    res.json({
      journeys: analyticsService.getVisitorJourneys(limit)
    });
  },

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