<?php

use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;
use App\Models\PermisosModel;
use App\Models\PsicologiaModel;

function diagnostico_psicologia(){
    $modelo = new PsicologiaModel();
    $permisos = new PermisosModel();
    $modulo = 'Psicologia';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $patologias = $modelo->manejarAccion('obtener_patologias');
        require_once BASE_PATH . '/app/Views/diagnosticos/psicologia/diagnostico_psicologia.php';

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

function registrar_diagnostico_psicologia(){
    $modelo = new PsicologiaModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = "Psicologia";

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

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_SANITIZE_NUMBER_INT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $tipo_consulta = filter_input(INPUT_POST, 'tipo_consulta', FILTER_DEFAULT);
        $id_patologia = filter_input(INPUT_POST, 'id_patologia', FILTER_SANITIZE_NUMBER_INT);
        $diagnostico = filter_input(INPUT_POST, 'diagnostico', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT);
        $tratamiento_gen = filter_input(INPUT_POST, 'tratamiento_gen', FILTER_DEFAULT);
        $id_servicios = 1;

        // Valores por defecto para campos que no aplican a este tipo de consulta
        $motivo_retiro = "No aplica";
        $duracion_retiro = "No aplica";
        $motivo_cambio = "No aplica";

        // Enviar datos al modelo
        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_empleado' => $id_empleado,
            'tipo_consulta' => $tipo_consulta,
            'id_patologia' => $id_patologia,
            'diagnostico' => $diagnostico,
            'observaciones' => $observaciones,
            'tratamiento_gen' => $tratamiento_gen,
            'motivo_retiro' => $motivo_retiro,
            'duracion_retiro' => $duracion_retiro,
            'motivo_cambio' => $motivo_cambio,
            'id_servicios' => $id_servicios
        ];

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
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un diagnóstico psicológico con el beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Diagnóstico',
                'url' => 'consultar_citas',
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
    }
}

function registrar_retiro_temporal(){
    $modelo = new PsicologiaModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = "Psicologia";

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

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_SANITIZE_NUMBER_INT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $tipo_consulta = filter_input(INPUT_POST, 'tipo_consulta', FILTER_DEFAULT);
        $motivo_retiro = filter_input(INPUT_POST, 'motivo_retiro', FILTER_DEFAULT);
        $duracion_retiro = filter_input(INPUT_POST, 'duracion_retiro', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones_retiro', FILTER_DEFAULT);
        $id_servicios = 1;

        // Valores por defecto para campos que no aplican a este tipo de consulta
        $motivo_cambio = "No aplica";
        $diagnostico = "No aplica";
        $tratamiento_gen = "No aplica";
        $id_patologia = 2;

        // Enviar datos al modelo
        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_empleado' => $id_empleado,
            'tipo_consulta' => $tipo_consulta,
            'id_patologia' => $id_patologia,
            'diagnostico' => $diagnostico,
            'observaciones' => $observaciones,
            'tratamiento_gen' => $tratamiento_gen,
            'motivo_retiro' => $motivo_retiro,
            'duracion_retiro' => $duracion_retiro,
            'motivo_cambio' => $motivo_cambio,
            'id_servicios' => $id_servicios
        ];

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
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un retiro temporal al beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Retiro Temporal',
                'url' => 'consultar_citas',
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
    }
}

function registrar_cambio_carrera(){
    $modelo = new PsicologiaModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = "Psicologia";

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

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_SANITIZE_NUMBER_INT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $tipo_consulta = filter_input(INPUT_POST, 'tipo_consulta', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones_cambio', FILTER_DEFAULT);
        $motivo_cambio = filter_input(INPUT_POST, 'motivo_cambio', FILTER_DEFAULT);
        $id_servicios = 1;

        // Valores por defecto para campos que no aplican a este tipo de consulta
        $diagnostico = "No aplica";
        $tratamiento_gen = "No aplica";
        $motivo_retiro = "No aplica";
        $duracion_retiro = "No aplica";
        $id_patologia = 2;

        // Enviar datos al modelo
        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_empleado' => $id_empleado,
            'tipo_consulta' => $tipo_consulta,
            'id_patologia' => $id_patologia,
            'diagnostico' => $diagnostico,
            'observaciones' => $observaciones,
            'tratamiento_gen' => $tratamiento_gen,
            'motivo_retiro' => $motivo_retiro,
            'duracion_retiro' => $duracion_retiro,
            'motivo_cambio' => $motivo_cambio,
            'id_servicios' => $id_servicios
        ];

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
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un cambio de carrera al beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Cambio de Carrera',
                'url' => 'consultar_citas',
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
    }
}

function consultar_diagnostico_psicologia(){
    $permisos = new PermisosModel();
    $modulo = 'Psicologia';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/diagnosticos/psicologia/consultar_diagnostico.php';
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

function diagnosticos_data_json(){
    $modelo = new PsicologiaModel();
    header('Content-Type: application/json');

    $es_admin = $_SESSION['tipo_empleado'] == 'Administrador';
    if(!$es_admin){
        $modelo->__set('id_empleado', $_SESSION['id_empleado']);
    }else{
        $modelo->__set('es_admin', true);
    }
    
    try {
        $diagnosticos = $modelo->manejarAccion('obtener_diagnosticos');
        echo json_encode(['data' => $diagnosticos]);
        exit();

    } catch(Throwable $e) {
        error_log("Error al obtener los diagnosticos: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar los diagnosticos'
        ]);
        exit();
    }
}

