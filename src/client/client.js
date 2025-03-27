// Visitor Counter Integration
// Add this script to any website to track visitors
// Visitor Counter Microservice

(function() {
  // Get script element and server path
  const scriptElement = document.currentScript;
  
  // Check if we're on localhost development server
  const isLocalhost = /^localhost$|^127\.([0-9]+\.){0,2}[0-9]+$|^\[::1?\]$/.test(window.location.hostname);
  const isDevServer = window.location.port && ['5001', '5002', '5003'].includes(window.location.port);
  const isFileProtocol = "file:" === window.location.protocol;
  const isIframe = window !== window.parent;

  // Debug mode (add data-debug to script tag to enable)
  const debugMode = scriptElement?.getAttribute('data-debug') === 'true';
  
  // Disable tracking on unwanted environments
  if ((isLocalhost && !isDevServer && !debugMode) || isFileProtocol || isIframe) {
    console.log("Visitor Counter: Tracking disabled on localhost (not a dev server), file protocol, or inside iframe");
    return;
  }
  
  // Debug logging
  function log(...args) {
    if (debugMode) {
      console.log("[Visitor Counter]", ...args);
    }
  }
  
  // Automatically determine server URL from script source
  const getServerUrl = () => {
    // If the script is loaded from our domain, use that domain
    const scriptSrc = scriptElement?.src;
    if (scriptSrc) {
      try {
        const scriptUrl = new URL(scriptSrc);
        log("Using script source origin:", scriptUrl.origin);
        // If script is loaded from our server, use that server URL
        return scriptUrl.origin;
      } catch (e) {
        // If URL parsing fails, fallback to auto-detection
        log("Failed to parse script URL:", e);
      }
    }

    // If we're on dev server, use the current origin
    if (isDevServer) {
      log("Using dev server origin:", window.location.origin);
      return window.location.origin;
    }

    // For production, use a dedicated tracking domain if available
    const trackingDomain = scriptElement?.getAttribute('data-tracking-domain');
    if (trackingDomain) {
      log("Using tracking domain:", trackingDomain);
      return trackingDomain.startsWith('http') ? trackingDomain : `https://${trackingDomain}`;
    }

    // Last resort: use the current origin (self-hosted mode)
    log("Using current origin (self-hosted):", window.location.origin);
    return window.location.origin;
  };

  // Store current page path
  let currentPath = window.location.pathname;
  let socket = null;

  // Load Socket.io client
  const script = document.createElement('script');
  script.src = 'https://cdn.socket.io/4.6.0/socket.io.min.js';
  script.onload = initVisitorCounter;
  document.head.appendChild(script);

  function initVisitorCounter() {
    // Get server URL
    const serverUrl = getServerUrl();
    log("Connecting to server:", serverUrl);
    
    // Connect to socket server
    socket = io(serverUrl, {
      withCredentials: false,
      transports: ['websocket', 'polling'],
      query: {
        page: window.location.pathname,
        referrer: document.referrer || 'direct',
        hostname: window.location.hostname,
        title: document.title
      }
    });

    // Connection events
    socket.on('connect', () => {
      log("Connected to visitor counter service");
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
  }
  
  function trackPageView() {
    if (!socket) return;
    
    // Send page view event
    const pageData = { 
      path: window.location.pathname, 
      referrer: document.referrer || 'direct',
      title: document.title,
      url: window.location.href
    };
    
    log("Tracking page view:", pageData);
    socket.emit('page-view', pageData);
    
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
      log("URL changed from", currentPath, "to", window.location.pathname);
      
      // Send page exit for the previous page
      if (socket) {
        socket.emit('page-exit', { path: currentPath });
      }
      
      // Track the new page
      trackPageView();
    }
  }
})(); 