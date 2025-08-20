<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
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
    // Only allow POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
    
    // Get current authenticated admin user ID
    $database = new Database();
    $pdo = $database->getConnection();
    
    $currentAdmin = getCurrentAdmin($pdo);
    
    if (!$currentAdmin) {
        http_response_code(401);
        echo json_encode(['error' => 'Admin authentication required']);
        exit;
    }
    
    // Get the password from request body
    $input = json_decode(file_get_contents('php://input'), true);
    $password = isset($input['password']) ? $input['password'] : '';
    
    if (empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Password is required']);
        exit;
    }
    
    // Get the admin user's actual password hash from database
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE user_id = ? AND role = 'admin'");
    $stmt->execute([$currentAdmin['user_id']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Admin user not found']);
        exit;
    }
    
    // Verify the password using the password_hash column
    $isValid = password_verify($password, $user['password_hash']);
    
    if ($isValid) {
        echo json_encode([
            'success' => true,
            'message' => 'Password verified successfully',
            'admin_info' => [
                'user_id' => $currentAdmin['user_id'],
                'username' => $currentAdmin['username'],
                'role' => $currentAdmin['role']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid password'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
