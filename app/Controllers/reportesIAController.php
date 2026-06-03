<?php

use App\Models\ReportesIAModel;
use App\Models\BitacoraModel;
use App\Models\PermisosModel;

function reporte_general_ia()
{
    $modelo = new ReportesIAModel();
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

        // 2. Instancia a ReportesIAModel para obtener las filas crudas
        $filasCrudas = $modelo->manejarAccion('reporteGeneral');

        // Obtener filtros desde la petición para filtrar la data antes de resumir
        $fechaInicio = $_POST['fecha_inicio'] ?? $_GET['fecha_inicio'] ?? null;
        $fechaFin = $_POST['fecha_fin'] ?? $_GET['fecha_fin'] ?? null;
        $genero = $_POST['genero'] ?? $_GET['genero'] ?? null;
        $pnf = $_POST['pnf'] ?? $_GET['pnf'] ?? null;
        $area = $_POST['area'] ?? $_GET['area'] ?? null;

        // 3. Recorrer el bucle para generar estadísticas resumidas reduciendo el tamaño del payload
        $filasFiltradas = [];
        foreach ($filasCrudas as $fila) {
            $match = true;

            // Filtrar por Fecha
            if (!empty($fechaInicio) || !empty($fechaFin)) {
                $itemDate = date('Y-m-d', strtotime($fila['fecha_creacion']));
                if (!empty($fechaInicio) && $itemDate < $fechaInicio) {
                    $match = false;
                }
                if (!empty($fechaFin) && $itemDate > $fechaFin) {
                    $match = false;
                }
            }

            // Filtrar por Género
            if (!empty($genero) && $fila['genero'] !== $genero) {
                $match = false;
            }

            // Filtrar por PNF
            if (!empty($pnf) && $fila['nombre_pnf'] !== $pnf) {
                $match = false;
            }

            // Filtrar por Área
            if (!empty($area) && $fila['nombre_serv'] !== $area) {
                $match = false;
            }

            if ($match) {
                $filasFiltradas[] = $fila;
            }
        }

        if (empty($filasFiltradas)) {
            header('Content-Type: application/json');
            echo json_encode([
                'exito' => false,
                'mensaje' => 'No hay registros que coincidan con los filtros seleccionados para analizar con IA.'
            ]);
            exit();
        }

        // Resumir data (conteos por PNF, género, servicios)
        $total = count($filasFiltradas);
        $resumenPNF = [];
        $resumenGenero = [];
        $resumenServicio = [];

        foreach ($filasFiltradas as $fila) {
            $pnfNombre = $fila['nombre_pnf'] ?: 'No especificado';
            $gen = $fila['genero'] === 'M' ? 'Masculino' : ($fila['genero'] === 'F' ? 'Femenino' : 'No especificado');
            $serv = $fila['nombre_serv'] ?: 'No especificado';

            if (!isset($resumenPNF[$pnfNombre])) {
                $resumenPNF[$pnfNombre] = 0;
            }
            $resumenPNF[$pnfNombre]++;

            if (!isset($resumenGenero[$gen])) {
                $resumenGenero[$gen] = 0;
            }
            $resumenGenero[$gen]++;

            if (!isset($resumenServicio[$serv])) {
                $resumenServicio[$serv] = 0;
            }
            $resumenServicio[$serv]++;
        }

        $datosResumidos = [
            'total_registros' => $total,
            'distribucion_pnf' => $resumenPNF,
            'distribucion_genero' => $resumenGenero,
            'distribucion_servicios' => $resumenServicio,
            'filtros_aplicados' => [
                'fecha_inicio' => $fechaInicio ?: 'No especificada',
                'fecha_fin' => $fechaFin ?: 'No especificada',
                'genero' => $genero ?: 'Todos',
                'pnf' => $pnf ?: 'Todos',
                'area' => $area ?: 'Todos'
            ]
        ];

        // 4. Instancia la clase MicroservicioIA
        require_once BASE_PATH . 'app/Core/MicroservicioIA.php';
        $ia = new MicroservicioIA();

        // 5. Verifica si el servicio responde con estaActivo()
        if (!$ia->estaActivo()) {
            header('Content-Type: application/json');
            echo json_encode([
                'exito' => false,
                'mensaje' => 'El microservicio de IA no está activo o no se puede conectar.'
            ]);
            exit();
        }

        // 6. Llama a $ia->analizar('general', $datosResumidos)
        $analisis = $ia->analizar('general', $datosResumidos, $fechaInicio, $fechaFin);

        // Registrar en bitácora
        $bitacora->__set('id_empleado', $_SESSION['id_empleado']);
        $bitacora->__set('modulo', 'Reportes');
        $bitacora->__set('accion', 'Lectura');
        $bitacora->__set('descripcion', 'Generación de reporte general analizado con IA');
        $bitacora->manejarAccion('registrar_bitacora');

        // 7. Imprime el JSON de respuesta directo a tu vista frontend
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