<?php
namespace App\Models;
use App\Models\SecurityModel;
use PDO;
use Throwable;
use Exception;
use InvalidArgumentException;
use function in_array;

class EmpleadoModel extends SecurityModel{
    private $atributos = [];

    public function __set($nombre, $valor){
        $valor = \is_string($valor) ? trim($valor) : $valor;

        if (in_array($nombre, ['nombre', 'apellido'])) {
            $valor = mb_convert_case($valor, MB_CASE_TITLE, "UTF-8");
        }
        
        if ($nombre === 'direccion') {
            $valor = ucfirst(mb_strtolower($valor, "UTF-8"));
        }

        $validaciones = [
            'id_tipo_empleado' => fn($v) => is_numeric($v) && $v > 0,
            'nombre' => fn($v) => !empty($v) && preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/u', $v),
            'apellido' => fn($v) => !empty($v) && preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/u', $v),
            'tipo_cedula' => fn($v) => in_array(strtoupper($v), ['V', 'E']),
            'cedula' => fn($v) => preg_match('/^\d{7,8}$/', $v),
            'fecha_nacimiento' => fn($v) => !empty($v) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $v),
            'telefono' => fn($v) => !empty($v) && preg_match('/^\d{11}$/', $v),
            'correo' => fn($v) => !empty($v) && filter_var($v, FILTER_VALIDATE_EMAIL),
            'clave' => fn($v) => !empty($v) && \strlen($v) >= 8,
            'direccion' => fn($v) => !empty($v) && preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,.\-#]{5,250}$/u', $v),
            'estatus' => fn($v) => in_array($v, [0, 1, '0', '1'])
        ];

