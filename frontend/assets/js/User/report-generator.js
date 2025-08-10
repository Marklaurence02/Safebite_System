// Report Generator JavaScript
class ReportGenerator {
    constructor() {
        this.reportData = [];
        this.currentReportType = 'user-activity';
        this.currentDateRange = 'weekly';
        this.customStartDate = null;
        this.customEndDate = null;
        this.init();
    }

    init() {
        this.loadReportData();
        this.setupEventListeners();
        this.showEmptyState();
    }

    setupEventListeners() {
        // Report type change
        const reportTypeSelect = document.getElementById('reportType');
        if (reportTypeSelect) {
            reportTypeSelect.addEventListener('change', (e) => {
                this.currentReportType = e.target.value;
                this.showEmptyState();
            });
        }

        // Date range change
        const dateRangeSelect = document.getElementById('dateRange');
        const customDateGroup = document.getElementById('customDateRangeGroup');
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.currentDateRange = e.target.value;
                if (this.currentDateRange === 'custom') {
                    if (customDateGroup) customDateGroup.style.display = '';
                    // Set default dates (last 7 days) if not already set
                    if (!this.customStartDate && !this.customEndDate) {
                        const today = new Date();
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        const startDateStr = weekAgo.toISOString().split('T')[0];
                        const endDateStr = today.toISOString().split('T')[0];
                        
                        if (startDateInput) {
                            startDateInput.value = startDateStr;
                            this.customStartDate = startDateStr;
                        }
                        if (endDateInput) {
                            endDateInput.value = endDateStr;
                            this.customEndDate = endDateStr;
                        }
                    }
                } else {
                    if (customDateGroup) customDateGroup.style.display = 'none';
                    this.customStartDate = null;
                    this.customEndDate = null;
                    if (startDateInput) startDateInput.value = '';
                    if (endDateInput) endDateInput.value = '';
                }
                this.showEmptyState();
            });
        }
        if (startDateInput) {
            startDateInput.addEventListener('change', (e) => {
                this.customStartDate = e.target.value;
                // Auto-set end date if it's before start date
                if (this.customEndDate && e.target.value > this.customEndDate) {
                    endDateInput.value = e.target.value;
                    this.customEndDate = e.target.value;
                }
            });
        }
        if (endDateInput) {
            endDateInput.addEventListener('change', (e) => {
                this.customEndDate = e.target.value;
                // Validate that end date is not before start date
                if (this.customStartDate && e.target.value < this.customStartDate) {
                    this.showNotification('End date cannot be before start date', 'warning');
                    e.target.value = this.customStartDate;
                    this.customEndDate = this.customStartDate;
                }
            });
        }

        // Generate report button
        const generateBtn = document.getElementById('generateReport');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateReport();
            });
        }

        // Download Excel button
        const downloadExcelBtn = document.getElementById('downloadExcel');
        if (downloadExcelBtn) {
            downloadExcelBtn.addEventListener('click', () => {
                this.downloadExcel();
            });
        }

        // Download PDF button
        const downloadPdfBtn = document.getElementById('downloadPDF');
        if (downloadPdfBtn) {
            downloadPdfBtn.addEventListener('click', () => {
                this.downloadPDF();
            });
        }
    }

    loadReportData() {
        // Sample data - in a real application, this would come from an API
        this.reportData = {
            'user-activity': [
                {
                    activityType: 'Login',
                    timestamp: '7/5/2025 14:30',
                    description: 'Successfully logged into dashboard',
                    sessionDuration: '2h 15m',
                    ipAddress: '192.168.1.100'
                },
                {
                    activityType: 'Report Generation',
                    timestamp: '7/5/2025 12:15',
                    description: 'Generated Food Spoilage Report (Weekly)',
                    sessionDuration: '45m',
                    ipAddress: '192.168.1.100'
                },
                {
                    activityType: 'Data Export',
                    timestamp: '7/5/2025 11:30',
                    description: 'Exported Sensor Data to CSV',
                    sessionDuration: '30m',
                    ipAddress: '192.168.1.100'
                },
                {
                    activityType: 'Configuration Update',
                    timestamp: '7/4/2025 18:20',
                    description: 'Updated food item settings',
                    sessionDuration: '1h 20m',
                    ipAddress: '192.168.1.100'
                },
                {
                    activityType: 'Alert Review',
                    timestamp: '7/4/2025 16:45',
                    description: 'Reviewed and acknowledged alerts',
                    sessionDuration: '55m',
                    ipAddress: '192.168.1.100'
                },
                {
                    activityType: 'Login',
                    timestamp: '7/4/2025 09:30',
                    description: 'Successfully logged into dashboard',
                    sessionDuration: '3h 45m',
                    ipAddress: '192.168.1.100'
                }
            ],
            'food-spoilage': [
                {
                    foodItem: 'Chicken Adobo',
                    category: 'Meat',
                    status: 'At Risk',
                    riskScore: '65%',
                    expiryDate: '7/8/2025',
                    sensorReadings: 'Temp: 8.2°C, Humidity: 75%'
                },
                {
                    foodItem: 'Sinigang na Baboy',
                    category: 'Soup',
                    status: 'Spoiled',
                    riskScore: '85%',
                    expiryDate: '7/6/2025',
                    sensorReadings: 'Temp: 12.1°C, Gas: 120 ppm'
                },
                {
                    foodItem: 'Fresh Milk',
                    category: 'Dairy',
                    status: 'Good',
                    riskScore: '15%',
                    expiryDate: '7/10/2025',
                    sensorReadings: 'Temp: 2.1°C, Humidity: 45%'
                },
                {
                    foodItem: 'Grilled Fish',
                    category: 'Seafood',
                    status: 'Critical',
                    riskScore: '92%',
                    expiryDate: '7/7/2025',
                    sensorReadings: 'Temp: 15.8°C, Gas: 180 ppm'
                },
                {
                    foodItem: 'Vegetable Curry',
                    category: 'Vegetables',
                    status: 'At Risk',
                    riskScore: '45%',
                    expiryDate: '7/9/2025',
                    sensorReadings: 'Temp: 6.5°C, Humidity: 68%'
                }
            ],
            'sensor-data': [
                {
                    sensorId: 'TEMP-001',
                    location: 'Refrigerator A',
                    sensorType: 'Temperature',
                    currentValue: '3.2°C',
                    status: 'Normal',
                    lastUpdate: '7/5/2025 16:30'
                },
                {
                    sensorId: 'HUM-002',
                    location: 'Storage Room B',
                    sensorType: 'Humidity',
                    currentValue: '65%',
                    status: 'Warning',
                    lastUpdate: '7/5/2025 16:28'
                },
                {
                    sensorId: 'GAS-003',
                    location: 'Kitchen Area',
                    sensorType: 'Methane Gas',
                    currentValue: '45 ppm',
                    status: 'Normal',
                    lastUpdate: '7/5/2025 16:25'
                },
                {
                    sensorId: 'TEMP-004',
                    location: 'Freezer C',
                    sensorType: 'Temperature',
                    currentValue: '-18.5°C',
                    status: 'Normal',
                    lastUpdate: '7/5/2025 16:32'
                },
                {
                    sensorId: 'PH-005',
                    location: 'Food Prep Area',
                    sensorType: 'pH Level',
                    currentValue: '6.8',
                    status: 'Normal',
                    lastUpdate: '7/5/2025 16:20'
                }
            ],
            'alert-summary': [
                {
                    alertId: 'ALT-001',
                    alertType: 'Temperature Warning',
                    severity: 'Medium',
                    location: 'Refrigerator A',
                    message: 'Temperature above threshold: 8.2°C',
                    timestamp: '7/5/2025 14:30',
                    status: 'Active'
                },
                {
                    alertId: 'ALT-002',
                    alertType: 'Gas Level Alert',
                    severity: 'High',
                    location: 'Kitchen Area',
                    message: 'Methane gas level critical: 180 ppm',
                    timestamp: '7/5/2025 15:45',
                    status: 'Resolved'
                },
                {
                    alertId: 'ALT-003',
                    alertType: 'Humidity Warning',
                    severity: 'Low',
                    location: 'Storage Room B',
                    message: 'Humidity level high: 75%',
                    timestamp: '7/5/2025 13:20',
                    status: 'Active'
                },
                {
                    alertId: 'ALT-004',
                    alertType: 'Sensor Offline',
                    severity: 'Medium',
                    location: 'Freezer D',
                    message: 'Temperature sensor not responding',
                    timestamp: '7/5/2025 12:15',
                    status: 'Investigating'
                },
                {
                    alertId: 'ALT-005',
                    alertType: 'Food Spoilage Alert',
                    severity: 'High',
                    location: 'Storage Area',
                    message: 'Multiple food items at risk of spoilage',
                    timestamp: '7/5/2025 16:00',
                    status: 'Active'
                }
            ]
        };
    }

    showEmptyState() {
        const tableBody = document.getElementById('reportTableBody');
        const tableHead = document.querySelector('.report-table thead tr');
        const reportTitle = document.getElementById('reportTitle');
        
        if (!tableBody || !tableHead || !reportTitle) return;

        // Update headers based on current report type
        this.updateTableHeaders(tableHead);

        // Get the number of columns for the current report type
        const columnCounts = {
            'user-activity': 5,
            'food-spoilage': 6,
            'sensor-data': 6,
            'alert-summary': 7
        };
        const columnCount = columnCounts[this.currentReportType] || 5;

        // Clear table and show empty state
        tableBody.innerHTML = `
            <tr>
                <td colspan="${columnCount}" class="empty-state">
                    <div class="empty-state-content">
                        <div class="empty-state-icon">📊</div>
                        <div class="empty-state-title">No Report Generated</div>
                        <div class="empty-state-desc">Select your report type and date range, then click "Generate Report" to view data.</div>
                    </div>
                </td>
            </tr>
        `;

        // Update title
        reportTitle.textContent = 'Report Generator';
    }

    generateReport() {
        const tableBody = document.getElementById('reportTableBody');
        const tableHead = document.querySelector('.report-table thead tr');
        if (!tableBody || !tableHead) return;

        // Clear existing table data
        tableBody.innerHTML = '';

        // Get data for current report type
        let data = this.reportData[this.currentReportType] || [];
        let filteredData = this.filterData(data);

        // Update table headers based on report type
        this.updateTableHeaders(tableHead);

        // Populate table based on report type
        filteredData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = this.generateTableRow(item);
            tableBody.appendChild(row);
        });

        // Update report title
        this.updateReportTitle(filteredData.length);

        // Show success notification
        this.showNotification('Report generated successfully!', 'success');
    }

    updateTableHeaders(tableHead) {
        const headers = {
            'user-activity': ['ACTIVITY TYPE', 'TIMESTAMP', 'DESCRIPTION', 'SESSION DURATION', 'IP ADDRESS'],
            'food-spoilage': ['FOOD ITEM', 'CATEGORY', 'STATUS', 'RISK SCORE', 'EXPIRY DATE', 'SENSOR READINGS'],
            'sensor-data': ['SENSOR ID', 'LOCATION', 'SENSOR TYPE', 'CURRENT VALUE', 'STATUS', 'LAST UPDATE'],
            'alert-summary': ['ALERT ID', 'ALERT TYPE', 'SEVERITY', 'LOCATION', 'MESSAGE', 'TIMESTAMP', 'STATUS']
        };

        const headerRow = headers[this.currentReportType] || [];
        tableHead.innerHTML = headerRow.map(header => `<th>${header}</th>`).join('');
    }

    generateTableRow(item) {
        switch (this.currentReportType) {
            case 'user-activity':
                return `
                    <td><span class="activity-badge ${item.activityType.toLowerCase().replace(' ', '-')}">${item.activityType}</span></td>
                    <td>${item.timestamp}</td>
                    <td>${item.description}</td>
                    <td>${item.sessionDuration}</td>
                    <td>${item.ipAddress}</td>
                `;
            case 'food-spoilage':
                return `
                    <td>${item.foodItem}</td>
                    <td>${item.category}</td>
                    <td><span class="status-badge ${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span></td>
                    <td>${item.riskScore}</td>
                    <td>${item.expiryDate}</td>
                    <td>${item.sensorReadings}</td>
                `;
            case 'sensor-data':
                return `
                    <td>${item.sensorId}</td>
                    <td>${item.location}</td>
                    <td>${item.sensorType}</td>
                    <td>${item.currentValue}</td>
                    <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>${item.lastUpdate}</td>
                `;
            case 'alert-summary':
                return `
                    <td>${item.alertId}</td>
                    <td>${item.alertType}</td>
                    <td><span class="severity-badge ${item.severity.toLowerCase()}">${item.severity}</span></td>
                    <td>${item.location}</td>
                    <td>${item.message}</td>
                    <td>${item.timestamp}</td>
                    <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
                `;
            default:
                return '';
        }
    }

    filterData(data) {
        let filtered = [...data];

        // Filter by date range
        const today = new Date();
        const currentDate = new Date();

        if (this.currentDateRange === 'custom' && this.customStartDate && this.customEndDate) {
            const start = new Date(this.customStartDate);
            const end = new Date(this.customEndDate);
            filtered = filtered.filter(item => {
                const itemDate = this.getDateFromItem(item);
                return itemDate && itemDate >= start && itemDate <= end;
            });
            return filtered;
        }

        switch (this.currentDateRange) {
            case 'daily':
                filtered = filtered.filter(item => {
                    const itemDate = this.getDateFromItem(item);
                    return itemDate && itemDate.toDateString() === today.toDateString();
                });
                break;
            case 'weekly':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(item => {
                    const itemDate = this.getDateFromItem(item);
                    return itemDate && itemDate >= weekAgo;
                });
                break;
            case 'monthly':
                const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                filtered = filtered.filter(item => {
                    const itemDate = this.getDateFromItem(item);
                    return itemDate && itemDate >= monthAgo;
                });
                break;
            case 'yearly':
                const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                filtered = filtered.filter(item => {
                    const itemDate = this.getDateFromItem(item);
                    return itemDate && itemDate >= yearAgo;
                });
                break;
        }

        return filtered;
    }

    getDateFromItem(item) {
        // Extract date from different item types
        const dateField = item.lastActivity || item.timestamp || item.lastUpdate || item.expiryDate;
        if (dateField) {
            return new Date(dateField);
        }
        return null;
    }

    updateReportTitle(count) {
        const reportTitle = document.getElementById('reportTitle');
        if (reportTitle) {
            const reportTypeText = this.getReportTypeText();
            reportTitle.textContent = `${reportTypeText} (${count} items)`;
        }
    }

    getReportTypeText() {
        const reportTypes = {
            'user-activity': 'User Activity',
            'food-spoilage': 'Food Spoilage',
            'sensor-data': 'Sensor Data',
            'alert-summary': 'Alert Summary'
        };
        return reportTypes[this.currentReportType] || 'Report';
    }

    downloadExcel() {
        const data = this.reportData[this.currentReportType] || [];
        const filteredData = this.filterData(data);
        if (filteredData.length === 0) {
            this.showNotification('No data to export', 'warning');
            return;
        }

        // Create CSV content
        let csvContent = 'data:text/csv;charset=utf-8,';
        
        // Add headers based on report type
        const headers = this.getCSVHeaders();
        csvContent += headers.join(',') + '\n';
        
        // Add data rows
        filteredData.forEach(item => {
            const row = this.getCSVRow(item);
            csvContent += row.join(',') + '\n';
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${this.currentReportType}-${this.currentDateRange}-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Excel file downloaded successfully!', 'success');
    }

    getCSVHeaders() {
        const headers = {
            'user-activity': ['Activity Type', 'Timestamp', 'Description', 'Session Duration', 'IP Address'],
            'food-spoilage': ['Food Item', 'Category', 'Status', 'Risk Score', 'Expiry Date', 'Sensor Readings'],
            'sensor-data': ['Sensor ID', 'Location', 'Sensor Type', 'Current Value', 'Status', 'Last Update'],
            'alert-summary': ['Alert ID', 'Alert Type', 'Severity', 'Location', 'Message', 'Timestamp', 'Status']
        };
        return headers[this.currentReportType] || [];
    }

    getCSVRow(item) {
        switch (this.currentReportType) {
            case 'user-activity':
                return [
                    `"${item.activityType}"`,
                    `"${item.timestamp}"`,
                    `"${item.description}"`,
                    `"${item.sessionDuration}"`,
                    `"${item.ipAddress}"`
                ];
            case 'food-spoilage':
                return [
                    `"${item.foodItem}"`,
                    `"${item.category}"`,
                    `"${item.status}"`,
                    `"${item.riskScore}"`,
                    `"${item.expiryDate}"`,
                    `"${item.sensorReadings}"`
                ];
            case 'sensor-data':
                return [
                    `"${item.sensorId}"`,
                    `"${item.location}"`,
                    `"${item.sensorType}"`,
                    `"${item.currentValue}"`,
                    `"${item.status}"`,
                    `"${item.lastUpdate}"`
                ];
            case 'alert-summary':
                return [
                    `"${item.alertId}"`,
                    `"${item.alertType}"`,
                    `"${item.severity}"`,
                    `"${item.location}"`,
                    `"${item.message}"`,
                    `"${item.timestamp}"`,
                    `"${item.status}"`
                ];
            default:
                return [];
        }
    }

    downloadPDF() {
        const data = this.reportData[this.currentReportType] || [];
        const filteredData = this.filterData(data);
        if (filteredData.length === 0) {
            this.showNotification('No data to export', 'warning');
            return;
        }

        // For a real implementation, you would use a library like jsPDF
        // For now, we'll show a notification
        this.showNotification('PDF download feature requires jsPDF library. CSV download is available.', 'info');
        
        // Alternative: Open print dialog
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Method to add custom CSS for notifications
    addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize report generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the report generator page
    const reportGeneratorMain = document.querySelector('.report-generator-main');
    if (reportGeneratorMain) {
        const reportGen = new ReportGenerator();
        reportGen.addNotificationStyles();
    }
});

// Export for use in SPA
if (typeof window !== 'undefined') {
    window.ReportGenerator = ReportGenerator;
} 