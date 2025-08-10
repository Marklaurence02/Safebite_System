<?php
header('Content-Type: application/json');

$response = [
    'php_version' => phpversion(),
    'php_ini_path' => php_ini_loaded_file(),
    'pdo_loaded' => extension_loaded('pdo'),
    'pdo_mysql_loaded' => extension_loaded('pdo_mysql'),
    'available_pdo_drivers' => PDO::getAvailableDrivers(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'
];

echo json_encode($response, JSON_PRETTY_PRINT);
?> 