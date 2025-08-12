// user-log.js

window.initUserLogPage = function() {
  // Get the current logged-in user ID from localStorage
  function getCurrentUserId() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        return user.user_id;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  const currentUserId = getCurrentUserId();
  let userLogData = [];
  let currentPage = 1;
  let totalPages = 1;
  let totalRecords = 0;
  let recordsPerPage = 25; // Default matches HTML select
  let currentFilters = {
    action_type: 'all',
    start_date: '',
    end_date: ''
  };

  // Check if user is authenticated
  if (!currentUserId) {
    console.error('No authenticated user found');
    const tbody = document.getElementById('userLogTableBody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#ff6b6b;">Please log in to view your activity logs.</td>`;
    }
    return;
  }

  // Check if session is still valid
  function checkSessionValidity() {
    const sessionExpires = localStorage.getItem('sessionExpires');
    if (sessionExpires) {
      const expiryDate = new Date(sessionExpires);
      const now = new Date();
      
      if (now > expiryDate) {
        console.log('Session expired, redirecting to login');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionExpires');
        window.location.href = '../pages/Login.php';
        return false;
      }
    }
    return true;
  }

  // Check session validity before proceeding
  if (!checkSessionValidity()) {
    return;
  }

  // Fetch user log data from backend
  function fetchUserLogs(page = 1, filters = {}) {
    console.log('Fetching user logs for user ID:', currentUserId, 'Page:', page, 'Filters:', filters);
    
    // Build query parameters
    const params = new URLSearchParams({
      page: page,
      limit: recordsPerPage,
      ...filters
    });
    
    const apiUrl = `../../backend/api/get-user-logs.php?${params.toString()}`;
    console.log('API URL:', apiUrl);
    
    // Get session token from localStorage
    const sessionToken = localStorage.getItem('sessionToken');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add Authorization header if session token exists
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    fetch(apiUrl, {
      method: 'GET',
      headers: headers
    })
      .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied');
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        if (data.error) {
          console.error('Error fetching log data:', data.error);
          return;
        }
        
        // Update pagination info
        currentPage = data.pagination.current_page;
        totalPages = data.pagination.total_pages;
        totalRecords = data.pagination.total_records;
        recordsPerPage = data.pagination.records_per_page;
        
        // Update filters
        currentFilters = data.filters;
        
        // Update data
        userLogData = data.data;
        console.log('User log data set:', userLogData);
        
        // Render table and pagination
        renderTable(userLogData);
        renderPagination();
        updateFilterDisplay();
      })
      .catch(error => {
        console.error('Error fetching log data:', error);
        // Show error in the table
        const tbody = document.getElementById('userLogTableBody');
        if (tbody) {
          tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#ff6b6b;">Error loading data: ${error.message}</td></tr>`;
        }
      });
  }

  function renderTable(data) {
    const tbody = document.getElementById('userLogTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!data.length) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="4" style="text-align:center;color:#b0b0b0;">No user activity found for the selected filters.</td>`;
      tbody.appendChild(row);
      return;
    }
    data.forEach(item => {
      const row = document.createElement('tr');
      
      // Extract action type for badge styling
      const actionType = extractActionType(item.action);
      const displayAction = formatActionText(item.action);
      
      row.innerHTML = `
        <td>${item.username || 'User ' + item.user_id}</td>
        <td><span class="user-log-activity-badge ${actionType}">${displayAction}</span></td>
        <td>${formatTimestamp(item.timestamp)}</td>
        <td>${item.action}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // Extract action type for badge styling
  function extractActionType(action) {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('login') || actionLower.includes('logged in')) {
      return 'login';
    }
    if (actionLower.includes('logout') || actionLower.includes('logged out')) {
      return 'logout';
    }
    if (actionLower.includes('add') || actionLower.includes('created')) return 'add';
    if (actionLower.includes('edit') || actionLower.includes('updated')) return 'edit';
    if (actionLower.includes('update')) return 'update';
    if (actionLower.includes('delete') || actionLower.includes('deleted')) return 'delete';
    
    return 'update'; // default fallback
  }

  // Format action text for display
  function formatActionText(action) {
    if (action.includes('User logged in successfully')) return 'Login';
    if (action.includes('User logged out')) return 'Logout';
    if (action.includes('Added new food item:')) return 'Add Food';
    if (action.includes('Updated food item:')) return 'Update Food';
    if (action.includes('Deleted expired food item:')) return 'Delete Food';
    if (action.includes('Added new sensor:')) return 'Add Sensor';
    if (action.includes('Updated sensor')) return 'Update Sensor';
    if (action.includes('Changed password')) return 'Change Password';
    if (action.includes('Changed email')) return 'Change Email';
    if (action.includes('Updated profile')) return 'Update Profile';
    return action.length > 30 ? action.substring(0, 30) + '...' : action;
  }

  // Format timestamp for better display
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
  }

  function renderPagination() {
    const paginationContainer = document.getElementById('userLogPagination');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }
    
    let paginationHTML = `
      <div class="pagination-info">
        Showing ${((currentPage - 1) * recordsPerPage) + 1} to ${Math.min(currentPage * recordsPerPage, totalRecords)} of ${totalRecords} records
      </div>
      <div class="pagination-controls">
    `;
    
    // Previous button
    if (currentPage > 1) {
      paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i === currentPage) {
        paginationHTML += `<span class="pagination-current">${i}</span>`;
      } else {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${i})">${i}</button>`;
      }
    }
    
    // Next button
    if (currentPage < totalPages) {
      paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">Next</button>`;
    }
    
    paginationHTML += '</div>';
    
    paginationContainer.innerHTML = paginationHTML;
  }

  function updateFilterDisplay() {
    // Update filter form values to reflect current state
    const actionTypeSelect = document.getElementById('userLogActivityType');
    const startDateInput = document.getElementById('userLogStartDate');
    const endDateInput = document.getElementById('userLogEndDate');
    
    if (actionTypeSelect) actionTypeSelect.value = currentFilters.action_type || 'all';
    if (startDateInput) startDateInput.value = currentFilters.start_date || '';
    if (endDateInput) endDateInput.value = currentFilters.end_date || '';
  }

  // Add event listeners for real-time filtering
  function setupFilterEventListeners() {
    const actionTypeSelect = document.getElementById('userLogActivityType');
    const startDateInput = document.getElementById('userLogStartDate');
    const endDateInput = document.getElementById('userLogEndDate');
    
    // Auto-apply filters when selection changes
    if (actionTypeSelect) {
      actionTypeSelect.addEventListener('change', function() {
        applyFilters();
      });
    }
    
    // Auto-apply filters when dates change
    if (startDateInput) {
      startDateInput.addEventListener('change', function() {
        applyFilters();
      });
    }
    
    if (endDateInput) {
      endDateInput.addEventListener('change', function() {
        applyFilters();
      });
    }
  }

  // Global function for pagination (accessible from HTML)
  window.goToPage = function(page) {
    currentPage = page;
    fetchUserLogs(currentPage, currentFilters);
  };

  // Global function to change records per page
  window.changeRecordsPerPage = function(newLimit) {
    recordsPerPage = parseInt(newLimit);
    currentPage = 1; // Reset to first page
    fetchUserLogs(currentPage, currentFilters);
  };

  function applyFilters() {
    const actionType = document.getElementById('userLogActivityType').value;
    const startDate = document.getElementById('userLogStartDate').value;
    const endDate = document.getElementById('userLogEndDate').value;
    
    // Update current filters
    currentFilters = {
      action_type: actionType,
      start_date: startDate,
      end_date: endDate
    };
    
    // Reset to first page and fetch data
    currentPage = 1;
    fetchUserLogs(currentPage, currentFilters);
  }

  // Event listeners
  document.getElementById('userLogFilterBtn').onclick = function() {
    applyFilters();
  };
  
  document.getElementById('userLogDownloadExcel').onclick = function() {
    alert('Excel export not implemented in demo.');
  };
  
  document.getElementById('userLogDownloadPDF').onclick = function() {
    alert('PDF export not implemented in demo.');
  };

  // Setup filter event listeners
  setupFilterEventListeners();

  // Initial fetch and render
  fetchUserLogs(1, currentFilters);
}; 