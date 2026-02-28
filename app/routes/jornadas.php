<?php

use App\Core\Router;

//========================(Jornadas========================)

Router::get('crear_jornada', function () {
    load_controller('jornadasController.php');
    crear_jornada();
});

Router::post('registrar_jornada', function () {
    load_controller('jornadasController.php');
    registrar_jornada();
});

Router::get('consultar_jornadas', function () {
    load_controller('jornadasController.php');
    consultar_jornadas();
});

Router::get('jornadas_data_json', function () {
    load_controller('jornadasController.php');
    consultar_jornadas_json();
});

Router::get('jornada_detalle', function () {
    load_controller('jornadasController.php');
    jornada_detalle();
});

Router::post('actualizar_jornada', function () {
    load_controller('jornadasController.php');
    actualizar_jornada();
});

Router::get('detallar_jornada', function () {
    load_controller('jornadasController.php');
    detallar_jornada();
});

Router::get('beneficiarios_jornada_json', function () {
    load_controller('jornadasController.php');
    beneficiarios_jornada_json();
});

Router::post('agregar_beneficiario_jornada', function () {
    load_controller('jornadasController.php');
    agregar_beneficiario_jornada();
});

Router::post('agregar_diagnostico_jornada', function () {
    load_controller('jornadasController.php');
    agregar_diagnostico_jornada();
});

Router::get('diagnostico_jornada_detalle', function () {
    load_controller('jornadasController.php');
    detalle_diagnosticosJornada();
});

Router::post('actualizar_diagnostico_jornada', function () {
    load_controller('jornadasController.php');
    actualizar_diagnostico_jornada();
});
