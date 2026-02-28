<?php
use App\Models\DiscapacidadModel;
use App\Models\BitacoraModel;
use App\Models\PermisosModel;
use App\Models\NotificacionesModel;

function diagnostico_discapacidad(){
    $permisos = new PermisosModel();
    $modulo = 'Discapacidad';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/diagnosticos/discapacidad/diagnostico_discapacidad.php';
        
    } catch(Throwable $e){
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

function discapacidad_registrar(){
    $modelo = new DiscapacidadModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Discapacidad';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_beneficiario = filter_input(INPUT_POST,'id_beneficiario', FILTER_DEFAULT);
        $tipo_discapacidad = filter_input(INPUT_POST,'tipo_discapacidad', FILTER_DEFAULT);
        $disc_especifica = filter_input(INPUT_POST,'disc_especifica', FILTER_DEFAULT);
        $diagnostico = filter_input(INPUT_POST,'diagnostico', FILTER_DEFAULT);
        $grado = filter_input(INPUT_POST,'grado', FILTER_DEFAULT);
        $medicamentos = filter_input(INPUT_POST,'medicamentos', FILTER_DEFAULT);
        $habilidades_funcionales = filter_input(INPUT_POST,'habilidades_funcionales', FILTER_DEFAULT);
        $requiere_asistencia = filter_input(INPUT_POST,'requiere_asistencia', FILTER_DEFAULT);
        $dispositivo_asistencia = filter_input(INPUT_POST,'dispositivo_asistencia', FILTER_DEFAULT);
        $carnet_discapacidad = filter_input(INPUT_POST,'carnet_discapacidad', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST,'observaciones', FILTER_DEFAULT);
        $recomendaciones = filter_input(INPUT_POST,'recomendaciones', FILTER_DEFAULT);
        $id_empleado = filter_input(INPUT_POST,'id_empleado', FILTER_DEFAULT);
        $id_servicios = 5;

        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'tipo_discapacidad' => $tipo_discapacidad,
            'disc_especifica' => $disc_especifica,
            'diagnostico' => $diagnostico,
            'grado' => $grado,
            'medicamentos' => $medicamentos,
            'habilidades_funcionales' => $habilidades_funcionales,
            'requiere_asistencia' => $requiere_asistencia,
            'dispositivo_asistencia' => $dispositivo_asistencia,
            'carnet_discapacidad' => $carnet_discapacidad,
            'observaciones' => $observaciones,
            'recomendaciones' => $recomendaciones,
            'id_empleado' => $id_empleado,
            'id_servicios' => $id_servicios
        ];

        foreach($datos as $atributo => $valor){
            if(empty($valor)){
                throw new Exception("El campo {$atributo} es obligatorio");
            }
        }

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('registrar_diagnostico');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        
        if($resultado['exito']){
           $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un diagnóstico de discapacidad con el beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Diagnóstico',
                'url' => 'diagnostico_discapacidad_consultar',
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

    } catch (Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function diagnostico_discapacidad_consultar(){
    $permisos = new PermisosModel();
    $modulo = 'Discapacidad';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/diagnosticos/discapacidad/discapacidad_consultar.php';
        
    } catch(Throwable $e){
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

function diagnostico_discapacidad_json(){
    $modelo = new DiscapacidadModel();
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

function diagnostico_discapacidad_detalle(){
    $modelo = new DiscapacidadModel();
    header('Content-Type: application/json');
    $id_discapacidad = $_GET['id_discapacidad'];
    $modelo->__set('id_discapacidad', $id_discapacidad);
    
    try {
        $data = $modelo->manejarAccion('discapacidad_detalle');
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

function discapacidad_actualizar(){
    $modelo = new DiscapacidadModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Discapacidad';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_discapacidad = filter_input(INPUT_POST,'id_discapacidad', FILTER_DEFAULT);
        $id_beneficiario = filter_input(INPUT_POST,'id_beneficiario', FILTER_DEFAULT);
        $tipo_discapacidad = filter_input(INPUT_POST,'tipo_discapacidad', FILTER_DEFAULT);
        $disc_especifica = filter_input(INPUT_POST,'disc_especifica', FILTER_DEFAULT);
        $diagnostico = filter_input(INPUT_POST,'diagnostico', FILTER_DEFAULT);
        $grado = filter_input(INPUT_POST,'grado', FILTER_DEFAULT);
        $medicamentos = filter_input(INPUT_POST,'medicamentos', FILTER_DEFAULT);
        $habilidades_funcionales = filter_input(INPUT_POST,'habilidades_funcionales', FILTER_DEFAULT);
        $requiere_asistencia = filter_input(INPUT_POST,'requiere_asistencia', FILTER_DEFAULT);
        $dispositivo_asistencia = filter_input(INPUT_POST,'dispositivo_asistencia', FILTER_DEFAULT);
        $carnet_discapacidad = filter_input(INPUT_POST,'carnet_discapacidad', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST,'observaciones', FILTER_DEFAULT);
        $recomendaciones = filter_input(INPUT_POST,'recomendaciones', FILTER_DEFAULT);
        
        $datos = [
            'id_discapacidad' => $id_discapacidad,
            'id_beneficiario' => $id_beneficiario,
            'tipo_discapacidad' => $tipo_discapacidad,
            'disc_especifica' => $disc_especifica,
            'diagnostico' => $diagnostico,
            'grado' => $grado,
            'medicamentos' => $medicamentos,
            'habilidades_funcionales' => $habilidades_funcionales,
            'requiere_asistencia' => $requiere_asistencia,
            'dispositivo_asistencia' => $dispositivo_asistencia,
            'carnet_discapacidad' => $carnet_discapacidad,
            'observaciones' => $observaciones,
            'recomendaciones' => $recomendaciones
        ];

        foreach($datos as $atributo => $valor){
            if(empty($valor)){
                throw new Exception("El campo {$atributo} es obligatorio");
            }
        }

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('actualizar_diagnostico');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        
        if($resultado['exito']){
           $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó un dato del diagnóstico de discapacidad del beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Diagnóstico',
                'url' => 'diagnostico_discapacidad_consultar',
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

    } catch (Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function discapacidad_eliminar(){
    $modelo = new DiscapacidadModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Discapacidad';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_discapacidad = filter_input(INPUT_POST,'id_discapacidad', FILTER_DEFAULT);
        $id_beneficiario = filter_input(INPUT_POST,'id_beneficiario', FILTER_DEFAULT);
        $id_solicitud_serv = filter_input(INPUT_POST,'id_solicitud_serv', FILTER_DEFAULT);

        $datos = [
            'id_discapacidad' => $id_discapacidad,
            'id_beneficiario' => $id_beneficiario,
            'id_solicitud_serv' => $id_solicitud_serv,
        ];

        foreach($datos as $atributo => $valor){
            if(empty($valor)){
                throw new Exception("El campo {$atributo} es obligatorio");
            }
        }

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        $resultado = $modelo->manejarAccion('eliminar_diagnostico');
        
        if($resultado['exito']){
           $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El Empleado {$_SESSION['nombre']} eliminó el diagnóstico de discapacidad del beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Eliminación de Diagnóstico',
                'url' => 'diagnostico_discapacidad_consultar',
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

    } catch (Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function stats_discapacidad_admin(){
    $modelo = new DiscapacidadModel();
    $estadisticas = $modelo->manejarAccion('stats_admin');
    
    header('Content-Type: application/json');
    echo json_encode($estadisticas);
}

function stats_discapacidad(){
    $modelo = new DiscapacidadModel();
    $modelo->__set('id_empleado', $_SESSION['id_empleado']);
    $estadisticas = $modelo->manejarAccion('stats_empleado');
    
    header('Content-Type: application/json');
    echo json_encode($estadisticas);
}