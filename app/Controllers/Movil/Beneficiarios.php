<?php

use App\Models\BeneficiarioModel;
use App\Models\PermisosModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;

function procesarBeneficiarios(array $datos)
{
    switch ($datos['accion']) {
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
        default:
            http_response_code(404);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => "Acción de beneficiarios '{$datos['accion']}' no reconocida."
            ]);
            exit;
    }
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
