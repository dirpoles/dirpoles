<?php

use App\Models\BitacoraModel;
use App\Models\PermisosModel;
use App\Core\MicroservicioIA;


function reporte_general_ia()
{
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $modulo = 'Reportes';

    try {
        // 1. Valida permisos de 'Crear' en reportes
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        // 2. Obtener filtros desde la petición (POST o GET)
        $fechaInicio = $_POST['fecha_inicio'] ?? $_GET['fecha_inicio'] ?? null;
        $fechaFin = $_POST['fecha_fin'] ?? $_GET['fecha_fin'] ?? null;
        $genero = $_POST['genero'] ?? $_GET['genero'] ?? null;
        $pnf = $_POST['pnf'] ?? $_GET['pnf'] ?? null;
        $area = $_POST['area'] ?? $_GET['area'] ?? null;

        // Construir el array de filtros
        $filtros = [];
        if (!empty($fechaInicio))
            $filtros['fecha_inicio'] = $fechaInicio;
        if (!empty($fechaFin))
            $filtros['fecha_fin'] = $fechaFin;
        if (!empty($genero))
            $filtros['genero'] = $genero;
        if (!empty($pnf))
            $filtros['pnf'] = $pnf;
        if (!empty($area))
            $filtros['area'] = $area;

        $ia = new MicroservicioIA();

        // 4. Verifica si el servicio responde
        if (!$ia->estaActivo()) {
            header('Content-Type: application/json');
            echo json_encode([
                'exito' => false,
                'mensaje' => 'El microservicio de IA no está activo o no se puede conectar.'
            ]);
            exit();
        }

        // 5. Llama al microservicio pasándole solo el tipo y los filtros
        $analisis = $ia->analizar('general', $filtros);

        // Registrar en bitácora
        $bitacora->__set('id_empleado', $_SESSION['id_empleado']);
        $bitacora->__set('modulo', 'Reportes');
        $bitacora->__set('accion', 'Lectura');
        $bitacora->__set('descripcion', 'Generación de reporte general analizado con IA');
        $bitacora->manejarAccion('registrar_bitacora');

        // 6. Imprime el JSON de respuesta directo a tu vista frontend
        header('Content-Type: application/json');
        echo json_encode([
            'exito' => true,
            'analisis' => $analisis
        ]);
        exit();

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


function reporte_general_ia_health()
{
    $permisos = new PermisosModel();
    $modulo = 'Reportes';

    try {
        // Valida permisos de 'Crear' en reportes
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach ($verificar as $atributo => $valor) {
            $permisos->__set($atributo, $valor);
        }

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . 'app/Core/MicroservicioIA.php';
        $ia = new MicroservicioIA();
        $activo = $ia->estaActivo();

        header('Content-Type: application/json');
        echo json_encode([
            'exito' => true,
            'activo' => $activo
        ]);
        exit();

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