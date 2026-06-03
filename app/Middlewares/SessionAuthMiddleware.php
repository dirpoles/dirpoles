<?php

namespace App\Middlewares;

use App\Core\JwtHandler;

class SessionAuthMiddleware
{
    /**
     * Maneja la validación de sesión, estatus, JWT e integridad.
     */
    public static function handle()
    {
        $rutasPublicas = ['', 'login', 'iniciar_sesion', 'error', 'logout', 'api/movil'];

        // Obtener ruta solicitada
        $rutaSolicitada = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Sincronizar con la lógica de limpieza del Router
        $rutaBase = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
        $rutaRelativa = substr($rutaSolicitada, strlen($rutaBase));
        $rutaActual = trim($rutaRelativa, '/') ?: 'login';

        // 1. SI ES RUTA PÚBLICA O EL ROOT, SALIR INMEDIATAMENTE
        if (in_array($rutaActual, $rutasPublicas) || $rutaRelativa === '' || $rutaRelativa === '/') {
            return;
        }

        // 1.5 IGNORAR ARCHIVOS ESTÁTICOS FALTANTES (ej. sourcemaps .map, imágenes, etc.)
        if (preg_match('/\.(js|css|map|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i', $rutaActual)) {
            return;
        }

        // 2. VALIDACIÓN DE SESIÓN
        if (!isset($_SESSION['id_empleado'])) {
            self::redirigirLogin('Debes iniciar sesión primero', 'Acceso denegado');
        }

        // 3. VALIDACIÓN DE ESTATUS (BLOQUEO)
        if (isset($_SESSION['estatus']) && $_SESSION['estatus'] == 0) {
            $msg = 'Tu cuenta ha sido desactivada. Contacta al administrador.';
            unset($_SESSION['id_empleado']);
            unset($_SESSION['nombre']);
            unset($_SESSION['estatus']);
            self::redirigirLogin($msg, 'Cuenta bloqueada');
        }

        // 4. VERIFICACIÓN DUAL (JWT)
        $jwtToken = JwtHandler::obtenerToken();
        $jwtHandler = new JwtHandler();
        $jwtHandler->__set('token', $jwtToken);
        $validacion = $jwtHandler->manejarAccion('validar');

        if ($validacion['estado'] !== 'exito') {
            error_log("Fallo de validación JWT para ruta: " . $rutaActual . " - Razon: " . ($validacion['mensaje'] ?? 'Sin mensaje'));

            unset($_SESSION['id_empleado']);
            unset($_SESSION['nombre']);

            setcookie('jwt_token', '', time() - 3600, '/');

            self::redirigirLogin('Error de validación de seguridad (JWT). Por favor, inicie sesión de nuevo.', 'Error de Seguridad');
        }

        // 5. INTEGRIDAD DE DATOS (Sesión vs JWT)
        if ($validacion['data']['id_empleado'] != $_SESSION['id_empleado']) {
            error_log("Discrepancia detectada: JWT id_empleado (" . $validacion['data']['id_empleado'] . ") vs SESIÓN id_empleado (" . $_SESSION['id_empleado'] . ")");

            unset($_SESSION['id_empleado']);
            unset($_SESSION['nombre']);

            setcookie('jwt_token', '', time() - 3600, '/');

            self::redirigirLogin('Se ha detectado una inconsistencia en su sesión.', 'Fallo de Integridad');
        }
    }

    /**
     * Redirección simple al login con mensaje
     */
    protected static function redirigirLogin($mensaje, $titulo)
    {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            header('Content-Type: application/json');
            echo json_encode([
                'estado' => 'error',
                'mensaje' => $mensaje,
                'redireccion' => BASE_URL . 'login'
            ]);
            exit();
        }

        $_SESSION['mensaje_redireccion'] = json_encode([
            'estado' => 'error',
            'titulo' => $titulo,
            'mensaje' => $mensaje
        ]);
        header('Location: ' . BASE_URL . 'login');
        exit();
    }
}
