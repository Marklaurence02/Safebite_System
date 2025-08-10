// spoilageReport.js - Render spoilage rate by food type (bar chart)

// Initialize spoilage report functionality
function initSpoilageReport() {
  const canvas = document.getElementById('spoilageChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 320;

  // Dummy data
  const foods = ['Adobo', 'Sinigang', 'Milk', 'Chicken'];
  const rates = [32, 24, 18, 12];

  // Chart area
  const padding = 50;
  const w = canvas.width;
  const h = canvas.height;
  const chartW = w - padding * 2;
  const chartH = h - padding * 1.5;
  const maxVal = Math.max(...rates) + 5;

  // Draw Y axis grid/labels
  ctx.font = '14px Open Sans, Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 5; i++) {
    const val = Math.round(maxVal * (5 - i) / 5);
    const y = padding + chartH * i / 5;
    ctx.fillText(val, padding - 10, y);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw bars
  const barWidth = chartW / foods.length * 0.6;
  foods.forEach((food, i) => {
    const x = padding + (i + 0.2) * (chartW / foods.length);
    const y = padding + chartH - (rates[i] / maxVal) * chartH;
    const barH = (rates[i] / maxVal) * chartH;
    // Bar gradient
    const grad = ctx.createLinearGradient(x, y, x, y + barH);
    grad.addColorStop(0, '#3b7bfa');
    grad.addColorStop(1, '#22336a');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barWidth, barH);
    // Bar border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, barWidth, barH);
    // Value label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px Open Sans, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(rates[i], x + barWidth/2, y - 14);
  });

  // Draw X axis labels
  ctx.font = '15px Open Sans, Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.textAlign = 'center';
  foods.forEach((food, i) => {
    const x = padding + (i + 0.2) * (chartW / foods.length) + barWidth/2;
    ctx.fillText(food, x, h - padding/2 + 18);
  });

  // Filter and export stubs
  document.getElementById('export-csv').onclick = () => alert('Export CSV not implemented');
  document.getElementById('export-pdf').onclick = () => alert('Export PDF not implemented');
  document.getElementById('filter-date').onchange = () => alert('Filtering not implemented');
  document.getElementById('filter-user').onchange = () => alert('Filtering not implemented');
  document.getElementById('filter-food').onchange = () => alert('Filtering not implemented');
  
  // Set up navigation buttons
  setupSpoilageNavigation();
}

// Initialize detailed report functionality
function initDetailedReport() {
  // Set up event handlers for detailed report buttons
  const clearFiltersBtn = document.querySelector('.filter-btn:not(.export)');
  const exportCsvBtn = document.querySelector('.filter-btn.export');
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function() {
      // Clear all filter inputs
      const filterInputs = document.querySelectorAll('.detailed-report-filters input, .detailed-report-filters select');
      filterInputs.forEach(input => {
        if (input.type === 'date') {
          input.value = '';
        } else if (input.tagName === 'SELECT') {
          input.selectedIndex = 0;
        }
      });
      console.log('Filters cleared');
    });
  }
  
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', function() {
      alert('Export CSV functionality will be implemented');
    });
  }
  
  // Set up date range functionality
  const startDateInput = document.querySelector('.detailed-report-filters input[type="date"]:first-of-type');
  const endDateInput = document.querySelector('.detailed-report-filters input[type="date"]:last-of-type');
  
  if (startDateInput && endDateInput) {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];
  }
  
  // Set up navigation buttons
  setupSpoilageNavigation();
  
  console.log('Detailed report initialized');
}

// Set up navigation buttons for spoilage reports
function setupSpoilageNavigation() {
  const navigationButtons = document.querySelectorAll('.spoilage-btn');
  navigationButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const targetPage = this.getAttribute('data-page');
      if (targetPage) {
        // Update active state
        navigationButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Navigate to the target page
        if (window.switchPage) {
          window.switchPage(targetPage);
        }
      }
    });
  });
}

// Make functions globally available
window.initSpoilageReport = initSpoilageReport;
window.initDetailedReport = initDetailedReport;
window.setupSpoilageNavigation = setupSpoilageNavigation;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize if DOM is already loaded
  if (document.getElementById('spoilageChart')) {
    initSpoilageReport();
  }
}); 