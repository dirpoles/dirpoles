<?php
namespace App\Models;
use App\Models\SecurityModel;
use PDO;
use Throwable;
use Exception;

class NotificacionesModel extends SecurityModel{
    private $atributos = [];

    public function __set($nombre, $valor){
        $valor = \is_string($valor) ? trim($valor) : $valor;

        if ($nombre === 'titulo') {
            $valor = ucfirst(mb_strtolower($valor, "UTF-8"));
        }

        $validaciones = [
            'id_notif' => fn($v) => is_numeric($v) && $v > 0,
            'limit' => fn($v) => is_numeric($v) && $v > 0,
            'id_empleado' => fn($v) => is_numeric($v) && $v > 0,
            'titulo' => fn($v) => !empty($v) && mb_strlen($v) <= 150,
            'mensaje' => fn($v) => !empty($v) && mb_strlen($v) <= 500,
            'estatus' => fn($v) => in_array($v, [0, 1, '0', '1']),
            'fecha' => fn($v) => !empty($v) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $v)
        ];

        // Validar si existe regla para el atributo
        if (isset($validaciones[$nombre]) && !$validaciones[$nombre]($valor)) {
            throw new \InvalidArgumentException("Valor inválido para $nombre");
        }

        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre){
        return $this->atributos[$nombre] ?? null;
    }

    public function manejarAccion($action){
        switch ($action) {
            case 'obtenerNotf': {
                    return [
                        'unreadCount' => $this->contarNoLeidas(),
                        'notifications' => $this->obtenerNotificaciones(20)
                    ];
                }

            case 'cargarMasNotf': {
                    return [
                        'notifications' => $this->obtenerNotificaciones(),
                        'has_more' => count($this->obtenerNotificaciones()) > 0
                    ];
                }

            case 'marcarLeidas':
                return $this->marcarComoLeidas();

            case 'eliminar':
                return $this->eliminarNotificacion();

            case 'eliminar_todas':
                return $this->eliminarTodasNotificaciones();

            case 'crear_notificacion':
                return $this->crear_notificacion();

            case 'marcarTodasLeidas':
                return $this->marcarTodasComoLeidas();

            case 'obtenerNuevasSSE':
                return $this->obtenerNuevasNotificacionesSSE();

            case 'contarNotificaciones':
                return $this->contarNotificaciones();

            default:
                throw new Exception("Acción no válida.");
        }
    }

    private function crear_notificacion(){
        try{
            $this->conn_security->beginTransaction();

            // Insertar en notificaciones
            $query = "INSERT INTO notificaciones (titulo, url, tipo, fecha_creacion) 
                    VALUES (:titulo, :url, :tipo, NOW())";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':titulo', $this->__get('titulo'), PDO::PARAM_STR);
            $stmt->bindValue(':url', $this->__get('url'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo', $this->__get('tipo'), PDO::PARAM_STR);
            $stmt->execute();
            $id_notificaciones = $this->conn_security->lastInsertId();

            // Insertar en notificaciones_empleados
            $query2 = "INSERT INTO notificaciones_empleados 
                    (id_notificaciones, id_emisor, id_receptor, leido) 
                    VALUES (:id_notificaciones, :id_emisor, :id_receptor, :leido)";
            
            $stmt2 = $this->conn_security->prepare($query2);
            $stmt2->bindValue(':id_notificaciones', $id_notificaciones, PDO::PARAM_INT);
            $stmt2->bindValue(':id_emisor', $this->__get('id_emisor'), PDO::PARAM_INT);
            $stmt2->bindValue(':id_receptor', $this->__get('id_receptor'), PDO::PARAM_INT);
            $stmt2->bindValue(':leido', $this->__get('leido'), PDO::PARAM_BOOL); 
            
            $stmt2->execute();
            $this->conn_security->commit();

            return [
                "exito" => true,
                "mensaje" => "Notificación creada exitosamente"
            ];
            
        } catch(Throwable $e){
            if ($this->conn_security->inTransaction()) {
                $this->conn_security->rollBack();
            }
            error_log("Error en notificación: " . $e->getMessage());
            return [
                'exito' => false, 
                'mensaje' => 'Error de base de datos: ' . $e->getMessage()
            ];
        }
    }

    private function contarNotificaciones(){
        try{
            $query = "SELECT COUNT(*) as total FROM notificaciones_empleados WHERE id_receptor = :id_empleado AND leido = 0";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchColumn();

        } catch(Throwable $e){
            error_log("Error al contar notificaciones: " . $e->getMessage());
            return [
                'exito' => false, 
                'mensaje' => 'Error de base de datos: ' . $e->getMessage()
            ];
        }
    }

    private function obtenerNotificaciones($limit = 10, $offset = 0){
        try{
            // Obtener límite del atributo o usar valor por defecto
            $limit = $this->__get('limit') ?? $limit;
            $offset = $this->__get('offset') ?? $offset;
            
            $stmt = $this->conn_security->prepare(
                "SELECT
                n.*,
                n.tipo,
                ne.leido,
                ne.id_notificaciones_empleados AS id,
                CONCAT(e.nombre,' ',e.apellido) AS nombre_empleado,
                TIMESTAMPDIFF(MINUTE, n.fecha_creacion, NOW()) AS time_ago
                FROM notificaciones n
                LEFT JOIN notificaciones_empleados ne ON n.id_notificaciones = ne.id_notificaciones
                LEFT JOIN empleado e ON ne.id_emisor = e.id_empleado
                WHERE ne.id_receptor = :id_empleado
                ORDER BY n.fecha_creacion DESC 
                LIMIT :limit OFFSET :offset"
            );
            
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(Throwable $e){
            error_log("Error al obtener notificaciones: " . $e->getMessage());
            return [];
        }
    }

    private function contarNoLeidas(){
        $stmt = $this->conn_security->prepare("SELECT COUNT(*) as total FROM notificaciones_empleados WHERE id_receptor = :id_empleado AND leido = 0");
        $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    }

    private function marcarComoLeidas(){
        $stmt = $this->conn_security->prepare("UPDATE notificaciones_empleados SET leido = 1 WHERE id_notificaciones_empleados = :id_notif AND leido = 0");
        $stmt->bindValue(':id_notif', $this->__get('id_notif'), PDO::PARAM_INT);
        return $stmt->execute();
    }

    private function marcarTodasComoLeidas() {
        try {
            $stmt = $this->conn_security->prepare(
                "UPDATE notificaciones_empleados 
                SET leido = 1 
                WHERE id_receptor = :id_empleado 
                AND leido = 0"
            );
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            
            $stmt->execute();
            
            // Devuelve true si la consulta se ejecutó correctamente
            // rowCount() puede ser 0 si no había notificaciones sin leer
            return $stmt->rowCount();
            
        } catch (Throwable $e) {
            error_log("Error en marcarTodasComoLeidas: " . $e->getMessage());
            return false;
        }
    }

    private function eliminarNotificacion(){
        $stmt = $this->conn_security->prepare("DELETE FROM notificaciones_empleados WHERE id_notificaciones_empleados = :id_notif");
        $stmt->bindValue(':id_notif', $this->__get('id_notif'), PDO::PARAM_INT);
        return $stmt->execute();
    }

    private function obtenerNuevasNotificacionesSSE() {
        try {
            $ultimoId = $this->__get('ultimoId') ?? 0;
            $id_empleado = $this->__get('id_empleado');
            
            $stmt = $this->conn_security->prepare(
                "SELECT 
                    ne.id_notificaciones_empleados AS id,
                    n.titulo,
                    n.url,
                    n.tipo,
                    ne.leido,
                    CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
                    TIMESTAMPDIFF(MINUTE, n.fecha_creacion, NOW()) AS time_ago
                FROM notificaciones_empleados ne
                INNER JOIN notificaciones n ON ne.id_notificaciones = n.id_notificaciones
                LEFT JOIN empleado e ON ne.id_emisor = e.id_empleado
                WHERE ne.id_receptor = :id_empleado
                AND ne.id_notificaciones_empleados > :ultimoId
                AND ne.leido = 0
                ORDER BY n.fecha_creacion DESC
                LIMIT 10"
            );
            
            $stmt->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmt->bindValue(':ultimoId', $ultimoId, PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (Throwable $e) {
            error_log("Error SSE: " . $e->getMessage());
            return [];
        }
    }

    private function eliminarTodasNotificaciones(){
        try{
            $this->conn_security->beginTransaction();
            $stmt = $this->conn_security->prepare("DELETE FROM notificaciones_empleados WHERE id_receptor = :id_empleado");
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();
            $this->conn_security->commit();
            return [
                "exito" => true,
                "mensaje" => "Todas las notificaciones han sido eliminadas"
            ];
        } catch (Throwable $e) {
            if ($this->conn_security->inTransaction()) {
                $this->conn_security->rollBack();
            }
            error_log("Error al eliminar todas las notificaciones: " . $e->getMessage());
            return [
                "exito" => false,
                "mensaje" => "Error al eliminar todas las notificaciones: " . $e->getMessage()
            ];
        }
    }
}
