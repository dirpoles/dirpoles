<?php

use App\Models\InvMedicinaModel;
use App\Models\PermisosModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;

function procesarInventario(array $datos)
{
    switch ($datos['accion']) {
        case 'consultar_inventario_medico':
            consultar_inventario_medicina();
            break;

        case 'consultar_presentaciones_insumo':
            consultar_presentacion_insumo();
            break;

        case 'registrar_insumo':
            registrar_insumo_movil($datos);
            break;

        case 'actualizar_insumo':
            actualizar_insumo_movil($datos);
            break;

        default:
            http_response_code(404);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => "Acción de Inventario '{$datos['accion']}' no reconocida."
            ]);
            exit;
    }
}

function consultar_inventario_medicina()
{
    $modelo = new InvMedicinaModel();
    try {
        $inventario = $modelo->manejarAccion('consultar_inventario');
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $inventario]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al obtener inventario.'
        ]);
        exit();
    }
}

function consultar_presentacion_insumo()
{
    $modelo = new InvMedicinaModel();
    try {
        $presentaciones = $modelo->manejarAccion('obtenerPresentaciones');
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $presentaciones]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al obtener presentacion.'
        ]);
        exit();
    }
}


function registrar_insumo_movil($datos)
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
        $permisos->__set('Modulo', 'Inventario Medico');
        $permisos->__set('Permiso', 'Crear');
        $permisos->__set('Rol', $id_tipo_empleado);

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para registrar insumos.');
        }

        // 3. Sanitizar Datos
        $nombre_insumo = htmlspecialchars(trim($datos['nombre_insumo'] ?? ''), ENT_QUOTES, 'UTF-8');
        $tipo_insumo = htmlspecialchars(trim($datos['tipo_insumo'] ?? ''), ENT_QUOTES, 'UTF-8');
        $id_presentacion = filter_var($datos['id_presentacion'] ?? null, FILTER_VALIDATE_INT);
        $fecha_vencimiento = htmlspecialchars(trim($datos['fecha_vencimiento'] ?? ''), ENT_QUOTES, 'UTF-8');
        $estatus = htmlspecialchars(trim($datos['estatus'] ?? ''), ENT_QUOTES, 'UTF-8');
        $descripcion = htmlspecialchars(trim($datos['descripcion'] ?? ''), ENT_QUOTES, 'UTF-8');
        $cantidad = filter_var($datos['cantidad'] ?? 0, FILTER_VALIDATE_INT);

        // Validar campos obligatorios
        if (empty($nombre_insumo) || empty($tipo_insumo) || empty($id_presentacion) || empty($fecha_vencimiento) || empty($estatus) || empty($descripcion)) {
            throw new Exception('Faltan datos obligatorios para el registro.');
        }

        // 4. Registrar en BD
        $modelo = new InvMedicinaModel();
        $insumoData = [
            'nombre_insumo' => $nombre_insumo,
            'tipo_insumo' => $tipo_insumo,
            'id_presentacion' => $id_presentacion,
            'fecha_vencimiento' => $fecha_vencimiento,
            'estatus' => $estatus,
            'descripcion' => $descripcion,
            'cantidad' => $cantidad,
            'id_empleado' => $id_empleado
        ];

        foreach ($insumoData as $attr => $val) {
            $modelo->__set($attr, $val);
        }

        $registro = $modelo->manejarAccion('registrar_insumo');

        if ($registro['exito'] !== true) {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar el insumo en la base de datos.');
        }

        // 5. Bitácora
        $bitacora = new BitacoraModel();
        $bitacora->__set('id_empleado', $id_empleado);
        $bitacora->__set('modulo', 'Inventario Medico');
        $bitacora->__set('accion', 'Registro');
        $bitacora->__set('descripcion', "El empleado {$empleado['nombre']} registró desde la App el insumo: $nombre_insumo en el inventario médico.");
        $bitacora->manejarAccion('registrar_bitacora');

        // 6. Notificación
        $notificacion = new NotificacionesModel();
        $notificacion->__set('titulo', 'Registro de Insumo (Móvil)');
        $notificacion->__set('url', 'consultar_inventario_medico');
        $notificacion->__set('tipo', 'inventario');
        $notificacion->__set('id_emisor', $id_empleado);
        $notificacion->__set('id_receptor', 1); // Admin
        $notificacion->__set('leido', 0);
        $notificacion->manejarAccion('crear_notificacion');

        echo json_encode([
            'estado' => 'exito',
            'mensaje' => 'Insumo registrado exitosamente.'
        ]);
    } catch (\Throwable $th) {
        http_response_code(400);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => $th->getMessage()
        ]);
    }
    exit();
}

