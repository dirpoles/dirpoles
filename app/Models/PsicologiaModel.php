<?php
namespace App\Models;
use App\Models\BusinessModel;
use Exception;
use Throwable;
use PDO;

class PsicologiaModel extends BusinessModel{
    private $atributos = [];

    public function __set($name, $value){
        $this->atributos[$name] = $value;
    }

    public function __get($name){
        return $this->atributos[$name];
    }

    public function manejarAccion($action){
        switch($action){
            case 'obtener_patologias':
                return $this->obtenerPatologias();

            case 'registrar_diagnostico':
                return $this->registrarDiagnostico();

            case 'obtener_beneficiario':
                return $this->obtenerBeneficiario();

            case 'obtener_diagnosticos':
                return $this->obtenerDiagnosticos();

            case 'diagnostico_detalle':
                return $this->diagnosticoDetalle();

            case 'actualizar_diagnostico':
                return $this->actualizarDiagnostico();

            case 'eliminar_diagnostico':
                return $this->eliminar_diagnostico();

            case 'obtener_estadisticas':
                return $this->obtenerEstadisticasDashboard();


            default: 
                throw new Exception("Acción $action no es válida en el manejador de acciones");
        }
    }

    private function obtenerPatologias(){
        try{

            $query = "SELECT id_patologia, nombre_patologia, tipo_patologia FROM patologia WHERE tipo_patologia = 'psicologica'";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
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

            $query2 = "INSERT INTO detalle_patologia (id_patologia) VALUES (:id_patologia)";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            $stmt2->execute();
            $id_detalle_patologia = $this->conn->lastInsertId();


            $query3 = "INSERT INTO consulta_psicologica (id_solicitud_serv, id_detalle_patologia, tipo_consulta, diagnostico, tratamiento_gen, motivo_retiro, duracion_retiro, motivo_cambio, observaciones, fecha_creacion) 
            VALUES (:id_solicitud_serv, :id_detalle_patologia, :tipo_consulta, :diagnostico, :tratamiento_gen, :motivo_retiro, :duracion_retiro, :motivo_cambio, :observaciones, NOW())";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_solicitud_serv', $id_solicitud_serv, PDO::PARAM_INT);
            $stmt3->bindValue(':id_detalle_patologia', $id_detalle_patologia, PDO::PARAM_INT);
            $stmt3->bindValue(':tipo_consulta', $this->__get('tipo_consulta'), PDO::PARAM_STR);
            $stmt3->bindValue(':diagnostico', $this->__get('diagnostico'), PDO::PARAM_STR);
            $stmt3->bindValue(':tratamiento_gen', $this->__get('tratamiento_gen'), PDO::PARAM_STR);
            $stmt3->bindValue(':motivo_retiro', $this->__get('motivo_retiro'), PDO::PARAM_STR);
            $stmt3->bindValue(':duracion_retiro', $this->__get('duracion_retiro'), PDO::PARAM_STR);
            $stmt3->bindValue(':motivo_cambio', $this->__get('motivo_cambio'), PDO::PARAM_STR);
            $stmt3->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);

            $stmt3->execute();

            if ($this->__get('tipo_consulta') === 'Retiro temporal') {
                $this->actualizarStatusBeneficiario();
            }

            $this->conn->commit();

            return match ($this->__get('tipo_consulta')) {
                'Diagnóstico' => [
                    'exito' => true,
                    'mensaje' => 'Diagnóstico registrado correctamente'
                ],
                'Retiro temporal' => [
                    'exito' => true,
                    'mensaje' => 'Retiro temporal registrado correctamente'
                ],
                'Cambio de carrera' => [
                    'exito' => true,
                    'mensaje' => 'Cambio de carrera registrado correctamente'
                ],
            };
            

        } catch(Throwable $e){
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
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

    private function actualizarStatusBeneficiario(){
        $query = "UPDATE beneficiario SET estatus = 0 WHERE id_beneficiario = :id_beneficiario";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
        $stmt->execute();
    }

    private function obtenerDiagnosticos(){
        $es_admin = $this->__get('es_admin') ?? false;
        try{
            $query = "SELECT 
                cp.id_psicologia,
                cp.tipo_consulta,
                cp.diagnostico,
                cp.tratamiento_gen,
                cp.motivo_retiro,
                cp.duracion_retiro,
                cp.motivo_cambio,
                cp.observaciones,
                cp.fecha_creacion,
                cp.id_solicitud_serv,
                CONCAT(b.nombres, ' ', b.apellidos, ' (', b.tipo_cedula, '-', b.cedula, ')') AS beneficiario,
                CONCAT(e.nombre, ' ', e.apellido, ' (', e.tipo_cedula, '-', e.cedula, ')') AS empleado,
                p.nombre_patologia AS patologia
            FROM consulta_psicologica cp
            INNER JOIN solicitud_de_servicio ss ON cp.id_solicitud_serv = ss.id_solicitud_serv
            INNER JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
            INNER JOIN dirpoles_security.empleado e ON ss.id_empleado = e.id_empleado
            LEFT JOIN detalle_patologia dp ON cp.id_detalle_patologia = dp.id_detalle_patologia
            LEFT JOIN patologia p ON dp.id_patologia = p.id_patologia";
            
            // Si no es administrador, filtrar por id_empleado
            if (!$es_admin) {
                $query .= " WHERE ss.id_empleado = :id_empleado";
            }
            
            $query .= " ORDER BY cp.fecha_creacion DESC";
            
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

    private function diagnosticoDetalle(){
        try{
            $query = "SELECT 
                cp.id_psicologia,
                cp.tipo_consulta,
                cp.diagnostico,
                cp.tratamiento_gen,
                cp.motivo_retiro,
                cp.duracion_retiro,
                cp.motivo_cambio,
                cp.observaciones,
                cp.fecha_creacion,
                cp.id_detalle_patologia,
                CONCAT(b.nombres, ' ', b.apellidos, ' (', b.tipo_cedula, '-', b.cedula, ')') AS beneficiario,
                CONCAT(e.nombre, ' ', e.apellido, ' (', e.tipo_cedula, '-', e.cedula, ')') AS empleado,
                p.nombre_patologia AS patologia
            FROM consulta_psicologica cp
            INNER JOIN solicitud_de_servicio ss ON cp.id_solicitud_serv = ss.id_solicitud_serv
            INNER JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
            INNER JOIN dirpoles_security.empleado e ON ss.id_empleado = e.id_empleado
            LEFT JOIN detalle_patologia dp ON cp.id_detalle_patologia = dp.id_detalle_patologia
            LEFT JOIN patologia p ON dp.id_patologia = p.id_patologia
            WHERE cp.id_psicologia = :id_psicologia";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_psicologia', $this->__get('id_psicologia'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function actualizarDiagnostico(){
        try{
            $this->conn->beginTransaction();

            // Actualizar detalle_patologia si es tipo Diagnóstico y se proporcionó id_patologia
            if ($this->__get('tipo_consulta') === 'Diagnóstico' && $this->__get('id_patologia')) {
                // Primero obtener el id_detalle_patologia actual de la consulta
                $queryGetDetalle = "SELECT id_detalle_patologia FROM consulta_psicologica WHERE id_psicologia = :id_psicologia";
                $stmtGetDetalle = $this->conn->prepare($queryGetDetalle);
                $stmtGetDetalle->bindValue(':id_psicologia', $this->__get('id_psicologia'), PDO::PARAM_INT);
                $stmtGetDetalle->execute();
                $detalleActual = $stmtGetDetalle->fetch(PDO::FETCH_ASSOC);

                if ($detalleActual && $detalleActual['id_detalle_patologia']) {
                    // Actualizar la patología en detalle_patologia
                    $queryUpdateDetalle = "UPDATE detalle_patologia SET id_patologia = :id_patologia WHERE id_detalle_patologia = :id_detalle_patologia";
                    $stmtUpdateDetalle = $this->conn->prepare($queryUpdateDetalle);
                    $stmtUpdateDetalle->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
                    $stmtUpdateDetalle->bindValue(':id_detalle_patologia', $detalleActual['id_detalle_patologia'], PDO::PARAM_INT);
                    $stmtUpdateDetalle->execute();
                }
            }

            // Actualizar consulta_psicologica
            $query = "UPDATE consulta_psicologica SET 
                diagnostico = :diagnostico,
                tratamiento_gen = :tratamiento_gen,
                motivo_retiro = :motivo_retiro,
                duracion_retiro = :duracion_retiro,
                motivo_cambio = :motivo_cambio,
                observaciones = :observaciones
            WHERE id_psicologia = :id_psicologia";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':diagnostico', $this->__get('diagnostico'), PDO::PARAM_STR);
            $stmt->bindValue(':tratamiento_gen', $this->__get('tratamiento_gen'), PDO::PARAM_STR);
            $stmt->bindValue(':motivo_retiro', $this->__get('motivo_retiro'), PDO::PARAM_STR);
            $stmt->bindValue(':duracion_retiro', $this->__get('duracion_retiro'), PDO::PARAM_STR);
            $stmt->bindValue(':motivo_cambio', $this->__get('motivo_cambio'), PDO::PARAM_STR);
            $stmt->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt->bindValue(':id_psicologia', $this->__get('id_psicologia'), PDO::PARAM_INT);

            $stmt->execute();

            $this->conn->commit();

            return match ($this->__get('tipo_consulta')) {
                'Diagnóstico' => [
                    'exito' => true,
                    'mensaje' => 'Diagnóstico actualizado correctamente'
                ],
                'Retiro temporal' => [
                    'exito' => true,
                    'mensaje' => 'Retiro temporal actualizado correctamente'
                ],
                'Cambio de carrera' => [
                    'exito' => true,
                    'mensaje' => 'Cambio de carrera actualizado correctamente'
                ],
                default => [
                    'exito' => true,
                    'mensaje' => 'Diagnóstico actualizado correctamente'
                ]
            };

        } catch(Throwable $e){
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function eliminar_diagnostico(){
        try{
            // Verifica que los IDs estén asignados
            if (!$this->__get('id_psicologia') || !$this->__get('id_solicitud_serv')) {
                throw new Exception("IDs no asignados correctamente");
            }
            $this->conn->beginTransaction();

            $query1 = "DELETE FROM consulta_psicologica WHERE id_psicologia = :id_psicologia";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_psicologia', $this->__get('id_psicologia'), PDO::PARAM_INT);
            $stmt1->execute();

            $query2 = "DELETE FROM solicitud_de_servicio WHERE id_solicitud_serv = :id_solicitud_serv";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_solicitud_serv', $this->__get('id_solicitud_serv'), PDO::PARAM_INT);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Diagnóstico eliminado correctamente'
            ];

        } catch(Throwable $e){
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function obtenerEstadisticasDashboard() {
        try {
            $id_empleado = $this->__get('id_empleado');
            $es_admin = isset($_SESSION['tipo_empleado']) && $_SESSION['tipo_empleado'] === 'Administrador';
            
            // Filtro dinámico
            $filtro_empleado_ss = "";
            $filtro_empleado_cita = "";
            $params = [];

            if (!$es_admin) {
                $filtro_empleado_ss = "AND ss.id_empleado = :id_empleado";
                $filtro_empleado_cita = "AND id_empleado = :id_empleado";
                $params[':id_empleado'] = $id_empleado;
            }

            // 0. Conteo Total de Consultas
            $q0 = "SELECT COUNT(*) 
                   FROM consulta_psicologica cp
                   INNER JOIN solicitud_de_servicio ss ON cp.id_solicitud_serv = ss.id_solicitud_serv
                   WHERE 1=1 $filtro_empleado_ss";
            $s0 = $this->conn->prepare($q0);
            $s0->execute($params);
            $total_conteo = $s0->fetchColumn();

            // 1. Diagnósticos Totales
            $q1 = "SELECT COUNT(cp.id_psicologia) 
                   FROM consulta_psicologica cp
                   INNER JOIN solicitud_de_servicio ss ON cp.id_solicitud_serv = ss.id_solicitud_serv
                   WHERE cp.tipo_consulta = 'Diagnóstico' $filtro_empleado_ss";
            $s1 = $this->conn->prepare($q1);
            $s1->execute($params);
            $total_diagnosticos = $s1->fetchColumn();

            // 2. Citas del Mes
            $q2 = "SELECT COUNT(*) 
                   FROM cita 
                   WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) 
                   AND YEAR(fecha) = YEAR(CURRENT_DATE()) $filtro_empleado_cita";
            $s2 = $this->conn->prepare($q2);
            $s2->execute($params);
            $citas_mes = $s2->fetchColumn();

            // 3. Retiros Temporales
            $q3 = "SELECT COUNT(cp.id_psicologia) 
                   FROM consulta_psicologica cp
                   INNER JOIN solicitud_de_servicio ss ON cp.id_solicitud_serv = ss.id_solicitud_serv
                   WHERE cp.tipo_consulta = 'Retiro temporal' $filtro_empleado_ss";
            $s3 = $this->conn->prepare($q3);
            $s3->execute($params);
            $retiros_activos = $s3->fetchColumn();

            // 4. Cambios de Carrera
            $q4 = "SELECT COUNT(cp.id_psicologia) 
                   FROM consulta_psicologica cp
                   INNER JOIN solicitud_de_servicio ss ON cp.id_solicitud_serv = ss.id_solicitud_serv
                   WHERE cp.tipo_consulta = 'Cambio de carrera' $filtro_empleado_ss";
            $s4 = $this->conn->prepare($q4);
            $s4->execute($params);
            $cambios_carrera = $s4->fetchColumn();

            return [
                'exito' => true,
                'total_diagnosticos' => $total_diagnosticos,
                'total_conteo' => $total_conteo,
                'citas_mes' => $citas_mes,
                'retiros_activos' => $retiros_activos,
                'cambios_carrera' => $cambios_carrera
            ];

        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }
}