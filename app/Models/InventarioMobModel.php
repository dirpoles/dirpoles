<?php

namespace App\Models;

use App\Models\BusinessModel;
use PDO;
use Throwable;
use Exception;


class InventarioMobModel extends BusinessModel
{
    private $atributos = [];

    public function __set($nombre, $valor)
    {
        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre)
    {
        return $this->atributos[$nombre];
    }

    public function manejarAccion($action)
    {
        switch ($action) {
            case 'obtener_TiposMobiliarios':
                return $this->obtenerTiposMobiliario();

            case 'obtener_TiposEquipos':
                return $this->obtenerTiposEquipos();

            case 'obtener_servicios':
                return $this->obtenerServicios();

            case 'registrarMobiliario':
                return $this->registrarMobiliario();

            case 'registrarEquipo':
                return $this->registrarEquipo();

            case 'obtener_mobiliarios_json':
                return $this->mobiliariosJson();

            case 'obtener_historial_json':
                return $this->historialJson();

            case 'obtener_equipos_json':
                return $this->equiposJson();

            case 'obtener_fichas_tecnicas_json':
                return $this->obtener_fichas_tecnicas_json();

            default:
                throw new Exception('Acción no permitida');
        }
    }

    private function obtenerTiposMobiliario()
    {
        try {
            $query = "SELECT * FROM tipo_mobiliario WHERE estatus = 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error en obtenerTiposMobiliario: " . $e->getMessage());
            throw new Exception('Error al obtener tipos de mobiliario: ' . $e->getMessage());
        }
    }

    private function obtenerTiposEquipos()
    {
        try {
            $query = "SELECT * FROM tipo_equipo WHERE estatus = 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error en obtenerTiposEquipos: " . $e->getMessage());
            throw new Exception('Error al obtener tipos de equipos: ' . $e->getMessage());
        }
    }

    private function obtenerServicios()
    {
        try {
            $query = "SELECT id_servicios, nombre_serv FROM servicio WHERE estatus = 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error al obtener los servicios:" . $e->getMessage());
            throw new Exception('Error al obtener servicios: ' . $e->getMessage());
        }
    }

    private function registrarMobiliario()
    {
        $id_empleado = $_SESSION['id_empleado'];
        try {
            $this->conn->beginTransaction();

            $query1 = "INSERT INTO mobiliario (id_tipo_mobiliario, id_servicios, marca, modelo, color, estado, cantidad, fecha_adquisicion, descripcion_adicional, observaciones) VALUES (:id_tipo_mobiliario, :id_servicios, :marca, :modelo, :color, :estado, :cantidad, :fecha_adquisicion, :descripcion, :observaciones)";
            $stmt = $this->conn->prepare($query1);
            $stmt->bindValue(':id_tipo_mobiliario', $this->__get('id_tipo_mobiliario'), PDO::PARAM_INT);
            $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt->bindValue(':marca', $this->__get('marca'), PDO::PARAM_STR);
            $stmt->bindValue(':modelo', $this->__get('modelo'), PDO::PARAM_STR);
            $stmt->bindValue(':color', $this->__get('color'), PDO::PARAM_STR);
            $stmt->bindValue(':estado', $this->__get('estado'), PDO::PARAM_STR);
            $stmt->bindValue(':cantidad', $this->__get('cantidad'), PDO::PARAM_INT);
            $stmt->bindValue(':fecha_adquisicion', $this->__get('fecha_adquisicion'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt->execute();
            $id_mobiliario = $this->conn->lastInsertId();

            $query2 = "INSERT INTO historial_inventario (id_empleado, tipo_item, id_item, tipo_movimiento, id_ficha, id_servicio_nuevo, descripcion, fecha_movimiento) VALUES (:id_empleado, :tipo_item, :id_item, :tipo_movimiento, null, :id_servicio_nuevo, :descripcion, :fecha_movimiento)";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt2->bindValue(':tipo_item', 'mobiliario', PDO::PARAM_STR);
            $stmt2->bindValue(':id_item', $id_mobiliario, PDO::PARAM_INT);
            $stmt2->bindValue(':tipo_movimiento', 'asignacion', PDO::PARAM_STR);
            $stmt2->bindValue(':id_servicio_nuevo', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt2->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt2->bindValue(':fecha_movimiento', $this->__get('fecha_adquisicion'), PDO::PARAM_STR);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => "Mobiliario registrado exitosamente"
            ];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error en registrarMobiliario: " . $e->getMessage());
            throw new Exception('Error al registrar mobiliario: ' . $e->getMessage());
        }
    }

    private function registrarEquipo()
    {
        $id_empleado = $_SESSION['id_empleado'];
        try {
            $this->conn->beginTransaction();

            $query1 = "INSERT INTO equipos (id_tipo_equipo, id_servicios, marca, modelo, serial, color, estado, fecha_adquisicion, descripcion, observaciones) VALUES (:id_tipo_equipo, :id_servicios, :marca, :modelo, :serial, :color, :estado, :fecha_adquisicion, :descripcion, :observaciones)";
            $stmt = $this->conn->prepare($query1);
            $stmt->bindValue(':id_tipo_equipo', $this->__get('id_tipo_equipo'), PDO::PARAM_INT);
            $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt->bindValue(':marca', $this->__get('marca'), PDO::PARAM_STR);
            $stmt->bindValue(':modelo', $this->__get('modelo'), PDO::PARAM_STR);
            $stmt->bindValue(':serial', $this->__get('serial'), PDO::PARAM_STR);
            $stmt->bindValue(':color', $this->__get('color'), PDO::PARAM_STR);
            $stmt->bindValue(':estado', $this->__get('estado'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_adquisicion', $this->__get('fecha_adquisicion'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt->execute();
            $id_equipo = $this->conn->lastInsertId();

            $query2 = "INSERT INTO historial_inventario (id_empleado, tipo_item, id_item, tipo_movimiento, id_ficha, id_servicio_nuevo, descripcion, fecha_movimiento) VALUES (:id_empleado, :tipo_item, :id_item, :tipo_movimiento, null, :id_servicio_nuevo, :descripcion, :fecha_movimiento)";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt2->bindValue(':tipo_item', 'equipo', PDO::PARAM_STR);
            $stmt2->bindValue(':id_item', $id_equipo, PDO::PARAM_INT);
            $stmt2->bindValue(':tipo_movimiento', 'asignacion', PDO::PARAM_STR);
            $stmt2->bindValue(':id_servicio_nuevo', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt2->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt2->bindValue(':fecha_movimiento', $this->__get('fecha_adquisicion'), PDO::PARAM_STR);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => "Equipo registrado exitosamente"
            ];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error en registrarEquipo: " . $e->getMessage());
            throw new Exception('Error al registrar equipo: ' . $e->getMessage());
        }
    }

    private function mobiliariosJson()
    {
        try {
            $query = "SELECT m.id_mobiliario, 
            tm.nombre AS tipo_mobiliario, 
            s.nombre_serv AS ubicacion, 
            m.marca, 
            m.modelo, 
            m.color, 
            m.estado,
            m.estatus, 
            m.cantidad, 
            m.fecha_adquisicion, 
            m.descripcion_adicional, 
            m.observaciones 
            FROM mobiliario m 
            INNER JOIN tipo_mobiliario tm ON m.id_tipo_mobiliario = tm.id_tipo_mobiliario 
            INNER JOIN servicio s ON m.id_servicios = s.id_servicios
            ORDER BY m.id_mobiliario DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function historialJson()
    {
        try {
            $query = "SELECT 
                hi.id_historial, 
                CONCAT(emp.nombre, ' ', emp.apellido) AS responsable,
                hi.tipo_item,
                hi.id_item,
                hi.tipo_movimiento,
                hi.id_ficha,
                hi.id_servicio_anterior,
                hi.id_servicio_nuevo,
                sn.nombre_serv as servicio,
                hi.descripcion,
                hi.fecha_movimiento,
                CASE 
                    WHEN hi.tipo_item = 'mobiliario' THEN tm.nombre
                    WHEN hi.tipo_item = 'equipo' THEN te.nombre
                    ELSE 'Item desconocido'
                END AS nombre_insumo,
                CASE 
                    WHEN hi.tipo_item = 'mobiliario' THEN m.cantidad
                    ELSE 1
                END AS cantidad
            FROM historial_inventario hi 
            INNER JOIN dirpoles_security.empleado emp ON hi.id_empleado = emp.id_empleado
            LEFT JOIN servicio sn ON hi.id_servicio_nuevo = sn.id_servicios
            LEFT JOIN servicio sa ON hi.id_servicio_anterior = sa.id_servicios
            LEFT JOIN mobiliario m ON hi.tipo_item = 'mobiliario' AND hi.id_item = m.id_mobiliario
            LEFT JOIN tipo_mobiliario tm ON m.id_tipo_mobiliario = tm.id_tipo_mobiliario
            LEFT JOIN equipos eq ON hi.tipo_item = 'equipo' AND hi.id_item = eq.id_equipo
            LEFT JOIN tipo_equipo te ON eq.id_tipo_equipo = te.id_tipo_equipo
            ORDER BY hi.id_historial DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function equiposJson()
    {
        try {
            $query = "SELECT 
                eq.id_equipo,
                te.nombre as tipo_equipo,
                s.nombre_serv as servicio,
                eq.marca,
                eq.modelo,
                eq.serial,
                eq.color,
                eq.estado,
                eq.estatus,
                eq.fecha_adquisicion,
                eq.descripcion,
                eq.observaciones
            FROM equipos eq
            INNER JOIN tipo_equipo te ON eq.id_tipo_equipo = te.id_tipo_equipo
            INNER JOIN servicio s ON eq.id_servicios = s.id_servicios
            ORDER BY eq.id_equipo DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function obtener_fichas_tecnicas_json()
    {
        try {
            $query = "SELECT ft.*,
            CONCAT(emp.nombre, ' ', emp.apellido) AS responsable,
            s.nombre_serv as servicio
            FROM fichas_tecnicas ft
            INNER JOIN dirpoles_security.empleado emp ON ft.id_empleado_responsable = emp.id_empleado
            INNER JOIN servicio s ON ft.id_servicio = s.id_servicios
            ORDER BY ft.id_ficha DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }
}
