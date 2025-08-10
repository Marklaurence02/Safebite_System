// Sensor Analytics API
class SensorAnalyticsAPI {
    constructor() {
        this.baseURL = '/api/sensor-analytics';
        this.currentFilters = {
            nameSearch: '',
            startDate: '',
            endDate: '',
            testerType: 'All Types',
            sensorType: 'All Types',
            status: 'All Status'
        };
        this.data = {
            summary: null,
            detailed: null
        };
        // Initialize with mock data
        this.initializeData();
    }

    // Initialize data with mock data
    initializeData() {
        this.data.detailed = this.getMockDetailedData();
        this.data.summary = this.getMockSummaryData();
    }

    // Get total sensor count
    getSensorCount() {
        return this.data.detailed ? this.data.detailed.length : 0;
    }

    // Get filtered sensor count
    getFilteredSensorCount() {
        const filteredData = this.applyFilters(this.data.detailed, this.currentFilters);
        return filteredData.length;
    }

    // Fetch summary data
    async fetchSummaryData() {
        try {
            const response = await fetch(`${this.baseURL}/summary`);
            if (!response.ok) {
                throw new Error('Failed to fetch summary data');
            }
            this.data.summary = await response.json();
            return this.data.summary;
        } catch (error) {
            console.error('Error fetching summary data:', error);
            return this.getMockSummaryData();
        }
    }

