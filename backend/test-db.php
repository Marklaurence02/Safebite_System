<?php
header('Content-Type: application/json');

try {
    // Test basic PDO connection
    $pdo = new PDO('mysql:host=localhost;dbname=safebite;charset=utf8mb4', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful!',
        'user_count' => $result['count'],
        'pdo_mysql_loaded' => extension_loaded('pdo_mysql')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'pdo_mysql_loaded' => extension_loaded('pdo_mysql')
    ]);
}
?> 