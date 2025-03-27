// Visitor Counter Integration
// Add this script to any website to track visitors without displaying a counter
// StudyAITool.com - Real-time Visitor Counter Microservice

(function() {
  // Default configuration (will be overridden by server config if available)
  const DEFAULT_CONFIG = {
    localUrl: document.currentScript?.getAttribute('data-local-url') || 'http://localhost:5001',
    productionUrl: document.currentScript?.getAttribute('data-production-url') || 'https://visitors.studyaitool.com',
    allowedDomains: (document.currentScript?.getAttribute('data-allowed-domains') || 'studyaitool.com').split(',')
  };

  // Load Socket.io client
  const script = document.createElement('script');
  script.src = 'https://cdn.socket.io/4.6.0/socket.io.min.js';
  script.onload = initVisitorCounter;
  document.head.appendChild(script);

  async function initVisitorCounter() {
    // Determine server URL
    const serverUrl = await getServerUrl();
    console.log(`Connecting to visitor counter service: ${serverUrl}`);
    
    // Connect to socket server
    const socket = io(serverUrl, {
      withCredentials: false,
      transports: ['websocket', 'polling'],
      query: {
        page: window.location.pathname,
        referrer: document.referrer || 'direct'
      }
    });

    // Connection events
    socket.on('connect', () => {
      console.log('Visitor counter connected');
    });

    socket.on('connect_error', (error) => {
      console.warn('Visitor counter connection error:', error.message);
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      socket.disconnect();
    });
    
    // Expose socket for debugging if needed
    window.visitorCounterSocket = socket;
  }

  async function getServerUrl() {
    const hostname = window.location.hostname;
    
    try {
      // First try to get configuration from the server
      const response = await fetch('/config');
      const config = await response.json();
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return config.localUrl;
      } else if (config.allowedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
        return config.productionUrl;
      } else {
        return config.productionUrl;
      }
    } catch (error) {
      console.warn('Failed to fetch server configuration, using fallback values:', error);
      // Fallback to default values if server is not reachable
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return DEFAULT_CONFIG.localUrl;
      } else if (DEFAULT_CONFIG.allowedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
        return DEFAULT_CONFIG.productionUrl;
      } else {
        return DEFAULT_CONFIG.productionUrl;
      }
    }
  }
})(); 