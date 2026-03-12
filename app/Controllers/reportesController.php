<?php

use App\Models\ReportesModel;
use App\Models\PermisosModel;

function reportes_general()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/general.php';
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

function reportes_general_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteGeneral');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function reportes_psicologia()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/psicologia.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_psicologia_morbilidad_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('morbilidad');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_psicologia_citas_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('citas');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_medicina()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/medicina.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_medicina_morbilidad_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteMed');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_medicina_inventario_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteInvMed');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_orientacion()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/orientacion.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_orientacion_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteOrientacion');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_trabajo_social()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/trabajo_social.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_becas_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteBecas');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_exoneracion_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteEx');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_fames_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteFames');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_embarazo_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteEmb');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_discapacidad()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/discapacidad.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_discapacidad_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteDiscapacidad');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_referencias()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/referencias.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_referencias_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('reporteReferencia');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_jornadas()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/jornadas.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_jornadas_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $resultado = $modelo->manejarAccion('dataJornada');

        header('Content-Type: application/json');
        echo json_encode($resultado);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_mobiliario()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/mobiliario.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_mobiliario_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $res = [
            'mobiliario' => $modelo->manejarAccion('reporteMob'),
            'equipos' => $modelo->manejarAccion('reporteEq'),
            'filtrosMob' => $modelo->manejarAccion('dataMob'),
            'filtrosEq' => $modelo->manejarAccion('dataEq')
        ];

        header('Content-Type: application/json');
        echo json_encode($res);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}

function reportes_transporte()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/reportes/transporte.php';
    } catch (Throwable $e) {
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        } else {
            echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        }
    }
}

function reportes_transporte_data()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

    try {
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $res = $modelo->manejarAccion('dataTrans');

        header('Content-Type: application/json');
        echo json_encode($res);
    } catch (Throwable $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit();
    }
}
