<?php
use App\Core\Router;

//=============================== (Eventos Calendar) =============================

Router::get('obtener_eventos_calendario', function() {
    load_controller('calendarioController.php');
    obtener_eventos_calendario();
});

Router::post('guardar_evento_calendario', function() {
    load_controller('calendarioController.php');
    guardar_evento_calendario();
});

Router::post('actualizar_evento_calendario', function() {
    load_controller('calendarioController.php');
    actualizar_evento_calendario();
});

Router::post('eliminar_evento_calendario', function() {
    load_controller('calendarioController.php');
    eliminar_evento_calendario();
});