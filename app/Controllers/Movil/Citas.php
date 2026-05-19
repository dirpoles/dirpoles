<?php

use App\Models\BeneficiarioModel;
use App\Models\CitasModel;
use App\Models\PermisosModel;
use App\Models\BitacoraModel;
use App\Models\EmpleadoModel;
use App\Models\NotificacionesModel;

function procesarCitas(array $datos)
{
    switch ($datos['accion']) {
        case 'consultar_citas':
            movilConsultarCitas($datos);
            break;

        case 'consultar_beneficiarios_activos':
            movilObtenerBeneficiarios();
            break;

        case 'consultar_psicologos':
            movilConsultarPsicologos();
            break;

        case 'validar_fecha_cita':
            movilValidarFechaCita($datos);
            break;

        case 'validar_hora_cita':
            movilValidarHoraCita($datos);
            break;

        case 'obtener_horario_psicologo':
            movilObtenerHorarioPsicologo($datos);
            break;

        case 'registrar_cita':
            movilRegistrarCita($datos);
            break;

        case 'actualizar_cita':
            movilActualizarCita($datos);
            break;

        case 'consultar_estados_cita':
            movilConsultarEstadosCita();
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

function movilConsultarCitas(array $datos)
{

    $modelo = new CitasModel();

    // Inyectar los datos del empleado enviados directamente desde la App
    if (isset($datos['id_empleado'])) {
        $modelo->__set('id_empleado', $datos['id_empleado']);
    }
    if (isset($datos['tipo_empleado'])) {
        $modelo->__set('tipo_empleado', $datos['tipo_empleado']);
    }

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

function movilObtenerBeneficiarios()
{
    $modelo = new BeneficiarioModel();
    try {
        $beneficiario = $modelo->manejarAccion('consultar_beneficiarios_activos');
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $beneficiario]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al obtener los beneficiarios.'
        ]);
        exit();
    }
}

function movilConsultarPsicologos()
{
    $modelo = new EmpleadoModel();
    try {
        $psicologos = $modelo->manejarAccion('psicologos_listar');
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $psicologos]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al obtener los psicologos.'
        ]);
        exit();
    }
}

function movilValidarFechaCita(array $datos)
{
    $modelo = new CitasModel();
    if (isset($datos['id_empleado'])) {
        $modelo->__set('id_empleado', $datos['id_empleado']);
    }
    if (isset($datos['fecha'])) {
        $modelo->__set('fecha', $datos['fecha']);
    }
    if (isset($datos['dia_semana'])) {
        $modelo->__set('dia_semana', $datos['dia_semana']);
    }
    try {
        $citas = $modelo->manejarAccion('verificar_dia_psicologo');
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $citas]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al validar la fecha.'
        ]);
        exit();
    }
}

function movilValidarHoraCita(array $datos)
{
    $modelo = new CitasModel();
    // Seteamos los parámetros necesarios en el modelo
    if (isset($datos['id_empleado'])) $modelo->__set('id_empleado', $datos['id_empleado']);
    if (isset($datos['fecha'])) $modelo->__set('fecha', $datos['fecha']);
    if (isset($datos['dia_semana'])) $modelo->__set('dia_semana', $datos['dia_semana']);
    if (isset($datos['hora'])) $modelo->__set('hora', $datos['hora']);
    if (isset($datos['id_cita'])) $modelo->__set('id_cita', $datos['id_cita']);

    try {
        // 1. Primero verificamos si la hora está dentro del rango del psicólogo
        $rango = $modelo->manejarAccion('verificar_hora_en_rango');
        
        // Si no está en rango, devolvemos el error inmediatamente
        // IMPORTANTE: El modelo para hora devuelve 'en_rango', no 'existe'
        if (!$rango['exito'] || (isset($rango['en_rango']) && $rango['en_rango'] === false)) {
            http_response_code(200);
            echo json_encode(['estado' => 'exito', 'datos' => $rango]);
            exit();
        }

        // 2. Si está en rango, verificamos la disponibilidad (que no choque con otra cita)
        $disponibilidad = $modelo->manejarAccion('verificar_disponibilidad_hora');

        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $disponibilidad]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al validar la hora: ' . $th->getMessage()
        ]);
        exit();
    }
}


// Y la función correspondiente:
function movilObtenerHorarioPsicologo(array $datos)
{
    $modelo = new EmpleadoModel();
    if (isset($datos['id_empleado'])) {
        $modelo->__set('id_empleado', $datos['id_empleado']);
    }

    try {
        // Asumiendo que esta es la acción en tu modelo que devuelve el arreglo con 'horario', 'citas' y 'dias'
        // Revísalo, porque en tu JS web haces fetch a 'obtener_horario_psicologo'
        $horario = $modelo->manejarAccion('obtener_horarios_por_empleado');

        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $horario]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al cargar el horario: ' . $th->getMessage()
        ]);
        exit();
    }
}

function movilRegistrarCita(array $datos)
{
    $modelo = new CitasModel();

    // Setear los campos requeridos por el modelo
    if (isset($datos['id_beneficiario'])) $modelo->__set('id_beneficiario', $datos['id_beneficiario']);
    if (isset($datos['id_empleado'])) $modelo->__set('id_empleado', $datos['id_empleado']);
    if (isset($datos['fecha'])) $modelo->__set('fecha', $datos['fecha']);
    if (isset($datos['hora'])) $modelo->__set('hora', $datos['hora']);
    $modelo->__set('estatus', $datos['estatus'] ?? 1); // 1 = Programada por defecto

    try {
        $resultado = $modelo->manejarAccion('registrar_cita');

        if ($resultado['exito']) {
            http_response_code(200);
            echo json_encode([
                'estado' => 'exito',
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => $resultado['mensaje']
            ]);
        }
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al registrar la cita: ' . $th->getMessage()
        ]);
        exit();
    }
}

function movilActualizarCita(array $datos)
{
    $modelo = new CitasModel();

    if (isset($datos['id_cita'])) $modelo->__set('id_cita', $datos['id_cita']);
    if (isset($datos['fecha'])) $modelo->__set('fecha', $datos['fecha']);
    if (isset($datos['hora'])) $modelo->__set('hora', $datos['hora']);
    if (isset($datos['estatus'])) $modelo->__set('estatus', $datos['estatus']);

    try {
        $resultado = $modelo->manejarAccion('actualizar_cita');

        if ($resultado['exito']) {
            http_response_code(200);
            echo json_encode([
                'estado' => 'exito',
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => $resultado['mensaje']
            ]);
        }
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al actualizar la cita: ' . $th->getMessage()
        ]);
        exit();
    }
}

function movilConsultarEstadosCita()
{
    $modelo = new CitasModel();
    try {
        $resultado = $modelo->manejarAccion('obtener_estados_cita');
        // El modelo devuelve { estados: [...], estado_actual: X }
        // Extraemos solo el array de estados
        $estados = $resultado['estados'] ?? $resultado;
        http_response_code(200);
        echo json_encode(['estado' => 'exito', 'datos' => $estados]);
    } catch (\Throwable $th) {
        http_response_code(500);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al obtener estados: ' . $th->getMessage()
        ]);
        exit();
    }
}
