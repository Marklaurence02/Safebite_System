// Mock data for report generation
const mockReportData = [
  { userId: 'user001', name: "Juan's Tacos Cart", type: 'Street Food Tester', food: 'Tacos', sensor: 'MQ4', date: '2025-06-20', status: 'Active' },
  { userId: 'user002', name: "Maria's Food Truck", type: 'Food Truck Inspector', food: 'Burritos', sensor: 'DHT11', date: '2025-06-22', status: 'Active' },
  { userId: 'user003', name: "School Canteen #3", type: 'Canteen Auditor', food: 'Pizza', sensor: 'DS18B20', date: '2025-06-25', status: 'Active' },
  { userId: 'user001', name: "Juan's Tacos Cart", type: 'Street Food Tester', food: 'Tacos', sensor: 'MQ4', date: '2025-06-26', status: 'Spoilage Alert' },
  { userId: 'user004', name: "Carlos BBQ Cart", type: 'Street Food Tester', food: 'BBQ Ribs', sensor: 'MQ4', date: '2025-06-28', status: 'Active' },
  { userId: 'user005', name: "Office Canteen A", type: 'Canteen Auditor', food: 'Sandwiches', sensor: 'DHT11', date: '2025-06-29', status: 'Spoilage Alert' },
  { userId: 'user006', name: "Beach Food Truck #2", type: 'Food Truck Inspector', food: 'Hot Dogs', sensor: 'DS18B20', date: '2025-06-30', status: 'Active' },
  { userId: 'user007', name: "New Vendor #1", type: 'Street Food Tester', food: 'Tacos', sensor: 'MQ4', date: '2025-07-01', status: 'Active' },
  { userId: 'user008', name: "New Vendor #2", type: 'Food Truck Inspector', food: 'Burgers', sensor: 'DHT11', date: '2025-07-02', status: 'Active' },
  { userId: 'user005', name: "Office Canteen A", type: 'Canteen Auditor', food: 'Salad', sensor: 'DHT11', date: '2025-07-03', status: 'Spoilage Alert' },
  { userId: 'user001', name: "Juan's Tacos Cart", type: 'Street Food Tester', food: 'Tacos', sensor: 'MQ4', date: '2025-07-03', status: 'Spoilage Alert' },
  { userId: 'user004', name: "Carlos BBQ Cart", type: 'Street Food Tester', food: 'BBQ Chicken', sensor: 'MQ4', date: '2025-07-04', status: 'Active' },
  { userId: 'user002', name: "Maria's Food Truck", type: 'Food Truck Inspector', food: 'Burritos', sensor: 'DHT11', date: '2025-07-05', status: 'Spoilage Alert' },
  { userId: 'user008', name: "New Vendor #2", type: 'Food Truck Inspector', food: 'Burgers', sensor: 'DHT11', date: '2025-07-05', status: 'Active' },
];


function renderTable(headers, rows) {
  let table = '<table class="detailed-report-table">';
  table += '<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead>';
  table += '<tbody>';
  if (rows.length === 0) {
    table += `<tr><td colspan="${headers.length}" style="text-align:center;padding:20px;">No data available for the selected period.</td></tr>`;
  } else {
    table += rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
  }
  table += '</tbody></table>';
  return table;
}

function getDatesFromRange(range) {
    const endDate = new Date('2025-07-06'); // Fixed date to work with mock data
    let startDate = new Date(endDate);
    
    switch(range) {
        case 'Daily':
            startDate.setDate(endDate.getDate() - 1);
            break;
        case 'Weekly':
            startDate.setDate(endDate.getDate() - 7);
            break;
        case 'Monthly':
            startDate.setMonth(endDate.getMonth() - 1);
            break;
    }
    return { startDate, endDate };
}

