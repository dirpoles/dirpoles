<?php

namespace App\Core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Throwable;
use PDO;

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
     * Obtiene conexión a la BD de seguridad
     */
    private function getSecurityConnection()
    {
        static $pdo = null;
        if ($pdo === null) {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_SECURITY_NAME . ";charset=utf8mb4",
                DB_SECURITY_USER,
                DB_SECURITY_PASS
            );
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return $pdo;
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
     * Obtiene el refresh token de la cookie
     */
    public static function obtenerRefreshToken()
    {
        return $_COOKIE['refresh_token'] ?? null;
    }

    /**
     * Controlador de acciones de la clase.
     */
    public function manejarAccion($accion)
    {
        switch ($accion) {
            case 'generar':
                return $this->generarToken();
            case 'validar':
                return $this->validarToken();
            case 'generar_refresh':
                return $this->generarRefreshToken();
            case 'renovar_jwt':
                return $this->renovarJWT();
            case 'revocar_refresh':
                return $this->revocarRefreshToken();
            case 'limpiar_tokens':
                return $this->limpiarTokensExpirados();
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
                'iat'  => $issuedAt,
                'exp'  => $expire,
                'data' => $this->__get('data') ?? []
            ];

            $keyPath = BASE_PATH . 'app/Config/Keys/jwt_private.pem';
            if (!file_exists($keyPath)) {
                throw new Exception("Llave privada JWT no encontrada.");
            }
            $privateKey = file_get_contents($keyPath);

            $jwt = JWT::encode($payload, $privateKey, 'RS256');

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
     * Genera un refresh token y lo almacena en la BD
     */
    private function generarRefreshToken()
    {
        try {
            $id_empleado = $this->__get('id_empleado');
            if (!$id_empleado) {
                throw new Exception("id_empleado es requerido para generar refresh token.");
            }

            // Generar token aleatorio seguro
            $token = bin2hex(random_bytes(64));
            $expiresAt = date('Y-m-d H:i:s', time() + (int)REFRESH_EXP);

            // Almacenar en BD
            $pdo = $this->getSecurityConnection();
            $stmt = $pdo->prepare(
                "INSERT INTO refresh_tokens (id_empleado, token, expires_at) 
                 VALUES (:id_empleado, :token, :expires_at)"
            );
            $stmt->execute([
                ':id_empleado' => $id_empleado,
                ':token' => $token,
                ':expires_at' => $expiresAt
            ]);

            return [
                'estado' => 'exito',
                'token' => $token,
                'expiracion' => time() + (int)REFRESH_EXP
            ];
        } catch (Throwable $e) {
            error_log("Error al generar refresh token: " . $e->getMessage());
            return [
                'estado' => 'error',
                'mensaje' => 'No se pudo generar el refresh token.'
            ];
        }
    }

    /**
     * Renueva el JWT usando un refresh token válido
     */
    private function renovarJWT()
    {
        try {
            $refreshToken = $this->__get('refresh_token');
            if (!$refreshToken) {
                return ['estado' => 'error', 'mensaje' => 'Refresh token no proporcionado'];
            }

            $pdo = $this->getSecurityConnection();

            // Verificar que el refresh token existe, no está revocado y no ha expirado
            $stmt = $pdo->prepare(
                "SELECT id_empleado, expires_at FROM refresh_tokens 
                 WHERE token = :token AND revoked = 0 AND expires_at > NOW()"
            );
            $stmt->execute([':token' => $refreshToken]);
            $record = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$record) {
                return ['estado' => 'error', 'mensaje' => 'Refresh token inválido o expirado'];
            }

            // Generar nuevo JWT
            $jwtHandler = new JwtHandler();
            $jwtHandler->__set('data', [
                'id_empleado' => $record['id_empleado']
            ]);
            $jwtResult = $jwtHandler->manejarAccion('generar');

            if ($jwtResult['estado'] !== 'exito') {
                return $jwtResult;
            }

            return [
                'estado' => 'exito',
                'token' => $jwtResult['token'],
                'expiracion' => $jwtResult['expiracion']
            ];
        } catch (Throwable $e) {
            error_log("Error al renovar JWT: " . $e->getMessage());
            return [
                'estado' => 'error',
                'mensaje' => 'Error al renovar el token.'
            ];
        }
    }

    /**
     * Revoca un refresh token (lo marca como usado)
     */
    private function revocarRefreshToken()
    {
        try {
            $token = $this->__get('refresh_token');
            if (!$token) {
                return ['estado' => 'error', 'mensaje' => 'Token no proporcionado'];
            }

            $pdo = $this->getSecurityConnection();
            $stmt = $pdo->prepare(
                "UPDATE refresh_tokens SET revoked = 1 WHERE token = :token"
            );
            $stmt->execute([':token' => $token]);

            return ['estado' => 'exito', 'mensaje' => 'Refresh token revocado'];
        } catch (Throwable $e) {
            error_log("Error al revocar refresh token: " . $e->getMessage());
            return ['estado' => 'error', 'mensaje' => 'Error al revocar token'];
        }
    }

    /**
     * Limpia tokens expirados o revocados de la BD
     */
    private function limpiarTokensExpirados()
    {
        try {
            $pdo = $this->getSecurityConnection();
            $stmt = $pdo->prepare(
                "DELETE FROM refresh_tokens WHERE expires_at < NOW() OR revoked = 1"
            );
            $stmt->execute();
            $eliminados = $stmt->rowCount();

            return [
                'estado' => 'exito',
                'mensaje' => "$eliminados tokens eliminados"
            ];
        } catch (Throwable $e) {
            error_log("Error al limpiar tokens: " . $e->getMessage());
            return ['estado' => 'error', 'mensaje' => 'Error al limpiar tokens'];
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

            $keyPath = BASE_PATH . 'app/Config/Keys/jwt_public.pem';
            if (!file_exists($keyPath)) {
                throw new Exception("Llave pública JWT no encontrada.");
            }
            $publicKey = file_get_contents($keyPath);

            $decoded = JWT::decode($token, new Key($publicKey, 'RS256'));

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
