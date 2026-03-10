<?php

use App\Core\Router;

//========================= (RUTAS DE TRANSPORTE) ========================
Router::get('transporte_consulta', function () {
    load_controller('transporteController.php');
    transporte_consulta();
});

Router::get('transporte_estadisticas', function () {
    load_controller('transporteController.php');
    transporte_estadisticas();
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

Router::get('vehiculo_detalle', function () {
    load_controller('transporteController.php');
    vehiculo_detalle();
});

Router::post('vehiculo_actualizar', function () {
    load_controller('transporteController.php');
    vehiculo_actualizar();
});

Router::post('vehiculo_eliminar', function () {
    load_controller('transporteController.php');
    vehiculo_eliminar();
});

//==========================(Proveedores)==============================
Router::post('proveedor_registrar', function () {
    load_controller('transporteController.php');
    proveedor_registrar();
});

Router::get('proveedor_detalle', function () {
    load_controller('transporteController.php');
    proveedor_detalle();
});

Router::post('proveedor_actualizar', function () {
    load_controller('transporteController.php');
    proveedor_actualizar();
});

Router::post('proveedor_eliminar', function () {
    load_controller('transporteController.php');
    proveedor_eliminar();
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

Router::get('ruta_detalle', function () {
    load_controller('transporteController.php');
    ruta_detalle();
});

//===========================(Repuestos)==============================
Router::post('repuesto_registrar', function () {
    load_controller('transporteController.php');
    repuestos_registrar();
});

//==============================(Mantenimientos)==============================
Router::post('mantenimiento_registrar', function () {
    load_controller('transporteController.php');
    registrar_mantenimiento_vehiculo();
});
