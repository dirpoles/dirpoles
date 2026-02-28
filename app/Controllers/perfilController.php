<?php
use App\Models\PerfilModel;
use App\Models\NotificacionesModel;
use App\Models\PermisosModel;
use App\Models\BitacoraModel;

function perfil_detalle(){
    header('Content-Type: application/json');
    
    try{
        // Usar el ID del empleado de la sesión
        $id_empleado = $_SESSION['id_empleado'] ?? null;
        
        if(empty($id_empleado)){
            throw new Exception('No se pudo obtener el ID del usuario');
        }
        
        $modelo = new PerfilModel();
        $modelo->__set('id_empleado', $id_empleado);
        
        $data = $modelo->manejarAccion('consultar_perfil');
        
        if(!$data){
            throw new Exception('No se encontraron datos del perfil');
        }
        
        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);
        
    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function perfil_actualizar(){
    header('Content-Type: application/json');
    
    try{
        // Usar el ID del empleado de la sesión (seguridad)
        $id_empleado = $_SESSION['id_empleado'] ?? null;
        
        if(empty($id_empleado)){
            throw new Exception('No se pudo obtener el ID del usuario');
        }
        
        // Validar que el ID del formulario coincida con el de la sesión
        $id_empleado_form = filter_input(INPUT_POST, 'id_empleado', FILTER_VALIDATE_INT);
        if($id_empleado != $id_empleado_form){
            throw new Exception('No tienes permisos para realizar esta acción');
        }
        
        $modelo = new PerfilModel();
        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('nombre', filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_SPECIAL_CHARS));
        $modelo->__set('apellido', filter_input(INPUT_POST, 'apellido', FILTER_SANITIZE_SPECIAL_CHARS));
        $modelo->__set('correo', filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL));
        $modelo->__set('telefono', filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_SPECIAL_CHARS));
        $modelo->__set('direccion', filter_input(INPUT_POST, 'direccion', FILTER_SANITIZE_SPECIAL_CHARS));
        
        // Si se envió una nueva contraseña
        $clave = filter_input(INPUT_POST, 'clave', FILTER_SANITIZE_SPECIAL_CHARS);
        if(!empty($clave)){
            $modelo->__set('contrasena', $clave);
        }
        
        $resultado = $modelo->manejarAccion('actualizar_perfil');
        
        if($resultado){
            // Actualizar datos en la sesión
            $_SESSION['nombre'] = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_SPECIAL_CHARS);
            $_SESSION['apellido'] = filter_input(INPUT_POST, 'apellido', FILTER_SANITIZE_SPECIAL_CHARS);
            
            echo json_encode([
                'exito' => true,
                'mensaje' => 'Perfil actualizado correctamente'
            ]);
        } else {
            throw new Exception('No se pudo actualizar el perfil');
        }
        
    } catch(Throwable $e){
        echo json_encode([
            'exito' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}

function validar_clave_actual(){
    header('Content-Type: application/json');
    
    try{
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_VALIDATE_INT);
        $clave_actual = filter_input(INPUT_POST, 'clave_actual', FILTER_SANITIZE_SPECIAL_CHARS);
        
        if(empty($id_empleado) || empty($clave_actual)){
            throw new Exception('Datos incompletos');
        }
        
        // Verificar que el ID coincida con la sesión
        if($id_empleado != $_SESSION['id_empleado']){
            throw new Exception('No autorizado');
        }
        
        $modelo = new PerfilModel();
        $modelo->__set('id_empleado', $id_empleado);
        $modelo->__set('clave_actual', $clave_actual);
        
        $valida = $modelo->manejarAccion('validar_contrasena_actual');
        
        echo json_encode([
            'valida' => $valida
        ]);
        
    } catch(Throwable $e){
        echo json_encode([
            'valida' => false,
            'mensaje' => $e->getMessage()
        ]);
    }
}
