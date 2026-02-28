<?php
use App\Core\Router;

//==================== Rutas del Perfil ==========================

Router::get('perfil_detalle', function(){
    load_controller('perfilController.php');
    perfil_detalle();
});

Router::post('perfil_actualizar', function(){
    load_controller('perfilController.php');
    perfil_actualizar();
});

Router::post('validar_clave_actual', function(){
    load_controller('perfilController.php');
    validar_clave_actual();
});
