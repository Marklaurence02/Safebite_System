// sensor-dashboard.js - Updated to fetch real Arduino sensor data

// List of registered devices (Arduino sensors) - Will be populated from database
let registeredDevices = [];

// Real-time sensor data storage
let realTimeSensorData = {
  temperature: { value: 0, unit: '°C', max: 50, status: 'offline' },
  humidity: { value: 0, unit: '%', max: 100, status: 'offline' },
  gas: { value: 0, unit: 'ppm', max: 1000, status: 'offline' }
};

// Food items from database - Will be populated dynamically
let foodItems = [];

// Admin data: available sensor types
const adminSensorTypes = ['temperature', 'humidity', 'gas', 'acidic'];

class SensorDashboard {
  constructor() {
    this.init();
    this.startRealTimeUpdates();
  }

  async init() {
    await this.fetchSensorDevices();
    await this.fetchFoodItems();
    this.populateFoodDropdown();
    this.setupEventListeners();
    this.renderRegisteredDevices();
    this.fetchLatestSensorData();
    
    // Test API connection on startup
    this.testAPIConnection();
  }

  // Fetch sensor devices from database
  async fetchSensorDevices() {
    try {
      console.log('Fetching sensor devices from database...');
      
      // Get session token from localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.error('No session token found - redirecting to login');
        window.location.href = '../pages/Login.php';
        return;
      }
      
      const response = await fetch('../../backend/api/sensor-data.php?action=get_sensors', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication required - user not logged in');
          // Redirect to login or show login prompt
          window.location.href = '../pages/Login.php';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Sensor devices response:', result);
      
      if (result.success && result.sensors) {
        // Convert database sensors to registered devices format
        registeredDevices = result.sensors.map(sensor => ({
          name: `${sensor.type} Sensor`,
          sensorType: sensor.type.toLowerCase(),
          id: `SENSOR_${sensor.type.toUpperCase()}_${sensor.sensor_id}`,
          sensor_id: sensor.sensor_id,
          type: sensor.type
        }));
        console.log('Registered devices updated:', registeredDevices);
      } else {
        console.log('No sensor devices found or API error');
        // Fallback to default sensors if none found
        registeredDevices = [
          { name: 'Temperature Sensor', sensorType: 'temperature', id: 'SENSOR_TEMPERATURE_DEFAULT', sensor_id: null, type: 'Temperature' },
          { name: 'Humidity Sensor', sensorType: 'humidity', id: 'SENSOR_HUMIDITY_DEFAULT', sensor_id: null, type: 'Humidity' },
          { name: 'Gas Sensor', sensorType: 'gas', id: 'SENSOR_GAS_DEFAULT', sensor_id: null, type: 'Gas' }
        ];
      }
    } catch (error) {
      console.error('Error fetching sensor devices:', error);
              // Fallback to default sensors on error
        registeredDevices = [
          { name: 'Temperature Sensor', sensorType: 'temperature', id: 'SENSOR_TEMPERATURE_DEFAULT', sensor_id: null, type: 'Temperature' },
          { name: 'Humidity Sensor', sensorType: 'humidity', id: 'SENSOR_HUMIDITY_DEFAULT', sensor_id: null, type: 'Humidity' },
          { name: 'Gas Sensor', sensorType: 'gas', id: 'SENSOR_GAS_DEFAULT', sensor_id: null, type: 'Gas' }
        ];
    }
  }

