<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/**
 * Registration API Endpoint
 * SafeBite Backend - User Registration
 */

require_once '../config/database.php';
require_once '../config/auth.php';
require_once '../config/recaptcha.php';

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
if (!isset($input['first_name']) || !isset($input['last_name']) || 
    !isset($input['username']) || !isset($input['email']) || 
    !isset($input['password']) || !isset($input['confirm_password']) ||
    !isset($input['recaptcha_token'])) {
    Auth::sendResponse(['error' => 'All fields are required'], 400);
}

$firstName = Auth::sanitizeInput($input['first_name']);
$lastName = Auth::sanitizeInput($input['last_name']);
$username = Auth::sanitizeInput($input['username']);
$email = Auth::sanitizeInput($input['email']);
$password = $input['password'];
$confirmPassword = $input['confirm_password'];
$contactNumber = isset($input['contact_number']) ? Auth::sanitizeInput($input['contact_number']) : null;
$recaptchaToken = trim($input['recaptcha_token']);

// Verify reCAPTCHA
$secret = getenv('RECAPTCHA_SECRET');
if (!$secret && isset($RECAPTCHA_SECRET) && $RECAPTCHA_SECRET) {
    $secret = $RECAPTCHA_SECRET;
}
if (!$secret) {
    Auth::sendResponse(['error' => 'reCAPTCHA is not configured'], 500);
}

$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
$ch = curl_init($verifyUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'secret' => $secret,
    'response' => $recaptchaToken,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? null
]));
$verifyResp = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$cerr = curl_error($ch);
curl_close($ch);

if ($verifyResp === false) {
    Auth::sendResponse(['error' => 'reCAPTCHA verification failed: ' . $cerr], 500);
}
$verifyJson = json_decode($verifyResp, true);
if ($http >= 400 || !$verifyJson || empty($verifyJson['success'])) {
    Auth::sendResponse(['error' => 'reCAPTCHA verification failed'], 400);
}

// Validate input lengths
if (strlen($firstName) < 2 || strlen($lastName) < 2) {
    Auth::sendResponse(['error' => 'First name and last name must be at least 2 characters'], 400);
}

if (strlen($username) < 3) {
    Auth::sendResponse(['error' => 'Username must be at least 3 characters'], 400);
}

// Validate email format
if (!Auth::validateEmail($email)) {
    Auth::sendResponse(['error' => 'Invalid email format'], 400);
}

// Validate password
if (strlen($password) < 6) {
    Auth::sendResponse(['error' => 'Password must be at least 6 characters'], 400);
}

if ($password !== $confirmPassword) {
    Auth::sendResponse(['error' => 'Passwords do not match'], 400);
}

try {
    // Connect to database
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Auth::sendResponse(['error' => 'Database connection failed'], 500);
    }
    
    // Check if email already exists
    $emailQuery = "SELECT user_id FROM users WHERE email = ?";
    $emailStmt = $db->prepare($emailQuery);
    $emailStmt->execute([$email]);
    
    if ($emailStmt->fetch()) {
        Auth::sendResponse(['error' => 'Email already registered'], 409);
    }
    
    // Check if username already exists
    $usernameQuery = "SELECT user_id FROM users WHERE username = ?";
    $usernameStmt = $db->prepare($usernameQuery);
    $usernameStmt->execute([$username]);
    
    if ($usernameStmt->fetch()) {
        Auth::sendResponse(['error' => 'Username already taken'], 409);
    }
    
    // Hash password
    $passwordHash = Auth::hashPassword($password);
    
    // Insert new user
    $insertQuery = "INSERT INTO users (first_name, last_name, username, email, contact_number, password_hash, role, account_status) 
                    VALUES (?, ?, ?, ?, ?, ?, 'User', 'active')";
    
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->execute([
        $firstName,
        $lastName,
        $username,
        $email,
        $contactNumber,
        $passwordHash
    ]);
    
    $userId = $db->lastInsertId();
    
    // Log successful registration
    Auth::logActivity($userId, 'User registered successfully', $db);
    
    // Prepare response data
    $response = [
        'success' => true,
        'message' => 'Account created successfully',
        'user' => [
            'user_id' => $userId,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'username' => $username,
            'email' => $email,
            'role' => 'User',
            'full_name' => $firstName . ' ' . $lastName
        ]
    ];
    
    Auth::sendResponse($response, 201);
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    Auth::sendResponse(['error' => 'Internal server error'], 500);
}
?> 