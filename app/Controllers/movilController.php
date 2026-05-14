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
    // 1. Cabeceras CORS para permitir peticiones desde la app
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
    header('Content-Type: application/json; charset=utf-8');

    // Pre-flight OPTIONS (Axios manda esto antes de cada petición real)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

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
            // General.php ya fue incluido arriba
            procesarGeneral($datos);
            break;

        case 'citas':
            require_once __DIR__ . '/Movil/Citas.php';
            procesarCitas($datos);
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