<?php

use App\Models\MedicinaModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;
use App\Models\PermisosModel;
use App\Models\InvMedicinaModel;

function diagnostico_medicina()
{
    $modelo = new MedicinaModel();
    $patologias = $modelo->manejarAccion('obtener_patologias');

    $invModelo = new InvMedicinaModel();
    $insumos = $invModelo->manejarAccion('obtenerInsumosParaSalidaDiagnosticos');

    $permisos = new PermisosModel();
    $modulo = 'Medicina';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/diagnosticos/medicina/diagnostico_medicina.php';
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

function registrar_diagnostico_medicina()
{
    $modelo = new MedicinaModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $permisos = new PermisosModel();
    $modulo = "Medicina";

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Metodo no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_SANITIZE_NUMBER_INT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $id_patologia = filter_input(INPUT_POST, 'id_patologia', FILTER_DEFAULT);
        $estatura = filter_input(INPUT_POST, 'estatura', FILTER_DEFAULT);
        $peso = filter_input(INPUT_POST, 'peso', FILTER_DEFAULT);
        $tipo_sangre = filter_input(INPUT_POST, 'tipo_sangre', FILTER_DEFAULT);
        $motivo_visita = filter_input(INPUT_POST, 'motivo_visita', FILTER_DEFAULT);
        $diagnostico = filter_input(INPUT_POST, 'diagnostico', FILTER_DEFAULT);
        $tratamiento = filter_input(INPUT_POST, 'tratamiento', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT);

        // Agrupar todos los valores en un array
        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_empleado'     => $id_empleado,
            'id_patologia'    => $id_patologia,
            'estatura'        => $estatura,
            'peso'            => $peso,
            'tipo_sangre'     => $tipo_sangre,
            'motivo_visita'   => $motivo_visita,
            'diagnostico'     => $diagnostico,
            'tratamiento'     => $tratamiento,
            'observaciones'   => $observaciones,
            'id_servicios'    => 2, // ID para el servicio de Medicina
            'insumos'         => [] // Array vacío para insumos si no se envían
        ];

        // Validar dinámicamente (excepto observaciones e insumos)
        $campos_obligatorios = [
            'id_beneficiario',
            'id_empleado',
            'id_patologia',
            'estatura',
            'peso',
            'tipo_sangre',
            'motivo_visita',
            'diagnostico',
            'tratamiento'
        ];

        foreach ($campos_obligatorios as $campo) {
            if (empty($datos[$campo])) {
                throw new Exception("El campo '{$campo}' es obligatorio");
            }
        }

        // Procesar insumos
        $insumos_procesados = [];
        if (isset($_POST['insumos']) && isset($_POST['insumos']['id']) && isset($_POST['insumos']['cantidad'])) {
            $ids = $_POST['insumos']['id'];
            $cantidades = $_POST['insumos']['cantidad'];

            for ($i = 0; $i < count($ids); $i++) {
                if (!empty($ids[$i]) && !empty($cantidades[$i])) {
                    $insumos_procesados[] = [
                        'id_insumo' => $ids[$i],
                        'cantidad' => $cantidades[$i]
                    ];
                }
            }
        }

        $modelo->__set('insumos', $insumos_procesados);

        foreach ($datos as $atributo => $valor) {
            if ($atributo !== 'insumos') { // Ya lo seteamos procesado
                $modelo->__set($atributo, $valor);
            }
        }

        $resultado = $modelo->manejarAccion('registrar_diagnostico');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if ($resultado['exito']) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un diagnóstico médico con el beneficiario $beneficiario"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Diagnóstico',
                'url' => 'consultar_medicina',
                'tipo' => 'diagnostico',
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
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            throw new Exception($resultado['mensaje'] ?? 'Error al registrar el diagnóstico');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function diagnostico_medicina_consultar()
{
    $permisos = new PermisosModel();
    $modulo = 'Medicina';
    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/diagnosticos/medicina/consultar_diagnostico.php';
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

function diagnostico_medicina_data_json()
{
    $modelo = new MedicinaModel();
    header('Content-Type: application/json');

    $es_admin = $_SESSION['tipo_empleado'] == 'Administrador';
    if (!$es_admin) {
        $modelo->__set('id_empleado', $_SESSION['id_empleado']);
    } else {
        $modelo->__set('es_admin', true);
    }

    try {
        $data = $modelo->manejarAccion('obtener_diagnostico_medicina');
        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function diagnostico_medicina_detalle()
{
    $modelo = new MedicinaModel();
    header('Content-Type: application/json');
    $id_consulta_med = $_GET['id_consulta_med'];
    $modelo->__set('id_consulta_med', $id_consulta_med);

    try {
        $data = $modelo->manejarAccion('medicina_detalle');
        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function stats_medicina_admin()
{
    $modelo = new MedicinaModel();
    header('Content-Type: application/json');

    try {
        $total = $modelo->manejarAccion('stats_admin');
        echo json_encode([
            'exito' => true,
            'total' => $total
        ]);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function obtener_patologias_medicina_json()
{
    $modelo = new MedicinaModel();
    header('Content-Type: application/json');

    try {
        // Reutilizamos la acción 'obtener_patologias' que ya existe en el modelo
        $data = $modelo->manejarAccion('obtener_patologias');
        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function actualizar_diagnostico_medicina()
{
    $modelo = new MedicinaModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Medicina';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Metodo no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_consulta_med = $_POST['id_consulta_med'];
        $id_detalle_patologia = $_POST['id_detalle_patologia'];
        $peso = $_POST['peso'];
        $estatura = $_POST['estatura'];
        $tipo_sangre = $_POST['tipo_sangre'];
        $id_patologia = $_POST['id_patologia'];
        $motivo_visita = $_POST['motivo_visita'];
        $diagnostico = $_POST['diagnostico'];
        $tratamiento = $_POST['tratamiento'];
        $observaciones = $_POST['observaciones'];
        $id_beneficiario = $_POST['id_beneficiario'];

        if (empty($id_consulta_med) || empty($peso) || empty($estatura) || empty($tipo_sangre) || empty($id_patologia) || empty($motivo_visita) || empty($diagnostico) || empty($tratamiento) || empty($observaciones) || empty($id_detalle_patologia) || empty($id_beneficiario)) {
            throw new Exception('Todos los campos editables son obligatorios');
        }

        $datos = [
            'id_consulta_med' => $id_consulta_med,
            'peso' => $peso,
            'estatura' => $estatura,
            'tipo_sangre' => $tipo_sangre,
            'id_patologia' => $id_patologia,
            'motivo_visita' => $motivo_visita,
            'diagnostico' => $diagnostico,
            'tratamiento' => $tratamiento,
            'observaciones' => $observaciones,
            'id_detalle_patologia' => $id_detalle_patologia,
            'id_beneficiario' => $id_beneficiario
        ];

        foreach ($datos as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('actualizar_diagnostico');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if ($resultado['exito'] === true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizo el diagnóstico médico del beneficiario $beneficiario"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Diagnóstico',
                'url' => 'consultar_medicina',
                'tipo' => 'diagnostico',
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
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            throw new Exception($resultado['mensaje'] ?? 'Error al registrar el diagnóstico');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function eliminar_diagnostico_medicina()
{
    $modelo = new MedicinaModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Medicina';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Metodo no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_consulta_med = $_POST['id_consulta_med'];
        $id_solicitud_serv = $_POST['id_solicitud_serv'];
        $id_detalle_patologia = $_POST['id_detalle_patologia'];
        $id_beneficiario = $_POST['id_beneficiario'];

        if (empty($id_consulta_med) || empty($id_solicitud_serv) || empty($id_detalle_patologia)) {
            throw new Exception('Todos los campos son obligatorios');
        }

        $modelo->__set('id_consulta_med', $id_consulta_med);
        $modelo->__set('id_solicitud_serv', $id_solicitud_serv);
        $modelo->__set('id_detalle_patologia', $id_detalle_patologia);
        $modelo->__set('id_beneficiario', $id_beneficiario);

        $resultado = $modelo->manejarAccion('eliminar_diagnostico');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if ($resultado['exito'] === true) {
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El Empleado {$_SESSION['nombre']} eliminó un diagnóstico médico del beneficiario $beneficiario"
            ];
            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Eliminación de Diagnóstico',
                'url' => 'consultar_medicina',
                'tipo' => 'diagnostico',
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
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            throw new Exception($resultado['mensaje'] ?? 'Error al eliminar el diagnostico');
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function medicina_stats_json()
{
    $modelo = new MedicinaModel();
    $modelo->__set('id_empleado', $_SESSION['id_empleado']);

    try {
        $resultado = $modelo->manejarAccion('stats_empleado');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}
