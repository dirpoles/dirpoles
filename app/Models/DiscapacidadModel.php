<?php
namespace App\Models;
use Exception;
use PDO;
use Throwable;
use App\Models\BusinessModel;

class DiscapacidadModel extends BusinessModel{
    private $atributos = [];

    public function __set($nombre, $valor){
        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre){
        return $this->atributos[$nombre];
    }

    public function manejarAccion($action){
        switch($action){
            case 'registrar_diagnostico':
                return $this->registrarDiagnostico();

            case 'obtener_beneficiario':
                return $this->obtenerBeneficiario();

            case 'obtener_diagnostico':
                return $this->obtenerDiagnostico();

            case 'discapacidad_detalle':
                return $this->discapacidadDetalle();

            case 'actualizar_diagnostico':
                return $this->actualizarDiagnostico();

            case 'eliminar_diagnostico':
                return $this->eliminarDiagnostico();

            case 'stats_admin':
                return $this->statsAdmin();

            case 'stats_empleado':
                return $this->statsEmpleado();

            default:
                throw new Exception('Acción no permitida');
        }
    }

    private function obtenerBeneficiario(){
        try{
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

    private function registrarDiagnostico(){
        try{
            $this->conn->beginTransaction();

            $query = "INSERT INTO solicitud_de_servicio (id_servicios, id_beneficiario, id_empleado) VALUES (:id_servicios, :id_beneficiario, :id_empleado)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            $id_solicitud_serv = $this->conn->lastInsertId();

            $query2 = "INSERT INTO discapacidad (id_solicitud_serv, tipo_discapacidad, disc_especifica, diagnostico, grado, medicamentos, habilidades_funcionales, requiere_asistencia, dispositivo_asistencia, observaciones, recomendaciones, carnet_discapacidad, fecha_creacion) VALUES (:id_solicitud_serv, :tipo_discapacidad, :disc_especifica, :diagnostico, :grado, :medicamentos, :habilidades_funcionales, :requiere_asistencia, :dispositivo_asistencia, :observaciones, :recomendaciones, :carnet_discapacidad, NOW())";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_solicitud_serv', $id_solicitud_serv, PDO::PARAM_INT);
            $stmt2->bindValue(':tipo_discapacidad', $this->__get('tipo_discapacidad'), PDO::PARAM_STR);
            $stmt2->bindValue(':disc_especifica', $this->__get('disc_especifica'), PDO::PARAM_STR);
            $stmt2->bindValue(':diagnostico', $this->__get('diagnostico'), PDO::PARAM_STR);
            $stmt2->bindValue(':grado', $this->__get('grado'), PDO::PARAM_STR);
            $stmt2->bindValue(':medicamentos', $this->__get('medicamentos'), PDO::PARAM_STR);
            $stmt2->bindValue(':habilidades_funcionales', $this->__get('habilidades_funcionales'), PDO::PARAM_STR);
            $stmt2->bindValue(':requiere_asistencia', $this->__get('requiere_asistencia'), PDO::PARAM_STR);
            $stmt2->bindValue(':dispositivo_asistencia', $this->__get('dispositivo_asistencia'), PDO::PARAM_STR);
            $stmt2->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt2->bindValue(':recomendaciones', $this->__get('recomendaciones'), PDO::PARAM_STR);
            $stmt2->bindValue(':carnet_discapacidad', $this->__get('carnet_discapacidad'), PDO::PARAM_STR);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Diagnóstico registrado exitosamente'
            ];

        } catch(Throwable $e){
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function obtenerDiagnostico(){
        $es_admin = $this->__get('es_admin') ?? false;
        try{
            $query = "SELECT 
                d.id_discapacidad,
                d.id_solicitud_serv,
                d.tipo_discapacidad,
                d.disc_especifica,
                d.diagnostico,
                d.grado,
                d.medicamentos,
                d.habilidades_funcionales,
                d.requiere_asistencia,
                d.dispositivo_asistencia,
                d.observaciones,
                d.recomendaciones,
                d.carnet_discapacidad,
                d.fecha_creacion,
                ss.id_beneficiario,
                CONCAT(b.nombres, ' ', b.apellidos, ' (', b.tipo_cedula, '-', b.cedula, ')') AS beneficiario,
                CONCAT(e.nombre, ' ', e.apellido, ' (', e.tipo_cedula, '-', e.cedula, ')') AS empleado
            FROM discapacidad d
            INNER JOIN solicitud_de_servicio ss ON d.id_solicitud_serv = ss.id_solicitud_serv
            INNER JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
            INNER JOIN dirpoles_security.empleado e ON ss.id_empleado = e.id_empleado";
            
            // Si no es administrador, filtrar por id_empleado
            if (!$es_admin) {
                $query .= " WHERE ss.id_empleado = :id_empleado";
            }
            
            $query .= " ORDER BY d.fecha_creacion DESC";
            
            $stmt = $this->conn->prepare($query);
            
            // Solo vincular el parámetro si no es administrador
            if (!$es_admin) {
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            }
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function discapacidadDetalle(){
        try{
            $query = "SELECT 
                d.id_discapacidad,
                d.tipo_discapacidad,
                d.disc_especifica,
                d.diagnostico,
                d.grado,
                d.medicamentos,
                d.habilidades_funcionales,
                d.requiere_asistencia,
                d.dispositivo_asistencia,
                d.observaciones,
                d.recomendaciones,
                d.carnet_discapacidad,
                d.fecha_creacion,
                d.id_solicitud_serv,
                ss.id_beneficiario,
                CONCAT(b.nombres, ' ', b.apellidos, ' (', b.tipo_cedula, '-', b.cedula, ')') AS beneficiario,
                CONCAT(e.nombre, ' ', e.apellido, ' (', e.tipo_cedula, '-', e.cedula, ')') AS empleado
            FROM discapacidad d
            INNER JOIN solicitud_de_servicio ss ON d.id_solicitud_serv = ss.id_solicitud_serv
            INNER JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
            INNER JOIN dirpoles_security.empleado e ON ss.id_empleado = e.id_empleado
            WHERE d.id_discapacidad = :id_discapacidad";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_discapacidad', $this->__get('id_discapacidad'), PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function actualizarDiagnostico(){
        try{
            $query = "UPDATE discapacidad SET 
                tipo_discapacidad = :tipo_discapacidad,
                disc_especifica = :disc_especifica,
                diagnostico = :diagnostico,
                grado = :grado,
                medicamentos = :medicamentos,
                habilidades_funcionales = :habilidades_funcionales,
                requiere_asistencia = :requiere_asistencia,
                dispositivo_asistencia = :dispositivo_asistencia,
                observaciones = :observaciones,
                recomendaciones = :recomendaciones,
                carnet_discapacidad = :carnet_discapacidad
            WHERE id_discapacidad = :id_discapacidad";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_discapacidad', $this->__get('id_discapacidad'), PDO::PARAM_INT);
            $stmt->bindValue(':tipo_discapacidad', $this->__get('tipo_discapacidad'), PDO::PARAM_STR);
            $stmt->bindValue(':disc_especifica', $this->__get('disc_especifica'), PDO::PARAM_STR);
            $stmt->bindValue(':diagnostico', $this->__get('diagnostico'), PDO::PARAM_STR);
            $stmt->bindValue(':grado', $this->__get('grado'), PDO::PARAM_STR);
            $stmt->bindValue(':medicamentos', $this->__get('medicamentos'), PDO::PARAM_STR);
            $stmt->bindValue(':habilidades_funcionales', $this->__get('habilidades_funcionales'), PDO::PARAM_STR);
            $stmt->bindValue(':requiere_asistencia', $this->__get('requiere_asistencia'), PDO::PARAM_STR);
            $stmt->bindValue(':dispositivo_asistencia', $this->__get('dispositivo_asistencia'), PDO::PARAM_STR);
            $stmt->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt->bindValue(':recomendaciones', $this->__get('recomendaciones'), PDO::PARAM_STR);
            $stmt->bindValue(':carnet_discapacidad', $this->__get('carnet_discapacidad'), PDO::PARAM_STR);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Diagnóstico actualizado exitosamente'
            ];

        } catch (Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function eliminarDiagnostico(){
        try{
            $this->conn->beginTransaction();

            $query1 = "DELETE FROM discapacidad WHERE id_discapacidad = :id_discapacidad";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_discapacidad', $this->__get('id_discapacidad'), PDO::PARAM_INT);
            $stmt1->execute();

            $query2 = "DELETE FROM solicitud_de_servicio WHERE id_solicitud_serv = :id_solicitud_serv";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_solicitud_serv', $this->__get('id_solicitud_serv'), PDO::PARAM_INT);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Diagnóstico eliminado exitosamente'
            ];

        } catch(Throwable $e){
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function statsAdmin(){
        try{
            $query = "SELECT COUNT(*) as total FROM solicitud_de_servicio WHERE id_servicios = 5";
            $stmt = $this->conn->query($query);
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            return [
                'exito' => true,
                'total' => $resultado['total']
            ];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function statsEmpleado(){
        try {
            $id_empleado = $this->__get('id_empleado');
            
            // 1. Total de discapacidades
            $query1 = "SELECT COUNT(*) as total FROM discapacidad d
                    INNER JOIN solicitud_de_servicio sds ON d.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt1->execute();
            $total_discapacidades = $stmt1->fetch(PDO::FETCH_ASSOC)['total'];
            
            // 2. Discapacidades del mes actual
            $query2 = "SELECT COUNT(*) as total_mes FROM discapacidad d
                    INNER JOIN solicitud_de_servicio sds ON d.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado
                    AND MONTH(d.fecha_creacion) = MONTH(CURRENT_DATE())
                    AND YEAR(d.fecha_creacion) = YEAR(CURRENT_DATE())";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt2->execute();
            $discapacidades_mes = $stmt2->fetch(PDO::FETCH_ASSOC)['total_mes'];
            
            // 3. Discapacidades graves (grado = 'Grave')
            $query3 = "SELECT COUNT(*) as graves FROM discapacidad d
                    INNER JOIN solicitud_de_servicio sds ON d.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado
                    AND d.grado = 'Grave'";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt3->execute();
            $discapacidades_graves = $stmt3->fetch(PDO::FETCH_ASSOC)['graves'];
            
            // 4. Discapacidades con carnet
            $query4 = "SELECT COUNT(*) as con_carnet FROM discapacidad d
                    INNER JOIN solicitud_de_servicio sds ON d.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado
                    AND d.carnet_discapacidad IS NOT NULL
                    AND d.carnet_discapacidad != ''
                    AND TRIM(d.carnet_discapacidad) != ''";
            $stmt4 = $this->conn->prepare($query4);
            $stmt4->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt4->execute();
            $con_carnet = $stmt4->fetch(PDO::FETCH_ASSOC)['con_carnet'];
            
            
            return [
                'exito' => true,
                'total_discapacidades' => $total_discapacidades,
                'discapacidades_mes' => $discapacidades_mes,
                'discapacidades_graves' => $discapacidades_graves,
                'con_carnet' => $con_carnet,
            ];
            
        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }
}