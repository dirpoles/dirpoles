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
