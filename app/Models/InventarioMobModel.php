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

            case 'obtener_empleados':
                return $this->obtenerEmpleados();

            case 'obtener_estadisticas':
                return $this->obtenerEstadisticasInventario();

            case 'mobiliario_detalle':
                return $this->mobiliarioDetalle();

            case 'mobiliario_detalle_editar':
                return $this->mobiliarioDetalleEditar();

            case 'mobiliario_actualizar':
                return $this->mobiliarioActualizar();

            case 'mobiliario_eliminar':
                return $this->mobiliarioEliminar();

            case 'equipo_detalle':
                return $this->equipoDetalle();

            case 'equipo_detalle_editar':
                return $this->equipoDetalleEditar();

            case 'equipo_actualizar':
                return $this->equipoActualizar();

            case 'equipo_eliminar':
                return $this->equipoEliminar();

            case 'registrarFichaTecnica':
                return $this->registrarFichaTecnica();

            case 'ficha_detalle':
                return $this->fichaDetalle();

            case 'fichas_estadisticas':
                return $this->fichasTecnicasEstadisticas();

            case 'ficha_detalle_editar':
                return $this->fichaDetalleEditar();

            case 'ficha_actualizar':
                return $this->fichaActualizar();

            case 'ficha_eliminar':
                return $this->fichaEliminar();

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

    private function obtenerEmpleados()
    {
        try {
            $query = "SELECT id_empleado, CONCAT(nombre, ' ', IFNULL(apellido, '')) AS nombre_completo FROM dirpoles_security.empleado WHERE estatus = 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error al obtener empleados: " . $e->getMessage());
            throw new Exception('Error al obtener empleados: ' . $e->getMessage());
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

    private function registrarFichaTecnica()
    {
        try {
            $query = "INSERT INTO fichas_tecnicas (nombre_ficha, id_servicio, id_empleado_responsable, descripcion, fecha_creacion, estatus)
                      VALUES (:nombre_ficha, :id_servicio, :id_empleado_responsable, :descripcion, :fecha_creacion, 1)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_ficha', $this->__get('nombre_ficha'), PDO::PARAM_STR);
            $stmt->bindValue(':id_servicio', $this->__get('id_servicio'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado_responsable', $this->__get('id_empleado_responsable'), PDO::PARAM_INT);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_creacion', $this->__get('fecha_creacion'), PDO::PARAM_STR);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Ficha técnica registrada exitosamente'
            ];
        } catch (Throwable $e) {
            error_log("Error en registrarFichaTecnica: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error al registrar la ficha técnica: ' . $e->getMessage()];
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

    private function fichasTecnicasEstadisticas()
    {
        try {
            $sql = "SELECT COUNT(*) FROM fichas_tecnicas WHERE estatus = 1";
            return $this->conn->query($sql)->fetchColumn();
        } catch (Throwable $e) {
            return 0;
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

    private function obtenerEstadisticasInventario()
    {
        try {
            // 1. Total de mobiliarios (suma de cantidades)
            $sqlMob = "SELECT IFNULL(SUM(cantidad), 0) FROM mobiliario WHERE estatus = 1";
            $total_mobiliarios = $this->conn->query($sqlMob)->fetchColumn();

            // 2. Total de equipos
            $sqlEq = "SELECT COUNT(*) FROM equipos WHERE estatus = 1";
            $total_equipos = $this->conn->query($sqlEq)->fetchColumn();

            // 3. Empleados con Ficha Técnica (responsables únicos)
            $sqlFichas = "SELECT COUNT(DISTINCT id_empleado_responsable) FROM fichas_tecnicas";
            $fichas_tecnicas = $this->conn->query($sqlFichas)->fetchColumn();

            // 4. Inventario agregado este mes (mobiliario + equipos)
            $sqlMes = "SELECT 
                (SELECT IFNULL(SUM(cantidad), 0) FROM mobiliario WHERE MONTH(fecha_adquisicion) = MONTH(CURRENT_DATE()) AND YEAR(fecha_adquisicion) = YEAR(CURRENT_DATE())) + 
                (SELECT COUNT(*) FROM equipos WHERE MONTH(fecha_adquisicion) = MONTH(CURRENT_DATE()) AND YEAR(fecha_adquisicion) = YEAR(CURRENT_DATE()))";
            $inventario_mes = $this->conn->query($sqlMes)->fetchColumn();

            return [
                'total_mobiliarios' => $total_mobiliarios,
                'total_equipos' => $total_equipos,
                'fichas_tecnicas' => $fichas_tecnicas,
                'inventario_mes' => $inventario_mes
            ];
        } catch (Throwable $e) {
            error_log("Error en obtenerEstadisticasInventario: " . $e->getMessage());
            return [
                'total_mobiliarios' => 0,
                'total_equipos' => 0,
                'fichas_tecnicas' => 0,
                'inventario_mes' => 0
            ];
        }
    }

    private function mobiliarioDetalle()
    {
        try {
            $query = "SELECT m.*, tm.nombre AS tipo_mobiliario, s.nombre_serv AS ubicacion
                      FROM mobiliario m
                      INNER JOIN tipo_mobiliario tm ON m.id_tipo_mobiliario = tm.id_tipo_mobiliario
                      INNER JOIN servicio s ON m.id_servicios = s.id_servicios
                      WHERE m.id_mobiliario = :id_mobiliario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_mobiliario', $this->__get('id_mobiliario'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error en mobiliarioDetalle: " . $e->getMessage());
            return null;
        }
    }

    private function mobiliarioDetalleEditar()
    {
        try {
            $query = "SELECT m.*, tm.nombre AS tipo_mobiliario, s.nombre_serv AS ubicacion
                      FROM mobiliario m
                      INNER JOIN tipo_mobiliario tm ON m.id_tipo_mobiliario = tm.id_tipo_mobiliario
                      INNER JOIN servicio s ON m.id_servicios = s.id_servicios
                      WHERE m.id_mobiliario = :id_mobiliario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_mobiliario', $this->__get('id_mobiliario'), PDO::PARAM_INT);
            $stmt->execute();
            $mobiliario = $stmt->fetch(PDO::FETCH_ASSOC);

            // Obtener tipos de mobiliario y servicios para los selects
            $tipos = $this->obtenerTiposMobiliario();
            $servicios = $this->obtenerServicios();

            return [
                'mobiliario' => $mobiliario,
                'tipos_mobiliario' => $tipos,
                'servicios' => $servicios
            ];
        } catch (Throwable $e) {
            error_log("Error en mobiliarioDetalleEditar: " . $e->getMessage());
            return null;
        }
    }

    private function mobiliarioActualizar()
    {
        try {
            $this->conn->beginTransaction();

            $id_mobiliario = $this->__get('id_mobiliario');

            // Verificar que el registro exista
            $checkQuery = "SELECT COUNT(*) FROM mobiliario WHERE id_mobiliario = :id_mobiliario";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindValue(':id_mobiliario', $id_mobiliario, PDO::PARAM_INT);
            $checkStmt->execute();

            if ($checkStmt->fetchColumn() == 0) {
                $this->conn->rollBack();
                return ['exito' => false, 'mensaje' => 'El mobiliario no existe'];
            }

            $query = "UPDATE mobiliario SET
                id_tipo_mobiliario = :id_tipo_mobiliario,
                id_servicios = :id_servicios,
                marca = :marca,
                modelo = :modelo,
                color = :color,
                estado = :estado,
                cantidad = :cantidad,
                fecha_adquisicion = :fecha_adquisicion,
                descripcion_adicional = :descripcion,
                observaciones = :observaciones
            WHERE id_mobiliario = :id_mobiliario";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_mobiliario', $id_mobiliario, PDO::PARAM_INT);
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

            $this->conn->commit();
            return ['exito' => true, 'mensaje' => 'Mobiliario actualizado exitosamente'];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error en mobiliarioActualizar: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error al actualizar el mobiliario: ' . $e->getMessage()];
        }
    }

    private function mobiliarioEliminar()
    {
        try {
            $id_mobiliario = $this->__get('id_mobiliario');

            // Verificar que no tenga fichas técnicas asociadas
            $checkQuery = "SELECT COUNT(*) FROM detalle_ficha_mobiliario WHERE id_mobiliario = :id_mobiliario";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindValue(':id_mobiliario', $id_mobiliario, PDO::PARAM_INT);
            $checkStmt->execute();

            if ($checkStmt->fetchColumn() > 0) {
                return ['exito' => false, 'mensaje' => 'No se puede eliminar: el mobiliario tiene fichas técnicas asociadas'];
            }

            // Verificar que no esté en inventario_mob (stock)
            $checkQuery2 = "SELECT COUNT(*) FROM inventario_mob WHERE id_mobiliario = :id_mobiliario";
            $checkStmt2 = $this->conn->prepare($checkQuery2);
            $checkStmt2->bindValue(':id_mobiliario', $id_mobiliario, PDO::PARAM_INT);
            $checkStmt2->execute();

            if ($checkStmt2->fetchColumn() > 0) {
                return ['exito' => false, 'mensaje' => 'No se puede eliminar: el mobiliario tiene registros de inventario'];
            }

            $query = "DELETE FROM mobiliario WHERE id_mobiliario = :id_mobiliario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_mobiliario', $id_mobiliario, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ['exito' => true, 'mensaje' => 'Mobiliario eliminado exitosamente'];
            } else {
                return ['exito' => false, 'mensaje' => 'No se pudo eliminar el mobiliario'];
            }
        } catch (Throwable $e) {
            error_log("Error en mobiliarioEliminar: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error al eliminar el mobiliario: ' . $e->getMessage()];
        }
    }

    private function equipoDetalle()
    {
        try {
            $query = "SELECT e.*, te.nombre AS tipo_equipo, s.nombre_serv AS ubicacion
                      FROM equipos e
                      INNER JOIN tipo_equipo te ON e.id_tipo_equipo = te.id_tipo_equipo
                      INNER JOIN servicio s ON e.id_servicios = s.id_servicios
                      WHERE e.id_equipo = :id_equipo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_equipo', $this->__get('id_equipo'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error en equipoDetalle: " . $e->getMessage());
            return null;
        }
    }

    private function equipoDetalleEditar()
    {
        try {
            $query = "SELECT e.*, te.nombre AS tipo_equipo, s.nombre_serv AS ubicacion
                      FROM equipos e
                      INNER JOIN tipo_equipo te ON e.id_tipo_equipo = te.id_tipo_equipo
                      INNER JOIN servicio s ON e.id_servicios = s.id_servicios
                      WHERE e.id_equipo = :id_equipo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_equipo', $this->__get('id_equipo'), PDO::PARAM_INT);
            $stmt->execute();
            $equipo = $stmt->fetch(PDO::FETCH_ASSOC);

            $tipos = $this->obtenerTiposEquipos();
            $servicios = $this->obtenerServicios();

            return [
                'equipo' => $equipo,
                'tipos_equipo' => $tipos,
                'servicios' => $servicios
            ];
        } catch (Throwable $e) {
            error_log("Error en equipoDetalleEditar: " . $e->getMessage());
            return null;
        }
    }

    private function equipoActualizar()
    {
        try {
            $this->conn->beginTransaction();

            $id_equipo = $this->__get('id_equipo');

            $checkQuery = "SELECT COUNT(*) FROM equipos WHERE id_equipo = :id_equipo";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindValue(':id_equipo', $id_equipo, PDO::PARAM_INT);
            $checkStmt->execute();

            if ($checkStmt->fetchColumn() == 0) {
                $this->conn->rollBack();
                return ['exito' => false, 'mensaje' => 'El equipo no existe'];
            }

            $query = "UPDATE equipos SET
                id_tipo_equipo = :id_tipo_equipo,
                id_servicios = :id_servicios,
                marca = :marca,
                modelo = :modelo,
                serial = :serial,
                color = :color,
                estado = :estado,
                fecha_adquisicion = :fecha_adquisicion,
                descripcion = :descripcion,
                observaciones = :observaciones
            WHERE id_equipo = :id_equipo";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_equipo', $id_equipo, PDO::PARAM_INT);
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

            $this->conn->commit();
            return ['exito' => true, 'mensaje' => 'Equipo actualizado exitosamente'];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error en equipoActualizar: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error al actualizar el equipo: ' . $e->getMessage()];
        }
    }

    private function equipoEliminar()
    {
        try {
            $id_equipo = $this->__get('id_equipo');

            // Verificar que no tenga fichas técnicas asociadas
            $checkQuery = "SELECT COUNT(*) FROM detalle_ficha_equipo WHERE id_equipo = :id_equipo";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindValue(':id_equipo', $id_equipo, PDO::PARAM_INT);
            $checkStmt->execute();

            if ($checkStmt->fetchColumn() > 0) {
                return ['exito' => false, 'mensaje' => 'No se puede eliminar: el equipo tiene fichas técnicas asociadas'];
            }

            $query = "DELETE FROM equipos WHERE id_equipo = :id_equipo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_equipo', $id_equipo, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ['exito' => true, 'mensaje' => 'Equipo eliminado exitosamente'];
            } else {
                return ['exito' => false, 'mensaje' => 'No se pudo eliminar el equipo'];
            }
        } catch (Throwable $e) {
            error_log("Error en equipoEliminar: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error al eliminar el equipo: ' . $e->getMessage()];
        }
    }

    private function fichaDetalle()
    {
        try {
            $query = "SELECT ft.*, 
                      CONCAT(emp.nombre, ' ', IFNULL(emp.apellido, '')) AS responsable,
                      s.nombre_serv AS servicio
                      FROM fichas_tecnicas ft
                      LEFT JOIN dirpoles_security.empleado emp ON ft.id_empleado_responsable = emp.id_empleado
                      INNER JOIN servicio s ON ft.id_servicio = s.id_servicios
                      WHERE ft.id_ficha = :id_ficha";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_ficha', $this->__get('id_ficha'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error en fichaDetalle: " . $e->getMessage());
            return null;
        }
    }

    private function fichaDetalleEditar()
    {
        try {
            $query = "SELECT ft.*, 
                      s.nombre_serv AS servicio
                      FROM fichas_tecnicas ft
                      INNER JOIN servicio s ON ft.id_servicio = s.id_servicios
                      WHERE ft.id_ficha = :id_ficha";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_ficha', $this->__get('id_ficha'), PDO::PARAM_INT);
            $stmt->execute();
            $ficha = $stmt->fetch(PDO::FETCH_ASSOC);

            $servicios = $this->obtenerServicios();
            $empleados = $this->obtenerEmpleados();

            return [
                'ficha' => $ficha,
                'servicios' => $servicios,
                'empleados' => $empleados
            ];
        } catch (Throwable $e) {
            error_log("Error en fichaDetalleEditar: " . $e->getMessage());
            return null;
        }
    }

    private function fichaActualizar()
    {
        try {
            $this->conn->beginTransaction();

            $id_ficha = $this->__get('id_ficha');

            $checkQuery = "SELECT COUNT(*) FROM fichas_tecnicas WHERE id_ficha = :id_ficha";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindValue(':id_ficha', $id_ficha, PDO::PARAM_INT);
            $checkStmt->execute();

            if ($checkStmt->fetchColumn() == 0) {
                $this->conn->rollBack();
                return ['exito' => false, 'mensaje' => 'La ficha técnica no existe'];
            }

            $query = "UPDATE fichas_tecnicas SET
                nombre_ficha = :nombre_ficha,
                id_servicio = :id_servicio,
                id_empleado_responsable = :id_empleado_responsable,
                descripcion = :descripcion,
                fecha_creacion = :fecha_creacion,
                estatus = :estatus
            WHERE id_ficha = :id_ficha";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_ficha', $id_ficha, PDO::PARAM_INT);
            $stmt->bindValue(':nombre_ficha', $this->__get('nombre_ficha'), PDO::PARAM_STR);
            $stmt->bindValue(':id_servicio', $this->__get('id_servicio'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado_responsable', $this->__get('id_empleado_responsable'), PDO::PARAM_INT);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_creacion', $this->__get('fecha_creacion'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_INT);
            $stmt->execute();

            $this->conn->commit();
            return ['exito' => true, 'mensaje' => 'Ficha técnica actualizada exitosamente'];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error en fichaActualizar: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error al actualizar la ficha técnica: ' . $e->getMessage()];
        }
    }

    private function fichaEliminar()
    {
        try {
            $id_ficha = $this->__get('id_ficha');

            // Verificar que no tenga detalle_ficha_mobiliario asociado
            $checkQuery1 = "SELECT COUNT(*) FROM detalle_ficha_mobiliario WHERE id_ficha = :id_ficha";
            $checkStmt1 = $this->conn->prepare($checkQuery1);
            $checkStmt1->bindValue(':id_ficha', $id_ficha, PDO::PARAM_INT);
            $checkStmt1->execute();

            if ($checkStmt1->fetchColumn() > 0) {
                return ['exito' => false, 'mensaje' => 'No se puede eliminar: la ficha técnica tiene mobiliarios asociados'];
            }

            // Verificar que no tenga detalle_ficha_equipo asociado
            $checkQuery2 = "SELECT COUNT(*) FROM detalle_ficha_equipo WHERE id_ficha = :id_ficha";
            $checkStmt2 = $this->conn->prepare($checkQuery2);
            $checkStmt2->bindValue(':id_ficha', $id_ficha, PDO::PARAM_INT);
            $checkStmt2->execute();

            if ($checkStmt2->fetchColumn() > 0) {
                return ['exito' => false, 'mensaje' => 'No se puede eliminar: la ficha técnica tiene equipos asociados'];
            }

            $query = "DELETE FROM fichas_tecnicas WHERE id_ficha = :id_ficha";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_ficha', $id_ficha, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ['exito' => true, 'mensaje' => 'Ficha técnica eliminada exitosamente'];
            } else {
                return ['exito' => false, 'mensaje' => 'No se pudo eliminar la ficha técnica'];
            }
        } catch (Throwable $e) {
            error_log("Error en fichaEliminar: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error al eliminar la ficha técnica: ' . $e->getMessage()];
        }
    }
}
