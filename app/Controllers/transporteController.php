<?php

use App\Models\TransporteModel;
use App\Models\BitacoraModel;
use App\Models\PermisosModel;
use App\Models\NotificacionesModel;

function transporte_consulta()
{
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $modulo = 'Transporte';
    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Leer',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }


        require_once BASE_PATH . '/app/Views/transporte/transporte_consulta.php';
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

function vehiculos_registrar()
{
    header('Content-Type: application/json');
    $modeloT = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Crear',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            echo json_encode([
                "status" => "error",
                "message" => "No tienes permiso para realizar esta acción"
            ]);
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                "status" => "error",
                "message" => "Los valores no han sido enviados correctamente"
            ]);
        }

        $placa = filter_input(INPUT_POST, 'placa', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $modelo = filter_input(INPUT_POST, 'modelo', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo = filter_input(INPUT_POST, 'tipo', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fecha_adquisicion = filter_input(INPUT_POST, 'fecha_adquisicion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estado = filter_input(INPUT_POST, 'estado', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        // Validación adicional si es necesaria
        if (empty($placa)) {
            throw new Exception("La placa es requerida");
        }

        $transporte = [
            'placa' => $placa,
            'modelo' => $modelo,
            'tipo' => $tipo,
            'fecha_adquisicion' => $fecha_adquisicion,
            'estado' => $estado
        ];

        foreach ($transporte as $atributo => $valor) {
            $modeloT->__set($atributo, $valor);
        }

        // Insertar en la base de datos
        $resultado = $modeloT->manejarAccion('Registrar_vehiculo');

        if (isset($resultado['status']) && $resultado['status'] === true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Registro',
                'descripcion' => "Vehiculo registrado exitosamente, con la placa: " . $placa,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            $notificacion_data = [
                'titulo' => 'Registro de Vehiculo',
                'url' => '#',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1,
                'leido' => 0
            ];

            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if (!$noti_resultado['status']) {
                error_log("Error al registrar la notificación: " . $noti_resultado['mensaje']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Vehículo."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function vehiculos_validar_placa()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $placa = filter_input(INPUT_POST, 'placa', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $id_vehiculo = filter_input(INPUT_POST, 'id_vehiculo', FILTER_VALIDATE_INT);

    if ($id_vehiculo) {
        $modelo->__set('id_vehiculo', $id_vehiculo);
    }

    if ($placa !== null) {
        $modelo->__set('placa', $placa);
        $existe = $modelo->manejarAccion('Validar_placa');
        echo json_encode(['existe' => $existe]);
    } else {
        // Devuelve siempre un JSON válido
        echo json_encode(['existe' => false]);
    }
    exit;
}

function proveedor_registrar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Crear',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no se han enviado correctamente');
        }

        $tipo_documento = filter_input(INPUT_POST, 'tipo_documento', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $num_documento = filter_input(INPUT_POST, 'num_documento', FILTER_SANITIZE_NUMBER_INT);
        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_NUMBER_INT);
        $correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL);
        $direccion = filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (empty($tipo_documento) || empty($num_documento)) {
            throw new Exception("Los documentos son requeridos");
        }

        $proveedor = [
            'tipo_documento' => $tipo_documento,
            'num_documento' => $num_documento,
            'nombre' => $nombre,
            'telefono' => $telefono,
            'correo' => $correo,
            'direccion' => $direccion
        ];

        foreach ($proveedor as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('Registrar_proveedor');

        if (isset($resultado['status']) && $resultado['status'] === true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Registro',
                'descripcion' => "Proveedor registrado exitosamente, con el Documento: " . $num_documento,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            $notificacion_data = [
                'titulo' => 'Registro de Proveedor',
                'url' => '#',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1,
                'leido' => 0
            ];

            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if (!$noti_resultado['status']) {
                error_log("Error al registrar la notificación: " . $noti_resultado['mensaje']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Proveedor."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function ruta_registrar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Crear',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $nombre_ruta = filter_input(INPUT_POST, 'nombre_ruta', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo_ruta = filter_input(INPUT_POST, 'tipo_ruta', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $horario_salida = filter_input(INPUT_POST, 'horario_salida', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $horario_llegada = filter_input(INPUT_POST, 'horario_llegada', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $punto_partida = filter_input(INPUT_POST, 'punto_partida', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $punto_destino = filter_input(INPUT_POST, 'punto_destino', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $trayectoria = filter_input(INPUT_POST, 'trayectoria', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $ruta = [
            'nombre_ruta' => $nombre_ruta,
            'tipo_ruta' => $tipo_ruta,
            'horario_salida' => $horario_salida,
            'horario_llegada' => $horario_llegada,
            'estatus' => $estatus,
            'punto_partida' => $punto_partida,
            'punto_destino' => $punto_destino,
            'trayectoria' => $trayectoria
        ];

        foreach ($ruta as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('Registrar_ruta');

        if (isset($resultado['status']) && $resultado['status'] === true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Registro',
                'descripcion' => "Ruta registrada exitosamente, con el nombre: " . $nombre_ruta,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            $notificacion_data = [
                'titulo' => 'Registro de Ruta',
                'url' => '#',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1,
                'leido' => 0
            ];

            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if (!$noti_resultado['status']) {
                error_log("Error al registrar la notificación: " . $noti_resultado['mensaje']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Proveedor."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function asignar_recursos()
{
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Crear',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $id_ruta = filter_input(INPUT_POST, 'id_ruta', FILTER_SANITIZE_NUMBER_INT);
        $fecha_asignacion = filter_input(INPUT_POST, 'fecha_asignacion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_vehiculo = filter_input(INPUT_POST, 'id_vehiculo', FILTER_SANITIZE_NUMBER_INT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $asignacion_ruta = [
            'id_ruta' => $id_ruta,
            'fecha_asignacion' => $fecha_asignacion,
            'id_vehiculo' => $id_vehiculo,
            'id_empleado' => $id_empleado,
            'estatus' => $estatus
        ];

        foreach ($asignacion_ruta as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('Registrar_asignacion');

        if (isset($resultado['status']) && $resultado['status'] === true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Registro',
                'descripcion' => "Asignacion registrada exitosamente, con el ID de la ruta: " . $id_ruta,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            $notificacion_data = [
                'titulo' => 'Asignación de recursos a ruta',
                'url' => '#',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1,
                'leido' => 0
            ];

            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if (!$noti_resultado['status']) {
                error_log("Error al registrar la notificación: " . $noti_resultado['mensaje']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Proveedor."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function cargar_asignaciones()
{
    $modelo = new TransporteModel();
    $asignaciones = $modelo->manejarAccion('Asignaciones_calendario');

    $eventos = [];
    foreach ($asignaciones as $row) {
        $eventos[] = [
            'id' => $row['id_asignacion'],
            'title' => $row['nombre_ruta'],
            'start' => $row['fecha_asignacion'],
            'color' => '#0049ff',
            'tipo_ruta' => $row['tipo_ruta'],
            'extendedProps' => [
                'vehiculo' => $row['vehiculo'],
                'chofer' => $row['nombre_chofer'] . ' ' . $row['apellido_chofer'],
                'estatus' => $row['estatus']
            ]
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($eventos);
    exit;
}

function obtener_detalles_ruta()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();

    try {
        if (!isset($_POST['id_ruta'])) {
            throw new Exception("ID de ruta no proporcionado");
        }

        $id_ruta = filter_input(INPUT_POST, 'id_ruta', FILTER_SANITIZE_NUMBER_INT);

        if (!$id_ruta) {
            throw new Exception("ID de ruta inválido");
        }

        $modelo->__set('id_ruta', $id_ruta);
        $detalles = $modelo->manejarAccion('Detalles_ruta');
        // Depuración: ver los datos que se están enviando
        error_log("Detalles de la ruta: " . print_r($detalles, true));

        if (!$detalles) {
            throw new Exception("Ruta no encontrada");
        }

        echo json_encode([
            'success' => true,
            'data' => $detalles
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function repuestos_registrar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Crear',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $nombre_repuesto = filter_input(INPUT_POST, 'nombre_repuesto', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_proveedor = filter_input(INPUT_POST, 'id_proveedor', FILTER_SANITIZE_NUMBER_INT);
        $fecha_creacion = filter_input(INPUT_POST, 'fecha_creacion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estatus_repuesto = filter_input(INPUT_POST, 'estatus_repuesto', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $repuesto = [
            'nombre_repuesto' => $nombre_repuesto,
            'descripcion' => $descripcion,
            'id_proveedor' => $id_proveedor,
            'fecha_creacion' => $fecha_creacion,
            'estatus_repuesto' => $estatus_repuesto
        ];

        foreach ($repuesto as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('Registrar_repuesto');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Registro',
                'descripcion' => "Repuesto registrado exitosamente, con el nombre: " . $nombre_repuesto,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            $notificacion_data = [
                'titulo' => 'Registro de Repuesto',
                'url' => '#',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1,
                'leido' => 0
            ];

            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if (!$noti_resultado['status']) {
                error_log("Error al registrar la notificación: " . $noti_resultado['mensaje']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Repuesto."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function repuestos_entrada()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Crear',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        // Validar campos requeridos
        $required = ['id_repuesto', 'cantidad', 'razon_movimiento'];
        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                throw new Exception("El campo $field es requerido");
            }
        }

        $id_repuesto = filter_input(INPUT_POST, 'id_repuesto', FILTER_SANITIZE_NUMBER_INT);
        $cantidad = filter_input(INPUT_POST, 'cantidad', FILTER_SANITIZE_NUMBER_INT);
        $razon_movimiento = filter_input(INPUT_POST, 'razon_movimiento', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo_movimiento = filter_input(INPUT_POST, 'tipo_movimiento', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $movimiento_repuesto = [
            'id_repuesto' => $id_repuesto,
            'cantidad' => $cantidad,
            'razon_movimiento' => $razon_movimiento,
            'tipo_movimiento' => $tipo_movimiento,
            'id_empleado' => $_SESSION['id_empleado']
        ];

        foreach ($movimiento_repuesto as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('Registrar_entrada_repuesto');

        if (isset($resultado['status']) && $resultado['status'] === true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Registro',
                'descripcion' => "Entrada del repuesto registrada exitosamente, con la cantidad: " . $cantidad,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            $notificacion_data = [
                'titulo' => 'Entrada de repuesto',
                'url' => '#',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1,
                'leido' => 0
            ];

            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if (!$noti_resultado['status']) {
                error_log("Error al registrar la notificación: " . $noti_resultado['mensaje']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Repuesto."
            ]);
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function registrar_mantenimiento_vehiculo()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Crear',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $id_vehiculo = filter_input(INPUT_POST, 'id_vehiculo_mantenimiento', FILTER_SANITIZE_NUMBER_INT);
        $fecha = filter_input(INPUT_POST, 'fecha_mantenimiento', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo_mantenimiento = filter_input(INPUT_POST, 'tipo_mantenimiento', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $descripcion = filter_input(INPUT_POST, 'descripcion_mant', FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? '';
        $repuestos = [];
        if (isset($_POST['repuestos_data']) && !empty($_POST['repuestos_data'])) {
            $repuestosData = json_decode($_POST['repuestos_data'], true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Formato inválido para los datos de repuestos');
            }

            foreach ($repuestosData as $item) {
                if (!empty($item['id_repuesto']) && !empty($item['cantidad'])) {
                    $repuestos[] = [
                        'id_repuesto' => filter_var($item['id_repuesto'], FILTER_SANITIZE_NUMBER_INT),
                        'cantidad' => filter_var($item['cantidad'], FILTER_SANITIZE_NUMBER_INT)
                    ];
                }
            }
        }

        $required = ['id_vehiculo_mantenimiento', 'fecha_mantenimiento', 'tipo_mantenimiento'];
        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                throw new Exception("El campo " . str_replace('_', ' ', $field) . " es requerido");
            }
        }

        $mantenimiento = [
            'id_vehiculo_mantenimiento' => $id_vehiculo,
            'fecha_mantenimiento' => $fecha,
            'tipo_mantenimiento' => $tipo_mantenimiento,
            'descripcion_mant' => $descripcion,
            'repuestos' => $repuestos,
            'id_empleado' => $_SESSION['id_empleado'],
            'tipo_movimiento' => 'Salida',
            'razon_movimiento' => 'Repuesto utilizado en mantenimiento'
        ];

        foreach ($mantenimiento as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        // Registrar en base de datos
        $resultado = $modelo->manejarAccion('Registrar_mantenimiento');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Registro',
                'descripcion' => "Mantenimiento registrado exitosamente, al vehiculo: " . $id_vehiculo,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Repuesto."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function editar_vehiculo()
{
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Leer',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        $modelo->__set('id_vehiculo', $_GET['id_vehiculo']);
        $vehiculo = $modelo->manejarAccion('Editar_vehiculo');
        require_once "app/views/transporte_editar_vehiculo.php";
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function vehiculo_actualizar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Editar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $id_vehiculo = filter_input(INPUT_POST, 'id_vehiculo', FILTER_SANITIZE_NUMBER_INT);
        $placa = filter_input(INPUT_POST, 'placa', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $modelo_vehiculo = filter_input(INPUT_POST, 'modelo', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo = filter_input(INPUT_POST, 'tipo', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fecha_adquisicion = filter_input(INPUT_POST, 'fecha_adquisicion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estado = filter_input(INPUT_POST, 'estado', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $vehiculo = [
            'id_vehiculo' => $id_vehiculo,
            'placa' => $placa,
            'modelo_vehiculo' => $modelo_vehiculo,
            'tipo' => $tipo,
            'fecha_adquisicion' => $fecha_adquisicion,
            'estado' => $estado
        ];

        foreach ($vehiculo as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        // Validar campos requeridos
        if (empty($placa) || empty($modelo_vehiculo) || empty($tipo) || empty($fecha_adquisicion) || empty($estado)) {
            throw new Exception("Todos los campos son requeridos");
        }

        // Actualizar en base de datos
        $resultado = $modelo->manejarAccion('Actualizar_vehiculo');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Actualización',
                'descripcion' => "Vehiculo actualizado exitosamente, al vehiculo: " . $placa,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Repuesto."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function vehiculo_eliminar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Eliminar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $id_vehiculo = filter_input(INPUT_POST, 'id_vehiculo', FILTER_SANITIZE_NUMBER_INT);
        $modelo->__set('id_vehiculo', $id_vehiculo);

        // Eliminar en base de datos
        $resultado = $modelo->manejarAccion('Eliminar_vehiculo');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Eliminación',
                'descripcion' => "Vehiculo eliminado exitosamente, al vehiculo: " . $id_vehiculo,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Repuesto."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function editar_proveedor()
{
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Leer',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        $modelo->__set('id_proveedor', $_GET['id_proveedor']);
        $proveedor = $modelo->manejarAccion('Editar_proveedor');

        require_once "app/views/transporte_editar_proveedor.php";
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function proveedor_actualizar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Editar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $id_proveedor = filter_input(INPUT_POST, 'id_proveedor', FILTER_SANITIZE_NUMBER_INT);
        $tipo_documento = filter_input(INPUT_POST, 'tipo_documento', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $num_documento = filter_input(INPUT_POST, 'num_documento', FILTER_SANITIZE_NUMBER_INT);
        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_NUMBER_INT);
        $correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL);
        $direccion = filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        // Validar campos requeridos
        if (empty($tipo_documento) || empty($num_documento) || empty($nombre) || empty($telefono) || empty($correo) || empty($direccion)) {
            throw new Exception("Todos los campos son requeridos");
        }

        $proveedor = [
            'id_proveedor' => $id_proveedor,
            'tipo_documento' => $tipo_documento,
            'num_documento' => $num_documento,
            'nombre' => $nombre,
            'telefono' => $telefono,
            'correo' => $correo,
            'direccion' => $direccion
        ];

        foreach ($proveedor as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        // Actualizar en base de datos
        $resultado = $modelo->manejarAccion('Actualizar_proveedor');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Actualización',
                'descripcion' => "Proveedor actualizado exitosamente, al proveedor: " . $num_documento,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Repuesto."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function proveedor_eliminar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Eliminar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }
        $id_proveedor = filter_input(INPUT_POST, 'id_proveedor', FILTER_SANITIZE_NUMBER_INT);

        $modelo->__set('id_proveedor', $id_proveedor);

        // Eliminar en base de datos
        $resultado = $modelo->manejarAccion('Eliminar_proveedor');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Eliminación',
                'descripcion' => "Proveedor eliminado exitosamente, con el ID: " . $id_proveedor,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al eliminar el proveedor."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function ruta_editar()
{
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Leer',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $modelo->__set('id_ruta', $_GET['id_ruta']);
        $ruta = $modelo->manejarAccion('Editar_ruta');

        require_once 'app/views/transporte_editar_ruta.php';
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function ruta_actualizar()
{
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Editar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $nombre_ruta = filter_input(INPUT_POST, 'nombre_ruta', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo_ruta = filter_input(INPUT_POST, 'tipo_ruta', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $punto_partida = filter_input(INPUT_POST, 'punto_partida', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $punto_destino = filter_input(INPUT_POST, 'punto_destino', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $horario_salida = filter_input(INPUT_POST, 'horario_salida', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $horario_llegada = filter_input(INPUT_POST, 'horario_llegada', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $trayectoria = filter_input(INPUT_POST, 'trayectoria', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_ruta = filter_input(INPUT_POST, 'id_ruta', FILTER_SANITIZE_NUMBER_INT);

        $ruta = [
            'nombre_ruta' => $nombre_ruta,
            'tipo_ruta' => $tipo_ruta,
            'punto_partida' => $punto_partida,
            'punto_destino' => $punto_destino,
            'horario_salida' => $horario_salida,
            'horario_llegada' => $horario_llegada,
            'estatus' => $estatus,
            'trayectoria' => $trayectoria,
            'id_ruta' => $id_ruta
        ];

        foreach ($ruta as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        // Actualizar en base de datos
        $resultado = $modelo->manejarAccion('Actualizar_ruta');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Actualización',
                'descripcion' => "Ruta actualizada exitosamente, con el nombre: " . $nombre_ruta,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Repuesto."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function ruta_eliminar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Eliminar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }
        $id_ruta = filter_input(INPUT_POST, 'id_ruta', FILTER_SANITIZE_NUMBER_INT);

        $modelo->__set('id_ruta', $id_ruta);

        // Eliminar en base de datos
        $resultado = $modelo->manejarAccion('Eliminar_ruta');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Eliminación',
                'descripcion' => "Ruta eliminada exitosamente, con el ID: " . $id_ruta,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al eliminar la ruta."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function asignaciones_eliminar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Eliminar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }
        $id_asignacion = filter_input(INPUT_POST, 'id_asignacion', FILTER_SANITIZE_NUMBER_INT);

        $modelo->__set('id_asignacion', $id_asignacion);

        // Eliminar en base de datos
        $resultado = $modelo->manejarAccion('Eliminar_asignacion');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Eliminación',
                'descripcion' => "Asignacion de ruta eliminada exitosamente, con el ID: " . $id_asignacion,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al eliminar la ruta."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function repuesto_editar()
{
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Leer',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $modelo->__set('id_repuesto', $_GET['id_repuesto']);
        $repuesto = $modelo->manejarAccion('Editar_repuesto');

        $data = [
            'ID' => $repuesto['ID'],
            'Proveedores' => $repuesto['Proveedores']
        ];

        require_once 'app/views/transporte_editar_repuesto.php';
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function repuesto_actualizar()
{
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Editar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }

        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_proveedor = filter_input(INPUT_POST, 'id_proveedor', FILTER_SANITIZE_NUMBER_INT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_repuesto = filter_input(INPUT_POST, 'id_repuesto', FILTER_SANITIZE_NUMBER_INT);

        $repuesto = [
            'nombre' => $nombre,
            'estatus' => $estatus,
            'id_proveedor' => $id_proveedor,
            'descripcion' => $descripcion,
            'id_repuesto' => $id_repuesto
        ];

        foreach ($repuesto as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        // Actualizar en base de datos
        $resultado = $modelo->manejarAccion('Actualizar_repuesto');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Actualización',
                'descripcion' => "Repuesto actualizado exitosamente, con el nombre: " . $nombre,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al registrar el Repuesto."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

function repuesto_eliminar()
{
    header('Content-Type: application/json');
    $modelo = new TransporteModel();
    $permisos = new PermisosModel();
    $bitacoraModel = new BitacoraModel();
    $modulo = 'Transporte';

    $verificar = [
        'Modulo' => $modulo,
        'Permiso' => 'Eliminar',
        'Rol' => $_SESSION['id_tipo_empleado']
    ];

    foreach ($verificar as $atributo => $valor) {
        $permisos->__set($atributo, $valor);
    }

    try {
        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Los valores no han sido enviados correctamente');
        }
        $id_repuesto = filter_input(INPUT_POST, 'id_repuesto', FILTER_SANITIZE_NUMBER_INT);

        $modelo->__set('id_repuesto', $id_repuesto);

        // Eliminar en base de datos
        $resultado = $modelo->manejarAccion('Eliminar_repuesto');

        if (isset($resultado['status']) && $resultado['status'] == true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Transporte',
                'accion' => 'Eliminación',
                'descripcion' => "Repuesto eliminado exitosamente, con el ID: " . $id_repuesto,
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacoraModel->__set($atributo, $valor);
            }
            $resultado_bitacora = $bitacoraModel->manejarAccion('registrar_bitacora');
            if (!$resultado_bitacora['status']) {
                error_log("Error al registrar en al bitácora: " . $resultado_bitacora['msj']);
            }

            echo json_encode([
                'success' => true,
                'message' => $resultado['mensaje']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $resultado['mensaje'] ?? "Error al eliminar la ruta."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}
