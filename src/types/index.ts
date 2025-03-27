// Define client information interface
export interface ClientInfo {
  id: string;
  ip: string;
  userAgent: string;
  origin: string;
  connectionTime: Date;
  lastActive: Date;
}

// Enhanced client information with analytics data
export interface EnhancedClientInfo extends ClientInfo {
  entryPage: string;
  exitPage: string | null;
  pagesVisited: PageVisit[];
  sessionDuration: number | null; // in seconds, null if session is active
  referrer: string;
  deviceType: string;
  browser: string;
}

// Page visit information
export interface PageVisit {
  path: string;
  timestamp: Date;
  duration: number | null; // in seconds, null if still on page
  referrer: string;
}

// Page analytics information
export interface PageAnalytics {
  path: string;
  views: number;
  uniqueVisitors: number;
  averageDuration: number; // in seconds
  bounceRate: number; // percentage
  isEntryPage: number; // count of times it was an entry page
  isExitPage: number; // count of times it was an exit page
  _durations?: number[]; // Sayfa ziyaret sürelerini kaydetmek için kullanılır (internal)
}

// Visitor count response interface
export interface VisitorCountResponse {
  count: number;
}

// Detailed visitor response interface
export interface DetailedVisitorResponse {
  count: number;
  clients: ClientInfo[];
}

// Analytics response interface
export interface AnalyticsResponse {
  totalVisitors: number;
  activeVisitors: number;
  popularPages: PageAnalytics[];
  topEntryPages: PageAnalytics[];
  topExitPages: PageAnalytics[];
  visitorJourneys: VisitorJourney[];
}

// Visitor journey interface
export interface VisitorJourney {
  clientId: string;
  path: PageVisit[];
}

// Socket events
export enum SocketEvents {
  VISITOR_COUNT = 'visitor-count',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  PAGE_VIEW = 'page-view',
  PAGE_EXIT = 'page-exit'
} 