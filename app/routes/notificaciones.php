<?php
use App\Core\Router;

// ==================== RUTAS PROTEGIDAS (notificaciones) ====================
Router::post('cargarMasNotificaciones', function() {
    require_once BASE_PATH . '/app/Controllers/notificacionesController.php';
    cargarMasNotificaciones();
});

Router::post('marcarLeidas', function() {
    require_once BASE_PATH . '/app/Controllers/notificacionesController.php';
    marcarLeidas();
});

Router::post('marcarTodasLeidas', function() {
    require_once BASE_PATH . '/app/Controllers/notificacionesController.php';
    marcarTodasLeidas();
});

Router::post('obtenerNotificaciones', function() {
    require_once BASE_PATH . '/app/Controllers/notificacionesController.php';
    obtenerNotificaciones();
});

Router::post('eliminarNotificacion', function() {
    require_once BASE_PATH . '/app/Controllers/notificacionesController.php';
    eliminarNotificacion();
});

Router::post('eliminarTodasNotificaciones', function() {
    require_once BASE_PATH . '/app/Controllers/notificacionesController.php';
    eliminarTodasNotificaciones();
});

Router::get('sse-notificaciones', function() {
    require_once BASE_PATH . '/app/Controllers/sseController.php';
    streamNotificaciones();
});

Router::get('data_notificaciones_json', function() {
    require_once BASE_PATH . '/app/Controllers/notificacionesController.php';
    contar_notificaciones();
});