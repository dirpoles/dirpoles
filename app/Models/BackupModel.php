<?php
namespace App\Models;
use App\Core\Database;
use PDO;
use Exception;
use Throwable;

class BackupModel extends Database {
    public function __construct() {
        $this->Business();
        $this->Security();
    }

    public function manejarAccion($accion) {
        switch ($accion) {
            case 'backup_business':
                return $this->generarBackup($this->conn, DB_NAME);
            case 'backup_security':
                return $this->generarBackup($this->conn_security, DB_SECURITY_NAME);
            default:
                throw new Exception("Acción no válida en BackupModel");
        }
    }

    private function generarBackup(PDO $pdo, string $dbName): string {
        $pdo->exec("SET NAMES 'utf8mb4'");

        $tables = [];
        $stmt = $pdo->query("SHOW TABLES");
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $tables[] = $row[0];
        }

        $sql = "-- ======================================================\n";
        $sql .= "-- Respaldo de la base de datos: `" . $dbName . "`\n";
        $sql .= "-- Generado el: " . date('Y-m-d H:i:s') . "\n";
        $sql .= "-- ======================================================\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

        foreach ($tables as $table) {
            // Estructura de la tabla
            $stmtCreate = $pdo->query("SHOW CREATE TABLE `" . $table . "`");
            $rowCreate = $stmtCreate->fetch(PDO::FETCH_NUM);
            
            $sql .= "-- ------------------------------------------------------\n";
            $sql .= "-- Estructura de tabla para la tabla `" . $table . "`\n";
            $sql .= "-- ------------------------------------------------------\n\n";
            $sql .= "DROP TABLE IF EXISTS `" . $table . "`;\n";
            $sql .= $rowCreate[1] . ";\n\n";

            // Datos de la tabla
            $stmtData = $pdo->query("SELECT * FROM `" . $table . "`");
            $columnCount = $stmtData->columnCount();

            $rowsWritten = 0;
            while ($row = $stmtData->fetch(PDO::FETCH_NUM)) {
                if ($rowsWritten === 0) {
                    $sql .= "--\n";
                    $sql .= "-- Volcado de datos para la tabla `" . $table . "`\n";
                    $sql .= "--\n\n";
                    $sql .= "INSERT INTO `" . $table . "` VALUES\n";
                } else {
                    $sql .= ",\n";
                }

                $values = [];
                for ($i = 0; $i < $columnCount; $i++) {
                    if ($row[$i] === null) {
                        $values[] = "NULL";
                    } else {
                        $values[] = $pdo->quote($row[$i]);
                    }
                }
                $sql .= "(" . implode(", ", $values) . ")";
                $rowsWritten++;
            }

            if ($rowsWritten > 0) {
                $sql .= ";\n\n";
            }
        }

        $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

        return $sql;
    }
}
