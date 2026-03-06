<?php
// app/Controllers/AyudaController.php

/**
 * Controlador para el módulo de Ayuda
 */
function index()
{
    // Obtener nombre del usuario de la sesión
    $nombre_completo = "Usuario";
    if (isset($_SESSION['nombre']) && isset($_SESSION['apellido'])) {
        $nombre_completo = $_SESSION['nombre'] . ' ' . $_SESSION['apellido'];
    }

    $data = [
        'titulo_pagina' => 'Centro de Ayuda - DIRPOLES 4',
        'nombre_usuario' => $nombre_completo
    ];

    extract($data);
    include BASE_PATH . 'app/Views/ayuda/ayuda.php';
}
