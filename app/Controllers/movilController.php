<?php

use App\Models\loginModel;
use App\Models\BeneficiarioModel;
use App\Models\PermisosModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;
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

        case 'obtener_pnf':
            obtener_PNF();
            break;

        case 'registrar_beneficiario':
            movilRegistrarBeneficiario($datos);
            break;

        case 'consultar_beneficiarios':
            consultar_beneficiarios($datos);
            break;

        case 'actualizar_beneficiario':
            movilActualizarBeneficiario($datos);
            break;

        case 'desactivar_beneficiario':
            movilDesactivarBeneficiario($datos);
            break;

        case 'validar_duplicado':
            movilValidarDuplicado($datos);
            break;

        // Aquí podrás agregar más acciones en el futuro:
        // case 'beneficiarios': movilBeneficiarios($datos); break;
        // case 'citas':         movilCitas($datos); break;
        // case 'inventario':    movilInventario($datos); break;
        case 'logout':
            movilLogout($datos);
            break;

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
 * Acción: registrar_beneficiario
 */
function movilRegistrarBeneficiario(array $datos)
{
    // 1. Verificar Identidad
    $empleado = verificarTokenMovil();
    $id_empleado = $empleado['id_empleado'];
    $id_tipo_empleado = $empleado['id_tipo_empleado'];

    // Simular sesión para compatibilidad con Modelos
    if (session_status() === PHP_SESSION_NONE)
        session_start();
    $_SESSION['id_empleado'] = $id_empleado;
    $_SESSION['nombre'] = $empleado['nombre'];
    $_SESSION['id_tipo_empleado'] = $id_tipo_empleado;

    try {
        // 2. Verificar Permisos
        $permisos = new PermisosModel();
        $permisos->__set('Modulo', 'Beneficiarios');
        $permisos->__set('Permiso', 'Crear');
        $permisos->__set('Rol', $id_tipo_empleado);

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para registrar beneficiarios.');
        }

        // 3. Sanitizar Datos
        $nombres = htmlspecialchars(trim($datos['nombres'] ?? ''), ENT_QUOTES, 'UTF-8');
        $apellidos = htmlspecialchars(trim($datos['apellidos'] ?? ''), ENT_QUOTES, 'UTF-8');
        $tipo_cedula = htmlspecialchars(trim($datos['tipo_cedula'] ?? ''), ENT_QUOTES, 'UTF-8');
        $cedula = htmlspecialchars(trim($datos['cedula'] ?? ''), ENT_QUOTES, 'UTF-8');
        $correo = filter_var($datos['correo'] ?? '', FILTER_SANITIZE_EMAIL);
        $telefono = htmlspecialchars(trim($datos['telefono'] ?? ''), ENT_QUOTES, 'UTF-8');
        $fecha_nac = htmlspecialchars(trim($datos['fecha_nac'] ?? ''), ENT_QUOTES, 'UTF-8');
        $direccion = htmlspecialchars(trim($datos['direccion'] ?? ''), ENT_QUOTES, 'UTF-8');
        $genero = htmlspecialchars(trim($datos['genero'] ?? ''), ENT_QUOTES, 'UTF-8');
        $id_pnf = htmlspecialchars(trim($datos['id_pnf'] ?? ''), ENT_QUOTES, 'UTF-8');
        $seccion = htmlspecialchars(trim($datos['seccion'] ?? ''), ENT_QUOTES, 'UTF-8');

        // Validar campos obligatorios
        if (empty($nombres) || empty($cedula) || empty($id_pnf)) {
            throw new Exception('Faltan datos obligatorios para el registro.');
        }

        // 4. Registrar en BD
        $modelo = new BeneficiarioModel();
        $beneficiarioData = [
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'correo' => $correo,
            'telefono' => $telefono,
            'fecha_nac' => $fecha_nac,
            'direccion' => $direccion,
            'genero' => $genero,
            'id_pnf' => $id_pnf,
            'seccion' => $seccion,
            'estatus' => 1
        ];

        foreach ($beneficiarioData as $attr => $val) {
            $modelo->__set($attr, $val);
        }

        $registro = $modelo->manejarAccion('registrar_beneficiario');

        if ($registro['exito'] !== true) {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar en la base de datos.');
        }

        // 5. Bitácora
        $bitacora = new BitacoraModel();
        $bitacora->__set('id_empleado', $id_empleado);
        $bitacora->__set('modulo', 'Beneficiarios');
        $bitacora->__set('accion', 'Registro');
        $bitacora->__set('descripcion', "El empleado {$empleado['nombre']} registró desde la App al beneficiario: $nombres ($tipo_cedula-$cedula)");
        $bitacora->manejarAccion('registrar_bitacora');

        // 6. Notificación
        $notificacion = new NotificacionesModel();
        $notificacion->__set('titulo', 'Registro de Beneficiario (Móvil)');
        $notificacion->__set('url', 'consultar_beneficiarios');
        $notificacion->__set('tipo', 'beneficiario');
        $notificacion->__set('id_emisor', $id_empleado);
        $notificacion->__set('id_receptor', 1); // Admin
        $notificacion->__set('leido', 0);
        $notificacion->manejarAccion('crear_notificacion');

        echo json_encode([
            'estado' => 'exito',
            'mensaje' => 'Beneficiario registrado exitosamente.'
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => $e->getMessage()
        ]);
    }
    exit();
}

