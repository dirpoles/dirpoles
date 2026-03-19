<?php
require_once 'app/Config/config.php';

try {
    $conn = new PDO("mysql:host=". DB_HOST .";dbname=". DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "ALTER TABLE repuestos_vehiculos ADD COLUMN stock_minimo INT DEFAULT 5 AFTER cantidad";
    $conn->exec($sql);
    echo "Migration successful: Column stock_minimo added to repuestos_vehiculos.";
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column already exists.";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
