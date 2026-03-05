<?php

use App\Core\Router;

//============================(Rutas del modulo de Reportes Estadísticos)============================
Router::get('reportes_general', function () {
    load_controller('reportesController.php');
    reportes_general();
});

Router::get('reportes_general_data', function () {
    load_controller('reportesController.php');
    reportes_general_data();
});

Router::get('reportes_psicologia', function () {
    load_controller('reportesController.php');
    reportes_psicologia();
});

Router::get('reportes_psicologia_morbilidad_data', function () {
    load_controller('reportesController.php');
    reportes_psicologia_morbilidad_data();
});

Router::get('reportes_psicologia_citas_data', function () {
    load_controller('reportesController.php');
    reportes_psicologia_citas_data();
});

Router::get('reportes_medicina', function () {
    load_controller('reportesController.php');
    reportes_medicina();
});

Router::get('reportes_medicina_morbilidad_data', function () {
    load_controller('reportesController.php');
    reportes_medicina_morbilidad_data();
});

Router::get('reportes_medicina_inventario_data', function () {
    load_controller('reportesController.php');
    reportes_medicina_inventario_data();
});

Router::get('reportes_orientacion', function () {
    load_controller('reportesController.php');
    reportes_orientacion();
});

Router::get('reportes_orientacion_data', function () {
    load_controller('reportesController.php');
    reportes_orientacion_data();
});

Router::get('reportes_trabajo_social', function () {
    load_controller('reportesController.php');
    reportes_trabajo_social();
});

Router::get('reportes_becas_data', function () {
    load_controller('reportesController.php');
    reportes_becas_data();
});

Router::get('reportes_exoneracion_data', function () {
    load_controller('reportesController.php');
    reportes_exoneracion_data();
});

Router::get('reportes_fames_data', function () {
    load_controller('reportesController.php');
    reportes_fames_data();
});

Router::get('reportes_embarazo_data', function () {
    load_controller('reportesController.php');
    reportes_embarazo_data();
});

Router::get('reportes_discapacidad', function () {
    load_controller('reportesController.php');
    reportes_discapacidad();
});

Router::get('reportes_discapacidad_data', function () {
    load_controller('reportesController.php');
    reportes_discapacidad_data();
});

Router::get('reportes_referencias', function () {
    load_controller('reportesController.php');
    reportes_referencias();
});

Router::get('reportes_referencias_data', function () {
    load_controller('reportesController.php');
    reportes_referencias_data();
});
