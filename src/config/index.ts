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
  LOCAL_URL: process.env.LOCAL_URL || 'http://localhost:5001',
  PRODUCTION_URL: process.env.PRODUCTION_URL || 'https://visitors.studyaitool.com',
  ALLOWED_DOMAINS: process.env.ALLOWED_DOMAINS?.split(',') || ['studyaitool.com']
};

// CORS configuration
export const CORS_CONFIG = {
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST'],
  credentials: true
};

// Socket.io configuration
export const SOCKET_CONFIG = {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Explicitly define transports
}; 