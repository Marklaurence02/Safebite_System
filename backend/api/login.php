<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/**
 * Login API Endpoint
 * SafeBite Backend - User Authentication
 */

require_once '../config/database.php';
require_once '../config/auth.php';

// Set CORS headers
Auth::setCORSHeaders();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Auth::sendResponse(['error' => 'Method not allowed'], 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    Auth::sendResponse(['error' => 'Invalid JSON input'], 400);
}

// Validate required fields
if (!isset($input['email']) || !isset($input['password'])) {
    Auth::sendResponse(['error' => 'Email and password are required'], 400);
}

$email = Auth::sanitizeInput($input['email']);
$password = $input['password'];

// Validate email format
if (!Auth::validateEmail($email)) {
    Auth::sendResponse(['error' => 'Invalid email format'], 400);
}

// Validate password length
if (strlen($password) < 6) {
    Auth::sendResponse(['error' => 'Password must be at least 6 characters'], 400);
}

try {
    // Connect to database
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Auth::sendResponse(['error' => 'Database connection failed'], 500);
    }
    
    // Check if user exists
    $query = "SELECT user_id, first_name, last_name, username, email, password_hash, role, account_status 
              FROM users 
              WHERE email = ? AND account_status = 'active'";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        Auth::sendResponse(['error' => 'Invalid email or password'], 401);
    }
    
    // Verify password
    if (!Auth::verifyPassword($password, $user['password_hash'])) {
        Auth::sendResponse(['error' => 'Invalid email or password'], 401);
    }
    
    // Generate session token
    $sessionToken = Auth::generateSessionToken();
    $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
    
    // Create session
    $sessionQuery = "INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)";
    $sessionStmt = $db->prepare($sessionQuery);
    $sessionStmt->execute([$user['user_id'], $sessionToken, $expiresAt]);
    
    // Log successful login
    Auth::logActivity($user['user_id'], 'User logged in successfully', $db);
    
    // Prepare response data
    $response = [
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'user_id' => $user['user_id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'full_name' => $user['first_name'] . ' ' . $user['last_name']
        ],
        'session' => [
            'token' => $sessionToken,
            'expires_at' => $expiresAt
        ]
    ];
    
    Auth::sendResponse($response, 200);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    Auth::sendResponse(['error' => 'Internal server error'], 500);
}
?> 