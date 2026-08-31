<?php

use App\Models\InventarioMobModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;
use App\Models\PermisosModel;

function crear_inventario_mob()
{
    $modelo = new InventarioMobModel();
    $permisos = new PermisosModel();
    $modulo = 'Mobiliario';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        $tiposMobiliario = $modelo->manejarAccion('obtener_TiposMobiliarios');
        $tiposEquipos = $modelo->manejarAccion('obtener_TiposEquipos');
        $servicios = $modelo->manejarAccion('obtener_servicios');

        // Obtener estadísticas para los cards superiores
        $stats = $modelo->manejarAccion('obtener_estadisticas');
        $total_mobiliarios = $stats['total_mobiliarios'];
        $total_equipos = $stats['total_equipos'];
        $fichas_tecnicas = $stats['fichas_tecnicas'];
        $inventario_mes = $stats['inventario_mes'];

        require_once BASE_PATH . '/app/Views/inventario_mobiliario/crear_inventario_mob.php';
    } catch (Throwable $e) {
        // Si la petición NO es AJAX, mostramos la vista de error
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            // Si es AJAX, devolvemos JSON
            echo json_encode([
                'exito' => false,
                'mensaje' => $e->getMessage()
            ]);
        }
    }
}

function ficha_tecnica_form_data()
{
    $modelo = new InventarioMobModel();
    header('Content-Type: application/json');

    try {
        $servicios = $modelo->manejarAccion('obtener_servicios');
        $empleados = $modelo->manejarAccion('obtener_empleados');

        echo json_encode([
            'servicios' => $servicios,
            'empleados' => $empleados
        ]);
    } catch (Throwable $e) {
        echo json_encode(['servicios' => [], 'empleados' => [], 'error' => $e->getMessage()]);
    }
}