  // Fetch food items from database
  async fetchFoodItems() {
    try {
      console.log('Fetching food items from database...');
      
      // Get session token from localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.error('No session token found - redirecting to login');
        window.location.href = '../pages/Login.php';
        return;
      }
      
      const response = await fetch('../../backend/api/sensor-data.php?action=get_food_items', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication required - user not logged in');
          // Redirect to login or show login prompt
          window.location.href = '../pages/Login.php';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Food items response:', result);
      
      if (result.success && result.food_items) {
        foodItems = result.food_items;
        console.log('Food items updated:', foodItems);
      } else {
        console.log('No food items found or API error');
        foodItems = [];
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      foodItems = [];
    }
  }

  // Test API connection
    async testAPIConnection() {
    try {
      console.log('Testing API connection...');
      
      // Get session token from localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.error('No session token found - redirecting to login');
        window.location.href = '../pages/Login.php';
        return;
      }
      
      const response = await fetch('../../backend/api/sensor-data.php', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Test Result:', result);
        console.log('Data count:', result.data ? result.data.length : 0);
      } else if (response.status === 401) {
        console.error('Authentication required - user not logged in');
        // Redirect to login or show login prompt
        window.location.href = '../pages/Login.php';
      } else {
        console.error('API connection failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('API connection test failed:', error);
    }
  }

  // Fetch latest sensor data from Arduino using the new optimized query
  async fetchLatestSensorData() {
    try {
      console.log('Fetching sensor data from database API...');
      
      // Get session token from localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.error('No session token found - redirecting to login');
        window.location.href = '../pages/Login.php';
        return;
      }
      
      // Structure the fetch request like the image example
      const response = await fetch('../../backend/api/sensor-data.php', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication required - user not logged in');
          // Redirect to login or show login prompt
          window.location.href = '../pages/Login.php';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Database API Response:', result);
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('Data count:', result.data.length);
        console.log('Debug info:', result.debug);
        console.log('User ID detected:', result.user_id);
        
        // Store the latest sensor data globally for device info bar access
        window.latestSensorData = result;
        
        // Update real-time sensor data from the new sensor_readings structure
        if (result.sensor_readings) {
          if (result.sensor_readings.temperature) {
            realTimeSensorData.temperature.value = parseFloat(result.sensor_readings.temperature.value);
            realTimeSensorData.temperature.unit = result.sensor_readings.temperature.unit;
            realTimeSensorData.temperature.status = result.sensor_readings.temperature.status || 'online';
            console.log('Temperature updated:', result.sensor_readings.temperature.value);
          }
          if (result.sensor_readings.humidity) {
            realTimeSensorData.humidity.value = parseFloat(result.sensor_readings.humidity.value);
            realTimeSensorData.humidity.unit = result.sensor_readings.humidity.unit;
            realTimeSensorData.humidity.status = result.sensor_readings.humidity.status || 'online';
            console.log('Humidity updated:', result.sensor_readings.humidity.value);
          }
          if (result.sensor_readings.gas) {
            realTimeSensorData.gas.value = parseInt(result.sensor_readings.gas.value);
            realTimeSensorData.gas.unit = result.sensor_readings.gas.unit;
            realTimeSensorData.gas.status = result.sensor_readings.gas.status || 'online';
            console.log('Gas updated:', result.sensor_readings.gas.value);
          }
        }
        
        // Update display if no food is selected
        const select = document.getElementById('device-select');
        if (select && !select.value) {
          this.updateSensorCardsWithRealData();
        }
      } else {
        console.log('No sensor data available or API returned empty data');
        console.log('Debug info:', result.debug);
        // Set all sensors to offline if no data
        realTimeSensorData.temperature.status = 'offline';
        realTimeSensorData.humidity.status = 'offline';
        realTimeSensorData.gas.status = 'offline';
        this.updateSensorCardsWithRealData();
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      // Set all sensors to offline on error
      realTimeSensorData.temperature.status = 'offline';
      realTimeSensorData.humidity.status = 'offline';
      realTimeSensorData.gas.status = 'offline';
      this.updateSensorCardsWithRealData();
    }
  }

  // Start real-time updates every 10 seconds
  startRealTimeUpdates() {
    setInterval(() => {
      this.fetchLatestSensorData();
    }, 10000); // Update every 10 seconds
  }

  populateFoodDropdown() {
    const select = document.getElementById('device-select');
    if (!select) return;
    select.innerHTML = '<option value="">Select a food...</option>';
    
    if (foodItems && foodItems.length > 0) {
      foodItems.forEach(food => {
        const option = document.createElement('option');
        option.value = food.food_id;
        option.textContent = `${food.name} (${food.category})`;
        select.appendChild(option);
      });
    } else {
      // Fallback if no food items from database
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No food items available';
      option.disabled = true;
      select.appendChild(option);
    }
  }

  setupEventListeners() {
    document.addEventListener('change', async (e) => {
      if (e.target.id === 'device-select') {
        if (e.target.value) {
          await this.updateSensorCardsForFood(e.target.value);
        } else {
          this.updateSensorCardsWithRealData();
        }
        this.clearInfoBar();
      }
    });
    document.addEventListener('click', (e) => {
      if (e.target.id === 'add-device-btn') {
        this.showAddDeviceModal();
      }
    });
  }

  renderRegisteredDevices() {
    const container = document.querySelector('.sensor-cards-container');
    if (!container) return;
    container.innerHTML = '';
    registeredDevices.forEach(device => {
      const sensorType = device.sensorType;
      const card = document.createElement('div');
      card.className = 'sensor-card';
      card.setAttribute('data-device-id', device.id);
      card.setAttribute('data-sensor-type', sensorType);
      card.innerHTML = `
        <div class="sensor-card-header">
          <div class="sensor-icon">${this.getSensorIcon(sensorType)}</div>
          <div class="sensor-info">
            <div class="sensor-label">${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}</div>
            <div class="sensor-value">Loading...</div>
          </div>
        </div>
        <div class="sensor-gauge">
          <div class="gauge" data-label="${sensorType}" data-value="0" data-unit=""></div>
        </div>
      `;
      container.appendChild(card);
      // Initialize gauge as loading
      if (window.setGaugeValue) {
        const gauge = card.querySelector('.gauge');
        window.setGaugeValue(gauge, 0, '');
      }
    });
    this.setupSensorCardClicks();
    this.clearInfoBar();
    
    // Show real-time data by default (no food selected)
    this.updateSensorCardsWithRealData();
  }

  updateSensorCardsWithRealData() {
    const cards = document.querySelectorAll('.sensor-card');
    registeredDevices.forEach(device => {
      const card = document.querySelector(`.sensor-card[data-device-id="${device.id}"][data-sensor-type="${device.sensorType}"]`);
      if (card) {
        const sensorType = device.sensorType;
        const sensorData = realTimeSensorData[sensorType];
        const valueDiv = card.querySelector('.sensor-value');
        
        if (sensorData && sensorData.status === 'online') {
          if (valueDiv) valueDiv.textContent = `${sensorData.value}${sensorData.unit}`;
          const gauge = card.querySelector('.gauge');
          if (gauge && window.setGaugeValue) {
            window.setGaugeValue(gauge, sensorData.value, sensorData.unit);
          }
          // Add online status indicator
          card.classList.add('sensor-card-highlight-online');
        } else {
          if (valueDiv) valueDiv.textContent = 'Offline';
          const gauge = card.querySelector('.gauge');
          if (gauge && window.setGaugeValue) window.setGaugeValue(gauge, 0, '');
          // Add offline status indicator
          card.classList.add('sensor-card-highlight-offline');
        }
      }
    });
  }

  setupSensorCardClicks() {
    const container = document.querySelector('.sensor-cards-container');
    if (!container) return;
    container.onclick = null;
    container.ondblclick = null;
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.sensor-card');
      if (!card) return;
      const deviceId = card.getAttribute('data-device-id');
      const sensorType = card.getAttribute('data-sensor-type');
      if (deviceId && sensorType) {
        this.showDeviceInfoBar(deviceId, sensorType);
        container.querySelectorAll('.sensor-card').forEach(c => {
          c.classList.remove('sensor-card-highlight-online', 'sensor-card-highlight-offline');
        });
        card.classList.add('sensor-card-highlight-online');
      }
    });
    container.addEventListener('dblclick', (e) => {
      const card = e.target.closest('.sensor-card');
      if (!card) return;
      container.querySelectorAll('.sensor-card').forEach(c => {
        c.classList.remove('sensor-card-highlight-online', 'sensor-card-highlight-offline');
      });
      this.clearInfoBar();
    });
  }

