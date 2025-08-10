// user-log.js

window.initUserLogPage = function() {
  // Placeholder for the current logged-in user
  const currentUser = 'User A'; // TODO: Replace with real user logic

  // Sample user log data
  const userLogData = [
    { user: 'User A', activity: 'Login', datetime: '2025-06-27 08:00', details: 'Logged in from web' },
    { user: 'User A', activity: 'Add', datetime: '2025-06-27 08:10', details: 'Added new item: Apple' },
    { user: 'User B', activity: 'Edit', datetime: '2025-06-27 09:00', details: 'Edited item: Banana' },
    { user: 'User A', activity: 'Delete', datetime: '2025-06-27 09:30', details: 'Deleted item: Orange' },
    { user: 'User B', activity: 'Logout', datetime: '2025-06-27 10:00', details: 'Logged out' },
    { user: 'User C', activity: 'Login', datetime: '2025-06-28 08:00', details: 'Logged in from mobile' },
    { user: 'User C', activity: 'Update', datetime: '2025-06-28 08:30', details: 'Updated profile info' },
    { user: 'User C', activity: 'Logout', datetime: '2025-06-28 09:00', details: 'Logged out' },
  ];

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
      row.innerHTML = `
        <td>${item.user}</td>
        <td><span class="user-log-activity-badge ${item.activity.toLowerCase()}">${item.activity}</span></td>
        <td>${item.datetime}</td>
        <td>${item.details}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function filterData() {
    const type = document.getElementById('userLogActivityType').value;
    const start = document.getElementById('userLogStartDate').value;
    const end = document.getElementById('userLogEndDate').value;
    // Only show logs for the current user
    return userLogData.filter(item => {
      let matchUser = item.user === currentUser;
      let matchType = (type === 'all' || item.activity.toLowerCase() === type);
      let matchStart = !start || item.datetime >= start;
      let matchEnd = !end || item.datetime <= end + ' 23:59';
      return matchUser && matchType && matchStart && matchEnd;
    });
  }

  // Event listeners
  document.getElementById('userLogFilterBtn').onclick = function() {
    renderTable(filterData());
  };
  document.getElementById('userLogDownloadExcel').onclick = function() {
    alert('Excel export not implemented in demo.');
  };
  document.getElementById('userLogDownloadPDF').onclick = function() {
    alert('PDF export not implemented in demo.');
  };

  // Initial render
  renderTable(filterData());
}; 