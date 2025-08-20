<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

// Resolve current authenticated user (mirrors other User-api endpoints)
function getCurrentUser($pdo) {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);

            $stmt = $pdo->prepare("
                SELECT s.user_id
                FROM sessions s
                JOIN users u ON s.user_id = u.user_id
                WHERE s.session_token = ? AND s.expires_at > NOW()
                ORDER BY s.created_at DESC
                LIMIT 1
            ");
            $stmt->execute([$token]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($session) {
                return (int)$session['user_id'];
            }
        }
    }

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (isset($_SESSION['user_id'])) {
        return (int)$_SESSION['user_id'];
    }

    return null;
}

try {
    $database = new Database();
    $pdo = $database->getConnection();

    $userId = getCurrentUser($pdo);
    if (!$userId) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }

    // Return distinct food categories for the current user based on their sensors/food items
    $sql = "
        SELECT DISTINCT COALESCE(f.category, 'Uncategorized') AS category
        FROM food_items f
        JOIN sensor s ON f.sensor_id = s.sensor_id
        WHERE s.user_id = :user_id
        ORDER BY category
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $types = array_values(array_filter(array_map(function($r) {
        return isset($r['category']) ? trim((string)$r['category']) : '';
    }, $rows), function($c) { return $c !== ''; }));

    echo json_encode([
        'success' => true,
        'types' => $types,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>


