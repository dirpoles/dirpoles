<?php
// app/Controllers/sseController.php

use App\Models\NotificacionesModel;

function streamNotificaciones() {
    // Habilitar logging detallado
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('log_errors', 1);
    
    // Headers específicos para SSE
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('X-Accel-Buffering: no');
    
    // Desactivar compresión
    if (function_exists('apache_setenv')) {
        apache_setenv('no-gzip', '1');
    }
    
    // Configurar para conexión persistente
    set_time_limit(0);
    ignore_user_abort(true);
    
    // Iniciar sesión solo si no está activa
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $id_empleado = $_SESSION['id_empleado'] ?? null;
    
    if (!$id_empleado) {
        echo "event: error\n";
        echo "data: {\"mensaje\": \"No autenticado\"}\n\n";
        flush();
        exit();
    }
    
    $session_id = session_id();
    session_write_close();
    
    // Obtener último ID del parámetro GET
    $ultimoId = isset($_GET['ultimoId']) ? intval($_GET['ultimoId']) : 0;
    
    $modelo = new NotificacionesModel();
    $iteracion = 0;
    
    /* 
    error_log("====== SSE INICIANDO ======");
    error_log("Usuario: $id_empleado");
    error_log("Session: $session_id");
    error_log("Último ID recibido: $ultimoId");
    error_log("==========================");
    */
    
    // Buffer de salida
    if (ob_get_level() == 0) ob_start();
    
    while (true) {
        // Verificar si el cliente se desconectó
        if (connection_aborted()) {
            error_log("SSE: Cliente $id_empleado desconectado");
            break;
        }
        
        try {
            // Configurar modelo
            $modelo->__set('id_empleado', $id_empleado);
            $modelo->__set('ultimoId', $ultimoId);
            
            // Obtener nuevas notificaciones
            $nuevas = $modelo->manejarAccion('obtenerNuevasSSE');
            
            if (!empty($nuevas)) {
                error_log("SSE: Enviando " . count($nuevas) . " notificaciones para usuario $id_empleado");
                
                foreach ($nuevas as $notif) {
                    // Actualizar último ID con el MAYOR valor
                    if ($notif['id'] > $ultimoId) {
                        $ultimoId = $notif['id'];
                        error_log("SSE: Actualizando último ID a: $ultimoId");
                    }
                    
                    // DEBUG: Log de cada notificación
                    error_log("SSE: Enviando notificación ID {$notif['id']} - {$notif['titulo']}");
                    
                    // Enviar evento
                    echo "event: nueva-notificacion\n";
                    echo "data: " . json_encode($notif) . "\n\n";
                    
                    // Forzar envío inmediato
                    if (ob_get_level() > 0) {
                        ob_flush();
                    }
                    flush();
                    
                    // Pequeña pausa para no saturar
                    usleep(50000); // 50ms
                }
                
                error_log("SSE: Notificaciones enviadas, último ID ahora: $ultimoId");
            } else {
                /*
                if ($iteracion % 10 == 0) {
                    error_log("SSE: No hay notificaciones nuevas para usuario $id_empleado (último ID: $ultimoId)");
                }
                */
            }
            
            // Heartbeat cada 15 segundos (para mantener conexión)
            if ($iteracion % 5 === 0) {
                echo ": heartbeat\n\n";
                if (ob_get_level() > 0) ob_flush();
                flush();
            }
            
        } catch (Exception $e) {
            error_log("SSE ERROR: " . $e->getMessage());
            error_log("SSE TRACE: " . $e->getTraceAsString());
            
            // Enviar error al cliente
            echo "event: error\n";
            echo "data: {\"mensaje\": \"Error interno\", \"detalle\": \"" . addslashes($e->getMessage()) . "\"}\n\n";
            if (ob_get_level() > 0) ob_flush();
            flush();
        }
        
        // Esperar 2 segundos (reducido para mejor tiempo real)
        sleep(2);
        $iteracion++;
        
        /*
        if ($iteracion % 15 === 0) {
            error_log("SSE: Usuario $id_empleado - Iteración $iteracion - Último ID: $ultimoId");
        }
        */
        
        // Prevenir loops infinitos (máximo 1 hora)
        if ($iteracion > 1800) { // 2 segundos * 1800 = 1 hora
            error_log("SSE: Límite de tiempo alcanzado para usuario $id_empleado");
            break;
        }
    }
    
    // error_log("SSE: Finalizado para usuario $id_empleado después de $iteracion iteraciones");
}