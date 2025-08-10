// Sensor Analytics Connector - Handles UI interactions with the API
class SensorAnalyticsConnector {
    constructor() {
        this.api = window.sensorAnalyticsAPI;
        this.currentData = [];
        this.isInitialized = false;
        this.eventListenersAttached = false;
    }

    // Initialize the connector when the detailed view is loaded
    init() {
        // Always reset initialization when called
        this.isInitialized = false;
        this.eventListenersAttached = false;
        
        this.setupEventListeners();
        this.loadInitialData();
        this.isInitialized = true;
    }

    // Setup event listeners for all interactive elements
    setupEventListeners() {
        // Remove any existing event listeners first
        this.removeEventListeners();
        
        // Name search with debouncing
        const nameSearch = document.getElementById('nameSearch');
        if (nameSearch) {
            let searchTimeout;
            nameSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleNameSearch(e.target.value);
                }, 300);
            });
        }

        // Date filters
        const startDate = document.getElementById('startDate');
        if (startDate) {
            startDate.addEventListener('change', (e) => {
                this.handleFilterChange('startDate', e.target.value);
            });
        }

        const endDate = document.getElementById('endDate');
        if (endDate) {
            endDate.addEventListener('change', (e) => {
                this.handleFilterChange('endDate', e.target.value);
            });
        }

        // Dropdown filters
        const testerType = document.getElementById('testerType');
        if (testerType) {
            testerType.addEventListener('change', (e) => {
                this.handleFilterChange('testerType', e.target.value);
            });
        }

        const sensorType = document.getElementById('sensorType');
        if (sensorType) {
            sensorType.addEventListener('change', (e) => {
                this.handleFilterChange('sensorType', e.target.value);
            });
        }

        const status = document.getElementById('status');
        if (status) {
            status.addEventListener('change', (e) => {
                this.handleFilterChange('status', e.target.value);
            });
        }

        // Action buttons
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.handleClearFilters();
            });
        }

        const exportCSV = document.getElementById('exportCSV');
        if (exportCSV) {
            exportCSV.addEventListener('click', () => {
                this.handleExport();
            });
        }

        const exportPDF = document.getElementById('exportPDF');
        if (exportPDF) {
            exportPDF.addEventListener('click', () => {
                this.handleExportPDF();
            });
        }

        this.eventListenersAttached = true;
        console.log('Event listeners attached successfully');
    }

    // Remove event listeners to prevent duplicates
    removeEventListeners() {
        const elements = [
            'nameSearch', 'startDate', 'endDate', 'testerType', 
            'sensorType', 'status', 'clearFilters', 'exportCSV', 'exportPDF'
        ];

        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Clone the element to remove all event listeners
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
            }
        });
    }

    // Load initial data
    async loadInitialData() {
        try {
            const data = this.api.getCurrentData();
            this.currentData = data;
            this.renderTable(data);
            this.updateSensorCount(this.api.getSensorCount());
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    // Handle name search
    async handleNameSearch(searchTerm) {
        try {
            const data = await this.api.handleNameSearch(searchTerm);
            this.currentData = data;
            this.renderTable(data);
            this.updateSensorCount(data.length);
        } catch (error) {
            console.error('Error searching:', error);
        }
    }

    // Handle filter changes
    async handleFilterChange(filterType, value) {
        try {
            const data = await this.api.handleFilterChange(filterType, value);
            this.currentData = data;
            this.renderTable(data);
            this.updateSensorCount(data.length);
        } catch (error) {
            console.error('Error applying filter:', error);
        }
    }

    // Handle clear filters
    async handleClearFilters() {
        try {
            // Clear form inputs
            this.clearFormInputs();
            
            // Reload data
            const data = await this.api.handleClearFilters();
            this.currentData = data;
            this.renderTable(data);
            this.updateSensorCount(this.api.getSensorCount());
        } catch (error) {
            console.error('Error clearing filters:', error);
        }
    }

    // Handle export
    handleExport() {
        try {
            // Use current filtered data
            const dataToExport = this.currentData.length > 0 ? this.currentData : this.api.getCurrentData();
            this.api.exportToCSV(dataToExport);
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    }

    // Handle export PDF
    async handleExportPDF() {
        try {
            // Use current filtered data
            const dataToExport = this.currentData.length > 0 ? this.currentData : this.api.getCurrentData();
            await this.api.exportToPDF(dataToExport);
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    }

    // Clear form inputs
    clearFormInputs() {
        const inputs = [
            'nameSearch',
            'startDate', 
            'endDate',
            'testerType',
            'sensorType',
            'status'
        ];

        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'SELECT') {
                    element.selectedIndex = 0;
                } else {
                    element.value = '';
                }
            }
        });
    }

    // Render table with data
    renderTable(data) {
        const tbody = document.getElementById('sensorTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #666;">
                        No data found matching your filters
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach(item => {
            const row = this.createTableRow(item);
            tbody.appendChild(row);
        });
    }

    // Create table row from data item
    createTableRow(item) {
        const row = document.createElement('tr');
        
        // Format last ping time
        const lastPing = new Date(item.lastPing);
        const now = new Date();
        const timeDiff = Math.floor((now - lastPing) / (1000 * 60)); // minutes
        
        let timeAgo;
        if (timeDiff < 1) {
            timeAgo = 'Just now';
        } else if (timeDiff < 60) {
            timeAgo = `${timeDiff} min${timeDiff > 1 ? 's' : ''} ago`;
        } else if (timeDiff < 1440) {
            const hours = Math.floor(timeDiff / 60);
            timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(timeDiff / 1440);
            timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
        }

        // Get status badge class
        let statusClass = '';
        if (item.status === 'Spoilage Alert') statusClass = 'spoiled';
        else if (item.status === 'Inactive') statusClass = 'expired';
        else if (item.status === 'Active') statusClass = '';

        // Get alert badge class
        let alertClass = item.alertsToday > 0 ? '' : 'none';

        row.innerHTML = `
            <td>${item.foodTester}<br><span class="created-date">Registered: ${this.formatDate(item.registeredDate)}</span></td>
            <td><span class="cat-badge">${item.type}</span></td>
            <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            <td>${this.formatDate(item.lastPing)}<br><span class="expiry-today">${timeAgo}</span></td>
            <td>${item.lastReading}</td>
            <td><span class="alert-badge ${alertClass}">${item.alertsToday} alert${item.alertsToday !== 1 ? 's' : ''}</span></td>
        `;

        return row;
    }

    // Update sensor count
    updateSensorCount(count) {
        const countElement = document.getElementById('sensorCount');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Check if connector is working properly
    checkStatus() {
        const elements = [
            'nameSearch', 'startDate', 'endDate', 'testerType', 
            'sensorType', 'status', 'clearFilters', 'exportCSV', 'exportPDF'
        ];

        const missingElements = elements.filter(id => !document.getElementById(id));
        
        console.log('Connector Status Check:');
        console.log('- Is Initialized:', this.isInitialized);
        console.log('- Event Listeners Attached:', this.eventListenersAttached);
        console.log('- Missing Elements:', missingElements);
        console.log('- Current Data Length:', this.currentData.length);
        
        return {
            isInitialized: this.isInitialized,
            eventListenersAttached: this.eventListenersAttached,
            missingElements: missingElements,
            hasData: this.currentData.length > 0
        };
    }

    // Force re-initialization
    forceReinit() {
        console.log('Forcing re-initialization of Sensor Analytics Connector');
        this.init();
    }
}

// Initialize connector when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.sensorAnalyticsConnector = new SensorAnalyticsConnector();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SensorAnalyticsConnector;
} else {
    window.SensorAnalyticsConnector = SensorAnalyticsConnector;
} 