// Define client information interface
export interface ClientInfo {
  id: string;
  ip: string;
  userAgent: string;
  origin: string;
  connectionTime: Date;
  lastActive: Date;
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

// Socket events
export enum SocketEvents {
  VISITOR_COUNT = 'visitor-count',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error'
} 