<?php
use App\Models\PermisosModel;

function crear_permisos(){
    $modelo = new PermisosModel();
    $permisos = new PermisosModel();
    $modulo = 'Permisos';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $data['tipos_empleado'] = $modelo->manejarAccion('tipos_empleados');
        $data['modulos'] = $modelo->manejarAccion('obtener_modulos');
        $data['permisos'] = $modelo->manejarAccion('obtenerPermisos');

        // NUEVO: obtener mapa completo y pasarlo a la vista
        $resMapa = $modelo->manejarAccion('mapa_permisos_todos');
        $data['mapa_permisos'] = ($resMapa['exito'] ?? false) ? $resMapa['data'] : [];

        require_once BASE_PATH . '/app/Views/permisos/crear_permisos.php';
        
    }catch(Throwable $e){
        // Si la petición NO es AJAX, mostramos la vista de error
        if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
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

// Endpoint para obtener permisos por módulo y rol
function ajax_obtener_permisos_por_rol(){
    $modelo = new PermisosModel();

    $id_tipo_emp = filter_input(INPUT_POST, 'id_tipo_emp', FILTER_SANITIZE_NUMBER_INT);
    $modelo->__set('id_tipo_emp', $id_tipo_emp);
    $respuesta = $modelo->manejarAccion("obtener_permisos_por_rol");

    echo json_encode($respuesta);
    exit;
}

function ajax_guardar_permisos_lote(){
    $modelo = new PermisosModel();

    $json = $_POST['cambios'] ?? null;

    if ($json === null) {
        // posible problema: la petición no envió 'cambios'
        echo json_encode([
            "exito" => false,
            "mensaje" => "No se recibieron datos (cambios)."
        ]);
        exit;
    }

    $array_cambios = json_decode($json, true);

    if (!is_array($array_cambios)) {
        echo json_encode([
            "exito" => false,
            "mensaje" => "Formato de cambios inválido."
        ]);
        exit;
    }

    $modelo->__set('cambios', $array_cambios);
    $respuesta = $modelo->manejarAccion("guardar_permisos_lote");

    // En caso de error, podemos loguear brevemente
    if (empty($respuesta['exito'])) {
        error_log("ajax_guardar_permisos_lote: respuesta error: " . json_encode($respuesta));
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($respuesta);
    exit;
}






