<?php

use App\Models\BitacoraModel;
use App\Models\PermisosModel;
use App\Models\NotificacionesModel;
use App\Models\PerfilModel;
use Exception;

function procesarPerfil(array $datos)
{
    switch ($datos['accion']) {
        case 'consultar_perfil':
            consultar_perfil();
            break;

        case 'actualizar_perfil':
            actualizar_perfil($datos);
            break;

        default:
            http_response_code(404);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => "Acción de Perfil '{$datos['accion']}' no reconocida."
            ]);
            exit;
    }
}

function consultar_perfil()
{
    $empleado = verificarTokenMovil();
    $id_empleado = $empleado['id_empleado'];

    try {
        $modelo = new PerfilModel();
        $modelo->__set('id_empleado', $id_empleado);
        $perfil = $modelo->manejarAccion('consultar_perfil');

        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $perfil]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al consultar el perfil.'
        ]);
        exit();
    }
}

function actualizar_perfil(array $datos)
{
    $empleado = verificarTokenMovil();
    $id_empleado = $empleado['id_empleado'];

    try {
        // Sanitizar y validar los datos recibidos
        $nombre = htmlspecialchars(trim($datos['nombre'] ?? ''), ENT_QUOTES, 'UTF-8');
        $apellido = htmlspecialchars(trim($datos['apellido'] ?? ''), ENT_QUOTES, 'UTF-8');
        $correo = filter_var($datos['correo'] ?? '', FILTER_VALIDATE_EMAIL);
        $telefono = htmlspecialchars(trim($datos['telefono'] ?? ''), ENT_QUOTES, 'UTF-8');
        $direccion = htmlspecialchars(trim($datos['direccion'] ?? ''), ENT_QUOTES, 'UTF-8');
        $clave_actual = $datos['clave_actual'] ?? '';
        $nueva_clave = $datos['nueva_clave'] ?? '';

        if (empty($nombre) || empty($apellido) || !$correo || empty($telefono) || empty($direccion)) {
            throw new Exception('Faltan datos obligatorios o el formato es incorrecto.');
        }

        $modelo = new PerfilModel();
        $modelo->__set('id_empleado', $id_empleado);

        // Si se desea actualizar la contraseña
        if (!empty($nueva_clave)) {
            if (empty($clave_actual)) {
                throw new Exception('Debe ingresar su contraseña actual para poder cambiarla.');
            }
            $modelo->__set('clave_actual', $clave_actual);
            $valida = $modelo->manejarAccion('validar_contrasena_actual');
            if (!$valida) {
                throw new Exception('La contraseña actual ingresada es incorrecta.');
            }
            $modelo->__set('contrasena', $nueva_clave);
        }

        $modelo->__set('nombre', $nombre);
        $modelo->__set('apellido', $apellido);
        $modelo->__set('correo', $correo);
        $modelo->__set('telefono', $telefono);
        $modelo->__set('direccion', $direccion);

        $resultado = $modelo->manejarAccion('actualizar_perfil');

        if (!$resultado) {
            throw new Exception('Error al guardar los cambios en la base de datos.');
        }

        // Registrar en Bitácora
        $bitacora = new BitacoraModel();
        $bitacora->__set('id_empleado', $id_empleado);
        $bitacora->__set('modulo', 'Perfil');
        $bitacora->__set('accion', 'Actualización');
        $bitacora->__set('descripcion', "El empleado {$empleado['nombre']} actualizó sus datos de perfil personal desde la aplicación móvil.");
        $bitacora->manejarAccion('registrar_bitacora');

        echo json_encode([
            'estado' => 'exito',
            'mensaje' => 'Perfil actualizado exitosamente.'
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