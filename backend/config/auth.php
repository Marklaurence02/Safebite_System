<?php
/**
 * Authentication Configuration
 * SafeBite Backend - Authentication Helpers
 */

class Auth {
    
    /**
     * Hash password using bcrypt
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }
    
    /**
     * Verify password against hash
     */
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    /**
     * Generate secure session token
     */
    public static function generateSessionToken() {
        return bin2hex(random_bytes(32));
    }
    
    /**
     * Generate OTP for password reset
     */
    public static function generateOTP() {
        return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    }
    
    /**
     * Sanitize input data
     */
    public static function sanitizeInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
    
    /**
     * Validate email format
     */
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
    
    /**
     * Set CORS headers for API
     */
    public static function setCORSHeaders() {
        // Allow all origins for development
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Credentials: true");
        header("Content-Type: application/json; charset=UTF-8");
        
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
    
    /**
     * Send JSON response
     */
    public static function sendResponse($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit();
    }
    
    /**
     * Log user activity
     */
    public static function logActivity($userId, $action, $db) {
        try {
            $query = "INSERT INTO activity_logs (user_id, action) VALUES (?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute([$userId, $action]);
        } catch (Exception $e) {
            // Log error silently
            error_log("Activity log error: " . $e->getMessage());
        }
    }
}
?> 