<?php
use App\Models\BeneficiarioModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;
use App\Models\PermisosModel;

function crear_beneficiario(){
    $permisos = new PermisosModel();
    $modelo = new BeneficiarioModel();
    $modulo = 'Beneficiarios';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        
        $pnfs = $modelo->manejarAccion('obtener_pnf');
        $beneficiarios_act = $modelo->manejarAccion('beneficiarios_activos');
        $beneficiarios_inact = $modelo->manejarAccion('beneficiarios_inactivos');
        $beneficiarios_totales = $modelo->manejarAccion('beneficiarios_totales');
        $beneficiarios_diag = $modelo->manejarAccion('beneficiarios_con_diagnosticos');
        require_once BASE_PATH . '/app/Views/beneficiario/crear_beneficiario.php';
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

function consultar_beneficiarios(){
    $permisos = new PermisosModel();
    $modelo = new BeneficiarioModel();
    $modulo = 'Beneficiarios';
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        
        require_once BASE_PATH . '/app/Views/beneficiario/consultar_beneficiarios.php';
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

function beneficiarios_data_json(){
    $modelo = new BeneficiarioModel();
    header('Content-Type: application/json');
    
    try {
        $beneficiarios = $modelo->manejarAccion('consultar_beneficiarios');
        echo json_encode(['data' => $beneficiarios]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en beneficiarios_data_json: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar los beneficiarios'
        ]);
        exit();
    }
}

function beneficiarios_activos_data_json(){
    $modelo = new BeneficiarioModel();
    header('Content-Type: application/json');
    
    try {
        $beneficiarios = $modelo->manejarAccion('consultar_beneficiarios_activos');
        echo json_encode(['data' => $beneficiarios]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en beneficiarios_activos_data_json: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar los beneficiarios'
        ]);
        exit();
    }
}

