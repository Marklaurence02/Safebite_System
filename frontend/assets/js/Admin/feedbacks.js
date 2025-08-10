// js/feedbacks.js - Handles Feedbacks/Support Tickets interactivity

document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('feedbacks-tab')) {
      document.querySelectorAll('.feedbacks-tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      // For demo: just switch table content, real app would load different data
      if (e.target.textContent.trim() === 'User Feedback') {
        document.querySelector('.feedbacks-table tbody').innerHTML = `<tr><td colspan="7" style="text-align:center;color:#bfc9da;padding:40px 0;">No user feedbacks yet.</td></tr>`;
      } else {
        renderTickets();
      }
    }
  });

  // Search/filter events
  document.body.addEventListener('input', function(e) {
    if (e.target.classList.contains('feedbacks-search-input') ||
        e.target.classList.contains('feedbacks-date-input')) {
      renderAll();
    }
  });
  document.body.addEventListener('change', function(e) {
    if (e.target.classList.contains('feedbacks-filter-select') ||
        e.target.classList.contains('feedbacks-date-input')) {
      renderAll();
    }
  });

  // Demo feedback data
  const feedbacks = [
    { name: 'John Doe', feedback: 'Great app, very useful!', rating: 5, sentiment: 'Positive', created: '2025-01-15T18:30:00' },
    { name: 'Sarah Johnson', feedback: 'Needs dark mode.', rating: 3, sentiment: 'Negative', created: '2025-01-14T22:20:00' },
    { name: 'Mike Wilson', feedback: 'Payment works well.', rating: 4, sentiment: 'Positive', created: '2025-01-16T00:45:00' },
    { name: 'Emma Brown', feedback: 'Export is confusing.', rating: 2, sentiment: 'Negative', created: '2025-01-13T19:00:00' },
    { name: 'David Lee', feedback: 'Love the mobile version!', rating: 5, sentiment: 'Positive', created: '2025-01-12T17:30:00' },
    { name: 'Anna Kim', feedback: 'Support is responsive.', rating: 5, sentiment: 'Positive', created: '2025-01-10T14:10:00' },
    { name: 'Paul Smith', feedback: 'UI is clean.', rating: 4, sentiment: 'Positive', created: '2025-01-09T09:45:00' },
    { name: 'Linda Park', feedback: 'Notifications are delayed.', rating: 2, sentiment: 'Negative', created: '2025-01-08T11:20:00' }
  ];

  function parseDate(str) {
    return new Date(str.replace(/-/g, '/').replace('T', ' '));
  }

  function renderFeedbackStats(filtered) {
    const total = filtered.length;
    const avgRating = total ? (filtered.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1) : '0.0';
    const positive = filtered.filter(f => f.sentiment === 'Positive').length;
    const fiveStars = filtered.filter(f => f.rating === 5).length;
    const negative = filtered.filter(f => f.sentiment === 'Negative').length;
    const now = new Date();
    const recent = filtered.filter(f => (now - parseDate(f.created)) / (1000*60*60*24) <= 3).length;
    const statCards = document.querySelectorAll('.feedbacks-feedback-stats-row .feedbacks-stat-card');
    if (statCards.length === 6) {
      statCards[0].querySelector('.stat-value').textContent = total;
      statCards[1].querySelector('.stat-value').textContent = avgRating;
      statCards[2].querySelector('.stat-value').textContent = positive;
      statCards[3].querySelector('.stat-value').textContent = fiveStars;
      statCards[4].querySelector('.stat-value').textContent = negative;
      statCards[5].querySelector('.stat-value').textContent = recent;
    }
  }

  function renderFeedbackTable(filtered) {
    document.querySelector('.feedbacks-table tbody').innerHTML = filtered.map(f => `
      <tr>
        <td><b>${f.feedback}</b></td>
        <td><b>${f.name}</b></td>
        <td><span class="badge badge-rating">${f.rating}</span></td>
        <td><span class="badge badge-${f.sentiment.toLowerCase()}">${f.sentiment}</span></td>
        <td>${new Date(f.created).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</td>
      </tr>
    `).join('') || `<tr><td colspan="5" style="text-align:center;color:#bfc9da;padding:40px 0;">No feedback found.</td></tr>`;
  }

  function getFilteredFeedbacks() {
    const search = document.getElementById('feedback-search')?.value.toLowerCase() || '';
    const rating = document.querySelectorAll('.feedbacks-filter-select')[0]?.value || 'All Ratings';
    const sentiment = document.querySelectorAll('.feedbacks-filter-select')[1]?.value || 'All';
    const fromDate = document.getElementById('feedback-date-from')?.value;
    const toDate = document.getElementById('feedback-date-to')?.value;
    return feedbacks.filter(f => {
      const created = parseDate(f.created);
      let inRange = true;
      if (fromDate) inRange = inRange && (created >= new Date(fromDate));
      if (toDate) inRange = inRange && (created <= new Date(toDate + 'T23:59:59'));
      return (rating === 'All Ratings' || String(f.rating) === rating)
        && (sentiment === 'All' || f.sentiment === sentiment)
        && (f.name.toLowerCase().includes(search) || f.feedback.toLowerCase().includes(search))
        && inRange;
    });
  }

  function renderAll() {
    const filtered = getFilteredFeedbacks();
    renderFeedbackStats(filtered);
    renderFeedbackTable(filtered);
  }

  if (document.querySelector('.feedbacks-table')) renderAll();

  // PDF Export (Sensor Analytics style) - use event delegation
  document.body.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'export-feedbacks-pdf') {
      const filtered = getFilteredFeedbacks();
      const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
      const dateStr = new Date().toLocaleDateString('en-US');
      // Title (centered)
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      let text = 'Feedback Analytics Report';
      let textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, 60);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'normal');
      text = 'Customer Feedback System';
      textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, 90);
      text = 'Generated on: ' + dateStr;
      textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, 115);

      // --- System Overview ---
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('System Overview', 40, 160);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      // Calculate summary
      const total = filtered.length;
      const avgRating = total ? (filtered.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1) : '0.0';
      const positive = filtered.filter(f => f.sentiment === 'Positive').length;
      const fiveStars = filtered.filter(f => f.rating === 5).length;
      const negative = filtered.filter(f => f.sentiment === 'Negative').length;
      const now = new Date();
      const recent = filtered.filter(f => (now - new Date(f.created)) / (1000*60*60*24) <= 3).length;
      const summaryRows = [
        ['Total Feedbacks', total],
        ['Average Rating', avgRating],
        ['Positive', positive],
        ['Negative', negative],
        ['5 Stars', fiveStars],
        ['Recent (3d)', recent]
      ];
      doc.autoTable({
        head: [['Metric', 'Count']],
        body: summaryRows,
        startY: 175,
        headStyles: { fillColor: [60,60,60], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { textColor: 20 },
        styles: { font: 'helvetica', fontSize: 11, cellPadding: 6 },
        margin: { left: 40, right: 40 },
        tableWidth: 'auto',
      });

      // --- Detailed Feedback Report ---
      let detailStartY = doc.lastAutoTable.finalY + 40;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Detailed Feedback Report', 40, detailStartY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const tableData = filtered.map(f => [
        f.feedback,
        f.name,
        f.rating,
        f.sentiment,
        new Date(f.created).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
      ]);
      doc.autoTable({
        head: [['Feedback', 'Customer', 'Star Rating', 'Sentiment', 'Created']],
        body: tableData,
        startY: detailStartY + 15,
        headStyles: { fillColor: [60,60,60], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { textColor: 20 },
        styles: { font: 'helvetica', fontSize: 11, cellPadding: 6 },
        margin: { left: 40, right: 40 },
        tableWidth: 'auto',
      });
      doc.save('feedback-report.pdf');
    }
  });

  // Excel Export (event delegation)
  document.body.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'export-feedbacks-excel') {
      const filtered = getFilteredFeedbacks();
      // Try SheetJS (xlsx) if available
      if (window.XLSX) {
        const wsData = [
          ['Feedback', 'Customer', 'Star Rating', 'Sentiment', 'Created'],
          ...filtered.map(f => [
            f.feedback,
            f.name,
            f.rating,
            f.sentiment,
            new Date(f.created).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
          ])
        ];
        const ws = window.XLSX.utils.aoa_to_sheet(wsData);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, 'Feedbacks');
        window.XLSX.writeFile(wb, 'feedback-report.xlsx');
      } else {
        // Fallback: CSV
        let csv = 'Feedback,Customer,Star Rating,Sentiment,Created\n';
        csv += filtered.map(f => [
          '"' + f.feedback.replace(/"/g, '""') + '"',
          '"' + f.name.replace(/"/g, '""') + '"',
          f.rating,
          f.sentiment,
          '"' + new Date(f.created).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + '"'
        ].join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'feedback-report.csv';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      }
    }
  });
}); 