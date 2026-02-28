<?php
use App\Models\HorarioModel;
use App\Models\BitacoraModel;
use App\Models\PermisosModel;
use App\Models\NotificacionesModel;

function crear_horario(){
    $permisos = new PermisosModel();
    $modulo = 'Horarios';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        
        require_once BASE_PATH . '/app/Views/horario/crear_horario.php';
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

function validar_dia_horario() {
    $modelo = new HorarioModel();
    header('Content-Type: application/json');
    
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido.');
        }
        
        $id_empleado = $_POST['id_empleado'] ?? null;
        $dia_semana = $_POST['dia_semana'] ?? null;
        $id_horario = $_POST['id_horario'] ?? null;
        
        if (!$id_empleado || !$dia_semana) {
            echo json_encode(['existe' => false, 'error' => 'Datos incompletos']);
            exit();
        }
        
        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('dia_semana', $dia_semana);
        $modelo->__set('id_horario', $id_horario);
        
        $existe = $modelo->manejarAccion('validarDiaHorario');
        
        echo json_encode(['existe' => $existe]);
        exit();
        
    } catch(Throwable $e) {
        error_log("Error en validar_dia_horario: " . $e->getMessage());
        echo json_encode([
            'existe' => false,
            'error' => 'Error al validar el día del horario'
        ]);
        exit();
    }
}

function registrar_horario(){
    try{
        $modelo = new HorarioModel();
        $bitacora = new BitacoraModel();
        $permisos = new PermisosModel();
        $notificacion = new NotificacionesModel();
        $modulo = 'Horarios';

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

        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $dia_semana = $_POST['dia_semana'] ?? null;
        $hora_inicio = filter_input(INPUT_POST, 'hora_inicio', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $hora_fin = filter_input(INPUT_POST, 'hora_fin', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $empleado = $_SESSION['nombre'];

        if(!$id_empleado || !$dia_semana || !$hora_inicio || !$hora_fin){
            throw new Exception('Todos los campos son obligatorios');
        }

        $datos = [
            'id_empleado' => $id_empleado,
            'dia_semana' => $dia_semana,
            'hora_inicio' => $hora_inicio,
            'hora_fin' => $hora_fin
        ];
        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $registro = $modelo->manejarAccion('registrar_horario');
        $empleado_data = $modelo->manejarAccion('obtener_empleado_horario');

        if ($registro['exito'] === true) {
            // Construir nombre completo
            $nombre_empleado = '';
            if (is_array($empleado_data) && isset($empleado_data['nombre'], $empleado_data['apellido'])) {
                $nombre_empleado = $empleado_data['nombre'] . ' ' . $empleado_data['apellido'];
            }

            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El empleado $empleado registró un horario para el empleado $nombre_empleado"
            ];

            foreach ($bitacora_data as $atributo => $valor) {
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            // Notificación
            $notificacion_data = [
                'titulo' => 'Registro de Horario',
                'url' => 'consultar_horarios',
                'tipo' => 'horario',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, //Administrador
                'leido' => 0
            ];
            foreach ($notificacion_data as $atributo => $valor) {
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else{
            throw new Exception($registro['mensaje']);
        }

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function consultar_horarios(){
    $permisos = new PermisosModel();
    $modulo = 'Horarios';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        
        require_once BASE_PATH . '/app/Views/horario/consultar_horarios.php';
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

function horarios_data_json(){
    $modelo = new HorarioModel();
    header('Content-Type: application/json');
    try {

        $horarios = $modelo->manejarAccion('consultar_horarios');
        echo json_encode(['data' => $horarios]);
        exit();
    } catch(Throwable $e) {
        error_log("Error en horarios_data_json: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar los horarios'
        ]);
        exit();
    }
}

function horario_detalle_editar(){
    $modelo = new HorarioModel();
    $id_horario = $_GET['id_horario'];
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('id_horario', $id_horario);
        $horarios = $modelo->manejarAccion('horario_detalle_editar');
        echo json_encode(['data' => $horarios]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en horario_detalle_editar: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar el horario'
        ]);
        exit();
    }
}

function actualizar_horario(){
    $modelo = new HorarioModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Horarios';

    try {
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

        $id_horario = filter_input(INPUT_POST, 'id_horario', FILTER_SANITIZE_NUMBER_INT);
        $dia_semana = $_POST['dia_semana'] ?? null;
        $hora_inicio = filter_input(INPUT_POST, 'hora_inicio', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $hora_fin = filter_input(INPUT_POST, 'hora_fin', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $empleado = $_SESSION['nombre'];

        if(!$id_horario || !$dia_semana || !$hora_inicio || !$hora_fin){
            throw new Exception('Todos los campos son obligatorios');
        }

        $datos = [
            'id_horario' => $id_horario,
            'dia_semana' => $dia_semana,
            'hora_inicio' => $hora_inicio,
            'hora_fin' => $hora_fin
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $actualizar = $modelo->manejarAccion('actualizar_horario');
        $nombre_empleado = $modelo->manejarAccion('obtener_empleado_horario');

        if($actualizar['exito'] === true){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El empleado $empleado actualizó un horario para el empleado $nombre_empleado"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Horario',
                'url' => 'consultar_horarios',
                'tipo' => 'horario',
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
                'mensaje' => $actualizar['mensaje']
            ]);
            exit();
        } else{
            throw new Exception($actualizar['mensaje']);
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }   
}

function eliminar_horario(){
    $modelo = new HorarioModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Horarios';

    try {
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

        $id_horario = filter_input(INPUT_POST, 'id_horario', FILTER_SANITIZE_NUMBER_INT);
        $empleado = $_SESSION['nombre'];

        if(!$id_horario){
            throw new Exception('Todos los campos son obligatorios');
        }

        $modelo->__set('id_horario', $id_horario);
        $eliminar = $modelo->manejarAccion('eliminar_horario');
        $nombre_empleado = $modelo->manejarAccion('obtener_empleado_horario');

        if($eliminar['exito'] === true){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El empleado $empleado eliminó un horario para el empleado $nombre_empleado"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Eliminación de Horario',
                'url' => 'consultar_horarios',
                'tipo' => 'horario',
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
                'mensaje' => $eliminar['mensaje']
            ]);
            exit();
        } else{
            throw new Exception($eliminar['mensaje']);
        }
    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }   
}
function horarios_calendario_json() {
    $modelo = new HorarioModel();
    header('Content-Type: application/json');
    
    try {
        // Usar la misma consulta que tenías
        $horarios = $modelo->manejarAccion('consultar_horarios');
        
        // Verificar si es un array o tiene estructura de error
        if (isset($horarios['exito']) && !$horarios['exito']) {
            echo json_encode([
                'exito' => false,
                'mensaje' => $horarios['mensaje']
            ]);
            return;
        }
        
        // Asegurarnos de que sea un array
        $data = is_array($horarios) ? $horarios : ($horarios['data'] ?? []);
        
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Horarios cargados para calendario',
            'data' => $data
        ]);
        
    } catch(Throwable $e) {
        error_log("Error en horarios_calendario_json: " . $e->getMessage());
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error al cargar horarios para calendario'
        ]);
    }
}