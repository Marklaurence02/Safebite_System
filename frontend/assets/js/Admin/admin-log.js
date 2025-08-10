const adminLogData = [
  { admin: 'Admin A', type: 'login', datetime: '2025-06-27 08:00', details: 'Logged in from web' },
  { admin: 'Admin A', type: 'create', datetime: '2025-06-27 08:10', details: 'Created new user: John Doe' },
  { admin: 'Admin B', type: 'update', datetime: '2025-06-27 09:00', details: 'Updated user: Alice Johnson' },
  { admin: 'Admin A', type: 'delete', datetime: '2025-06-27 09:30', details: 'Deleted user: Carol Lee' },
  { admin: 'Admin B', type: 'logout', datetime: '2025-06-27 10:00', details: 'Logged out' },
  { admin: 'Admin C', type: 'login', datetime: '2025-06-28 08:00', details: 'Logged in from mobile' },
  { admin: 'Admin C', type: 'update', datetime: '2025-06-28 08:30', details: 'Updated permissions for Bob Smith' },
  { admin: 'Admin C', type: 'logout', datetime: '2025-06-28 09:00', details: 'Logged out' }
];

function getFilteredAdminLogData() {
  const type = document.getElementById('adminActivityTypeFilter').value;
  const dateStart = document.getElementById('adminLogDateStart').value;
  const dateEnd = document.getElementById('adminLogDateEnd').value;
  return adminLogData.filter(row => {
    let match = true;
    let filterType = type;
    if (type === 'update') filterType = 'update';
    if (type === 'create') filterType = 'create';
    if (type === 'delete') filterType = 'delete';
    if (type === 'login') filterType = 'login';
    if (type === 'logout') filterType = 'logout';
    if (type && row.type !== filterType) match = false;
    // Parse log datetime and filter dates
    const logDate = new Date(row.datetime.split(' ')[0]);
    if (dateStart) {
      const startDate = new Date(dateStart);
      if (logDate < startDate) match = false;
    }
    if (dateEnd) {
      const endDate = new Date(dateEnd);
      if (logDate > endDate) match = false;
    }
    return match;
  });
}

function renderAdminLogTable() {
  const tbody = document.getElementById('adminLogTableBody');
  if (!tbody) return;
  const filtered = getFilteredAdminLogData();
  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="4" style="text-align:center;color:#888;padding:32px;">No activity found.</td></tr>`
    : filtered.map(row => `
      <tr>
        <td>${row.admin}</td>
        <td>${row.type.charAt(0).toUpperCase() + row.type.slice(1)}</td>
        <td>${row.datetime}</td>
        <td>${row.details}</td>
      </tr>
    `).join('');
}

function handleAdminLogFilters() {
  renderAdminLogTable();
}

function exportAdminLogExcel() {
  const filtered = getFilteredAdminLogData();
  let csv = 'Admin,Activity,Date/Time,Details\n';
  csv += filtered.map(row =>
    [row.admin, row.type.charAt(0).toUpperCase() + row.type.slice(1), row.datetime, row.details].map(v => '"' + v.replace(/"/g, '""') + '"').join(',')
  ).join('\n');
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
  const filtered = getFilteredAdminLogData();
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
  doc.autoTable({
    startY: 130,
    head: [['Admin', 'Activity', 'Date/Time', 'Details']],
    body: filtered.map(row => [row.admin, row.type.charAt(0).toUpperCase() + row.type.slice(1), row.datetime, row.details]),
    styles: { fontSize: 12, cellPadding: 8 },
    headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 40, right: 40 }
  });
  doc.save('admin-log.pdf');
}

function initAdminLog() {
  renderAdminLogTable();
  const filterBtn = document.getElementById('filterAdminLogBtn');
  const excelBtn = document.getElementById('exportAdminLogExcel');
  const pdfBtn = document.getElementById('exportAdminLogPDF');
  if (filterBtn) filterBtn.onclick = handleAdminLogFilters;
  if (excelBtn) excelBtn.onclick = exportAdminLogExcel;
  if (pdfBtn) pdfBtn.onclick = exportAdminLogPDF;
}

function showAdminLog() {
  const mainContent = document.getElementById('main-content');
  const template = document.getElementById('admin-log-template');
  if (mainContent && template) {
    mainContent.innerHTML = template.innerHTML;
    if (window.initAdminLog) {
      window.initAdminLog();
    }
  }
}

window.initAdminLog = initAdminLog;
window.showAdminLog = showAdminLog;