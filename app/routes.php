<?php

use App\Core\Router;

// ==================== MIDDLEWARE GLOBAL ====================
Router::antes('ALL', '.*', function () {
    $rutasPublicas = ['', 'login', 'iniciar_sesion', 'error', 'logout'];

    // Obtener ruta solicitada
    $rutaSolicitada = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Sincronizar con la lógica de limpieza del Router
    $rutaBase = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
    $rutaRelativa = substr($rutaSolicitada, strlen($rutaBase));
    $rutaActual = trim($rutaRelativa, '/') ?: 'login';

    // 1. SI ES RUTA PÚBLICA O EL ROOT, SALIR INMEDIATAMENTE
    // El root vacío '' se trata como 'login' por el Router y por la línea anterior
    if (in_array($rutaActual, $rutasPublicas) || $rutaRelativa === '' || $rutaRelativa === '/') {
        return;
    }

    // 1.5 IGNORAR ARCHIVOS ESTÁTICOS FALTANTES (ej. sourcemaps .map, imágenes, etc.)
    // Evita que peticiones del navegador a recursos que no existen gatillen la alerta de 
    // "Acceso denegado" en la sesión antes de hacer el 404 normal de rutaNoEncontrada.
    if (preg_match('/\.(js|css|map|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i', $rutaActual)) {
        return;
    }

    // 2. VALIDACIÓN DE SESIÓN
    if (!isset($_SESSION['id_empleado'])) {
        redirigirLogin('Debes iniciar sesión primero', 'Acceso denegado');
    }

    // 3. VALIDACIÓN DE ESTATUS (BLOQUEO)
    if (isset($_SESSION['estatus']) && $_SESSION['estatus'] == 0) {
        $msg = 'Tu cuenta ha sido desactivada. Contacta al administrador.';
        // Solo limpiamos los datos de acceso, no destruimos la sesión
        unset($_SESSION['id_empleado']);
        unset($_SESSION['nombre']);
        unset($_SESSION['estatus']);
        redirigirLogin($msg, 'Cuenta bloqueada');
    }
});

/**
 * Redirección simple al login con mensaje
 */
function redirigirLogin($mensaje, $titulo)
{
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode([
            'estado' => 'error',
            'mensaje' => $mensaje,
            'redireccion' => BASE_URL . 'login'
        ]);
        exit();
    }

    $_SESSION['mensaje_redireccion'] = json_encode([
        'estado' => 'error',
        'titulo' => $titulo,
        'mensaje' => $mensaje
    ]);
    header('Location: ' . BASE_URL . 'login');
    exit();
}

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
