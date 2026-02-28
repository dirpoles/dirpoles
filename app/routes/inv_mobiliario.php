<?php

use App\Core\Router;

//=========================(Rutas del inventario mobiliario y equipos) =========================

Router::get('crear_inventario_mob', function () {
    load_controller('inventarioMobController.php');
    crear_inventario_mob();
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
