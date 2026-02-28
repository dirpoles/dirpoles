<?php
use App\Core\Router;

//======================= (CONFIGURACION) =========================

Router::get('configuraciones', function(){
    load_controller('configController.php');
    configuraciones();
});

//Patologia
Router::post('validar_patologia', function(){
    load_controller('configController.php');
    validar_patologia();
});

Router::post('registrar_patologia', function(){
    load_controller('configController.php');
    registrar_patologia();
});

//PNF
Router::post('validar_pnf', function(){
    load_controller('configController.php');
    validar_pnf();
});

Router::post('registrar_pnf', function(){
    load_controller('configController.php');
    registrar_pnf();
});

//Servicio
Router::post('validar_servicio', function(){
    load_controller('configController.php');
    validar_servicio();
});

Router::post('registrar_servicio', function(){
    load_controller('configController.php');
    registrar_servicio();
});

//Tipo Empleado
Router::post('validar_tipo_empleado', function(){
    load_controller('configController.php');
    validar_tipo_empleado();
});

Router::post('registrar_tipo_empleado', function(){
    load_controller('configController.php');
    registrar_tipo_empleado();
});

//Tipo Mobiliario
Router::post('registrar_tipo_mobiliario', function(){
    load_controller('configController.php');
    registrar_tipo_mobiliario();
});

//Tipo Equipo
Router::post('registrar_tipo_equipo', function(){
    load_controller('configController.php');
    registrar_tipo_equipo();
});

//Presentacion de insumo
Router::post('validar_presentacion_insumo', function(){
    load_controller('configController.php');
    validar_presentacion_insumo();
});

Router::post('registrar_presentacion_insumo', function(){
    load_controller('configController.php');
    registrar_presentacion_insumo();
});

//Consultar
Router::get('consultar_configuraciones', function(){
    load_controller('configController.php');
    configuracion_consultar();
});

Router::get('consultar_config_json', function(){
    load_controller('configController.php');
    configuracion_consultar_json();
});

//Detalle
Router::get('obtener_detalle_json', function(){
    load_controller('configController.php');
    configuracion_obtener_detalle_json();
});

//Actualizar
Router::post('actualizar_patologia', function(){
    load_controller('configController.php');
    actualizar_patologia();
});

Router::post('actualizar_pnf', function(){
    load_controller('configController.php');
    actualizar_pnf();
});

Router::post('actualizar_presentacion_insumo', function(){
    load_controller('configController.php');
    actualizar_presentacion_insumo();
});

Router::post('actualizar_servicio', function(){
    load_controller('configController.php');
    actualizar_servicio();
});

Router::post('actualizar_tipo_empleado', function(){
    load_controller('configController.php');
    actualizar_tipo_empleado();
});

Router::post('actualizar_tipo_mobiliario', function(){
    load_controller('configController.php');
    actualizar_tipo_mobiliario();
});

Router::post('actualizar_tipo_equipo', function(){
    load_controller('configController.php');
    actualizar_tipo_equipo();
});