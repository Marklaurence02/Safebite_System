<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$host = "localhost";        // Database server
$dbname = "safebite";       // Your database name
$username = "root";         // Default XAMPP user
$password = "";             // Default password for root is empty

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Enable error mode
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

// Handle GET request to retrieve sensor data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Create sensor_data table if it doesn't exist
        $conn->exec("
            CREATE TABLE IF NOT EXISTS sensor_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                temperature DECIMAL(5,2) NULL,
                humidity DECIMAL(5,2) NULL,
                gas_value INT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Get latest sensor data
        $stmt = $conn->prepare("
            SELECT * FROM sensor_data 
            ORDER BY timestamp DESC 
            LIMIT 100
        ");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Transform data to match expected format
        $transformedData = [];
        foreach ($data as $row) {
            $transformedData[] = [
                'id' => $row['id'],
                'temperature' => $row['temperature'],
                'humidity' => $row['humidity'],
                'gas_level' => $row['gas_value'],
                'timestamp' => $row['timestamp'],
                'device_id' => 'ARDUINO_001',
                'sensor_type' => 'Arduino',
                'unit' => 'mixed'
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $transformedData
        ]);
        
    } catch(PDOException $e) {
        echo json_encode(['error' => 'Failed to retrieve sensor data: ' . $e->getMessage()]);
    }
    exit;
}

// Handle POST request to receive sensor data from Arduino
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Now handle the data from Arduino
    $temp = $_GET['temp'] ?? null;
    $hum  = $_GET['hum'] ?? null;
    $gas  = $_GET['gas'] ?? null;

    if ($temp && $hum && $gas) {
        try {
            // Create sensor_data table if it doesn't exist
            $conn->exec("
                CREATE TABLE IF NOT EXISTS sensor_data (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    temperature DECIMAL(5,2) NULL,
                    humidity DECIMAL(5,2) NULL,
                    gas_value INT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ");
            
            $stmt = $conn->prepare("INSERT INTO sensor_data (temperature, humidity, gas_value) VALUES (?, ?, ?)");
            $stmt->execute([$temp, $hum, $gas]);
            
            echo json_encode([
                "success" => true,
                "message" => "Sensor data received and stored",
                "data" => [
                    "temperature" => $temp,
                    "humidity" => $hum,
                    "gas_value" => $gas,
                    "timestamp" => date('Y-m-d H:i:s')
                ]
            ]);
        } catch(PDOException $e) {
            echo json_encode(["error" => "Failed to store data: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["error" => "Missing data"]);
    }
    exit;
}

// Handle unsupported methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
