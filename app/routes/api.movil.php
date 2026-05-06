<?php
/**
 * Rutas API Móvil
 *
 * Registra GET, POST y OPTIONS para la ruta api/movil.
 * OPTIONS es necesario para el preflight CORS que envía Axios
 * cuando la app corre en modo web (navegador).
 */

use App\Core\Router;

// Pre-flight CORS (Axios en modo web envía OPTIONS antes de cada POST)
Router::options('api/movil', function () {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit;
});

// GET de prueba (health check)
Router::get('api/movil', function () {
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['estado' => 'ok', 'mensaje' => 'API Móvil DIRPOLES activa.']);
    exit;
});

// POST principal
Router::post('api/movil', function () {
    load_controller('movilController.php');
    manejarPeticionMovil();
});
