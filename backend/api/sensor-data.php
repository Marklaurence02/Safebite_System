<?php
/**
 * Sensor Data API - Updated for proper authentication
 * 
 * This API now requires proper user authentication for all endpoints.
 * It uses the logged-in user's session instead of hardcoded user ID 11.
 * 
 * The main query structure follows the example:
 * SELECT 
 *     s.sensor_id,
 *     r.reading_id AS latest_data_id,
 *     r.value,
 *     r.unit,
 *     r.timestamp AS date_recorded,
 *     f.food_id,
 *     f.name AS food_name,
 *     f.category,
 *     f.expiration_date
 * FROM sensor s
 * LEFT JOIN readings r 
 *     ON r.sensor_id = s.sensor_id
 *     AND r.reading_id = (
 *         SELECT MAX(r2.reading_id)
 *         FROM readings r2
 *         WHERE r2.sensor_id = s.sensor_id
 *     )
 * LEFT JOIN food_items f
 *     ON s.sensor_id = f.sensor_id
 * WHERE s.user_id = ? (logged-in user ID)
 * LIMIT 0, 25;
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

try {
    // Use the Database class to get connection
    $database = new Database();
    $pdo = $database->getConnection();
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Function to get current user ID from session
function getCurrentUserId($pdo) {
    // Check if session is started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Check if user is logged in via session
    if (isset($_SESSION['user_id'])) {
        return $_SESSION['user_id'];
    }
    
    // Check if user is logged in via session token
    if (isset($_SESSION['session_token'])) {
        $stmt = $pdo->prepare("
            SELECT user_id FROM sessions 
            WHERE session_token = ? AND expires_at > NOW()
            ORDER BY created_at DESC 
            LIMIT 1
        ");
        $stmt->execute([$_SESSION['session_token']]);
        $session = $stmt->fetch();
        
        if ($session) {
            return $session['user_id'];
        }
    }
    
    // Check Authorization header for session token
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
            
            $stmt = $pdo->prepare("
                SELECT user_id FROM sessions 
                WHERE session_token = ? AND expires_at > NOW()
                ORDER BY created_at DESC 
                LIMIT 1
            ");
            $stmt->execute([$token]);
            $session = $stmt->fetch();
            
            if ($session) {
                return $session['user_id'];
            }
        }
    }
    
    // Return null if no valid session found - this will require proper authentication
    return null;
}

// Handle GET request to retrieve sensor data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $currentUserId = getCurrentUserId($pdo);
        
        // Check for specific actions
        $action = isset($_GET['action']) ? $_GET['action'] : '';
        
        switch ($action) {
            case 'get_sensors':
                // Check if user is authenticated
                if (!$currentUserId) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Authentication required']);
                    exit;
                }
                
                // Get all sensors for the current user
                $stmt = $pdo->prepare("
                    SELECT sensor_id, type, is_active, created_at
                    FROM sensor 
                    WHERE user_id = ? AND is_active = 1
                    ORDER BY type
                ");
                $stmt->execute([$currentUserId]);
                $sensors = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode([
                    'success' => true,
                    'sensors' => $sensors,
                    'user_id' => $currentUserId
                ]);
                break;
                
            case 'get_food_items':
                // Check if user is authenticated
                if (!$currentUserId) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Authentication required']);
                    exit;
                }
                
                // Get all food items for the current user
                try {
                    // Check if food_items table exists
                    $tableCheck = $pdo->query("SHOW TABLES LIKE 'food_items'");
                    if ($tableCheck->rowCount() > 0) {
                        $stmt = $pdo->prepare("
                            SELECT f.food_id, f.name, f.category, f.expiration_date, f.sensor_id, s.type as sensor_type
                            FROM food_items f
                            LEFT JOIN sensor s ON f.sensor_id = s.sensor_id
                            WHERE s.user_id = ? OR f.sensor_id IS NULL
                            ORDER BY f.name
                        ");
                        $stmt->execute([$currentUserId]);
                        $foodItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    } else {
                        // Table doesn't exist, return empty array
                        $foodItems = [];
                    }
                } catch (Exception $e) {
                    // Error checking table, return empty array
                    error_log("Error checking food_items table: " . $e->getMessage());
                    $foodItems = [];
                }
                
                echo json_encode([
                    'success' => true,
                    'food_items' => $foodItems,
                    'user_id' => $currentUserId
                ]);
                break;
                
            case 'get_food_sensors':
                // Check if user is authenticated
                if (!$currentUserId) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Authentication required']);
                    exit;
                }
                
                // Get sensor data for a specific food item
                $foodId = isset($_GET['food_id']) ? intval($_GET['food_id']) : 0;
                if (!$foodId) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Food ID is required']);
                    exit;
                }
                
                // Get the food item and its associated sensor
                $stmt = $pdo->prepare("
                    SELECT f.*, s.type as sensor_type, s.sensor_id
                    FROM food_items f
                    LEFT JOIN sensor s ON f.sensor_id = s.sensor_id
                    WHERE f.food_id = ? AND (s.user_id = ? OR f.sensor_id IS NULL)
                ");
                $stmt->execute([$foodId, $currentUserId]);
                $foodItem = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$foodItem) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Food item not found']);
                    exit;
                }
                
                // Get latest sensor readings for this food's sensor
                $sensorData = [];
                if ($foodItem['sensor_id']) {
                    $stmt = $pdo->prepare("
                        SELECT r.*, s.type as sensor_type
                        FROM readings r
                        JOIN sensor s ON r.sensor_id = s.sensor_id
                        WHERE r.sensor_id = ?
                        ORDER BY r.timestamp DESC
                        LIMIT 1
                    ");
                    $stmt->execute([$foodItem['sensor_id']]);
                    $reading = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    if ($reading) {
                        $sensorData[] = [
                            'sensor_type' => $reading['sensor_type'],
                            'value' => $reading['value'],
                            'unit' => $reading['unit'],
                            'timestamp' => $reading['timestamp']
                        ];
                    }
                }
                
                echo json_encode([
                    'success' => true,
                    'food_item' => $foodItem,
                    'sensor_data' => $sensorData,
                    'user_id' => $currentUserId
                ]);
                break;
                
            default:
                // Default action: get latest sensor readings with food items
                // Check if user is authenticated
                if (!$currentUserId) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Authentication required']);
                    exit;
                }
                
                // Debug: Log the current user ID
                error_log("Current User ID: " . $currentUserId);
                
                // Get latest readings with food items using the exact query structure from the example
                try {
                    // Check if food_items table exists
                    $tableCheck = $pdo->query("SHOW TABLES LIKE 'food_items'");
                    if ($tableCheck->rowCount() > 0) {
                        $stmt = $pdo->prepare("
                            SELECT 
                                s.sensor_id,
                                s.type as sensor_type,
                                r.reading_id AS latest_data_id,
                                r.value,
                                r.unit,
                                r.timestamp AS date_recorded,
                                f.food_id,
                                f.name AS food_name,
                                f.category,
                                f.expiration_date
                            FROM sensor s
                            LEFT JOIN readings r 
                                ON r.sensor_id = s.sensor_id
                                AND r.reading_id = (
                                    SELECT MAX(r2.reading_id)
                                    FROM readings r2
                                    WHERE r2.sensor_id = s.sensor_id
                                )
                            LEFT JOIN food_items f
                                ON s.sensor_id = f.sensor_id
                            WHERE s.user_id = ?
                            LIMIT 0, 25
                        ");
                    } else {
                        // Table doesn't exist, use query without food_items
                        $stmt = $pdo->prepare("
                            SELECT 
                                s.sensor_id,
                                s.type as sensor_type,
                                r.reading_id AS latest_data_id,
                                r.value,
                                r.unit,
                                r.timestamp AS date_recorded,
                                NULL as food_id,
                                NULL as food_name,
                                NULL as category,
                                NULL as expiration_date
                            FROM sensor s
                            LEFT JOIN readings r 
                                ON r.sensor_id = s.sensor_id
                                AND r.reading_id = (
                                    SELECT MAX(r2.reading_id)
                                    FROM readings r2
                                    WHERE r2.sensor_id = s.sensor_id
                                )
                            WHERE s.user_id = ?
                            LIMIT 0, 25
                        ");
                    }
                } catch (Exception $e) {
                    // Error checking table, use query without food_items
                    error_log("Error checking food_items table: " . $e->getMessage());
                    $stmt = $pdo->prepare("
                        SELECT 
                            s.sensor_id,
                            s.type as sensor_type,
                            r.reading_id AS latest_data_id,
                            r.value,
                            r.unit,
                            r.timestamp AS date_recorded,
                            NULL as food_id,
                            NULL as food_name,
                            NULL as category,
                            NULL as expiration_date
                        FROM sensor s
                        LEFT JOIN readings r 
                            ON r.sensor_id = s.sensor_id
                            AND r.reading_id = (
                                SELECT MAX(r2.reading_id)
                                FROM readings r2
                                WHERE r2.sensor_id = s.sensor_id
                            )
                        WHERE s.user_id = ?
                        LIMIT 0, 25
                    ");
                }
                $stmt->execute([$currentUserId]);
                $sensorData = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Debug: Log the data count
                error_log("Sensor count for user " . $currentUserId . ": " . count($sensorData));
                
                // Transform the data to match the frontend expectations
                $transformedData = [];
                $sensorReadings = [
                    'temperature' => null,
                    'humidity' => null,
                    'gas' => null
                ];
                
                foreach ($sensorData as $sensor) {
                    if ($sensor['latest_data_id'] && $sensor['value'] !== null) {
                        // Calculate if sensor is online (data within last 5 minutes)
                        $lastReadingTime = strtotime($sensor['date_recorded']);
                        $currentTime = time();
                        $timeDiff = $currentTime - $lastReadingTime;
                        $isOnline = ($timeDiff <= 300); // 5 minutes = 300 seconds
                        
                        // Create meaningful device identifier instead of fake ARDUINO_ ID
                        $deviceId = 'SENSOR_' . strtoupper($sensor['sensor_type']) . '_' . $sensor['sensor_id'];
                        
                        // Add to transformed data for detailed view
                        $transformedData[] = [
                            'id' => $sensor['latest_data_id'],
                            'sensor_id' => $sensor['sensor_id'],
                            'sensor_type' => $sensor['sensor_type'],
                            'value' => $sensor['value'],
                            'unit' => $sensor['unit'],
                            'timestamp' => $sensor['date_recorded'],
                            'device_id' => $deviceId,
                            'device_name' => ucfirst($sensor['sensor_type']) . ' Sensor #' . $sensor['sensor_id'],
                            'status' => $isOnline ? 'online' : 'offline',
                            'last_update' => $isOnline ? 'Real-time' : date('M j, Y g:i A', $lastReadingTime),
                            'food_id' => $sensor['food_id'],
                            'food_name' => $sensor['food_name'],
                            'food_category' => $sensor['category'],
                            'expiration_date' => $sensor['expiration_date']
                        ];
                        
                        // Update sensor readings for real-time display
                        $sensorType = strtolower($sensor['sensor_type']);
                        if (isset($sensorReadings[$sensorType])) {
                            $sensorReadings[$sensorType] = [
                                'value' => $sensor['value'],
                                'unit' => $sensor['unit'],
                                'timestamp' => $sensor['date_recorded'],
                                'status' => $isOnline ? 'online' : 'offline'
                            ];
                        }
                    }
                }
                
                echo json_encode([
                    'success' => true,
                    'data' => $transformedData,
                    'sensor_readings' => $sensorReadings,
                    'user_id' => $currentUserId,
                    'debug' => [
                        'user_id' => $currentUserId,
                        'sensor_count' => count($sensorData),
                        'reading_count' => count($transformedData),
                        'session_data' => isset($_SESSION) ? array_keys($_SESSION) : 'no session'
                    ]
                ]);
                break;
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve sensor data: ' . $e->getMessage()]);
    }
    exit;
}

// Handle POST request to receive sensor data from Arduino
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from GET parameters (Arduino sends via GET)
    $temperature = isset($_GET['temp']) ? floatval($_GET['temp']) : null;
    $humidity = isset($_GET['hum']) ? floatval($_GET['hum']) : null;
    $gas = isset($_GET['gas']) ? intval($_GET['gas']) : null;
    
    // Validate data
    if ($temperature === null && $humidity === null && $gas === null) {
        http_response_code(400);
        echo json_encode(['error' => 'No sensor data provided']);
        exit;
    }
    
    try {
        // Get current user ID
        $currentUserId = getCurrentUserId($pdo);
        
        // Check if user is authenticated
        if (!$currentUserId) {
            http_response_code(401);
            echo json_encode(['error' => 'Authentication required']);
            exit;
        }
        
        // Check if Arduino sensors exist, if not create them
        $sensorTypes = [];
        if ($temperature !== null) $sensorTypes[] = 'Temperature';
        if ($humidity !== null) $sensorTypes[] = 'Humidity';
        if ($gas !== null) $sensorTypes[] = 'Gas';
        
        foreach ($sensorTypes as $type) {
            // First check if user already has this sensor type
            $stmt = $pdo->prepare("
                SELECT sensor_id FROM sensor 
                WHERE type = ? AND user_id = ?
                LIMIT 1
            ");
            $stmt->execute([$type, $currentUserId]);
            $existingSensor = $stmt->fetch();
            
            if (!$existingSensor) {
                // Create new Arduino sensor for current user
                $stmt = $pdo->prepare("
                    INSERT INTO sensor (type, user_id, is_active) 
                    VALUES (?, ?, 1)
                ");
                $stmt->execute([$type, $currentUserId]);
                $sensorId = $pdo->lastInsertId();
            } else {
                $sensorId = $existingSensor['sensor_id'];
            }
            
            // Insert reading based on sensor type
            $value = null;
            $unit = '';
            
            switch ($type) {
                case 'Temperature':
                    $value = $temperature;
                    $unit = '°C';
                    break;
                case 'Humidity':
                    $value = $humidity;
                    $unit = '%';
                    break;
                case 'Gas':
                    $value = $gas;
                    $unit = 'ppm';
                    break;
            }
            
            if ($value !== null) {
                $stmt = $pdo->prepare("
                    INSERT INTO readings (sensor_id, value, unit) 
                    VALUES (?, ?, ?)
                ");
                $stmt->execute([$sensorId, $value, $unit]);
            }
        }
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Sensor data received and stored',
            'data' => [
                'temperature' => $temperature,
                'humidity' => $humidity,
                'gas_level' => $gas,
                'timestamp' => date('Y-m-d H:i:s'),
                'user_id' => $currentUserId
            ]
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to store sensor data: ' . $e->getMessage()]);
    }
    exit;
}

// Handle unsupported methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
