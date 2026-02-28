<?php
namespace App\Models;
use App\Models\BusinessModel;
use Exception;
use Throwable;
use PDO;
use function in_array;

class CitasModel extends BusinessModel{
    private $atributos = [];

    public function __set($name, $value){
        switch($name){
            case 'id_beneficiario':
            case 'id_empleado':
            case 'id_cita':
            case 'estatus':
                // Validar que sea un entero positivo
                if(!is_numeric($value) || \intval($value) <= 0){
                    throw new Exception("El campo $name debe ser un número entero válido.");
                }
                break;

            case 'fecha':
                // Validar formato Y-m-d
                $d = \DateTime::createFromFormat('Y-m-d', $value);
                if(!($d && $d->format('Y-m-d') === $value)){
                    throw new Exception("La fecha debe tener el formato YYYY-MM-DD.");
                }
                break;

            case 'hora':
                // Validar formato H:i
                // Permitimos H:i y H:i:s por flexibilidad interna, pero el input suele ser H:i
                if(!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/', $value)){
                    throw new Exception("La hora debe tener el formato HH:MM válido.");
                }
                break;
        }
        $this->atributos[$name] = $value;
    }

    public function __get($name){
        return $this->atributos[$name];
    }

    public function manejarAccion($action){
        switch($action){
            case 'registrar_cita':
                return $this->registrarCita();

            case 'obtener_beneficiario_cita':
                return $this->obtenerBeneficiario();

            case 'obtener_empleado_cita':
                return $this->obtener_empleado_cita();

            case 'citasTotales':
                return $this->contarCitasTotales();

            case 'estadisticas':
                return $this->EstadisticasDashboard();

            case 'consultar_citas':
                return $this->consultar_citas();

            case 'cita_detalle':
                return $this->cita_detalle();

            case 'cita_detalle_editar':
                return $this->cita_detalle_editar();

            case 'obtener_dias_psicologo':
                return $this->obtener_dias_psicologo();

            case 'verificar_dia_psicologo':
                return $this->verificar_dia_psicologo();

            case 'verificar_hora_en_rango':
                return $this->verificar_hora_en_rango();

            case 'verificar_disponibilidad_hora':
                return $this->verificar_disponibilidad_hora();

            case 'actualizar_cita':
                return $this->actualizar_cita();

            case 'eliminar_cita':
                return $this->eliminar_cita();

            case 'obtener_estados_cita':
                return $this->obtener_estados_cita();

            case 'actualizar_estado_cita':
                return $this->actualizar_estado_cita();

            case 'obtener_estatus':
                return $this->obtener_estatus();

            case 'obtener_citas_calendario':
                return $this->obtenerCitasCalendario();

            default:
                throw new Exception('Acción no permitida');
        }
    }

