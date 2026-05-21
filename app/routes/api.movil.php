<?php
/**
 * Rutas API Móvil
 *
 * Registra GET y POST para la ruta api/movil.
 * (El pre-flight CORS OPTIONS se maneja globalmente en index.php)
 */

use App\Core\Router;

// GET de prueba (health check)
Router::get('api/movil', function () {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['estado' => 'ok', 'mensaje' => 'API Móvil DIRPOLES activa.']);
    exit;
});

// POST principal
Router::post('api/movil', function () {
    load_controller('movilController.php');
    manejarPeticionMovil();
});
