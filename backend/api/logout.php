<?php
/**
 * Logout API Endpoint
 * SafeBite Backend - User Logout
 */

require_once '../config/database.php';
require_once '../config/auth.php';

// Set CORS headers
Auth::setCORSHeaders();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Auth::sendResponse(['error' => 'Method not allowed'], 405);
}

// Get authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    Auth::sendResponse(['error' => 'Authorization token required'], 401);
}

$token = $matches[1];

try {
    // Connect to database
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Auth::sendResponse(['error' => 'Database connection failed'], 500);
    }
    
    // Find and delete session
    $query = "SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW()";
    $stmt = $db->prepare($query);
    $stmt->execute([$token]);
    $session = $stmt->fetch();
    
    if ($session) {
        // Log logout activity
        Auth::logActivity($session['user_id'], 'User logged out', $db);
        
        // Delete session
        $deleteQuery = "DELETE FROM sessions WHERE session_token = ?";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->execute([$token]);
    }
    
    $response = [
        'success' => true,
        'message' => 'Logged out successfully'
    ];
    
    Auth::sendResponse($response, 200);
    
} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    Auth::sendResponse(['error' => 'Internal server error'], 500);
}
?> 