<?php
use App\Core\Router;

//=============================== (Diagnostico de medicina) =============================

Router::get('diagnostico_medicina', function() {
    load_controller('medicinaController.php');
    diagnostico_medicina();
});

Router::post('diagnostico_medicina_registrar', function(){
    load_controller('medicinaController.php');
    registrar_diagnostico_medicina();
});

Router::get('stats_medicina_admin', function(){
    load_controller('medicinaController.php');
    stats_medicina_admin();
});

Router::get('diagnostico_medicina_consultar', function() {
    load_controller('medicinaController.php');
    diagnostico_medicina_consultar();
});

Router::get('diagnostico_medicina_data_json', function() {
    load_controller('medicinaController.php');
    diagnostico_medicina_data_json();
});

Router::get('diagnostico_medicina_detalle', function() {
    load_controller('medicinaController.php');
    diagnostico_medicina_detalle();
});

Router::get('obtener_patologias_medicina_json', function() {
    load_controller('medicinaController.php');
    obtener_patologias_medicina_json();
});

Router::post('actualizar_diagnostico_medicina', function() {
    load_controller('medicinaController.php');
    actualizar_diagnostico_medicina();
});

Router::post('diagnostico_medicina_eliminar', function() {
    load_controller('medicinaController.php');
    eliminar_diagnostico_medicina();
});

Router::get('medicina_stats_json', function() {
    load_controller('medicinaController.php');
    medicina_stats_json();
});
