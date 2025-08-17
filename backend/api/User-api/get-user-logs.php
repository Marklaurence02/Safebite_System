<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Include database configuration
require_once '../../config/database.php';

// Function to get current user ID and username from session token
function getCurrentUser($pdo) {
    // Check Authorization header for session token
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
            
            $stmt = $pdo->prepare("
                SELECT s.user_id, u.username 
                FROM sessions s
                JOIN users u ON s.user_id = u.user_id
                WHERE s.session_token = ? AND s.expires_at > NOW()
                ORDER BY s.created_at DESC 
                LIMIT 1
            ");
            $stmt->execute([$token]);
            $session = $stmt->fetch();
            
            if ($session) {
                return [
                    'user_id' => $session['user_id'],
                    'username' => $session['username']
                ];
            }
        }
    }
    
    // Fallback: check if session is started and has user_id
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (isset($_SESSION['user_id'])) {
        // Get username from users table
        $stmt = $pdo->prepare("SELECT username FROM users WHERE user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if ($user) {
            return [
                'user_id' => $_SESSION['user_id'],
                'username' => $user['username']
            ];
        }
    }
    
    return null;
}

try {
    // Get current authenticated user ID
    $database = new Database();
    $pdo = $database->getConnection();
    
    $currentUser = getCurrentUser($pdo);
    
    if (!$currentUser) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }

    // Get pagination and filter parameters
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 25; // Max 100 per page
    $offset = ($page - 1) * $limit;
    
    // Get filter parameters
    $actionType = isset($_GET['action_type']) ? $_GET['action_type'] : '';
    $startDate = isset($_GET['start_date']) ? $_GET['start_date'] : '';
    $endDate = isset($_GET['end_date']) ? $_GET['end_date'] : '';
    
    // Build the WHERE clause
    $whereConditions = ["user_id = :user_id"];
    $params = [':user_id' => $currentUser['user_id']];
    
    // Add action type filter
    if ($actionType && $actionType !== 'all') {
        switch ($actionType) {
            case 'add':
                $whereConditions[] = "(action LIKE '%add%' OR action LIKE '%created%')";
                break;
            case 'edit':
                $whereConditions[] = "(action LIKE '%edit%' OR action LIKE '%updated%')";
                break;
            case 'update':
                $whereConditions[] = "(action LIKE '%update%' OR action LIKE '%changed%')";
                break;
            case 'delete':
                $whereConditions[] = "(action LIKE '%delete%' OR action LIKE '%deleted%')";
                break;
            case 'login':
                $whereConditions[] = "(action LIKE '%login%' OR action LIKE '%logged in%' OR action LIKE '%logged in successfully%')";
                break;
            case 'logout':
                $whereConditions[] = "(action LIKE '%logout%' OR action LIKE '%logged out%' OR action LIKE '%logged out successfully%')";
                break;
            default:
                $whereConditions[] = "action LIKE :action_type";
                $params[':action_type'] = "%$actionType%";
                break;
        }
    }
    
    // Add date range filters
    if ($startDate) {
        $whereConditions[] = "DATE(timestamp) >= :start_date";
        $params[':start_date'] = $startDate;
    }
    
    if ($endDate) {
        $whereConditions[] = "DATE(timestamp) <= :end_date";
        $params[':end_date'] = $endDate;
    }
    
    $whereClause = implode(' AND ', $whereConditions);
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total FROM activity_logs WHERE $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalCount = $countStmt->fetch()['total'];
    
    // Get paginated results
    $sql = "SELECT log_id, user_id, action, timestamp 
            FROM activity_logs 
            WHERE $whereClause
            ORDER BY timestamp DESC 
            LIMIT :limit OFFSET :offset";

    $stmt = $pdo->prepare($sql);
    
    // Bind parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate pagination info
    $totalPages = ceil($totalCount / $limit);
    $hasNextPage = $page < $totalPages;
    $hasPrevPage = $page > 1;
    
    // Format the data for frontend consumption
    $formattedLogs = [];
    foreach ($logs as $log) {
        $formattedLogs[] = [
            'log_id' => $log['log_id'],
            'user_id' => $log['user_id'],
            'username' => $currentUser['username'], // Use current user's username
            'action' => $log['action'],
            'timestamp' => $log['timestamp']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $formattedLogs,
        'user_info' => [
            'user_id' => $currentUser['user_id'],
            'username' => $currentUser['username']
        ],
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_records' => $totalCount,
            'records_per_page' => $limit,
            'has_next_page' => $hasNextPage,
            'has_prev_page' => $hasPrevPage,
            'next_page' => $hasNextPage ? $page + 1 : null,
            'prev_page' => $hasPrevPage ? $page - 1 : null
        ],
        'filters' => [
            'action_type' => $actionType,
            'start_date' => $startDate,
            'end_date' => $endDate
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
