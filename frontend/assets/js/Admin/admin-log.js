

// Global variables for admin log data
let adminLogData = [];
let currentAdminLogPage = 1;
let adminLogRecordsPerPage = 25;
let totalAdminLogRecords = 0;
let currentFilters = {
  actionType: 'all',
  startDate: '',
  endDate: '',
  adminFilter: ''
};

function getFilteredAdminLogData() {
  // Return the current data from API (already filtered on server side)
  return adminLogData;
}

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

// Function to fetch admin logs from API
async function fetchAdminLogs(page = 1, limit = 25) {
  try {
    // Get current filters
    const actionType = document.getElementById('adminLogActivityType')?.value || 'all';
    const startDate = document.getElementById('adminLogStartDate')?.value || '';
    const endDate = document.getElementById('adminLogEndDate')?.value || '';
    const adminFilter = document.getElementById('adminLogAdminFilter')?.value || '';
    
    // Build query parameters
    const params = new URLSearchParams({
      page: page,
      limit: limit,
      action_type: actionType,
      start_date: startDate,
      end_date: endDate,
      admin_filter: adminFilter
    });
    
    // Get session token from localStorage
    const sessionToken = localStorage.getItem('sessionToken');
    
    const response = await fetch(`../../backend/api/Admin-api/get-admin-logs.php?${params}`, {
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
      adminLogData = result.data;
      totalAdminLogRecords = result.pagination.total_records;
      currentAdminLogPage = result.pagination.current_page;
      adminLogRecordsPerPage = result.pagination.records_per_page;
      
      // Update current filters
      currentFilters = {
        actionType: result.filters.action_type,
        startDate: result.filters.start_date,
        endDate: result.filters.end_date,
        adminFilter: result.filters.admin_filter
      };
      
      renderAdminLogTable();
      renderAdminLogPagination(totalAdminLogRecords);
    } else {
      console.error('API Error:', result.error);
      adminLogData = [];
      totalAdminLogRecords = 0;
      renderAdminLogTable();
    }
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    adminLogData = [];
    totalAdminLogRecords = 0;
    renderAdminLogTable();
  }
}

function renderAdminLogTable() {
  const tbody = document.getElementById('adminLogTableBody');
  if (!tbody) {
    return;
  }
  
  if (adminLogData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">
      <div class="empty-state-content">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-title">No Admin Activity Found</div>
        <div class="empty-state-desc">Try adjusting your filters or check back later for new activity.</div>
      </div>
    </td></tr>`;
    return;
  }
  
  // Data is already paginated from the API
  tbody.innerHTML = adminLogData.map(row => {
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

function renderAdminLogPagination(totalRecords) {
  const paginationDiv = document.getElementById('adminLogPagination');
  if (!paginationDiv) return;
  
  const totalPages = Math.ceil(totalRecords / adminLogRecordsPerPage);
  
  if (totalPages <= 1) {
    paginationDiv.innerHTML = '';
    return;
  }
  
  let paginationHTML = '<div class="pagination-info">';
  paginationHTML += `Showing ${((currentAdminLogPage - 1) * adminLogRecordsPerPage) + 1} to ${Math.min(currentAdminLogPage * adminLogRecordsPerPage, totalRecords)} of ${totalRecords} records`;
  paginationHTML += '</div>';
  
  paginationHTML += '<div class="pagination-controls">';
  
  // Previous button
  if (currentAdminLogPage > 1) {
    paginationHTML += `<button class="pagination-btn" onclick="changeAdminLogPage(${currentAdminLogPage - 1})">‹ Previous</button>`;
  }
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentAdminLogPage) {
      paginationHTML += `<button class="pagination-btn active">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= currentAdminLogPage - 2 && i <= currentAdminLogPage + 2)) {
      paginationHTML += `<button class="pagination-btn" onclick="changeAdminLogPage(${i})">${i}</button>`;
    } else if (i === currentAdminLogPage - 3 || i === currentAdminLogPage + 3) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
  }
  
  // Next button
  if (currentAdminLogPage < totalPages) {
    paginationHTML += `<button class="pagination-btn" onclick="changeAdminLogPage(${currentAdminLogPage + 1})">Next ›</button>`;
  }
  
  paginationHTML += '</div>';
  paginationDiv.innerHTML = paginationHTML;
}

function changeAdminLogPage(page) {
  currentAdminLogPage = page;
  fetchAdminLogs(page, adminLogRecordsPerPage);
}

function changeAdminLogRecordsPerPage(recordsPerPage) {
  adminLogRecordsPerPage = parseInt(recordsPerPage);
  currentAdminLogPage = 1;
  fetchAdminLogs(1, recordsPerPage);
}

function handleAdminLogFilters() {
  renderAdminLogTable();
}

function exportAdminLogExcel() {
  let csv = 'Admin,Activity,Date/Time,Details\n';
  csv += adminLogData.map(row => {
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
  a.download = 'admin-log.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportAdminLogPDF() {
  const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('Generated Report', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text('Report: Admin Logs', doc.internal.pageSize.getWidth() / 2, 90, { align: 'center' });
  doc.setFontSize(12);
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  doc.text(`Generated on: ${dateStr}`, doc.internal.pageSize.getWidth() / 2, 110, { align: 'center' });
  
  // Prepare table data
  const tableData = adminLogData.map(row => {
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
    head: [['Admin', 'Activity', 'Date/Time', 'Details']],
    body: tableData,
    styles: { fontSize: 12, cellPadding: 8 },
    headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 40, right: 40 }
  });
  doc.save('admin-log.pdf');
}

// Initialize admin log functionality
function initializeAdminLog() {
  // Set up event listeners
  const filterBtn = document.getElementById('adminLogFilterBtn');
  const excelBtn = document.getElementById('adminLogDownloadExcel');
  const pdfBtn = document.getElementById('adminLogDownloadPDF');
  
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      currentAdminLogPage = 1;
      fetchAdminLogs(1, adminLogRecordsPerPage);
    });
  }
  
  if (excelBtn) {
    excelBtn.addEventListener('click', exportAdminLogExcel);
  }
  
  if (pdfBtn) {
    pdfBtn.addEventListener('click', exportAdminLogPDF);
  }
  
  // Initial fetch from API
  fetchAdminLogs(1, adminLogRecordsPerPage);
}

// Export functions for global access
window.changeAdminLogPage = changeAdminLogPage;
window.changeAdminLogRecordsPerPage = changeAdminLogRecordsPerPage;
window.initializeAdminLog = initializeAdminLog;