    private function registrarCita(){
        try{
            $query = "INSERT INTO cita (fecha, hora, id_beneficiario, id_empleado, estatus, fecha_creacion) VALUES (:fecha, :hora, :id_beneficiario, :id_empleado, :estatus, CURDATE())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':fecha', $this->__get('fecha'), PDO::PARAM_STR);
            $stmt->bindValue(':hora', $this->__get('hora'), PDO::PARAM_STR);
            $stmt->bindValue(':id_beneficiario', $this->__get('id_beneficiario'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_INT);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Cita registrada correctamente',
            ];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
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

    private function obtener_empleado_cita(){
        try{
            $query = "SELECT 
                nombre, 
                apellido, 
                cedula, 
                tipo_cedula, 
                CONCAT(nombre, ' ', COALESCE(apellido, '')) AS nombre_completo,
                CONCAT(tipo_cedula, '-', cedula) AS cedula_completa
            FROM dirpoles_security.empleado 
            WHERE id_empleado = :id_empleado";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function contarCitasTotales(){
        try{
            // Determinar si es admin/superusuario
            $es_admin = $_SESSION['tipo_empleado'] === 'Administrador' || $_SESSION['tipo_empleado'] === 'Superusuario';
            
            $query = $es_admin 
                ? "SELECT COUNT(*) as total FROM cita" 
                : "SELECT COUNT(*) as total FROM cita WHERE id_empleado = :id_empleado";
            
            $stmt = $this->conn->prepare($query);
            
            // Solo hacer bind si NO es admin
            if(!$es_admin){
                $id_empleado = $this->__get('id_empleado');
                $stmt->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            }
            
            $stmt->execute();
            $resultado = $stmt->fetchColumn(); 
            
            // Devolver estructura consistente
            return [
                'exito' => true,
                'total' => (int)$resultado 
            ];

        }catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function EstadisticasDashboard(){
        try{
            // Determinar si es admin/superusuario
            $es_admin = $_SESSION['tipo_empleado'] === 'Administrador' || $_SESSION['tipo_empleado'] === 'Superusuario';
            
            $query = $es_admin 
                ? "SELECT 
                    COUNT(*) as total,
                    COALESCE(SUM(CASE WHEN estatus = 1 THEN 1 ELSE 0 END), 0) as pendientes,
                    COALESCE(SUM(CASE WHEN estatus IN (4, 5) THEN 1 ELSE 0 END), 0) as rechazadas,
                    COALESCE(SUM(CASE WHEN estatus = 3 THEN 1 ELSE 0 END), 0) as atendidas
                FROM cita" 
                : "SELECT 
                    COUNT(*) as total,
                    COALESCE(SUM(CASE WHEN estatus = 1 THEN 1 ELSE 0 END), 0) as pendientes,
                    COALESCE(SUM(CASE WHEN estatus IN (4, 5) THEN 1 ELSE 0 END), 0) as rechazadas,
                    COALESCE(SUM(CASE WHEN estatus = 3 THEN 1 ELSE 0 END), 0) as atendidas
                FROM cita WHERE id_empleado = :id_empleado";
            
            $stmt = $this->conn->prepare($query);
            
            // Solo hacer bind si NO es admin
            if(!$es_admin){
                $id_empleado = $this->__get('id_empleado');
                $stmt->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            }
            
            $stmt->execute();
            $datos = $stmt->fetch(PDO::FETCH_ASSOC);
            $datos = array_map('intval', $datos);
            
            // Estructura CORRECTA
            return [
                'exito' => true,
                'data' => $datos  // ← 'data' contiene el array completo
            ];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage(),
                'data' => [
                    'total' => 0,
                    'pendientes' => 0,
                    'rechazadas' => 0,
                    'atendidas' => 0
                ]
            ];
        }
    }

    private function consultar_citas(){
        try{
            // Verificar el tipo de usuario para filtrar
            $tipo_empleado = $this->__get('tipo_empleado') ?? $_SESSION['tipo_empleado'] ?? '';
            $id_empleado = $this->__get('id_empleado') ?? $_SESSION['id_empleado'] ?? null;
            
            // Construir query base
            $query = "SELECT 
                    c.id_cita,
                    DATE_FORMAT(c.fecha, '%d/%m/%Y') as fecha_formateada,
                    c.fecha,
                    TIME_FORMAT(c.hora, '%h:%i %p') as hora_formateada,
                    c.hora,
                    CONCAT(b.nombres, ' ', b.apellidos) AS beneficiario,
                    b.cedula,
                    b.tipo_cedula,
                    b.id_beneficiario,
                    CONCAT(b.tipo_cedula, '-', b.cedula) as cedula_beneficiario,
                    CONCAT(e.nombre, ' ', e.apellido) AS empleado,
                    c.estatus
                FROM cita c
                JOIN beneficiario b ON c.id_beneficiario = b.id_beneficiario
                JOIN dirpoles_security.empleado e ON c.id_empleado = e.id_empleado";
            
            // Filtrar por psicólogo si no es admin/superusuario
            if (!in_array($tipo_empleado, ['Administrador', 'Superusuario']) && $id_empleado) {
                $query .= " WHERE c.id_empleado = :id_empleado";
            }
            
            $query .= " ORDER BY c.fecha_creacion DESC";
            
            $stmt = $this->conn->prepare($query);
            
            if (!in_array($tipo_empleado, ['Administrador', 'Superusuario']) && $id_empleado) {
                $stmt->bindParam(':id_empleado', $id_empleado, PDO::PARAM_INT);
            }
            
            $stmt->execute();
            $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'exito' => true,
                'data' => $citas
            ];

        } catch(Throwable $e){
            error_log("Error en consultar_citas: " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error en la base de datos: ' . $e->getMessage(),
                'data' => []
            ];
        }
    }

    private function cita_detalle(){
        try{
            $query = "
            SELECT
                c.id_cita,
                DATE_FORMAT(c.fecha, '%d/%m/%Y') as fecha_formateada,
                c.fecha,
                TIME_FORMAT(c.hora, '%h:%i %p') as hora_formateada,
                c.hora,
                CONCAT(b.nombres, ' ', b.apellidos) AS beneficiario,
                b.cedula,
                b.tipo_cedula,
                CONCAT(b.tipo_cedula, '-', b.cedula) as cedula_beneficiario,
                CONCAT(e.nombre, ' ', e.apellido) AS empleado,
                c.estatus
            FROM cita c
            JOIN beneficiario b ON c.id_beneficiario = b.id_beneficiario
            JOIN dirpoles_security.empleado e ON c.id_empleado = e.id_empleado
            WHERE c.id_cita = :id_cita
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_cita', $this->__get('id_cita'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en cita_detalle: " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function cita_detalle_editar(){
        try{
            $query = "
            SELECT
                c.id_cita,
                c.fecha,
                c.hora,
                CONCAT(b.nombres, ' ', b.apellidos) AS beneficiario,
                b.cedula,
                b.tipo_cedula,
                CONCAT(b.tipo_cedula, '-', b.cedula) as cedula_beneficiario,
                CONCAT(e.nombre, ' ', e.apellido) AS empleado,
                e.id_empleado,
                c.estatus,
                c.id_beneficiario
            FROM cita c
            JOIN beneficiario b ON c.id_beneficiario = b.id_beneficiario
            JOIN dirpoles_security.empleado e ON c.id_empleado = e.id_empleado
            WHERE c.id_cita = :id_cita
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_cita', $this->__get('id_cita'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    // Método para verificar si un psicólogo trabaja un día específico
    private function verificar_dia_psicologo() {
        try {
            // Consulta optimizada: solo cuenta si existe
            $query = "SELECT COUNT(*) as total 
                    FROM horario 
                    WHERE id_empleado = :id_empleado 
                    AND dia_semana = :dia_semana";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':dia_semana', $this->__get('dia_semana'), PDO::PARAM_STR);
            $stmt->execute();
            
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            $existe = ($resultado['total'] > 0);
            
            return [
                'exito' => true,
                'mensaje' => $existe ? 'El psicólogo trabaja este día' : 'El psicólogo no trabaja este día',
                'existe' => $existe
            ];
            
        } catch(Throwable $e) {
            error_log("Error en verificar_dia_psicologo: " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error al verificar el día',
                'existe' => false
            ];
        }
    }

    // Método para obtener los días del psicólogo (mantener si lo necesitas para otra cosa)
    private function obtener_dias_psicologo() {
        try {
            $query = "SELECT DISTINCT dia_semana 
                    FROM horario 
                    WHERE id_empleado = :id_empleado
                    ORDER BY FIELD(dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            
            $dias = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
            
            return [
                'exito' => true,
                'mensaje' => 'Días obtenidos correctamente',
                'data' => $dias
            ];
            
        } catch(Throwable $e) {
            error_log("Error en obtener_dias_psicologo: " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error al obtener días',
                'data' => []
            ];
        }
    }

    // Método 1: Verificar si la hora está en el rango del horario
    private function verificar_hora_en_rango() {
        try {
            $id_empleado = (int)$this->__get('id_empleado');
            $dia_semana = $this->__get('dia_semana'); // ya normalizado por controlador
            $hora = $this->__get('hora'); // 'HH:MM'

            if (!$id_empleado || !$dia_semana || !$hora) {
                return ['exito'=>false,'mensaje'=>'Faltan parametros','en_rango'=>false];
            }

            // Normalizar hora a HH:MM:SS
            $hora_full = (strlen($hora)===5) ? $hora.':00' : $hora;

            // Queremos que toda la duración de la cita (1h) esté dentro de la franja.
            // Comprobamos: existe fila donde hora_inicio <= hora AND ADDTIME(:hora, '01:00:00') <= hora_fin
            $sql = "SELECT COUNT(*) AS total
                    FROM horario
                    WHERE id_empleado = :id_empleado
                    AND dia_semana = :dia_semana
                    AND hora_inicio <= :hora
                    AND ADDTIME(:hora, '01:00:00') <= hora_fin";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt->bindValue(':dia_semana', $dia_semana, PDO::PARAM_STR);
            $stmt->bindValue(':hora', $hora_full, PDO::PARAM_STR);
            $stmt->execute();
            $res = $stmt->fetch(PDO::FETCH_ASSOC);

            $en_rango = ($res['total'] > 0);

            if (!$en_rango) {
                return [
                    'exito' => true,
                    'mensaje' => 'La hora no está dentro del horario del psicólogo',
                    'en_rango' => false
                ];
            }

            // Si está en rango, aceptamos pero restringimos minutos (00 o 30) si así lo deseas
            $minutos = (int)explode(':', $hora)[1];
            if ($minutos !== 0 && $minutos !== 30) {
                return [
                    'exito' => true,
                    'mensaje' => 'Las citas deben iniciarse en punto o en media hora (00 o 30 minutos).',
                    'en_rango' => false
                ];
            }

            return [
                'exito' => true,
                'mensaje' => 'Hora dentro del rango',
                'en_rango' => true
            ];

        } catch(Throwable $e) {
            error_log("Error en verificar_hora_en_rango: " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error al verificar el rango horario',
                'en_rango' => false
            ];
        }
    }

    // Método 2: Verificar disponibilidad de la hora (si no hay cita existente)
    private function verificar_disponibilidad_hora() {
        try {
            $id_empleado = (int)$this->__get('id_empleado');
            $fecha = $this->__get('fecha'); // YYYY-MM-DD
            $hora = $this->__get('hora');   // HH:MM

            if (!$id_empleado || !$fecha || !$hora) {
                return ['exito'=>false, 'mensaje'=>'Faltan parametros', 'disponible'=>false];
            }

            $hora_inicio = (strlen($hora)===5) ? $hora.':00' : $hora;
            // Calcular hora fin (1 hora)
            $hora_fin_dt = new \DateTime($hora_inicio);
            $hora_fin_dt->modify('+1 hour');
            $hora_fin = $hora_fin_dt->format('H:i:s');

            // 1) Consulta rápida para ver si existe CITA exactamente con misma hora
            $sqlExact = "SELECT COUNT(*) as total FROM cita
                        WHERE id_empleado = :id_empleado
                        AND fecha = :fecha
                        AND hora = :hora_inicio
                        AND estatus != 4"; // excluir canceladas (4)
            $stmt = $this->conn->prepare($sqlExact);
            $stmt->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt->bindValue(':fecha', $fecha, PDO::PARAM_STR);
            $stmt->bindValue(':hora_inicio', $hora_inicio, PDO::PARAM_STR);
            $stmt->execute();
            $resExact = (int)$stmt->fetchColumn();
            if ($resExact > 0) {
                return ['exito'=>true, 'mensaje'=>'Ya existe una cita en esa hora', 'disponible'=>false];
            }

            // 2) Verificar solapamientos (citas cuyo intervalo se cruza con [hora_inicio, hora_fin))
            // Condición de solapamiento: NOT (existing_end <= new_start OR existing_start >= new_end)
            // existing_end = ADDTIME(hora,'01:00:00')
            $sqlOverlap = "SELECT COUNT(*) as total FROM cita
                        WHERE id_empleado = :id_empleado
                            AND fecha = :fecha
                            AND estatus != 4
                            AND NOT (ADDTIME(hora, '01:00:00') <= :hora_inicio OR hora >= :hora_fin)";
            $stmt2 = $this->conn->prepare($sqlOverlap);
            $stmt2->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt2->bindValue(':fecha', $fecha, PDO::PARAM_STR);
            $stmt2->bindValue(':hora_inicio', $hora_inicio, PDO::PARAM_STR);
            $stmt2->bindValue(':hora_fin', $hora_fin, PDO::PARAM_STR);
            $stmt2->execute();
            $resOverlap = (int)$stmt2->fetchColumn();

            $disponible = ($resOverlap === 0);

            return [
                'exito' => true,
                'mensaje' => $disponible ? 'Hora disponible' : 'Hora no disponible (conflicto)',
                'disponible' => $disponible
            ];

        } catch(Throwable $e) {
            error_log("Error en verificar_disponibilidad_hora: " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error al verificar disponibilidad',
                'disponible' => false
            ];
        }
    }

    private function actualizar_cita(){
        try{
            $query = "UPDATE cita SET fecha = :fecha, hora = :hora WHERE id_cita = :id_cita";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_cita', $this->__get('id_cita'), PDO::PARAM_INT);
            $stmt->bindValue(':fecha', $this->__get('fecha'), PDO::PARAM_STR);
            $stmt->bindValue(':hora', $this->__get('hora'), PDO::PARAM_STR);
            $stmt->execute();

            $filas = $stmt->rowCount();

            return [
                'exito' => true,
                'mensaje' => $filas > 0 ? 'Cita actualizada exitosamente' : 'No hubo cambios en la cita'
            ];

        } catch(Throwable $e){
            error_log('Error en base de datos'. $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function eliminar_cita(){
        try{
            $query = "DELETE FROM cita WHERE id_cita = :id_cita";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_cita', $this->__get('id_cita'), PDO::PARAM_INT);
            $stmt->execute();

            $filas = $stmt->rowCount();

            return [
                'exito' => true,
                'mensaje' => $filas > 0 ? 'Cita eliminada exitosamente' : 'No se encontró la cita'
            ];

        } catch(Throwable $e){
            error_log('Error en base de datos'. $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function obtener_estados_cita(){
        $estados = $this->conn->query(
            "SELECT id_estado, nombre 
            FROM estado_cita 
            WHERE es_activo = 1"
        )->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $this->conn->prepare(
            "SELECT estatus FROM cita WHERE id_cita = :id"
        );
        $stmt->execute([':id' => $this->__get('id_cita')]);
        $estado_actual = $stmt->fetchColumn();

        return [
            'estados' => $estados,
            'estado_actual' => $estado_actual
        ];
    }

    private function obtener_estatus(){
        try{
            $query = "SELECT ec.nombre 
                    FROM cita c
                    JOIN estado_cita ec ON c.estatus = ec.id_estado
                    WHERE c.id_cita = :id_cita";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_cita', $this->__get('id_cita'), PDO::PARAM_INT);
            $stmt->execute();
            
            // Retornar directamente el nombre (string) para que el controlador lo use en el log
            return $stmt->fetchColumn() ?: 'Desconocido';

        } catch(Throwable $e){
            error_log("Error obtener_estatus: " . $e->getMessage());
            return 'Error';
        }
    }

    private function actualizar_estado_cita(){
        $stmt = $this->conn->prepare(
            "UPDATE cita 
            SET estatus = :estatus 
            WHERE id_cita = :id"
        );

        $stmt->execute([
            ':estatus' => $this->__get('estatus'),
            ':id' => $this->__get('id_cita')
        ]);

        return [
            'exito' => true,
            'mensaje' => 'Estado de la cita actualizado correctamente'
        ];
    }

    private function obtenerCitasCalendario(){
        try {
            $tipo_empleado = $this->__get('tipo_empleado');
            $id_empleado = $this->__get('id_empleado');

            $query = "
                SELECT
                    c.id_cita,
                    c.fecha,
                    c.hora,
                    CONCAT(b.nombres, ' ', b.apellidos) AS beneficiario,
                    CONCAT(b.tipo_cedula, '-', b.cedula) as cedula_beneficiario,
                    CONCAT(e.nombre, ' ', e.apellido) AS empleado,
                    c.estatus,
                    ec.id_estado,
                    ec.nombre AS nombre_estado
                FROM cita c
                JOIN beneficiario b ON c.id_beneficiario = b.id_beneficiario
                JOIN dirpoles_security.empleado e ON c.id_empleado = e.id_empleado
                JOIN estado_cita ec ON c.estatus = ec.id_estado
            ";

            // Filtrar si no es administrador o superusuario
            if (!in_array($tipo_empleado, ['Administrador', 'Superusuario'])) {
                $query .= " WHERE c.id_empleado = :id_empleado ";
            }

            $query .= " ORDER BY c.fecha, c.hora ";

            $stmt = $this->conn->prepare($query);

            if (!in_array($tipo_empleado, ['Administrador', 'Superusuario'])) {
                $stmt->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            }

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            error_log("Error en obtenerCitasCalendario: " . $e->getMessage());
            return [];
        }
    }


}