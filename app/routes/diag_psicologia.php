<?php
use App\Core\Router;

//===================== Rutas para el módulo de Psicologia =========================

Router::get('diagnostico_psicologia', function() {
    load_controller('psicologiaController.php');
    diagnostico_psicologia();
});

Router::post('diagnostico_psicologia_registrar', function() {
    load_controller('psicologiaController.php');
    registrar_diagnostico_psicologia();
});

Router::post('registrar_retiro_temporal', function() {
    load_controller('psicologiaController.php');
    registrar_retiro_temporal();
});

Router::post('registrar_cambio_carrera', function() {
    load_controller('psicologiaController.php');
    registrar_cambio_carrera();
});

Router::get('diagnostico_psicologia_consultar', function() {
    load_controller('psicologiaController.php');
    consultar_diagnostico_psicologia();
});

Router::get('diagnostico_general_data_json', function() {
    load_controller('psicologiaController.php');
    diagnosticos_data_json();
});

Router::get('diagnostico_detalle', function() {
    load_controller('psicologiaController.php');
    diagnostico_detalle();
});

Router::get('obtener_patologias_json', function() {
    load_controller('psicologiaController.php');
    obtener_patologias_json();
});

Router::post('actualizar_diagnostico_psicologia', function() {
    load_controller('psicologiaController.php');
    actualizar_diagnostico_psicologia();
});

Router::post('psicologia_eliminar', function() {
    load_controller('psicologiaController.php');
    eliminar_diagnostico();
});

Router::get('psicologia_stats_json', function() {
    load_controller('psicologiaController.php');
    get_stats_psicologia_json();
});
