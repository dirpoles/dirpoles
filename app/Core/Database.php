<?php
namespace App\Core;
use PDO;
use Throwable;

require_once 'app/Config/config.php';

abstract class Database {
    protected $conn;
    protected $conn_security;

    final protected function Business() {
        if ($this->conn === null) {
            try {
                $this->conn = new PDO("mysql:host=". DB_HOST .";dbname=". DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn->exec("SET NAMES 'utf8mb4'");
            } catch (Throwable $e) {
                throw new \Exception("Error BD Negocio: " . $e->getMessage());
            }
        }
    }

    final protected function Security() {
        if ($this->conn_security === null) {
            try {
                $this->conn_security = new PDO("mysql:host=". DB_HOST .";dbname=". DB_SECURITY_NAME . ";charset=utf8mb4", DB_SECURITY_USER, DB_SECURITY_PASS);
                $this->conn_security->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn_security->exec("SET NAMES 'utf8mb4'");
            } catch (Throwable $e) {
                throw new \Exception("Error BD Seguridad: " . $e->getMessage());
            }
        }
    }
}