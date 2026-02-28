<?php 
use App\Models\EmpleadoModel;
use App\Models\BitacoraModel;
use App\Models\PermisosModel;
use App\Models\NotificacionesModel;

function showView(){
    $permisos = new PermisosModel();
    $modelo = new EmpleadoModel();
    $modulo = 'Empleados';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $tipos_empleado = $modelo->manejarAccion('vista');
        $empleados_act = $modelo->manejarAccion('empleadosActivos');
        $empleados_inact = $modelo->manejarAccion('empleadosInact');
        $total_empleados = $modelo->manejarAccion('empleadosTotales');
        $empleados_nuevos_mes = $modelo->manejarAccion('empleadosNuevos');

        require_once BASE_PATH . '/app/Views/empleado/crear_empleado.php';

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

function showList(){
    $permisos = new PermisosModel();
    $modelo = new EmpleadoModel();
    $modulo = 'Empleados';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $empleados = $modelo->manejarAccion('empleadosTotales');

        require_once BASE_PATH . '/app/Views/empleado/consultar_empleados.php';

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

function validar_cedula() {
    $modelo = new EmpleadoModel();
    header('Content-Type: application/json');

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido.');
        }

        // Sanitizar entradas
        $tipo_cedula = $_POST['tipo_cedula'] ?? '';
        $cedula      = $_POST['cedula'] ?? '';
        $id_empleado = $_POST['id_empleado'] ?? null;
        $id_beneficiario = $_POST['id_beneficiario'] ?? null;
        $id_proveedor = $_POST['id_proveedor'] ?? null;

        if ($tipo_cedula === '' || $cedula === '') {
            echo json_encode(['existe' => false, 'error' => 'Datos incompletos']);
            exit();
        }

        $valores = [
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'id_empleado' => $id_empleado,
            'id_beneficiario' => $id_beneficiario,
            'id_proveedor' => $id_proveedor
        ];

        foreach($valores as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        // Llamada directa al método del modelo
        $existe = $modelo->manejarAccion('validarCedula');

        echo json_encode(['existe' => $existe]);
        exit();

    } catch (Throwable $e) {
        error_log("Error en validar_cedula: " . $e->getMessage());
        echo json_encode(['existe' => false, 'error' => 'Error interno']);
        exit();
    }
}

function validar_correo(){
    $modelo = new EmpleadoModel();
    header('Content-Type: application/json');

    try{
        if($_SERVER['REQUEST_METHOD'] !== 'POST' ){
            throw new Exception('Metodo no permitido.');
        }

        $correo = $_POST['correo'];
        $id_empleado = $_POST['id_empleado'] ?? null;
        $id_beneficiario = $_POST['id_beneficiario'] ?? null;
        $id_proveedor = $_POST['id_proveedor'] ?? null;

        $datos = [
            'correo' => $correo,
            'id_empleado' => $id_empleado,
            'id_beneficiario' => $id_beneficiario,
            'id_proveedor' => $id_proveedor
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $existe = $modelo->manejarAccion('validarCorreo');
        echo json_encode(['existe' => $existe]);
        exit();

    } catch(Throwable $e){
        error_log("Error en validar_correo: " . $e->getMessage());
        echo json_encode(['existe' => false, 'error' => 'Error interno']);
        exit();
    }
}

function validar_telefono(){
    $modelo = new EmpleadoModel();
    header('Content-Type: application/json');
    try{
        if($_SERVER['REQUEST_METHOD'] !== 'POST' ){
            throw new Exception('Metodo no permitido.');
        }

        $telefono = $_POST['telefono'];
        $id_empleado = $_POST['id_empleado'] ?? null;
        $id_beneficiario = $_POST['id_beneficiario'] ?? null;
        $id_proveedor = $_POST['id_proveedor'] ?? null;

        $valores = [
            'telefono' => $telefono,
            'id_empleado' => $id_empleado,
            'id_beneficiario' => $id_beneficiario,
            'id_proveedor' => $id_proveedor
        ];

        foreach($valores as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $existe = $modelo->manejarAccion('validarTelefono');
        echo json_encode(['existe' => $existe]);
        exit();

    } catch(Throwable $e){
        error_log("Error: " . $e->getMessage());
        echo json_encode(['existe' => false, 'error' => 'Error interno']);
        exit();
    }
}

function empleado_registrar(){
    $modelo = new EmpleadoModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Empleados';

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

        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $apellido = filter_input(INPUT_POST, 'apellido', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo_cedula = filter_input(INPUT_POST, 'tipo_cedula', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $cedula = filter_input(INPUT_POST, 'cedula', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL); 
        $telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_tipo_empleado = filter_input(INPUT_POST, 'id_tipo_empleado', FILTER_SANITIZE_NUMBER_INT);
        $fecha_nacimiento = filter_input(INPUT_POST, 'fecha_nacimiento', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $direccion = filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $clave = filter_input(INPUT_POST, 'clave', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if(empty($nombre) || empty($apellido) || empty($tipo_cedula) || empty($cedula) || empty($correo) || empty($telefono) || empty($id_tipo_empleado) || empty($fecha_nacimiento) || empty($direccion) || empty($clave) || empty($estatus)){
            throw new Exception('Todos los campos son obligatorios');
        }

        $claveHash = password_hash($clave, PASSWORD_DEFAULT);
        $datos = [
            'nombre' => $nombre,
            'apellido' => $apellido,
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'correo' => $correo,
            'telefono' => $telefono,
            'id_tipo_empleado' => $id_tipo_empleado,
            'fecha_nacimiento' => $fecha_nacimiento,
            'direccion' => $direccion,
            'clave' => $claveHash,
            'estatus' => $estatus
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $registro = $modelo->manejarAccion('registrar_empleado');
        if($registro['exito'] === true){
            //Registramos en la bitácora el registro
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El empleado {$_SESSION['nombre']} registró el empleado: $nombre $apellido ($tipo_cedula-$cedula)"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            
            $registro_bit = $bitacora->manejarAccion('registrar_bitacora');
            if($registro_bit['exito'] !== true){
                error_log("Error al registrar en la bitácora: " . $registro_bit['mensaje']);
            }

            $notificacion_data = [
                'titulo' => 'Registro de Empleado',
                'url' => 'consultar_empleados',
                'tipo' => 'empleado',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, //Administrador
                'leido' => 0
            ];

            foreach($notificacion_data as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if(!$noti_resultado['exito']){
                error_log("Error al registrar la notificación: " . ($noti_resultado['mensaje'] ?? 'Error desconocido'));
            }

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else{
            throw new Exception($registro['mensaje']);
        }

    } catch (Throwable $e){
        echo json_encode([
            'exito' => false,
            'error' => $e->getMessage()
        ]);
        exit();
    }
}

function consultar_empleados(){
    $modelo = new EmpleadoModel();
    header('Content-Type: application/json');
    
    try {
        $empleados = $modelo->manejarAccion('empleados_listar');
        echo json_encode(['data' => $empleados]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en consultar_empleados: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar los empleados'
        ]);
        exit();
    }
}

function empleado_detalle(){
    $modelo = new EmpleadoModel();
    $id_empleado = $_GET['id_empleado'];
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('id_empleado', $id_empleado);
        $empleados = $modelo->manejarAccion('empleado_detalle');
        echo json_encode(['data' => $empleados]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en empleado_detalle: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar el empleado'
        ]);
        exit();
    }
}

function psicologos_data_json(){
    $modelo = new EmpleadoModel();
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('tipo_empleado', $_SESSION['tipo_empleado']);
        $modelo->__set('id_empleado', $_SESSION['id_empleado']);
        
        $empleados = $modelo->manejarAccion('psicologos_listar');
        echo json_encode(['data' => $empleados]);
        exit();
    } catch(Throwable $e) {
        error_log("Error en psicologos_data_json: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar los psicólogos'
        ]);
        exit();
    }
}

function obtener_horario_psicologo(){
    $modelo = new EmpleadoModel();
    $id_empleado = $_GET['id_empleado'] ?? null;
    header('Content-Type: application/json');
    
    try {
        if(!$id_empleado) {
            throw new Exception('ID del empleado no proporcionado');
        }
        $modelo->__set('id_empleado', $id_empleado);
        
        $horarios = $modelo->manejarAccion('obtener_horarios_por_empleado');
        $citas = $modelo->manejarAccion('obtener_citas_psicologo');
        
        // Verificar si el psicólogo tiene horario
        if (empty($horarios)) {
            throw new Exception('El psicólogo no tiene horario definido');
        }
        
        echo json_encode([
            'exito' => true,
            'data' => [
                'horario' => $horarios,
                'citas' => $citas
            ],
            'mensaje' => 'Horario cargado correctamente'
        ]);
        exit();
        
    } catch(Throwable $e) {
        error_log("Error en obtener_horario_psicologo: " . $e->getMessage());
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function empleado_detalle_editar(){
    $modelo = new EmpleadoModel();
    $id_empleado = $_GET['id_empleado'];
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('id_empleado', $id_empleado);
        $tipos_empleados = $modelo->manejarAccion('vista');
        $empleados = $modelo->manejarAccion('empleado_detalle_editar');
        echo json_encode(['data' => $empleados, 'tipos_empleado' => $tipos_empleados]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en empleado_detalle_editar: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar el empleado'
        ]);
        exit();
    }
}

function empleado_actualizar(){
    $modelo = new EmpleadoModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Empleados';

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

        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $apellido = filter_input(INPUT_POST, 'apellido', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo_cedula = filter_input(INPUT_POST, 'tipo_cedula', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $cedula = filter_input(INPUT_POST, 'cedula', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL); 
        $telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_tipo_empleado = filter_input(INPUT_POST, 'id_tipo_empleado', FILTER_SANITIZE_NUMBER_INT);
        $fecha_nacimiento = filter_input(INPUT_POST, 'fecha_nacimiento', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $direccion = filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if(empty($nombre) || empty($apellido) || empty($tipo_cedula) || empty($cedula) || empty($correo) || empty($telefono) || empty($id_tipo_empleado) || empty($fecha_nacimiento) || empty($direccion) || empty($estatus)){
            throw new Exception('Todos los campos son obligatorios');
        }

        $datos = [
            'id_empleado' => $id_empleado,
            'nombre' => $nombre,
            'apellido' => $apellido,
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'correo' => $correo,
            'telefono' => $telefono,
            'id_tipo_empleado' => $id_tipo_empleado,
            'fecha_nacimiento' => $fecha_nacimiento,
            'direccion' => $direccion,
            'estatus' => $estatus
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $registro = $modelo->manejarAccion('actualizar_empleado');
        if($registro['exito'] === true){
            //Registramos en la bitácora el registro
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El empleado {$_SESSION['nombre']} actualizó un dato del empleado: $nombre $apellido ($tipo_cedula-$cedula)"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            
            $registro_bit = $bitacora->manejarAccion('registrar_bitacora');
            if($registro_bit['exito'] !== true){
                error_log("Error al registrar en la bitácora: " . $registro_bit['mensaje']);
            }

            $notificacion_data = [
                'titulo' => 'Actualización de Empleado',
                'url' => 'consultar_empleados',
                'tipo' => 'empleado',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, //Administrador
                'leido' => 0
            ];

            foreach($notificacion_data as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if(!$noti_resultado['exito']){
                error_log("Error al registrar la notificación: " . ($noti_resultado['mensaje'] ?? 'Error desconocido'));
            }

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else{
            throw new Exception($registro['mensaje']);
        }

    } catch (Throwable $e){
        echo json_encode([
            'exito' => false,
            'error' => $e->getMessage()
        ]);
        exit();
    }
}

function empleado_eliminar(){
    $modelo = new EmpleadoModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Empleados';

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

        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_SANITIZE_NUMBER_INT);
        $modelo->__set('id_empleado', $id_empleado);
        $datos = $modelo->manejarAccion('empleado_detalle');
        $registro = $modelo->manejarAccion('eliminar_empleado');
        if($registro['exito'] === true){
            //Registramos en la bitácora el registro
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El empleado {$_SESSION['nombre']} eliminó el empleado: " . $datos['nombre'] . " " . $datos['apellido'] . " (" . $datos['tipo_cedula'] . $datos['cedula'] . ")"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            
            $registro_bit = $bitacora->manejarAccion('registrar_bitacora');
            if($registro_bit['exito'] !== true){
                error_log("Error al registrar en la bitácora: " . $registro_bit['mensaje']);
            }

            $notificacion_data = [
                'titulo' => 'Eliminación de Empleado',
                'url' => 'consultar_empleados',
                'tipo' => 'empleado',
                'id_emisor' => $_SESSION['id_empleado'],
                'id_receptor' => 1, //Administrador
                'leido' => 0
            ];

            foreach($notificacion_data as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }

            $noti_resultado = $notificacion->manejarAccion('crear_notificacion');
            if(!$noti_resultado['exito']){
                error_log("Error al registrar la notificación: " . ($noti_resultado['mensaje'] ?? 'Error desconocido'));
            }

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else{
            throw new Exception($registro['mensaje']);
        }

    } catch (Throwable $e){
        echo json_encode([
            'exito' => false,
            'error' => $e->getMessage()
        ]);
        exit();
    }
}