<?php
/**
 * Cleanup Expired Sessions
 * This script removes all expired sessions from the database
 * Run this once to fix the authentication issue
 */

require_once 'config/database.php';

try {
    // Connect to database
    $database = new Database();
    $pdo = $database->getConnection();
    
    if (!$pdo) {
        die('Database connection failed');
    }
    
    // Count expired sessions
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM sessions WHERE expires_at <= NOW()");
    $countStmt->execute();
    $expiredCount = $countStmt->fetchColumn();
    
    echo "Found {$expiredCount} expired sessions\n";
    
    if ($expiredCount > 0) {
        // Delete expired sessions
        $deleteStmt = $pdo->prepare("DELETE FROM sessions WHERE expires_at <= NOW()");
        $deleteStmt->execute();
        
        $deletedCount = $deleteStmt->rowCount();
        echo "Deleted {$deletedCount} expired sessions\n";
        
        // Count remaining sessions
        $remainingStmt = $pdo->prepare("SELECT COUNT(*) FROM sessions");
        $remainingStmt->execute();
        $remainingCount = $remainingStmt->fetchColumn();
        
        echo "Remaining active sessions: {$remainingCount}\n";
    } else {
        echo "No expired sessions found\n";
    }
    
    echo "Cleanup completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
