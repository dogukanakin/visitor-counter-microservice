import { EnhancedClientInfo, PageVisit, PageAnalytics, VisitorJourney } from '../types';

export class AnalyticsService {
  private clientAnalytics: Map<string, EnhancedClientInfo> = new Map<string, EnhancedClientInfo>();
  private pageAnalytics: Map<string, PageAnalytics> = new Map<string, PageAnalytics>();
  private resetTimer: NodeJS.Timeout | null = null;
  private lastResetTime: Date = new Date();
  private readonly RESET_INTERVAL = 60 * 60 * 1000; // 60 dakika (milisaniye cinsinden)
  
  constructor() {
    // Initialize with empty data
    this.resetAnalytics();
    
    // Set up auto-reset timer
    this.setupAutoReset();
  }

  /**
   * Set up auto-reset timer (60 dakika)
   */
  private setupAutoReset(): void {
    // Clear any existing timer
    if (this.resetTimer) {
      clearInterval(this.resetTimer);
    }
    
    // Set up new timer to reset analytics every 60 minutes
    this.resetTimer = setInterval(() => {
      console.log('Auto-resetting analytics data (60-minute interval)');
      this.resetAnalytics();
    }, this.RESET_INTERVAL);
  }

  /**
   * Get last reset time
   */
  public getLastResetTime(): Date {
    return this.lastResetTime;
  }

  /**
   * Reset all analytics data
   */
  public resetAnalytics(): void {
    this.clientAnalytics.clear();
    this.pageAnalytics.clear();
    this.lastResetTime = new Date();
    console.log(`Analytics data reset at ${this.lastResetTime.toISOString()}`);
  }

  /**
   * Record a new page view
   */
  public recordPageView(clientId: string, path: string, referrer: string): void {
    const client = this.getOrCreateClient(clientId);
    const now = new Date();
    
    // If first page view, set as entry page
    if (client.pagesVisited.length === 0) {
      client.entryPage = path;
    } else {
      // Close the duration for the previous page
      const lastPageVisit = client.pagesVisited[client.pagesVisited.length - 1];
      if (lastPageVisit.duration === null) {
        lastPageVisit.duration = (now.getTime() - lastPageVisit.timestamp.getTime()) / 1000;
      }
    }
    
    // Add the new page visit
    const pageVisit: PageVisit = {
      path,
      timestamp: now,
      duration: null, // Will be calculated when the user navigates away
      referrer
    };
    
    client.pagesVisited.push(pageVisit);
    client.lastActive = now;
    
    // Update the client
    this.clientAnalytics.set(clientId, client);
    
    // Update page analytics
    this.updatePageAnalytics(path, clientId);
  }

  /**
   * Record a page exit
   */
  public recordPageExit(clientId: string, path: string): void {
    const client = this.getOrCreateClient(clientId);
    const now = new Date();
    
    // Find the last page visit for this page
    const pageVisitIndex = [...client.pagesVisited].reverse().findIndex(visit => visit.path === path);
    
    if (pageVisitIndex >= 0) {
      const actualIndex = client.pagesVisited.length - 1 - pageVisitIndex;
      const pageVisit = client.pagesVisited[actualIndex];
      
      // Calculate duration
      if (pageVisit.duration === null) {
        pageVisit.duration = (now.getTime() - pageVisit.timestamp.getTime()) / 1000;
        
        // Update average duration for this page after calculating the duration
        this.updateAverageDuration(path, pageVisit.duration);
      }
      
      // If this is the last page they visited, mark it as the exit page
      if (actualIndex === client.pagesVisited.length - 1) {
        client.exitPage = path;
        
        // If we have both entry and exit, calculate session duration
        if (client.entryPage) {
          const firstVisit = client.pagesVisited[0];
          const sessionDuration = (now.getTime() - firstVisit.timestamp.getTime()) / 1000;
          client.sessionDuration = sessionDuration;
        }
      }
      
      // Update the client
      this.clientAnalytics.set(clientId, client);
      
      // Update exit page count
      this.updateExitPageCount(path);
    }
  }

  /**
   * Record a client disconnect
   */
  public recordDisconnect(clientId: string): void {
    const client = this.clientAnalytics.get(clientId);
    if (client) {
      const now = new Date();
      
      // Set the last page as exit page
      if (client.pagesVisited.length > 0) {
        const lastPageVisit = client.pagesVisited[client.pagesVisited.length - 1];
        client.exitPage = lastPageVisit.path;
        
        // Calculate duration for the last page
        if (lastPageVisit.duration === null) {
          lastPageVisit.duration = (now.getTime() - lastPageVisit.timestamp.getTime()) / 1000;
          
          // Update average duration
          this.updateAverageDuration(lastPageVisit.path, lastPageVisit.duration);
        }
        
        // Calculate session duration
        if (client.sessionDuration === null) {
          const firstVisit = client.pagesVisited[0];
          client.sessionDuration = (now.getTime() - firstVisit.timestamp.getTime()) / 1000;
        }
        
        // Update exit page count
        this.updateExitPageCount(lastPageVisit.path);
      }
      
      // Update the client
      this.clientAnalytics.set(clientId, client);
    }
  }

  /**
   * Get analytics for all pages
   */
  public getPageAnalytics(): PageAnalytics[] {
    return Array.from(this.pageAnalytics.values());
  }

  /**
   * Get top entry pages
   */
  public getTopEntryPages(limit: number = 10): PageAnalytics[] {
    return Array.from(this.pageAnalytics.values())
      .sort((a, b) => b.isEntryPage - a.isEntryPage)
      .slice(0, limit);
  }

