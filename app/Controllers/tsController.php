<?php
use App\Models\TsModel;
use App\Models\BitacoraModel;
use App\Models\NotificacionesModel;
use App\Models\PermisosModel;

function diagnostico_trabajo_social(){
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $modulo = 'Trabajador Social';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $patologias = $modelo->manejarAccion('obtener_patologias');

        require_once BASE_PATH . '/app/Views/diagnosticos/trabajo_social/diagnostico_ts.php';

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

//Registrar
function registrar_beca() {
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido.");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_DEFAULT);
        $tipo_banco = filter_input(INPUT_POST, 'tipo_banco', FILTER_DEFAULT);
        $cta_bcv = filter_input(INPUT_POST, 'cta_bcv', FILTER_DEFAULT);
        $id_servicios = 4;

        // Lógica de subida de archivo
        $direccion_pdf = '';
        if (isset($_FILES['planilla']) && $_FILES['planilla']['error'] === UPLOAD_ERR_OK) {
            $target_dir = "uploads/trabajo social/becas/";

            if (!is_dir($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            // Validar que sea PDF
            $extension = strtolower(pathinfo($_FILES['planilla']['name'], PATHINFO_EXTENSION));
            $mime_type = mime_content_type($_FILES['planilla']['tmp_name']);

            if ($extension !== 'pdf' || $mime_type !== 'application/pdf') {
                throw new Exception("La planilla debe ser un archivo PDF válido.");
            }

            // Generar nombre único con fecha y hora
            $file_name = "planilla_" . date("Ymd_His") . "_" . uniqid() . ".pdf";
            $target_file = "$target_dir$file_name";

            if (move_uploaded_file($_FILES['planilla']['tmp_name'], $target_file)) {
                $direccion_pdf = $target_file;
            } else {
                throw new Exception("Error al guardar la planilla.");
            }
        } else {
            throw new Exception("La planilla de inscripción es obligatoria.");
        }

        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_empleado' => $id_empleado,
            'tipo_banco' => $tipo_banco,
            'cta_bcv' => $cta_bcv,
            'direccion_pdf' => $direccion_pdf,
            'id_servicios' => $id_servicios
        ];
        
        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('registrar_beca');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        if($resultado['exito']){
              $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro una beca para el beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Beca',
                'url' => 'consultar_ts',
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
            throw new Exception($resultado['mensaje'] ?? 'Error al registrar la beca');
        }
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function registrar_exoneracion(){
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido.");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_DEFAULT);
        $motivo = filter_input(INPUT_POST, 'motivo', FILTER_DEFAULT);
        $carnet_discapacidad = filter_input(INPUT_POST, 'carnet_discapacidad', FILTER_DEFAULT);
        $otro_motivo = filter_input(INPUT_POST, 'otro_motivo', FILTER_DEFAULT);
        $id_servicios = 4;

        if($otro_motivo === "" || $otro_motivo === null){
            $otro_motivo = 'No aplica';
        }

        $direccion_carta = '';
        if (isset($_FILES['carta']) && $_FILES['carta']['error'] === UPLOAD_ERR_OK) {
            $target_dir = "uploads/trabajo social/exoneracion/";

            if (!is_dir($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            // Validar que sea PDF
            $extension = strtolower(pathinfo($_FILES['carta']['name'], PATHINFO_EXTENSION));
            $mime_type = mime_content_type($_FILES['carta']['tmp_name']);

            if ($extension !== 'pdf' || $mime_type !== 'application/pdf') {
                throw new Exception("La carta debe ser un archivo PDF válido.");
            }

            // Generar nombre único con fecha y hora
            $file_name = "carta_" . date("Ymd_His") . "_" . uniqid() . ".pdf";
            $target_file = "$target_dir$file_name";

            if (move_uploaded_file($_FILES['carta']['tmp_name'], $target_file)) {
                $direccion_carta = $target_file;
            } else {
                throw new Exception("Error al guardar la carta.");
            }
        } else {
            throw new Exception("La carta de exoneracion es obligatoria.");
        }

        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_empleado' => $id_empleado,
            'motivo' => $motivo,
            'carnet_discapacidad' => $carnet_discapacidad,
            'direccion_carta' => $direccion_carta,
            'id_servicios' => $id_servicios,
            'otro_motivo' => $otro_motivo
        ];
        
        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('registrar_exoneracion');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        if($resultado['exito']){
              $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro una exoneracion para el beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Exoneracion',
                'url' => 'consultar_ts',
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
            throw new Exception($resultado['mensaje'] ?? 'Error al registrar la exoneracion');
        }
    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function registrar_fames(){
    $modelo = new TsModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido.");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_DEFAULT);
        $id_patologia = filter_input(INPUT_POST, 'id_patologia', FILTER_DEFAULT);
        $tipo_ayuda = filter_input(INPUT_POST, 'tipo_ayuda', FILTER_DEFAULT);
        $otro_tipo = filter_input(INPUT_POST, 'otro_tipo', FILTER_DEFAULT);
        $id_servicios = 4;
        if($otro_tipo === "" || $otro_tipo === null){
            $otro_tipo = 'No aplica';
        }

        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_empleado' => $id_empleado,
            'id_patologia' => $id_patologia,
            'tipo_ayuda' => $tipo_ayuda,
            'otro_tipo' => $otro_tipo,
            'id_servicios' => $id_servicios
        ];

        foreach ($datos as $campo => $valor) {
            if (!isset($valor) || $valor === '' || $valor === null) {
                throw new Exception("El campo {$campo} es obligatorio y no tiene valor.");
            }
        }

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('registrar_fames');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        if($resultado['exito']){
              $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un diagnóstico de FAMES para el beneficiario $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Fames',
                'url' => 'consultar_ts',
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

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function registrar_emb(){
    $modelo = new TsModel();
    $bitacora = new BitacoraModel();
    $permisos = new PermisosModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido.");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Crear', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_DEFAULT);
        $id_empleado = filter_input(INPUT_POST, 'id_empleado', FILTER_DEFAULT);
        $id_patologia = filter_input(INPUT_POST, 'id_patologia', FILTER_DEFAULT);
        $semanas_gest = filter_input(INPUT_POST, 'semanas_gest', FILTER_DEFAULT);
        $codigo_patria = filter_input(INPUT_POST, 'codigo_patria', FILTER_DEFAULT);
        $serial_patria = filter_input(INPUT_POST, 'serial_patria', FILTER_DEFAULT);
        $estado = filter_input(INPUT_POST, 'estado', FILTER_DEFAULT);
        $id_servicios = 4;
        

        $datos = [
            'id_beneficiario' => $id_beneficiario,
            'id_empleado' => $id_empleado,
            'id_patologia' => $id_patologia,
            'semanas_gest' => $semanas_gest,
            'codigo_patria' => $codigo_patria,
            'serial_patria' => $serial_patria,
            'estado' => $estado,
            'id_servicios' => $id_servicios
        ];

        foreach ($datos as $campo => $valor) {
            if (!isset($valor) || $valor === '' || $valor === null) {
                throw new Exception("El campo {$campo} es obligatorio y no tiene valor.");
            }
        }

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('registrar_emb');
        $beneficiaria = $modelo->manejarAccion('obtener_beneficiario');
        if($resultado['exito']){
              $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Registro',
                'descripcion' => "El Empleado {$_SESSION['nombre']} registro un caso de embarazada para la beneficiaria $beneficiaria"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Registro de Embarazada',
                'url' => 'consultar_ts',
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

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }


}

function exoneracion_pendientes_json() {
    // Verificar si es una petición AJAX
    if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
         // Si no es AJAX, denegar acceso
        require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        exit;
    }

    header('Content-Type: application/json');

    try {
        $modelo = new TsModel();
        // Permisos básicos para ver esto? Asumimos que si puede ver el módulo, puede ver los pendientes
        // O reutilizamos la verificación de permisos de lectura

        $permisos = new PermisosModel();
        $modulo = 'Trabajador Social';

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
             throw new Exception('No tienes permiso para ver esta información');
        }

        $pendientes = $modelo->manejarAccion('obtener_exoneraciones_pendientes');

        echo json_encode([
            'exito' => true,
            'data' => $pendientes
        ]);

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function generar_pdf_socioeconomico() {
    // Verificar si es una petición AJAX
    if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        // Si no es AJAX, denegar acceso
        require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        exit;
    }

    header('Content-Type: application/json');

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido.");
        }

        // Cargar librerías necesarias
        require_once BASE_PATH . '/PDF/EstudioSE/procesar.php';

        // Definir ruta de salida: uploads/trabajo social/exoneracion/estudiose/
        // Asegurar que la carpeta exista
        $carpetaDestino = BASE_PATH . '/uploads/trabajo_social/exoneracion/estudiose/';
        if (!is_dir($carpetaDestino)) {
            if (!mkdir($carpetaDestino, 0777, true)) {
                throw new Exception("No se pudo crear el directorio de destino.");
            }
        }
        
        $nombrePDF = uniqid() . '_estudioSE.pdf';
        $rutaRelativa = 'uploads/trabajo_social/exoneracion/estudiose/' . $nombrePDF;
        $rutaAbsoluta = $carpetaDestino . $nombrePDF;

        // Llamar a GenerarPDF::crearPDF. 
        // procesar.php espera $_POST y $_FILES. Como esta llamada es directa desde el AJAX del formulario offcanvas,
        // $_POST ya contiene los datos del estudio socioeconómico.
        // Solo necesitamos pasar la ruta de salida.

        if (GenerarPDF::crearPDF($rutaAbsoluta)) {
            
            // Actualizar la base de datos si tenemos el ID de exoneración
            $id_exoneracion = filter_input(INPUT_POST, 'id_exoneracion', FILTER_VALIDATE_INT);
            
            if ($id_exoneracion) {
                // Instanciar modelo para actualizar
                $modelo = new TsModel();
                $modelo->__set('id_exoneracion', $id_exoneracion);
                $modelo->__set('direccion_estudiose', $rutaRelativa);
                
                // No validamos permisos aquí porque ya validó al entrar al controller general o asumimos que 
                // si está generando el PDF es parte del flujo. Pero idealmente se debería validar.
                // Como es una función interna del flujo AJAX, confiamos en la sesión activa.
                
                $updateResult = $modelo->manejarAccion('actualizar_exoneracion_estudio');
                
                if (!$updateResult['exito']) {
                     // Si falla la actualización en BD, ¿borramos el PDF? 
                     // Dejamos el PDF pero avisamos
                     throw new Exception("PDF generado pero error al vincular con base de datos: " . $updateResult['mensaje']);
                }
            }

            echo json_encode([
                'exito' => true, 
                'mensaje' => 'PDF generado y vinculado correctamente',
                'ruta' => $rutaRelativa, // Ruta relativa para guardar en BD
                'nombre_archivo' => $nombrePDF,
                'id_exoneracion' => $id_exoneracion
            ]);
        } else {
            throw new Exception("Error interno al generar el PDF con FPDF.");
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function patologias_ts_json(){
    $modelo = new TsModel();
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

//Consultar

function consultar_diagnosticos_ts(){
    $permisos = new PermisosModel();
    $modulo = 'Trabajador Social';

    try{
        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para realizar esta acción');
        }

        require_once BASE_PATH . '/app/Views/diagnosticos/trabajo_social/consultar_ts.php';
        
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

function consultar_diagnosticos_json() {
    // Verificar si es una petición AJAX
    if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        require_once BASE_PATH . '/app/Views/errors/access_denied.php';
        exit;
    }

    header('Content-Type: application/json');

    try {
        $tipo = filter_input(INPUT_GET, 'tipo', FILTER_DEFAULT);
        
        $modelo = new TsModel();
        $permisos = new PermisosModel();
        $modulo = 'Trabajador Social';

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Leer', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
             throw new Exception('No tienes permiso para ver esta información');
        }

        $es_admin = $_SESSION['tipo_empleado'] === 'Administrador' || $_SESSION['tipo_empleado'] === 'Superusuario';
        if(!$es_admin){
            $modelo->__set('id_empleado', $_SESSION['id_empleado']);
        } else {
            $modelo->__set('es_admin', true);
        }

        $data = [];
        switch($tipo) {
            case 'becas':
                $data = $modelo->manejarAccion('listar_becas');
                break;
            case 'exoneraciones':
                $data = $modelo->manejarAccion('listar_exoneraciones');
                break;
            case 'fames':
                $data = $modelo->manejarAccion('listar_fames');
                break;
            case 'embarazadas':
                $data = $modelo->manejarAccion('listar_embarazadas');
                break;
            default:
                throw new Exception("Tipo de consulta no válido");
        }

        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function detalles_diagnosticos_json() {
    $modelo = new TsModel();
  
    try {
        $tipo = filter_input(INPUT_GET, 'tipo', FILTER_DEFAULT);
        $id_becas = filter_input(INPUT_GET, 'id_becas', FILTER_VALIDATE_INT) ?? 0;
        $id_exoneracion = filter_input(INPUT_GET, 'id_exoneracion', FILTER_VALIDATE_INT) ?? 0;
        $id_fames = filter_input(INPUT_GET, 'id_fames', FILTER_VALIDATE_INT) ?? 0;
        $id_gestion = filter_input(INPUT_GET, 'id_gestion', FILTER_VALIDATE_INT) ?? 0;

        $datos = [
            'id_becas' => $id_becas,
            'id_exoneracion' => $id_exoneracion,
            'id_fames' => $id_fames,
            'id_gestion' => $id_gestion
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $data = [];
        switch($tipo) {
            case 'becas':
                $data = $modelo->manejarAccion('detalle_beca');
                break;
            case 'exoneraciones':
                $data = $modelo->manejarAccion('detalle_exoneracion');
                break;
            case 'fames':
                $data = $modelo->manejarAccion('detalle_fames');
                break;
            case 'embarazadas':
                $data = $modelo->manejarAccion('detalle_embarazada');
                break;
            default:
                throw new Exception("Tipo de detalle no válido");
        }

        echo json_encode([
            'exito' => true,
            'data' => $data
        ]);

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

//Actualizar

function beca_actualizar() {
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para editar esta información');
        }
        
        $id_becas = filter_input(INPUT_POST, 'id_becas', FILTER_VALIDATE_INT);
        $tipo_banco = filter_input(INPUT_POST, 'tipo_banco', FILTER_DEFAULT);
        $cta_bcv = filter_input(INPUT_POST, 'cta_bcv', FILTER_DEFAULT);

        if (!$id_becas || !$tipo_banco || !$cta_bcv) {
            throw new Exception("Datos incompletos para actualizar la beca");
        }
        
        $datos = [
            'id_becas' => $id_becas,
            'tipo_banco' => $tipo_banco,
            'cta_bcv' => $cta_bcv
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('actualizar_beca');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if($resultado['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó un dato de la beca del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Beca',
                'url' => 'trabajo_social_consultar',
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
            throw new Exception($resultado['mensaje'] || 'Error al actualizar la beca');
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function exoneracion_actualizar() {
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para editar esta información');
        }
        
        $id_exoneracion = filter_input(INPUT_POST, 'id_exoneracion', FILTER_VALIDATE_INT);
        $motivo = filter_input(INPUT_POST, 'motivo', FILTER_DEFAULT);
        $otro_motivo = filter_input(INPUT_POST, 'otro_motivo', FILTER_DEFAULT);
        $carnet_discapacidad = filter_input(INPUT_POST, 'carnet_discapacidad', FILTER_DEFAULT);
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_VALIDATE_INT);

        if (!$id_exoneracion || !$motivo || !$otro_motivo || !$carnet_discapacidad || !$id_beneficiario) {
            throw new Exception("Datos incompletos para actualizar la exoneración");
        }
        
        $datos = [
            'id_exoneracion' => $id_exoneracion,
            'motivo' => $motivo,
            'otro_motivo' => $otro_motivo,
            'carnet_discapacidad' => $carnet_discapacidad,
            'id_beneficiario' => $id_beneficiario
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('actualizar_exoneracion');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if($resultado['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó un dato de la exoneración del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Exoneración',
                'url' => 'trabajo_social_consultar',
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
            throw new Exception($resultado['mensaje'] || 'Error al actualizar la exoneración');
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function fames_actualizar(){
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para editar esta información');
        }
        
        $id_fames = filter_input(INPUT_POST, 'id_fames', FILTER_VALIDATE_INT);
        $id_patologia = filter_input(INPUT_POST, 'id_patologia', FILTER_VALIDATE_INT);
        $tipo_ayuda = filter_input(INPUT_POST, 'tipo_ayuda', FILTER_DEFAULT);
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_VALIDATE_INT);
        $id_detalle_patologia = filter_input(INPUT_POST, 'id_detalle_patologia', FILTER_VALIDATE_INT);

        if (!$id_fames || !$id_patologia || !$tipo_ayuda || !$id_beneficiario || !$id_detalle_patologia) {
            throw new Exception("Datos incompletos para actualizar el servicio de FAMES");
        }

        switch ($tipo_ayuda) {
            case 'Otro':
                $otro_tipo = filter_input(INPUT_POST, 'otro_tipo', FILTER_DEFAULT);
                if(!$otro_tipo){
                    throw new Exception("Debe especificar el tipo de ayuda");
                }
                break;
            default:
                $otro_tipo = 'No aplica';
                break;
        }
        
        $datos = [
            'id_fames' => $id_fames,
            'id_patologia' => $id_patologia,
            'tipo_ayuda' => $tipo_ayuda,
            'otro_tipo' => $otro_tipo,
            'id_beneficiario' => $id_beneficiario,
            'id_detalle_patologia' => $id_detalle_patologia
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('actualizar_fames');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if($resultado['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó un dato del servicio de FAMES del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de FAMES',
                'url' => 'trabajo_social_consultar',
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
            throw new Exception($resultado['mensaje'] ?? 'Error al actualizar el servicio de FAMES');
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function embarazadas_actualizar(){
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Editar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para editar esta información');
        }
        
        $id_gestion = filter_input(INPUT_POST, 'id_gestion', FILTER_VALIDATE_INT);
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_VALIDATE_INT);
        $id_detalle_patologia = filter_input(INPUT_POST, 'id_detalle_patologia', FILTER_VALIDATE_INT);
        $id_patologia = filter_input(INPUT_POST, 'id_patologia', FILTER_DEFAULT);
        $estado = filter_input(INPUT_POST, 'estado', FILTER_DEFAULT);
        $semanas_gest = filter_input(INPUT_POST, 'semanas_gest', FILTER_VALIDATE_INT);
        $codigo_patria = filter_input(INPUT_POST, 'codigo_patria', FILTER_DEFAULT);
        $serial_patria = filter_input(INPUT_POST, 'serial_patria', FILTER_DEFAULT);

        if (!$id_gestion || !$id_beneficiario || !$id_detalle_patologia || !$id_patologia || !$estado || !$semanas_gest || !$codigo_patria || !$serial_patria) {
            throw new Exception("Datos incompletos para actualizar el servicio de Embarazadas");
        }
        
        $datos = [
            'id_gestion' => $id_gestion,
            'estado' => $estado,
            'id_patologia' => $id_patologia,
            'semanas_gest' => $semanas_gest,
            'codigo_patria' => $codigo_patria,
            'serial_patria' => $serial_patria,
            'id_beneficiario' => $id_beneficiario,
            'id_detalle_patologia' => $id_detalle_patologia
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $resultado = $modelo->manejarAccion('actualizar_embarazadas');
        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');

        if($resultado['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Actualización',
                'descripcion' => "El Empleado {$_SESSION['nombre']} actualizó un dato del servicio de Embarazadas del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Actualización de Embarazadas',
                'url' => 'trabajo_social_consultar',
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
            throw new Exception($resultado['mensaje'] ?? 'Error al actualizar el servicio de Embarazadas');
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

//Eliminar

function beca_eliminar(){
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para eliminar esta información');
        }
        
        $id_becas = filter_input(INPUT_POST, 'id_becas', FILTER_VALIDATE_INT);
        $id_solicitud_serv = filter_input(INPUT_POST, 'id_solicitud_serv', FILTER_VALIDATE_INT);

        if (!$id_becas || !$id_solicitud_serv) {
            throw new Exception("Datos incompletos para eliminar la beca");
        }
        
        $datos = [
            'id_becas' => $id_becas,
            'id_solicitud_serv' => $id_solicitud_serv
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        $resultado = $modelo->manejarAccion('eliminar_beca');
        
        if($resultado['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El Empleado {$_SESSION['nombre']} eliminó la exoneración del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Eliminación de Beca',
                'url' => 'trabajo_social_consultar',
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
            throw new Exception($resultado['mensaje'] || 'Error al eliminar la beca');
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function exoneracion_eliminar(){
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para eliminar esta información');
        }
        
        $id_exoneracion = filter_input(INPUT_POST, 'id_exoneracion', FILTER_VALIDATE_INT);
        $id_solicitud_serv = filter_input(INPUT_POST, 'id_solicitud_serv', FILTER_VALIDATE_INT);

        if (!$id_exoneracion || !$id_solicitud_serv) {
            throw new Exception("Datos incompletos para eliminar la exoneración");
        }
        
        $datos = [
            'id_exoneracion' => $id_exoneracion,
            'id_solicitud_serv' => $id_solicitud_serv
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        $resultado = $modelo->manejarAccion('eliminar_exoneracion');
        
        if($resultado['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El Empleado {$_SESSION['nombre']} eliminó la exoneración del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Eliminación de Exoneración',
                'url' => 'trabajo_social_consultar',
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
            throw new Exception($resultado['mensaje'] || 'Error al eliminar la exoneración');
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function fames_eliminar(){
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para eliminar esta información');
        }
        
        $id_fames = filter_input(INPUT_POST, 'id_fames', FILTER_VALIDATE_INT);
        $id_solicitud_serv = filter_input(INPUT_POST, 'id_solicitud_serv', FILTER_VALIDATE_INT);
        $id_detalle_patologia = filter_input(INPUT_POST, 'id_detalle_patologia', FILTER_VALIDATE_INT);

        if (!$id_fames || !$id_solicitud_serv || !$id_detalle_patologia) {
            throw new Exception("Datos incompletos para eliminar el diagnóstico de FAMES");
        }
        
        $datos = [
            'id_fames' => $id_fames,
            'id_solicitud_serv' => $id_solicitud_serv,
            'id_detalle_patologia' => $id_detalle_patologia
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        $resultado = $modelo->manejarAccion('eliminar_fames');
        
        if($resultado['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El Empleado {$_SESSION['nombre']} eliminó el diagnóstico de FAMES del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Eliminación de FAMES',
                'url' => 'trabajo_social_consultar',
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
            throw new Exception($resultado['mensaje'] ?? 'Error al eliminar el diagnóstico de FAMES');
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function embarazadas_eliminar(){
    $modelo = new TsModel();
    $permisos = new PermisosModel();
    $bitacora = new BitacoraModel();
    $notificacion = new NotificacionesModel();
    $modulo = 'Trabajador Social';

    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception("Método no permitido");
        }

        $verificar = ['Modulo' => $modulo, 'Permiso' => 'Eliminar', 'Rol' => $_SESSION['id_tipo_empleado']];
        foreach($verificar as $atributo => $valor){
            $permisos->__set($atributo, $valor);
        }

        if(!$permisos->manejarAccion('Verificar')){
            throw new Exception('No tienes permiso para eliminar esta información');
        }
        
        $id_gestion = filter_input(INPUT_POST, 'id_gestion', FILTER_VALIDATE_INT);
        $id_solicitud_serv = filter_input(INPUT_POST, 'id_solicitud_serv', FILTER_VALIDATE_INT);
        $id_detalle_patologia = filter_input(INPUT_POST, 'id_detalle_patologia', FILTER_VALIDATE_INT);
        $id_beneficiario = filter_input(INPUT_POST, 'id_beneficiario', FILTER_VALIDATE_INT);

        if (!$id_gestion || !$id_solicitud_serv || !$id_detalle_patologia || !$id_beneficiario) {
            throw new Exception("Datos incompletos para eliminar el diagnóstico de Embarazadas");
        }
        
        $datos = [
            'id_gestion' => $id_gestion,
            'id_solicitud_serv' => $id_solicitud_serv,
            'id_detalle_patologia' => $id_detalle_patologia,
            'id_beneficiario' => $id_beneficiario
        ];

        foreach($datos as $atributo => $valor){
            $modelo->__set($atributo, $valor);
        }

        $beneficiario = $modelo->manejarAccion('obtener_beneficiario');
        $resultado = $modelo->manejarAccion('eliminar_embarazadas');
        
        if($resultado['exito']){
            $bitacora_data = [
                'id_empleado' => $_SESSION['id_empleado'],
                'modulo' => $modulo,
                'accion' => 'Eliminación',
                'descripcion' => "El Empleado {$_SESSION['nombre']} eliminó el diagnóstico de Embarazadas del beneficiario: $beneficiario"
            ];
            foreach($bitacora_data as $atributo => $valor){
                $bitacora->__set($atributo, $valor);
            }
            $bitacora->manejarAccion('registrar_bitacora');

            $notificacion_data = [
                'titulo' => 'Eliminación de Embarazadas',
                'url' => 'trabajo_social_consultar',
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
            throw new Exception($resultado['mensaje'] ?? 'Error al eliminar el diagnóstico de Embarazadas');
        }

    } catch (Throwable $e) {
        echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
    }
}

function stats_ts_admin(){
    $modelo = new TsModel();
    $estadisticas = $modelo->manejarAccion('stats_admin');
    
    header('Content-Type: application/json');
    echo json_encode($estadisticas);
}

function stats_ts(){
    $modelo = new TsModel();
    $modelo->__set('id_empleado', $_SESSION['id_empleado']);

    $estadisticas = $modelo->manejarAccion('stats_empleado');
    header('Content-Type: application/json');
    echo json_encode($estadisticas);
}