<?php

use App\Core\Router;

//========================= (RUTAS DE TRANSPORTE) ========================
Router::get('transporte_consulta', function () {
    load_controller('transporteController.php');
    transporte_consulta();
});

Router::get('vehiculos_data_json', function () {
    load_controller('transporteController.php');
    vehiculos_data_json();
});

Router::get('proveedores_data_json', function () {
    load_controller('transporteController.php');
    proveedores_data_json();
});

Router::get('rutas_data_json', function () {
    load_controller('transporteController.php');
    rutas_data_json();
});