function beneficiario_registrar(){
    $modelo = new BeneficiarioModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Beneficiarios';

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

        $nombres = filter_input(INPUT_POST, 'nombres', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $apellidos = filter_input(INPUT_POST, 'apellidos', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo_cedula = filter_input(INPUT_POST, 'tipo_cedula', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $cedula = filter_input(INPUT_POST, 'cedula', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL); 
        $telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fecha_nac = filter_input(INPUT_POST, 'fecha_nac', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $direccion = filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $genero = filter_input(INPUT_POST, 'genero', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_pnf = filter_input(INPUT_POST, 'id_pnf', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $seccion = filter_input(INPUT_POST, 'seccion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if(empty($nombres) || empty($apellidos) || empty($tipo_cedula) || empty($cedula) || empty($correo) || empty($telefono) || empty($fecha_nac) || empty($direccion) || empty($genero) || empty($id_pnf) || empty($seccion)){
            throw new Exception('Todos los campos son obligatorios');
        }

        $beneficiario = [
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'correo' => $correo,
            'telefono' => $telefono,
            'fecha_nac' => $fecha_nac,
            'direccion' => $direccion,
            'genero' => $genero,
            'id_pnf' => $id_pnf,
            'seccion' => $seccion,
            'estatus' => 1,
        ];

        foreach($beneficiario as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $registro = $modelo->manejarAccion('registrar_beneficiario');
        if($registro['exito'] === true){
            //Registramos en la bitácora el registro
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El empleado {$_SESSION['nombre']} registró el beneficiario: $nombres $apellidos ($tipo_cedula-$cedula)"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Beneficiario',
                'url' => 'consultar_beneficiarios',
                'tipo' => 'beneficiario',
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
            'error' => $e->getMessage()
        ]);
        exit();
    }
}

function beneficiario_detalle(){
    $modelo = new BeneficiarioModel();
    $id_beneficiario = $_GET['id_beneficiario'];
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('id_beneficiario', $id_beneficiario);
        $beneficiarios = $modelo->manejarAccion('beneficiario_detalle');
        echo json_encode(['data' => $beneficiarios]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en beneficiario_detalle: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar el beneficiario'
        ]);
        exit();
    }
}

function beneficiario_detalle_editar(){
    $modelo = new BeneficiarioModel();
    $id_beneficiario = $_GET['id_beneficiario'];
    header('Content-Type: application/json');
    
    try {
        $modelo->__set('id_beneficiario', $id_beneficiario);
        $beneficiarios = $modelo->manejarAccion('beneficiario_detalle_editar');
        $pnf = $modelo->manejarAccion('obtener_pnf');
        echo json_encode(['data' => $beneficiarios, 'pnf' => $pnf]);
        exit();

    } catch(Throwable $e) {
        error_log("Error en beneficiario_detalle_editar: " . $e->getMessage());
        echo json_encode([
            'data' => [],
            'error' => 'Error al cargar el beneficiario'
        ]);
        exit();
    }
}

function beneficiario_actualizar() {
    $modelo = new BeneficiarioModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Beneficiarios';
    
    header('Content-Type: application/json');
    
    try {
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            throw new Exception('Método no permitido');
        }
        
        // Verificar permisos
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }
        
        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        
        // Obtener y sanitizar datos
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_SANITIZE_NUMBER_INT);
        $nombres = filter_input(INPUT_POST, 'nombres', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $apellidos = filter_input(INPUT_POST, 'apellidos', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $tipo_cedula = filter_input(INPUT_POST, 'tipo_cedula', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $cedula = filter_input(INPUT_POST, 'cedula', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL);
        $telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $fecha_nac = filter_input(INPUT_POST, 'fecha_nac', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $direccion = filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $genero = filter_input(INPUT_POST, 'genero', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $id_pnf = filter_input(INPUT_POST, 'id_pnf', FILTER_SANITIZE_NUMBER_INT);
        $seccion = filter_input(INPUT_POST, 'seccion', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_SANITIZE_NUMBER_INT);
        
        // Validar campos obligatorios
        $camposObligatorios = [
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'correo' => $correo,
            'telefono' => $telefono,
            'fecha_nac' => $fecha_nac,
            'direccion' => $direccion,
            'genero' => $genero,
            'id_pnf' => $id_pnf,
            'seccion' => $seccion,
            'estatus' => $estatus
        ];
        
        foreach($camposObligatorios as $nombre => $valor) {
            if(empty($valor) && $valor !== '0') {
                throw new Exception("El campo {$nombre} es obligatorio");
            }
        }
        
        // Preparar datos para el modelo
        $beneficiario = [
            'id_beneficiario' => $id_beneficiario,
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'tipo_cedula' => $tipo_cedula,
            'cedula' => $cedula,
            'correo' => $correo,
            'telefono' => $telefono,
            'fecha_nac' => $fecha_nac,
            'direccion' => $direccion,
            'genero' => $genero,
            'id_pnf' => $id_pnf,
            'seccion' => $seccion,
            'estatus' => $estatus
        ];
        
        // Asignar valores al modelo
        foreach($beneficiario as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }
        
        // Ejecutar actualización
        $actualizacion = $modelo->manejarAccion('actualizar_beneficiario');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        if($actualizacion['exito'] === true){
            // Registrar en bitácora
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El empleado {$_SESSION['nombre']} actualizó un dato del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
            
            // Crear notificación
            $notificacion_data = [
                'titulo' => 'Actualización de Beneficiario',
                'url' => 'consultar_beneficiarios',
                'tipo' => 'beneficiario',
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
                'mensaje' => $actualizacion['mensaje']
            ]);
        } else {
            throw new Exception($actualizacion['mensaje']);
        }
        
    } catch(Throwable $e) {
        echo json_encode([
            'exito' => false,
            'error' => $e->getMessage()
        ]);
    }
}

function beneficiario_eliminar() {
    $modelo = new BeneficiarioModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Beneficiarios';
    
    header('Content-Type: application/json');
    
    try {
        if($_SERVER['REQUEST_METHOD'] !== 'POST'){
            throw new Exception('Método no permitido');
        }
        
        // Verificar permisos
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }
        
        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        
        // Obtener ID del beneficiario
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_SANITIZE_NUMBER_INT);
        
        if (!$id_beneficiario) {
            throw new Exception('ID de beneficiario no válido');
        }
        
        // Obtener información del beneficiario antes de eliminar (para bitácora)
        $modelo->__set('id_beneficiario', $id_beneficiario);
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        
        if (!$beneficiario) {
            throw new Exception('El beneficiario no existe o ya fue eliminado');
        }
        
        // Eliminar el beneficiario
        $eliminacion = $modelo->manejarAccion('eliminar_beneficiario');
        
        if($eliminacion['exito'] === true){
            // Registrar en bitácora
            $nombres = $beneficiario['nombres'] ?? '';
            $apellidos = $beneficiario['apellidos'] ?? '';
            $cedula = $beneficiario['cedula'] ?? '';
            $tipo_cedula = $beneficiario['tipo_cedula'] ?? '';
            
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El empleado {$_SESSION['nombre']} eliminó el beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');
            
            // Crear notificación
            $notificacion_data = [
                'titulo' => 'Eliminación de Beneficiario',
                'url' => 'consultar_beneficiarios',
                'tipo' => 'beneficiario',
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
                'mensaje' => $eliminacion['mensaje']
            ]);
        } else {
            throw new Exception($eliminacion['mensaje']);
        }
        
    } catch(Throwable $e) {
        echo json_encode([
            'exito' => false,
            'error' => $e->getMessage()
        ]);
    }
}