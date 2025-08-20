<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Include database configuration
require_once '../../config/database.php';

// Function to get current admin user ID and username from session token
function getCurrentAdmin($pdo) {
    // Check Authorization header for session token
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
            
            $stmt = $pdo->prepare("
                SELECT s.user_id, u.username, u.role
                FROM sessions s
                JOIN users u ON s.user_id = u.user_id
                WHERE s.session_token = ? AND s.expires_at > NOW() AND u.role = 'admin'
                ORDER BY s.created_at DESC 
                LIMIT 1
            ");
            $stmt->execute([$token]);
            $session = $stmt->fetch();
            
            if ($session) {
                return [
                    'user_id' => $session['user_id'],
                    'username' => $session['username'],
                    'role' => $session['role']
                ];
            }
        }
    }
    
    // Fallback: check if session is started and has user_id
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (isset($_SESSION['user_id'])) {
        // Get username and role from users table
        $stmt = $pdo->prepare("SELECT username, role FROM users WHERE user_id = ? AND role = 'admin'");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if ($user) {
            return [
                'user_id' => $_SESSION['user_id'],
                'username' => $user['username'],
                'role' => $user['role']
            ];
        }
    }
    
    return null;
}

try {
    // Get current authenticated admin user ID
    $database = new Database();
    $pdo = $database->getConnection();
    
    $currentAdmin = getCurrentAdmin($pdo);
    
    if (!$currentAdmin) {
        http_response_code(401);
        echo json_encode(['error' => 'Admin authentication required']);
        exit;
    }

    // Get the user ID to fetch details for
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }
    
    // Get full user details including password hash (no password column exists)
    $sql = "
        SELECT 
            user_id,
            first_name,
            last_name,
            username,
            email,
            password_hash,
            account_status,
            created_at
        FROM users 
        WHERE user_id = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }
    
    // Format the data for frontend consumption
    $formattedUser = [
        'user_id' => $user['user_id'],
        'name' => $user['first_name'] . ' ' . $user['last_name'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'username' => $user['username'],
        'email' => $user['email'],
        'password_hash' => $user['password_hash'],
        'status' => $user['account_status'],
        'date_created' => $user['created_at']
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $formattedUser,
        'admin_info' => [
            'user_id' => $currentAdmin['user_id'],
            'username' => $currentAdmin['username'],
            'role' => $currentAdmin['role']
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
