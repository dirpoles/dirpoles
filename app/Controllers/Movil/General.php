<?php

use App\Models\loginModel;
use App\Models\BitacoraModel;
use App\Core\JwtHandler;

function procesarGeneral(array $datos)
{
    switch ($datos['accion']) {
        case 'login':
            movilLogin($datos);
            break;
        case 'me':
            movilGetEmpleado($datos);
            break;
        case 'logout':
            movilLogout($datos);
            break;
        default:
            http_response_code(404);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => "Acción general '{$datos['accion']}' no reconocida."
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

/**
 * Helper: Verifica el token JWT enviado en el header
 * Devuelve los datos del empleado si es válido o termina la ejecución si no.
 */
function verificarTokenMovil()
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];

    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Sesión expirada o inválida.']);
        exit();
    }

    $jwtHandler = new JwtHandler();
    $jwtHandler->__set('token', $matches[1]);
    $validacion = $jwtHandler->manejarAccion('validar');

    if ($validacion['estado'] !== 'exito') {
        http_response_code(401);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Token inválido o expirado.']);
        exit();
    }

    return (array) $validacion['data'];
}

/**
 * Acción: logout
 * Registra la salida en la bitácora y confirma el cierre.
 */
function movilLogout(array $datos)
{
    try {
        // Verificar identidad para saber quién está saliendo
        $empleado = verificarTokenMovil();

        // Registrar en bitácora
        $bitacora = new BitacoraModel();
        $bitacora->__set('id_empleado', $empleado['id_empleado']);
        $bitacora->__set('modulo', 'Seguridad');
        $bitacora->__set('accion', 'Logout');
        $bitacora->__set('descripcion', "El empleado {$empleado['nombre']} cerró sesión desde la App.");
        $bitacora->manejarAccion('registrar_bitacora');

        http_response_code(200);
        echo json_encode([
            'estado' => 'exito',
            'mensaje' => 'Sesión cerrada correctamente.'
        ]);
    } catch (\Throwable $th) {
        // Si el token ya expiró o es inválido, igual devolvemos éxito 
        // para que la app proceda a limpiar los datos locales.
        http_response_code(200);
        echo json_encode([
            'estado' => 'exito',
            'mensaje' => 'Sesión finalizada.'
        ]);
    }
    exit();
}
