<?php
header('Content-Type: application/json');

// Include database configuration
require_once '../../config/database.php';

try {
    // Create database connection using the Database class
    $database = new Database();
    $pdo = $database->getConnection();
    
    // Query to get active users count
    $stmt = $pdo->query("SELECT COUNT(*) AS active_user_count FROM users WHERE account_status = 'active'");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Return the count as JSON
    echo json_encode(['active_user_count' => (int)$result['active_user_count']]);
    
} catch(Exception $e) {
    // Return error response
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
