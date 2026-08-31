<?php

use App\Core\Router;

//=========================(Rutas del inventario mobiliario y equipos) =========================

Router::get('crear_inventario_mob', function () {
    load_controller('inventarioMobController.php');
    crear_inventario_mob();
});

Router::get('ficha_tecnica_form_data', function () {
    load_controller('inventarioMobController.php');
    ficha_tecnica_form_data();
});

Router::post('ficha_registrar', function () {
    load_controller('inventarioMobController.php');
    registrar_ficha_tecnica();
});

Router::post('mobiliario_registrar', function () {
    load_controller('inventarioMobController.php');
    registrar_mobiliario();
});


Router::post('equipo_registrar', function () {
    load_controller('inventarioMobController.php');
    registrar_equipo();
});

Router::get('consultar_inventario_mob', function () {
    load_controller('inventarioMobController.php');
    consultar_inventario_mob();
});

Router::get('mobiliario_data_json', function () {
    load_controller('inventarioMobController.php');
    mobiliario_data_json();
});

Router::get('historial_inventario_json', function () {
    load_controller('inventarioMobController.php');
    historial_inventario_json();
});

Router::get('equipos_data_json', function () {
    load_controller('inventarioMobController.php');
    equipos_data_json();
});

Router::get('fichas_tecnicas_json', function () {
    load_controller('inventarioMobController.php');
    fichas_tecnicas_json();
});

// ==================== RUTAS DE MOBILIARIO (Detalle, Editar, Eliminar) ====================
Router::get('mobiliario_detalle', function () {
    load_controller('inventarioMobController.php');
    mobiliario_detalle();
});

Router::get('mobiliario_detalle_editar', function () {
    load_controller('inventarioMobController.php');
    mobiliario_detalle_editar();
});

Router::post('mobiliario_actualizar', function () {
    load_controller('inventarioMobController.php');
    mobiliario_actualizar();
});

Router::post('mobiliario_eliminar', function () {
    load_controller('inventarioMobController.php');
    mobiliario_eliminar();
});

// ==================== RUTAS DE EQUIPOS (Detalle, Editar, Eliminar) ====================
Router::get('equipo_detalle', function () {
    load_controller('inventarioMobController.php');
    equipo_detalle();
});

Router::get('equipo_detalle_editar', function () {
    load_controller('inventarioMobController.php');
    equipo_detalle_editar();
});

Router::post('equipo_actualizar', function () {
    load_controller('inventarioMobController.php');
    equipo_actualizar();
});

Router::post('equipo_eliminar', function () {
    load_controller('inventarioMobController.php');
    equipo_eliminar();
});

// ==================== RUTAS DE FICHAS TÉCNICAS (Detalle, Editar, Eliminar) ====================
Router::get('ficha_detalle', function () {
    load_controller('inventarioMobController.php');
    ficha_detalle();
});

Router::get('ficha_detalle_editar', function () {
    load_controller('inventarioMobController.php');
    ficha_detalle_editar();
});

Router::post('ficha_actualizar', function () {
    load_controller('inventarioMobController.php');
    ficha_actualizar();
});

Router::post('ficha_eliminar', function () {
    load_controller('inventarioMobController.php');
    ficha_eliminar();
});
