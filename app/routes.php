<?php

use App\Core\Router;


// ==================== MIDDLEWARES GLOBALES ====================
// 1° Escudo perimetral: Rate Limit (Token Bucket)
Router::antes('ALL', '.*', [App\Middlewares\RateLimitMiddleware::class, 'handle']);

// 2° Escudo perimetral: Autenticación de sesión y JWT
Router::antes('ALL', '.*', [App\Middlewares\SessionAuthMiddleware::class, 'handle']);

// ==================== RUTAS ESENCIALES (login / inicio) ====================
Router::get('', function () {
    header('Location: ' . BASE_URL . 'login');
    exit();
});

Router::get('login', function () {
    // carga perezosa del controlador de login
    load_controller('loginController.php');
    showLogin();
});

Router::post('iniciar_sesion', function () {
    load_controller('loginController.php');
    iniciar_sesion();
});

Router::get('logout', function () {
    load_controller('loginController.php');
    cerrar_sesion();
});


// ==================== RUTA DE INICIO (protegida) ====================
Router::get('inicio', function () {
    load_controller('loginController.php');
    showInicio();
});

// ==================== CARGAR RUTAS POR MÓDULOS ====================
foreach (glob(BASE_PATH . 'app/routes/*.php') as $rutaArchivo) {
    require_once $rutaArchivo;
}

// ==================== MANEJO DE ERRORES ====================
Router::rutaNoEncontrada(function () {
    header("HTTP/1.0 404 No Encontrado");
    echo "Página no encontrada - Error 404";
    exit();
});

Router::metodoNoPermitido(function () {
    header("HTTP/1.0 405 Método No Permitido");
    echo "Método no permitido - Error 405";
    exit();
});
