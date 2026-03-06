<?php
// app/routes/ayuda.php
use App\Core\Router;

Router::get('ayuda', function () {
    load_controller('AyudaController.php');
    index();
});
