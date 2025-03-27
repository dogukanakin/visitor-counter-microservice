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

  // Store current page path
  let currentPath = window.location.pathname;
  let socket = null;

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
    socket = io(serverUrl, {
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
      
      // Track the initial page view
      trackPageView();
      
      // Set up tracking for page changes
      setupPageTracking();
    });

    socket.on('connect_error', (error) => {
      console.warn('Visitor counter connection error:', error.message);
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      if (socket) {
        // Send page exit event
        socket.emit('page-exit', { path: currentPath });
        socket.disconnect();
      }
    });
    
    // Expose socket for debugging if needed
    window.visitorCounterSocket = socket;
  }
  
  function trackPageView() {
    if (!socket) return;
    
    // Send page view event
    socket.emit('page-view', { 
      path: window.location.pathname, 
      referrer: document.referrer || 'direct'
    });
    
    currentPath = window.location.pathname;
  }
  
  function setupPageTracking() {
    // Track history changes
    if (window.history && window.history.pushState) {
      // Save original methods
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;
      
      // Override pushState
      window.history.pushState = function(state, title, url) {
        originalPushState.apply(this, [state, title, url]);
        handleUrlChange();
      };
      
      // Override replaceState
      window.history.replaceState = function(state, title, url) {
        originalReplaceState.apply(this, [state, title, url]);
        handleUrlChange();
      };
      
      // Listen for popstate events
      window.addEventListener('popstate', handleUrlChange);
    }
    
    // For SPAs - catch link clicks
    document.addEventListener('click', (e) => {
      // Check if it's a link
      let element = e.target;
      while (element && element.tagName !== 'A') {
        element = element.parentElement;
      }
      
      // If it's an internal link, we'll catch it with the history API hooks
      // If it's an external link, the beforeunload event will handle it
    });
  }
  
  function handleUrlChange() {
    // Only track if the path has changed
    if (window.location.pathname !== currentPath) {
      // Send page exit for the previous page
      if (socket) {
        socket.emit('page-exit', { path: currentPath });
      }
      
      // Track the new page
      trackPageView();
    }
  }

  async function getServerUrl() {
    const hostname = window.location.hostname;

    try {
      // Check if running from the visitor counter server itself
      const isRunningFromVisitorServer = 
        (hostname === 'localhost' || hostname === '127.0.0.1') && 
        (window.location.port === '5003' || window.location.port === '5002' || window.location.port === '5001');
      
      // Only try to fetch config if running from the visitor counter server
      if (isRunningFromVisitorServer) {
        try {
          // First try to get configuration from the server
          const response = await fetch('/config');
          if (response.ok) {
            const config = await response.json();
            
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
              return config.localUrl;
            } else if (config.allowedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
              return config.productionUrl;
            } else {
              return config.productionUrl;
            }
          }
        } catch (configError) {
          console.warn('Failed to fetch /config, using default values');
        }
      }
      
      // Use default configuration
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return DEFAULT_CONFIG.localUrl;
      } else if (DEFAULT_CONFIG.allowedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
        return DEFAULT_CONFIG.productionUrl;
      } else {
        return DEFAULT_CONFIG.productionUrl;
      }
    } catch (error) {
      console.warn('Error determining server URL, using fallback values:', error);
      return DEFAULT_CONFIG.localUrl;
    }
  }
})(); 