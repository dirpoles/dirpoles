<?php
use App\Models\BitacoraModel;
use App\Models\PermisosModel;

function consultar_bitacora(){
    $permisos = new PermisosModel();
    $modulo = 'Bitacora';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        
        require_once BASE_PATH . '/app/Views/bitacora/consultar_bitacora.php';
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

function bitacora_data_json(){
    $modelo = new BitacoraModel();
    header('Content-Type: application/json');
    try{

        $bitacora = $modelo->manejarAccion('consultar_bitacora');
        echo json_encode(['data' => $bitacora]);
        exit();
    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}