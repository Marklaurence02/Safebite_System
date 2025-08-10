// js/user-activity-log.js

// Unique variable for client/user self-activity log
const clientActivityLogData = [
  { user: 'Alice Johnson', type: 'login', datetime: '2025-06-27 08:00', details: 'Logged in from web' },
  { user: 'Alice Johnson', type: 'edit', datetime: '2025-06-27 09:12', details: 'Changed email to alice@newmail.com' },
  { user: 'Alice Johnson', type: 'logout', datetime: '2025-06-27 10:00', details: 'Logged out' },
  { user: 'Bob Smith', type: 'login', datetime: '2025-06-27 09:00', details: 'Logged in from mobile' },
  { user: 'Bob Smith', type: 'edit', datetime: '2025-06-27 09:15', details: 'Changed password' },
  { user: 'Bob Smith', type: 'logout', datetime: '2025-06-27 11:00', details: 'Logged out' },
  { user: 'Carol Lee', type: 'login', datetime: '2025-06-27 09:10', details: 'Logged in from web' },
  { user: 'Carol Lee', type: 'edit', datetime: '2025-06-27 09:20', details: 'Changed email to carol@newmail.com' },
  { user: 'Carol Lee', type: 'edit', datetime: '2025-06-28 10:20', details: 'Changed password' },
  { user: 'Carol Lee', type: 'logout', datetime: '2025-06-28 11:00', details: 'Logged out' },
  { user: 'David Kim', type: 'login', datetime: '2025-06-27 09:25', details: 'Logged in from mobile' },
  { user: 'David Kim', type: 'edit', datetime: '2025-06-27 09:30', details: 'Changed password' },
  { user: 'David Kim', type: 'edit', datetime: '2025-06-28 10:30', details: 'Changed email to david@newmail.com' },
  { user: 'David Kim', type: 'logout', datetime: '2025-06-28 12:00', details: 'Logged out' }
];

function getFilteredClientActivityLogData() {
  const type = document.getElementById('activityTypeFilter').value;
  const dateStart = document.getElementById('activityDateStart').value;
  const dateEnd = document.getElementById('activityDateEnd').value;
  return clientActivityLogData.filter(row => {
    let match = true;
    let filterType = type === 'edit' ? 'edit' : type;
    if (type === 'edit') filterType = 'edit';
    if (type === 'login') filterType = 'login';
    if (type === 'logout') filterType = 'logout';
    if (type && row.type !== filterType) match = false;
    if (dateStart && row.datetime < dateStart) match = false;
    if (dateEnd && row.datetime > dateEnd) match = false;
    return match;
  });
}

function renderClientActivityLogTable() {
  const tbody = document.getElementById('activityLogTableBody');
  if (!tbody) return;
  const filtered = getFilteredClientActivityLogData();
  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="4" style="text-align:center;color:#888;padding:32px;">No activity found.</td></tr>`
    : filtered.map(row => `
      <tr>
        <td>${row.user}</td>
        <td>${row.type === 'edit' ? 'Update' : row.type.charAt(0).toUpperCase() + row.type.slice(1)}</td>
        <td>${row.datetime}</td>
        <td>${row.details}</td>
      </tr>
    `).join('');
}

function handleClientActivityLogFilters() {
  renderClientActivityLogTable();
}

function exportClientActivityLogExcel() {
  const filtered = getFilteredClientActivityLogData();
  let csv = 'User,Activity,Date/Time,Details\n';
  csv += filtered.map(row =>
    [row.user, row.type === 'edit' ? 'Update' : row.type.charAt(0).toUpperCase() + row.type.slice(1), row.datetime, row.details].map(v => '"' + v.replace(/"/g, '""') + '"').join(',')
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'client-activity-log.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportClientActivityLogPDF() {
  const filtered = getFilteredClientActivityLogData();
  const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('Generated Report', doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text('Report: User Activity Log', doc.internal.pageSize.getWidth() / 2, 90, { align: 'center' });

  // Generated date
  doc.setFontSize(12);
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  doc.text(`Generated on: ${dateStr}`, doc.internal.pageSize.getWidth() / 2, 110, { align: 'center' });

  // Table
  doc.autoTable({
    startY: 130,
    head: [['User', 'Activity', 'Date/Time', 'Details']],
    body: filtered.map(row => [
      row.user,
      row.type === 'edit' ? 'Update' : row.type.charAt(0).toUpperCase() + row.type.slice(1),
      row.datetime,
      row.details
    ]),
    styles: { fontSize: 12, cellPadding: 8 },
    headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 40, right: 40 }
  });

  doc.save('client-activity-log.pdf');
}

function initClientActivityLog() {
  renderClientActivityLogTable();
  const filterBtn = document.getElementById('filterActivityLogBtn');
  const excelBtn = document.getElementById('exportActivityLogExcel');
  const pdfBtn = document.getElementById('exportActivityLogPDF');
  if (filterBtn) filterBtn.onclick = handleClientActivityLogFilters;
  if (excelBtn) excelBtn.onclick = exportClientActivityLogExcel;
  if (pdfBtn) pdfBtn.onclick = exportClientActivityLogPDF;
}

window.initClientActivityLog = initClientActivityLog;

window.initClientActivityLog && window.initClientActivityLog();
renderClientActivityLogTable();

function showUserActivityLog() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('user-activity-log-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    if (window.initClientActivityLog) {
      window.initClientActivityLog();
    }
  }
}