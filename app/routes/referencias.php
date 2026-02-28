<?php
use App\Core\Router;

//==================(Rutas del modulo de Referencias) ===============
Router::get('crear_referencias', function() {
    load_controller('referenciasController.php');
    crear_referencias();
});

Router::post('obtener_empleados_servicio', function() {
    load_controller('referenciasController.php');
    obtenerEmpleadosAjax();
});

Router::post('referencia_registrar', function() {
    load_controller('referenciasController.php');
    registrar_referencia();
});

Router::get('consultar_referencias', function() {
    load_controller('referenciasController.php');
    consultar_referencias();
});

Router::get('referencias_data_json', function() {
    load_controller('referenciasController.php');
    referencias_data_json();
});

Router::get('referencia_detalle', function() {
    load_controller('referenciasController.php');
    referencia_detalle();
});

Router::post('referencia_gestionar', function() {
    load_controller('referenciasController.php');
    gestionar_referencia();
});