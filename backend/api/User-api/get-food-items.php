<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

function getCurrentUser($pdo) {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
            $stmt = $pdo->prepare("SELECT s.user_id FROM sessions s JOIN users u ON s.user_id=u.user_id WHERE s.session_token=? AND s.expires_at>NOW() ORDER BY s.created_at DESC LIMIT 1");
            $stmt->execute([$token]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) return (int)$row['user_id'];
        }
    }
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (isset($_SESSION['user_id'])) return (int)$_SESSION['user_id'];
    return null;
}

try {
    $db = new Database();
    $pdo = $db->getConnection();

    $userId = getCurrentUser($pdo);
    if (!$userId) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }

    // Optional: search param for client-side filtering
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    $sql = "SELECT DISTINCT f.food_id AS id, f.name AS name, COALESCE(f.category,'') AS category
            FROM food_items f
            JOIN sensor s ON f.sensor_id = s.sensor_id
            WHERE s.user_id = :uid" . ($search !== '' ? " AND f.name LIKE :search" : "") . "
            ORDER BY f.name";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':uid', $userId, PDO::PARAM_INT);
    if ($search !== '') $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'items' => array_map(function($r){ return ['id' => (int)$r['id'], 'name' => $r['name'], 'category' => $r['category']]; }, $items)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>


