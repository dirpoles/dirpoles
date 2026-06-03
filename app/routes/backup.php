<?php
use App\Core\Router;

// ======================= (RESPALDO Y BACKUP) =========================

Router::get('respaldo', function() {
    load_controller('backupController.php');
    mostrarVistaRespaldo();
});

Router::get('respaldo/descargar', function() {
    load_controller('backupController.php');
    descargarRespaldo();
});
