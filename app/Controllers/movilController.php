<?php

use App\Models\loginModel;
use App\Core\JwtHandler;

/**
 * Controlador único para todas las peticiones de la App Móvil.
 * Detecta la acción solicitada a través del campo "accion" en el JSON.
 *
 * Ruta: POST /DIRPOLES_4/api/movil
 * Body (JSON): { "accion": "login", ... }
 */

function manejarPeticionMovil()
{
    //--1. Cabeceras CORS para permitir peticiones desde la app --
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
    header('Content-Type: application/json; charset=utf-8');

    //-- Pre-flight OPTIONS (Axios lo manda de cada peticion real)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    //-- 2. Leer el JSON que manda la app --
    $rawBody = file_get_contents('php://input');
    $datos = json_decode($rawBody, true);

    if (json_last_error() !== JSON_ERROR_NONE || !isset($datos['accion'])) {
        http_response_code(400);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Petición inválida: se requiere el campo "acción" en el JSON.'
        ]);
        exit;
    }

    //3.-- Enrutar segun la acción --
    switch ($datos['accion']) {
        case 'login':
            movilLogin($datos);
            break;

        case 'me':
            movilGetEmpleado($datos);
            break;

        // Aquí podrás agregar más acciones en el futuro:
        // case 'beneficiarios': movilBeneficiarios($datos); break;
        // case 'citas':         movilCitas($datos); break;
        // case 'inventario':    movilInventario($datos); break;
        // case 'logout':        movilLogout($datos); break;

        default:
            http_response_code(404);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => "Acción '{$datos['accion']}' no reconocida."
            ]);
            exit;
    }
}

/**
 * Acción: login
 * Recibe: { "accion": "login", "correo": "...", "password": "..." }
 */
function movilLogin(array $datos)
{
    $correo = trim($datos['correo'] ?? '');
    $password = trim($datos['password'] ?? '');
    if (empty($correo) || empty($password)) {
        http_response_code(422);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Correo y contraseña son obligatorios.'
        ]);
        exit();
    }
    try {
        $modelo = new loginModel();
        $modelo->__set('correo', $correo);
        $modelo->__set('password', $password);
        $resultado = $modelo->manejador('Autenticar');
        // ── Cuenta bloqueada ─────────────────────────────────────────────────
        if ($resultado['estado'] === 'bloqueado') {
            http_response_code(403);
            echo json_encode([
                'estado' => 'bloqueado',
                'mensaje' => $resultado['mensaje']
            ]);
            exit();
        }
        // ── Credenciales inválidas ────────────────────────────────────────────
        if ($resultado['estado'] !== 'exito') {
            http_response_code(401);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => $resultado['mensaje'] ?? 'Credenciales inválidas.'
            ]);
            exit();
        }
        // ── Éxito: generar JWT y devolver datos del empleado ─────────────────
        $usuario = $resultado['usuario'];
        $jwtHandler = new JwtHandler();
        $jwtHandler->__set('data', [
            'id_empleado' => $usuario['id_empleado'],
            'nombre' => $usuario['nombre'],
            'apellido' => $usuario['apellido'],
            'correo' => $usuario['correo'],
            'id_tipo_empleado' => $usuario['id_tipo_empleado'],
            'tipo_empleado' => $usuario['nombre_tipo'],
        ]);
        $jwtResult = $jwtHandler->manejarAccion('generar');
        if ($jwtResult['estado'] !== 'exito') {
            http_response_code(500);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => 'No se pudo generar el token de sesión.'
            ]);
            exit();
        }
        http_response_code(200);
        echo json_encode([
            'estado' => 'exito',
            'mensaje' => '¡Bienvenido, ' . $usuario['nombre'] . '!',
            'token' => $jwtResult['token'],
            'empleado' => [
                'id_empleado' => $usuario['id_empleado'],
                'nombre' => $usuario['nombre'],
                'apellido' => $usuario['apellido'],
                'correo' => $usuario['correo'],
                'id_tipo_empleado' => $usuario['id_tipo_empleado'],
                'tipo_empleado' => $usuario['nombre_tipo'],
            ]
        ]);
        exit();
    } catch (\Throwable $e) {
        error_log('[movilController] Error en login: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error interno del servidor.'
        ]);
        exit();
    }
}

/**
 * Acción: me
 * Obtiene los datos del empleado logueado usando el token JWT del header Authorization
 * Recibe: { "accion": "me" }
 * Header: Authorization: Bearer <token>
 */
function movilGetEmpleado(array $datos)
{
    try {
        // 1. Obtener token del header Authorization
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => 'Token no proporcionado. Inicie sesión nuevamente.'
            ]);
            exit();
        }

        $token = $matches[1];

        // 2. Validar token JWT
        $jwtHandler = new JwtHandler();
        $jwtHandler->__set('token', $token);
        $validacion = $jwtHandler->manejarAccion('validar');

        if ($validacion['estado'] !== 'exito') {
            http_response_code(401);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => 'Token inválido o expirado.'
            ]);
            exit();
        }

        // 3. Devolver datos del empleado desde el token
        $empleado = $validacion['data'];

        http_response_code(200);
        echo json_encode([
            'estado' => 'exito',
            'empleado' => [
                'id_empleado' => $empleado['id_empleado'] ?? null,
                'nombre' => $empleado['nombre'] ?? '',
                'apellido' => $empleado['apellido'] ?? '',
                'correo' => $empleado['correo'] ?? '',
                'id_tipo_empleado' => $empleado['id_tipo_empleado'] ?? null,
                'tipo_empleado' => $empleado['tipo_empleado'] ?? '',
            ]
        ]);
        exit();

    } catch (\Throwable $e) {
        error_log('[movilController] Error en me: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error interno del servidor.'
        ]);
        exit();
    }
}