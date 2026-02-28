<?php
use App\Models\CitasModel;
use App\Models\BitacoraModel;
use App\Models\PermisosModel;
use App\Models\NotificacionesModel;

function crear_cita(){
    $permisos = new PermisosModel();
    $modelo = new CitasModel();
    $modulo = 'Citas';
    $modelo->__set('id_empleado', $_SESSION['id_empleado']);

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        // Obtener resultados
        $resultado_totales = $modelo->manejarAccion('citasTotales');
        $resultado_estadisticas = $modelo->manejarAccion('estadisticas');
        
        // Inicializar variables con valores por defecto
        $citas_totales = 0;
        $citas_pendientes = 0;
        $citas_rechazadas = 0;
        $citas_atendidas = 0;
        
        // Procesar totales
        if($resultado_totales['exito']){
            $citas_totales = $resultado_totales['total'];  // ← Número directo
        } else {
            error_log("Error en citasTotales: " . $resultado_totales['mensaje']);
        }
        
        // Procesar estadísticas
        if($resultado_estadisticas['exito']){
            $datos = $resultado_estadisticas['data'];  // ← Array con todos los datos
            
            $citas_pendientes = $datos['pendientes'] ?? 0;
            $citas_rechazadas = $datos['rechazadas'] ?? 0;
            $citas_atendidas = $datos['atendidas'] ?? 0;
            
            // También puedes usar el total de aquí si prefieres
            // $citas_totales = $datos['total'] ?? 0;
        } else {
            error_log("Error en estadisticas: " . $resultado_estadisticas['mensaje']);
        }
        
        // Pasar variables a la vista
        require_once BASE_PATH . '/app/Views/citas/crear_cita.php';

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

function cita_registrar(){
    $modelo = new CitasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Citas';

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
        $fecha = filter_input(INPUT_POST, 'fecha', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $hora = filter_input(INPUT_POST, 'hora', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if(!$id_beneficiario || !$id_empleado || !$fecha || !$hora){
            throw new Exception('Todos los campos son obligatorios');
        }

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
            throw new Exception('Formato de fecha inválido. Use YYYY-MM-DD');
        }

        // Validar formato de hora (HH:MM:SS o HH:MM)
        if (!preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $hora)) {
            throw new Exception('Formato de hora inválido. Use HH:MM:SS o HH:MM');
        }


        $modelo->__set('id_beneficiario', $id_beneficiario);
        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('fecha', $fecha);
        $modelo->__set('hora', $hora);
        $modelo->__set('estatus', 1);

        $registro = $modelo->manejarAccion('registrar_cita');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario_cita');
        $empleado = $modelo->manejarAccion('obtener_empleado_cita');

        if($registro['exito'] === true){
            if($_SESSION['tipo_empleado'] === 'Administrador'){
                $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Administrador {$_SESSION['nombre']} registro una cita al empleado: {$empleado['nombre_completo']} con el beneficiario: $beneficiario"
                ];
                foreach($bitacora_data as $atributo => $valor){
                    $bitacora->__set($atributo, $valor);
                }
                $bitacora->manejarAccion('registrar_bitacora');
            } else{
                $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro una cita con el beneficiario $beneficiario"
                ];  
                foreach($bitacora_data as $atributo => $valor){
                    $bitacora->__set($atributo, $valor);
                }
                $bitacora->manejarAccion('registrar_bitacora');
            }

            $notificacion_data = [
                'titulo' => 'Registro de Cita',
                'url' => 'consultar_citas',
                'tipo' => 'cita',
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

function consultar_citas(){
    $permisos = new PermisosModel();
    $modulo = 'Citas';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/citas/consultar_citas.php';
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
//mostrar citas
function citas_data_json(){
    $modelo = new CitasModel();
    header('Content-Type: application/json');
    
    try {
        // Esto devuelve: ['exito' => true/false, 'data' => array, 'mensaje' => string]
        $resultado = $modelo->manejarAccion('consultar_citas');
        
        // Verificar si hubo error en el modelo
        if (!$resultado['exito']) {
            echo json_encode([
                'exito' => false,
                'mensaje' => $resultado['mensaje'] ?? 'Error al obtener citas',
                'data' => []
            ]);
            exit();
        }
        
        // Éxito: devolver estructura correcta para DataTable
        echo json_encode([
            'exito' => true,
            'mensaje' => $resultado['mensaje'] ?? '',
            'data' => $resultado['data'] ?? []
        ]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en citas_data_json: " . $e->getMessage());
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error interno del servidor: ' . $e->getMessage(),
            'data' => []
        ]);
        exit();
    }
}
//datos individuales para el modal de ver
function cita_detalle(){
    $modelo = new CitasModel();
    $id_cita = $_GET['id_cita'];
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('id_cita', $id_cita);
        $citas = $modelo->manejarAccion('cita_detalle');
        echo json_encode(['data' => $citas]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en cita_detalle: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar la cita'
        ]);
        exit();
    }
}
//datos individuales para el modal de editar
function cita_detalle_editar(){
    $modelo = new CitasModel();
    $id_cita = $_GET['id_cita'];
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('id_cita', $id_cita);
        $citas = $modelo->manejarAccion('cita_detalle_editar');
        echo json_encode(['data' => $citas]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en cita_detalle_editar: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar la cita'
        ]);
        exit();
    }
}
//validación para saber que dias trabaja un psicologo
function validar_fecha_cita(){
    $modelo = new CitasModel();
    header('Content-Type: application/json; charset=utf-8');

    try {
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $dia_semana  = isset($_POST['dia_semana']) ? trim($_POST['dia_semana']) : null;

        // Validación correcta de parámetros
        if (!$id_empleado || !$dia_semana) {
            throw new Exception("Todos los campos son obligatorios");
        }

        // Normalizar algunos inputs: aceptar "Miercoles" -> "Miércoles"
        $mapNormals = [
            'miercoles' => 'Miércoles',
            'sabado'    => 'Sábado',
            'domingo'   => 'Domingo'
            // añade si quieres más mapeos
        ];
        $key = mb_strtolower($dia_semana, 'UTF-8');
        if (isset($mapNormals[$key])) $dia_semana = $mapNormals[$key];

        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('dia_semana', $dia_semana);

        // llamar al modelo (devuelve ['exito'=>..., 'existe'=>..., 'mensaje'=>...])
        $resp = $modelo->manejarAccion('verificar_dia_psicologo');

        echo json_encode($resp);
        exit();

    } catch(Throwable $e) {
        error_log("Error en validar_fecha_cita: " . $e->getMessage());
        echo json_encode([
            'exito' => false,
            'existe' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}
//validacion de la hora de la cita
function validar_hora_cita() {
    $modelo = new CitasModel();
    header('Content-Type: application/json; charset=utf-8');

    try {
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $hora = isset($_POST['hora']) ? trim($_POST['hora']) : null;
        $dia_semana = isset($_POST['dia_semana']) ? trim($_POST['dia_semana']) : null;
        $fecha = isset($_POST['fecha']) ? trim($_POST['fecha']) : null;

        if (!$id_empleado || !$hora || !$dia_semana) {
            throw new Exception('Todos los datos son obligatorios');
        }

        if (!preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $hora)) {
            throw new Exception('Formato de hora inválido');
        }

        // Normalizar acentos sencillos
        $mapNormals = [
            'miercoles' => 'Miércoles',
            'sabado'    => 'Sábado',
            'domingo'   => 'Domingo'
        ];
        $key = mb_strtolower($dia_semana, 'UTF-8');
        if (isset($mapNormals[$key])) $dia_semana = $mapNormals[$key];

        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('hora', $hora);
        $modelo->__set('dia_semana', $dia_semana);
        $modelo->__set('fecha', $fecha);

        // 1) verificar si la hora cabe en el horario
        $resultadoRango = $modelo->manejarAccion('verificar_hora_en_rango');
        if (!is_array($resultadoRango) || empty($resultadoRango['exito'])) {
            echo json_encode($resultadoRango);
            return;
        }
        if (empty($resultadoRango['en_rango'])) {
            echo json_encode([
                'exito' => true,
                'mensaje' => $resultadoRango['mensaje'] ?? 'La hora no está dentro del horario del psicólogo',
                'existe' => false,
                'disponible' => false
            ]);
            return;
        }

        // 2) verificar disponibilidad frente a citas existentes
        $resultadoDisponibilidad = $modelo->manejarAccion('verificar_disponibilidad_hora');
        if (!is_array($resultadoDisponibilidad) || empty($resultadoDisponibilidad['exito'])) {
            echo json_encode($resultadoDisponibilidad);
            return;
        }
        if (empty($resultadoDisponibilidad['disponible'])) {
            echo json_encode([
                'exito' => true,
                'mensaje' => $resultadoDisponibilidad['mensaje'] ?? 'La hora ya está ocupada',
                'existe' => true,
                'disponible' => false
            ]);
            return;
        }

        echo json_encode([
            'exito' => true,
            'mensaje' => 'Hora disponible',
            'existe' => true,
            'disponible' => true
        ]);
        return;

    } catch(Throwable $e) {
        error_log("Error en validar_hora_cita: " . $e->getMessage());
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error interno del servidor',
            'existe' => false,
            'disponible' => false
        ]);
    }
}

