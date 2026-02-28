<?php
const BASE_PATH = __DIR__ . '/';
const BASE_URL = '/DIRPOLES_4/';

session_start();

require_once BASE_PATH . 'app/Config/config.php';
require_once BASE_PATH . 'app/bootstrap.php';
require_once BASE_PATH . 'vendor/autoload.php';
require_once BASE_PATH . 'app/routes.php';

//Ejecutar el Router

\App\Core\Router::ejecutar();