        if (isset($validaciones[$nombre]) && !$validaciones[$nombre]($valor)) {
            throw new InvalidArgumentException("Valor inválido para $nombre");
        }

        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre){
        return $this->atributos[$nombre] ?? null;
    }

    public function manejarAccion($action){
        switch ($action) {
            case 'vista': 
                    return $this->obtenerTiposConServicio();

            case 'empleadosActivos':
                return $this->contarEmpleadosActivos();

            case 'empleadosInact':
                return $this->contarEmpleadosInact();

            case 'empleadosTotales':
                return $this->contarEmpleados();

            case 'empleadosNuevos':
                return $this->contarEmpleadosNuevos();

            case 'validarCedula':
                return $this->validarCedula();

            case 'validarCorreo':
                return $this->validarCorreo();

            case 'validarTelefono':
                return $this->validarTelefono();

            case 'registrar_empleado':
                return $this->registrar_empleado();

            case 'empleados_listar':
                return $this->empleados_listar();

            case 'empleado_detalle':
                return $this->empleados_detalle();

            case 'empleado_detalle_editar':
                return $this->empleados_detalle_editar();

            case 'psicologos_listar':
                return $this->psicologos_listar();

            case 'actualizar_empleado':
                return $this->actualizar_empleado();

            case 'eliminar_empleado':
                return $this->empleados_eliminar();

            case 'obtener_horarios_por_empleado':
                return $this->obtenerHorariosPorEmpleado();

            case 'obtener_citas_psicologo':
                return $this->obtenerCitasPsicologo();

            //De aqui para abajo son funciones que no he modificado

            case 'validarClave':
                return $this->empleados_detalle();

            case 'Registrar_horario':
                return $this->HorarioPsicologo();

            case 'Actualizar_horario':
                return $this->actualizar_horario();

            case 'Obtener_horario':
                return $this->HorarioID();

            

            case 'Eliminar_horario':
                return $this->eliminar_horario();

            default:
                throw new Exception("Acción no válida.");
        }
    }

    private function registrar_empleado(){
        try {
            $query = "SELECT cedula FROM empleado WHERE cedula = :cedula";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);
            $stmt->execute();
            
            switch ($stmt->rowCount()) {
                case 0:
                    $query = "INSERT INTO empleado (nombre, apellido, tipo_cedula, cedula, correo, telefono, id_tipo_empleado, fecha_nacimiento, direccion, clave, estatus, fecha_creacion) 
                          VALUES (:nombre, :apellido, :tipo_cedula, :cedula, :correo, :telefono, :id_tipo_empleado, :fecha_nacimiento, :direccion, :clave, :estatus, CURDATE())";
                $stmt = $this->conn_security->prepare($query);
                $stmt->bindValue(':nombre', $this->__get('nombre'), PDO::PARAM_STR);
                $stmt->bindValue(':apellido', $this->__get('apellido'), PDO::PARAM_STR);
                $stmt->bindValue(':tipo_cedula', $this->__get('tipo_cedula'), PDO::PARAM_STR);
                $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);
                $stmt->bindValue(':correo', $this->__get('correo'), PDO::PARAM_STR);
                $stmt->bindValue(':telefono', $this->__get('telefono'), PDO::PARAM_STR);
                $stmt->bindValue(':id_tipo_empleado', $this->__get('id_tipo_empleado'), PDO::PARAM_INT);
                $stmt->bindValue(':fecha_nacimiento', $this->__get('fecha_nacimiento'), PDO::PARAM_STR);
                $stmt->bindValue(':direccion', $this->__get('direccion'), PDO::PARAM_STR);
                $stmt->bindValue(':clave', $this->__get('clave'), PDO::PARAM_STR);
                $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_INT);

                if ($stmt->execute()) {
                    return ['exito' => true, 'mensaje' => 'El empleado se registro exitosamente'];
                } else {
                    return ['exito' => false, 'error' => 'Error al registrar el empleado'];
                }
                default:
                    return ['exito' => false, 'error' => 'El empleado ya existe'];
            }
        } catch (Throwable $e) {
            error_log("Error BD: " . $e->getMessage()); 
            return [
                'exito' => false,
                'error' => "Error de base de datos. Consulta el log para detalles."
            ];
        }
    }
    private function obtenerTiposConServicio() {
        try {
            $query = "SELECT te.* 
                    FROM tipo_empleado te
                    LEFT JOIN dirpoles_business.servicio s ON te.id_servicios = s.id_servicios
                    WHERE te.tipo != 'Superusuario'
                    ";
            
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch(Throwable $e) {
            error_log("Error en obtenerTiposConServicio: " . $e->getMessage());
            return [];
        }
    }

    private function contarEmpleadosActivos(){
        try{
            $query = "SELECT COUNT(*) FROM empleado WHERE estatus = 1";
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchColumn();
        } catch (Throwable $e) {
            error_log('Error al contar empleados activos'. $e->getMessage());
            throw new Exception('Error al contar empleados activos: ' . $e->getMessage());
        }
    }

    private function contarEmpleadosInact(){
        try{
            $query = "SELECT COUNT(*) FROM empleado WHERE estatus = 0";
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchColumn();
        } catch (Throwable $e) {
            error_log('Error al contar empleados inactivos'. $e->getMessage());
            throw new Exception('Error al contar empleados inactivos: ' . $e->getMessage());
        }
    }

    private function contarEmpleadosNuevos(){
        try{
            $query = "SELECT COUNT(*) FROM empleado WHERE fecha_creacion >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)";
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchColumn();
        } catch (Throwable $e) {
            error_log('Error al contar empleados nuevos'. $e->getMessage());
            throw new Exception('Error al contar empleados nuevos: ' . $e->getMessage());
        }
    }

    private function contarEmpleados(){
        try{
            $query = "SELECT COUNT(*) FROM empleado";
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchColumn();
        } catch (Throwable $e) {
            error_log('Error al contar todos los empleados'. $e->getMessage());
            throw new Exception('Error al contar todos los empleados: ' . $e->getMessage());
        }
    }

    private function validarCedula() {
        try {
            $sql = "
                SELECT 1
                FROM (
                    SELECT tipo_cedula, cedula, id_empleado AS id FROM dirpoles_security.empleado
                    UNION ALL
                    SELECT tipo_cedula, cedula, id_beneficiario AS id FROM dirpoles_business.beneficiario
                    UNION ALL
                    SELECT tipo_documento AS tipo_cedula, num_documento AS cedula, id_proveedor AS id FROM dirpoles_business.proveedores
                ) AS documentos
                WHERE tipo_cedula = :tipo_cedula AND cedula = :cedula
            ";

            // Excluir el registro actual si se está editando
            if ($this->__get('id_empleado')) {
                $sql .= " AND id != :id_empleado";
            }
            if ($this->__get('id_beneficiario')) {
                $sql .= " AND id != :id_beneficiario";
            }
            if ($this->__get('id_proveedor')) {
                $sql .= " AND id != :id_proveedor";
            }

            $sql .= " LIMIT 1";

            $stmt = $this->conn_security->prepare($sql);
            $stmt->bindValue(':tipo_cedula', $this->__get('tipo_cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);

            // Bind de IDs si existen
            if ($this->__get('id_empleado')) {
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            }
            if ($this->__get('id_beneficiario')) {
                $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            }
            if ($this->__get('id_proveedor')) {
                $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'), PDO::PARAM_INT);
            }

            $stmt->execute();

            // Si existe algún registro, retornamos true
            return $stmt->fetch() ? true : false;

        } catch (Throwable $e) {
            error_log("Error al validar la cédula: " . $e->getMessage());
            return false;
        }
    }

    private function validarCorreo() {
        try {
            $sql = "
                SELECT 1
                FROM (
                    SELECT correo, id_beneficiario AS id FROM dirpoles_business.beneficiario
                    UNION ALL
                    SELECT correo, id_empleado AS id FROM empleado
                    UNION ALL
                    SELECT correo, id_proveedor AS id FROM dirpoles_business.proveedores
                ) AS correos
                WHERE correo = :correo
            ";

            // Excluir el registro actual si se está editando
            if ($this->__get('id_beneficiario')) {
                $sql .= " AND id != :id_beneficiario";
            }
            if ($this->__get('id_empleado')) {
                $sql .= " AND id != :id_empleado";
            }
            if ($this->__get('id_proveedor')) {
                $sql .= " AND id != :id_proveedor";
            }

            $sql .= " LIMIT 1";

            $stmt = $this->conn_security->prepare($sql);
            $stmt->bindValue(':correo', $this->__get('correo'), PDO::PARAM_STR);

            if ($this->__get('id_beneficiario')) {
                $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            }
            if ($this->__get('id_empleado')) {
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            }
            if ($this->__get('id_proveedor')) {
                $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'), PDO::PARAM_INT);
            }

            $stmt->execute();

            // Si existe algún registro, retornamos true
            return $stmt->fetch() ? true : false;

        } catch (Throwable $e) {
            error_log("Error al validar el correo: " . $e->getMessage());
            return false;
        }
    }

    private function validarTelefono() {
        try {
            $sql = "
                SELECT 1
                FROM (
                    SELECT telefono, id_beneficiario AS id FROM dirpoles_business.beneficiario
                    UNION ALL
                    SELECT telefono, id_empleado AS id FROM dirpoles_security.empleado
                    UNION ALL
                    SELECT telefono, id_proveedor AS id FROM dirpoles_business.proveedores
                ) AS telefonos
                WHERE telefono = :telefono
            ";

            // Excluir el registro actual si se está editando
            if ($this->__get('id_beneficiario')) {
                $sql .= " AND id != :id_beneficiario";
            }
            if ($this->__get('id_empleado')) {
                $sql .= " AND id != :id_empleado";
            }
            if ($this->__get('id_proveedor')) {
                $sql .= " AND id != :id_proveedor";
            }

            $sql .= " LIMIT 1";

            $stmt = $this->conn_security->prepare($sql);
            $stmt->bindValue(':telefono', $this->__get('telefono'), PDO::PARAM_STR);

            if ($this->__get('id_beneficiario')) {
                $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            }
            if ($this->__get('id_empleado')) {
                $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            }
            if ($this->__get('id_proveedor')) {
                $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'), PDO::PARAM_INT);
            }

            $stmt->execute();

            // Si existe algún registro, retornamos true
            return $stmt->fetch() ? true : false;

        } catch (Throwable $e) {
            error_log("Error al validar el teléfono: " . $e->getMessage());
            return false;
        }
    }

    private function empleados_listar(){
        try{
            $query = "
                SELECT 
                    e.id_empleado,
                    CONCAT(e.nombre, ' ', COALESCE(e.apellido, '')) AS nombre_completo,
                    e.tipo_cedula,
                    e.cedula,
                    CONCAT(e.tipo_cedula, '-', e.cedula) AS cedula_completa,
                    e.correo,
                    e.telefono,
                    te.tipo AS cargo,
                    e.estatus,
                    DATE_FORMAT(e.fecha_creacion, '%d/%m/%Y') AS fecha_registro
                FROM empleado e
                JOIN tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_emp 
                WHERE te.id_tipo_emp != 10 
                AND te.tipo != 'Superusuario'
                ORDER BY e.id_empleado ASC
            ";

            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch(Throwable $e){
            error_log('Error al listar los empleados: '. $e->getMessage());
            return []; // Devolver array vacío en caso de error
        }
    }

    private function empleados_detalle(){
        try{
            $query = "
                SELECT 
                    e.id_empleado,
                    CONCAT(e.nombre, ' ', COALESCE(e.apellido, '')) AS nombre_completo,
                    e.tipo_cedula,
                    e.cedula,
                    CONCAT(e.tipo_cedula, '-', e.cedula) AS cedula_completa,
                    e.correo,
                    e.telefono,
                    e.direccion,
                    te.tipo AS cargo,
                    e.estatus,
                    DATE_FORMAT(e.fecha_creacion, '%d/%m/%Y') AS fecha_registro
                FROM empleado e
                JOIN tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_emp 
                WHERE e.id_empleado = :id_empleado
            ";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log('Error al obtener el detalle del empleado: '. $e->getMessage());
            return [];
        }
    }

    private function empleados_detalle_editar(){
        try{
            $query = "
                SELECT 
                    e.id_empleado,
                    e.nombre,
                    e.apellido,
                    e.tipo_cedula,
                    e.cedula,
                    e.correo,
                    e.telefono,
                    e.direccion,
                    te.tipo,
                    e.id_tipo_empleado,
                    e.estatus,
                    e.fecha_nacimiento,
                    e.fecha_creacion
                FROM empleado e
                JOIN tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_emp 
                WHERE e.id_empleado = :id_empleado
            ";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log('Error al obtener el detalle del empleado: '. $e->getMessage());
            return [];
        }
    }

    private function psicologos_listar(){
        try{
            // Obtener datos de la sesión desde atributos del modelo
            $tipo_empleado = $this->__get('tipo_empleado');
            $id_empleado = $this->__get('id_empleado');
            
            $query = "SELECT 
                    e.id_empleado,
                    CONCAT(e.nombre, ' ', COALESCE(e.apellido, '')) AS nombre_completo,
                    e.tipo_cedula,
                    e.cedula,
                    CONCAT(e.tipo_cedula, '-', e.cedula) AS cedula_completa,
                    e.correo,
                    e.telefono,
                    te.tipo AS cargo
                FROM empleado e
                JOIN tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_emp
                WHERE te.tipo = 'Psicologo'";
            
            // Si es psicólogo, mostrar solo su registro
            if ($tipo_empleado === 'Psicologo' && $id_empleado) {
                $query .= " AND e.id_empleado = :id_empleado";
            }
            
            $stmt = $this->conn_security->prepare($query);
            
            if ($tipo_empleado === 'Psicologo' && $id_empleado) {
                $stmt->bindParam(':id_empleado', $id_empleado, PDO::PARAM_INT);
            }
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch(Throwable $e){
            error_log('Error al obtener los psicólogos: '. $e->getMessage());
            return [];
        }
    }

    private function actualizar_empleado(){
        try {
            $query = "UPDATE empleado SET  
                nombre = :nombre, 
                apellido = :apellido, 
                tipo_cedula = :tipo_cedula, 
                cedula = :cedula, 
                correo = :correo, 
                telefono = :telefono, 
                id_tipo_empleado = :id_tipo_empleado, 
                fecha_nacimiento = :fecha_nacimiento, 
                direccion = :direccion, 
                estatus = :estatus
                WHERE id_empleado = :id_empleado";

            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':nombre', $this->__get('nombre'), PDO::PARAM_STR);
            $stmt->bindValue(':apellido', $this->__get('apellido'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_cedula', $this->__get('tipo_cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':correo', $this->__get('correo'), PDO::PARAM_STR);
            $stmt->bindValue(':telefono', $this->__get('telefono'), PDO::PARAM_STR);
            $stmt->bindValue(':id_tipo_empleado', $this->__get('id_tipo_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':fecha_nacimiento', $this->__get('fecha_nacimiento'), PDO::PARAM_STR);
            $stmt->bindValue(':direccion', $this->__get('direccion'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_STR);

            if ($stmt->execute()) {
                return ['exito' => true, 'mensaje' => 'Empleado modificado exitosamente'];
            } else {
                return ['exito' => false, 'error' => 'Error al modificar el empleado'];
            }
        } catch (Throwable $e) {
            error_log("Error al actualizar el empleado: " . $e->getMessage());
            return [
                'exito' => false,
                'error' => "Error de base de datos: " . $e->getMessage()
            ];
        }
    }

    private function empleados_eliminar(){
        try {
            if ($this->validar_empleado_cita() || $this->validar_empleado_solicitud()) {
                throw new Exception('El empleado no puede ser eliminado porque tiene citas o solicitudes pendientes');
            }

            if ($this->validar_horario_eliminacion()) {
                throw new Exception('El empleado no puede ser eliminado porque tiene horarios asignados, debes eliminarlos primero');
            }

            if($this->consultar_notificaciones_eliminacion()){
                throw new Exception('El empleado no puede ser eliminado porque tiene notificaciones pendientes');
            }

            if($this->validar_empleado_referencias()){
                throw new Exception('El empleado no puede ser eliminado porque tiene referencias realizadas o pendientes');
            }
            
            $query = "DELETE FROM empleado WHERE id_empleado = :id_empleado";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);

            // Ejecuta una sola vez y almacena el resultado
            $resultado = $stmt->execute();
            if (!$resultado) {
                throw new Exception('Error al eliminar empleado.');
            }

            return [
                "exito" => true,
                "mensaje" => "Empleado eliminado exitosamente"
            ];

        } catch (Throwable $e) {
            error_log("Error BD: " . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    private function validar_empleado_solicitud(){
        $query = "SELECT id_empleado FROM dirpoles_business.solicitud_de_servicio WHERE id_empleado = :id_empleado";
        $stmt = $this->conn_security->prepare($query);
        $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    private function validar_empleado_cita(){
        $query = "SELECT id_empleado FROM dirpoles_business.cita WHERE id_empleado = :id_empleado";
        $stmt = $this->conn_security->prepare($query);
        $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    private function consultar_notificaciones_eliminacion(){
        $query = "SELECT id_emisor, id_receptor 
                FROM notificaciones_empleados 
                WHERE id_emisor = :id_empleado OR id_receptor = :id_empleado";
        $stmt = $this->conn_security->prepare($query);
        $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT); // Solo se necesita un bind
        $stmt->execute();

        return $stmt->rowCount() > 0; 
    }
    private function validar_empleado_referencias(){ 
        try{
            $query = "SELECT id_empleado_origen, id_empleado_destino FROM dirpoles_business.referencias WHERE id_empleado_destino = :id_empleado OR id_empleado_origen = :id_empleado";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            if($stmt->execute()){
                return $stmt->rowCount() > 0;
            }else{
                return false;
            }
        } catch (Throwable $e){
            error_log("Error validando empleado en referencias: " . $e->getMessage());
            return false;
        }
    }


    //HORARIO DE PSICÓLOGOS
    private function HorarioPsicologo() {
        try {
            //Validar rango de horas antes de insertar
            if (strtotime($this->__get('hora_inicio')) < strtotime('07:00') || strtotime($this->__get('hora_fin')) > strtotime('16:00')) {
                return [
                    "status" => false,
                    "mensaje" => "El horario debe estar entre las 07:00 y las 16:00"
                ];
            }
            
            //Verificar si el empleado ya tiene registrado un horario para el día indicado
            if ($this->verificarDiaExistente($this->__get('id_empleado'), $this->__get('dia_semana'))) {
                return [
                    "status" => false,
                    "mensaje" => "Ya existe un horario registrado para ese día."
                ];
            }
            
            // Insertar el nuevo horario
            $query = "INSERT INTO dirpoles_business.horario (id_empleado, dia_semana, hora_inicio, hora_fin) 
                    VALUES (:id_empleado, :dia_semana, :hora_inicio, :hora_fin)";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':dia_semana', $this->__get('dia_semana'), PDO::PARAM_STR);
            $stmt->bindValue(':hora_inicio', $this->__get('hora_inicio'), PDO::PARAM_STR);
            $stmt->bindValue(':hora_fin', $this->__get('hora_fin'), PDO::PARAM_STR);
            $stmt->execute();
            
            return [
                "status" => true,
                "mensaje" => "Horario registrado exitosamente"
            ];
            
        } catch (Throwable $e) {
            error_log($e->getMessage());
            return [
                "status" => false,
                "mensaje" => "Error al registrar el horario: " . $e->getMessage()
            ];
        }
    }

    private function obtenerCitasPsicologo(){
        try{
            $query = "SELECT 
                        DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha,
                        TIME_FORMAT(c.hora, '%H:%i') as hora
                    FROM dirpoles_business.cita c
                    WHERE c.id_empleado = :id_empleado
                    AND c.estatus = 1  -- Solo citas activas
                    AND c.fecha >= CURDATE()  -- Solo futuras
                    AND c.fecha <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
            
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en obtenerCitasPsicologo: " . $e->getMessage());
            // No lanzamos excepción, devolvemos array vacío
            return [];
        }
    }

    private function verificarDiaExistente($idEmpleado, $diaSemana){
        try{
            $sql = "SELECT COUNT(*) as total FROM dirpoles_business.horario WHERE id_empleado = :id_empleado AND dia_semana = :dia_semana";
            $stmt = $this->conn_security->prepare($sql);
            $stmt->bindParam(':id_empleado', $idEmpleado, PDO::PARAM_INT);
            $stmt->bindParam(':dia_semana', $diaSemana, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['total'] > 0;
        } catch(Throwable $e){
            error_log($e->getMessage());
            throw new Exception("Error al verificar si el día ya existe: " . $e->getMessage());
        }
    }

    private function obtenerHorariosPorEmpleado(){
        try{
            $query = "SELECT 
                        id_horario, 
                        dia_semana, 
                        TIME_FORMAT(hora_inicio, '%H:%i') as hora_inicio,
                        TIME_FORMAT(hora_fin, '%H:%i') as hora_fin 
                    FROM dirpoles_business.horario 
                    WHERE id_empleado = :id_empleado";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir a formato más manejable
            return array_map(fn($horario) => [
                'dia_semana' => $horario['dia_semana'],
                'hora_inicio' => $horario['hora_inicio'],
                'hora_fin' => $horario['hora_fin']
            ], $resultados);

        } catch(Throwable $e){
            error_log("Error en obtenerHorariosPorEmpleado: " . $e->getMessage());
            throw new Exception("Error al obtener los horarios por empleado: " . $e->getMessage());
        }
    }

    private function HorarioID(){
        try {
            
            $query = "SELECT id_horario, id_empleado, dia_semana, hora_inicio, hora_fin 
                    FROM dirpoles_business.horario 
                    WHERE id_horario = :id_horario";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_horario', $this->__get('id_horario'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log($e->getMessage());
            throw new Exception("Error al obtener el horario por ID: " . $e->getMessage());
        }
    }

    private function actualizar_horario() {
        try {
            if (strtotime($this->__get('hora_inicio')) < strtotime('07:00') || strtotime($this->__get('hora_fin')) > strtotime('16:00')) {
                return [
                    "status" => false,
                    "mensaje" => "El horario debe estar entre las 07:00AM y las 4:00PM"
                ];
            }
            
            if ($this->verificarDiaExistenteActualizacion($this->__get('id_empleado'),$this->__get('dia_semana'),$this->__get('id_horario'))) {
                return [
                    "status" => false,
                    "mensaje" => "Ya existe un horario registrado para ese día."
                ];
            }
            
            // Actualizar el horario
            $query = "UPDATE dirpoles_business.horario 
                    SET dia_semana = :dia_semana, 
                        hora_inicio = :hora_inicio, 
                        hora_fin = :hora_fin 
                    WHERE id_horario = :id_horario";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_horario', $this->__get('id_horario'), PDO::PARAM_INT);
            $stmt->bindValue(':dia_semana', $this->__get('dia_semana'), PDO::PARAM_STR);
            $stmt->bindValue(':hora_inicio', $this->__get('hora_inicio'), PDO::PARAM_STR);
            $stmt->bindValue(':hora_fin', $this->__get('hora_fin'), PDO::PARAM_STR);
            $stmt->execute();
            
            return [
                "status" => true,
                "mensaje" => "Horario actualizado exitosamente"
            ];
            
        } catch (Throwable $e) {
            error_log($e->getMessage());
            return [
                "status" => false,
                "mensaje" => "Error al actualizar el horario: " . $e->getMessage()
            ];
        }
    }

    private function verificarDiaExistenteActualizacion($idEmpleado, $diaSemana, $idHorario) {
        try {
            
            $query = "SELECT COUNT(*) as total 
                    FROM dirpoles_business.horario 
                    WHERE id_empleado = :id_empleado 
                        AND dia_semana = :dia_semana 
                        AND id_horario != :id_horario";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $idEmpleado, PDO::PARAM_INT);
            $stmt->bindValue(':dia_semana', $diaSemana, PDO::PARAM_STR);
            $stmt->bindValue(':id_horario', $idHorario, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['total'] > 0;
        } catch (Throwable $e) {
            error_log("Error en verificarDiaExistenteActualizacion: " . $e->getMessage());
            throw new Exception("Error al verificar horario duplicado: " . $e->getMessage());
        }
    }

    private function eliminar_horario(){
        try{
            $query = "DELETE FROM dirpoles_business.horario WHERE id_horario = :id_horario ";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_horario', $this->__get('id_horario'), PDO::PARAM_INT);
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Horario eliminado exitosamente"
            ];

        } catch(Throwable $e){
            error_log($e->getMessage());
            throw new Exception("Error al eliminar horario: " . $e->getMessage());
        }
    }

    private function validar_horario_eliminacion(){
        try{
            $query = "SELECT id_horario, dia_semana, hora_inicio, hora_fin FROM dirpoles_business.horario WHERE id_empleado = :id_empleado";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->rowCount() > 0;

        } catch(Throwable $e){
            error_log($e->getMessage());
            throw new Exception("Error al obtener los horarios por empleado: " . $e->getMessage());
        }
    }
}
