<?php
use App\Models\NotificacionesModel;

function obtenerNotificaciones(){
    header('Content-Type: application/json');
    $modelo = new NotificacionesModel();
    try{
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            throw new Exception("Metodo no permitido");
        }
        $id_empleado = $_SESSION['id_empleado'] ?? null;

        if(empty($id_empleado)){
            throw new Exception("No se encontro el id del empleado");
        }
        $modelo->__set('id_empleado', $id_empleado);

        $resultado = $modelo->manejarAccion('obtenerNotf');
        
        // Incluso si no hay notificaciones, devolver éxito con arrays vacíos
        $response = [
            'exito' => true,
            'unread_count' => $resultado['unreadCount'] ?? 0,
            'notifications' => $resultado['notifications'] ?? []
        ];

        echo json_encode($response);
        exit();
        
    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}


function cargarMasNotificaciones(){
    $modelo = new NotificacionesModel();

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Error en el servidor');
        }

        $id_empleado = $_SESSION['id_empleado'];
        $page = $_POST['page'] ?? 1;
        $offset = ($page - 1) * 10;
        $limit = 10; // o el número que prefieras

        if (empty($id_empleado) || empty($page) || empty($limit) || empty($offset)) {
            throw new Exception("No pueden haber variables vacías");
        }

        $arreglo = [
            'id_empleado' => $id_empleado,
            'page' => $page,
            'offset' => $offset,
            'limit' => $limit
        ];

        foreach ($arreglo as $atributo => $valor) {
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('cargarMasNotf');

        if ($resultado) {

            $respuesta = [
                'exito' => true,
                'notifications' => $resultado['notifications'],
                'has_more' => $resultado['has_more']
            ];

            header('Content-Type: application/json');
            echo json_encode($respuesta);
        }
    } catch (Throwable $e) {
        echo json_encode([
            "exito" => false,
            "mensaje" => $e->getMessage()
        ]);
        exit();
    }
}

function marcarLeidas(){
    $modelo = new NotificacionesModel();

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Error en el servidor');
        }

        $id_notif = $_POST["id"];

        if (empty($id_notif)) {
            throw new Exception('No se ha proporcionado el id de la notificación');
        }

        $modelo->__set('id_notif', $id_notif);

        $resultado = $modelo->manejarAccion('marcarLeidas');

        if ($resultado) {
            $response['exito'] = true;

            echo json_encode($response);
        }
    } catch (Throwable $e) {
        echo json_encode([
            "exito" => false,
            "mensaje" => $e->getMessage()
        ]);
    }
}

function marcarTodasLeidas(){
    $modelo = new NotificacionesModel();
    
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        $id_empleado = $_SESSION['id_empleado'];
        
        if (empty($id_empleado)) {
            throw new Exception('No se encontró el id del empleado');
        }

        $modelo->__set('id_empleado', $id_empleado);
        
        $resultado = $modelo->manejarAccion('marcarTodasLeidas');

        // IMPORTANTE: rowCount() puede devolver 0 (cero) si no hay notificaciones pendientes
        // Esto NO es un error, es un resultado válido
        if ($resultado !== false) {
            $response = [
                'exito' => true,
                'mensaje' => 'Todas las notificaciones marcadas como leídas',
                'filas_afectadas' => $resultado
            ];
            
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
        } else {
            throw new Exception('Error al ejecutar la consulta');
        }
        
    } catch (Throwable $e) {
        header('Content-Type: application/json');
        echo json_encode([
            "exito" => false,
            "mensaje" => $e->getMessage()
        ]);
        exit();
    }
}

function eliminarNotificacion(){
    $modelo = new NotificacionesModel();

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Error en el servidor');
        }

        $id_notif = $_POST["id"];

        if (empty($id_notif)) {
            throw new Exception('No se ha proporcionado el id de la notificación');
        }

        $modelo->__set('id_notif', $id_notif);

        $resultado = $modelo->manejarAccion('eliminar');

        if ($resultado) {

            $response = [
                'exito' => true
            ];

            echo json_encode($response);
        }
        
    } catch (Throwable $e) {
        echo json_encode([
            "exito" => false,
            "mensaje" => $e->getMessage()
        ]);
    }
}

function contar_notificaciones(){
    try {
        if (!isset($_SESSION['id_empleado'])) {
            echo json_encode(['exito' => false, 'mensaje' => 'Sesión no válida']);
            return;
        }
        
        $notificacion = new NotificacionesModel();
        $notificacion->__set('id_empleado', $_SESSION['id_empleado']);
        $resultado = $notificacion->manejarAccion('contarNotificaciones');
        
        echo json_encode([
            'exito' => true,
            'total' => $resultado
        ]);
        
    } catch (Throwable $e) {
        error_log("ERROR en contarNotificacionesJson: " . $e->getMessage());
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error al contar notificaciones'
        ]);
    }
}

function eliminarTodasNotificaciones(){
    $modelo = new NotificacionesModel();

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Error en el servidor');
        }

        $id_empleado = $_SESSION['id_empleado'];

        if (empty($id_empleado)) {
            throw new Exception('No se ha proporcionado el id del empleado');
        }

        $modelo->__set('id_empleado', $id_empleado);

        $resultado = $modelo->manejarAccion('eliminar_todas');

        if ($resultado) {

            $response = [
                'exito' => true
            ];

            echo json_encode($response);
        }
        
    } catch (Throwable $e) {
        echo json_encode([
            "exito" => false,
            "mensaje" => $e->getMessage()
        ]);
    }
}
