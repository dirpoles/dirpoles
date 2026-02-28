<?php
namespace App\Models;
use App\Models\BusinessModel;
use Exception;
use PDO;
use Throwable;

class ReferenciasModel extends BusinessModel{
    private $atributos = [];

    public function __set($atributo, $valor){
        $this->atributos[$atributo] = $valor;
    }

    public function __get($atributo){
        return $this->atributos[$atributo];
    }

    public function manejarAccion($action){
        switch($action){
            case 'obtener_servicios':
                return $this->obtenerServicios();
            
            case 'obtener_empleados_por_servicio':
                return $this->obtenerEmpleadosPorServicio();

            case 'obtener_servicio_empleado':
                return $this->obtenerServicioEmpleado();

            case 'obtener_beneficiario':
                return $this->obtenerBeneficiario();

            case 'registrar_referencia':
                return $this->registrarReferencia();

            case 'obtener_estadisticas':
                return $this->obtenerEstadisticas();

            case 'obtener_referencias':
                return $this->obtenerReferencias();
            
            case 'referencia_detalle':
                return $this->referenciaDetalle();

            case 'aceptar_referencia':
                return $this->aceptarReferencia();

            case 'rechazar_referencia':
                return $this->rechazarReferencia();

            default:
                throw new Exception('Acción no permitida');
        }
    }