/**
 * Acción: obtener_pnf
 * Devuelve la lista de PNFs disponibles.
 */
function obtener_PNF()
{
    $modelo = new BeneficiarioModel();
    try {
        $pnfs = $modelo->manejarAccion('obtener_pnf');
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $pnfs]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al obtener PNFs.'
        ]);
        exit();
    }
}

function consultar_beneficiarios($datos)
{
    $modelo = new BeneficiarioModel();
    try {
        $beneficiarios = $modelo->manejarAccion('consultar_beneficiarios');
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $beneficiarios]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al obtener beneficiarios.'
        ]);
        exit();
    }
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

/**
 * Acción: actualizar_beneficiario
 */
function movilActualizarBeneficiario(array $datos)
{
    // 1. Verificar Identidad
    $empleado = verificarTokenMovil();
    $id_empleado = $empleado['id_empleado'];
    $id_tipo_empleado = $empleado['id_tipo_empleado'];

    // Simular sesión para compatibilidad con Modelos
    if (session_status() === PHP_SESSION_NONE)
        session_start();
    $_SESSION['id_empleado'] = $id_empleado;
    $_SESSION['nombre'] = $empleado['nombre'];
    $_SESSION['id_tipo_empleado'] = $id_tipo_empleado;

    try {
        // 2. Verificar Permisos
        $permisos = new PermisosModel();
        $permisos->__set('Modulo', 'Beneficiarios');
        $permisos->__set('Permiso', 'Editar');
        $permisos->__set('Rol', $id_tipo_empleado);

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para actualizar beneficiarios.');
        }

        // 3. Sanitizar Datos
        $id_beneficiario = filter_var($datos['id_beneficiario'] ?? 0, FILTER_VALIDATE_INT);
        $nombres = htmlspecialchars(trim($datos['nombres'] ?? ''), ENT_QUOTES, 'UTF-8');
        $apellidos = htmlspecialchars(trim($datos['apellidos'] ?? ''), ENT_QUOTES, 'UTF-8');
        $tipo_cedula = htmlspecialchars(trim($datos['tipo_cedula'] ?? ''), ENT_QUOTES, 'UTF-8');
        $cedula = htmlspecialchars(trim($datos['cedula'] ?? ''), ENT_QUOTES, 'UTF-8');
        $correo = filter_var($datos['correo'] ?? '', FILTER_SANITIZE_EMAIL);
        $telefono = htmlspecialchars(trim($datos['telefono'] ?? ''), ENT_QUOTES, 'UTF-8');
        $fecha_nac = htmlspecialchars(trim($datos['fecha_nac'] ?? ''), ENT_QUOTES, 'UTF-8');
        $direccion = htmlspecialchars(trim($datos['direccion'] ?? ''), ENT_QUOTES, 'UTF-8');
        $genero = htmlspecialchars(trim($datos['genero'] ?? ''), ENT_QUOTES, 'UTF-8');
        $id_pnf = htmlspecialchars(trim($datos['id_pnf'] ?? ''), ENT_QUOTES, 'UTF-8');
        $seccion = htmlspecialchars(trim($datos['seccion'] ?? ''), ENT_QUOTES, 'UTF-8');
        $estatus = filter_var($datos['estatus'] ?? 1, FILTER_VALIDATE_INT);

        // Validar campos obligatorios
        if (!$id_beneficiario || empty($nombres) || empty($cedula) || empty($id_pnf)) {
            throw new Exception('Faltan datos obligatorios para la actualización.');
        }

        // 4. Actualizar en BD
        $modelo = new BeneficiarioModel();
        $beneficiarioData = [
            'id_beneficiario' => $id_beneficiario,
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'correo' => $correo,
            'telefono' => $telefono,
            'fecha_nac' => $fecha_nac,
            'direccion' => $direccion,
            'genero' => $genero,
            'id_pnf' => $id_pnf,
            'seccion' => $seccion,
            'estatus' => $estatus
        ];

        foreach ($beneficiarioData as $attr => $val) {
            $modelo->__set($attr, $val);
        }

        $actualizacion = $modelo->manejarAccion('actualizar_beneficiario');

        if ($actualizacion['exito'] !== true) {
            throw new Exception($actualizacion['error'] ?? $actualizacion['mensaje'] ?? 'Error al actualizar en la base de datos.');
        }

        // 5. Bitácora
        $bitacora = new BitacoraModel();
        $bitacora->__set('id_empleado', $id_empleado);
        $bitacora->__set('modulo', 'Beneficiarios');
        $bitacora->__set('accion', 'Actualización');
        $bitacora->__set('descripcion', "El empleado {$empleado['nombre']} actualizó desde la App al beneficiario: $nombres ($tipo_cedula-$cedula)");
        $bitacora->manejarAccion('registrar_bitacora');

        echo json_encode([
            'estado' => 'exito',
            'mensaje' => 'Beneficiario actualizado exitosamente.'
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => $e->getMessage()
        ]);
    }
    exit();
}

