// js/spa.js
// Handles Single-Page Application content loading

function showDashboard() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('dashboard-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    
    // Initialize filter event listeners
    if (window.initializeFilterEventListeners) {
      window.initializeFilterEventListeners();
    }
    
    // Update dashboard display with current filter state
    if (window.updateDashboardDisplay) {
      window.updateDashboardDisplay();
    }
    
    // Re-initialize the dashboard charts after loading the content.
    if (window.initializeDashboardStatCharts) {
      window.initializeDashboardStatCharts();
    }
    if (window.initializeActivityChart) {
      window.initializeActivityChart();
    }
  }
}

function showAnalyticsSummary() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('analytics-summary-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
  }
}

function showAnalyticsDetail() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('analytics-detail-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    // Initialize the sensor analytics connector with proper timing
    if (window.sensorAnalyticsConnector) {
      // Use a longer timeout to ensure DOM is fully rendered
      setTimeout(() => {
        try {
          window.sensorAnalyticsConnector.init();
          console.log('Sensor Analytics Connector initialized successfully');
        } catch (error) {
          console.error('Error initializing Sensor Analytics Connector:', error);
          // Retry once more after a longer delay
          setTimeout(() => {
            try {
              window.sensorAnalyticsConnector.init();
              console.log('Sensor Analytics Connector initialized on retry');
            } catch (retryError) {
              console.error('Failed to initialize Sensor Analytics Connector on retry:', retryError);
            }
          }, 500);
        }
      }, 200);
    }
  }
}

function showReportGenerator() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('report-generator-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    if (window.initReportGenerator) {
      window.initReportGenerator();
    }
  }
}

function showUsers() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('users-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    if (window.initUserManager) {
      window.initUserManager();
    }
  }
}

function showUserActivityLog() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('user-activity-log-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    if (window.initializeUserActivityLog) {
      window.initializeUserActivityLog();
    }
  }
}

function showFeedbacks() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('feedbacks-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
  }
}

function showAdminLog() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('admin-log-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    // Initialize admin log functionality
    if (window.initializeAdminLog) {
      window.initializeAdminLog();
    }
  }
}

function switchPage(page) {
    // If the page is a detail view, we want the parent summary item in the sidebar to be active.
    const sidebarPage = page === 'analytics-detail' ? 'analytics-summary' : page;

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${sidebarPage}"]`);
    if (activeLink) {
        activeLink.closest('.nav-item').classList.add('active');
    }

    // Render page content
    if (page === 'dashboard') {
        showDashboard();
    } else if (page === 'analytics-summary') {
        showAnalyticsSummary();
    } else if (page === 'analytics-detail') {
        showAnalyticsDetail();
    } else if (page === 'report-generator') {
        showReportGenerator();
    } else if (page === 'users') {
        showUsers();
    } else if (page === 'user-activity-log') {
        showUserActivityLog();
    } else if (page === 'admin-log') {
        showAdminLog();
    } else if (page === 'feedbacks') {
        showFeedbacks();
    }

    // Update header button active state (for summary/detail views)
    setTimeout(() => {
      document.querySelectorAll('.spoilage-header-buttons .spoilage-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === page) {
          btn.classList.add('active');
        }
      });
    }, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    // Use event delegation on the body to handle clicks from static (sidebar) 
    // and dynamic (page content) elements.
    document.body.addEventListener('click', (event) => {
        // Find the closest ancestor with a data-page attribute
        const target = event.target.closest('[data-page]');
        if (target) {
            event.preventDefault(); // Prevent default link behavior
            const page = target.getAttribute('data-page');
            if(page) {
                switchPage(page);
            }
        }
    });

    // Load the initial page
    switchPage('dashboard');
}); 