function registrar_ficha_tecnica()
{
    $modelo = new InventarioMobModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Mobiliario';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            throw new Exception('Método no permitido');
        }

        $nombre_ficha = filter_input(INPUT_POST, 'nombre_ficha', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_servicio = filter_input(INPUT_POST, 'id_servicio', FILTER_SANITIZE_NUMBER_INT);
        $id_empleado_responsable = filter_input(INPUT_POST, 'id_empleado_responsable', FILTER_SANITIZE_NUMBER_INT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fecha_creacion = filter_input(INPUT_POST, 'fecha_creacion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (!$nombre_ficha || !$id_servicio || !$fecha_creacion) {
            throw new Exception('Todos los campos obligatorios deben ser completados');
        }

        $modelo->__set('nombre_ficha', $nombre_ficha);
        $modelo->__set('id_servicio', $id_servicio);
        $modelo->__set('id_empleado_responsable', $id_empleado_responsable);
        $modelo->__set('descripcion', $descripcion);
        $modelo->__set('fecha_creacion', $fecha_creacion);

        $resultado = $modelo->manejarAccion('registrarFichaTecnica');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El empleado {$_SESSION['nombre']} registró la ficha técnica: $nombre_ficha"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
        }

        echo json_encode($resultado);
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function registrar_mobiliario()
{
    $modelo = new InventarioMobModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Mobiliario';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            throw new Exception('Método no permitido');
        }

        $itemsRegistrados = 0;

        $id_tipo_mobiliario = filter_input(INPUT_POST, 'id_tipo_mobiliario', FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY);
        $id_servicios = filter_input(INPUT_POST, 'id_servicios', FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY);
        $marca = filter_input(INPUT_POST, 'marca', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        $modelo_val = filter_input(INPUT_POST, 'modelo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        $color = filter_input(INPUT_POST, 'color', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        $estado = filter_input(INPUT_POST, 'estado', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        $cantidad = filter_input(INPUT_POST, 'cantidad', FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY);
        $fecha_adquisicion = filter_input(INPUT_POST, 'fecha_adquisicion', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        $empleado = $_SESSION['nombre'];


        //Validar que todos los arrays tengan el mismo tamaño
        $count = count($marca);
        $arrays = [$id_tipo_mobiliario, $id_servicios, $marca, $modelo_val, $color, $estado, $cantidad, $fecha_adquisicion, $descripcion, $observaciones];
        foreach ($arrays as $array) {
            if (count($array) != $count) {
                throw new Exception('Los arrays no tienen el mismo tamaño');
            }
        }

        for ($i = 0; $i < $count; $i++) {
            $data = [
                'id_tipo_mobiliario' => $id_tipo_mobiliario[$i],
                'id_servicios' => $id_servicios[$i],
                'marca' => $marca[$i],
                'modelo' => $modelo_val[$i],
                'color' => $color[$i],
                'estado' => $estado[$i],
                'cantidad' => $cantidad[$i],
                'fecha_adquisicion' => $fecha_adquisicion[$i],
                'descripcion' => $descripcion[$i],
                'observaciones' => $observaciones[$i]
            ];

            foreach ($data as $atributo => $valor) {
                $modelo->__set($atributo, $valor);
            }

            $resultado = $modelo->manejarAccion('registrarMobiliario');
            if ($resultado['exito']) {
                $itemsRegistrados++;
            }
        }

        if ($itemsRegistrados > 0) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El empleado $empleado registró $itemsRegistrados items de mobiliario"
            ];

            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
            echo json_encode([
                'exito' => true,
                'mensaje' => "Se registraron $itemsRegistrados items de mobiliario"
            ]);
        } else {
            throw new Exception('No se registraron items de mobiliario');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function registrar_equipo()
{
    $modelo = new InventarioMobModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Mobiliario';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            throw new Exception('Método no permitido');
        }

        $itemsRegistrados = 0;

        $id_tipo_equipo      = filter_input(INPUT_POST, 'id_tipo_equipo', FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY) ?? [];
        $id_servicios        = filter_input(INPUT_POST, 'id_servicios', FILTER_SANITIZE_NUMBER_INT, FILTER_REQUIRE_ARRAY) ?? [];
        $marca               = filter_input(INPUT_POST, 'marca', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?? [];
        $modelo_val          = filter_input(INPUT_POST, 'modelo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?? [];
        $serial              = filter_input(INPUT_POST, 'serial', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?? [];
        $color               = filter_input(INPUT_POST, 'color', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?? [];
        $estado              = filter_input(INPUT_POST, 'estado', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?? [];
        $fecha_adquisicion   = filter_input(INPUT_POST, 'fecha_adquisicion', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?? [];
        $descripcion_adicional = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?? [];
        $observaciones       = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?? [];
        $empleado = $_SESSION['nombre'];

        //Validar que todos los arrays tengan el mismo tamaño
        $count = count($marca);
        $arrays = [$id_tipo_equipo, $id_servicios, $marca, $modelo_val, $serial, $color, $estado, $fecha_adquisicion, $descripcion_adicional, $observaciones];
        foreach ($arrays as $array) {
            if (count($array) != $count) {
                throw new Exception('Los arrays no tienen el mismo tamaño');
            }
        }

        for ($i = 0; $i < $count; $i++) {
            $data = [
                'id_tipo_equipo'   => $id_tipo_equipo[$i],
                'id_servicios'     => $id_servicios[$i],
                'marca'            => $marca[$i],
                'modelo'           => $modelo_val[$i],
                'serial'           => $serial[$i],
                'color'            => $color[$i],
                'estado'           => $estado[$i],
                'fecha_adquisicion' => $fecha_adquisicion[$i],
                'descripcion'      => $descripcion_adicional[$i],
                'observaciones'    => $observaciones[$i]
            ];

            foreach ($data as $atributo => $valor) {
                $modelo->__set($atributo, $valor);
            }

            $resultado = $modelo->manejarAccion('registrarEquipo');
            if ($resultado['exito']) {
                $itemsRegistrados++;
            }
        }

        if ($itemsRegistrados > 0) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El empleado $empleado registró $itemsRegistrados items de equipos"
            ];

            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
            echo json_encode([
                'exito' => true,
                'mensaje' => "Se registraron $itemsRegistrados items de equipos"
            ]);
        } else {
            throw new Exception('No se registraron items de equipos');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function consultar_inventario_mob()
{
    $modelo = new InventarioMobModel();
    $permisos = new PermisosModel();
    $modulo = 'Mobiliario';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }


        require_once BASE_PATH . '/app/Views/inventario_mobiliario/consultar_inventario_mob.php';
    } catch (Throwable $e) {
        // Si la petición NO es AJAX, mostramos la vista de error
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            // Si es AJAX, devolvemos JSON
            echo json_encode([
                'exito' => false,
                'mensaje' => $e->getMessage()
            ]);
        }
    }
}

function mobiliario_data_json()
{
    $modelo = new InventarioMobModel();
    try {
        $data = $modelo->manejarAccion('obtener_mobiliarios_json');
        header('Content-Type: application/json');
        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function historial_inventario_json()
{
    $modelo = new InventarioMobModel();
    try {
        $data = $modelo->manejarAccion('obtener_historial_json');
        header('Content-Type: application/json');
        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function equipos_data_json()
{
    $modelo = new InventarioMobModel();
    try {
        $data = $modelo->manejarAccion('obtener_equipos_json');
        header('Content-Type: application/json');
        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function fichas_tecnicas_json()
{
    $modelo = new InventarioMobModel();
    try {
        $data = $modelo->manejarAccion('obtener_fichas_tecnicas_json');
        header('Content-Type: application/json');
        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function ficha_detalle()
{
    $modelo = new InventarioMobModel();
    header('Content-Type: application/json');

    try {
        $id_ficha = $_GET['id_ficha'] ?? null;
        if (!$id_ficha) {
            throw new Exception('ID de ficha técnica no proporcionado');
        }

        $modelo->__set('id_ficha', $id_ficha);
        $data = $modelo->manejarAccion('ficha_detalle');

        echo json_encode(['data' => $data]);
    } catch (Throwable $e) {
        echo json_encode(['data' => [], 'error' => $e->getMessage()]);
    }
}

function ficha_detalle_editar()
{
    $modelo = new InventarioMobModel();
    header('Content-Type: application/json');

    try {
        $id_ficha = $_GET['id_ficha'] ?? null;
        if (!$id_ficha) {
            throw new Exception('ID de ficha técnica no proporcionado');
        }

        $modelo->__set('id_ficha', $id_ficha);
        $data = $modelo->manejarAccion('ficha_detalle_editar');

        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode(['ficha' => null, 'error' => $e->getMessage()]);
    }
}

function ficha_actualizar()
{
    $modelo = new InventarioMobModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $modulo = 'Mobiliario';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_ficha = filter_input(INPUT_POST, 'id_ficha', FILTER_SANITIZE_NUMBER_INT);
        $nombre_ficha = filter_input(INPUT_POST, 'nombre_ficha', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_servicio = filter_input(INPUT_POST, 'id_servicio', FILTER_SANITIZE_NUMBER_INT);
        $id_empleado_responsable = filter_input(INPUT_POST, 'id_empleado_responsable', FILTER_SANITIZE_NUMBER_INT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fecha_creacion = filter_input(INPUT_POST, 'fecha_creacion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_NUMBER_INT);

        if (!$id_ficha || !$nombre_ficha || !$id_servicio || !$fecha_creacion) {
            throw new Exception('Todos los campos obligatorios deben ser completados');
        }

        $datos = [
            'id_ficha' => $id_ficha,
            'nombre_ficha' => $nombre_ficha,
            'id_servicio' => $id_servicio,
            'id_empleado_responsable' => $id_empleado_responsable,
            'descripcion' => $descripcion,
            'fecha_creacion' => $fecha_creacion,
            'estatus' => $estatus ?? 1
        ];

        foreach ($datos as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('ficha_actualizar');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El empleado {$_SESSION['nombre']} actualizó la ficha técnica #$id_ficha"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
        }

        echo json_encode($resultado);
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function ficha_eliminar()
{
    $modelo = new InventarioMobModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $modulo = 'Mobiliario';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_ficha = filter_input(INPUT_POST, 'id_ficha', FILTER_SANITIZE_NUMBER_INT);

        if (!$id_ficha) {
            throw new Exception('ID de ficha técnica no válido');
        }

        $modelo->__set('id_ficha', $id_ficha);
        $resultado = $modelo->manejarAccion('ficha_eliminar');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El empleado {$_SESSION['nombre']} eliminó la ficha técnica #$id_ficha"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
        }

        echo json_encode($resultado);
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function mobiliario_detalle()
{
    $modelo = new InventarioMobModel();
    header('Content-Type: application/json');

    try {
        $id_mobiliario = $_GET['id_mobiliario'] ?? null;
        if (!$id_mobiliario) {
            throw new Exception('ID de mobiliario no proporcionado');
        }

        $modelo->__set('id_mobiliario', $id_mobiliario);
        $data = $modelo->manejarAccion('mobiliario_detalle');

        echo json_encode(['data' => $data]);
    } catch (Throwable $e) {
        echo json_encode(['data' => [], 'error' => $e->getMessage()]);
    }
}

function mobiliario_detalle_editar()
{
    $modelo = new InventarioMobModel();
    header('Content-Type: application/json');

    try {
        $id_mobiliario = $_GET['id_mobiliario'] ?? null;
        if (!$id_mobiliario) {
            throw new Exception('ID de mobiliario no proporcionado');
        }

        $modelo->__set('id_mobiliario', $id_mobiliario);
        $data = $modelo->manejarAccion('mobiliario_detalle_editar');

        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode(['mobiliario' => null, 'error' => $e->getMessage()]);
    }
}

function mobiliario_actualizar()
{
    $modelo = new InventarioMobModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $modulo = 'Mobiliario';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_mobiliario = filter_input(INPUT_POST, 'id_mobiliario', FILTER_SANITIZE_NUMBER_INT);
        $id_tipo_mobiliario = filter_input(INPUT_POST, 'id_tipo_mobiliario', FILTER_SANITIZE_NUMBER_INT);
        $id_servicios = filter_input(INPUT_POST, 'id_servicios', FILTER_SANITIZE_NUMBER_INT);
        $marca = filter_input(INPUT_POST, 'marca', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $modelo_val = filter_input(INPUT_POST, 'modelo', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $color = filter_input(INPUT_POST, 'color', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estado = filter_input(INPUT_POST, 'estado', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $cantidad = filter_input(INPUT_POST, 'cantidad', FILTER_SANITIZE_NUMBER_INT);
        $fecha_adquisicion = filter_input(INPUT_POST, 'fecha_adquisicion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (!$id_mobiliario || !$id_tipo_mobiliario || !$id_servicios || !$marca || !$modelo_val || !$estado || !$cantidad || !$fecha_adquisicion) {
            throw new Exception('Todos los campos obligatorios deben ser completados');
        }

        $datos = [
            'id_mobiliario' => $id_mobiliario,
            'id_tipo_mobiliario' => $id_tipo_mobiliario,
            'id_servicios' => $id_servicios,
            'marca' => $marca,
            'modelo' => $modelo_val,
            'color' => $color,
            'estado' => $estado,
            'cantidad' => $cantidad,
            'fecha_adquisicion' => $fecha_adquisicion,
            'descripcion' => $descripcion,
            'observaciones' => $observaciones
        ];

        foreach ($datos as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('mobiliario_actualizar');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El empleado {$_SESSION['nombre']} actualizó el mobiliario #$id_mobiliario"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
        }

        echo json_encode($resultado);
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function mobiliario_eliminar()
{
    $modelo = new InventarioMobModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $modulo = 'Mobiliario';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_mobiliario = filter_input(INPUT_POST, 'id_mobiliario', FILTER_SANITIZE_NUMBER_INT);

        if (!$id_mobiliario) {
            throw new Exception('ID de mobiliario no válido');
        }

        $modelo->__set('id_mobiliario', $id_mobiliario);
        $resultado = $modelo->manejarAccion('mobiliario_eliminar');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El empleado {$_SESSION['nombre']} eliminó el mobiliario #$id_mobiliario"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
        }

        echo json_encode($resultado);
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function equipo_detalle()
{
    $modelo = new InventarioMobModel();
    header('Content-Type: application/json');

    try {
        $id_equipo = $_GET['id_equipo'] ?? null;
        if (!$id_equipo) {
            throw new Exception('ID de equipo no proporcionado');
        }

        $modelo->__set('id_equipo', $id_equipo);
        $data = $modelo->manejarAccion('equipo_detalle');

        echo json_encode(['data' => $data]);
    } catch (Throwable $e) {
        echo json_encode(['data' => [], 'error' => $e->getMessage()]);
    }
}

function equipo_detalle_editar()
{
    $modelo = new InventarioMobModel();
    header('Content-Type: application/json');

    try {
        $id_equipo = $_GET['id_equipo'] ?? null;
        if (!$id_equipo) {
            throw new Exception('ID de equipo no proporcionado');
        }

        $modelo->__set('id_equipo', $id_equipo);
        $data = $modelo->manejarAccion('equipo_detalle_editar');

        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode(['equipo' => null, 'error' => $e->getMessage()]);
    }
}

function equipo_actualizar()
{
    $modelo = new InventarioMobModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $modulo = 'Mobiliario';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_equipo = filter_input(INPUT_POST, 'id_equipo', FILTER_SANITIZE_NUMBER_INT);
        $id_tipo_equipo = filter_input(INPUT_POST, 'id_tipo_equipo', FILTER_SANITIZE_NUMBER_INT);
        $id_servicios = filter_input(INPUT_POST, 'id_servicios', FILTER_SANITIZE_NUMBER_INT);
        $marca = filter_input(INPUT_POST, 'marca', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $modelo_val = filter_input(INPUT_POST, 'modelo', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $serial = filter_input(INPUT_POST, 'serial', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $color = filter_input(INPUT_POST, 'color', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estado = filter_input(INPUT_POST, 'estado', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fecha_adquisicion = filter_input(INPUT_POST, 'fecha_adquisicion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (!$id_equipo || !$id_tipo_equipo || !$id_servicios || !$marca || !$modelo_val || !$serial || !$estado || !$fecha_adquisicion) {
            throw new Exception('Todos los campos obligatorios deben ser completados');
        }

        $datos = [
            'id_equipo' => $id_equipo,
            'id_tipo_equipo' => $id_tipo_equipo,
            'id_servicios' => $id_servicios,
            'marca' => $marca,
            'modelo' => $modelo_val,
            'serial' => $serial,
            'color' => $color,
            'estado' => $estado,
            'fecha_adquisicion' => $fecha_adquisicion,
            'descripcion' => $descripcion,
            'observaciones' => $observaciones
        ];

        foreach ($datos as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('equipo_actualizar');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El empleado {$_SESSION['nombre']} actualizó el equipo #$id_equipo"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
        }

        echo json_encode($resultado);
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function equipo_eliminar()
{
    $modelo = new InventarioMobModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $modulo = 'Mobiliario';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_equipo = filter_input(INPUT_POST, 'id_equipo', FILTER_SANITIZE_NUMBER_INT);

        if (!$id_equipo) {
            throw new Exception('ID de equipo no válido');
        }

        $modelo->__set('id_equipo', $id_equipo);
        $resultado = $modelo->manejarAccion('equipo_eliminar');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El empleado {$_SESSION['nombre']} eliminó el equipo #$id_equipo"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
        }

        echo json_encode($resultado);
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}
