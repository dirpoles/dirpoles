<?php
use App\Core\Router;

//======================================================================================================================
// RUTAS DEL MODULO DE DIAGNOSTICO DE DISCAPACIDAD
//======================================================================================================================

Router::get('diagnostico_discapacidad', function() {
    load_controller('discapacidadController.php');
    diagnostico_discapacidad(); 
});

Router::post('discapacidad_registrar', function() {
    load_controller('discapacidadController.php');
    discapacidad_registrar();
});

Router::get('diagnostico_discapacidad_consultar', function() {
    load_controller('discapacidadController.php');
    diagnostico_discapacidad_consultar(); 
});

Router::get('diagnostico_discapacidad_json', function() {
    load_controller('discapacidadController.php');
    diagnostico_discapacidad_json(); 
});

Router::get('discapacidad_detalle', function() {
    load_controller('discapacidadController.php');
    diagnostico_discapacidad_detalle(); 
});

Router::post('discapacidad_actualizar', function() {
    load_controller('discapacidadController.php');
    discapacidad_actualizar(); 
});

Router::post('discapacidad_eliminar', function() {
    load_controller('discapacidadController.php');
    discapacidad_eliminar(); 
});

Router::get('stats_discapacidad_admin', function() {
    load_controller('discapacidadController.php');
    stats_discapacidad_admin(); 
});

Router::get('stats_discapacidad', function() {
    load_controller('discapacidadController.php');
    stats_discapacidad(); 
});