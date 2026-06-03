<?php
/**
 * Helper para comunicarse con el microservicio de IA.
 *
 * Uso:
 *   $ia = new MicroservicioIA();
 *   $resultado = $ia->analizar('general', $datosDelReporte);
 */
class MicroservicioIA
{
    private $baseUrl;
    private $apiKey;

    public function __construct()
    {
        $this->baseUrl = 'http://localhost:8000/api/v1';
        $this->apiKey = $_ENV['IA_API_KEY'] ?? '';
    }

    /**
     * Envía datos de un reporte al microservicio para análisis
     * 
     * @param string $tipoReporte Tipo de reporte
     * @param array $datos Datos del reporte
     * @param string|null $fechaInicio Fecha de inicio (opcional)
     * @param string|null $fechaFin Fecha fin (opcional)
     * @return array  Resultado del análisis
     */
    public function analizar($tipoReporte, $datos, $fechaInicio = null, $fechaFin = null)
    {
        $payload = [
            'tipo_reporte' => $tipoReporte,
            'datos' => $datos,
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin
        ];

        return $this->hacerPeticion('POST', '/analizar', $payload);
    }


    /**
     * Verifica si el microservicio está activo.
     */
    public function estaActivo(): bool
    {
        try {
            $resultado = $this->hacerPeticion('GET', '/../health');
            return isset($resultado['estado']) && $resultado['estado'] === 'activo';
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Método privado que realiza la petición HTTP al microservicio.
     * Usa cURL (librería incluida con PHP/XAMPP).
     */
    private function hacerPeticion(string $metodo, string $endpoint, ?array $datos = null): array
    {
        $url = $this->baseUrl . $endpoint;

        // Inicializar cURL
        // cURL es una herramienta de PHP para hacer peticiones HTTP
        // (como un fetch() pero desde el backend)
        $ch = curl_init();

        // Configurar la petición
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Devolver la respuesta como string
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // Timeout de 30 segundos
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'X-API-Key: ' . $this->apiKey
        ]);

        if ($metodo === 'POST' && $datos !== null) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datos));
        }

        // Ejecutar la petición
        $respuesta = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        // Verificar errores de conexión
        if ($error) {
            throw new \RuntimeException(
                "No se pudo conectar con el microservicio de IA. " .
                "Verifique que esté corriendo en {$this->baseUrl}. Error: {$error}"
            );
        }

        // Decodificar la respuesta JSON
        $resultado = json_decode($respuesta, true);

        if ($httpCode >= 400) {
            throw new \RuntimeException(
                "El microservicio devolvió un error (HTTP {$httpCode}): " .
                ($resultado['detail']['mensaje'] ?? $respuesta)
            );
        }

        return $resultado;
    }
}