  showDeviceInfoBar(deviceId, sensorType) {
    const infoBar = document.querySelector('.device-info');
    if (infoBar) {
      // Check if food is selected
      const foodSelect = document.getElementById('device-select');
      const isFoodSelected = foodSelect && foodSelect.value !== '';
      
      // Try to find real sensor data from the latest API response
      let sensorInfo = null;
      if (window.latestSensorData && window.latestSensorData.data) {
        sensorInfo = window.latestSensorData.data.find(item => 
          item.device_id === deviceId || 
          item.sensor_type.toLowerCase() === sensorType
        );
      }
      
      if (sensorInfo) {
        // Use real data from API
        const status = sensorInfo.status || 'offline';
        const lastUpdate = sensorInfo.last_update || 'No data';
        
        if (isFoodSelected) {
          // Show detailed info when food is selected
          const deviceName = sensorInfo.device_name || deviceId;
          infoBar.innerHTML = `
            <div class="device-id-display"><strong>Device:</strong> ${deviceName}</div>
            <div class="device-status"><strong>Status:</strong> <span class="${status === 'online' ? 'status-online' : 'status-offline'}">${status}</span></div>
            <div class="device-sensor"><strong>Sensor:</strong> ${sensorInfo.sensor_type}</div>
            <div class="device-update"><strong>Last Update:</strong> ${lastUpdate}</div>
            <div class="device-value"><strong>Value:</strong> ${sensorInfo.value}${sensorInfo.unit}</div>
          `;
        } else {
          // Show simplified format when no food is selected
          infoBar.innerHTML = `
            <div class="device-id-display"><strong>Device:</strong> ${deviceId}</div>
            <div class="device-status"><strong>Status:</strong> <span class="${status === 'online' ? 'status-online' : 'status-offline'}">${status}</span></div>
            <div class="device-sensor"><strong>Sensor:</strong> ${sensorInfo.sensor_type}</div>
            <div class="device-update"><strong>Latest Update:</strong> ${lastUpdate}</div>
          `;
        }
      } else {
        // Fallback to basic info
        const sensorData = realTimeSensorData[sensorType];
        const status = sensorData && sensorData.status === 'online' ? 'online' : 'offline';
        const lastUpdate = sensorData && sensorData.status === 'online' ? 'Real-time' : 'No data';
        
        if (isFoodSelected) {
          // Show detailed info when food is selected
          infoBar.innerHTML = `
            <div class="device-id-display"><strong>Device ID:</strong> ${deviceId}</div>
            <div class="device-status"><strong>Status:</strong> <span class="${status === 'online' ? 'status-online' : 'status-offline'}">${status}</span></div>
            <div class="device-sensor"><strong>Sensor:</strong> ${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}</div>
            <div class="device-update"><strong>Last Update:</strong> ${lastUpdate}</div>
          `;
        } else {
          // Show simplified format when no food is selected
          infoBar.innerHTML = `
            <div class="device-id-display"><strong>Device:</strong> ${deviceId}</div>
            <div class="device-status"><strong>Status:</strong> <span class="${status === 'online' ? 'status-online' : 'status-offline'}">${status}</span></div>
            <div class="device-sensor"><strong>Sensor:</strong> ${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}</div>
            <div class="device-update"><strong>Latest Update:</strong> ${lastUpdate}</div>
          `;
        }
      }
      
      infoBar.classList.remove('info-bar-highlight-offline');
      infoBar.classList.add('info-bar-highlight-online');
    }
  }

