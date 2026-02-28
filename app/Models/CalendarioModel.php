<?php
namespace App\Models;
use App\Models\BusinessModel;
use Exception;
use PDO;
use Throwable;

class CalendarioModel extends BusinessModel{
    private $atributos = [];

    public function __set($nombre, $valor){
        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre){
        return $this->atributos[$nombre] ?? null;
    }

    public function manejarAccion($action){
        switch($action){
            case 'obtener':
                return $this->obtener();

            case 'agregar':
                return $this->agregar();

            case 'modificar':
                return $this->modificar();

            case 'eliminar':
                return $this->eliminar();
            default:
                throw new Exception('Acción no permitida');
        }
    }

    private function obtener(){
        try{
            $query = "SELECT * FROM eventos_calendario_personal WHERE id_empleado = :id_empleado";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(Throwable $e){
            throw new Exception($e->getMessage());
        }
    }

    private function agregar(){
        try{
            $query = "INSERT INTO eventos_calendario_personal (id_empleado, titulo, descripcion, fecha, fecha_creacion) 
                  VALUES (:id_empleado, :titulo, :descripcion, :fecha, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':titulo', $this->__get('titulo'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha', $this->__get('fecha'), PDO::PARAM_STR);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Evento agregado correctamente'
            ];

        } catch(Throwable $e){
            throw new Exception($e->getMessage());
        }
    }

    private function modificar() {
        try {
            $query = "UPDATE eventos_calendario_personal 
                    SET titulo = :titulo,
                        descripcion = :descripcion,
                        fecha = :fecha
                    WHERE id_evento = :id_evento 
                    AND id_empleado = :id_empleado";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_evento', $this->__get('id_evento'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':titulo', $this->__get('titulo'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha', $this->__get('fecha'), PDO::PARAM_STR);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Evento actualizado correctamente'
            ];
        } catch(Throwable $e) {
            throw new Exception($e->getMessage());
        }
    }

    private function eliminar() {
        try {
            $query = "DELETE FROM eventos_calendario_personal 
                    WHERE id_evento = :id_evento 
                    AND id_empleado = :id_empleado";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_evento', $this->__get('id_evento'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Evento eliminado correctamente'
            ];
        } catch(Throwable $e) {
            throw new Exception($e->getMessage());
        }
    }
}