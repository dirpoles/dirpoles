<?php
// app/Helpers/permisos_helper.php
use App\Models\PermisosModel;

/**
 * Verifica si el usuario tiene permiso para una acción en un módulo
 * @param int $id_modulo ID del módulo
 * @param int $id_permiso ID del permiso (1:crear, 2:leer, 3:editar, 4:eliminar)
 * @param int $id_tipo_empleado Opcional, si no se pasa usa la sesión
 * @return bool
 */

function tienePermiso(int $id_modulo, int $id_permiso, ?int $id_tipo_empleado = null): bool {
    if (!$id_tipo_empleado) {
        $id_tipo_empleado = $_SESSION['id_tipo_empleado'] ?? null;
    }
    
    if (!$id_tipo_empleado) return false;
    
    try {
        $modelo = new PermisosModel();
        $modelo->__set('Rol', $id_tipo_empleado);
        $modelo->__set('id_modulo', $id_modulo);
        $modelo->__set('id_permiso', $id_permiso);
        
        return $modelo->manejarAccion('Verificar');
    } catch (Throwable $e) {
        error_log("Error verificando permiso: " . $e->getMessage());
        return false;
    }
}