  clearInfoBar() {
    const infoBar = document.querySelector('.device-info');
    if (infoBar) {
      infoBar.innerHTML = '';
      infoBar.classList.remove('info-bar-highlight-online', 'info-bar-highlight-offline');
    }
  }

  async updateSensorCardsForFood(foodId) {
    const cards = document.querySelectorAll('.sensor-card');
    if (!foodId) {
      // No food selected: show real-time data
      this.updateSensorCardsWithRealData();
      return;
    }

    try {
      // Fetch sensor data for the specific food item
      
      // Get session token from localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        console.error('No session token found - redirecting to login');
        window.location.href = '../pages/Login.php';
        return;
      }
      
      const response = await fetch(`../../backend/api/sensor-data.php?action=get_food_sensors&food_id=${foodId}`, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication required - user not logged in');
          // Redirect to login or show login prompt
          window.location.href = '../pages/Login.php';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Food sensor data response:', result);
      
      if (result.success && result.sensor_data) {
        // Update cards with food-specific sensor data
        registeredDevices.forEach(device => {
          const card = document.querySelector(`.sensor-card[data-device-id="${device.id}"][data-sensor-type="${device.sensorType}"]`);
          if (card) {
            const sensorType = device.sensorType;
            const sensorData = result.sensor_data.find(data => 
              data.sensor_type.toLowerCase() === sensorType
            );
            
            const valueDiv = card.querySelector('.sensor-value');
            if (sensorData && sensorData.value !== null) {
              if (valueDiv) valueDiv.textContent = `${sensorData.value}${sensorData.unit}`;
              const gauge = card.querySelector('.gauge');
              if (gauge && window.setGaugeValue) {
                window.setGaugeValue(gauge, sensorData.value, sensorData.unit);
              }
              card.classList.add('sensor-card-highlight-online');
            } else {
              if (valueDiv) valueDiv.textContent = 'N/A';
              const gauge = card.querySelector('.gauge');
              if (gauge && window.setGaugeValue) window.setGaugeValue(gauge, 0, '');
              card.classList.add('sensor-card-highlight-offline');
            }
          }
        });
      } else {
        // Fallback to real-time data if no food-specific data
        this.updateSensorCardsWithRealData();
      }
    } catch (error) {
      console.error('Error fetching food sensor data:', error);
      // Fallback to real-time data on error
      this.updateSensorCardsWithRealData();
    }
  }

  showAddDeviceModal() {
    // Use adminSensorTypes for allowed sensor types
    const sensorType = prompt('Enter sensor type (' + adminSensorTypes.join(', ') + '):');
    if (!sensorType || !adminSensorTypes.includes(sensorType)) return alert('Invalid sensor type.');
    const name = prompt('Enter device name:');
    if (!name) return;
    const id = prompt('Enter device ID:');
    if (!id) return;
    registeredDevices.push({ name, sensorType, id });
    this.renderRegisteredDevices();
  }

  getSensorIcon(sensorType) {
    const icons = {
      temperature: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14 14.76V3.5a2.5 2.5 0 0 1 5 0v11.26a4.5 4.5 0 1 1-5 0z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>',
      humidity: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2v20"/><path d="m2 12 10-10 10 10"/></svg>',
      gas: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'
    };
    return icons[sensorType] || '';
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dashboard-template')) {
    window.sensorDashboard = new SensorDashboard();
  }
});

// Export for use in other scripts
window.SensorDashboard = SensorDashboard;
