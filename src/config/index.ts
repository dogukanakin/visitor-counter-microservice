import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Server configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
};

// URL configuration
export const URL_CONFIG = {
  LOCAL_URL: process.env.LOCAL_URL || `http://localhost:${SERVER_CONFIG.PORT}`,
  PRODUCTION_URL: process.env.PRODUCTION_URL || '',
  ALLOWED_DOMAINS: process.env.ALLOWED_DOMAINS?.split(',') || []
};

// CORS configuration
export const CORS_CONFIG = {
  origin: SERVER_CONFIG.ALLOWED_ORIGINS, // Use allowed origins instead of '*'
  methods: ['GET', 'POST'],
  credentials: true
};

// Socket.io configuration
export const SOCKET_CONFIG = {
  cors: {
    origin: SERVER_CONFIG.ALLOWED_ORIGINS, // Use allowed origins instead of '*'
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Explicitly define transports
}; 