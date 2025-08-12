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
    
    // Find session first
    $query = "SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW()";
    $stmt = $db->prepare($query);
    $stmt->execute([$token]);
    $session = $stmt->fetch();
    
    if ($session) {
        $userId = $session['user_id'];
        
        // Log logout activity FIRST (before deleting session)
        try {
            Auth::logActivity($userId, 'User logged out', $db);
            error_log("Logout activity logged successfully for user ID: $userId");
        } catch (Exception $e) {
            error_log("Failed to log logout activity: " . $e->getMessage());
            // Continue with logout even if logging fails
        }
        
        // Delete session AFTER logging
        try {
            $deleteQuery = "DELETE FROM sessions WHERE session_token = ?";
            $deleteStmt = $db->prepare($deleteQuery);
            $deleteStmt->execute([$token]);
            error_log("Session deleted successfully for user ID: $userId");
        } catch (Exception $e) {
            error_log("Failed to delete session: " . $e->getMessage());
            // Continue even if session deletion fails
        }
    } else {
        error_log("No valid session found for logout token");
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