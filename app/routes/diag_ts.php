<?php
use App\Core\Router;

//================ (Rutas de Trabajo Social) ==============

Router::get('diagnostico_trabajo_social', function() {
    load_controller('tsController.php');
    diagnostico_trabajo_social();
});

Router::post('becas_registrar', function() {
    load_controller('tsController.php');
    registrar_beca();
});

Router::post('exoneracion_registrar', function() {
   load_controller('tsController.php');
   registrar_exoneracion(); 
});

Router::post('fames_registrar', function() {
    load_controller('tsController.php');
    registrar_fames();
});

Router::post('emb_registrar', function() {
    load_controller('tsController.php');
    registrar_emb();
});

Router::post('generar_pdf_socioeconomico', function() {
    load_controller('tsController.php');
    generar_pdf_socioeconomico();
});

Router::get('exoneracion_pendientes_json', function() {
    load_controller('tsController.php');
    exoneracion_pendientes_json();
});

Router::get('diagnostico_trabajo_social_consultar', function() {
    load_controller('tsController.php');
    consultar_diagnosticos_ts();
});

Router::get('consultar_diagnosticos_json', function() {
    load_controller('tsController.php');
    consultar_diagnosticos_json();
});

Router::post('beca_actualizar', function() {
    load_controller('tsController.php');
    beca_actualizar();
});

Router::post('beca_eliminar', function() {
    load_controller('tsController.php');
    beca_eliminar();
});

Router::get('listar_detalle_json', function() {
    load_controller('tsController.php');
    detalles_diagnosticos_json();
});

Router::post('exoneracion_actualizar', function() {
    load_controller('tsController.php');
    exoneracion_actualizar();
});

Router::post('exoneracion_eliminar', function() {
    load_controller('tsController.php');
    exoneracion_eliminar();
});

Router::get('patologias_ts_json', function() {
    load_controller('tsController.php');
    patologias_ts_json();
});

Router::post('fames_actualizar', function() {
    load_controller('tsController.php');
    fames_actualizar();
});

Router::post('fames_eliminar', function() {
    load_controller('tsController.php');
    fames_eliminar();
});

Router::post('embarazadas_actualizar', function() {
    load_controller('tsController.php');
    embarazadas_actualizar();
});

Router::post('embarazada_eliminar', function() {
    load_controller('tsController.php');
    embarazadas_eliminar();
});

Router::get('stats_ts_admin', function() {
    load_controller('tsController.php');
    stats_ts_admin();
});

Router::get('stats_ts', function() {
    load_controller('tsController.php');
    stats_ts();
});