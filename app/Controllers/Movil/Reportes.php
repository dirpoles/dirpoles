<?php

use App\Models\PermisosModel;
use App\Models\BitacoraModel;
use App\Models\BusinessModel;

/**
 * CONTROLADOR MÓVIL: Reportes Estadísticos (SOLID: SRP)
 * 
 * Expone un endpoint consolidado para recabar estadísticas de
 * beneficiarios, citas e inventario médico en una sola petición.
 */
function procesarReportes(array $datos)
{
    switch ($datos['accion']) {
        case 'consultar_reportes_movil':
            consultarReportesMovil();
            break;

        default:
            http_response_code(404);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => "Acción de Reportes '{$datos['accion']}' no reconocida."
            ]);
            exit;
    }
}

function consultarReportesMovil()
{
    // 1. Verificar Identidad mediante JWT
    $empleado = verificarTokenMovil();
    $id_empleado = $empleado['id_empleado'];
    $id_tipo_empleado = $empleado['id_tipo_empleado'];

    // Simular sesión para compatibilidad con Modelos/Permisos
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['id_empleado'] = $id_empleado;
    $_SESSION['nombre'] = $empleado['nombre'];
    $_SESSION['id_tipo_empleado'] = $id_tipo_empleado;

    try {
        // 2. Verificar Permisos (Módulo Reportes, Lectura)
        $permisos = new PermisosModel();
        $permisos->__set('Modulo', 'Reportes');
        $permisos->__set('Permiso', 'Leer');
        $permisos->__set('Rol', $id_tipo_empleado);

        if (!$permisos->manejarAccion('Verificar')) {
            throw new Exception('No tienes permiso para consultar reportes estadísticos.');
        }

        // 3. Crear una conexión directa mediante una extensión anónima del BusinessModel
        // Esto permite ejecutar queries ágiles sin crear un modelo extra
        $dbModel = new class extends BusinessModel {
            public function ejecutarQuery($sql, $params = []) {
                $stmt = $this->conn->prepare($sql);
                $stmt->execute($params);
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            public function ejecutarRow($sql, $params = []) {
                $stmt = $this->conn->prepare($sql);
                $stmt->execute($params);
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }
        };

        // --- A. Estadísticas de Beneficiarios ---
        $totalesBenef = $dbModel->ejecutarRow("SELECT COUNT(*) as total FROM beneficiario");
        $generoBenef = $dbModel->ejecutarQuery("SELECT genero, COUNT(*) as total FROM beneficiario GROUP BY genero");
        $pnfBenef = $dbModel->ejecutarQuery("
            SELECT p.nombre_pnf, COUNT(*) as total 
            FROM beneficiario b 
            JOIN pnf p ON b.id_pnf = p.id_pnf 
            GROUP BY p.nombre_pnf 
            ORDER BY total DESC 
            LIMIT 5
        ");

        // --- B. Estadísticas de Citas ---
        $totalesCitas = $dbModel->ejecutarRow("SELECT COUNT(*) as total FROM cita");
        $estadosCitas = $dbModel->ejecutarQuery("
            SELECT ec.nombre as estado, COUNT(*) as total 
            FROM cita c
            JOIN estado_cita ec ON c.estatus = ec.id_estado
            GROUP BY ec.nombre
        ");

        // --- C. Estadísticas de Inventario Médico ---
        $totalesInsumos = $dbModel->ejecutarRow("SELECT COUNT(*) as total_insumos, COALESCE(SUM(cantidad), 0) as total_unidades FROM insumos");
        $estatusInsumos = $dbModel->ejecutarQuery("SELECT estatus, COUNT(*) as total FROM insumos GROUP BY estatus");
        $tipoInsumos = $dbModel->ejecutarQuery("SELECT tipo_insumo as tipo, COUNT(*) as total FROM insumos GROUP BY tipo_insumo");

        // 4. Escribir en la bitácora de auditoría
        $bitacora = new BitacoraModel();
        $bitacora->__set('id_empleado', $id_empleado);
        $bitacora->__set('modulo', 'Reportes');
        $bitacora->__set('accion', 'Lectura');
        $bitacora->__set('descripcion', "El empleado {$empleado['nombre']} consultó los reportes estadísticos consolidados desde la aplicación móvil.");
        $bitacora->manejarAccion('registrar_bitacora');

        // Responder con la payload consolidada
        http_response_code(200);
        echo json_encode([
            'estado' => 'exito',
            'datos' => [
                'beneficiarios' => [
                    'total' => (int)($totalesBenef['total'] ?? 0),
                    'genero' => $generoBenef,
                    'pnf' => $pnfBenef
                ],
                'citas' => [
                    'total' => (int)($totalesCitas['total'] ?? 0),
                    'estados' => $estadosCitas
                ],
                'inventario' => [
                    'total_insumos' => (int)($totalesInsumos['total_insumos'] ?? 0),
                    'total_unidades' => (int)($totalesInsumos['total_unidades'] ?? 0),
                    'estatus' => $estatusInsumos,
                    'tipos' => $tipoInsumos
                ]
            ]
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
