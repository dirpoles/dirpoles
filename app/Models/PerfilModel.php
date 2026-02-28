<?php
namespace App\Models;
use App\Models\SecurityModel;
use Exception;
use PDO;
use Throwable;

class PerfilModel extends SecurityModel{
    private $atributos = [];

    public function __set($nombre, $valor){
        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre){
        return $this->atributos[$nombre];
    }

    public function manejarAccion($action){
        switch($action){
            case 'consultar_perfil':
                return $this->consultarPerfil();
            case 'actualizar_perfil':
                return $this->actualizarPerfil();
            case 'validar_contrasena_actual':
                return $this->validarContrasenaActual();
            default:
                throw new Exception('Acción no permitida');
        }
    }

    /**
     * Consultar perfil del empleado
     */
    private function consultarPerfil(){
        try {
            $query = "SELECT 
                id_empleado, 
                nombre, 
                apellido, 
                CONCAT(tipo_cedula, '-', cedula) as cedula_completa,
                direccion,
                id_tipo_empleado,
                tp.tipo,
                correo, 
                CASE 
                    WHEN e.estatus = 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END as estatus,
                telefono
            FROM empleado e
            INNER JOIN tipo_empleado tp ON e.id_tipo_empleado = tp.id_tipo_emp
            WHERE e.id_empleado = :id_empleado AND e.estatus = 1 LIMIT 1";

            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(":id_empleado", $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (Throwable $th) {
            throw $th;
        }
    }

    /**
     * Actualizar perfil del empleado
     */
    private function actualizarPerfil(){
        try {
            $this->conn_security->beginTransaction();

            $sql = "UPDATE empleado SET 
                    nombre = :nombre, 
                    apellido = :apellido, 
                    correo = :correo, 
                    telefono = :telefono,
                    direccion = :direccion";
            
            // Si hay contraseña nueva, la agregamos al update
            if(!empty($this->__get('contrasena'))){
                $sql .= ", contrasena = :contrasena";
            }

            $sql .= " WHERE id_empleado = :id_empleado";

            $stmt = $this->conn_security->prepare($sql);
            
            $stmt->bindValue(":nombre", $this->__get('nombre'), PDO::PARAM_STR);
            $stmt->bindValue(":apellido", $this->__get('apellido'), PDO::PARAM_STR);
            $stmt->bindValue(":correo", $this->__get('correo'), PDO::PARAM_STR);
            $stmt->bindValue(":telefono", $this->__get('telefono'), PDO::PARAM_STR);
            $stmt->bindValue(":direccion", $this->__get('direccion'), PDO::PARAM_STR);
            $stmt->bindValue(":id_empleado", $this->__get('id_empleado'), PDO::PARAM_INT);

            if(!empty($this->__get('contrasena'))){
                $password_hash = password_hash($this->__get('contrasena'), PASSWORD_BCRYPT);
                $stmt->bindValue(":contrasena", $password_hash, PDO::PARAM_STR);
            }

            $stmt->execute();

            $this->conn_security->commit();
            return true;

        } catch (Throwable $th) {
            $this->conn_security->rollBack();
            throw $th;
        }
    }

    /**
     * Validar contraseña actual del empleado
     */
    private function validarContrasenaActual(){
        $password = $this->__get('clave_actual');
        try {
            $query = "SELECT clave FROM empleado WHERE id_empleado = :id_empleado";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(":id_empleado", $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if($result && password_verify($password, $result['clave'])){
                return true;
            }
            return false;
        } catch (Throwable $th) {
            throw $th;
        }
    }
}