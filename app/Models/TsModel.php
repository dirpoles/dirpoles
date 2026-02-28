<?php
namespace App\Models;
use PDO;
use Throwable;
use Exception;
use App\Models\BusinessModel;

class TsModel extends BusinessModel{
    private $atributos = [];

    public function __set($name, $value){
        $this->atributos[$name] = $value;
    }

    public function __get($name){
        return $this->atributos[$name] ?? null;
    }

    public function manejarAccion($action){
        switch($action){
            case 'obtener_beneficiario':
                return $this->obtenerBeneficiario();

            case 'registrar_beca':
                return $this->registrarBeca();

            case 'registrar_exoneracion':
                return $this->registrarExoneracion();

            case 'registrar_fames':
                return $this->registrarFames();

            case 'registrar_emb':
                return $this->registrarEmb();

            case 'obtener_patologias':
                return $this->obtenerPatologias();

            case 'obtener_exoneraciones_pendientes':
                return $this->obtenerExoneracionesPendientes();

            case 'actualizar_exoneracion_estudio':
                return $this->actualizarExoneracionConEstudio();

            case 'listar_becas':
                return $this->listarBecas();
            case 'listar_exoneraciones':
                return $this->listarExoneraciones();
            case 'listar_fames':
                return $this->listarFames();
            case 'listar_embarazadas':
                return $this->listarEmbarazadas();

            case 'detalle_beca':
                return $this->beca_detalle();
            case 'detalle_exoneracion':
                return $this->exoneracion_detalle();
            case 'detalle_fames':
                return $this->fames_detalle();
            case 'detalle_embarazada':
                return $this->embarazada_detalle();

            case 'actualizar_beca':
                return $this->actualizarBeca();
            case 'actualizar_exoneracion':
                return $this->actualizarExoneracion();
            case 'actualizar_fames':
                return $this->actualizarFames();
            case 'actualizar_embarazadas':
                return $this->actualizarEmbarazadas();

            case 'eliminar_beca':
                return $this->eliminarBeca();
            case 'eliminar_exoneracion':
                return $this->eliminarExoneracion();
            case 'eliminar_fames':
                return $this->eliminarFames();
            case 'eliminar_embarazadas':
                return $this->eliminarEmbarazada();

            case 'stats_admin':
                return $this->statsAdmin();
            case 'stats_empleado':
                return $this->statsEmpleado();

            default:
                throw new Exception('Acción no disponible');
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

    private function obtenerPatologias(){
        try{
            $query = "SELECT id_patologia, nombre_patologia, tipo_patologia FROM patologia WHERE id_patologia NOT IN (1, 2)";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function registrarBeca(){
        try {
            $this->conn->beginTransaction();

            $query1 = "INSERT INTO solicitud_de_servicio (id_beneficiario, id_servicios, id_empleado) VALUES (:id_beneficiario, :id_servicios, :id_empleado)";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt1->execute();
            $id_solicitud_generado = $this->conn->lastInsertId();

            $query2 = "INSERT INTO becas (id_solicitud_serv, cta_bcv, direccion_pdf, tipo_banco, fecha_creacion) VALUES (:id_solicitud_serv, :cta_bcv, :direccion_pdf, :tipo_banco, CURDATE())";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindParam(':id_solicitud_serv', $id_solicitud_generado, PDO::PARAM_INT);
            $stmt2->bindValue(':cta_bcv', $this->__get('cta_bcv'), PDO::PARAM_STR);
            $stmt2->bindValue(':direccion_pdf', $this->__get('direccion_pdf'), PDO::PARAM_STR);
            $stmt2->bindValue(':tipo_banco', $this->__get('tipo_banco'), PDO::PARAM_STR);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Beca registrada exitosamente'
            ];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error al crear la consulta trabajo social: " . $e->getMessage());
            throw new Exception('Error al crear la consulta de trabajo social: ' . $e->getMessage());
        }
    }

    private function registrarExoneracion(){
        try{
             $this->conn->beginTransaction();

            $query1 = "INSERT INTO solicitud_de_servicio (id_beneficiario, id_servicios, id_empleado) VALUES (:id_beneficiario, :id_servicios, :id_empleado)";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt1->execute();
            $id_solicitud_generado = $this->conn->lastInsertId();

            $query2 = "INSERT INTO exoneracion (id_solicitud_serv, motivo, direccion_carta, direccion_estudiose, otro_motivo, carnet_discapacidad, fecha_creacion) VALUES (:id_solicitud_serv, :motivo, :direccion_carta, NULL, :otro_motivo, :carnet_discapacidad, curdate())";

            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindParam(':id_solicitud_serv', $id_solicitud_generado, PDO::PARAM_INT);
            $stmt2->bindValue(':direccion_carta', $this->__get('direccion_carta'), PDO::PARAM_STR);
            $stmt2->bindValue(':motivo', $this->__get('motivo'), PDO::PARAM_STR);  
            $stmt2->bindValue(':otro_motivo', $this->__get('otro_motivo'), PDO::PARAM_STR); 
            $stmt2->bindValue(':carnet_discapacidad', $this->__get('carnet_discapacidad'), PDO::PARAM_STR); 
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => "Exoneracion registrada exitosamente"
            ];

        }catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function registrarFames(){
        try{
            $this->conn->beginTransaction();

            $query1 = "INSERT INTO solicitud_de_servicio (id_beneficiario, id_servicios, id_empleado) VALUES (:id_beneficiario, :id_servicios, :id_empleado)";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt1->execute();
            $id_solicitud_generado = $this->conn->lastInsertId();

            $query3 = "INSERT INTO detalle_patologia (id_patologia) VALUES (:id_patologia)";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            $stmt3->execute();
            $id_patologia_generado = $this->conn->lastInsertId();

            $query2 = "INSERT INTO fames (id_solicitud_serv, id_detalle_patologia, tipo_ayuda, otro_tipo, fecha_creacion) VALUES (:id_solicitud_serv, :patologia, :tipo_ayuda, :otro_tipo, curdate())";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindParam(':id_solicitud_serv', $id_solicitud_generado, PDO::PARAM_INT);
            $stmt2->bindParam(':patologia', $id_patologia_generado, PDO::PARAM_INT);
            $stmt2->bindValue(':tipo_ayuda', $this->__get('tipo_ayuda'), PDO::PARAM_STR);
            $stmt2->bindValue(':otro_tipo', $this->__get('otro_tipo'), PDO::PARAM_STR);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => "Fames registrado exitosamente"
            ];

        } catch(Throwable $e){
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function registrarEmb(){
        try {
            $this->conn->beginTransaction();
            // Validar duplicados antes de comenzar la transacción
            if ($this->validar_embarazadas_registradas()) {
                throw new Exception('El beneficiario ya tiene un registro de embarazo activo');
            }

            $query1 = "INSERT INTO solicitud_de_servicio (id_beneficiario, id_servicios, id_empleado) VALUES (:id_beneficiario, :id_servicios, :id_empleado)";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt1->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt1->execute();
            $id_solicitud_generado = $this->conn->lastInsertId();

            $query3 = "INSERT INTO detalle_patologia (id_patologia) VALUES (:id_patologia)";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            $stmt3->execute();
            $id_patologia_generado = $this->conn->lastInsertId();

            $query5 = "INSERT INTO gestion_emb (id_solicitud_serv, id_detalle_patologia, semanas_gest, codigo_patria, serial_patria, estado, fecha_creacion) VALUES (:id_solicitud_serv, :id_detalle_patologia, :semanas_gest, :codigo_patria, :serial_patria, :estado, curdate())";
            $stmt5 = $this->conn->prepare($query5);
            $stmt5->bindParam(':id_solicitud_serv', $id_solicitud_generado, PDO::PARAM_INT);
            $stmt5->bindParam(':id_detalle_patologia', $id_patologia_generado, PDO::PARAM_INT);
            $stmt5->bindValue(':semanas_gest', $this->__get('semanas_gest'), PDO::PARAM_INT);
            $stmt5->bindValue(':codigo_patria', $this->__get('codigo_patria'), PDO::PARAM_STR);
            $stmt5->bindValue(':serial_patria', $this->__get('serial_patria'), PDO::PARAM_STR);
            $stmt5->bindValue(':estado', $this->__get('estado'), PDO::PARAM_STR);
            $stmt5->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Diagnóstico de Embarazada registrado exitosamente'
            ];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log('Error al crear el diagnostico de embarazada: ' . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }
    private function validar_embarazadas_registradas(){
        try{
            // Validar si ya existe una solicitud de servicio para este beneficiario con el mismo servicio
            $query = "SELECT COUNT(*) AS total 
                    FROM solicitud_de_servicio s
                    INNER JOIN gestion_emb g ON s.id_solicitud_serv = g.id_solicitud_serv
                    WHERE s.id_beneficiario = :id_beneficiario 
                    AND s.id_servicios = :id_servicios
                    AND g.estado = 'En proceso'";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt->execute();
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['total'] > 0;

        } catch (Throwable $e) {
            error_log('Error al validar embarazadas registradas: ' . $e->getMessage());
            throw new Exception('Error al validar registro duplicado: ' . $e->getMessage());
        }
    }

    private function obtenerExoneracionesPendientes(){
        try{
            // Buscamos exoneraciones donde direccion_estudiose es NULL
            // Join con solicitud y beneficiario para obtener datos para el modal
            $query = "SELECT 
                        e.id_exoneracion, 
                        e.motivo, 
                        e.fecha_creacion,
                        b.id_beneficiario,
                        b.nombres,
                        b.apellidos,
                        b.cedula,
                        b.tipo_cedula,
                        b.fecha_nac AS fecha_nacimiento,
                        b.seccion,
                        b.correo,
                        b.telefono,
                        -- Obtenemos el título del PNF si es estudiante (puede ser NULL)
                        (SELECT nombre_pnf FROM pnf WHERE id_pnf = b.id_pnf) as pnf_nombre
                      FROM exoneracion e
                      INNER JOIN solicitud_de_servicio s ON e.id_solicitud_serv = s.id_solicitud_serv
                      INNER JOIN beneficiario b ON s.id_beneficiario = b.id_beneficiario
                      WHERE e.direccion_estudiose IS NULL
                      ORDER BY e.fecha_creacion DESC";
            
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error obteniendo exoneraciones pendientes: " . $e->getMessage());
            return []; 
        }
    }

    private function actualizarExoneracionConEstudio(){
        try {
            $id_exoneracion = $this->__get('id_exoneracion');
            $ruta_pdf = $this->__get('direccion_estudiose');

            if(!$id_exoneracion || !$ruta_pdf){
                // Si no hay ID de exoneración validamos si se permite (caso borde) pero por regla de negocio requerimos ID
                // Pero si el usuario borró la exoneración manualmente mientras se hacía el estudio... 
                // En este flujo estricto, lanzamos error si falta ID.
                throw new Exception("Datos incompletos para actualizar la exoneración");
            }

            $query = "UPDATE exoneracion SET direccion_estudiose = :ruta WHERE id_exoneracion = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':ruta', $ruta_pdf, PDO::PARAM_STR);
            $stmt->bindValue(':id', $id_exoneracion, PDO::PARAM_INT);
            $stmt->execute();

            return [
                'exito' => true, 
                'mensaje' => 'Exoneración actualizada correctamente'
            ];

        } catch (Throwable $e) {
            error_log("Error actualizando exoneracion con estudio: " . $e->getMessage());
             return [
                'exito' => false, 
                'mensaje' => 'Error al vincular el estudio con la exoneración'
            ];
        }
    }

    private function listarBecas(){
        $es_admin = $this->__get('es_admin') ?? false;
        try {
            $query = "SELECT 
                        b.id_becas, 
                        s.id_solicitud_serv,
                        b.fecha_creacion, 
                        b.tipo_banco,
                        CASE b.tipo_banco
                            WHEN '0102' THEN 'BANCO DE VENEZUELA'
                            WHEN '0156' THEN '100% BANCO'
                            WHEN '0172' THEN 'BANCAMIGA BANCO MICROFINANCIERO C.A'
                            WHEN '0114' THEN 'BANCARIBE'
                            WHEN '0171' THEN 'BANCO ACTIVO'
                            WHEN '0166' THEN 'BANCO AGRICOLA DE VENEZUELA'
                            WHEN '0175' THEN 'BANCO DIGITAL DE LOS TRABAJADORES'
                            WHEN '0128' THEN 'BANCO CARONI'
                            WHEN '0163' THEN 'BANCO DEL TESORO'
                            WHEN '0115' THEN 'BANCO EXTERIOR'
                            WHEN '0151' THEN 'BANCO FONDO COMUN'
                            WHEN '0173' THEN 'BANCO INTERNACIONAL DE DESARROLLO'
                            WHEN '0105' THEN 'BANCO MERCANTIL'
                            WHEN '0191' THEN 'BANCO NACIONAL DE CREDITO'
                            WHEN '0138' THEN 'BANCO PLAZA'
                            WHEN '0137' THEN 'BANCO SOFITASA'
                            WHEN '0104' THEN 'BANCO VENEZOLANO DE CREDITO'
                            WHEN '0168' THEN 'BANCRECER'
                            WHEN '0134' THEN 'BANESCO'
                            WHEN '0177' THEN 'BANFANB'
                            WHEN '0146' THEN 'BANGENTE'
                            WHEN '0174' THEN 'BANPLUS'
                            WHEN '0108' THEN 'BBVA PROVINCIAL'
                            WHEN '0157' THEN 'DELSUR BANCO UNIVERSAL'
                            WHEN '0169' THEN 'MI BANCO'
                            WHEN '0178' THEN 'N58 BANCO DIGITAL BANCO MICROFINANCIERO S.A'
                            ELSE 'BANCO NO IDENTIFICADO'
                        END as nombre_banco,
                        b.cta_bcv,
                        b.direccion_pdf,
                        ben.nombres, 
                        ben.apellidos, 
                        ben.cedula,
                        ben.tipo_cedula,
                        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
                        CONCAT(e.tipo_cedula, '-', e.cedula) AS cedula_empleado
                      FROM becas b
                      INNER JOIN solicitud_de_servicio s ON b.id_solicitud_serv = s.id_solicitud_serv
                      INNER JOIN beneficiario ben ON s.id_beneficiario = ben.id_beneficiario
                      INNER JOIN dirpoles_security.empleado e ON s.id_empleado = e.id_empleado";
            
            if (!$es_admin) {
                $query .= " WHERE s.id_empleado = :id_empleado";
            }
            
            $query .= " ORDER BY b.fecha_creacion DESC";

            if ($es_admin) {
                $stmt = $this->conn->query($query);
            } else {
                $stmt = $this->conn->prepare($query);
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
                $stmt->execute();
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [];
        }
    }

    private function listarExoneraciones(){
        $es_admin = $this->__get('es_admin') ?? false;
        try {
            $query = "SELECT 
                        ex.id_exoneracion,
                        s.id_solicitud_serv,
                        ex.fecha_creacion, 
                        ex.motivo, 
                        ex.otro_motivo,
                        ex.direccion_carta,
                        ex.direccion_estudiose,
                        ben.nombres, 
                        ben.apellidos, 
                        ben.cedula,
                        ben.tipo_cedula,
                        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
                        CONCAT(e.tipo_cedula, '-', e.cedula) AS cedula_empleado
                      FROM exoneracion ex
                      INNER JOIN solicitud_de_servicio s ON ex.id_solicitud_serv = s.id_solicitud_serv
                      INNER JOIN beneficiario ben ON s.id_beneficiario = ben.id_beneficiario
                      INNER JOIN dirpoles_security.empleado e ON s.id_empleado = e.id_empleado";

            if (!$es_admin) {
                $query .= " WHERE s.id_empleado = :id_empleado";
            }
            
            $query .= " ORDER BY ex.fecha_creacion DESC";

            if ($es_admin) {
                $stmt = $this->conn->query($query);
            } else {
                $stmt = $this->conn->prepare($query);
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
                $stmt->execute();
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [];
        }
    }

    private function listarFames(){
        $es_admin = $this->__get('es_admin') ?? false;
        try {
            $query = "SELECT 
                        f.id_fames,
                        s.id_solicitud_serv,
                        f.fecha_creacion, 
                        f.tipo_ayuda,
                        f.otro_tipo,
                        dp.id_detalle_patologia,
                        p.nombre_patologia,
                        ben.nombres, 
                        ben.apellidos, 
                        ben.cedula,
                        ben.tipo_cedula,
                        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
                        CONCAT(e.tipo_cedula, '-', e.cedula) AS cedula_empleado
                      FROM fames f
                      INNER JOIN solicitud_de_servicio s ON f.id_solicitud_serv = s.id_solicitud_serv
                      INNER JOIN detalle_patologia dp ON f.id_detalle_patologia = dp.id_detalle_patologia
                      INNER JOIN patologia p ON dp.id_patologia = p.id_patologia
                      INNER JOIN beneficiario ben ON s.id_beneficiario = ben.id_beneficiario
                      INNER JOIN dirpoles_security.empleado e ON s.id_empleado = e.id_empleado";

            if (!$es_admin) {
                $query .= " WHERE s.id_empleado = :id_empleado";
            }
            
            $query .= " ORDER BY f.fecha_creacion DESC";

            if ($es_admin) {
                $stmt = $this->conn->query($query);
            } else {
                $stmt = $this->conn->prepare($query);
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
                $stmt->execute();
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [];
        }
    }

    private function listarEmbarazadas(){
        $es_admin = $this->__get('es_admin') ?? false;
        try {
            $query = "SELECT 
                        g.id_gestion, 
                        s.id_solicitud_serv,
                        g.id_detalle_patologia,
                        ben.id_beneficiario,
                        g.fecha_creacion, 
                        g.semanas_gest, 
                        g.estado,
                        g.codigo_patria,
                        ben.nombres, 
                        ben.apellidos, 
                        ben.cedula,
                        ben.tipo_cedula,
                        CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
                        CONCAT(e.tipo_cedula, '-', e.cedula) AS cedula_empleado
                      FROM gestion_emb g
                      INNER JOIN solicitud_de_servicio s ON g.id_solicitud_serv = s.id_solicitud_serv
                      INNER JOIN beneficiario ben ON s.id_beneficiario = ben.id_beneficiario
                      INNER JOIN dirpoles_security.empleado e ON s.id_empleado = e.id_empleado";

            if (!$es_admin) {
                $query .= " WHERE s.id_empleado = :id_empleado";
            }
            
            $query .= " ORDER BY g.fecha_creacion DESC";

            if ($es_admin) {
                $stmt = $this->conn->query($query);
            } else {
                $stmt = $this->conn->prepare($query);
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
                $stmt->execute();
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [];
        }
    }

    private function beca_detalle(){
        try {
            $query = "SELECT 
                        b.id_becas, 
                        s.id_solicitud_serv,
                        b.fecha_creacion, 
                        b.tipo_banco,
                        CASE b.tipo_banco
                            WHEN '0102' THEN 'BANCO DE VENEZUELA'
                            WHEN '0156' THEN '100% BANCO'
                            WHEN '0172' THEN 'BANCAMIGA BANCO MICROFINANCIERO C.A'
                            WHEN '0114' THEN 'BANCARIBE'
                            WHEN '0171' THEN 'BANCO ACTIVO'
                            WHEN '0166' THEN 'BANCO AGRICOLA DE VENEZUELA'
                            WHEN '0175' THEN 'BANCO DIGITAL DE LOS TRABAJADORES'
                            WHEN '0128' THEN 'BANCO CARONI'
                            WHEN '0163' THEN 'BANCO DEL TESORO'
                            WHEN '0115' THEN 'BANCO EXTERIOR'
                            WHEN '0151' THEN 'BANCO FONDO COMUN'
                            WHEN '0173' THEN 'BANCO INTERNACIONAL DE DESARROLLO'
                            WHEN '0105' THEN 'BANCO MERCANTIL'
                            WHEN '0191' THEN 'BANCO NACIONAL DE CREDITO'
                            WHEN '0138' THEN 'BANCO PLAZA'
                            WHEN '0137' THEN 'BANCO SOFITASA'
                            WHEN '0104' THEN 'BANCO VENEZOLANO DE CREDITO'
                            WHEN '0168' THEN 'BANCRECER'
                            WHEN '0134' THEN 'BANESCO'
                            WHEN '0177' THEN 'BANFANB'
                            WHEN '0146' THEN 'BANGENTE'
                            WHEN '0174' THEN 'BANPLUS'
                            WHEN '0108' THEN 'BBVA PROVINCIAL'
                            WHEN '0157' THEN 'DELSUR BANCO UNIVERSAL'
                            WHEN '0169' THEN 'MI BANCO'
                            WHEN '0178' THEN 'N58 BANCO DIGITAL BANCO MICROFINANCIERO S.A'
                            ELSE 'BANCO NO IDENTIFICADO'
                        END as nombre_banco,
                        b.cta_bcv,
                        b.direccion_pdf,
                        ben.id_beneficiario,
                        CONCAT(ben.nombres, ' ', ben.apellidos, ' (', ben.tipo_cedula, '-', ben.cedula, ')') AS beneficiario,
                        CONCAT(e.nombre, ' ', e.apellido, ' (', e.tipo_cedula, '-', e.cedula, ')') AS empleado
                      FROM becas b
                      INNER JOIN solicitud_de_servicio s ON b.id_solicitud_serv = s.id_solicitud_serv
                      INNER JOIN beneficiario ben ON s.id_beneficiario = ben.id_beneficiario
                      INNER JOIN dirpoles_security.empleado e ON s.id_empleado = e.id_empleado
                      WHERE b.id_becas = :id_becas";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_becas', $this->__get('id_becas'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (Throwable $e) {
            error_log("Error en beca_detalle: " . $e->getMessage());
            return [];
        }
    }

    private function actualizarBeca(){
        try {
            $this->conn->beginTransaction();

            $query = "UPDATE becas 
                      SET tipo_banco = :tipo_banco, 
                          cta_bcv = :cta_bcv 
                      WHERE id_becas = :id_becas";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindValue(':tipo_banco', $this->__get('tipo_banco'));
            $stmt->bindValue(':cta_bcv', $this->__get('cta_bcv'));
            $stmt->bindValue(':id_becas', $this->__get('id_becas'), PDO::PARAM_INT);
            
            $stmt->execute();
            
            $this->conn->commit();
            return [
                'exito' => true, 
                'mensaje' => 'Beca actualizada correctamente'
            ];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error actualizando beca: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => 'Error al actualizar la beca: ' . $e->getMessage()];
        }
    }

    private function eliminarBeca(){
        try{
            $this->conn->beginTransaction();

            // Primero eliminar la beca que depende de la solicitud
            $query1 = "DELETE FROM becas WHERE id_solicitud_serv = :id_solicitud_serv";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_solicitud_serv', $this->__get('id_solicitud_serv'), PDO::PARAM_INT);
            $stmt1->execute();

            // Luego eliminar la solicitud de servicio
            $query2 = "DELETE FROM solicitud_de_servicio WHERE id_solicitud_serv = :id_solicitud_serv";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_solicitud_serv', $this->__get('id_solicitud_serv'), PDO::PARAM_INT);
            $stmt2->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Beca eliminada correctamente'
            ];

        } catch (Throwable $e){
            $this->conn->rollBack();
            error_log("Error eliminando beca: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => $e->getMessage()];
        }
    }

    private function exoneracion_detalle(){
        try {
            $query = "SELECT 
                        e.id_exoneracion, 
                        s.id_solicitud_serv,
                        e.fecha_creacion, 
                        e.motivo,
                        e.otro_motivo,
                        e.carnet_discapacidad,
                        ben.id_beneficiario,
                        CONCAT(ben.nombres, ' ', ben.apellidos, ' (', ben.tipo_cedula, '-', ben.cedula, ')') AS beneficiario,
                        CONCAT(emp.nombre, ' ', emp.apellido, ' (', emp.tipo_cedula, '-', emp.cedula, ')') AS empleado
                      FROM exoneracion e
                      INNER JOIN solicitud_de_servicio s ON e.id_solicitud_serv = s.id_solicitud_serv
                      INNER JOIN beneficiario ben ON s.id_beneficiario = ben.id_beneficiario
                      INNER JOIN dirpoles_security.empleado emp ON s.id_empleado = emp.id_empleado
                      WHERE e.id_exoneracion = :id_exoneracion";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_exoneracion', $this->__get('id_exoneracion'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (Throwable $e) {
            error_log("Error en exoneracion_detalle: " . $e->getMessage());
            return [];
        }
    }

    private function actualizarExoneracion(){
        try {
            $query1 = "UPDATE exoneracion SET motivo = :motivo, otro_motivo = :otro_motivo, carnet_discapacidad = :carnet_discapacidad WHERE id_exoneracion = :id_exoneracion";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_exoneracion', $this->__get('id_exoneracion'), PDO::PARAM_INT);
            $stmt1->bindValue(':motivo', $this->__get('motivo'), PDO::PARAM_STR);
            $stmt1->bindValue(':otro_motivo', $this->__get('otro_motivo'), PDO::PARAM_STR);
            $stmt1->bindValue(':carnet_discapacidad', $this->__get('carnet_discapacidad'), PDO::PARAM_STR);
            $stmt1->execute();

            return [
                'exito' => true,
                'mensaje' => 'Exoneración actualizada exitosamente'
            ];
        } catch (Throwable $e) {
            error_log("Error actualizando exoneración: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => $e->getMessage()];
        }
    }

    private function eliminarExoneracion(){
        try {
            $this->conn->beginTransaction();

            $query1 = "DELETE FROM exoneracion WHERE id_exoneracion = :id_exoneracion";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_exoneracion', $this->__get('id_exoneracion'), PDO::PARAM_INT);
            $stmt1->execute();

            $query2 = "DELETE FROM solicitud_de_servicio WHERE id_solicitud_serv = :id_solicitud_serv";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_solicitud_serv', $this->__get('id_solicitud_serv'), PDO::PARAM_INT);
            $stmt2->execute();
            
            $this->conn->commit();

            return [
                'exito' => true,
                'mensaje' => 'Exoneración eliminada exitosamente'
            ];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error eliminando exoneración: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => $e->getMessage()];
        }
    }

    private function fames_detalle(){
        try{
            $query = "SELECT 
                f.id_fames,
                s.id_solicitud_serv,
                f.fecha_creacion,
                f.tipo_ayuda,
                f.otro_tipo,
                f.id_detalle_patologia,
                ben.id_beneficiario,
                dp.id_patologia,
                p.nombre_patologia as patologia,
                CONCAT(ben.nombres, ' ', ben.apellidos, ' (', ben.tipo_cedula, '-', ben.cedula, ')') AS beneficiario,
                CONCAT(emp.nombre, ' ', emp.apellido, ' (', emp.tipo_cedula, '-', emp.cedula, ')') AS empleado
            FROM fames f
            INNER JOIN detalle_patologia dp ON f.id_detalle_patologia = dp.id_detalle_patologia
            INNER JOIN patologia p ON dp.id_patologia = p.id_patologia
            INNER JOIN solicitud_de_servicio s ON f.id_solicitud_serv = s.id_solicitud_serv
            INNER JOIN beneficiario ben ON s.id_beneficiario = ben.id_beneficiario
            INNER JOIN dirpoles_security.empleado emp ON s.id_empleado = emp.id_empleado
            WHERE f.id_fames = :id_fames";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_fames', $this->__get('id_fames'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en fames_detalle: " . $e->getMessage());
            return [];
        }
    }

    private function actualizarFames(){
        try{
            $this->conn->beginTransaction();

            $query1 = "UPDATE fames SET tipo_ayuda = :tipo_ayuda, otro_tipo = :otro_tipo WHERE id_fames = :id_fames";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_fames', $this->__get('id_fames'), PDO::PARAM_INT);
            $stmt1->bindValue(':tipo_ayuda', $this->__get('tipo_ayuda'), PDO::PARAM_STR);
            $stmt1->bindValue(':otro_tipo', $this->__get('otro_tipo'), PDO::PARAM_STR);
            $stmt1->execute();

            $query3 = "UPDATE detalle_patologia SET id_patologia = :id_patologia WHERE id_detalle_patologia = :id_detalle_patologia";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_detalle_patologia', $this->__get('id_detalle_patologia'), PDO::PARAM_INT);
            $stmt3->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            $stmt3->execute();

            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'FAMES actualizado correctamente'
            ];

        } catch(Throwable $e){
            $this->conn->rollBack();
            error_log("Error al actualizar FAMES: " . $e->getMessage());
            throw new Exception('Error al actualizar FAMES: ' . $e->getMessage());
        }
    }

    private function embarazada_detalle(){
        try{
            $query = "SELECT 
                g.id_gestion,
                s.id_solicitud_serv,
                g.fecha_creacion,
                g.semanas_gest,
                g.codigo_patria,
                g.serial_patria,
                g.estado,
                g.id_detalle_patologia,
                ben.id_beneficiario,
                dp.id_patologia,
                p.nombre_patologia as patologia,
                CONCAT(ben.nombres, ' ', ben.apellidos, ' (', ben.tipo_cedula, '-', ben.cedula, ')') AS beneficiario,
                CONCAT(emp.nombre, ' ', emp.apellido, ' (', emp.tipo_cedula, '-', emp.cedula, ')') AS empleado
            FROM gestion_emb g
            INNER JOIN detalle_patologia dp ON g.id_detalle_patologia = dp.id_detalle_patologia
            INNER JOIN patologia p ON dp.id_patologia = p.id_patologia
            INNER JOIN solicitud_de_servicio s ON g.id_solicitud_serv = s.id_solicitud_serv
            INNER JOIN beneficiario ben ON s.id_beneficiario = ben.id_beneficiario
            INNER JOIN dirpoles_security.empleado emp ON s.id_empleado = emp.id_empleado
            WHERE g.id_gestion = :id_gestion";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_gestion', $this->__get('id_gestion'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en embarazada_detalle: " . $e->getMessage());
            return [];
        }
    }

    private function actualizarEmbarazadas(){
        try{
            $this->conn->beginTransaction();

            $query1 = "UPDATE gestion_emb
                    SET semanas_gest = :semanas_gest, codigo_patria = :codigo_patria, serial_patria = :serial_patria, estado = :estado
                    WHERE id_gestion = :id_gestion";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_gestion', $this->__get('id_gestion'), PDO::PARAM_INT);
            $stmt1->bindValue(':semanas_gest', $this->__get('semanas_gest'), PDO::PARAM_INT);
            $stmt1->bindValue(':codigo_patria', $this->__get('codigo_patria'), PDO::PARAM_STR);
            $stmt1->bindValue(':serial_patria', $this->__get('serial_patria'), PDO::PARAM_STR);
            $stmt1->bindValue(':estado', $this->__get('estado'), PDO::PARAM_STR);
            $stmt1->execute();

            $query2 = "UPDATE detalle_patologia SET id_patologia = :id_patologia WHERE id_detalle_patologia = :id_detalle_patologia";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_detalle_patologia', $this->__get('id_detalle_patologia'), PDO::PARAM_INT);
            $stmt2->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            $stmt2->execute();

            $this->conn->commit();
            return ['exito' => true, 'mensaje' => 'Servicio de Embarazada actualizado correctamente'];

        } catch(Throwable $e){
            error_log("Error al actualizar Embarazadas: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => $e->getMessage()];
        }
    }

    private function eliminarFames(){
        try {
            $this->conn->beginTransaction();
            
            $query1 = "DELETE FROM fames WHERE id_fames = :id_fames";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_fames', $this->__get('id_fames'), PDO::PARAM_INT);
            $stmt1->execute();

            $query2 = "DELETE FROM solicitud_de_servicio WHERE id_solicitud_serv = :id_solicitud_serv";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_solicitud_serv', $this->__get('id_solicitud_serv'), PDO::PARAM_INT);
            $stmt2->execute();

            $query3 = "DELETE FROM detalle_patologia WHERE id_detalle_patologia = :id_detalle_patologia";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_detalle_patologia', $this->__get('id_detalle_patologia'), PDO::PARAM_INT);
            $stmt3->execute();

            $this->conn->commit();
            return ['exito' => true, 'mensaje' => 'Diagnóstico de FAMES eliminado correctamente'];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error en eliminarFames: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => $e->getMessage()];
        }
    }
    private function eliminarEmbarazada(){
        try {
            $this->conn->beginTransaction();
            
            // 1. Eliminar de gestion_emb
            $queryG = "DELETE FROM gestion_emb WHERE id_gestion = :id_gestion";
            $stmtG = $this->conn->prepare($queryG);
            $stmtG->bindValue(':id_gestion', $this->__get('id_gestion'), PDO::PARAM_INT);
            $stmtG->execute();

            // 2. Eliminar de solicitud_de_servicio
            $queryS = "DELETE FROM solicitud_de_servicio WHERE id_solicitud_serv = :id_solicitud_serv";
            $stmtS = $this->conn->prepare($queryS);
            $stmtS->bindValue(':id_solicitud_serv', $this->__get('id_solicitud_serv'), PDO::PARAM_INT);
            $stmtS->execute();

            $queryD = "DELETE FROM detalle_patologia WHERE id_detalle_patologia = :id_detalle_patologia";
            $stmtD = $this->conn->prepare($queryD);
            $stmtD->bindValue(':id_detalle_patologia', $this->__get('id_detalle_patologia'), PDO::PARAM_INT);
            $stmtD->execute();

            $this->conn->commit();
            return ['exito' => true, 'mensaje' => 'Registro de Embarazada eliminado correctamente'];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            error_log("Error en eliminarEmbarazada: " . $e->getMessage());
            return ['exito' => false, 'mensaje' => $e->getMessage()];
        }
    }

    private function statsAdmin(){
        try{
            $query = "SELECT COUNT(*) as total FROM solicitud_de_servicio WHERE id_servicios = 4";
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
            
            // 1. TOTALES (primera fila)
            // Total Embarazadas
            $query1 = "SELECT COUNT(*) as total FROM gestion_emb ge
                    INNER JOIN solicitud_de_servicio sds ON ge.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt1->execute();
            $total_embarazadas = $stmt1->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Total Exoneraciones
            $query2 = "SELECT COUNT(*) as total FROM exoneracion e
                    INNER JOIN solicitud_de_servicio sds ON e.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt2->execute();
            $total_exoneraciones = $stmt2->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Total FAMES
            $query3 = "SELECT COUNT(*) as total FROM fames f
                    INNER JOIN solicitud_de_servicio sds ON f.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt3->execute();
            $total_fames = $stmt3->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Total Becas
            $query4 = "SELECT COUNT(*) as total FROM becas b
                    INNER JOIN solicitud_de_servicio sds ON b.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado";
            $stmt4 = $this->conn->prepare($query4);
            $stmt4->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt4->execute();
            $total_becas = $stmt4->fetch(PDO::FETCH_ASSOC)['total'];
            
            // 2. DEL MES (segunda fila)
            // Embarazadas del Mes
            $query5 = "SELECT COUNT(*) as total FROM gestion_emb ge
                    INNER JOIN solicitud_de_servicio sds ON ge.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado
                    AND MONTH(ge.fecha_creacion) = MONTH(CURRENT_DATE())
                    AND YEAR(ge.fecha_creacion) = YEAR(CURRENT_DATE())";
            $stmt5 = $this->conn->prepare($query5);
            $stmt5->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt5->execute();
            $embarazadas_mes = $stmt5->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Exoneraciones del Mes
            $query6 = "SELECT COUNT(*) as total FROM exoneracion e
                    INNER JOIN solicitud_de_servicio sds ON e.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado
                    AND MONTH(e.fecha_creacion) = MONTH(CURRENT_DATE())
                    AND YEAR(e.fecha_creacion) = YEAR(CURRENT_DATE())";
            $stmt6 = $this->conn->prepare($query6);
            $stmt6->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt6->execute();
            $exoneraciones_mes = $stmt6->fetch(PDO::FETCH_ASSOC)['total'];
            
            // FAMES del Mes
            $query7 = "SELECT COUNT(*) as total FROM fames f
                    INNER JOIN solicitud_de_servicio sds ON f.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado
                    AND MONTH(f.fecha_creacion) = MONTH(CURRENT_DATE())
                    AND YEAR(f.fecha_creacion) = YEAR(CURRENT_DATE())";
            $stmt7 = $this->conn->prepare($query7);
            $stmt7->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt7->execute();
            $fames_mes = $stmt7->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Becas del Mes
            $query8 = "SELECT COUNT(*) as total FROM becas b
                    INNER JOIN solicitud_de_servicio sds ON b.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado
                    AND MONTH(b.fecha_creacion) = MONTH(CURRENT_DATE())
                    AND YEAR(b.fecha_creacion) = YEAR(CURRENT_DATE())";
            $stmt8 = $this->conn->prepare($query8);
            $stmt8->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt8->execute();
            $becas_mes = $stmt8->fetch(PDO::FETCH_ASSOC)['total'];
            
            // 3. ESTADÍSTICAS ADICIONALES (opcionales, para más insight)
            // Porcentaje de embarazadas con patria
            $query9 = "SELECT 
                        COUNT(*) as total,
                        SUM(CASE WHEN codigo_patria IS NOT NULL THEN 1 ELSE 0 END) as con_patria
                    FROM gestion_emb ge
                    INNER JOIN solicitud_de_servicio sds ON ge.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado";
            $stmt9 = $this->conn->prepare($query9);
            $stmt9->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt9->execute();
            $embarazadas_extra = $stmt9->fetch(PDO::FETCH_ASSOC);
            
            // Tipos de ayuda FAMES
            $query10 = "SELECT 
                        tipo_ayuda,
                        COUNT(*) as cantidad
                    FROM fames f
                    INNER JOIN solicitud_de_servicio sds ON f.id_solicitud_serv = sds.id_solicitud_serv
                    WHERE sds.id_empleado = :id_empleado
                    GROUP BY tipo_ayuda";
            $stmt10 = $this->conn->prepare($query10);
            $stmt10->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt10->execute();
            $tipos_fames = $stmt10->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'exito' => true,
                // Totales (primera fila)
                'total_embarazadas' => $total_embarazadas,
                'total_exoneraciones' => $total_exoneraciones,
                'total_fames' => $total_fames,
                'total_becas' => $total_becas,
                
                // Del mes (segunda fila)
                'embarazadas_mes' => $embarazadas_mes,
                'exoneraciones_mes' => $exoneraciones_mes,
                'fames_mes' => $fames_mes,
                'becas_mes' => $becas_mes,
                
                // Extra (para gráficos o más detalles)
                'embarazadas_con_patria' => $embarazadas_extra['con_patria'] ?? 0,
                'porcentaje_patria' => $embarazadas_extra['total'] > 0 ? 
                    round(($embarazadas_extra['con_patria'] / $embarazadas_extra['total']) * 100, 2) : 0,
                'tipos_fames' => $tipos_fames
            ];
            
        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

}