// This is an example client-side TypeScript implementation
// You can implement this in your frontend application

import { io, Socket } from 'socket.io-client';

// Example usage in a frontend application
export class VisitorCounterClient {
  private socket: Socket | null = null;
  private visitorCount: number = 0;
  private onCountUpdateCallbacks: ((count: number) => void)[] = [];

  constructor(serverUrl: string = 'http://localhost:3000') {
    this.connect(serverUrl);
  }

  private connect(serverUrl: string): void {
    // Initialize socket connection
    this.socket = io(serverUrl, {
      withCredentials: true,
    });

    // Set up event listeners
    this.socket.on('connect', () => {
      console.log('Connected to visitor counter service');
    });

    this.socket.on('visitor-count', (data: { count: number }) => {
      this.visitorCount = data.count;
      this.notifyListeners();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from visitor counter service');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  /**
   * Get the current visitor count
   */
  public getVisitorCount(): number {
    return this.visitorCount;
  }

  /**
   * Register a callback to be notified when the visitor count changes
   */
  public onCountUpdate(callback: (count: number) => void): void {
    this.onCountUpdateCallbacks.push(callback);
  }

  /**
   * Disconnect from the visitor counter service
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private notifyListeners(): void {
    for (const callback of this.onCountUpdateCallbacks) {
      callback(this.visitorCount);
    }
  }
}

/*
// Example usage:
const counter = new VisitorCounterClient();

// Listen for count changes
counter.onCountUpdate((count) => {
  console.log(`Current visitors: ${count}`);
  // Update UI with the visitor count
  document.getElementById('visitor-count').textContent = count.toString();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  counter.disconnect();
});
*/ 