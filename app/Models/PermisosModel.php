<?php
namespace App\Models;
use App\Models\SecurityModel;
use PDO;
use Throwable;
use Exception;
use InvalidArgumentException;

class PermisosModel extends SecurityModel{
    private $atributos = [];

    public function __set($nombre, $valor){
        $this->atributos[$nombre] = $valor;
    }

    public function __get($atributo){
        return $this->atributos[$atributo] ?? null;
    }

    public function manejarAccion($action){
        switch($action){
            case 'Verificar':
                return $this->verificarPermisos();

            case 'obtener_modulos':
                return $this->obtener_modulos();

            case 'tipos_empleados':
                return $this->tipos_empleados();

            case 'obtenerPermisos':
                return $this->obtenerPermisos();

            case "obtener_permisos_por_rol":
                return $this->obtener_permisos_por_rol();

            case "guardar_permisos_lote":
                return $this->guardar_permisos_lote();
            
            case 'obtenerPermisosSidebar':
                return $this->obtenerPermisosSidebar();

            case 'mapa_permisos_todos':
                return $this->mapa_permisos_todos();

            default:
                throw new Exception("Acción no válida: $action");
        }
    }

    private function obtener_modulos(){
        try{
            $query = "SELECT id_modulo, nombre FROM modulo ORDER BY id_modulo ASC";
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(Throwable $e){
            error_log("Error al obtener los modulos: " . $e->getMessage());
            return [];
        }
    }

    private function tipos_empleados() {
        try{
            $query = "SELECT id_tipo_emp, tipo FROM tipo_empleado 
                WHERE estatus = 1
                ORDER BY id_tipo_emp ASC";
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(Throwable $e){
            error_log("Error al obtener los tipos de empleados: " . $e->getMessage());
            return [];
        }
    }
    
    private function obtenerPermisos() {
        try{
            $query = "SELECT id_permiso, clave FROM permiso ORDER BY id_permiso ASC";
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(Throwable $e){
            error_log("Error al obtener permisos: " . $e->getMessage());
            return [];
        }
    }

    private function obtenerPermisosSidebar() {
        try {
            $query = "
                SELECT DISTINCT m.id_modulo, m.nombre AS nombre_modulo, m.descripcion
                FROM rol_modulo_permiso rpm
                JOIN modulo m ON rpm.id_modulo = m.id_modulo
                WHERE rpm.id_tipo_emp = :rol
                AND rpm.id_permiso = 2  -- Solo permiso 'Leer'
                ORDER BY m.id_modulo ASC
            ";
            
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':rol', $this->__get('Rol'), PDO::PARAM_INT);
            $stmt->execute();

            $modulosPermitidos = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $modulosPermitidos[$row['id_modulo']] = [
                    'nombre' => $row['nombre_modulo'],
                    'descripcion' => $row['descripcion']
                ];
            }

            return $modulosPermitidos;

        } catch(Throwable $e) {
            error_log("Error al obtener permisos del sidebar: " . $e->getMessage());
            return [];
        }
    }

    private function obtener_permisos_por_rol(){
        $id_tipo_emp = $this->__get('id_tipo_emp');
        try {
            $sql = "SELECT id_modulo, id_permiso 
                    FROM rol_modulo_permiso 
                    WHERE id_tipo_emp = ?";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$id_tipo_emp]);

            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $mapa = [];

            foreach ($resultado as $row) {

                $modulo = $row['id_modulo'];
                $permiso = $row['id_permiso'];

                if (!isset($mapa[$modulo])) {
                    $mapa[$modulo] = [];
                }

                $mapa[$modulo][] = \intval($permiso);
            }

            return [
                "exito" => true,
                "mensaje" => "Permisos obtenidos.",
                "data" => [
                    "id_tipo_emp" => \intval($id_tipo_emp),
                    "mapa" => $mapa
                ]
            ];

        } catch (Throwable $e) {
            return [
                "exito" => false,
                "mensaje" => "Error al obtener permisos: ".$e->getMessage()
            ];
        }
    }

    private function guardar_permisos_lote(){
        $cambios = $this->__get('cambios');

        if (!is_array($cambios) || count($cambios) === 0) {
            return [
                "exito" => false,
                "mensaje" => "No se recibieron cambios para procesar."
            ];
        }

        try {
            // Usar la conexión que usas en el resto del modelo
            $pdo = $this->conn_security; // <<-- asegúrate que Database define conn_security (PDO)

            // Iniciar transacción
            $pdo->beginTransaction();

            // Preparar las sentencias una sola vez
            $sql_delete = "DELETE FROM rol_modulo_permiso WHERE id_tipo_emp = :rol AND id_modulo = :mod";
            $stmt_del = $pdo->prepare($sql_delete);

            $sql_insert = "INSERT INTO rol_modulo_permiso (id_tipo_emp, id_modulo, id_permiso) VALUES (:rol, :mod, :perm)";
            $stmt_ins = $pdo->prepare($sql_insert);

            foreach ($cambios as $c) {
                // Validaciones básicas
                if (!isset($c['id_tipo_emp'], $c['id_modulo'], $c['permisos']) || !is_array($c['permisos'])) {
                    // rollback y error
                    $pdo->rollBack();
                    error_log("guardar_permisos_lote: datos incompletos en cambio: " . json_encode($c));
                    return ["exito" => false, "mensaje" => "Datos de cambios incompletos."];
                }

                $id_tipo_emp = (int)$c['id_tipo_emp'];
                $id_modulo   = (int)$c['id_modulo'];
                $permisos    = $c['permisos'];

                // Eliminar previos
                $stmt_del->bindValue(':rol', $id_tipo_emp, PDO::PARAM_INT);
                $stmt_del->bindValue(':mod', $id_modulo, PDO::PARAM_INT);
                $stmt_del->execute();

                // Insertar nuevos (si la lista de permisos está vacía, dejaremos el módulo sin permisos)
                foreach ($permisos as $perm) {
                    $perm_int = (int)$perm;
                    $stmt_ins->bindValue(':rol', $id_tipo_emp, PDO::PARAM_INT);
                    $stmt_ins->bindValue(':mod', $id_modulo, PDO::PARAM_INT);
                    $stmt_ins->bindValue(':perm', $perm_int, PDO::PARAM_INT);
                    $stmt_ins->execute();
                }
            }

            $pdo->commit();

            // Opcional: devolver los cambios aplicados para sincronizar frontend
            return [
                "exito" => true,
                "mensaje" => "Permisos actualizados correctamente.",
                "data" => ["savedCambios" => $cambios]
            ];

        } catch (Throwable $e) {
            // Asegurar rollback si ocurrió error
            try { if ($this->conn_security && $this->conn_security->inTransaction()) $this->conn_security->rollBack(); } catch(Throwable $_) {}

            // Registrar error en los logs para diagnóstico
            error_log("Excepción guardar_permisos_lote: " . $e->getMessage() . "\nPayload: " . json_encode($cambios));

            // No devolver stacktrace en producción; dar mensaje amigable
            return [
                "exito" => false,
                "mensaje" => "Error inesperado al guardar permisos. Revisa los logs del servidor."
            ];
        }
    }

    private function mapa_permisos_todos(){
        try {
            $sql = "SELECT id_tipo_emp, id_modulo, id_permiso
                    FROM rol_modulo_permiso
                    ORDER BY id_tipo_emp ASC, id_modulo ASC, id_permiso ASC";

            $stmt = $this->conn_security->prepare($sql);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $mapa = [];
            foreach ($rows as $r) {
                $rid = (int)$r['id_tipo_emp'];
                $mid = (int)$r['id_modulo'];
                $pid = (int)$r['id_permiso'];

                if (!isset($mapa[$rid])) $mapa[$rid] = [];
                if (!isset($mapa[$rid][$mid])) $mapa[$rid][$mid] = [];
                $mapa[$rid][$mid][] = $pid;
            }

            return [
                "exito" => true,
                "mensaje" => "Mapa de permisos cargado.",
                "data" => $mapa
            ];
        } catch (Throwable $e) {
            error_log("Error mapa_permisos_todos: " . $e->getMessage());
            return [
                "exito" => false,
                "mensaje" => "Error cargando mapa de permisos."
            ];
        }
    }

    private function obtenerIdModuloPorNombre(string $nombre): ?int {
        $query = "SELECT id_modulo FROM modulo WHERE nombre = :nombre LIMIT 1";
        $stmt = $this->conn_security->prepare($query);
        $stmt->execute([':nombre' => $nombre]);
        return $stmt->fetchColumn() ?: null;
    }

    private function obtenerIdPermisoPorClave(string $clave): ?int {
        $query = "SELECT id_permiso FROM permiso WHERE clave = :clave LIMIT 1";
        $stmt = $this->conn_security->prepare($query);
        $stmt->execute([':clave' => $clave]);
        return $stmt->fetchColumn() ?: null;
    }

    //Funcion privada del manejador de acciones para verificar permisos
    private function verificarPermisos(){
        try {
            $nombreModulo = $this->__get('Modulo');
            $clavePermiso = $this->__get('Permiso');
            $idRol = $this->__get('Rol');

            $idModulo = $this->obtenerIdModuloPorNombre($nombreModulo);
            if ($idModulo === null) {
                throw new InvalidArgumentException("Módulo '$nombreModulo' no existe");
            }

            $idPermiso = $this->obtenerIdPermisoPorClave($clavePermiso);
            if ($idPermiso === null) {
                throw new InvalidArgumentException("Permiso '$clavePermiso' no existe");
            }

            $query = "SELECT COUNT(*) FROM rol_modulo_permiso 
                    WHERE id_tipo_emp = :rol 
                        AND id_modulo = :id_modulo 
                        AND id_permiso = :permiso";
            $stmt = $this->conn_security->prepare($query);
            $stmt->execute([
                ':rol'      => $idRol,
                ':id_modulo'=> $idModulo,
                ':permiso'  => $idPermiso
            ]);
            return $stmt->fetchColumn() > 0;
        } catch(Throwable $e) {
            error_log("Error en verificarPermisos: " . $e->getMessage());
            return false;
        }
    }

}