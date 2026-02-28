<?php
use App\Models\loginModel;
use App\Models\BitacoraModel;
use App\Models\PermisosModel;
use App\Models\EmpleadoModel;
use App\Models\NotificacionesModel;
use App\Models\BeneficiarioModel;

function showLogin(){
    require_once BASE_PATH . '/app/Views/login.php';
}

function showInicio(){
    try{
        //Estadisticas de empleado
        $id_empleado = $_SESSION['id_empleado'];
        $empleados = new EmpleadoModel();
        $total_empleados = $empleados->manejarAccion('empleadosTotales');

        $beneficiarios = new BeneficiarioModel();
        $total_beneficiarios = $beneficiarios->manejarAccion('beneficiarios_totales');

        //Estadisticas de la notificacion
        $notificacion = new NotificacionesModel();
        $notificacion->__set('id_empleado', $id_empleado);
        $notificaciones = $notificacion->manejarAccion('contarNotificaciones');
        
        // Obtener permisos para sidebar
        $permisosModel = new PermisosModel();
        $permisosModel->__set('Rol', $_SESSION['id_tipo_empleado']);
        $modulosPermitidos = $permisosModel->manejarAccion('obtenerPermisosSidebar');
        
        // GUARDAR EN SESIÓN PARA USO GLOBAL
        $_SESSION['modulosPermitidos'] = $modulosPermitidos;
        
        // DEBUG
        error_log("Módulos permitidos para rol {$_SESSION['id_tipo_empleado']}: " . 
                  print_r(array_keys($modulosPermitidos), true));

        // Pasar a la vista
        $data = [
            'total_empleados' => $total_empleados,
            'total_beneficiarios' => $total_beneficiarios,
            'modulosPermitidos' => $modulosPermitidos, // También pasar directamente
            'id_tipo_empleado' => $_SESSION['id_tipo_empleado'],
            'nombre_tipo_empleado' => $_SESSION['tipo_empleado'],
            'notificaciones' => $notificaciones
        ];

        require_once BASE_PATH . '/app/Views/inicio/dashboard.php';
        
    } catch (Throwable $e){
        error_log("ERROR en showInicio: " . $e->getMessage());
        header('Location: ' . BASE_URL . 'error?mensaje=' . urlencode($e->getMessage()));
        exit;
    }
}

function iniciar_sesion(){
    $modelo = new loginModel();
    $bitacora = new BitacoraModel();

    try{
        $correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        $usuario = [
            'correo' => $correo,
            'password' => $password
        ];

        foreach($usuario as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejador('Autenticar');

        if($resultado['estado'] === 'exito' && isset($resultado['usuario'])){
            $_SESSION['id_empleado'] = $resultado['usuario']['id_empleado'];
            $_SESSION['nombre'] = $resultado['usuario']['nombre'];
            $_SESSION['apellido'] = $resultado['usuario']['apellido'];
            $_SESSION['correo'] = $resultado['usuario']['correo'];
            $_SESSION['id_tipo_empleado'] = $resultado['usuario']['id_tipo_empleado'];
            $_SESSION['tipo_empleado'] = $resultado['usuario']['nombre_tipo'];

            //Registrar en la bitácora
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => 'Login',
                'accion' => 'Inicio de sesión',
                'descripcion' => "El empleado ". $_SESSION['nombre']. " ha iniciado sesión.",
                'fecha' => date('Y-m-d H:i:s')
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }

            $bitacora_result = $bitacora->manejarAccion('registrar_bitacora');
            if(!$bitacora_result['estado']){
                error_log("Error al registrar en la bitácora: " . $bitacora_result['mensaje']);
            }

            //Mostrar mensaje de exito en la vista
            $mensaje = [
                'estado' => 'exito',
                'titulo' => '¡Bienvenido!',
                'mensaje' => 'Has iniciado sesión correctamente.'
            ];

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($mensaje);
            exit;

        }  else {

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'estado' => 'error',
                'mensaje' => $resultado['mensaje'] ?? 'Credenciales inválidas'
            ]);
            exit;
        } 

    } catch (Throwable $e){
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Error al iniciar sesión: ' . $e->getMessage()
        ]);
        exit;
    }
}

function cerrar_sesion() {
    // Iniciar sesión si no está activa
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    
    $id_empleado = $_SESSION['id_empleado'] ?? null;
    
    // Registrar en bitácora si hay usuario logueado
    if ($id_empleado) {
        $nombre_empleado = $_SESSION['nombre'] ?? 'Usuario desconocido';
        
        $bitacora = new BitacoraModel();
        $bitacora_data = [
            'id_empleado' => $id_empleado,
            'modulo' => 'Login',
            'accion' => 'Cierre de sesión',
            'descripcion' => "El empleado $nombre_empleado ha cerrado sesión.",
            'fecha' => date('Y-m-d H:i:s')
        ];
        
        foreach($bitacora_data as $atributo => $valor){
            $bitacora->__set($atributo, $valor);
        }
        
        $bitacora->manejarAccion('registrar_bitacora');
        // No es crítico si falla el log, por eso no verificamos exito
    }
    
    // Destruir sesión completamente
    session_unset(); // Equivalente a $_SESSION = []
    session_destroy();
    
    // Eliminar cookie de sesión
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 86400, 
            $params["path"], $params["domain"], 
            $params["secure"], $params["httponly"]);
    }
    
    // Redirigir
    header('Location: ' . BASE_URL . 'login?logout=true');
    exit();
}
