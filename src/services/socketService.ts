import { Server, Socket } from 'socket.io';
import http from 'http';
import { SOCKET_CONFIG } from '../config';
import { ClientInfo, SocketEvents } from '../types';

export class SocketService {
  private io: Server;
  private visitorCount: number = 0;
  private connections: Set<string> = new Set<string>();
  private clientsInfo: Map<string, ClientInfo> = new Map<string, ClientInfo>();

  constructor(server: http.Server) {
    this.io = new Server(server, SOCKET_CONFIG as any);
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => this.handleConnection(socket));
  }

  private handleConnection(socket: Socket): void {
    const clientIP = socket.handshake.headers['x-forwarded-for'] || 
                    socket.handshake.address || 
                    'unknown';
    
    const clientUserAgent = socket.handshake.headers['user-agent'] || 'unknown';
    const clientOrigin = socket.handshake.headers.origin || 'unknown';
    
    console.log(`Client connected: ${socket.id}`);
    console.log(`IP: ${clientIP}, UA: ${clientUserAgent}, Origin: ${clientOrigin}`);
    
    // Store client information
    this.clientsInfo.set(socket.id, {
      id: socket.id,
      ip: typeof clientIP === 'string' ? clientIP : JSON.stringify(clientIP),
      userAgent: clientUserAgent,
      origin: clientOrigin,
      connectionTime: new Date(),
      lastActive: new Date()
    });
    
    // Add to visitor count if this is a new connection
    if (!this.connections.has(socket.id)) {
      this.connections.add(socket.id);
      this.visitorCount++;
      
      // Broadcast the updated count to all clients
      this.broadcastVisitorCount();
      console.log(`Visitor count: ${this.visitorCount}`);
    }

    // Update last active timestamp when receiving any event
    socket.onAny(() => {
      const clientInfo = this.clientsInfo.get(socket.id);
      if (clientInfo) {
        clientInfo.lastActive = new Date();
        this.clientsInfo.set(socket.id, clientInfo);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  private handleDisconnect(socket: Socket): void {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Remove from visitor count if connection exists
    if (this.connections.has(socket.id)) {
      this.connections.delete(socket.id);
      this.clientsInfo.delete(socket.id);
      this.visitorCount = Math.max(0, this.visitorCount - 1); // Ensure count doesn't go below 0
      
      // Broadcast the updated count to all clients
      this.broadcastVisitorCount();
      console.log(`Visitor count: ${this.visitorCount}`);
    }
  }

  private broadcastVisitorCount(): void {
    this.io.emit(SocketEvents.VISITOR_COUNT, { count: this.visitorCount });
  }

  public getVisitorCount(): number {
    return this.visitorCount;
  }

  public getClientsInfo(): ClientInfo[] {
    return Array.from(this.clientsInfo.values());
  }

  public getActiveConnections(): number {
    return this.connections.size;
  }
} 