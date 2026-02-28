<?php
use App\Core\Router;

// ==================== RUTAS PROTEGIDAS (permisos) ====================
Router::get('crear_permisos', function() {
    load_controller('permisosController.php');
    crear_permisos();
});

Router::post('ajax_obtener_permisos_por_rol', function() {
    load_controller('permisosController.php');
    ajax_obtener_permisos_por_rol();
});

Router::post('ajax_guardar_permisos_lote', function() {
    load_controller('permisosController.php');
    ajax_guardar_permisos_lote();
});