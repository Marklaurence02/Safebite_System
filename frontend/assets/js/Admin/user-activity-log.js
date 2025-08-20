// js/user-activity-log.js

// Global variables for user activity log data
let userActivityLogData = [];
let currentActivityLogPage = 1;
let activityLogRecordsPerPage = 25;
let totalActivityLogRecords = 0;
let currentActivityFilters = {
  actionType: 'all',
  startDate: '',
  endDate: '',
  userFilter: ''
};

// Function to format timestamp to relative time
function formatRelativeTime(timestamp) {
  const now = new Date();
  const logTime = new Date(timestamp);
  const diffInMs = now - logTime;
  
  // Convert to minutes and hours
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    // For older dates, show the actual date
    return logTime.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: logTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

// Function to fetch user activity logs from API
async function fetchUserActivityLogs(page = 1, limit = 25) {
  try {
    // Get current filters
    const actionType = document.getElementById('activityTypeFilter')?.value || 'all';
    const startDate = document.getElementById('activityDateStart')?.value || '';
    const endDate = document.getElementById('activityDateEnd')?.value || '';
    const userFilter = document.getElementById('activityUserFilter')?.value || '';
    
    // Build query parameters
    const params = new URLSearchParams({
      page: page,
      limit: limit,
      action_type: actionType,
      start_date: startDate,
      end_date: endDate,
      user_filter: userFilter
    });
    
    // Get session token from localStorage
    const sessionToken = localStorage.getItem('sessionToken');
    
    const response = await fetch(`../../backend/api/Admin-api/get-all-user-logs.php?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      userActivityLogData = result.data;
      totalActivityLogRecords = result.pagination.total_records;
      currentActivityLogPage = result.pagination.current_page;
      activityLogRecordsPerPage = result.pagination.records_per_page;
      
      // Update current filters
      currentActivityFilters = {
        actionType: result.filters.action_type,
        startDate: result.filters.start_date,
        endDate: result.filters.end_date,
        userFilter: result.filters.user_filter
      };
      
      renderUserActivityLogTable();
      renderUserActivityLogPagination(totalActivityLogRecords);
    } else {
      console.error('API Error:', result.error);
      userActivityLogData = [];
      totalActivityLogRecords = 0;
      renderUserActivityLogTable();
    }
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    userActivityLogData = [];
    totalActivityLogRecords = 0;
    renderUserActivityLogTable();
  }
}

function renderUserActivityLogTable() {
  const tbody = document.getElementById('activityLogTableBody');
  if (!tbody) {
    return;
  }
  
  if (userActivityLogData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">
      <div class="empty-state-content">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-title">No User Activity Found</div>
        <div class="empty-state-desc">Try adjusting your filters or check back later for new activity.</div>
      </div>
    </td></tr>`;
    return;
  }
  
  // Data is already paginated from the API
  tbody.innerHTML = userActivityLogData.map(row => {
    // Determine activity type from action text
    let activityType = 'update';
    const action = row.action.toLowerCase();
    if (action.includes('login') || action.includes('logged in')) activityType = 'login';
    else if (action.includes('logout') || action.includes('logged out')) activityType = 'logout';
    else if (action.includes('add') || action.includes('created')) activityType = 'add';
    else if (action.includes('edit') || action.includes('updated')) activityType = 'edit';
    else if (action.includes('delete') || action.includes('deleted')) activityType = 'delete';
    
    // Format timestamp to relative time
    const relativeTime = formatRelativeTime(row.timestamp);
    
    return `
      <tr>
        <td><strong>${row.username}</strong></td>
        <td><span class="activity-badge activity-${activityType}">${activityType.charAt(0).toUpperCase() + activityType.slice(1)}</span></td>
        <td>${relativeTime}</td>
        <td>${row.action}</td>
      </tr>
    `;
  }).join('');
}

function renderUserActivityLogPagination(totalRecords) {
  const paginationDiv = document.getElementById('activityLogPagination');
  if (!paginationDiv) return;
  
  const totalPages = Math.ceil(totalRecords / activityLogRecordsPerPage);
  
  if (totalPages <= 1) {
    paginationDiv.innerHTML = '';
    return;
  }
  
  let paginationHTML = '<div class="pagination-info">';
  paginationHTML += `Showing ${((currentActivityLogPage - 1) * activityLogRecordsPerPage) + 1} to ${Math.min(currentActivityLogPage * activityLogRecordsPerPage, totalRecords)} of ${totalRecords} records`;
  paginationHTML += '</div>';
  
  paginationHTML += '<div class="pagination-controls">';
  
  // Previous button
  if (currentActivityLogPage > 1) {
    paginationHTML += `<button class="pagination-btn" onclick="changeActivityLogPage(${currentActivityLogPage - 1})">‹ Previous</button>`;
  }
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentActivityLogPage) {
      paginationHTML += `<button class="pagination-btn active">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= currentActivityLogPage - 2 && i <= currentActivityLogPage + 2)) {
      paginationHTML += `<button class="pagination-btn" onclick="changeActivityLogPage(${i})">${i}</button>`;
    } else if (i === currentActivityLogPage - 3 || i === currentActivityLogPage + 3) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
  }
  
  // Next button
  if (currentActivityLogPage < totalPages) {
    paginationHTML += `<button class="pagination-btn" onclick="changeActivityLogPage(${currentActivityLogPage + 1})">Next ›</button>`;
  }
  
  paginationHTML += '</div>';
  paginationDiv.innerHTML = paginationHTML;
}

function changeActivityLogPage(page) {
  currentActivityLogPage = page;
  fetchUserActivityLogs(page, activityLogRecordsPerPage);
}

function changeActivityLogRecordsPerPage(recordsPerPage) {
  activityLogRecordsPerPage = parseInt(recordsPerPage);
  currentActivityLogPage = 1;
  fetchUserActivityLogs(1, recordsPerPage);
}

function handleUserActivityLogFilters() {
  currentActivityLogPage = 1;
  fetchUserActivityLogs(1, activityLogRecordsPerPage);
}

function exportUserActivityLogExcel() {
  let csv = 'User,Activity,Date/Time,Details\n';
  csv += userActivityLogData.map(row => {
    // Determine activity type from action text
    let activityType = 'Update';
    const action = row.action.toLowerCase();
    if (action.includes('login') || action.includes('logged in')) activityType = 'Login';
    else if (action.includes('logout') || action.includes('logged out')) activityType = 'Logout';
    else if (action.includes('add') || action.includes('created')) activityType = 'Add';
    else if (action.includes('edit') || action.includes('updated')) activityType = 'Edit';
    else if (action.includes('delete') || action.includes('deleted')) activityType = 'Delete';
    
    // Format timestamp to relative time for export
    const relativeTime = formatRelativeTime(row.timestamp);
    
    return [row.username, activityType, relativeTime, row.action].map(v => '"' + v.replace(/"/g, '""') + '"').join(',');
  }).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'user-activity-log.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportUserActivityLogPDF() {
  const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('Generated Report', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text('Report: User Activity Log', doc.internal.pageSize.getWidth() / 2, 90, { align: 'center' });
  doc.setFontSize(12);
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  doc.text(`Generated on: ${dateStr}`, doc.internal.pageSize.getWidth() / 2, 110, { align: 'center' });

  // Prepare table data
  const tableData = userActivityLogData.map(row => {
    // Determine activity type from action text
    let activityType = 'Update';
    const action = row.action.toLowerCase();
    if (action.includes('login') || action.includes('logged in')) activityType = 'Login';
    else if (action.includes('logout') || action.includes('logged out')) activityType = 'Logout';
    else if (action.includes('add') || action.includes('created')) activityType = 'Add';
    else if (action.includes('edit') || action.includes('updated')) activityType = 'Edit';
    else if (action.includes('delete') || action.includes('deleted')) activityType = 'Delete';
    
    // Format timestamp to relative time for export
    const relativeTime = formatRelativeTime(row.timestamp);
    
    return [row.username, activityType, relativeTime, row.action];
  });
  
  doc.autoTable({
    startY: 130,
    head: [['User', 'Activity', 'Date/Time', 'Details']],
    body: tableData,
    styles: { fontSize: 12, cellPadding: 8 },
    headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 40, right: 40 }
  });
  doc.save('user-activity-log.pdf');
}

// Initialize user activity log functionality
function initializeUserActivityLog() {
  // Set up event listeners
  const filterBtn = document.getElementById('filterActivityLogBtn');
  const excelBtn = document.getElementById('exportActivityLogExcel');
  const pdfBtn = document.getElementById('exportActivityLogPDF');
  
  if (filterBtn) {
    filterBtn.addEventListener('click', handleUserActivityLogFilters);
  }
  
  if (excelBtn) {
    excelBtn.addEventListener('click', exportUserActivityLogExcel);
  }
  
  if (pdfBtn) {
    pdfBtn.addEventListener('click', exportUserActivityLogPDF);
  }
  
  // Initial fetch from API
  fetchUserActivityLogs(1, activityLogRecordsPerPage);
}

// Export functions for global access
window.changeActivityLogPage = changeActivityLogPage;
window.changeActivityLogRecordsPerPage = changeActivityLogRecordsPerPage;
window.initializeUserActivityLog = initializeUserActivityLog;

// Legacy function for backward compatibility
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

window.showUserActivityLog = showUserActivityLog;