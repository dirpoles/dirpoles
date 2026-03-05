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
/*
function reportesEmpleados()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $resultado = $modelo->manejarAccion('reporteEmpleados');

            echo json_encode($resultado);
        } else {
            if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                if (isset($_GET['data'])) {
                    $data = $modelo->manejarAccion('reporteEmpleados');

                    echo json_encode($data);
                    exit;
                } else {
                    require_once 'app/views/reportes_empleados.php';
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);
        } else {
            // Redirección para peticiones normales (no AJAX)
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reportesBeneficiarios()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $resultado = $modelo->manejarAccion('reporteBeneficiarios');

            echo json_encode($resultado);
        } else {
            if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                if (isset($_GET['data'])) {
                    $data = $modelo->manejarAccion('reporteBeneficiarios');

                    echo json_encode($data);
                    exit;
                } else {
                    require_once 'app/views/reportes_beneficiarios.php';
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);
        } else {
            // Redirección para peticiones normales (no AJAX)
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reportePsicologia()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $tipoReporte = $_POST['tipo_reporte'] ?? '';

            if ($tipoReporte === 'morbilidad') {
                $resultado = $modelo->manejarAccion('morbilidad');
            } else if ($tipoReporte === 'citas') {
                $resultado = $modelo->manejarAccion('citas');
            }

            echo json_encode($resultado);
        } else {
            $tipo_reporte = isset($_GET['data']) ? $_GET['data'] : null;

            if ($_SERVER['REQUEST_METHOD'] == 'GET') {

                if (!$tipo_reporte) {
                    require_once 'app/views/reportes_psicologia.php';
                } else {
                    if ($tipo_reporte === 'citas') {
                        $data = $modelo->manejarAccion('citas');
                    } elseif ($tipo_reporte === 'morbilidad') {
                        $data = $modelo->manejarAccion('morbilidad');
                    } else {
                        $data = [];
                    }

                    echo json_encode($data);
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);

            exit();
        } else {
            // Redirección para peticiones normales
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reporteMedicina()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $tipoReporte = $_POST['tipoReporte'];

            if (!$tipoReporte) {
                throw new Exception('El tipo de reporte no puede estar vacio');
            }

            if (isset($tipoReporte)) {
                if ($tipoReporte == "morbilidad") {
                    $resultado = $modelo->manejarAccion('reporteMed');
                } else if ($tipoReporte == "inventario") {
                    $resultado = $modelo->manejarAccion('reporteInvMed');
                }
                echo json_encode($resultado);
                exit;
            }
        } else {
            if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                if (isset($_GET['data'])) {
                    if ($_GET['data'] == 1) {
                        $data = $modelo->manejarAccion('reporteMed');
                    } else if ($_GET['data'] == 2) {
                        $data = $modelo->manejarAccion('reporteInvMed');
                    }

                    echo json_encode($data);
                    exit;
                } else {
                    require_once 'app/views/reportes_medicina.php';
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);

            exit();
        } else {
            // Redirección para peticiones normales
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reporteOrientacion()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $resultado = $modelo->manejarAccion('reporteOrientacion');

            echo json_encode($resultado);
        } else {
            if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                if (isset($_GET['data'])) {
                    $data = $modelo->manejarAccion('reporteOrientacion');

                    echo json_encode($data);
                    exit;
                } else {
                    require_once 'app/views/reportes_orientacion.php';
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);

            exit();
        } else {
            // Redirección para peticiones normales
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reporteTrabajoSocial()
{
    $modelo = new ReportesModel();
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $servicio = $_POST['tipoReporte'] ?? null;

            if (empty($servicio)) {
                throw new Exception('Debes seleccionar un tipo de reporte');
            }

            if ($servicio === 'becas') {
                $data = $modelo->manejarAccion('reporteBecas');
            } elseif ($servicio === 'exoneracion') {
                $data = $modelo->manejarAccion('reporteEx');
            } elseif ($servicio === 'fames') {
                $data = $modelo->manejarAccion('reporteFames');
            } elseif ($servicio === 'embarazo') {
                $data = $modelo->manejarAccion('reporteEmb');
            }

            echo json_encode($data);
        } else {
            $servicio = isset($_GET['servicio']) ? $_GET['servicio'] : null;

            if ($_SERVER['REQUEST_METHOD'] == 'GET') {

                if (!$servicio) {
                    require_once 'app/views/reportes_trabajo_social.php';
                } else {
                    if ($servicio === 'becas') {
                        $becas = $modelo->manejarAccion('reporteBecas');
                    } elseif ($servicio === 'exoneracion') {
                        $ex = $modelo->manejarAccion('reporteEx');
                    } elseif ($servicio === 'fames') {
                        $fames = $modelo->manejarAccion('reporteFames');
                    } elseif ($servicio === 'embarazo') {
                        $emb = $modelo->manejarAccion('reporteEmb');
                    }

                    echo json_encode(($servicio === "becas") ? $becas : (($servicio === "exoneracion") ? $ex : (($servicio === "fames") ? $fames : (($servicio === "embarazo") ? $emb : null))));
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);
        } else {
            // Redirección para peticiones normales (no AJAX)
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reporteDiscapacidad()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $resultado = $modelo->manejarAccion('reporteDiscapacidad');

            echo json_encode($resultado);
        } else {
            if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                if (isset($_GET['data'])) {
                    $data = $modelo->manejarAccion('reporteDiscapacidad');

                    echo json_encode($data);
                    exit;
                } else {
                    require_once 'app/views/reportes_discapacidad.php';
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);
        } else {
            // Redirección para peticiones normales (no AJAX)
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reporteReferencias()
{
    $permisos = new PermisosModel();
    $modelo = new ReportesModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $data = $modelo->manejarAccion('reporteReferencia');

            if (isset($data)) {
                echo json_encode($data);
            }
        } else {
            if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                if (isset($_GET['data'])) {
                    $data = $modelo->manejarAccion('reporteReferencia');

                    echo json_encode($data);
                    exit;
                } else {
                    require_once 'app/views/reportes_referencias.php';
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);
        } else {
            // Redirección para peticiones normales (no AJAX)
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reporteMobiliario()
{
    $modelo = new ReportesModel();
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $tipoReporte = $_POST['tipoReporte'] ?? null;

            if (empty($tipoReporte)) {
                throw new Exception('Debes seleccionar un tipo de reporte');
            }

            if ($tipoReporte === 'mobiliario') {
                $data = $modelo->manejarAccion('reporteMob');
            } elseif ($tipoReporte === 'equipos') {
                $data = $modelo->manejarAccion('reporteEq');
            }

            echo json_encode($data);
        } else {
            $tipo_reporte = isset($_GET['tipoReporte']) ? $_GET['tipoReporte'] : null;

            if ($_SERVER['REQUEST_METHOD'] == 'GET') {

                if (!$tipo_reporte) {
                    require_once 'app/views/reportes_mobiliario.php';
                } else {
                    if ($tipo_reporte === 'mobiliario') {
                        $dataM = $modelo->manejarAccion('dataMob');
                    } elseif ($tipo_reporte === 'equipos') {
                        $data = $modelo->manejarAccion('dataEq');
                    } else {
                        $data = [];
                    }

                    if (isset($dataM)) {
                        echo json_encode([
                            'servicio' => $dataM['servicio'],
                            'tipoMob' => $dataM['tipoMob'],
                            'marca' => $dataM['marca'],
                            'modelo' => $dataM['modelo'],
                        ]);
                    } else {
                        echo json_encode([
                            'servicio' => $data['servicio'],
                            'tipoE' => $data['tipoE'],
                            'marca' => $data['marca'],
                            'modelo' => $data['modelo'],
                            'serial' => $data['serial']
                        ]);
                    }
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);
        } else {
            // Redirección para peticiones normales (no AJAX)
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reporteTransporte()
{
    $modelo = new ReportesModel();
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $tipoReporte = $_POST['tipoReporte'] ?? null;

            if (empty($tipoReporte)) {
                throw new Exception('Debes seleccionar un tipo de reporte');
            }

            if (isset($tipoReporte)) {
                $data = $modelo->manejarAccion('dataTrans');
            }

            if (isset($data)) {
                echo json_encode([
                    'vehiculos' => $data['vehiculos'],
                    'proveedores' => $data['proveedores'],
                    'rutas' => $data['rutas'],
                    'repuestos' => $data['repuestos'],
                ]);
            }
        } else {
            $tipo_reporte = isset($_GET['tipoReporte']) ? $_GET['tipoReporte'] : null;

            if ($_SERVER['REQUEST_METHOD'] == 'GET') {

                if (!$tipo_reporte) {
                    require_once 'app/views/reportes_transporte.php';
                } else {
                    if (isset($tipo_reporte)) {
                        $data = $modelo->manejarAccion('dataTrans');
                    } else {
                        $data = [];
                    }

                    if (isset($data)) {
                        echo json_encode([
                            'vehiculos' => $data['vehiculos'],
                            'proveedores' => $data['proveedores'],
                            'rutas' => $data['rutas'],
                            'repuestos' => $data['repuestos'],
                        ]);
                    }
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);
        } else {
            // Redirección para peticiones normales (no AJAX)
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}

function reporteJornada()
{
    $modelo = new ReportesModel();
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

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

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $data = $modelo->manejarAccion('dataJornada');

            if (isset($data)) {
                echo json_encode($data);
            }
        } else {
            if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                if (isset($_GET['data'])) {
                    $data = $modelo->manejarAccion('dataJornada');

                    echo json_encode($data);
                    exit;
                } else {
                    require_once 'app/views/reportes_jornadas.php';
                }
            }
        }
    } catch (Throwable $e) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            // Respuesta para AJAX (JSON)
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'message' => $e->getMessage()
            ]);
        } else {
            // Redirección para peticiones normales (no AJAX)
            $mensaje = urlencode($e->getMessage());
            $referer = $_SERVER['HTTP_REFERER'] ?? 'index.php';
            $separator = (parse_url($referer, PHP_URL_QUERY)) ? '&' : '?';
            header("Location: {$referer}{$separator}error={$mensaje}");
        }
        exit();
    }
}
*/