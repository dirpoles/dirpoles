<?php
namespace App\Models;
use App\Models\BusinessModel;
use PDO;
use Throwable;
use Exception;
use InvalidArgumentException;
use DateTime;

class BeneficiarioModel extends BusinessModel{
    private $atributos = [];

    public function __set($nombre, $valor) {
        // Trim y sanitización básica
        $valor = \is_string($valor) ? trim($valor) : $valor;
        
        // Transformaciones básicas
        if (\in_array($nombre, ['nombres', 'apellidos'])) {
            $valor = mb_convert_case($valor, MB_CASE_TITLE, "UTF-8");
        }
        
        if ($nombre === 'direccion') {
            $valor = ucfirst(mb_strtolower($valor, "UTF-8"));
        }
        
        if (\in_array($nombre, ['tipo_cedula', 'genero', 'seccion'])) {
            $valor = strtoupper($valor);
        }
        
        if ($nombre === 'correo') {
            $valor = strtolower($valor);
        }
        
        if ($nombre === 'cedula') {
            $valor = preg_replace('/\D/', '', $valor);
        }
        
        if ($nombre === 'telefono') {
            $valor = preg_replace('/\D/', '', $valor);
        }
        
        // Validaciones específicas por campo
        $validaciones = [
            'id_beneficiario' => fn($v) => is_numeric($v) && $v > 0,
            'nombres' => fn($v) => !empty($v) && preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/u', $v),
            'apellidos' => fn($v) => !empty($v) && preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/u', $v),
            'tipo_cedula' => fn($v) => in_array(strtoupper($v), ['V', 'E']),
            'cedula' => fn($v) => !empty($v) && preg_match('/^\d{7,8}$/', $v),
            'fecha_nac' => function($v) {
                if (empty($v)) return false;
                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $v)) return false;
                
                // Validar que sea una fecha real
                $fecha = DateTime::createFromFormat('Y-m-d', $v);
                if (!$fecha || $fecha->format('Y-m-d') !== $v) return false;
                
                // Validar edad mínima (15 años)
                $hoy = new DateTime();
                $edad = $hoy->diff($fecha)->y;
                return $edad >= 15;
            },
            'telefono' => fn($v) => !empty($v) && preg_match('/^\d{11}$/', $v),
            'correo' => function($v) {
                if (empty($v)) return false;
                if (!filter_var($v, FILTER_VALIDATE_EMAIL)) return false;
                
                // Validar dominios permitidos
                $dominiosPermitidos = ['hotmail', 'yahoo', 'gmail', 'outlook', 'uptaeb'];
                $dominio = strtolower(substr(strrchr($v, "@"), 1));
                
                foreach ($dominiosPermitidos as $permitido) {
                    if (strpos($dominio, $permitido . '.') === 0) return true;
                }
                
                return true; // Permitir otros dominios si no se restringe
            },
            'genero' => fn($v) => in_array(strtoupper($v), ['M', 'F']),
            'direccion' => fn($v) => !empty($v) && preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,.\-#]{5,250}$/u', $v),
            'estatus' => fn($v) => in_array($v, [0, 1, '0', '1'], true),
            'seccion' => fn($v) => !empty($v) && preg_match('/^[1-4][0-9]{3}-[MCJUB]$/', $v),
            'id_pnf' => fn($v) => is_numeric($v) && $v > 0
        ];
        
        // Aplicar validación si existe para este campo
        if (isset($validaciones[$nombre]) && !$validaciones[$nombre]($valor)) {
            $mensajesError = [
                'id_beneficiario' => 'ID de beneficiario inválido',
                'nombres' => 'Los nombres deben contener solo letras y espacios (2-50 caracteres)',
                'apellidos' => 'Los apellidos deben contener solo letras y espacios (2-50 caracteres)',
                'tipo_cedula' => 'El tipo de cédula debe ser V o E',
                'cedula' => 'La cédula debe contener 7 u 8 dígitos numéricos',
                'fecha_nac' => 'Fecha de nacimiento inválida o edad menor a 15 años',
                'telefono' => 'El teléfono debe tener 11 dígitos (4 prefijo + 7 número)',
                'correo' => 'Correo electrónico inválido',
                'genero' => 'El género debe ser M (Masculino) o F (Femenino)',
                'direccion' => 'La dirección debe tener entre 5 y 250 caracteres y solo puede contener letras, números, espacios, comas, puntos, guiones y #',
                'estatus' => 'El estatus debe ser 0 (Inactivo) o 1 (Activo)',
                'seccion' => 'La sección debe tener formato NNNN-S (ej: 3101-B)',
                'id_pnf' => 'El PNF seleccionado es inválido'
            ];
            
            $mensaje = $mensajesError[$nombre] ?? "Valor inválido para $nombre";
            throw new InvalidArgumentException($mensaje);
        }
        
        $this->atributos[$nombre] = $valor;
    }

    public function __get($name){
        return $this->atributos[$name];
    }

    public function manejarAccion($action){
        switch ($action) {
            case 'obtener_pnf':
                return $this->obtenerPNF();

            case 'obtener_beneficiario':
                return $this->obtenerBeneficiario();
                
            case 'registrar_beneficiario':
                return $this->registrar_beneficiario();

            case 'consultar_beneficiarios':
                return $this->consultarBeneficiarios();
            
            case 'consultar_beneficiarios_activos':
                return $this->consultar_beneficiarios_activos();
            
            case 'beneficiarios_totales':
                return $this->contarBeneficiarios();

            case 'beneficiarios_activos':
                return $this->BeneficiariosActivos();

            case 'beneficiarios_inactivos':
                return $this->BeneficiariosInactivos();

            case 'beneficiarios_con_diagnosticos':
                return $this->BeneficiariosConDiagnosticos();

            case 'beneficiario_detalle':
                return $this->beneficiario_detalle();

            case 'beneficiario_detalle_editar':
                return $this->beneficiario_detalle_editar();

            case 'actualizar_beneficiario':
                return $this->actualizar_beneficiario();

            case 'eliminar_beneficiario':
                return $this->eliminar_beneficiario();


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
            return $resultado ? $resultado['nombre_completo'] : '';

        } catch(Throwable $e){
            return "Beneficiario desconocido"; 
        }
    }

    private function contarBeneficiarios() {
        try {
            $query = "SELECT COUNT(*) as total FROM beneficiario";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['total'] ?? 0;

        } catch(Throwable $e) {
            error_log("Error en contarBeneficiarios: " . $e->getMessage());
            return 0;
        }
    }

    private function BeneficiariosActivos() {
        try {
            $query = "SELECT COUNT(*) as total FROM beneficiario WHERE estatus = 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['total'] ?? 0;

        } catch(Throwable $e) {
            error_log("Error en BeneficiariosActivos: " . $e->getMessage());
            return 0;
        }
    }

    private function BeneficiariosInactivos() {
        try {
            $query = "SELECT COUNT(*) as total FROM beneficiario WHERE estatus = 0";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['total'] ?? 0;

        } catch(Throwable $e) {
            error_log("Error en BeneficiariosInactivos: " . $e->getMessage());
            return 0;
        }
    }

    private function BeneficiariosConDiagnosticos() {
        try {
            // Contar beneficiarios DISTINCT que tienen al menos una solicitud de servicio
            $query = "SELECT COUNT(DISTINCT b.id_beneficiario) as total 
                    FROM beneficiario b
                    INNER JOIN solicitud_de_servicio s ON b.id_beneficiario = s.id_beneficiario";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['total'] ?? 0;

        } catch(Throwable $e) {
            error_log("Error en BeneficiariosConDiagnosticos: " . $e->getMessage());
            return 0;
        }
    }

    private function obtenerPNF(){
        $query = "SELECT * FROM pnf WHERE estatus = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function registrar_beneficiario(){
        try{
            $query = "SELECT cedula FROM beneficiario WHERE cedula = :cedula";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);
            $stmt->execute();

            if($stmt->rowCount()){
                throw new Exception('Ya existe un beneficiario registrado con la cédula ingresada');
            }

            $query = "INSERT INTO beneficiario (id_pnf, seccion, nombres, apellidos, tipo_cedula, cedula, fecha_nac, telefono, correo, genero, direccion, estatus, fecha_creacion) 
                          VALUES (:id_pnf, :seccion, :nombres, :apellidos, :tipo_cedula, :cedula, :fecha_nac, :telefono, :correo, :genero, :direccion, :estatus, CURDATE())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_pnf', $this->__get('id_pnf'), PDO::PARAM_STR);
            $stmt->bindValue(':seccion', $this->__get('seccion'), PDO::PARAM_STR);
            $stmt->bindValue(':nombres', $this->__get('nombres'), PDO::PARAM_STR);
            $stmt->bindValue(':apellidos', $this->__get('apellidos'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_cedula', $this->__get('tipo_cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_nac', $this->__get('fecha_nac'), PDO::PARAM_STR);
            $stmt->bindValue(':telefono', $this->__get('telefono'), PDO::PARAM_STR);
            $stmt->bindValue(':correo', $this->__get('correo'), PDO::PARAM_STR);
            $stmt->bindValue(':genero', $this->__get('genero'), PDO::PARAM_STR);
            $stmt->bindValue(':direccion', $this->__get('direccion'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_INT);
            $stmt->execute();

            return ['exito' => true, 'mensaje' => 'El beneficiario se registro exitosamente'];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function consultarBeneficiarios(){
        try{
            $query = "
            SELECT 
                b.id_beneficiario,
                b.nombres,
                b.apellidos,
                CONCAT(b.nombres, ' ', COALESCE(b.apellidos, '')) AS nombre_completo,
                b.tipo_cedula,
                b.cedula,
                CONCAT(b.tipo_cedula, '-', b.cedula) AS cedula_completa,
                b.fecha_nac,
                b.telefono,
                b.correo,
                IF(b.genero = 'M', 'Masculino', 'Femenino') AS genero,
                b.direccion,
                b.estatus,
                DATE_FORMAT(b.fecha_creacion, '%d/%m/%Y %H:%i') AS fecha_registro,
                b.seccion,
                pnf.nombre_pnf,
                pnf.id_pnf
            FROM beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            ORDER BY b.fecha_creacion DESC
            ";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en consultarBeneficiarios: " . $e->getMessage());
            return [
                'exito' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function consultar_beneficiarios_activos(){
        try{
            $query = "
            SELECT 
                b.id_beneficiario,
                b.nombres,
                b.apellidos,
                CONCAT(b.nombres, ' ', COALESCE(b.apellidos, '')) AS nombre_completo,
                b.tipo_cedula,
                b.cedula,
                CONCAT(b.tipo_cedula, '-', b.cedula) AS cedula_completa,
                b.fecha_nac,
                b.telefono,
                b.correo,
                IF(b.genero = 'M', 'Masculino', 'Femenino') AS genero,
                b.direccion,
                b.estatus,
                DATE_FORMAT(b.fecha_creacion, '%d/%m/%Y %H:%i') AS fecha_registro,
                b.seccion,
                pnf.nombre_pnf,
                pnf.id_pnf
            FROM beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            WHERE b.estatus = 1
            ORDER BY b.fecha_creacion DESC
            ";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en consultarBeneficiariosActivos: " . $e->getMessage());
            return [
                'exito' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function beneficiario_detalle(){
        try{
            $query = "
            SELECT 
                b.id_beneficiario,
                b.nombres,
                b.apellidos,
                CONCAT(b.nombres, ' ', COALESCE(b.apellidos, '')) AS nombre_completo,
                b.tipo_cedula,
                b.cedula,
                CONCAT(b.tipo_cedula, '-', b.cedula) AS cedula_completa,
                b.fecha_nac,
                b.telefono,
                b.correo,
                IF(b.genero = 'M', 'Masculino', 'Femenino') AS genero,
                b.direccion,
                b.estatus,
                DATE_FORMAT(b.fecha_creacion, '%d/%m/%Y %H:%i') AS fecha_registro,
                b.seccion,
                pnf.nombre_pnf,
                pnf.id_pnf
            FROM beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            WHERE b.id_beneficiario = :id_beneficiario
            ";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en beneficiario_detalle: " . $e->getMessage());
            return [
                'exito' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function beneficiario_detalle_editar(){
        try{
            $query = "
            SELECT 
                b.id_beneficiario,
                b.nombres,
                b.apellidos,
                b.tipo_cedula,
                b.cedula,
                b.fecha_nac,
                b.telefono,
                b.correo,
                b.genero,
                b.direccion,
                b.estatus,
                b.seccion,
                pnf.nombre_pnf,
                pnf.id_pnf
            FROM beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            WHERE b.id_beneficiario = :id_beneficiario
            ";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en beneficiario_detalle_editar: " . $e->getMessage());
            return [
                'exito' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function actualizar_beneficiario(){
        try{
            $query = "SELECT cedula, tipo_cedula FROM beneficiario WHERE (cedula = :cedula AND tipo_cedula = :tipo_cedula) AND id_beneficiario != :id_beneficiario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_cedula', $this->__get('tipo_cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_STR);
            $stmt->execute();

            if($stmt->rowCount() !== 0){
                throw new Exception('Ya existe un beneficiario con la cedula ' . $this->__get('cedula'));
            }

            $query = "UPDATE beneficiario SET 
                id_pnf = :id_pnf,
                seccion = :seccion,
                nombres = :nombres,
                apellidos = :apellidos,
                tipo_cedula = :tipo_cedula,
                cedula = :cedula,
                fecha_nac = :fecha_nac,
                telefono = :telefono,
                correo = :correo,
                genero = :genero,
                direccion = :direccion,
                estatus = :estatus
            WHERE id_beneficiario = :id_beneficiario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_pnf', $this->__get('id_pnf'), PDO::PARAM_INT);
            $stmt->bindValue(':seccion', $this->__get('seccion'), PDO::PARAM_STR);
            $stmt->bindValue(':nombres', $this->__get('nombres'), PDO::PARAM_STR);
            $stmt->bindValue(':apellidos', $this->__get('apellidos'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_cedula', $this->__get('tipo_cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_nac', $this->__get('fecha_nac'), PDO::PARAM_STR);
            $stmt->bindValue(':telefono', $this->__get('telefono'), PDO::PARAM_STR);
            $stmt->bindValue(':correo', $this->__get('correo'), PDO::PARAM_STR);
            $stmt->bindValue(':genero', $this->__get('genero'), PDO::PARAM_STR);
            $stmt->bindValue(':direccion', $this->__get('direccion'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_INT);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt->execute();

            if($stmt->rowCount() !== 0){
                return [
                    'exito' => true,
                    'mensaje' => 'Beneficiario actualizado correctamente'
                ];
            }else{
                throw new Exception('No se encontro el beneficiario con el id ' . $this->__get('id_beneficiario'));
            }            
            
        } catch(Throwable $e){
            error_log("Error en actualizar_beneficiario: " . $e->getMessage());
            return [
                'exito' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function eliminar_beneficiario() {
        try {
            if (!isset($this->atributos['id_beneficiario'])) {
                throw new Exception('ID de beneficiario no proporcionado');
            }
            
            if($this->validar_beneficiario_solicitud()) {
                throw new Exception('El beneficiario no puede ser eliminado porque tiene diagnosticos realizados');
            }
            
            if($this->validar_beneficiario_cita()) {
                throw new Exception('El beneficiario no puede ser eliminado porque tiene citas programadas');
            }
            
            if($this->validar_beneficiario_referencias()) {
                throw new Exception('El beneficiario no puede ser eliminado porque tiene referencias');
            }
            
            $query = "DELETE FROM beneficiario WHERE id_beneficiario = :id_beneficiario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->atributos['id_beneficiario'], PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return [
                    'exito' => true,
                    'mensaje' => 'Beneficiario eliminado correctamente'
                ];
            } else {
                throw new Exception('No se pudo eliminar el beneficiario');
            }
            
        } catch(Throwable $e) {
            error_log("Error en eliminar_beneficiario: " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function validar_beneficiario_solicitud(){
        try{
            $query = "SELECT id_beneficiario FROM solicitud_de_servicio WHERE id_beneficiario = :id_beneficiario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            if($stmt->execute()){
                return $stmt->rowCount() > 0;
            }else{
                return false;
            }
        } catch (Throwable $e) {
            error_log("Error validando beneficiario en solicitud: " . $e->getMessage());
            return false;
        }
    }

    private function validar_beneficiario_cita(){
        try {
            $query = "SELECT id_beneficiario FROM cita WHERE id_beneficiario = :id_beneficiario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->rowCount() > 0;
        } catch (Throwable $e) {
            error_log("Error validando beneficiario en cita: " . $e->getMessage());
            return false;
        }
    }

    private function validar_beneficiario_referencias(){ //Validar si el beneficiario ha sido referido
        try{
            $query = "SELECT id_beneficiario FROM referencias WHERE id_beneficiario = :id_beneficiario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            if($stmt->execute()){
                return $stmt->rowCount() > 0;
            }else{
                return false;
            }
        } catch (Throwable $e){
            error_log("Error validando beneficiario en referencias: " . $e->getMessage());
            return false;
        }
    }
}