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
