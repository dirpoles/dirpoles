<?php
use App\Models\ConfigModel;
use App\Models\BitacoraModel;
use App\Models\PermisosModel;

function configuraciones(){
    $modelo = new ConfigModel();
    $permisos = new PermisosModel();
    $modulo = "Configuracion";

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $servicios = $modelo->manejarAccion('obtener_servicios');
        require_once BASE_PATH . '/app/Views/configuracion/crear_config.php';
        
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

function configuracion_consultar(){
    $modelo = new ConfigModel();
    $permisos = new PermisosModel();
    $modulo = "Configuracion";

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/configuracion/consultar_config.php';
        
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

//Patologia
function validar_patologia(){
    $modelo = new ConfigModel();
    header('Content-Type: application/json');
    
    try{
        $id_patologia = $_POST['id_patologia'] ?? '';
        $nombre_patologia = $_POST['nombre_patologia'] ?? '';
        $tipo_patologia = $_POST['tipo_patologia'] ?? '';

        if(empty($nombre_patologia) || empty($tipo_patologia)){
            throw new Exception('Datos incompletos para validar');
        }
        
        $verificar = [
            'id_patologia' => $id_patologia,
            'nombre_patologia' => $nombre_patologia,
            'tipo_patologia' => $tipo_patologia
        ];

        foreach($verificar as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $existe = $modelo->manejarAccion('validar_patologia');

        echo json_encode(['existe' => $existe]);
        exit();

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }    
}

function registrar_patologia(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $nombre_patologia = filter_input(INPUT_POST, 'nombre_patologia', FILTER_DEFAULT);
        $tipo_patologia = filter_input(INPUT_POST, 'tipo_patologia', FILTER_DEFAULT);

        if(empty($nombre_patologia) || empty($tipo_patologia)){
            throw new Exception('Datos incompletos para registrar');
        }

        $modelo->__set('nombre_patologia', $nombre_patologia);
        $modelo->__set('tipo_patologia', $tipo_patologia);

        $registro = $modelo->manejarAccion('registrar_patologia');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro una patología con el nombre $nombre_patologia y tipo $tipo_patologia"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar la patología');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

//PNF
function validar_pnf(){
    $modelo = new ConfigModel();
    header('Content-Type: application/json');
    
    try{
        $id_pnf = $_POST['id_pnf'] ?? '';
        $nombre_pnf = $_POST['nombre_pnf'] ?? '';

        if(empty($nombre_pnf)){
            throw new Exception('Datos incompletos para validar');
        }
        
        $verificar = [
            'id_pnf' => $id_pnf,
            'nombre_pnf' => $nombre_pnf
        ];

        foreach($verificar as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $existe = $modelo->manejarAccion('validar_pnf');

        echo json_encode(['existe' => $existe]);
        exit();

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }    
}

function registrar_pnf(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $nombre_pnf = filter_input(INPUT_POST, 'nombre_pnf', FILTER_DEFAULT);

        if(empty($nombre_pnf)){
            throw new Exception('Datos incompletos para registrar');
        }

        $modelo->__set('nombre_pnf', $nombre_pnf);

        $registro = $modelo->manejarAccion('registrar_pnf');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un PNF con el nombre $nombre_pnf"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar el PNF');
        }
    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

//Servicio
function validar_servicio(){
    $modelo = new ConfigModel();
    header('Content-Type: application/json');
    
    try{
        $id_servicios = $_POST['id_servicios'] ?? '';
        $nombre_serv = $_POST['nombre_serv'] ?? '';

        if(empty($nombre_serv)){
            throw new Exception('Datos incompletos para validar');
        }
        
        $verificar = [
            'id_servicios' => $id_servicios,
            'nombre_serv' => $nombre_serv
        ];

        foreach($verificar as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $existe = $modelo->manejarAccion('validar_servicio');

        echo json_encode(['existe' => $existe]);
        exit();

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }    
}

function registrar_servicio(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $nombre_serv = filter_input(INPUT_POST, 'nombre_serv', FILTER_DEFAULT);

        if(empty($nombre_serv)){
            throw new Exception('Datos incompletos para registrar');
        }

        $modelo->__set('nombre_serv', $nombre_serv);

        $registro = $modelo->manejarAccion('registrar_servicio');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un Servicio con el nombre $nombre_serv"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar el Servicio');
        }
    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

//Tipo de Empleado
function validar_tipo_empleado(){
    $modelo = new ConfigModel();
    header('Content-Type: application/json');
    
    try{
        $id_tipo_emp = $_POST['id_tipo_emp'] ?? '';
        $tipo = $_POST['tipo'] ?? '';
        $id_servicios = $_POST['id_servicios'] ?? '';

        if(empty($tipo) || empty($id_servicios)){
            throw new Exception('Datos incompletos para validar');
        }
        
        $verificar = [
            'id_tipo_emp' => $id_tipo_emp,
            'tipo' => $tipo,
            'id_servicios' => $id_servicios
        ];

        foreach($verificar as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $existe = $modelo->manejarAccion('validar_tipo_empleado');

        echo json_encode(['existe' => $existe]);
        exit();

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }    
}

function registrar_tipo_empleado(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $tipo = filter_input(INPUT_POST, 'tipo', FILTER_DEFAULT);
        $id_servicios = filter_input(INPUT_POST, 'id_servicios', FILTER_DEFAULT);

        if(empty($tipo) || empty($id_servicios)){
            throw new Exception('Datos incompletos para registrar');
        }

        $modelo->__set('tipo', $tipo);
        $modelo->__set('id_servicios', $id_servicios);

        $registro = $modelo->manejarAccion('registrar_tipo_empleado');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un tipo de empleado con el nombre $tipo y servicio $id_servicios"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar el tipo de empleado');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

//Tipo de Mobiliario
function registrar_tipo_mobiliario(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_DEFAULT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT);

        if(empty($nombre) || empty($descripcion)){
            throw new Exception('Datos incompletos para registrar');
        }

        $modelo->__set('nombre', $nombre);
        $modelo->__set('descripcion', $descripcion);

        $registro = $modelo->manejarAccion('registrar_tipo_mobiliario');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un tipo de mobiliario con el nombre $nombre"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar el tipo de mobiliario');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

//Tipo de Equipo
function registrar_tipo_equipo(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_DEFAULT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT);

        if(empty($nombre) || empty($descripcion)){
            throw new Exception('Datos incompletos para registrar');
        }

        $modelo->__set('nombre', $nombre);
        $modelo->__set('descripcion', $descripcion);

        $registro = $modelo->manejarAccion('registrar_tipo_equipo');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un tipo de equipo con el nombre $nombre"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar el tipo de equipo');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

//Presentacion Insumos
function validar_presentacion_insumo(){
    $modelo = new ConfigModel();
    header('Content-Type: application/json');
    
    try{
        $id_presentacion = $_POST['id_presentacion'] ?? '';
        $nombre_presentacion = $_POST['nombre_presentacion'] ?? '';

        if(empty($nombre_presentacion)){
            throw new Exception('Datos incompletos para validar');
        }
        
        $verificar = [
            'id_presentacion' => $id_presentacion,
            'nombre_presentacion' => $nombre_presentacion
        ];

        foreach($verificar as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $existe = $modelo->manejarAccion('validar_presentacion');

        echo json_encode(['existe' => $existe]);
        exit();

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }    
}

function registrar_presentacion_insumo(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $nombre_presentacion = filter_input(INPUT_POST, 'nombre_presentacion', FILTER_DEFAULT);

        if(empty($nombre_presentacion)){
            throw new Exception('Datos incompletos para registrar');
        }

        $modelo->__set('nombre_presentacion', $nombre_presentacion);

        $registro = $modelo->manejarAccion('registrar_presentacion_insumo');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro una presentación de insumos con el nombre $nombre_presentacion"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al registrar la presentación de insumos');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function configuracion_consultar_json(){
    $modelo = new ConfigModel();
    header('Content-Type: application/json');
    
    try{
        $tipo = $_GET['tipo'] ?? '';
        
        $acciones = [
            'patologia' => 'consultar_patologias',
            'pnf' => 'consultar_pnf',
            'servicio' => 'consultar_servicios',
            'tipo_empleado' => 'consultar_tipo_empleado',
            'tipo_mobiliario' => 'consultar_tipo_mobiliario',
            'tipo_equipo' => 'consultar_tipo_equipo',
            'presentacion_insumo' => 'consultar_presentacion_insumo'
        ];

        if(!array_key_exists($tipo, $acciones)){
            throw new Exception("Tipo de configuración no válido: " . htmlspecialchars($tipo));
        }

        $data = $modelo->manejarAccion($acciones[$tipo]);
        
        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }    
}

function configuracion_obtener_detalle_json(){
    $modelo = new ConfigModel();
    header('Content-Type: application/json');
    
    try{
        $tipo = $_GET['tipo'] ?? '';
        $id = $_GET['id'] ?? '';
        $modelo->__set('id', $id);
        
        $acciones = [
            'patologia' => 'detalle_patologia',
            'pnf' => 'detalle_pnf',
            'servicio' => 'detalle_servicio',
            'tipo_empleado' => 'detalle_tipo_empleado',
            'tipo_mobiliario' => 'detalle_tipo_mobiliario',
            'tipo_equipo' => 'detalle_tipo_equipo',
            'presentacion_insumo' => 'detalle_presentacion_insumo'
        ];

        if(!array_key_exists($tipo, $acciones)){
            throw new Exception("Tipo de configuración no válido: " . htmlspecialchars($tipo));
        }

        $data = $modelo->manejarAccion($acciones[$tipo]);
        
        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);

    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }    
}

function actualizar_patologia(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_patologia = filter_input(INPUT_POST, 'id_patologia', FILTER_DEFAULT);
        $nombre_patologia = filter_input(INPUT_POST, 'nombre_patologia', FILTER_DEFAULT);
        $tipo_patologia = filter_input(INPUT_POST, 'tipo_patologia', FILTER_DEFAULT);

        if(empty($id_patologia) || empty($nombre_patologia) || empty($tipo_patologia)){
            throw new Exception('Datos incompletos para actualizar');
        }

        $modelo->__set('id_patologia', $id_patologia);
        $modelo->__set('nombre_patologia', $nombre_patologia);
        $modelo->__set('tipo_patologia', $tipo_patologia);

        $registro = $modelo->manejarAccion('actualizar_patologia');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizo una patologia con el nombre $nombre_patologia"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al actualizar la patologia');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function actualizar_pnf(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_pnf = filter_input(INPUT_POST, 'id_pnf', FILTER_DEFAULT);
        $nombre_pnf = filter_input(INPUT_POST, 'nombre_pnf', FILTER_DEFAULT);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_DEFAULT);

        if(empty($id_pnf) || empty($nombre_pnf) || ($estatus === null || $estatus === '')){
            throw new Exception('Datos incompletos para actualizar');
        }

        $modelo->__set('id_pnf', $id_pnf);
        $modelo->__set('nombre_pnf', $nombre_pnf);
        $modelo->__set('estatus', $estatus);

        $registro = $modelo->manejarAccion('actualizar_pnf');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizo un PNF con el nombre $nombre_pnf"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al actualizar el PNF');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function actualizar_presentacion_insumo(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_presentacion = filter_input(INPUT_POST, 'id_presentacion', FILTER_DEFAULT);
        $nombre_presentacion = filter_input(INPUT_POST, 'nombre_presentacion', FILTER_DEFAULT);

        if(empty($id_presentacion) || empty($nombre_presentacion)){
            throw new Exception('Datos incompletos para actualizar');
        }

        $modelo->__set('id_presentacion', $id_presentacion);
        $modelo->__set('nombre_presentacion', $nombre_presentacion);

        $registro = $modelo->manejarAccion('actualizar_presentacion_insumo');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizo una presentacion de insumo con el nombre $nombre_presentacion"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al actualizar la presentacion de insumo');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function actualizar_servicio(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_servicios = filter_input(INPUT_POST, 'id_servicios', FILTER_DEFAULT);
        $nombre_serv = filter_input(INPUT_POST, 'nombre_serv', FILTER_DEFAULT);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_DEFAULT);

        if(empty($id_servicios) || empty($nombre_serv) || ($estatus === null || $estatus === '')){
            throw new Exception('Datos incompletos para actualizar');
        }

        $modelo->__set('id_servicios', $id_servicios);
        $modelo->__set('nombre_serv', $nombre_serv);
        $modelo->__set('estatus', $estatus);

        $registro = $modelo->manejarAccion('actualizar_servicio');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizo un servicio con el nombre $nombre_serv"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al actualizar el servicio');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function actualizar_tipo_empleado(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_tipo_emp = filter_input(INPUT_POST, 'id_tipo_emp', FILTER_DEFAULT);
        $tipo = filter_input(INPUT_POST, 'tipo', FILTER_DEFAULT);
        $id_servicios = filter_input(INPUT_POST, 'id_servicios', FILTER_DEFAULT);

        if(empty($id_tipo_emp) || empty($tipo) || empty($id_servicios)){
            throw new Exception('Datos incompletos para actualizar');
        }

        $modelo->__set('id_tipo_emp', $id_tipo_emp);
        $modelo->__set('tipo', $tipo);
        $modelo->__set('id_servicios', $id_servicios);

        $registro = $modelo->manejarAccion('actualizar_tipo_empleado');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizo un tipo de empleado con el nombre $tipo"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al actualizar el tipo de empleado');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function actualizar_tipo_mobiliario(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_tipo_mobiliario = filter_input(INPUT_POST, 'id_tipo_mobiliario', FILTER_DEFAULT);
        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_DEFAULT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_DEFAULT);

        if(empty($id_tipo_mobiliario) || empty($nombre) || empty($descripcion) || empty($estatus)){
            throw new Exception('Datos incompletos para actualizar');
        }

        $modelo->__set('id_tipo_mobiliario', $id_tipo_mobiliario);
        $modelo->__set('nombre', $nombre);
        $modelo->__set('descripcion', $descripcion);
        $modelo->__set('estatus', $estatus);

        $registro = $modelo->manejarAccion('actualizar_tipo_mobiliario');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizo un tipo de mobiliario con el nombre $nombre"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al actualizar el tipo de mobiliario');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}

function actualizar_tipo_equipo(){
    $modelo = new ConfigModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $modulo = 'Configuracion';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_tipo_equipo = filter_input(INPUT_POST, 'id_tipo_equipo', FILTER_DEFAULT);
        $nombre = filter_input(INPUT_POST, 'nombre', FILTER_DEFAULT);
        $descripcion = filter_input(INPUT_POST, 'descripcion', FILTER_DEFAULT);
        $estatus = filter_input(INPUT_POST, 'estatus', FILTER_DEFAULT);

        if(empty($id_tipo_equipo) || empty($nombre) || empty($descripcion) || empty($estatus)){
            throw new Exception('Datos incompletos para actualizar');
        }

        $modelo->__set('id_tipo_equipo', $id_tipo_equipo);
        $modelo->__set('nombre', $nombre);
        $modelo->__set('descripcion', $descripcion);
        $modelo->__set('estatus', $estatus);

        $registro = $modelo->manejarAccion('actualizar_tipo_equipo');
        if($registro['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizo un tipo de equipo con el nombre $nombre"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            echo json_encode([
                'exito' => true,
                'mensaje' => $registro['mensaje']
            ]);
            exit();
        } else {
            throw new Exception($registro['mensaje'] ?? 'Error al actualizar el tipo de equipo');
        }


    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
        exit();
    }
}