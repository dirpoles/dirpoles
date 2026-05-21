<?php

/**
 * Controlador principal para las peticiones de la App Móvil.
 * Actúa como un enrutador (Router) modular.
 *
 * Ruta: POST /DIRPOLES_4/api/movil
 * Body (JSON): { "modulo": "beneficiarios", "accion": "consultar_beneficiarios", ... }
 */

function manejarPeticionMovil()
{
    // 1. Content-Type (CORS ahora es manejado globalmente en index.php)
    header('Content-Type: application/json; charset=utf-8');

    // 2. Leer el JSON que manda la app
    $rawBody = file_get_contents('php://input');
    $datos = json_decode($rawBody, true);

    if (json_last_error() !== JSON_ERROR_NONE || !isset($datos['accion'])) {
        http_response_code(400);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Petición inválida: se requiere el campo "accion" en el JSON.'
        ]);
        exit;
    }

    // 3. Determinar el módulo a cargar
    $modulo = $datos['modulo'] ?? null;
    $accion = $datos['accion'];

    // 4. Incluir el helper de Auth para que esté disponible globalmente
    // ya que verificarTokenMovil() es usado por varios módulos.
    require_once __DIR__ . '/Movil/General.php';

    // 5. Enrutar según el módulo
    switch (strtolower($modulo)) {
        case 'beneficiarios':
            require_once __DIR__ . '/Movil/Beneficiarios.php';
            procesarBeneficiarios($datos);
            break;

        case 'general':
            procesarGeneral($datos);
            break;

        case 'citas':
            require_once __DIR__ . '/Movil/Citas.php';
            procesarCitas($datos);
            break;

        case 'inventario':
            require_once __DIR__ . '/Movil/Inventario.php';
            procesarInventario($datos);
            break;

        case 'perfil':
            require_once __DIR__ . '/Movil/Perfil.php';
            procesarPerfil($datos);
            break;

        case 'reportes':
            require_once __DIR__ . '/Movil/Reportes.php';
            procesarReportes($datos);
            break;

        default:
            http_response_code(404);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => "Módulo '{$modulo}' no reconocido."
            ]);
            exit;
    }
}