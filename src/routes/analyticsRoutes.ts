import { Router } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { analyticsController } from '../controllers/analyticsController';

// Route grupları
const setupPageRoutes = (router: Router, analyticsService: AnalyticsService) => {
  router.get('/pages', analyticsController.getPageAnalytics(analyticsService));
  router.get('/pages/popular', analyticsController.getPopularPages(analyticsService));
  router.get('/pages/entry', analyticsController.getEntryPages(analyticsService));
  router.get('/pages/exit', analyticsController.getExitPages(analyticsService));
};

const setupVisitorRoutes = (router: Router, analyticsService: AnalyticsService) => {
  router.get('/journeys', analyticsController.getVisitorJourneys(analyticsService));
  router.get('/clients', analyticsController.getClientDetails(analyticsService));
};

// Ana route creator fonksiyonu
export function createAnalyticsRoutes(analyticsService: AnalyticsService): Router {
  const router = Router();

  // Ana analytics endpoint'i
  router.get('/', analyticsController.getOverview(analyticsService));
  
  // Alt route gruplarını ayarla
  setupPageRoutes(router, analyticsService);
  setupVisitorRoutes(router, analyticsService);

  return router;
} 