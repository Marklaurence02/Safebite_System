// js/spa.js
// Handles Single-Page Application content loading

function showDashboard() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('dashboard-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    // Re-initialize the dashboard charts after loading the content.
    initializeDashboardStatCharts();
    initializeActivityChart();
    
    // Initialize sensor dashboard
    if (window.SensorDashboard) {
      window.sensorDashboard = new SensorDashboard();
    }
  }
}

function showSpoilageReport() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('spoilage-report-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    // Initialize spoilage report functionality
    if (window.initSpoilageReport) window.initSpoilageReport();
  }
}

function showDetailedReport() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('detailed-report-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    // Initialize detailed report functionality
    if (window.initDetailedReport) window.initDetailedReport();
  }
}

function showConfig() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('config-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    // Dynamically load config.css if not already loaded
    if (!document.getElementById('config-css')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'CSS/config.css';
      link.id = 'config-css';
      document.head.appendChild(link);
    }

    // Inline tab logic setup (removed, now handled in config.js)

    // Dynamically load config.js if not already loaded
    if (!document.getElementById('config-js')) {
      const script = document.createElement('script');
      script.src = 'JS/config.js';
      script.id = 'config-js';
      script.onload = function() {
        if (window.initConfigPage) window.initConfigPage();
      };
      document.body.appendChild(script);
    } else {
      if (window.initConfigPage) window.initConfigPage();
    }
  }
}

function showReportGenerator() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('report-generator-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    
    // Dynamically load report-generator.css if not already loaded
    if (!document.getElementById('report-generator-css')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'CSS/report-generator.css';
      link.id = 'report-generator-css';
      document.head.appendChild(link);
    }

    // Initialize report generator functionality
    if (window.ReportGenerator) {
      const reportGen = new ReportGenerator();
      reportGen.addNotificationStyles();
    }
  }
}

function showAnalysis() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('analysis-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    // Dynamically load analysis.css if not already loaded
    if (!document.getElementById('analysis-css')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'CSS/analysis.css';
      link.id = 'analysis-css';
      document.head.appendChild(link);
    }
    // Always remove and re-add analysis.js to re-initialize tab logic
    const oldScript = document.getElementById('analysis-js');
    if (oldScript) oldScript.remove();
    const script = document.createElement('script');
    script.src = 'JS/analysis.js';
    script.id = 'analysis-js';
    script.onload = function() {
      if (window.initAnalysisPage) window.initAnalysisPage();
    };
    document.body.appendChild(script);
    // If script is already loaded (from cache), call initAnalysisPage immediately
    if (window.initAnalysisPage) window.initAnalysisPage();
  }
}

function showUserLog() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('user-log-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    // Dynamically load user-log.css if not already loaded
    if (!document.getElementById('user-log-css')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'CSS/user-log.css';
      link.id = 'user-log-css';
      document.head.appendChild(link);
    }
    // Always remove and re-add user-log.js to re-initialize logic
    const oldScript = document.getElementById('user-log-js');
    if (oldScript) oldScript.remove();
    const script = document.createElement('script');
    script.src = 'JS/user-log.js';
    script.id = 'user-log-js';
    script.onload = function() {
      if (window.initUserLogPage) window.initUserLogPage();
    };
    document.body.appendChild(script);
    // If script is already loaded (from cache), call initUserLogPage immediately
    if (window.initUserLogPage) window.initUserLogPage();
  }
}

function removeConfigAssets() {
  const css = document.getElementById('config-css');
  if (css) css.remove();
  const js = document.getElementById('config-js');
  if (js) js.remove();
}

function switchPage(page) {
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) {
        activeLink.closest('.nav-item').classList.add('active');
    }

    // Remove config assets if navigating away
    if (page !== 'config') {
      removeConfigAssets();
    }

    // Render page content
    if (page === 'dashboard') {
        showDashboard();
    } else if (page === 'spoilage-report') {
        showSpoilageReport();
    } else if (page === 'detailed-report') {
        showDetailedReport();
    } else if (page === 'config') {
        showConfig();
    } else if (page === 'report-generator') {
        showReportGenerator();
    } else if (page === 'analysis') {
        showAnalysis();
    } else if (page === 'user-log') {
      showUserLog();
    }

    // Update header button active state (for spoilage/detailed report views)
    setTimeout(() => {
      document.querySelectorAll('.spoilage-header-buttons .spoilage-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === page) {
          btn.classList.add('active');
        }
      });
    }, 0);
}

// Make switchPage globally available
window.switchPage = switchPage;

document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.getElementById('menu-toggle');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      document.body.classList.toggle('sidebar-open');
    });
  }
});

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