  /**
   * Get top exit pages
   */
  public getTopExitPages(limit: number = 10): PageAnalytics[] {
    return Array.from(this.pageAnalytics.values())
      .sort((a, b) => b.isExitPage - a.isExitPage)
      .slice(0, limit);
  }

  /**
   * Get popular pages by view count
   */
  public getPopularPages(limit: number = 10): PageAnalytics[] {
    return Array.from(this.pageAnalytics.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  /**
   * Get visitor journeys
   */
  public getVisitorJourneys(limit: number = 10): VisitorJourney[] {
    return Array.from(this.clientAnalytics.entries())
      .filter(([_, client]) => client.pagesVisited.length > 0)
      .map(([clientId, client]) => ({
        clientId,
        path: client.pagesVisited
      }))
      .sort((a, b) => b.path.length - a.path.length)
      .slice(0, limit);
  }

  /**
   * Get total visitors count
   */
  public getTotalVisitors(): number {
    return this.clientAnalytics.size;
  }

  /**
   * Get active visitors count
   */
  public getActiveVisitors(): number {
    const now = new Date();
    const activeThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    return Array.from(this.clientAnalytics.values())
      .filter(client => {
        const lastActiveTime = client.lastActive.getTime();
        return now.getTime() - lastActiveTime < activeThreshold;
      })
      .length;
  }

  /**
   * Get enhanced client info
   */
  public getEnhancedClientInfo(): EnhancedClientInfo[] {
    return Array.from(this.clientAnalytics.values());
  }

  // Helper methods

  private getOrCreateClient(clientId: string): EnhancedClientInfo {
    if (this.clientAnalytics.has(clientId)) {
      return this.clientAnalytics.get(clientId)!;
    }
    
    // Create new client with default values
    const newClient: EnhancedClientInfo = {
      id: clientId,
      ip: '',
      userAgent: '',
      origin: '',
      connectionTime: new Date(),
      lastActive: new Date(),
      entryPage: '',
      exitPage: null,
      pagesVisited: [],
      sessionDuration: null,
      referrer: '',
      deviceType: '',
      browser: ''
    };
    
    this.clientAnalytics.set(clientId, newClient);
    return newClient;
  }

  private updatePageAnalytics(path: string, clientId: string): void {
    // Get or create page analytics
    let pageStats = this.pageAnalytics.get(path);
    
    if (!pageStats) {
      pageStats = {
        path,
        views: 0,
        uniqueVisitors: 0,
        averageDuration: 0,
        bounceRate: 0,
        isEntryPage: 0,
        isExitPage: 0
      };
    }
    
    // Update page view count
    pageStats.views++;
    
    // Update unique visitors
    // For simplicity, we'll count a client once per page
    const client = this.clientAnalytics.get(clientId);
    if (client) {
      const firstVisitToPage = client.pagesVisited.filter(visit => visit.path === path).length === 1;
      if (firstVisitToPage) {
        pageStats.uniqueVisitors++;
      }
      
      // Check if this is the entry page
      if (client.entryPage === path && client.pagesVisited.length === 1) {
        pageStats.isEntryPage++;
      }
    }
    
    // Save updated page stats
    this.pageAnalytics.set(path, pageStats);
  }

  /**
   * Update average duration for a page
   */
  private updateAverageDuration(path: string, duration: number): void {
    const pageStats = this.pageAnalytics.get(path);
    if (!pageStats) return;
    
    // Hesaplanan durations dizisi yoksa oluştur
    if (!pageStats._durations) {
      pageStats._durations = [];
    }
    
    // Yeni süreyi ekle
    pageStats._durations.push(duration);
    
    // Ortalama süreyi hesapla (0 olmayan süreler için)
    const validDurations = pageStats._durations.filter(d => d > 0);
    if (validDurations.length > 0) {
      const totalDuration = validDurations.reduce((sum, d) => sum + d, 0);
      pageStats.averageDuration = totalDuration / validDurations.length;
    }
    
    // Güncelle
    this.pageAnalytics.set(path, pageStats);
  }

  private updateExitPageCount(path: string): void {
    const pageStats = this.pageAnalytics.get(path);
    if (pageStats) {
      pageStats.isExitPage++;
      this.pageAnalytics.set(path, pageStats);
    }
  }

  /**
   * Update client information from basic client info
   */
  public updateClientInfo(clientId: string, basicInfo: {
    ip: string;
    userAgent: string;
    origin: string;
    referrer?: string;
  }): void {
    const client = this.getOrCreateClient(clientId);
    
    // Update basic info
    client.ip = basicInfo.ip;
    client.userAgent = basicInfo.userAgent;
    client.origin = basicInfo.origin;
    
    // Update referrer if provided
    if (basicInfo.referrer) {
      client.referrer = basicInfo.referrer;
    }
    
    // Extract browser and device info from userAgent
    const browserInfo = this.extractBrowserInfo(basicInfo.userAgent);
    client.browser = browserInfo.browser;
    client.deviceType = browserInfo.deviceType;
    
    // Update client
    this.clientAnalytics.set(clientId, client);
  }

  private extractBrowserInfo(userAgent: string): { browser: string; deviceType: string } {
    let browser = 'Unknown';
    let deviceType = 'Desktop';
    
    // Very simple browser detection
    if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      browser = 'Internet Explorer';
    }
    
    // Simple device detection
    if (userAgent.includes('Mobile')) {
      deviceType = 'Mobile';
    } else if (userAgent.includes('Tablet')) {
      deviceType = 'Tablet';
    }
    
    return { browser, deviceType };
  }
} 