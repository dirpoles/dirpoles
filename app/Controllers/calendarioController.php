<?php
use App\Models\CalendarioModel;

function obtener_eventos_calendario() {
    $modelo = new CalendarioModel();
    $id_empleado = $_SESSION['id_empleado'];
    $modelo->__set('id_empleado', $id_empleado);
    
    $eventos = $modelo->manejarAccion('obtener');
    
    // Formatear para FullCalendar
    $eventosFormateados = array_map(fn($evento) => [
        'id' => $evento['id_evento'],
        'title' => $evento['titulo'],
        'start' => $evento['fecha'],
        'extendedProps' => [
            'descripcion' => $evento['descripcion'] ?? ''
        ]
    ], $eventos);
    
    header('Content-Type: application/json');
    echo json_encode($eventosFormateados);
}

function guardar_evento_calendario(){
    $modelo = new CalendarioModel();

    try{
        $id_empleado = $_SESSION['id_empleado'];
        $titulo = filter_input(INPUT_POST, 'titulo', FILTER_DEFAULT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT);
        $fecha = filter_input(INPUT_POST, 'fecha', FILTER_DEFAULT);


        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('titulo', $titulo);
        $modelo->__set('descripcion', $descripcion);
        $modelo->__set('fecha', $fecha);


        $resultado = $modelo->manejarAccion('agregar');

        if($resultado['exito']){
            echo json_encode([
                'exito' => true,
                'mensaje' => $resultado['mensaje'] ?? 'Evento guardado correctamente'
            ]);
        }

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage() ?? 'Error al guardar el evento'
        ]);
    }
}

function actualizar_evento_calendario() {
    $modelo = new CalendarioModel();

    try {
        // Obtener datos del POST
        $id_evento = filter_input(INPUT_POST, 'id_evento', FILTER_VALIDATE_INT);
        $titulo = filter_input(INPUT_POST, 'titulo', FILTER_DEFAULT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT);
        $fecha = filter_input(INPUT_POST, 'fecha', FILTER_DEFAULT);
        $id_empleado = $_SESSION['id_empleado'];

        if (!$id_evento) {
            throw new Exception('ID de evento inválido');
        }

        $modelo->__set('id_evento', $id_evento);
        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('titulo', $titulo);
        $modelo->__set('descripcion', $descripcion);
        $modelo->__set('fecha', $fecha);

        $resultado = $modelo->manejarAccion('modificar');

        echo json_encode($resultado);
    } catch(Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function eliminar_evento_calendario() {
    $modelo = new CalendarioModel();

    try {
        $id_evento = filter_input(INPUT_POST, 'id_evento', FILTER_VALIDATE_INT);
        $id_empleado = $_SESSION['id_empleado'];

        if (!$id_evento) {
            throw new Exception('ID de evento inválido');
        }

        $modelo->__set('id_evento', $id_evento);
        $modelo->__set('id_empleado', $id_empleado);

        $resultado = $modelo->manejarAccion('eliminar');

        echo json_encode($resultado);
    } catch(Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}