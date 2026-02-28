<?php

use App\Core\Router;

// ==================== RUTAS PROTEGIDAS (beneficiarios) ====================
Router::get('crear_beneficiario', function () {
    load_controller('beneficiarioController.php');
    crear_beneficiario();
});

Router::post('beneficiario_registrar', function () {
    load_controller('beneficiarioController.php');
    beneficiario_registrar();
});

Router::get('consultar_beneficiarios', function () {
    load_controller('beneficiarioController.php');
    consultar_beneficiarios();
});

Router::get('beneficiarios_data_json', function () {
    load_controller('beneficiarioController.php');
    beneficiarios_data_json();
});

Router::get('beneficiarios_activos_data_json', function () {
    load_controller('beneficiarioController.php');
    beneficiarios_activos_data_json();
});

Router::get('beneficiario_detalle', function () {
    load_controller('beneficiarioController.php');
    beneficiario_detalle();
});

Router::get('beneficiario_detalle_editar', function () {
    load_controller('beneficiarioController.php');
    beneficiario_detalle_editar();
});

Router::post('beneficiario_actualizar', function () {
    load_controller('beneficiarioController.php');
    beneficiario_actualizar();
});

Router::post('beneficiario_eliminar', function () {
    load_controller('beneficiarioController.php');
    beneficiario_eliminar();
});
