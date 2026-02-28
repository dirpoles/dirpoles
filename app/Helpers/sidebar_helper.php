<?php
// app/Helpers/sidebar_helper.php

/**
 * Verifica si el usuario actual tiene acceso a un módulo
 * @param int $id_modulo ID del módulo a verificar
 * @param array $permisos Array de permisos desde el controlador
 * @return bool
 */
function tieneAccesoModulo(int $id_modulo, array $permisos): bool {
    return isset($permisos[$id_modulo]);
}

/**
 * Obtiene el nombre del módulo para mostrar en el sidebar
 * @param int $id_modulo ID del módulo
 * @param array $permisos Array de permisos
 * @return string Nombre del módulo o string vacío
 */
function nombreModulo(int $id_modulo, array $permisos): string {
    return $permisos[$id_modulo]['nombre'] ?? '';
}