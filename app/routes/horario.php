<?php
use App\Core\Router;

Router::get("crear_horario", function () {
    load_controller('horarioController.php');
    crear_horario();
});

Router::get('consultar_horarios', function () {
    load_controller('horarioController.php');
    consultar_horarios();
});

Router::post('validar_dia_horario', function() {
    load_controller('horarioController.php');
    validar_dia_horario();
});

Router::post('registrar_horario', function() {
    load_controller('horarioController.php');
    registrar_horario();
});

Router::get('horarios_data_json', function(){
    load_controller('horarioController.php');
    horarios_data_json();
});

Router::get('horario_detalle_editar', function(){
    load_controller('horarioController.php');
    horario_detalle_editar();
});

Router::post('actualizar_horario', function(){
    load_controller('horarioController.php');
    actualizar_horario();
});

Router::post('eliminar_horario', function(){
    load_controller('horarioController.php');
    eliminar_horario();
});

Router::get('horarios_calendario_json', function(){
    load_controller('horarioController.php');
    horarios_calendario_json();
});
