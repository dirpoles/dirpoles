<?php

use App\Models\JornadasModel;
use App\Models\NotificacionesModel;
use App\Models\PermisosModel;
use App\Models\BitacoraModel;

function crear_jornada()
{
    $modelo = new JornadasModel();
    $permisos = new PermisosModel;
    $modulo = 'Jornadas';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $stats = $modelo->manejarAccion('obtener_estadisticas');
        $jornadas_totales = $stats['totales'] ?? 0;
        $jornadas_activas = $stats['activas'] ?? 0;
        $jornadas_finalizadas = $stats['finalizadas'] ?? 0;
        $jornadas_mes = $stats['mes'] ?? 0;

        require_once BASE_PATH . '/app/Views/jornadas/crear_jornada.php';
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

function registrar_jornada()
{
    $modelo = new JornadasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Jornadas';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $nombre_jornada = filter_input(INPUT_POST, 'nombre_jornada', FILTER_DEFAULT);
        $tipo_jornada = filter_input(INPUT_POST, 'tipo_jornada', FILTER_DEFAULT);
        $ubicacion = filter_input(INPUT_POST, 'ubicacion', FILTER_DEFAULT);
        $aforo_maximo = filter_input(INPUT_POST, 'aforo_maximo', FILTER_DEFAULT);
        $fecha_inicio = filter_input(INPUT_POST, 'fecha_inicio', FILTER_DEFAULT);
        $fecha_fin = filter_input(INPUT_POST, 'fecha_fin', FILTER_DEFAULT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT);

        $datos = [
            'nombre_jornada' => $nombre_jornada,
            'tipo_jornada' => $tipo_jornada,
            'ubicacion' => $ubicacion,
            'aforo_maximo' => $aforo_maximo,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin,
            'descripcion' => $descripcion
        ];

        foreach ($datos as $atributo => $valor) {
            if (empty($valor)) {
                throw new Exception("El valor del campo {$atributo} no es valido");
            }
            $modelo->__set($atributo, $valor);
        }

        $registro = $modelo->manejarAccion('registrar_jornada');
        if ($registro['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro una jornada médica con el nombre {$nombre_jornada}"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Jornada',
                'url' => 'consultar_jornadas',
                'tipo' => 'jornada',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, //Administrador
                'leido' => 0
            ];
            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar la jornada');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function consultar_jornadas()
{
    $modelo = new JornadasModel();
    $permisos = new PermisosModel();
    $modulo = 'Jornadas';
    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/jornadas/consultar_jornadas.php';
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

function consultar_jornadas_json()
{
    $modelo = new JornadasModel();
    header('Content-Type: application/json');

    try {
        $data = $modelo->manejarAccion('consultar_jornadas');
        // DataTables espera un objeto con la propiedad "data"
        echo json_encode(['data' => $data]);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function jornada_detalle()
{
    $modelo = new JornadasModel();
    try {
        $id_jornada = filter_input(INPUT_GET, 'id_jornada', FILTER_SANITIZE_NUMBER_INT);
        $modelo->__set('id_jornada', $id_jornada);
        $data = $modelo->manejarAccion('jornada_detalle');
        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function actualizar_jornada()
{
    $modelo = new JornadasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Jornadas';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_jornada = filter_input(INPUT_POST, 'id_jornada', FILTER_SANITIZE_NUMBER_INT);
        $nombre_jornada = filter_input(INPUT_POST, 'nombre_jornada', FILTER_DEFAULT);
        $tipo_jornada = filter_input(INPUT_POST, 'tipo_jornada', FILTER_DEFAULT);
        $ubicacion = filter_input(INPUT_POST, 'ubicacion', FILTER_DEFAULT);
        $aforo_maximo = filter_input(INPUT_POST, 'aforo_maximo', FILTER_DEFAULT);
        $fecha_inicio = filter_input(INPUT_POST, 'fecha_inicio', FILTER_DEFAULT);
        $fecha_fin = filter_input(INPUT_POST, 'fecha_fin', FILTER_DEFAULT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_DEFAULT);


        $datos = [
            'id_jornada' => $id_jornada,
            'nombre_jornada' => $nombre_jornada,
            'tipo_jornada' => $tipo_jornada,
            'ubicacion' => $ubicacion,
            'aforo_maximo' => $aforo_maximo,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin,
            'descripcion' => $descripcion,
            'estatus' => $estatus
        ];

        foreach ($datos as $atributo => $valor) {
            if (empty($valor)) {
                throw new Exception("El valor del campo {$atributo} no es valido");
            }
            $modelo->__set($atributo, $valor);
        }

        // Validar que el nuevo aforo no sea menor a los beneficiarios ya registrados
        $modelo->__set('id_jornada', $id_jornada);
        $beneficiarios = $modelo->manejarAccion('consultar_beneficiarios_jornada');
        $total_beneficiarios = is_array($beneficiarios) ? count($beneficiarios) : 0;

        if ($aforo_maximo < $total_beneficiarios) {
            throw new Exception("No se puede reducir el aforo a {$aforo_maximo} porque ya hay {$total_beneficiarios} beneficiarios registrados en esta jornada");
        }

        $editar = $modelo->manejarAccion('actualizar_jornada');
        if ($editar['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó una jornada médica con el nombre {$nombre_jornada}"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Jornada',
                'url' => 'consultar_jornadas',
                'tipo' => 'jornada',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, //Administrador
                'leido' => 0
            ];
            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $editar['mensaje']
            ]);
        } else {
            throw new Exception($editar['mensaje'] ?? 'Error al editar la jornada');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function detallar_jornada()
{
    $modelo = new JornadasModel();
    $permisos = new PermisosModel;
    $modulo = 'Jornadas';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/jornadas/detallar_jornada.php';
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

function beneficiarios_jornada_json()
{
    $modelo = new JornadasModel();
    header('Content-Type: application/json');

    try {
        $id_jornada = filter_input(INPUT_GET, 'id_jornada', FILTER_SANITIZE_NUMBER_INT);

        if (empty($id_jornada)) {
            throw new Exception('ID de jornada no especificado');
        }

        $modelo->__set('id_jornada', $id_jornada);
        $data = $modelo->manejarAccion('consultar_beneficiarios_jornada');

        // DataTables espera un objeto con la propiedad "data"
        echo json_encode(['data' => $data ?? []]);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage(),
            'data' => []
        ]);
    }
}

function agregar_beneficiario_jornada()
{
    $modelo = new JornadasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Jornadas';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        // Capturar datos del formulario
        $id_jornada = filter_input(INPUT_POST, 'id_jornada', FILTER_SANITIZE_NUMBER_INT);
        $tipo_cedula = filter_input(INPUT_POST, 'tipo_cedula', FILTER_DEFAULT);
        $cedula = filter_input(INPUT_POST, 'cedula', FILTER_DEFAULT);
        $nombres = filter_input(INPUT_POST, 'nombres', FILTER_DEFAULT);
        $apellidos = filter_input(INPUT_POST, 'apellidos', FILTER_DEFAULT);
        $fecha_nacimiento = filter_input(INPUT_POST, 'fecha_nacimiento', FILTER_DEFAULT);
        $genero = filter_input(INPUT_POST, 'genero', FILTER_DEFAULT);
        $tipo_paciente = filter_input(INPUT_POST, 'tipo_paciente', FILTER_DEFAULT);
        $telefono = filter_input(INPUT_POST, 'telefono', FILTER_DEFAULT);
        $correo = filter_input(INPUT_POST, 'correo', FILTER_DEFAULT);
        $direccion = filter_input(INPUT_POST, 'direccion', FILTER_DEFAULT);

        $datos = [
            'id_jornada' => $id_jornada,
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'fecha_nacimiento' => $fecha_nacimiento,
            'genero' => $genero,
            'tipo_paciente' => $tipo_paciente,
            'telefono' => $telefono,
            'correo' => $correo,
            'direccion' => $direccion
        ];

        foreach ($datos as $atributo => $valor) {
            if (empty($valor) && $atributo !== 'correo' && $atributo !== 'direccion') {
                throw new Exception("El campo {$atributo} es obligatorio");
            }
            $modelo->__set($atributo, $valor);
        }

        // Validar que no se exceda el aforo máximo
        $modelo->__set('id_jornada', $id_jornada);
        $jornada_detalle = $modelo->manejarAccion('jornada_detalle');

        if ($jornada_detalle && !isset($jornada_detalle['exito'])) {
            $aforo_maximo = (int)$jornada_detalle['aforo_maximo'];

            // Contar beneficiarios actuales
            $beneficiarios_actuales = $modelo->manejarAccion('consultar_beneficiarios_jornada');
            $total_beneficiarios = is_array($beneficiarios_actuales) ? count($beneficiarios_actuales) : 0;

            if ($total_beneficiarios >= $aforo_maximo) {
                throw new Exception("No se puede agregar el beneficiario. La jornada ha alcanzado su aforo máximo de {$aforo_maximo} beneficiarios.");
            }
        }

        $registro = $modelo->manejarAccion('agregar_beneficiario_jornada');

        if ($registro['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} agregó a {$nombres} {$apellidos} (CI: {$tipo_cedula}-{$cedula}) a la jornada"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje'] ?? 'Beneficiario agregado exitosamente a la jornada'
            ]);
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al agregar el beneficiario a la jornada');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function agregar_diagnostico_jornada()
{
    $modelo = new JornadasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Jornadas';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_jornada_beneficiario = filter_input(INPUT_POST, 'id_jornada_beneficiario', FILTER_SANITIZE_NUMBER_INT);
        $diagnostico = filter_input(INPUT_POST, 'diagnostico', FILTER_DEFAULT);
        $tratamiento = filter_input(INPUT_POST, 'tratamiento', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT);

        // Procesar insumos (pueden venir como JSON string o array)
        $insumos_raw = $_POST['insumos'] ?? [];
        $insumos = is_string($insumos_raw) ? json_decode($insumos_raw, true) : $insumos_raw;

        if (!is_array($insumos)) {
            $insumos = [];
        }

        $id_empleado_medico = $_SESSION['id_empleado'];

        $datos = [
            'id_jornada_beneficiario' => $id_jornada_beneficiario,
            'id_empleado_medico' => $id_empleado_medico,
            'diagnostico' => $diagnostico,
            'tratamiento' => $tratamiento,
            'observaciones' => $observaciones,
            'insumos' => $insumos
        ];

        foreach ($datos as $atributo => $valor) {
            if ($atributo !== 'insumos' && $atributo !== 'observaciones' && empty($valor)) {
                // Observaciones e insumos pueden estar vacíos/opcionales
                // Pero insumos son validados luego
                if ($atributo !== 'insumos' && $atributo !== 'observaciones') {
                    throw new Exception("El campo {$atributo} es obligatorio");
                }
            }
            $modelo->__set($atributo, $valor);
        }

        $registro = $modelo->manejarAccion('agregar_diagnostico_jornada');

        if ($registro['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} agregó un diagnostico a una jornada médica"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje'] ?? 'Diagnostico agregado exitosamente a la jornada'
            ]);
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al agregar el diagnostico a la jornada');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function detalle_diagnosticosJornada()
{
    $modelo = new JornadasModel();
    try {
        $id_jornada_beneficiario = filter_input(INPUT_GET, 'id_jornada_beneficiario', FILTER_SANITIZE_NUMBER_INT);
        $modelo->__set('id_jornada_beneficiario', $id_jornada_beneficiario);
        $data = $modelo->manejarAccion('detalle_diagnosticosJornada');

        echo json_encode($data);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function actualizar_diagnostico_jornada()
{
    $modelo = new JornadasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Jornadas';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_jornada_diagnostico = filter_input(INPUT_POST, 'id_jornada_diagnostico', FILTER_SANITIZE_NUMBER_INT);
        $diagnostico = filter_input(INPUT_POST, 'diagnostico', FILTER_DEFAULT);
        $tratamiento = filter_input(INPUT_POST, 'tratamiento', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT);

        if (empty($id_jornada_diagnostico) || empty($diagnostico) || empty($tratamiento) || empty($observaciones)) {
            throw new Exception("Todos los campos son obligatorios");
        }

        $modelo->__set('id_jornada_diagnostico', $id_jornada_diagnostico);
        $modelo->__set('diagnostico', $diagnostico);
        $modelo->__set('tratamiento', $tratamiento);
        $modelo->__set('observaciones', $observaciones);

        $resultado = $modelo->manejarAccion('actualizar_diagnostico_jornada');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó un diagnóstico de jornada"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            throw new Exception($resultado['mensaje'] ?? 'Error al actualizar el diagnóstico');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}
