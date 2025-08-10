<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/**
 * Forgot Password API Endpoint
 * SafeBite Backend - Password Reset Request
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
if (!isset($input['email'])) {
    Auth::sendResponse(['error' => 'Email is required'], 400);
}

$email = Auth::sanitizeInput($input['email']);

// Validate email format
if (!Auth::validateEmail($email)) {
    Auth::sendResponse(['error' => 'Invalid email format'], 400);
}

try {
    // Connect to database
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Auth::sendResponse(['error' => 'Database connection failed'], 500);
    }
    
    // Check if user exists
    $query = "SELECT user_id, first_name, last_name, email FROM users WHERE email = ? AND account_status = 'active'";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        // Don't reveal if email exists or not for security
        Auth::sendResponse([
            'success' => true,
            'message' => 'If the email exists in our system, a password reset link has been sent.'
        ], 200);
    }
    
    // Generate OTP
    $otp = Auth::generateOTP();
    $otpExpiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));
    
    // Update user with OTP
    $updateQuery = "UPDATE users SET reset_otp = ?, otp_expiry = ? WHERE user_id = ?";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->execute([$otp, $otpExpiry, $user['user_id']]);
    
    // Log password reset request
    Auth::logActivity($user['user_id'], 'Password reset requested', $db);
    
    // In a real application, you would send an email here
    // For demo purposes, we'll just return the OTP in the response
    $response = [
        'success' => true,
        'message' => 'Password reset email sent successfully',
        'demo_otp' => $otp, // Remove this in production
        'user' => [
            'email' => $user['email'],
            'full_name' => $user['first_name'] . ' ' . $user['last_name']
        ]
    ];
    
    Auth::sendResponse($response, 200);
    
} catch (Exception $e) {
    error_log("Forgot password error: " . $e->getMessage());
    Auth::sendResponse(['error' => 'Internal server error'], 500);
}
?> 