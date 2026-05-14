<?php

use App\Models\CitasModel;
use App\Models\PermisosModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;

function procesarCitas(array $datos)
{
    switch ($datos['accion']) {
        case 'consultar_citas':
            movilConsultarCitas();
            break;

        default:
            http_response_code(404);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => "Acción de citas '{$datos['accion']}' no reconocida."
            ]);
            exit;
    }
}

function movilConsultarCitas()
{
    $modelo = new CitasModel();
    try {
        $citas = $modelo->manejarAccion('consultar_citas');
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $citas]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al obtener las citas.'
        ]);
        exit();
    }
}

