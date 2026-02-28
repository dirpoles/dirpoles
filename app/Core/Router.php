<?php
namespace App\Core;

class Router {
    // Atributos estáticos en español
    private static $rutas = [];
    private static $middlewaresAntes = [];
    private static $middlewaresDespues = [];
    private static $rutaNoEncontrada = null;
    private static $metodoNoPermitido = null;

    /**
     * Middleware que se ejecuta ANTES de las rutas
     */
    public static function antes($metodos, $patron, $manejador) {
        self::$middlewaresAntes[] = [
            'metodos' => $metodos,
            'patron' => $patron,
            'manejador' => $manejador
        ];
    }

    /**
     * Registrar ruta GET
     */
    public static function get($patron, $manejador) {
        self::agregarRuta('GET', $patron, $manejador);
    }

    /**
     * Registrar ruta POST
     */
    public static function post($patron, $manejador) {
        self::agregarRuta('POST', $patron, $manejador);
    }

    /**
     * Registrar ruta PUT
     */
    public static function put($patron, $manejador) {
        self::agregarRuta('PUT', $patron, $manejador);
    }

    /**
     * Registrar ruta DELETE
     */
    public static function delete($patron, $manejador) {
        self::agregarRuta('DELETE', $patron, $manejador);
    }

    /**
     * Agregar una ruta a la colección
     */
    private static function agregarRuta($metodo, $patron, $manejador) {
        self::$rutas[] = [
            'metodo' => $metodo,
            'patron' => $patron,
            'manejador' => $manejador
        ];
    }

    /**
     * Manejar cuando no se encuentra la ruta
     */
    public static function rutaNoEncontrada($manejador) {
        self::$rutaNoEncontrada = $manejador;
    }

    /**
     * Manejar cuando el método no está permitido
     */
    public static function metodoNoPermitido($manejador) {
        self::$metodoNoPermitido = $manejador;
    }

    /**
     * Ejecutar el router - punto de entrada principal
     */
    public static function ejecutar() {
        // Obtener método HTTP y ruta solicitada
        $metodoSolicitud = $_SERVER['REQUEST_METHOD'];
        $rutaSolicitada = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Calcular ruta base del proyecto
        $rutaBase = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
        $rutaRelativa = substr($rutaSolicitada, strlen($rutaBase));
        
        // Limpiar y normalizar la ruta
        $rutaLimpia = trim($rutaRelativa, '/') ?: 'login';
        
        // Ejecutar middlewares ANTES de procesar la ruta
        self::ejecutarMiddlewares(self::$middlewaresAntes, $metodoSolicitud, $rutaLimpia);
        
        // Buscar ruta que coincida
        $rutaEncontrada = false;
        $metodoPermitido = false;

        foreach (self::$rutas as $ruta) {
            // Verificar si el patrón coincide con la ruta solicitada
            if ($ruta['patron'] === $rutaLimpia || self::coincidePatron($ruta['patron'], $rutaLimpia)) {
                $rutaEncontrada = true;
                
                // Verificar si el método coincide
                if ($ruta['metodo'] === $metodoSolicitud || $ruta['metodo'] === 'ALL') {
                    $metodoPermitido = true;
                    // Ejecutar el manejador de la ruta
                    call_user_func($ruta['manejador']);
                    break;
                }
            }
        }

        // Manejar casos de error
        if (!$rutaEncontrada && self::$rutaNoEncontrada) {
            call_user_func(self::$rutaNoEncontrada);
        } elseif ($rutaEncontrada && !$metodoPermitido && self::$metodoNoPermitido) {
            call_user_func(self::$metodoNoPermitido);
        }
    }

    /**
     * Verificar si un patrón coincide con una ruta
     * Ejemplo: 'usuario/{id}' coincide con 'usuario/25'
     */
    private static function coincidePatron($patron, $ruta) {
        // Convertir patrones con parámetros a expresiones regulares
        $patronRegex = preg_replace('/\{[^}]+\}/', '[^/]+', $patron);
        return preg_match("#^{$patronRegex}$#", $ruta);
    }

    /**
     * Ejecutar todos los middlewares aplicables
     */
    private static function ejecutarMiddlewares($middlewares, $metodo, $ruta) {
        foreach ($middlewares as $middleware) {
            $metodosMiddleware = $middleware['metodos'];
            $patronMiddleware = $middleware['patron'];
            
            // Verificar si el middleware aplica para este método y ruta
            if (($metodosMiddleware === 'ALL' || $metodosMiddleware === $metodo) && 
                ($patronMiddleware === '.*' || self::coincidePatron($patronMiddleware, $ruta))) {
                call_user_func($middleware['manejador']);
            }
        }
    }
}