function initReportGenerator() {
  console.log('Report Generator Initialized');

  const dateRangeSelect = document.getElementById('reportDateRange');
  const customDateFilters = document.querySelectorAll('.filter-group-custom-date');
  const generateBtn = document.getElementById('generateReport');
  const exportCsvBtn = document.getElementById('exportReportCSV');
  const exportPdfBtn = document.getElementById('exportReportPDF');
  const reportContent = document.getElementById('report-preview-content');
  const reportTypeSelect = document.getElementById('reportType');

  let lastReport = { headers: [], rows: [], title: '' };

  if (dateRangeSelect) {
    dateRangeSelect.addEventListener('change', () => {
      if (dateRangeSelect.value === 'Custom') {
        customDateFilters.forEach(el => el.style.display = 'block');
      } else {
        customDateFilters.forEach(el => el.style.display = 'none');
      }
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const reportType = reportTypeSelect.value;
      const dateRange = dateRangeSelect.value;
      const reportTitle = reportTypeSelect.options[reportTypeSelect.selectedIndex].text;

      let dates;
      if (dateRange === 'Custom') {
          const start = document.getElementById('reportStartDate').value;
          const end = document.getElementById('reportEndDate').value;
          if (!start || !end) {
              reportContent.innerHTML = '<p style="text-align: center; padding: 40px; color: #888;">Please select a start and end date for the custom range.</p>';
              return;
          }
          dates = { startDate: new Date(start), endDate: new Date(end) };
      } else {
          dates = getDatesFromRange(dateRange);
      }
      
      const filteredData = mockReportData.filter(d => {
        const itemDate = new Date(d.date);
        return itemDate >= dates.startDate && itemDate <= dates.endDate;
      });

      let headers = [];
      let rows = [];

      switch(reportType) {
        case 'new_users':
            headers = ['User Name', 'User Type', 'Registration Date'];
            const newUsers = {};
            // Find first appearance of each user
            mockReportData.forEach(d => {
                if (!newUsers[d.userId]) {
                    newUsers[d.userId] = { ...d, date: new Date(d.date) };
                }
            });
            const newUsersArray = Object.values(newUsers).filter(u => u.date >= dates.startDate && u.date <= dates.endDate);
            rows = newUsersArray.map(u => [u.name, u.type, u.date.toLocaleDateString()]);
            break;

        case 'top_spoiling_food':
            headers = ['Food Item', 'Spoilage Reports'];
            const foodSpoilage = {};
            filteredData.forEach(d => {
                if(d.status === 'Spoilage Alert') {
                    foodSpoilage[d.food] = (foodSpoilage[d.food] || 0) + 1;
                }
            });
            rows = Object.entries(foodSpoilage)
                .sort(([, a], [, b]) => b - a)
                .map(([food, count]) => [food, count]);
            break;

        case 'most_used_sensor':
            headers = ['Sensor Type', 'Usage Count'];
            const sensorUsage = {};
            filteredData.forEach(d => {
                sensorUsage[d.sensor] = (sensorUsage[d.sensor] || 0) + 1;
            });
            rows = Object.entries(sensorUsage)
                .sort(([, a], [, b]) => b - a)
                .map(([sensor, count]) => [sensor, count]);
            break;
      }
      
      lastReport = { headers, rows, title: reportTitle };
      reportContent.innerHTML = renderTable(headers, rows);
      console.log(`Generated report for: ${reportType}`);
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (lastReport.rows.length === 0) {
        alert('Please generate a report first.');
        return;
      }

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += lastReport.headers.join(",") + "\r\n";
      lastReport.rows.forEach(function(rowArray) {
          let row = rowArray.join(",");
          csvContent += row + "\r\n";
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${lastReport.title.replace(/ /g, '_')}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      if (lastReport.rows.length === 0) {
        alert('Please generate a report first.');
        return;
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const reportTitle = lastReport.title;
      const title = 'Generated Report';
      const subtitle = `Report: ${reportTitle}`;
      
      // Set properties
      doc.setProperties({
        title: title,
        subject: subtitle,
        author: 'Sensor Analytics System',
      });

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(title, 105, 22, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.text(subtitle, 105, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 36, { align: 'center' });

      // Table
      doc.autoTable({
        head: [lastReport.headers],
        body: lastReport.rows,
        startY: 46,
        theme: 'grid',
        headStyles: {
            fillColor: [51, 51, 51], 
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        bodyStyles: {
            fillColor: [233, 236, 239], //rgb(255, 255, 255)
            textColor: [0,0,0] //rgb(0, 0, 0)
        },
        styles: {
            cellPadding: 3,
            fontSize: 10,
            valign: 'middle',
        },
      });
      doc.save(`${reportTitle.replace(/ /g, '_')}_report.pdf`);
    });
  }
}

// Since the script is loaded after the DOM, and the content is dynamic,
// we've already called initReportGenerator from spa.js after content load.
// So, no need to add a DOMContentLoaded listener here.
window.initReportGenerator = initReportGenerator; 