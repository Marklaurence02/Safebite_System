<?php
header('Content-Type: application/json');

// Include database configuration
require_once '../../config/database.php';

try {
    // Create database connection using the Database class
    $database = new Database();
    $pdo = $database->getConnection();
    
    // Query to get alerts grouped by user_id
    $stmt = $pdo->query("SELECT user_id, COUNT(*) AS alert_count FROM alerts GROUP BY user_id");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return the results as JSON
    echo json_encode($results);
    
} catch(Exception $e) {
    // Return error response
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
