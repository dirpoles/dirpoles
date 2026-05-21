<?php
const BASE_PATH = __DIR__ . '/';
const BASE_URL = '/DIRPOLES_4/';

// ==================== CORS MIDDLEWARE GLOBAL ====================
$origenSolicitado = $_SERVER['HTTP_ORIGIN'] ?? '';
$origenesPermitidos = [
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://localhost:3000',
    'http://localhost:5173',
];

if (in_array($origenSolicitado, $origenesPermitidos)) {
    header("Access-Control-Allow-Origin: " . $origenSolicitado);
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With");
header("Access-Control-Max-Age: 86400");

// Respuesta inmediata a peticiones Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// ================================================================

session_start();

require_once BASE_PATH . 'vendor/autoload.php';
// Cargar variables de entorno inmediatamente
if (file_exists(BASE_PATH . '.env')) {
    $dotenv = \Dotenv\Dotenv::createImmutable(BASE_PATH);
    $dotenv->load();
}

require_once BASE_PATH . 'app/Config/config.php';
require_once BASE_PATH . 'app/bootstrap.php';
require_once BASE_PATH . 'app/routes.php';

//Ejecutar el Router

\App\Core\Router::ejecutar();
