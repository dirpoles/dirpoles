<?php
use App\Core\Router;

//================= (Rutas del diagnostico de orientación) =====================

Router::get('diagnostico_orientacion', function() {
    load_controller('orientacionController.php');
    diagnostico_orientacion();
});

Router::post('orientacion_registrar', function() {
    load_controller('orientacionController.php');
    orientacion_registrar();
});

Router::get('diagnostico_orientacion_consultar', function() {
   load_controller('orientacionController.php');
   diagnostico_orientacion_consultar(); 
});

Router::get('diagnostico_orientacion_data_json', function() {
    load_controller('orientacionController.php');
    diagnostico_orientacion_data_json();
});

Router::get('diagnostico_orientacion_detalle', function() {
    load_controller('orientacionController.php');
    diagnostico_orientacion_detalle();
});

Router::post('diagnostico_orientacion_actualizar', function() {
    load_controller('orientacionController.php');
    diagnostico_orientacion_actualizar();
});

Router::post('orientacion_eliminar', function() {
    load_controller('orientacionController.php');
    orientacion_eliminar();
});

Router::get('stats_orientacion_admin', function() {
    load_controller('orientacionController.php');
    stats_orientacion_admin();
});

Router::get('stats_orientacion', function() {
    load_controller('orientacionController.php');
    stats_orientacion();
});