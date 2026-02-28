<?php
use App\Models\OrientacionModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;
use App\Models\PermisosModel;

function diagnostico_orientacion(){
    $permisos = new PermisosModel();
    $modulo = 'Orientacion';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/diagnosticos/orientacion/diagnostico_orientacion.php';
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

function orientacion_registrar(){
    $modelo = new OrientacionModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $permisos = new PermisosModel();
    $modulo = 'Orientacion';

    try{
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            throw new Exception('Metodo no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);
        $motivo_orientacion = filter_input(INPUT_POST, 'motivo_orientacion', FILTER_DEFAULT);
        $descripcion_orientacion = filter_input(INPUT_POST, 'descripcion_orientacion', FILTER_DEFAULT);
        $indicaciones_orientacion = filter_input(INPUT_POST, 'indicaciones_orientacion', FILTER_DEFAULT);
        $obs_adic_orientacion = filter_input(INPUT_POST, 'obs_adic_orientacion', FILTER_DEFAULT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_DEFAULT);
        $id_servicios = 3;

        if(empty($id_beneficiario) || empty($motivo_orientacion) || empty($descripcion_orientacion) || empty($indicaciones_orientacion) || empty($obs_adic_orientacion)){
            throw new Exception('Todos los campos son obligatorios');
        }

        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'motivo_orientacion' => $motivo_orientacion,
            'descripcion_orientacion' => $descripcion_orientacion,
            'indicaciones_orientacion' => $indicaciones_orientacion,
            'obs_adic_orientacion' => $obs_adic_orientacion,
            'id_empleado' => $id_empleado,
            'id_servicios' => $id_servicios
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('registrar_diagnostico');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if($resultado['exito'] === true){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un diagnóstico de orientación con el beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Diagnóstico',
                'url' => 'diagnostico_orientacion_consultar',
                'tipo' => 'diagnostico',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, //Administrador
                'leido' => 0
            ];
            foreach($notificacion_data as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            throw new Exception($resultado['mensaje'] ?? 'Error al registrar el diagnóstico');
        }

        

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function diagnostico_orientacion_consultar(){
    $permisos = new PermisosModel();
    $modulo = 'Orientacion';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/diagnosticos/orientacion/consultar_diagnostico.php';

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

function diagnostico_orientacion_data_json(){
    $modelo = new OrientacionModel();
    header('Content-Type: application/json');
    $id_empleado = $_SESSION['id_empleado'];
    $es_admin = in_array($_SESSION['tipo_empleado'], ['Administrador', 'Superusuario']);
    
    $modelo->__set('id_empleado', $id_empleado);
    $modelo->__set('es_admin', $es_admin);
    
    try {
        $data = $modelo->manejarAccion('obtener_diagnostico');
        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function diagnostico_orientacion_detalle(){
    $modelo = new OrientacionModel();
    header('Content-Type: application/json');
    $id_orientacion = $_GET['id_orientacion'];
    $modelo->__set('id_orientacion', $id_orientacion);
    
    try {
        $data = $modelo->manejarAccion('orientacion_detalle');
        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function diagnostico_orientacion_actualizar(){
    $modelo = new OrientacionModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $permisos = new PermisosModel();
    $modulo = 'Orientacion';

    try{
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            throw new Exception('Metodo no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_orientacion = filter_input(INPUT_POST, 'id_orientacion', FILTER_DEFAULT);
        $motivo_orientacion = filter_input(INPUT_POST, 'motivo_orientacion', FILTER_DEFAULT);
        $descripcion_orientacion = filter_input(INPUT_POST, 'descripcion_orientacion', FILTER_DEFAULT);
        $obs_adic_orientacion = filter_input(INPUT_POST, 'obs_adic_orientacion', FILTER_DEFAULT);
        $indicaciones_orientacion = filter_input(INPUT_POST, 'indicaciones_orientacion', FILTER_DEFAULT);
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);

        if(empty($id_orientacion) || empty($motivo_orientacion) || empty($descripcion_orientacion) || empty($obs_adic_orientacion) || empty($indicaciones_orientacion) || empty($id_beneficiario)){
            throw new Exception('Todos los campos son obligatorios');
        }

        $datos = [
            'id_orientacion' => $id_orientacion,
            'motivo_orientacion' => $motivo_orientacion,
            'descripcion_orientacion' => $descripcion_orientacion,
            'obs_adic_orientacion' => $obs_adic_orientacion,
            'indicaciones_orientacion' => $indicaciones_orientacion,
            'id_beneficiario' => $id_beneficiario
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('actualizar_orientacion');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if($resultado['exito']){
        $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó el diagnóstico de orientación con el beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Diagnóstico',
                'url' => 'diagnostico_orientacion_consultar',
                'tipo' => 'diagnostico',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, //Administrador
                'leido' => 0
            ];
            foreach($notificacion_data as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $resultado['mensaje']
            ]);
        } else {
            throw new Exception($resultado['mensaje'] ?? 'Error al actualizar el diagnóstico');
        }

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function orientacion_eliminar(){
    $modelo = new OrientacionModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $permisos = new PermisosModel();
    $modulo = 'Orientacion';

    try{
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            throw new Exception('Metodo no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_orientacion = filter_input(INPUT_POST, 'id_orientacion', FILTER_DEFAULT);
        $id_solicitud_serv = filter_input(INPUT_POST, 'id_solicitud_serv', FILTER_DEFAULT);
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);

        if(empty($id_orientacion) || empty($id_solicitud_serv) || empty($id_beneficiario)){
            throw new Exception('Todos los campos son obligatorios');
        }

        $datos = [
            'id_orientacion' => $id_orientacion,
            'id_solicitud_serv' => $id_solicitud_serv,
            'id_beneficiario' => $id_beneficiario
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('eliminar_orientacion');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if($resultado['exito']){
            $bitacora_data = [
                    'id_empleado' => $_SESSION['id_empleado'],
                    'modulo' => $modulo,
                    'accion' => 'Eliminación',
                    'descripcion' => "El Empleado {$_SESSION['nombre']} eliminó el diagnóstico de orientación con el beneficiario $beneficiario"
                ];
                foreach($bitacora_data as $atributo => $valor){
                    $bitacora->__set($atributo, $valor);
                }
                $bitacora->manejarAccion('registrar_bitacora');

                $notificacion_data = [
                    'titulo' => 'Eliminación de Diagnóstico',
                    'url' => 'diagnostico_orientacion_consultar',
                    'tipo' => 'diagnostico',
                    'id_emisor' => $_SESSION['id_empleado'],
                    'id_receptor' => 1, //Administrador
                    'leido' => 0
                ];
                foreach($notificacion_data as $atributo => $valor){
                    $notificacion->__set($atributo, $valor);
                }
                $notificacion->manejarAccion('crear_notificacion');

                echo json_encode([
                    'exito' => true,
                    'mensaje' => $resultado['mensaje']
                ]);
            } else {
                throw new Exception($resultado['mensaje'] ?? 'Error al eliminar el diagnóstico');
            }

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function stats_orientacion_admin(){
    $modelo = new OrientacionModel();
    
    $estadisticas = $modelo->manejarAccion('stats_admin');
    header('Content-Type: application/json');
    echo json_encode($estadisticas);
}

function stats_orientacion(){
    $modelo = new OrientacionModel();
    $modelo->__set('id_empleado', $_SESSION['id_empleado']);

    $estadisticas = $modelo->manejarAccion('stats_empleado');
    header('Content-Type: application/json');
    echo json_encode($estadisticas);
}