<?php
/**
 * Database Configuration
 * SafeBite Backend - Database Connection
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'safebite';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function getConnection() {
        $this->conn = null;

        // Check if PDO MySQL driver is available
        if (!extension_loaded('pdo_mysql')) {
            throw new Exception("PDO MySQL driver is not installed. Please enable it in your PHP configuration.");
        }

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                )
            );
        } catch(PDOException $exception) {
            throw new Exception("Connection error: " . $exception->getMessage());
        }

        return $this->conn;
    }
}
?> 