/**
 * Acción: desactivar_beneficiario (Borrado Lógico)
 */
function movilDesactivarBeneficiario(array $datos)
{
    try {
        $empleado = verificarTokenMovil();
        $id_beneficiario = filter_var($datos['id_beneficiario'] ?? 0, FILTER_VALIDATE_INT);

        if (!$id_beneficiario) {
            throw new Exception('ID de beneficiario no válido.');
        }

        $modelo = new BeneficiarioModel();
        $modelo->__set('id_beneficiario', $id_beneficiario);

        // Ejecutamos la acción específica en el modelo
        $resultado = $modelo->manejarAccion('desactivar_beneficiario');

        if ($resultado['exito'] === true) {
            // Bitácora
            $bitacora = new BitacoraModel();
            $bitacora->__set('id_empleado', $empleado['id_empleado']);
            $bitacora->__set('modulo', 'Beneficiarios');
            $bitacora->__set('accion', 'Desactivación');
            $bitacora->__set('descripcion', "El empleado {$empleado['nombre']} desactivó al beneficiario ID: $id_beneficiario desde la App.");
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode(['estado' => 'exito', 'mensaje' => 'Beneficiario desactivado correctamente.']);
        } else {
            throw new Exception($resultado['error'] ?? 'Error al desactivar en BD.');
        }

    } catch (\Throwable $e) {
        http_response_code(400);
        echo json_encode(['estado' => 'error', 'mensaje' => $e->getMessage()]);
    }
    exit();
}

/**
 * Acción: validar_duplicado
 * Verifica en tiempo real si un campo (cedula, correo, telefono) ya existe.
 */
function movilValidarDuplicado(array $datos)
{
    try {
        $campo = $datos['campo'] ?? '';
        $valor = $datos['valor'] ?? '';
        $id_excluir = filter_var($datos['id_excluir'] ?? null, FILTER_VALIDATE_INT);

        if (empty($campo) || empty($valor)) {
            throw new Exception('Faltan datos para validar.');
        }

        $modelo = new BeneficiarioModel();
        $modelo->__set('campo', $campo);
        $modelo->__set('valor', $valor);
        $modelo->__set('id_excluir', $id_excluir);
        $existe = $modelo->manejarAccion('verificar_duplicado');

        echo json_encode([
            'estado' => 'exito',
            'existe' => $existe,
            'mensaje' => $existe ? "Este {$campo} ya está registrado." : "Disponible."
        ]);

    } catch (\Throwable $e) {
        http_response_code(400);
        echo json_encode(['estado' => 'error', 'mensaje' => $e->getMessage()]);
    }
    exit();
}