<?php
use App\Models\ReferenciasModel;
use App\Models\PermisosModel;
use App\Models\NotificacionesModel;
use App\Models\BitacoraModel;

function crear_referencias(){
    $modelo = new ReferenciasModel();
    $permisos = new PermisosModel();
    $modulo = 'Referencias';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }
        
        $id_empleado_sesion = $_SESSION['id_empleado'];
        $id_tipo_empleado_sesion = $_SESSION['id_tipo_empleado'];
        
        // Obtener el servicio del usuario actual para restricciones de rol
        $modelo->__set('id_empleado', $id_empleado_sesion);
        $id_servicio_propio = $modelo->manejarAccion('obtener_servicio_empleado');

        $servicios = $modelo->manejarAccion('obtener_servicios');
        
        $es_admin = in_array($_SESSION['tipo_empleado'], ['Administrador', 'Superusuario']);
        $modelo->__set('es_admin', $es_admin);
        $modelo->__set('id_empleado', $id_empleado_sesion);

        $stats = $modelo->manejarAccion('obtener_estadisticas');
        $referencias_totales = $stats['totales'];
        $referencias_pendientes = $stats['pendientes'];
        $referencias_finalizadas = $stats['finalizadas'];
        $referencias_mes = $stats['mes'];

        require_once BASE_PATH . '/app/Views/referencias/crear_referencias.php';

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

function obtenerEmpleadosAjax(){
    header('Content-Type: application/json');
    $modelo = new ReferenciasModel();

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        $id_servicios = filter_input(INPUT_POST, 'id_servicios', FILTER_VALIDATE_INT);
        if (!$id_servicios) {
            throw new Exception('ID de servicio no válido');
        }

        $modelo->__set('id_servicios', $id_servicios);
        $empleados = $modelo->manejarAccion('obtener_empleados_por_servicio');

        echo json_encode([
            'exito' => true,
            'data' => $empleados
        ]);

    } catch (Throwable $e) {
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function registrar_referencia(){
    $modelo = new ReferenciasModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $permisos = new PermisosModel();
    $modulo = 'Referencias';
    
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);
        $id_servicio_origen = filter_input(INPUT_POST, 'id_servicio_origen', FILTER_DEFAULT);
        $id_servicio_destino = filter_input(INPUT_POST, 'id_servicio_destino', FILTER_DEFAULT);
        $id_empleado_origen = filter_input(INPUT_POST, 'id_empleado_origen', FILTER_DEFAULT);
        $id_empleado_destino = filter_input(INPUT_POST, 'id_empleado_destino', FILTER_DEFAULT);
        $motivo = filter_input(INPUT_POST, 'motivo', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT);

        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_servicio_origen' => $id_servicio_origen,
            'id_servicio_destino' => $id_servicio_destino,
            'id_empleado_origen' => $id_empleado_origen,
            'id_empleado_destino' => $id_empleado_destino,
            'motivo' => $motivo,
            'observaciones' => $observaciones
        ];

        foreach($datos as $atributo => $valor){
            if(empty($valor)){
                throw new Exception('Todos los campos son obligatorios');
            }
            $modelo->__set($atributo, $valor);
        }

        $registro =$modelo->manejarAccion('registrar_referencia');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro una referencia con el beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_referencia = [
                'titulo' => 'Nueva Referencia',
                'url' => 'consultar_referencias',
                'tipo' => 'referencia',
                'id_emisor' => $id_empleado_origen,
                'id_receptor' => $id_empleado_destino,
                'leido' => 0
            ];
            foreach($notificacion_referencia as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar la referencia');
        }
        
    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);   
    }
}

function consultar_referencias(){
    $permisos = new PermisosModel();
    $modulo = 'Referencias';
    
    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/referencias/consultar_referencias.php';
        
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

function referencias_data_json(){
    $modelo = new ReferenciasModel();
    header('Content-Type: application/json');

    $es_admin = $_SESSION['tipo_empleado'] == 'Administrador';
    if(!$es_admin){
        $modelo->__set('id_empleado', $_SESSION['id_empleado']);
    }else{
        $modelo->__set('es_admin', true);
    }

    try{
        $data = $modelo->manejarAccion('obtener_referencias');
        echo json_encode(['data' => $data]);

    } catch(Throwable $e){
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function referencia_detalle(){
    $modelo = new ReferenciasModel();
    header('Content-Type: application/json');

    try{
        $id_referencia = filter_input(INPUT_GET, 'id_referencia', FILTER_VALIDATE_INT);
        if (!$id_referencia) {
            throw new Exception('ID de referencia no válido');
        }

        $modelo->__set('id_referencia', $id_referencia);
        $referencia = $modelo->manejarAccion('referencia_detalle');

        echo json_encode($referencia);
    } catch(Throwable $e){
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function gestionar_referencia(){
    $modelo = new ReferenciasModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Referencias';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_referencia = filter_input(INPUT_POST, 'id_referencia', FILTER_VALIDATE_INT);
        $estado = filter_input(INPUT_POST, 'estado', FILTER_DEFAULT);
        $observaciones = filter_input(INPUT_POST, 'observaciones', FILTER_DEFAULT) ?? null;
        $id_empleado = $_SESSION['id_empleado'];
        $id_empleado_origen_post = filter_input(INPUT_POST, 'id_empleado_origen', FILTER_VALIDATE_INT);

        // 1. Validar propiedad (No puede gestionar su propia referencia salvo Admin)
        $modelo->__set('id_referencia', $id_referencia);
        $referencia = $modelo->manejarAccion('referencia_detalle');

        if (!$referencia) {
            throw new Exception('Referencia no encontrada');
        }

        $es_admin = in_array($_SESSION['id_tipo_empleado'], [6, 10]); // Admin / Superusuario
        if ($referencia['id_empleado_origen'] == $id_empleado && !$es_admin) {
            throw new Exception('No tienes permiso para gestionar una referencia creada por ti mismo');
        }

        $datos = [
            'id_referencia' => $id_referencia,
            'estado' => $estado,
            'observaciones' => $observaciones,
            'id_empleado' => $id_empleado
        ];

        foreach ($datos as $atributo => $valor) {
            if (empty($valor)) {
                if ($atributo === 'observaciones' && $estado !== 'Rechazada') {
                    $modelo->__set($atributo, $valor);
                    continue;
                }

                throw new Exception("El campo $atributo es obligatorio.");
            }
            $modelo->__set($atributo, $valor);
        }

        switch($estado){
            case 'Aceptada':
                $registro = $modelo->manejarAccion('aceptar_referencia');
                break;
            case 'Rechazada':
                $registro = $modelo->manejarAccion('rechazar_referencia');
                break;
            default:
                throw new Exception('Estado no válido');
        }

        if($registro['exito']){
            $descripcion = "El Empleado {$_SESSION['nombre']} " . ($estado == 'Aceptada' ? 'aceptó' : 'rechazó') . " la referencia $id_referencia";
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => $descripcion
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_referencia = [
                'titulo' => "Referencia $estado",
                'url' => 'consultar_referencias',
                'tipo' => 'referencia',
                'id_emisor' => $id_empleado,
                'id_receptor' => $referencia['id_empleado_origen'],
                'leido' => 0
            ];
            foreach($notificacion_referencia as $atributo => $valor){
                $notificacion->__set($atributo, $valor);
            }
            $notificacion->manejarAccion('crear_notificacion');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al gestionar la referencia');
        }
    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}
