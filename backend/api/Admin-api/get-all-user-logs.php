<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
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
    // Get current authenticated admin user ID
    $database = new Database();
    $pdo = $database->getConnection();
    
    $currentAdmin = getCurrentAdmin($pdo);
    
    if (!$currentAdmin) {
        http_response_code(401);
        echo json_encode(['error' => 'Admin authentication required']);
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
    $userFilter = isset($_GET['user_filter']) ? $_GET['user_filter'] : ''; // Filter by specific user
    
    // Build the WHERE clause for user logs (excluding admins)
    $whereConditions = ["u.role != 'admin'"]; // Exclude admin users
    $params = [];
    
    // Add action type filter
    if ($actionType && $actionType !== 'all') {
        switch ($actionType) {
            case 'add':
                $whereConditions[] = "(al.action LIKE '%add%' OR al.action LIKE '%created%')";
                break;
            case 'edit':
                $whereConditions[] = "(al.action LIKE '%edit%' OR al.action LIKE '%updated%')";
                break;
            case 'update':
                $whereConditions[] = "(al.action LIKE '%update%' OR al.action LIKE '%changed%')";
                break;
            case 'delete':
                $whereConditions[] = "(al.action LIKE '%delete%' OR al.action LIKE '%deleted%')";
                break;
            case 'login':
                $whereConditions[] = "(al.action LIKE '%login%' OR al.action LIKE '%logged in%' OR al.action LIKE '%logged in successfully%')";
                break;
            case 'logout':
                $whereConditions[] = "(al.action LIKE '%logout%' OR al.action LIKE '%logged out%' OR al.action LIKE '%logged out successfully%')";
                break;
            default:
                $whereConditions[] = "al.action LIKE :action_type";
                $params[':action_type'] = "%$actionType%";
                break;
        }
    }
    
    // Add date range filters
    if ($startDate) {
        $whereConditions[] = "DATE(al.timestamp) >= :start_date";
        $params[':start_date'] = $startDate;
    }
    
    if ($endDate) {
        $whereConditions[] = "DATE(al.timestamp) <= :end_date";
        $params[':end_date'] = $endDate;
    }
    
    // Filter by specific user if provided
    if ($userFilter) {
        $whereConditions[] = "u.username LIKE :user_filter";
        $params[':user_filter'] = "%$userFilter%";
    }
    
    $whereClause = implode(' AND ', $whereConditions);
    
    // Get total count for pagination - join with users table to get user info and exclude admins
    $countSql = "
        SELECT COUNT(*) as total 
        FROM activity_logs al
        JOIN users u ON al.user_id = u.user_id
        WHERE $whereClause
    ";
    $countStmt = $pdo->prepare($countSql);
    
    // Bind parameters for count query
    foreach ($params as $key => $value) {
        $countStmt->bindValue($key, $value);
    }
    
    $countStmt->execute();
    $totalCount = $countStmt->fetch()['total'];
    
    // Get paginated results with user usernames (excluding admins)
    $sql = "
        SELECT al.log_id, al.user_id, al.action, al.timestamp, u.username, u.role
        FROM activity_logs al
        JOIN users u ON al.user_id = u.user_id
        WHERE $whereClause
        ORDER BY al.timestamp DESC 
        LIMIT :limit OFFSET :offset
    ";

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
            'username' => $log['username'],
            'role' => $log['role'],
            'action' => $log['action'],
            'timestamp' => $log['timestamp']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $formattedLogs,
        'admin_info' => [
            'user_id' => $currentAdmin['user_id'],
            'username' => $currentAdmin['username'],
            'role' => $currentAdmin['role']
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
            'end_date' => $endDate,
            'user_filter' => $userFilter
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
