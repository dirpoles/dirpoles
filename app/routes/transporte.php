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

Router::get('asignaciones_rutas_data_json', function () {
    load_controller('transporteController.php');
    asignaciones_rutas_data_json();
});

Router::get('repuestos_data_json', function () {
    load_controller('transporteController.php');
    repuestos_data_json();
});

Router::get('mantenimientos_data_json', function () {
    load_controller('transporteController.php');
    mantenimientos_data_json();
});

//========================== (Vehiculos) ================================
Router::post('vehiculos_validar_placa', function () {
    load_controller('transporteController.php');
    vehiculos_validar_placa();
});

Router::post('vehiculos_registrar', function () {
    load_controller('transporteController.php');
    vehiculos_registrar();
});

//==========================(Proveedores)==============================
Router::post('proveedor_registrar', function () {
    load_controller('transporteController.php');
    proveedor_registrar();
});

//==========================(Rutas)==============================
Router::post('ruta_registrar', function () {
    load_controller('transporteController.php');
    ruta_registrar();
});

Router::get('obtener_choferes_activos', function () {
    load_controller('transporteController.php');
    obtener_choferes_activos();
});

Router::get('obtener_rutas_activas', function () {
    load_controller('transporteController.php');
    obtener_rutas_activas();
});

Router::get('obtener_vehiculos_activos', function () {
    load_controller('transporteController.php');
    obtener_vehiculos_activos();
});

Router::post('asignar_recursos_registrar', function () {
    load_controller('transporteController.php');
    asignar_recursos();
});

//===========================(Repuestos)==============================
