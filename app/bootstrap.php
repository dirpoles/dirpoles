<?php
// app/bootstrap.php

require_once __DIR__ . '/Core/Database.php';

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', BASE_PATH . '/logs/php_errors.log');

require_once __DIR__ . '/Helpers/sidebar_helper.php';

// ---------------------------------------------------------
// CONFIGURACIÓN PARA CARGA DE CONTROLADORES
// ---------------------------------------------------------

// Control: si true, fuerza precarga de TODOS los controladores al iniciar.
// Recomendado: false en desarrollo; true en producción si usas OPcache.

/**
 * Helper: carga perezosa de un controlador por nombre de archivo.
 * path relativo dentro de app/controllers, por ejemplo 'beneficiarioController.php'
 *
 * Uso:
 *   load_controller('beneficiarioController.php');
 */
function load_controller(string $file) : void {
    static $loaded = [];

    // Normalizar path
    $file = ltrim($file, '/\\');
    $path = rtrim(BASE_PATH, '/\\') . '/app/controllers/' . $file;

    if (isset($loaded[$path])) {
        // ya cargado
        return;
    }

    if (is_readable($path)) {
        require_once $path;
        $loaded[$path] = true;
        return;
    }

    // fallback: lanza excepción para detectar errores temprano
    throw new \RuntimeException("Controlador no encontrado o no legible: {$path}");
}

/**
 * Pre-carga todos los controladores (usa glob).
 * Útil en entornos donde prefieres evitar la carga condicional (p. ej. producción + OPcache).
 */
function preload_all_controllers(): void {
    foreach (glob(rtrim(BASE_PATH, '/\\') . '/app/controllers/*.php') as $controlador) {
        require_once $controlador;
    }
}

// Si se desea precargar, lo ejecutamos aquí.
if (PRELOAD_CONTROLLERS) {
    preload_all_controllers();
}

// ---------------------------------------------------------
// FIN bootstrap.php
// ---------------------------------------------------------
