<?php
use App\Models\BackupModel;
use App\Models\BitacoraModel;

function checkAdminAccess()
{
    $esAdmin = (isset($_SESSION['tipo_empleado']) &&
        (strpos(strtolower($_SESSION['tipo_empleado']), 'administrador') !== false ||
            strpos(strtolower($_SESSION['tipo_empleado']), 'superusuario') !== false));

    if (!$esAdmin) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['exito' => false, 'mensaje' => 'No tienes permiso para realizar esta acción']);
        } else {
            require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        }
        exit();
    }
}

function mostrarVistaRespaldo()
{
    checkAdminAccess();
    require_once BASE_PATH . '/app/Views/configuracion/backup.php';
}

function descargarRespaldo()
{
    checkAdminAccess();

    $tipo = $_GET['tipo'] ?? '';
    if ($tipo !== 'negocio' && $tipo !== 'seguridad') {
        header("HTTP/1.0 400 Bad Request");
        echo "Tipo de respaldo no válido.";
        exit();
    }

    try {
        $backupModel = new BackupModel();

        if ($tipo === 'negocio') {
            $sqlContent = $backupModel->manejarAccion('backup_business');
            $fileName = 'backup_negocio_' . date('Ymd_His') . '.sql';
            $desc = "El Administrador " . $_SESSION['nombre'] . " descargó un respaldo de la base de datos de negocio.";
        } else {
            $sqlContent = $backupModel->manejarAccion('backup_security');
            $fileName = 'backup_seguridad_' . date('Ymd_His') . '.sql';
            $desc = "El Administrador " . $_SESSION['nombre'] . " descargó un respaldo de la base de datos de seguridad.";
        }

        // Registrar en la bitácora
        $bitacora = new BitacoraModel();
        $bitacora_data = [
            'id_empleado' => $_SESSION['id_empleado'],
            'modulo' => 'Configuracion',
            'accion' => 'Respaldo',
            'descripcion' => $desc,
            'fecha' => date('Y-m-d H:i:s')
        ];
        foreach ($bitacora_data as $atributo => $valor) {
            $bitacora->__set($atributo, $valor);
        }
        $bitacora->manejarAccion('registrar_bitacora');

        // Forzar descarga del archivo .sql
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Content-Length: ' . strlen($sqlContent));
        echo $sqlContent;
        exit();

    } catch (Throwable $e) {
        error_log("Error al generar el respaldo de base de datos ($tipo): " . $e->getMessage());
        header("HTTP/1.0 500 Internal Server Error");
        echo "Error al generar el respaldo: " . $e->getMessage();
        exit();
    }
}
