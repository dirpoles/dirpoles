<?php
namespace App\Models;

use App\Models\BusinessModel;
use Exception;
use PDO;
use Throwable;

class HorarioModel extends BusinessModel{
    private $atributos = [];

    public function __set($name, $value) {
        // Normalizar strings
        $value = \is_string($value) ? trim($value) : $value;

        // Validaciones específicas
        $validaciones = [
            'id_empleado' => fn($v) => is_numeric($v) && $v > 0,
            'dia_semana' => fn($v) => !empty($v) && preg_match('/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado)$/u', $v),
            'hora_inicio' => fn($v) => $this->validarHora($v, true),
            'hora_fin' => fn($v) => $this->validarHora($v, false),
        ];

        if (isset($validaciones[$name]) && !$validaciones[$name]($value)) {
            throw new \InvalidArgumentException("Valor inválido para $name");
        }

        $this->atributos[$name] = $value;
    }

    public function __get($name){
        return $this->atributos[$name];
    }

    public function manejarAccion($action){
        switch($action){
            case 'validarDiaHorario':
                return $this->validarDiaHorario();
                
            case 'registrar_horario':
                return $this->registrar_horario();

            case 'consultar_horarios':
                return $this->consultar_horarios();

            case 'horario_detalle_editar':
                return $this->horario_detalle_editar();

            case 'actualizar_horario':
                return $this->actualizar_horario();

            case 'obtener_empleado_horario':
                return $this->obtener_empleado_horario();

            case 'eliminar_horario':
                return $this->eliminar_horario();

            default:
                throw new Exception('Acción no permitida');
        }
    }

    private function validarDiaHorario() {
        try {
            $query = "SELECT 1 
                    FROM horario 
                    WHERE id_empleado = :id_empleado 
                        AND dia_semana = :dia_semana";

            // Si estamos editando, excluimos el mismo id_horario
            if ($this->__get('id_horario')) {
                $query .= " AND id_horario <> :id_horario";
            }

            $query .= " LIMIT 1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':dia_semana', $this->__get('dia_semana'), PDO::PARAM_STR);

            if ($this->__get('id_horario')) {
                $stmt->bindValue(':id_horario', $this->__get('id_horario'), PDO::PARAM_INT);
            }

            $stmt->execute();

            return $stmt->fetch() ? true : false;

        } catch(Throwable $e) {
            error_log("Error en validarDiaHorario: " . $e->getMessage());
            return false;
        }
    }

    private function validarHora($hora, $esInicio) {
        if (empty($hora)) return false;

        // Formato HH:MM
        if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $hora)) {
            return false;
        }

        // Convertir a minutos
        [$h, $m] = explode(':', $hora);
        $minutos = (int) $h * 60 + (int)$m;

        // Rango permitido: 07:00 (420) a 16:00 (960)
        if ($minutos < 420 || $minutos > 960) {
            return false;
        }

        return true;
    }

    private function registrar_horario(){
        try{
            if($this->validarDiaHorario()){
                throw new Exception('El horario ingresado ya se encuentra registrado');
            }

            $query = "INSERT INTO horario (id_empleado, dia_semana, hora_inicio, hora_fin) VALUES (:id_empleado, :dia_semana, :hora_inicio, :hora_fin)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':dia_semana', $this->__get('dia_semana'), PDO::PARAM_STR);
            $stmt->bindValue(':hora_inicio', $this->__get('hora_inicio'), PDO::PARAM_STR);
            $stmt->bindValue(':hora_fin', $this->__get('hora_fin'), PDO::PARAM_STR);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Horario registrado exitosamente'
            ];

        } catch (Throwable $e){
            error_log("". $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function consultar_horarios(){
        try {
            $query = "SELECT h.id_horario,
                            h.id_empleado,
                            e.nombre,
                            e.apellido,
                            CONCAT(e.nombre, ' ', e.apellido) AS nombre_completo,
                            e.tipo_cedula,
                            e.cedula,
                            CONCAT(e.tipo_cedula, '-', e.cedula) AS cedula_completa,
                            h.dia_semana,
                            h.hora_inicio,
                            h.hora_fin
                    FROM horario h
                    INNER JOIN dirpoles_security.empleado e 
                            ON h.id_empleado = e.id_empleado";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function horario_detalle_editar(){
        try {
            $query = "SELECT h.id_horario,
                            h.id_empleado,
                            e.nombre,
                            e.apellido,
                            CONCAT(e.nombre, ' ', e.apellido, ' (', e.tipo_cedula, '-', e.cedula, ')') AS nombre_completo,
                            h.dia_semana,
                            TIME_FORMAT(h.hora_inicio, '%H:%i') AS hora_inicio,
                            TIME_FORMAT(h.hora_fin, '%H:%i') AS hora_fin,
                            e.id_empleado
                    FROM horario h
                    INNER JOIN dirpoles_security.empleado e 
                            ON h.id_empleado = e.id_empleado
                    WHERE h.id_horario = :id_horario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_horario', $this->__get('id_horario'), PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function actualizar_horario(){
        try {
            $query = "UPDATE horario 
                    SET dia_semana = :dia_semana,
                        hora_inicio = :hora_inicio,
                        hora_fin = :hora_fin
                    WHERE id_horario = :id_horario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_horario', $this->__get('id_horario'), PDO::PARAM_INT);
            $stmt->bindValue(':dia_semana', $this->__get('dia_semana'), PDO::PARAM_STR);
            $stmt->bindValue(':hora_inicio', $this->__get('hora_inicio'), PDO::PARAM_STR);
            $stmt->bindValue(':hora_fin', $this->__get('hora_fin'), PDO::PARAM_STR);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Horario actualizado exitosamente'
            ];
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function obtener_empleado_horario(){
        try {
            $query = "SELECT nombre, apellido 
                    FROM dirpoles_security.empleado 
                    WHERE id_empleado = :id_empleado";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function eliminar_horario(){
        try{
            $query = "DELETE FROM horario WHERE id_horario = :id_horario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_horario', $this->__get('id_horario'), PDO::PARAM_INT);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Horario eliminado exitosamente'
            ];
        } catch (Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }
}