function actualizar_cita(){
    $modelo = new CitasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = "Citas";

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

        // Sanitizar entrada (IMPORTANTE: incluir id_cita)
        $id_cita     = filter_input(INPUT_POST, 'id_cita', FILTER_SANITIZE_NUMBER_INT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $fecha       = $_POST['fecha'] ?? null;
        $hora        = $_POST['hora'] ?? null;
        $id_beneficiario = filter_input(INPUT_POST,'id_beneficiario', FILTER_SANITIZE_NUMBER_INT);

        if (!$id_cita) {
            throw new Exception('ID de cita faltante.');
        }

        $modelo->__set('id_cita', $id_cita);
        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('fecha', $fecha);
        $modelo->__set('hora', $hora);
        $modelo->__set('id_beneficiario', $id_beneficiario);

        $actualizacion = $modelo->manejarAccion('actualizar_cita');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario_cita');
        $empleado = $modelo->manejarAccion('obtener_empleado_cita');
        

        if(!empty($actualizacion['exito'])){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El empleado {$_SESSION['nombre']} actualizó la cita de la fecha {$fecha} del empleado {$empleado['nombre_completo']} con el beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Cita',
                'url' => 'consultar_citas',
                'tipo' => 'cita',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1,
                'leido' => 0
            ];
            foreach($notificacion_data as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $actualizacion['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($actualizacion['mensaje'] ?? 'Error actualizando cita');
        }

    } catch(Throwable $e){
        error_log("actualizar_cita error: ". $e->getMessage());
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function eliminar_cita(){
    $modelo = new CitasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = "Citas";

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

        $id_cita = filter_input(INPUT_POST, 'id_cita', FILTER_SANITIZE_NUMBER_INT);
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);
        if (empty($id_beneficiario) || empty($id_cita)) {
            throw new Exception('Faltan datos para eliminar la cita.');
        }

        $modelo->__set('id_cita', $id_cita);
        $modelo->__set('id_beneficiario', $id_beneficiario);
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario_cita');
        $eliminacion = $modelo->manejarAccion('eliminar_cita');

        if(!empty($eliminacion['exito'])){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El empleado {$_SESSION['nombre']} eliminó la cita del beneficiario {$beneficiario}"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Eliminación de Cita',
                'url' => 'consultar_citas',
                'tipo' => 'cita',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1,
                'leido' => 0
            ];
            foreach($notificacion_data as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $eliminacion['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($eliminacion['mensaje'] ?? 'Error eliminando cita');
        }

    } catch(Throwable $e){
        error_log("eliminar_cita error: ". $e->getMessage());
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function obtener_estados_cita(){
    $modelo = new CitasModel();

    try{
        $id_cita = filter_input(INPUT_POST, 'id_cita', FILTER_SANITIZE_NUMBER_INT);
        if(!$id_cita){
            throw new Exception('ID de cita inválido');
        }

        $modelo->__set('id_cita', $id_cita);

        $data = $modelo->manejarAccion('obtener_estados_cita');

        echo json_encode([
            'exito' => true,
            'id_cita' => $id_cita,
            'estado_actual' => $data['estado_actual'],
            'estados' => $data['estados']
        ]);
        exit;

    } catch(Throwable $e){
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
        exit;
    }
}

function actualizar_estado_cita(){
    $modelo = new CitasModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();

    try{
        $verificar = [
            'Modulo' => 'Citas',
            'Permiso' => 'Editar',
            'Rol' => $_SESSION['id_tipo_empleado']
        ];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }
        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para cambiar el estado');
        }

        $id_cita = filter_input(INPUT_POST, 'id_cita', FILTER_SANITIZE_NUMBER_INT);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_NUMBER_INT);
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);

        $modelo->__set('id_cita', $id_cita);
        $modelo->__set('estatus', $estatus);
        $modelo->__set('id_beneficiario', $id_beneficiario);

        $beneficiario = $modelo->manejarAccion('obtener_beneficiario_cita');
        $resp = $modelo->manejarAccion('actualizar_estado_cita');
        $estado_cita = $modelo->manejarAccion('obtener_estatus');

        if($resp['exito'] === true){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Citas',
                'accion' => 'Actualización',
                'descripcion' => "El empleado {$_SESSION['nombre']} actualizó el estado de la cita del beneficiario: {$beneficiario} a {$estado_cita}"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
        }

        echo json_encode($resp);
        exit;

    } catch(Throwable $e){
        echo json_encode(['exito'=>false,'mensaje'=>$e->getMessage()]);
        exit;
    }
}

function citas_calendario_json(){
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $modelo = new CitasModel();
    header('Content-Type: application/json; charset=utf-8');
    
    try {
        // Pasar el contexto del usuario (ID y Rol) para el filtrado en el modelo
        $modelo->__set('id_empleado', $_SESSION['id_empleado'] ?? null);
        $modelo->__set('tipo_empleado', $_SESSION['tipo_empleado'] ?? '');

        $citas = $modelo->manejarAccion('obtener_citas_calendario');
        
        echo json_encode([
            'exito' => true,
            'data' => $citas ?: [] // Asegurar que sea al menos un array vacío
        ], JSON_UNESCAPED_UNICODE);
        exit;
    } catch(Throwable $e) {
        error_log("Error en citas_calendario_json: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}