    private function obtenerEstadisticas(){
        try{
            $es_admin = $this->__get('es_admin') ?? false;
            $id_empleado = $this->__get('id_empleado');

            $where = "";
            $params = [];

            if (!$es_admin) {
                $where = " WHERE (id_empleado_origen = :id_emp OR id_empleado_destino = :id_emp)";
                $params[':id_emp'] = $id_empleado;
            }

            // Total de referencias
            $queryTotal = "SELECT COUNT(*) as total FROM referencias" . $where;
            $stmtTotal = $this->conn->prepare($queryTotal);
            foreach ($params as $key => $val) $stmtTotal->bindValue($key, $val, PDO::PARAM_INT);
            $stmtTotal->execute();
            $total = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];

            // Referencias pendientes
            $queryPend = "SELECT COUNT(*) as total FROM referencias WHERE estado = 'Pendiente' " . ($where ? str_replace("WHERE", "AND", $where) : "");
            $stmtPend = $this->conn->prepare($queryPend);
            foreach ($params as $key => $val) $stmtPend->bindValue($key, $val, PDO::PARAM_INT);
            $stmtPend->execute();
            $pendientes = $stmtPend->fetch(PDO::FETCH_ASSOC)['total'];

            // Referencias finalizadas (Aceptadas)
            $queryFin = "SELECT COUNT(*) as total FROM referencias WHERE estado = 'Aceptada' " . ($where ? str_replace("WHERE", "AND", $where) : "");
            $stmtFin = $this->conn->prepare($queryFin);
            foreach ($params as $key => $val) $stmtFin->bindValue($key, $val, PDO::PARAM_INT);
            $stmtFin->execute();
            $finalizadas = $stmtFin->fetch(PDO::FETCH_ASSOC)['total'];

            // Referencias del mes actual
            $queryMes = "SELECT COUNT(*) as total FROM referencias WHERE MONTH(fecha_referencia) = MONTH(CURRENT_DATE()) AND YEAR(fecha_referencia) = YEAR(CURRENT_DATE()) " . ($where ? str_replace("WHERE", "AND", $where) : "");
            $stmtMes = $this->conn->prepare($queryMes);
            foreach ($params as $key => $val) $stmtMes->bindValue($key, $val, PDO::PARAM_INT);
            $stmtMes->execute();
            $mes = $stmtMes->fetch(PDO::FETCH_ASSOC)['total'];

            return [
                'totales' => $total,
                'pendientes' => $pendientes,
                'finalizadas' => $finalizadas,
                'mes' => $mes
            ];
        } catch (Throwable $e){
            throw new Exception('Error al obtener estadisticas: ' . $e->getMessage());
        }
    } 

    private function obtenerServicios(){
        try{
            $query = "SELECT id_servicios, nombre_serv as nombre_servicio FROM servicio WHERE estatus = 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e){
            throw new Exception('Error al obtener los servicios: ' . $e->getMessage());
        }
    } 

    private function obtenerEmpleadosPorServicio(){
        try{
            $id_servicios = $this->__get('id_servicios');
            $query = "SELECT e.id_empleado, CONCAT(e.nombre, ' ', e.apellido) as nombre_completo,
                            e.tipo_cedula, e.cedula,
                            CONCAT(e.tipo_cedula, '-', e.cedula) as cedula_completa 
                      FROM dirpoles_security.empleado e 
                      JOIN dirpoles_security.tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_emp 
                      WHERE te.id_servicios = :id_servicios AND e.estatus = 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_servicios', $id_servicios, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e){
            throw new Exception('Error al obtener los empleados: ' . $e->getMessage());
        }
    }

    private function obtenerServicioEmpleado(){
        try{
            $id_empleado = $this->__get('id_empleado');
            $query = "SELECT te.id_servicios 
                      FROM dirpoles_security.empleado e 
                      JOIN dirpoles_security.tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_emp 
                      WHERE e.id_empleado = :id_empleado";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt->execute();
            $user_service = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user_service['id_servicios'] ?? null;
        } catch (Throwable $e){
            throw new Exception('Error al obtener el servicio del empleado: ' . $e->getMessage());
        }
    }

    private function obtenerBeneficiario(){
        try{
            // Se usa CONCAT para formatear el nombre completo y la cédula
            $query = "SELECT CONCAT(nombres, ' ', apellidos, ' (', tipo_cedula, ' - ', cedula, ')') as nombre_completo 
                      FROM beneficiario 
                      WHERE id_beneficiario = :id_beneficiario";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt->execute();

            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Retornamos el valor de la columna concatenada o string vacío si no hay resultado
            return $resultado ? $resultado['nombre_completo'] : '';

        } catch(Throwable $e){
            // En caso de error, retornamos un mensaje genérico o vacío para evitar romper el flujo
            return "Beneficiario desconocido"; 
        }
    }

    private function registrarReferencia(){
        try{
            $this->conn->beginTransaction();
            $query = "INSERT INTO referencias 
                     (id_beneficiario, id_empleado_origen, id_servicio_origen, id_empleado_destino, 
                      id_servicio_destino, fecha_referencia, motivo, estado, observaciones) 
                     VALUES 
                     (:id_beneficiario, :id_empleado_origen, :id_servicio_origen, :id_empleado_destino, 
                      :id_servicio_destino, NOW(), :motivo, 'Pendiente', :observaciones)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado_origen', $this->__get('id_empleado_origen'), PDO::PARAM_INT);
            $stmt->bindValue(':id_servicio_origen', $this->__get('id_servicio_origen'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado_destino', $this->__get('id_empleado_destino'), PDO::PARAM_INT);
            $stmt->bindValue(':id_servicio_destino', $this->__get('id_servicio_destino'), PDO::PARAM_INT);
            $stmt->bindValue(':motivo', $this->__get('motivo'), PDO::PARAM_STR);
            $stmt->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Referencia registrada correctamente'
            ];

        } catch(Throwable $e){
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function obtenerReferencias(){
        $es_admin = $this->__get('es_admin') ?? false;
        try{
            $query = "SELECT r.id_referencia, 
                    CONCAT(b.nombres, ' ', b.apellidos) as beneficiario,
                    CONCAT(e1.nombre, ' ', e1.apellido) as empleado_origen,
                    CONCAT(e2.nombre, ' ', e2.apellido) as empleado_destino,
                    s1.nombre_serv as servicio_origen,
                    s2.nombre_serv as servicio_destino,
                    r.fecha_referencia, 
                    r.estado,
                    r.motivo,
                    r.observaciones,
                    r.id_empleado_origen,
                    r.id_empleado_destino
                FROM referencias r
                JOIN beneficiario b ON r.id_beneficiario = b.id_beneficiario
                JOIN dirpoles_security.empleado e1 ON r.id_empleado_origen = e1.id_empleado
                JOIN dirpoles_security.empleado e2 ON r.id_empleado_destino = e2.id_empleado
                JOIN servicio s1 ON r.id_servicio_origen = s1.id_servicios
                JOIN servicio s2 ON r.id_servicio_destino = s2.id_servicios";

            // Si no es administrador, filtrar por id_empleado
            if (!$es_admin) {
                $query .= " WHERE r.id_empleado_origen = :id_empleado OR r.id_empleado_destino = :id_empleado";
            }

            $query .= " ORDER BY r.fecha_referencia DESC";
            
            $stmt = $this->conn->prepare($query);
            
            // Bind parameter si no es admin
            if (!$es_admin) {
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            }
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            throw new Exception('Error al obtener las referencias: ' . $e->getMessage());
        }
    }

    private function referenciaDetalle(){
        try{
            $query = "SELECT r.id_referencia, 
                    CONCAT(b.nombres, ' ', b.apellidos) as beneficiario,
                    CONCAT(e1.nombre, ' ', e1.apellido) as empleado_origen,
                    CONCAT(e2.nombre, ' ', e2.apellido) as empleado_destino,
                    s1.nombre_serv as servicio_origen,
                    s2.nombre_serv as servicio_destino,
                    r.fecha_referencia, 
                    r.estado,
                    r.motivo,
                    r.observaciones,
                    log.observaciones as razon_rechazo
                FROM referencias r
                LEFT JOIN log_referencias log ON r.id_referencia = log.id_referencia AND r.estado = 'Rechazada'
                JOIN beneficiario b ON r.id_beneficiario = b.id_beneficiario
                JOIN dirpoles_security.empleado e1 ON r.id_empleado_origen = e1.id_empleado
                JOIN dirpoles_security.empleado e2 ON r.id_empleado_destino = e2.id_empleado
                JOIN servicio s1 ON r.id_servicio_origen = s1.id_servicios
                JOIN servicio s2 ON r.id_servicio_destino = s2.id_servicios
                WHERE r.id_referencia = :id_referencia";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_referencia', $this->__get('id_referencia'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            throw new Exception('Error al obtener la referencia: ' . $e->getMessage());
        }
    }

    private function aceptarReferencia(){
        try{
            $this->conn->beginTransaction();

            $query = "UPDATE referencias SET estado = 'Aceptada' WHERE id_referencia = :id_referencia";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_referencia', $this->__get('id_referencia'), PDO::PARAM_INT);
            $stmt->execute();

            $query2 = "INSERT INTO log_referencias (id_referencia, estado_anterior, estado_nuevo, id_empleado, fecha_accion, observaciones) VALUES (:id_referencia, 'Pendiente', 'Aceptada', :id_empleado, NOW(), 'Referencia Aceptada')";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_referencia', $this->__get('id_referencia'), PDO::PARAM_INT);
            $stmt2->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Referencia aceptada correctamente'
            ];

        } catch(Throwable $e){
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function rechazarReferencia(){
        try{
            $this->conn->beginTransaction();

            $query = "UPDATE referencias SET estado = 'Rechazada' WHERE id_referencia = :id_referencia";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_referencia', $this->__get('id_referencia'), PDO::PARAM_INT);
            $stmt->execute();

            $query2 = "INSERT INTO log_referencias (id_referencia, estado_anterior, estado_nuevo, id_empleado, fecha_accion, observaciones) VALUES (:id_referencia, 'Pendiente', 'Rechazada', :id_empleado, NOW(), :observaciones)";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_referencia', $this->__get('id_referencia'), PDO::PARAM_INT);
            $stmt2->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt2->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Referencia rechazada correctamente'
            ];

        } catch(Throwable $e){
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }
}