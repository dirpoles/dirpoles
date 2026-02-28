<?php
namespace App\Models;
use PDO;
use Throwable;
use Exception;
use App\Models\BusinessModel;

class MedicinaModel extends BusinessModel{
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

            case 'obtener_diagnostico_medicina':
                return $this->obtener_diagnostico_medicina();

            case 'medicina_detalle':
                return $this->medicina_detalle();
            
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

    private function obtenerPatologias(){
        try{
            $query = "SELECT id_patologia, nombre_patologia, tipo_patologia FROM patologia WHERE tipo_patologia = 'medica'";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
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

    private function registrarDiagnostico(){
        try {
            $this->conn->beginTransaction();
    
            $query1 = "INSERT INTO solicitud_de_servicio (id_beneficiario, id_servicios, id_empleado) VALUES (:id_beneficiario, :id_servicios, :id_empleado)";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt1->execute();
            $id_solicitud_generado = $this->conn->lastInsertId();
    
            $query2 = "INSERT INTO detalle_patologia (id_patologia) VALUES (:id_patologia)";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            $stmt2->execute();
            $id_detalle_generado = $this->conn->lastInsertId();
    
            $query3 = "INSERT INTO consulta_medica (id_detalle_patologia, id_solicitud_serv, estatura, peso, tipo_sangre, motivo_visita, diagnostico, tratamiento, observaciones, fecha_creacion) VALUES (:id_detalle_patologia, :id_solicitud_serv, :estatura, :peso, :tipo_sangre, :motivo_visita, :diagnostico, :tratamiento, :observaciones, CURDATE())";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindParam(':id_detalle_patologia', $id_detalle_generado, PDO::PARAM_INT);
            $stmt3->bindParam(':id_solicitud_serv', $id_solicitud_generado, PDO::PARAM_INT);
            $stmt3->bindValue(':estatura', $this->__get('estatura'), PDO::PARAM_STR);
            $stmt3->bindValue(':peso', $this->__get('peso'), PDO::PARAM_STR);
            $stmt3->bindValue(':tipo_sangre', $this->__get('tipo_sangre'), PDO::PARAM_STR);
            $stmt3->bindValue(':motivo_visita', $this->__get('motivo_visita'), PDO::PARAM_STR);
            $stmt3->bindValue(':diagnostico', $this->__get('diagnostico'), PDO::PARAM_STR);
            $stmt3->bindValue(':tratamiento', $this->__get('tratamiento'), PDO::PARAM_STR);
            $stmt3->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt3->execute();
            $id_consulta_generado = $this->conn->lastInsertId();
    
            $insumos = $this->__get('insumos');
            if (!empty($insumos)) {
                foreach ($insumos as $insumo) {
                    $id_insumo = $insumo['id_insumo'];
                    $cantidad_usada = $insumo['cantidad'];
        
                    $query4 = "INSERT INTO detalle_insumo (id_consulta_med, id_insumo, cantidad_usada) VALUES (:id_consulta_med, :id_insumo, :cantidad_usada)";
                    $stmt4 = $this->conn->prepare($query4);
                    $stmt4->bindParam(':id_consulta_med', $id_consulta_generado, PDO::PARAM_INT);
                    $stmt4->bindParam(':id_insumo', $id_insumo, PDO::PARAM_INT);
                    $stmt4->bindParam(':cantidad_usada', $cantidad_usada, PDO::PARAM_INT);
                    $stmt4->execute();
        
                    // Update quantity and set status to 'Agotado' if 0
                    $query5 = "UPDATE insumos 
                               SET cantidad = cantidad - :cantidad_usada, 
                                   estatus = CASE WHEN (cantidad - :cantidad_usada_check) = 0 THEN 'Agotado' ELSE estatus END
                               WHERE id_insumo = :id_insumo";
                    $stmt5 = $this->conn->prepare($query5);
                    $stmt5->bindParam(':id_insumo', $id_insumo, PDO::PARAM_INT);
                    $stmt5->bindParam(':cantidad_usada', $cantidad_usada, PDO::PARAM_INT);
                    $stmt5->bindParam(':cantidad_usada_check', $cantidad_usada, PDO::PARAM_INT); // Bind again for the check
                    $stmt5->execute();
        
                    $descripcion = "Salida por consulta médica";
                    $query6 = "INSERT INTO inventario_medico (id_insumo, id_empleado, fecha_movimiento, tipo_movimiento, cantidad, descripcion) VALUES (:id_insumo, :id_empleado, NOW(), 'Salida', :cantidad_usada, :descripcion)";
                    $stmt6 = $this->conn->prepare($query6);
                    $stmt6->bindParam(':id_insumo', $id_insumo, PDO::PARAM_INT);
                    $stmt6->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
                    $stmt6->bindParam(':cantidad_usada', $cantidad_usada, PDO::PARAM_INT);
                    $stmt6->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
                    $stmt6->execute();
                }
            }
    
            $this->conn->commit();
            return [
                "exito" => true,
                "mensaje" => 'Consulta médica registrada exitosamente'
            ];
    
        } catch (Throwable $e) {
            $this->conn->rollBack();
            return [
                "exito" => false,
                "mensaje" => 'Error al registrar la consulta médica: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_diagnostico_medicina(){
        $es_admin = $this->__get('es_admin') ?? false;
        try{
            $query = "SELECT 
                cm.id_consulta_med,
                cm.estatura,
                cm.peso,
                cm.tipo_sangre,
                cm.motivo_visita,
                cm.diagnostico,
                cm.tratamiento,
                cm.observaciones,
                cm.fecha_creacion,
                cm.id_solicitud_serv,
                cm.id_detalle_patologia,
                CONCAT(b.nombres, ' ', b.apellidos, ' (', b.tipo_cedula, '-', b.cedula, ')') AS beneficiario,
                CONCAT(e.nombre, ' ', e.apellido, ' (', e.tipo_cedula, '-', e.cedula, ')') AS empleado,
                p.nombre_patologia AS patologia
            FROM consulta_medica cm
            INNER JOIN solicitud_de_servicio ss ON cm.id_solicitud_serv = ss.id_solicitud_serv
            INNER JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
            INNER JOIN dirpoles_security.empleado e ON ss.id_empleado = e.id_empleado
            LEFT JOIN detalle_patologia dp ON cm.id_detalle_patologia = dp.id_detalle_patologia
            LEFT JOIN patologia p ON dp.id_patologia = p.id_patologia";
            
            // Si no es administrador, filtrar por id_empleado
            if (!$es_admin) {
                $query .= " WHERE ss.id_empleado = :id_empleado";
            }
            
            $query .= " ORDER BY cm.fecha_creacion DESC";
            
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

    private function medicina_detalle(){
        try{
            $query = "SELECT 
                cm.id_consulta_med,
                cm.estatura,
                cm.peso,
                cm.tipo_sangre,
                cm.motivo_visita,
                cm.diagnostico,
                cm.tratamiento,
                cm.observaciones,
                cm.fecha_creacion,
                cm.id_solicitud_serv,
                cm.id_detalle_patologia,
                p.id_patologia,
                ss.id_beneficiario,
                CONCAT(b.nombres, ' ', b.apellidos, ' (', b.tipo_cedula, '-', b.cedula, ')') AS beneficiario,
                CONCAT(e.nombre, ' ', e.apellido, ' (', e.tipo_cedula, '-', e.cedula, ')') AS empleado,
                p.nombre_patologia AS patologia,
                (SELECT GROUP_CONCAT(CONCAT(i.nombre_insumo, ' (', di.cantidad_usada, ')') SEPARATOR ', ')
                 FROM detalle_insumo di
                 INNER JOIN insumos i ON di.id_insumo = i.id_insumo
                 WHERE di.id_consulta_med = cm.id_consulta_med) AS insumos_usados
            FROM consulta_medica cm
            INNER JOIN solicitud_de_servicio ss ON cm.id_solicitud_serv = ss.id_solicitud_serv
            INNER JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
            INNER JOIN dirpoles_security.empleado e ON ss.id_empleado = e.id_empleado
            LEFT JOIN detalle_patologia dp ON cm.id_detalle_patologia = dp.id_detalle_patologia
            LEFT JOIN patologia p ON dp.id_patologia = p.id_patologia
            WHERE cm.id_consulta_med = :id_consulta_med";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_consulta_med', $this->__get('id_consulta_med'), PDO::PARAM_INT);
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
            $this->conn->beginTransaction();
            
            $query1 = "UPDATE detalle_patologia SET id_patologia = :id_patologia WHERE id_detalle_patologia = :id_detalle_patologia";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_detalle_patologia', $this->__get('id_detalle_patologia'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            $stmt1->execute();
    
            $query2 = "UPDATE consulta_medica SET id_detalle_patologia = :id_detalle_patologia, estatura = :estatura, peso = :peso, tipo_sangre = :tipo_sangre, motivo_visita = :motivo_visita, diagnostico = :diagnostico, tratamiento = :tratamiento, observaciones = :observaciones WHERE id_consulta_med = :id_consulta_med";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_detalle_patologia', $this->__get('id_detalle_patologia'), PDO::PARAM_INT);
            $stmt2->bindValue(':estatura', $this->__get('estatura'), PDO::PARAM_STR);
            $stmt2->bindValue(':peso', $this->__get('peso'), PDO::PARAM_STR);
            $stmt2->bindValue(':tipo_sangre', $this->__get('tipo_sangre'), PDO::PARAM_STR);
            $stmt2->bindValue(':motivo_visita', $this->__get('motivo_visita'), PDO::PARAM_STR);
            $stmt2->bindValue(':diagnostico', $this->__get('diagnostico'), PDO::PARAM_STR);
            $stmt2->bindValue(':tratamiento', $this->__get('tratamiento'), PDO::PARAM_STR);
            $stmt2->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt2->bindValue(':id_consulta_med', $this->__get('id_consulta_med'), PDO::PARAM_INT);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Diagnostico actualizado exitosamente'
            ];

        } catch(Throwable $e){
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function eliminarDiagnostico(){
        try {
            $this->conn->beginTransaction();
    
            $query1 = "DELETE FROM detalle_insumo WHERE id_consulta_med = :id_consulta_med";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_consulta_med', $this->__get('id_consulta_med'), PDO::PARAM_INT);
            $stmt1->execute();
    
            $query2 = "DELETE FROM consulta_medica WHERE id_consulta_med = :id_consulta_med";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_consulta_med', $this->__get('id_consulta_med'), PDO::PARAM_INT);
            $stmt2->execute();
    
            $query3 = "DELETE FROM detalle_patologia WHERE id_detalle_patologia = :id_detalle_patologia";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_detalle_patologia', $this->__get('id_detalle_patologia'), PDO::PARAM_INT);
            $stmt3->execute();
    
            $query4 = "DELETE FROM solicitud_de_servicio WHERE id_solicitud_serv = :id_solicitud_serv";
            $stmt4 = $this->conn->prepare($query4);
            $stmt4->bindValue(':id_solicitud_serv', $this->__get('id_solicitud_serv'), PDO::PARAM_INT);
            $stmt4->execute();
    
            $this->conn->commit();
            return [
                'exito' => true, 
                'mensaje' => "Diagnóstico eliminado exitosamente"
            ];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function statsAdmin(){
        try {
            $query = "SELECT COUNT(*) as total FROM consulta_medica";
            $stmt = $this->conn->query($query);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['total'];
        } catch (Throwable $e) {
            return 0;
        }
    }

    private function statsEmpleado(){
        try {
            // 1. Consultas médicas del mes actual con JOIN a solicitud_de_servicio
            $query = "SELECT COUNT(*) as total 
                    FROM consulta_medica cm
                    INNER JOIN solicitud_de_servicio sds ON cm.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado 
                    AND MONTH(cm.fecha_creacion) = MONTH(CURRENT_DATE()) 
                    AND YEAR(cm.fecha_creacion) = YEAR(CURRENT_DATE())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            $consulta = $stmt->fetch(PDO::FETCH_ASSOC);

            // 2. Total de solicitudes de servicio tipo medicina (servicio = 2)
            // Esto cuenta todas las solicitudes de medicina del empleado (consultas totales)
            $query2 = "SELECT COUNT(*) as total FROM solicitud_de_servicio 
                    WHERE id_servicios = 2 
                    AND id_empleado = :id_empleado";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt2->execute();
            $total_consultas = $stmt2->fetch(PDO::FETCH_ASSOC);

            // 3. Insumos con bajo stock (cantidad < 10)
            $query3 = "SELECT COUNT(*) as bajo_stock FROM insumos WHERE cantidad < 10";
            $stmt3 = $this->conn->query($query3);
            $bajo_stock = $stmt3->fetch(PDO::FETCH_ASSOC);

            // 4. Insumos disponibles
            $query4 = "SELECT COUNT(*) as disponibles FROM insumos 
                    WHERE cantidad >= 1 AND estatus = 'Disponible'";
            $stmt4 = $this->conn->query($query4);
            $disponibles = $stmt4->fetch(PDO::FETCH_ASSOC);
            
            return [
                'exito' => true,
                'total_consultas' => $total_consultas['total'],  // Para "Consultas Totales"
                'consultas_mes' => $consulta['total'],           // Para "Consultas del Mes"
                'insumos_disponibles' => $disponibles['disponibles'],  // Para "Insumos disponibles"
                'insumos_bajo_stock' => $bajo_stock['bajo_stock'],     // Para "Insumos con bajo stock"
            ];
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }
}