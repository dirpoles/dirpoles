<?php
namespace App\Models;
use App\Models\SecurityModel;
use PDO;
use Throwable;
use InvalidArgumentException;
use DateTime;

class BitacoraModel extends SecurityModel {
    private $atributos = [];

    public function __set($nombre, $valor){
        switch ($nombre) {
            case 'id_empleado':
                if (!filter_var($valor, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])) {
                    throw new InvalidArgumentException("ID de empleado inválido. Debe ser un número entero positivo.");
                }
                break;

            case 'modulo':
                $exp_texto = '/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/u';
                if (!preg_match($exp_texto, $valor) || mb_strlen($valor) > 50) {
                    throw new InvalidArgumentException("Módulo inválido. Solo letras y espacios, máximo 50 caracteres.");
                }
                break;

            case 'accion':
                $acciones_validas = ['Registro', 'Lectura', 'Actualización', 'Eliminación', 'Inicio de sesión', 'Cierre de sesión'];
                if (!in_array($valor, $acciones_validas)) {
                    throw new InvalidArgumentException("Acción inválida. Debe ser una de: " . implode(', ', $acciones_validas));
                }
                break;

            case 'descripcion':
                if (empty($valor) || mb_strlen($valor) > 255) {
                    throw new InvalidArgumentException("Descripción inválida. No puede estar vacía y máximo 255 caracteres.");
                }
                break;

            case 'fecha':
                if (!preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $valor)) {
                    throw new InvalidArgumentException("Formato de fecha inválido. Use YYYY-MM-DD HH:MM:SS.");
                }
                $fechaObj = DateTime::createFromFormat('Y-m-d H:i:s', $valor);
                if (!$fechaObj) {
                    throw new InvalidArgumentException("Fecha inválida.");
                }
                break;

            default:
                //Si no es un campo definido, permitimos asignarlo sin validación
                break;
        }

        $this->atributos[$nombre] = $valor;
    }
    
    public function __get($atributo){
        return $this->atributos[$atributo] ?? null;
    }

    public function manejarAccion($action) {
        switch ($action) {
            case 'registrar_bitacora':
                return $this->registrar_bitacora();

            case 'consultar_bitacora':
                return $this->obtener_bitacora();
            
            default:
                return ['status' => false, 'mensaje' => 'Acción no implementada'];
        }
    }

    private function registrar_bitacora(){
        try {
            $query = "INSERT INTO bitacora 
                     (id_empleado, modulo, accion, descripcion, fecha) 
                     VALUES 
                     (:id_empleado, :modulo, :accion, :descripcion, NOW())";
            
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':modulo', $this->__get('modulo'), PDO::PARAM_STR);
            $stmt->bindValue(':accion', $this->__get('accion'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
    
            if ($stmt->execute()) {
                return ['exito' => true, 'mensaje' => 'Bitácora registrada'];
            } else {
                return ['exito' => false, 'mensaje' => 'Error al registrar'];
            }
        } catch (Throwable $e) {
            error_log("Error en bitácora: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error de base de datos'];
        }
    }

    private function obtener_bitacora() {
        try {
            $query = "
                SELECT 
                    b.id_bitacora,
                    CONCAT(e.nombre, ' ', e.apellido) AS empleado,
                    b.modulo,
                    b.accion,
                    b.descripcion,
                    b.fecha
                FROM 
                    bitacora b
                JOIN 
                    empleado e ON b.id_empleado = e.id_empleado
                ORDER BY 
                    b.fecha DESC
            ";

            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener la bitácora: ' . $e->getMessage()
            ];
        }
    }
}