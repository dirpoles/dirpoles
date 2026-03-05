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
