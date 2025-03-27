document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dashboard
    loadDashboardData();
    
    // Set up refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadDashboardData();
    });
    
    // Set up reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all analytics data?')) {
            resetAnalyticsData();
        }
    });
    
    // Auto refresh every 1 minute
    setInterval(loadDashboardData, 60000);
});

/**
 * Reset analytics data
 */
async function resetAnalyticsData() {
    try {
        const response = await fetch('/api/analytics/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
        const result = await response.json();
        
        // Show success message
        alert(`Analytics data reset successfully at ${formatDateTime(result.resetTime)}`);
        
        // Reload dashboard data
        loadDashboardData();
    } catch (error) {
        console.error('Error resetting analytics data:', error);
        alert('Failed to reset analytics data');
    }
}

/**
 * Load all dashboard data from API endpoints
 */
async function loadDashboardData() {
    try {
        // Fetch overview data
        const overviewData = await fetchData('/api/analytics');
        
        // Fetch real visitor count from the accurate endpoint
        const visitorDetailsData = await fetchData('/api/visitors/details');
        
        // Calculate active visitors (connected in the last 5 minutes)
        const now = new Date();
        const activeThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
        const activeVisitors = visitorDetailsData.clients.filter(client => {
            const lastActiveTime = new Date(client.lastActive).getTime();
            return now.getTime() - lastActiveTime < activeThreshold;
        }).length;
        
        // Update overview with combined data
        updateOverviewSection({
            ...overviewData,
            totalVisitors: visitorDetailsData.count, // Use the count from /api/visitors/details
            activeVisitors: activeVisitors // Use calculated active visitors
        });
        
        // Update last reset time
        if (overviewData.lastResetTime) {
            document.getElementById('lastResetTime').textContent = formatDateTime(overviewData.lastResetTime);
        }
        
        // Fetch page analytics
        const pageData = await fetchData('/api/analytics/pages');
        updatePageAnalytics(pageData);
        
        // Fetch popular pages
        const popularPages = await fetchData('/api/analytics/pages/popular');
        updatePopularPages(popularPages);
        
        // Fetch entry pages
        const entryPages = await fetchData('/api/analytics/pages/entry');
        updateEntryPages(entryPages);
        
        // Fetch exit pages
        const exitPages = await fetchData('/api/analytics/pages/exit');
        updateExitPages(exitPages);
        
        // Fetch client details
        const clientDetails = await fetchData('/api/analytics/clients');
        updateVisitorDetails(clientDetails);
        
        // Fetch visitor journeys
        const journeyData = await fetchData('/api/analytics/journeys');
        updateJourneys(journeyData);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

/**
 * Fetch data from API endpoint
 */
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
}

/**
 * Update the overview section with data
 */
function updateOverviewSection(data) {
    document.getElementById('totalVisitors').textContent = data.totalVisitors;
    document.getElementById('activeVisitors').textContent = data.activeVisitors;
    
    if (data.popularPages && data.popularPages.length > 0) {
        const topPage = data.popularPages[0];
        document.getElementById('mostPopularPage').textContent = formatPath(topPage.path);
        document.getElementById('mostPopularPageViews').textContent = `${topPage.views} views`;
    }
    
    if (data.topEntryPages && data.topEntryPages.length > 0) {
        const topEntryPage = data.topEntryPages[0];
        document.getElementById('topEntryPage').textContent = formatPath(topEntryPage.path);
        document.getElementById('topEntryPageCount').textContent = `${topEntryPage.isEntryPage} entries`;
    }
}

/**
 * Update the page analytics section
 */
function updatePageAnalytics(data) {
    // This can be used for additional page analytics visualizations
    // Currently other specific tables are handled by other functions
}

/**
 * Update popular pages table
 */
function updatePopularPages(data) {
    const tableBody = document.getElementById('popularPages');
    tableBody.innerHTML = '';
    
    if (!data.pages || data.pages.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" class="text-center">No data available</td>';
        tableBody.appendChild(row);
        return;
    }
    
    data.pages.forEach(page => {
        const row = document.createElement('tr');
        
        const pathCell = document.createElement('td');
        pathCell.innerHTML = `<span class="truncate-text" title="${page.path}">${formatPath(page.path)}</span>`;
        
        const viewsCell = document.createElement('td');
        viewsCell.textContent = page.views;
        
        const durationCell = document.createElement('td');
        // Ensure we have a valid duration value (default to 0 if not present)
        const duration = typeof page.averageDuration === 'number' ? page.averageDuration : 0;
        durationCell.textContent = formatDuration(duration);
        
        row.appendChild(pathCell);
        row.appendChild(viewsCell);
        row.appendChild(durationCell);
        
        tableBody.appendChild(row);
    });
}

/**
 * Update entry pages table
 */
function updateEntryPages(data) {
    const tableBody = document.getElementById('entryPages');
    tableBody.innerHTML = '';
    
    if (!data.pages || data.pages.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="2" class="text-center">No data available</td>';
        tableBody.appendChild(row);
        return;
    }
    
    data.pages.forEach(page => {
        const row = document.createElement('tr');
        
        const pathCell = document.createElement('td');
        pathCell.innerHTML = `<span class="truncate-text" title="${page.path}">${formatPath(page.path)}</span>`;
        
        const countCell = document.createElement('td');
        countCell.textContent = page.isEntryPage;
        
        row.appendChild(pathCell);
        row.appendChild(countCell);
        
        tableBody.appendChild(row);
    });
}

/**
 * Update exit pages table
 */
function updateExitPages(data) {
    const tableBody = document.getElementById('exitPages');
    tableBody.innerHTML = '';
    
    if (!data.pages || data.pages.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="2" class="text-center">No data available</td>';
        tableBody.appendChild(row);
        return;
    }
    
    data.pages.forEach(page => {
        const row = document.createElement('tr');
        
        const pathCell = document.createElement('td');
        pathCell.innerHTML = `<span class="truncate-text" title="${page.path}">${formatPath(page.path)}</span>`;
        
        const countCell = document.createElement('td');
        countCell.textContent = page.isExitPage;
        
        row.appendChild(pathCell);
        row.appendChild(countCell);
        
        tableBody.appendChild(row);
    });
}

/**
 * Update visitor details table
 */
function updateVisitorDetails(data) {
    const tableBody = document.getElementById('visitorDetails');
    tableBody.innerHTML = '';
    
    if (!data.clients || data.clients.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="text-center">No data available</td>';
        tableBody.appendChild(row);
        return;
    }
    
    data.clients.forEach(client => {
        const row = document.createElement('tr');
        
        // Client ID (truncated)
        const idCell = document.createElement('td');
        idCell.innerHTML = `<span title="${client.id}">${truncateString(client.id, 8)}</span>`;
        
        // Browser
        const browserCell = document.createElement('td');
        browserCell.innerHTML = `<span class="badge bg-info">${client.browser || 'Unknown'}</span>`;
        
        // Device type
        const deviceCell = document.createElement('td');
        deviceCell.innerHTML = `<span class="badge bg-secondary">${client.deviceType || 'Unknown'}</span>`;
        
        // Connection time
        const connTimeCell = document.createElement('td');
        connTimeCell.textContent = formatDateTime(client.connectionTime);
        
        // Last active
        const lastActiveCell = document.createElement('td');
        lastActiveCell.textContent = formatDateTime(client.lastActive);
        
        // Pages visited count
        const pagesVisitedCell = document.createElement('td');
        pagesVisitedCell.textContent = client.pagesVisited ? client.pagesVisited.length : 0;
        
        row.appendChild(idCell);
        row.appendChild(browserCell);
        row.appendChild(deviceCell);
        row.appendChild(connTimeCell);
        row.appendChild(lastActiveCell);
        row.appendChild(pagesVisitedCell);
        
        tableBody.appendChild(row);
    });
}

/**
 * Update visitor journeys section
 */
function updateJourneys(data) {
    const journeysContainer = document.getElementById('journeysList');
    journeysContainer.innerHTML = '';
    
    if (!data.journeys || data.journeys.length === 0) {
        journeysContainer.innerHTML = '<div class="text-center p-3">No journey data available</div>';
        return;
    }
    
    data.journeys.forEach(journey => {
        const journeyItem = document.createElement('div');
        journeyItem.className = 'journey-item';
        
        // Journey header
        const journeyHeader = document.createElement('div');
        journeyHeader.className = 'journey-header';
        journeyHeader.innerHTML = `
            <h5>Visitor ${truncateString(journey.clientId, 8)}</h5>
            <small class="text-muted">${journey.path.length} page(s) visited</small>
        `;
        
        // Journey path visualization
        const journeyPath = document.createElement('div');
        journeyPath.className = 'journey-path';
        
        if (journey.path && journey.path.length > 0) {
            journey.path.forEach((visit, index) => {
                // Add step
                const step = document.createElement('span');
                step.className = 'journey-step';
                step.textContent = formatPath(visit.path);
                journeyPath.appendChild(step);
                
                // Add arrow if not the last step
                if (index < journey.path.length - 1) {
                    const arrow = document.createElement('span');
                    arrow.className = 'journey-arrow';
                    arrow.innerHTML = '<i class="bi bi-arrow-right"></i>';
                    journeyPath.appendChild(arrow);
                }
            });
        } else {
            journeyPath.innerHTML = '<div class="text-muted">No path data</div>';
        }
        
        journeyItem.appendChild(journeyHeader);
        journeyItem.appendChild(journeyPath);
        journeysContainer.appendChild(journeyItem);
    });
}

// Helper functions

/**
 * Format a path for display
 */
function formatPath(path) {
    if (!path) return '/';
    return path === '/' ? 'Homepage' : path;
}

/**
 * Format duration in seconds to a readable format
 */
function formatDuration(seconds) {
    if (seconds === null || seconds === undefined) return 'N/A';
    
    // Eğer süre 0 ise, özel mesaj göster
    if (seconds === 0) return 'Hesaplanıyor...';
    
    // Süreyi 2 ondalık basamağa yuvarla
    seconds = Math.round(seconds * 100) / 100;
    
    if (seconds < 60) {
        return `${seconds}s`;
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    }
}

/**
 * Format date and time
 */
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format: HH:MM:SS (Today) or DD/MM/YYYY HH:MM:SS
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();
    
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const timeStr = date.toLocaleTimeString(undefined, timeOptions);
    
    if (isToday) {
        return `${timeStr} (Today)`;
    } else {
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const dateStr = date.toLocaleDateString(undefined, dateOptions);
        return `${dateStr} ${timeStr}`;
    }
}

/**
 * Truncate a string to specific length
 */
function truncateString(str, length) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
}