function actualizar_insumo_movil($datos)
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
        $permisos->__set('Modulo', 'Inventario Medico');
        $permisos->__set('Permiso', 'Editar');
        $permisos->__set('Rol', $id_tipo_empleado);

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para actualizar insumos.');
        }

        // 3. Sanitizar Datos
        $id_insumo = filter_var($datos['id_insumo'] ?? null, FILTER_VALIDATE_INT);
        $nombre_insumo = htmlspecialchars(trim($datos['nombre_insumo'] ?? ''), ENT_QUOTES, 'UTF-8');
        $tipo_insumo = htmlspecialchars(trim($datos['tipo_insumo'] ?? ''), ENT_QUOTES, 'UTF-8');
        $id_presentacion = filter_var($datos['id_presentacion'] ?? null, FILTER_VALIDATE_INT);
        $fecha_vencimiento = htmlspecialchars(trim($datos['fecha_vencimiento'] ?? ''), ENT_QUOTES, 'UTF-8');
        $estatus = htmlspecialchars(trim($datos['estatus'] ?? ''), ENT_QUOTES, 'UTF-8');
        $descripcion = htmlspecialchars(trim($datos['descripcion'] ?? ''), ENT_QUOTES, 'UTF-8');

        // Validar campos obligatorios
        if (empty($nombre_insumo) || empty($tipo_insumo) || empty($id_presentacion) || empty($fecha_vencimiento) || empty($estatus) || empty($descripcion)) {
            throw new Exception('Faltan datos obligatorios para actualizar.');
        }

        // 4. Registrar en BD
        $modelo = new InvMedicinaModel();
        $insumoData = [
            'id_insumo' => $id_insumo,
            'nombre_insumo' => $nombre_insumo,
            'tipo_insumo' => $tipo_insumo,
            'id_presentacion' => $id_presentacion,
            'fecha_vencimiento' => $fecha_vencimiento,
            'estatus' => $estatus,
            'descripcion' => $descripcion,
            'id_empleado' => $id_empleado
        ];

        foreach ($insumoData as $attr => $val) {
            $modelo->__set($attr, $val);
        }

        $registro = $modelo->manejarAccion('actualizar_insumo');

        if ($registro['exito'] !== true) {
            throw new Exception($registro['mensaje'] ?? 'Error al actualizar el insumo en la base de datos.');
        }

        // 5. Bitácora
        $bitacora = new BitacoraModel();
        $bitacora->__set('id_empleado', $id_empleado);
        $bitacora->__set('modulo', 'Inventario Medico');
        $bitacora->__set('accion', 'Registro');
        $bitacora->__set('descripcion', "El empleado {$empleado['nombre']} actualizó desde la App el insumo: $nombre_insumo en el inventario médico.");
        $bitacora->manejarAccion('registrar_bitacora');

        // 6. Notificación
        $notificacion = new NotificacionesModel();
        $notificacion->__set('titulo', 'Actualización de Insumo (Móvil)');
        $notificacion->__set('url', 'consultar_inventario_medico');
        $notificacion->__set('tipo', 'inventario');
        $notificacion->__set('id_emisor', $id_empleado);
        $notificacion->__set('id_receptor', 1); // Admin
        $notificacion->__set('leido', 0);
        $notificacion->manejarAccion('crear_notificacion');

        echo json_encode([
            'estado' => 'exito',
            'mensaje' => 'Insumo actualizado exitosamente.'
        ]);
    } catch (\Throwable $th) {
        http_response_code(400);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => $th->getMessage()
        ]);
    }
    exit();
}