function diagnostico_detalle(){
    $modelo = new PsicologiaModel();
    $id_psicologia = $_GET['id_psicologia'];
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('id_psicologia', $id_psicologia);
        $diagnostico = $modelo->manejarAccion('diagnostico_detalle');
        echo json_encode(['data' => $diagnostico]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en diagnostico_detalle: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar el diagnostico'
        ]);
        exit();
    }
}

function obtener_patologias_json(){
    $modelo = new PsicologiaModel();
    header('Content-Type: application/json');
    
    try {
        $patologias = $modelo->manejarAccion('obtener_patologias');
        echo json_encode(['data' => $patologias]);
        exit();
    } catch(Throwable $e) {
        error_log("Error al obtener las patologias: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar las patologias'
        ]);
        exit();
    }
}

function actualizar_diagnostico_psicologia(){
    $modelo = new PsicologiaModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Psicologia';

    try{
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            throw new Exception('Método no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        // Campos comunes
        $id_psicologia = filter_input(INPUT_POST, 'id_psicologia', FILTER_SANITIZE_NUMBER_INT);
        $tipo_consulta = filter_input(INPUT_POST, 'tipo_consulta', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT);

        // Inicializar datos con valores por defecto
        $datos = [
            'id_psicologia' => $id_psicologia,
            'tipo_consulta' => $tipo_consulta,
            'observaciones' => $observaciones,
            'diagnostico' => 'No aplica',
            'tratamiento_gen' => 'No aplica',
            'motivo_retiro' => 'No aplica',
            'duracion_retiro' => 'No aplica',
            'motivo_cambio' => 'No aplica',
            'id_patologia' => null
        ];

        // Filtrar campos según el tipo de consulta
        switch($tipo_consulta){
            case 'Diagnóstico':
                $datos['id_patologia'] = filter_input(INPUT_POST, 'id_patologia', FILTER_SANITIZE_NUMBER_INT);
                $datos['diagnostico'] = filter_input(INPUT_POST, 'diagnostico', FILTER_DEFAULT);
                $datos['tratamiento_gen'] = filter_input(INPUT_POST, 'tratamiento_gen', FILTER_DEFAULT) ?: 'No especificado';
                break;

            case 'Retiro temporal':
                $datos['motivo_retiro'] = filter_input(INPUT_POST, 'motivo_retiro', FILTER_DEFAULT);
                $datos['duracion_retiro'] = filter_input(INPUT_POST, 'duracion_retiro', FILTER_DEFAULT);
                break;

            case 'Cambio de carrera':
                $datos['motivo_cambio'] = filter_input(INPUT_POST, 'motivo_cambio', FILTER_DEFAULT);
                break;

            default:
                throw new Exception('Tipo de consulta no válido');
        }

        // Enviar datos al modelo
        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('actualizar_diagnostico');

        if($resultado['exito']){
            // Registrar en bitácora
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó un diagnóstico de tipo {$tipo_consulta}"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            // Crear notificación
            $notificacion_data = [
                'titulo' => 'Actualización de Diagnóstico',
                'url' => 'diagnostico_psicologia_consultar',
                'tipo' => 'diagnostico',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, // Administrador
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
    }
}

function eliminar_diagnostico(){
    $modelo = new PsicologiaModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Psicologia';

    try{
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            throw new Exception('Método no permitido');
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_psicologia = filter_input(INPUT_POST, 'id_psicologia', FILTER_SANITIZE_NUMBER_INT);
        $id_solicitud_serv = filter_input(INPUT_POST, 'id_solicitud_serv', FILTER_SANITIZE_NUMBER_INT);
        
        $modelo->__set('id_psicologia', $id_psicologia);
        $modelo->__set('id_solicitud_serv', $id_solicitud_serv);
        
        $resultado = $modelo->manejarAccion('eliminar_diagnostico');

        if($resultado['exito']){
            // Registrar en bitácora
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El Empleado {$_SESSION['nombre']} eliminó un diagnóstico"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            // Crear notificación
            $notificacion_data = [
                'titulo' => 'Eliminación de Diagnóstico',
                'url' => 'diagnostico_psicologia_consultar',
                'tipo' => 'diagnostico',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, // Administrador
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
    }
}


//Estadisticas AJAX (JSON)
function get_stats_psicologia_json(){
    session_start_if_not_started();
    
    // Solo permitir si el usuario tiene una sesión activa
    if (!isset($_SESSION['id_empleado'])) {
        header('Content-Type: application/json');
        echo json_encode(['exito' => false, 'mensaje' => 'Sesión no iniciada']);
        return;
    }

    $id_empleado = $_SESSION['id_empleado'];
    $modelo = new PsicologiaModel();
    $modelo->__set('id_empleado', $id_empleado);
    
    $resultado = $modelo->manejarAccion('obtener_estadisticas');

    header('Content-Type: application/json');
    echo json_encode($resultado);
}

function session_start_if_not_started() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}