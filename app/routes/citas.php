<?php
use App\Core\Router;


// ==================== RUTAS PROTEGIDAS (citas) ====================
Router::get('crear_cita', function() {
    load_controller('citasController.php');
    crear_cita();
});

Router::post('cita_registrar', function() {
    load_controller('citasController.php');
    cita_registrar();
});

Router::get('consultar_citas', function() {
    load_controller('citasController.php');
    consultar_citas();
});

Router::get('citas_data_json', function() {
    load_controller('citasController.php');
    citas_data_json();
});

Router::get('cita_detalle', function(){
    load_controller('citasController.php');
    cita_detalle();
});

Router::get('cita_detalle_editar', function(){
    load_controller('citasController.php');
    cita_detalle_editar();
});

Router::post('validar_fecha_cita', function(){
    load_controller('citasController.php');
    validar_fecha_cita();
});

Router::post('validar_hora_cita', function() {
    load_controller('CitasController.php');
    validar_hora_cita();
});

Router::post('actualizar_cita', function() {
    load_controller('CitasController.php');
    actualizar_cita();
});

Router::post('eliminar_cita', function() {
    load_controller('CitasController.php');
    eliminar_cita();
});

Router::post('obtener_estados_cita', function() {
    load_controller('CitasController.php');
    obtener_estados_cita();
});

Router::post('actualizar_estado_cita', function() {
    load_controller('CitasController.php');
    actualizar_estado_cita();
});

Router::get('citas_calendario_json', function() {
    load_controller('CitasController.php');
    citas_calendario_json();
});