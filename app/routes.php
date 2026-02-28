<?php
use App\Core\Router;

// ==================== MIDDLEWARE GLOBAL ====================
Router::antes('ALL', '.*', function() {
    $rutasPublicas = ['login', 'iniciar_sesion', 'error', 'logout'];

    // Obtener ruta solicitada
    $rutaSolicitada = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Remover BASE_URL de la ruta
    $baseUrlClean = trim(BASE_URL, '/');
    $rutaLimpia = $rutaSolicitada;

    if ($baseUrlClean && strpos($rutaLimpia, '/' . $baseUrlClean) === 0) {
        $rutaLimpia = substr($rutaLimpia, strlen($baseUrlClean) + 1);
    }

    $rutaActual = trim($rutaLimpia, '/') ?: 'login';

    // Verificar si es una ruta pública
    if (in_array($rutaActual, $rutasPublicas)) {
        return; // No requiere autenticación
    }

    // Verificar autenticación para rutas protegidas
    if (!isset($_SESSION['id_empleado'])) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            header('Content-Type: application/json');
            echo json_encode([
                'estado' => 'error',
                'mensaje' => 'Sesión expirada',
                'redireccion' => BASE_URL . 'login'
            ]);
            exit();
        } else {
            $_SESSION['mensaje_redireccion'] = json_encode([
                'estado' => 'error',
                'titulo' => 'Acceso denegado',
                'mensaje' => 'Debes iniciar sesión primero'
            ]);
            header('Location: ' . BASE_URL . 'login');
            exit();
        }
    }
});

// ==================== RUTAS ESENCIALES (login / inicio) ====================
Router::get('', function() {
    header('Location: ' . BASE_URL . 'login');
    exit();
});

Router::get('login', function() {
    // carga perezosa del controlador de login
    load_controller('loginController.php');
    showLogin();
});

Router::post('iniciar_sesion', function() {
    load_controller('loginController.php');
    iniciar_sesion();
});

Router::get('logout', function() {
    load_controller('loginController.php');
    cerrar_sesion();
});

// ==================== RUTA DE INICIO (protegida) ====================
Router::get('inicio', function() {
    load_controller('loginController.php');
    showInicio();
});

// ==================== CARGAR RUTAS POR MÓDULOS ====================
foreach (glob(BASE_PATH . 'app/routes/*.php') as $rutaArchivo) {
    require_once $rutaArchivo;
}

// ==================== MANEJO DE ERRORES ====================
Router::rutaNoEncontrada(function() {
    header("HTTP/1.0 404 No Encontrado");
    echo "Página no encontrada - Error 404";
    exit();
});

Router::metodoNoPermitido(function() {
    header("HTTP/1.0 405 Método No Permitido");
    echo "Método no permitido - Error 405";
    exit();
});
