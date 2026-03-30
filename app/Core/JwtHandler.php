<?php

namespace App\Core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Throwable;

class JwtHandler
{
    private $atributos = [];

    public function __set($nombre, $valor)
    {
        $this->atributos[$nombre] = $valor;
    }

    public function __get($atributo)
    {
        return isset($this->atributos[$atributo]) ? $this->atributos[$atributo] : null;
    }

    /**
     * Extrae el token JWT del entorno (Header Authorization o Cookie).
     * @return string|null
     */
    public static function obtenerToken()
    {
        // 1. Intentar desde el encabezado Authorization (Bearer <token>)
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        // 2. Intentar desde la cookie
        return $_COOKIE['jwt_token'] ?? null;
    }

    /**
     * Controlador de acciones de la clase.
     * Sigue la estructura estándar del sistema DIRPOLES_4.
     */
    public function manejarAccion($accion)
    {
        switch ($accion) {
            case 'generar':
                return $this->generarToken();
            case 'validar':
                return $this->validarToken();
            default:
                throw new Exception("Acción no reconocida: $accion");
        }
    }

    /**
     * Genera un nuevo token JWT basado en los atributos seteados.
     */
    private function generarToken()
    {
        try {
            $issuedAt = time();
            $expire = $issuedAt + (int)JWT_EXP;

            $payload = [
                'iat'  => $issuedAt,                          // Tiempo en que se emitió el token
                'exp'  => $expire,                            // Tiempo de expiración
                'data' => $this->__get('data') ?? []          // Datos del usuario (id, nombre, etc)
            ];

            $jwt = JWT::encode($payload, JWT_SECRET, 'HS256');

            return [
                'estado' => 'exito',
                'token' => $jwt,
                'expiracion' => $expire
            ];
        } catch (Throwable $e) {
            error_log("Error al generar JWT: " . $e->getMessage());
            return [
                'estado' => 'error',
                'mensaje' => 'No se pudo generar el token de seguridad.'
            ];
        }
    }

    /**
     * Valida un token JWT proporcionado.
     */
    private function validarToken()
    {
        try {
            $token = $this->__get('token');
            if (!$token) {
                return ['estado' => 'error', 'mensaje' => 'Token no proporcionado'];
            }

            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));

            return [
                'estado' => 'exito',
                'data' => (array) $decoded->data
            ];
        } catch (Throwable $e) {
            error_log("Error al validar JWT: " . $e->getMessage());
            return [
                'estado' => 'error',
                'mensaje' => 'Token inválido o expirado.'
            ];
        }
    }
}
