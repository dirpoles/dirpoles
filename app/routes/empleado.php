<?php

use App\Core\Router;

// ==================== RUTAS PROTEGIDAS (empleados) ====================

Router::get('crear_empleado', function () {
    load_controller('empleadoController.php');
    showView();
});

Router::post('validar_cedula', function () {
    load_controller('empleadoController.php');
    validar_cedula();
});

Router::post('validar_correo', function () {
    load_controller('empleadoController.php');
    validar_correo();
});

Router::post('validar_telefono', function () {
    load_controller('empleadoController.php');
    validar_telefono();
});

Router::post('empleado_registrar', function () {
    load_controller('empleadoController.php');
    empleado_registrar();
});

Router::get('consultar_empleados', function () {
    load_controller('empleadoController.php');
    showList();
});

Router::get('data_empleados_json', function () {
    load_controller('empleadoController.php');
    consultar_empleados();
});

Router::get('empleado_detalle', function () {
    load_controller('empleadoController.php');
    empleado_detalle();
});

Router::get('empleado_detalle_editar', function () {
    load_controller('empleadoController.php');
    empleado_detalle_editar();
});

Router::post('actualizar_empleado', function () {
    load_controller('empleadoController.php');
    empleado_actualizar();
});

Router::post('empleado_eliminar', function () {
    load_controller('empleadoController.php');
    empleado_eliminar();
});

Router::get('psicologos_data_json', function () {
    load_controller('empleadoController.php');
    psicologos_data_json();
});

Router::get('obtener_horario_psicologo', function () {
    load_controller('empleadoController.php');
    obtener_horario_psicologo();
});
