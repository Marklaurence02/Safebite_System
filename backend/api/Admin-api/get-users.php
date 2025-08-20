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
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $role = isset($_GET['role']) ? $_GET['role'] : '';
    $status = isset($_GET['status']) ? $_GET['status'] : '';
    $dateStart = isset($_GET['date_start']) ? $_GET['date_start'] : '';
    $dateEnd = isset($_GET['date_end']) ? $_GET['date_end'] : '';
    
    // Build the WHERE clause for users
    $whereConditions = ["role != 'Admin'"]; // Exclude admin users
    $params = [];
    
    // Add search filter
    if ($search) {
        $whereConditions[] = "(CONCAT(first_name, ' ', last_name) LIKE :search OR email LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    // Add role filter
    if ($role) {
        $whereConditions[] = "role = :role";
        $params[':role'] = $role;
    }
    
    // Add status filter
    if ($status) {
        $whereConditions[] = "account_status = :status";
        $params[':status'] = $status;
    }
    
    // Add date range filters
    if ($dateStart) {
        $whereConditions[] = "DATE(created_at) >= :date_start";
        $params[':date_start'] = $dateStart;
    }
    
    if ($dateEnd) {
        $whereConditions[] = "DATE(created_at) <= :date_end";
        $params[':date_end'] = $dateEnd;
    }
    
    $whereClause = implode(' AND ', $whereConditions);
    
    // Get total count for pagination
    $countSql = "
        SELECT COUNT(*) as total 
        FROM users 
        WHERE $whereClause
    ";
    $countStmt = $pdo->prepare($countSql);
    
    // Bind parameters for count query
    foreach ($params as $key => $value) {
        $countStmt->bindValue($key, $value);
    }
    
    $countStmt->execute();
    $totalCount = $countStmt->fetch()['total'];
    
    // Get paginated results
    $sql = "
        SELECT 
            user_id,
            CONCAT(first_name, ' ', last_name) AS Name,
            email AS Email,
            created_at AS `Date Created`,
            account_status AS Status,
            role
        FROM users 
        WHERE $whereClause
        ORDER BY created_at DESC 
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
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate pagination info
    $totalPages = ceil($totalCount / $limit);
    $hasNextPage = $page < $totalPages;
    $hasPrevPage = $page > 1;
    
    // Format the data for frontend consumption
    $formattedUsers = [];
    foreach ($users as $user) {
        $formattedUsers[] = [
            'user_id' => $user['user_id'],
            'name' => $user['Name'],
            'email' => $user['Email'],
            'date_created' => $user['Date Created'],
            'status' => $user['Status'],
            'role' => $user['role']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $formattedUsers,
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
            'search' => $search,
            'role' => $role,
            'status' => $status,
            'date_start' => $dateStart,
            'date_end' => $dateEnd
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
