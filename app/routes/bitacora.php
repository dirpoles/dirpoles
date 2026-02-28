<?php
use App\Core\Router;

//=================BITACORA ====================

Router::get('consultar_bitacora', function() {
    load_controller('bitacoraController.php');
    consultar_bitacora();
});

Router::get('bitacora_data_json', function() {
    load_controller('bitacoraController.php');
    bitacora_data_json();
});