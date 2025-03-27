import express from 'express';
import http from 'http';
import cors from 'cors';
import { SERVER_CONFIG, CORS_CONFIG } from './config';
import { SocketService } from './services/socketService';
import { createApiRoutes } from './routes/apiRoutes';
import { createMainRoutes } from './routes/mainRoutes';

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Apply CORS middleware
app.use(cors(CORS_CONFIG));

// Middleware
app.use(express.json());

// Initialize Socket.io service
const socketService = new SocketService(server);

// Register routes
app.use('/api', createApiRoutes(socketService));
app.use('/', createMainRoutes(socketService));

// Start server
const PORT = SERVER_CONFIG.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${SERVER_CONFIG.ALLOWED_ORIGINS.join(', ') || 'all origins (development mode)'}`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Server shutting down');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 