    // Fetch detailed data with filters
    async fetchDetailedData(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(`${this.baseURL}/detailed?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch detailed data');
            }
            this.data.detailed = await response.json();
            return this.data.detailed;
        } catch (error) {
            console.error('Error fetching detailed data:', error);
            return this.getMockDetailedData();
        }
    }

    // Search food testers by name
    async searchFoodTesters(searchTerm) {
        try {
            const response = await fetch(`${this.baseURL}/search?name=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error('Failed to search food testers');
            }
            return await response.json();
        } catch (error) {
            console.error('Error searching food testers:', error);
            return this.searchMockData(searchTerm);
        }
    }

    // Get sensor statistics
    async getSensorStats() {
        try {
            const response = await fetch(`${this.baseURL}/stats`);
            if (!response.ok) {
                throw new Error('Failed to fetch sensor stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching sensor stats:', error);
            return this.getMockSensorStats();
        }
    }

    // Update filters
    updateFilters(newFilters) {
        this.currentFilters = { ...this.currentFilters, ...newFilters };
        return this.currentFilters;
    }

    // Apply filters to data
    applyFilters(data, filters) {
        let filteredData = [...data];

        // Name search filter
        if (filters.nameSearch) {
            filteredData = filteredData.filter(item => 
                item.foodTester.toLowerCase().includes(filters.nameSearch.toLowerCase())
            );
        }

        // Date range filter (INCLUSIVE, compare only date part)
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            start.setHours(0,0,0,0);
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.lastPing);
                itemDate.setHours(0,0,0,0);
                return itemDate >= start;
            });
        }

        if (filters.endDate) {
            const end = new Date(filters.endDate);
            end.setHours(0,0,0,0);
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.lastPing);
                itemDate.setHours(0,0,0,0);
                return itemDate <= end;
            });
        }

        // Tester type filter
        if (filters.testerType && filters.testerType !== 'All Types') {
            filteredData = filteredData.filter(item => 
                item.type === filters.testerType
            );
        }

        // Sensor type filter
        if (filters.sensorType && filters.sensorType !== 'All Types') {
            filteredData = filteredData.filter(item => 
                item.sensorType === filters.sensorType
            );
        }

        // Status filter
        if (filters.status && filters.status !== 'All Status') {
            filteredData = filteredData.filter(item => 
                item.status === filters.status
            );
        }

        return filteredData;
    }

    // Export data to CSV
    exportToCSV(data, filename = 'sensor-analytics.csv') {
        if (!data || data.length === 0) {
            console.error('No data to export');
            return;
        }

        const headers = ['Food Tester', 'Type', 'Status', 'Last Ping', 'Last Reading', 'Alerts Today'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                `"${row.foodTester}"`,
                row.type,
                row.status,
                row.lastPing,
                `"${row.lastReading}"`,
                row.alertsToday
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Export data to PDF
    async exportToPDF(data, filename = 'sensor-analytics-report.pdf') {
        if (!data || data.length === 0) {
            console.error('No data to export');
            return;
        }

        // Debug logging
        console.log('PDF Export Debug Info:');
        console.log('window.jspdf:', typeof window.jspdf);
        console.log('window.jsPDF:', typeof window.jsPDF);
        console.log('window.jspdf.jsPDF:', typeof window.jspdf?.jsPDF);
        console.log('window.jsPDF.jsPDF:', typeof window.jsPDF?.jsPDF);

        try {
            // Check if jsPDF is available
            if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
                throw new Error('jsPDF library not loaded');
            }

            // Create new PDF document - try different ways to access jsPDF
            let jsPDF;
            if (window.jspdf && window.jspdf.jsPDF) {
                jsPDF = window.jspdf.jsPDF;
            } else if (window.jsPDF) {
                jsPDF = window.jsPDF.jsPDF;
            } else {
                throw new Error('jsPDF not found');
            }

            const doc = new jsPDF();

            // Set document properties
            doc.setProperties({
                title: 'Sensor Analytics Report',
                subject: 'Food Spoilage Detection System Report',
                author: 'Sensor Analytics System',
                creator: 'Sensor Analytics System'
            });

            // Add title
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Sensor Analytics Report', 105, 20, { align: 'center' });

            // Add subtitle
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Food Spoilage Detection System', 105, 30, { align: 'center' });

            // Add generation date
            const currentDate = new Date().toLocaleDateString();
            doc.text(`Generated on: ${currentDate}`, 105, 40, { align: 'center' });

            // Add summary statistics
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('System Overview', 20, 60);

            const totalSensors = this.getSensorCount();
            const activeSensors = data.filter(item => item.status === 'Active').length;
            const alertSensors = data.filter(item => item.status === 'Spoilage Alert').length;
            const inactiveSensors = data.filter(item => item.status === 'Inactive').length;

            // Summary table
            const summaryData = [
                ['Total Sensors', totalSensors.toString()],
                ['Active', activeSensors.toString()],
                ['Spoilage Alerts', alertSensors.toString()],
                ['Inactive', inactiveSensors.toString()]
            ];

            doc.autoTable({
                startY: 70,
                head: [['Metric', 'Count']],
                body: summaryData,
                theme: 'grid',
                headStyles: { fillColor: [51, 51, 51] },
                styles: { fontSize: 10 },
                columnStyles: {
                    0: { fontStyle: 'bold' },
                    1: { halign: 'center' }
                },
                margin: { left: 20, right: 20 }
            });

            // Add detailed report title
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Detailed Sensor Report', 20, doc.lastAutoTable.finalY + 20);

            // Prepare table data
            const tableData = data.map(item => [
                item.foodTester,
                item.type,
                item.status,
                this.formatDateForPDF(item.lastPing),
                item.lastReading,
                item.alertsToday.toString()
            ]);

            // Create detailed table
            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 30,
                head: [['Food Tester', 'Type', 'Status', 'Last Ping', 'Last Reading', 'Alerts Today']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [51, 51, 51] },
                styles: { fontSize: 8 },
                columnStyles: {
                    0: { fontStyle: 'bold' },
                    2: { 
                        fontStyle: 'bold',
                        textColor: (row, data) => {
                            const status = data[row.index][2];
                            if (status === 'Active') return [40, 167, 69]; // Green
                            if (status === 'Spoilage Alert') return [220, 53, 69]; // Red
                            return [108, 117, 125]; // Gray
                        }
                    },
                    5: { halign: 'center', fontStyle: 'bold' }
                },
                margin: { left: 20, right: 20 },
                pageBreak: 'auto',
                alternateRowStyles: { fillColor: [248, 249, 250] }
            });

            // Add footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                doc.text(
                    `Page ${i} of ${pageCount} | Generated by Sensor Analytics System | ${currentDate}`,
                    105, 
                    doc.internal.pageSize.height - 10, 
                    { align: 'center' }
                );
            }

            // Save the PDF
            doc.save(filename);

        } catch (error) {
            console.error('Error generating PDF:', error);
            console.error('Error details:', error.message);
            
            // Try to provide more specific error information
            if (error.message.includes('jsPDF library not loaded')) {
                alert('PDF library not loaded. Please refresh the page and try again.');
            } else if (error.message.includes('jsPDF not found')) {
                alert('PDF generation library not available. Please check your internet connection.');
            } else {
                // Fallback to CSV export
                this.exportToCSV(data, filename.replace('.pdf', '.csv'));
                alert('PDF generation failed. CSV file has been downloaded instead. Error: ' + error.message);
            }
        }
    }

    // Format date for PDF
    formatDateForPDF(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Mock data for development/testing
    getMockSummaryData() {
        return {
            totalSensors: 156,
            activeTesters: 142,
            spoilageAlerts: 6,
            inactive: 12,
            usageByType: {
                'Street Food Testers': 65,
                'Food Truck Inspectors': 25,
                'Canteen Auditors': 10
            },
            sensorActivity: {
                'MQ4 Sensors': { active: 98, total: 120, percentage: 81.7 },
                'DHT11 Sensors': { active: 32, total: 36, percentage: 88.9 },
                'DS18B20 Sensors': { active: 12, total: 12, percentage: 100 }
            }
        };
    }

    getMockDetailedData() {
        return [
            {
                foodTester: "Juan's Tacos Cart",
                type: "Street Food Tester",
                status: "Spoilage Alert",
                lastPing: "2025-06-26T10:30:00",
                lastReading: "Gas: 380 ppm",
                alertsToday: 3,
                registeredDate: "2025-06-25",
                sensorType: "MQ4"
            },
            {
                foodTester: "Maria's Food Truck",
                type: "Food Truck Inspector",
                status: "Inactive",
                lastPing: "2025-06-25T15:20:00",
                lastReading: "Temp: 4.2°C, Hum: 78%",
                alertsToday: 0,
                registeredDate: "2025-06-22",
                sensorType: "DHT11"
            },
            {
                foodTester: "School Canteen #3",
                type: "Canteen Auditor",
                status: "Active",
                lastPing: "2025-06-26T10:25:00",
                lastReading: "Temp: -1.8°C",
                alertsToday: 1,
                registeredDate: "2025-06-25",
                sensorType: "DS18B20"
            },
            {
                foodTester: "Carlos BBQ Cart",
                type: "Street Food Tester",
                status: "Active",
                lastPing: "2025-06-26T10:29:00",
                lastReading: "Gas: 220 ppm",
                alertsToday: 2,
                registeredDate: "2025-06-25",
                sensorType: "MQ4"
            },
            {
                foodTester: "Office Canteen A",
                type: "Canteen Auditor",
                status: "Spoilage Alert",
                lastPing: "2025-06-26T10:27:00",
                lastReading: "Temp: 25.3°C, Hum: 89%",
                alertsToday: 4,
                registeredDate: "2025-06-24",
                sensorType: "DHT11"
            },
            {
                foodTester: "Beach Food Truck #2",
                type: "Food Truck Inspector",
                status: "Active",
                lastPing: "2025-06-26T10:29:00",
                lastReading: "Temp: 3.8°C",
                alertsToday: 0,
                registeredDate: "2025-06-23",
                sensorType: "DS18B20"
            },
            {
                foodTester: "Downtown Food Cart #5",
                type: "Street Food Tester",
                status: "Active",
                lastPing: "2025-06-26T10:28:00",
                lastReading: "Gas: 150 ppm",
                alertsToday: 0,
                registeredDate: "2025-06-24",
                sensorType: "MQ4"
            },
            {
                foodTester: "University Canteen B",
                type: "Canteen Auditor",
                status: "Active",
                lastPing: "2025-06-26T10:26:00",
                lastReading: "Temp: 2.1°C, Hum: 75%",
                alertsToday: 1,
                registeredDate: "2025-06-25",
                sensorType: "DHT11"
            },
            {
                foodTester: "Park Food Truck #3",
                type: "Food Truck Inspector",
                status: "Spoilage Alert",
                lastPing: "2025-06-26T10:24:00",
                lastReading: "Temp: 28.5°C",
                alertsToday: 2,
                registeredDate: "2025-06-23",
                sensorType: "DS18B20"
            },
            {
                foodTester: "Mall Food Court #1",
                type: "Canteen Auditor",
                status: "Active",
                lastPing: "2025-06-26T10:31:00",
                lastReading: "Temp: 1.5°C, Hum: 82%",
                alertsToday: 0,
                registeredDate: "2025-06-25",
                sensorType: "DHT11"
            }
        ];
    }

    searchMockData(searchTerm) {
        const mockData = this.getMockDetailedData();
        return mockData.filter(item => 
            item.foodTester.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    getMockSensorStats() {
        return {
            totalSensors: 156,
            activeTesters: 142,
            spoilageAlerts: 6,
            inactive: 12,
            sensorTypes: {
                MQ4: { count: 120, active: 98 },
                DHT11: { count: 36, active: 32 },
                DS18B20: { count: 12, active: 12 }
            }
        };
    }

    // Event handlers for UI interactions
    handleNameSearch(searchTerm) {
        this.updateFilters({ nameSearch: searchTerm });
        const filteredData = this.applyFilters(this.data.detailed, this.currentFilters);
        return Promise.resolve(filteredData);
    }

    handleFilterChange(filterType, value) {
        this.updateFilters({ [filterType]: value });
        const filteredData = this.applyFilters(this.data.detailed, this.currentFilters);
        return Promise.resolve(filteredData);
    }

    handleExport() {
        const data = this.data.detailed || this.getMockDetailedData();
        this.exportToCSV(data);
    }

    handleExportPDF() {
        const data = this.data.detailed || this.getMockDetailedData();
        return this.exportToPDF(data);
    }

    handleClearFilters() {
        this.currentFilters = {
            nameSearch: '',
            startDate: '',
            endDate: '',
            testerType: 'All Types',
            sensorType: 'All Types',
            status: 'All Status'
        };
        return Promise.resolve(this.data.detailed);
    }

    // Get current data for display
    getCurrentData() {
        return this.data.detailed || this.getMockDetailedData();
    }

    // Get filtered data for display
    getFilteredData() {
        return this.applyFilters(this.data.detailed, this.currentFilters);
    }
}

// Initialize the API
const sensorAnalyticsAPI = new SensorAnalyticsAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SensorAnalyticsAPI;
} else {
    window.SensorAnalyticsAPI = SensorAnalyticsAPI;
    window.sensorAnalyticsAPI = sensorAnalyticsAPI;
}

document.addEventListener('DOMContentLoaded', function() {
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');

  if (startDateInput) {
    startDateInput.addEventListener('change', function() {
      const startDate = startDateInput.value;
      sensorAnalyticsAPI.handleFilterChange('startDate', startDate).then(filteredData => {
        // Call your function to update the table/display with filteredData
        renderSensorAnalyticsTable(filteredData);
      });
    });
  }

  if (endDateInput) {
    endDateInput.addEventListener('change', function() {
      const endDate = endDateInput.value;
      sensorAnalyticsAPI.handleFilterChange('endDate', endDate).then(filteredData => {
        // Call your function to update the table/display with filteredData
        renderSensorAnalyticsTable(filteredData);
      });
    });
  }
}); 