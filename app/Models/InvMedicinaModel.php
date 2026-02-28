<?php
namespace App\Models;
use App\Models\BusinessModel;
use Exception;
use Throwable;
use PDO;

class InvMedicinaModel extends BusinessModel {
    private $atributos = [];

    public function __set($nombre, $valor){
        $valor = \is_string($valor) ? trim($valor) : $valor;

        if ($nombre === 'nombre_insumo') {
            $valor = mb_convert_case($valor, MB_CASE_TITLE, "UTF-8");
        }
        
        if ($nombre === 'descripcion') {
            $valor = ucfirst(mb_strtolower($valor, "UTF-8"));
        }

        $validaciones = [
            'nombre_insumo' => fn($v) => !empty($v) && preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\.\-]{2,100}$/u', $v),
            'tipo_insumo' => fn($v) => !empty($v) && in_array($v, ['Medicamento', 'Material', 'Quirúrgico']), // Ajustar según los tipos reales
            'id_presentacion' => fn($v) => is_numeric($v) && $v > 0,
            'fecha_vencimiento' => fn($v) => !empty($v) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $v),
            'estatus' => fn($v) => \in_array($v, ['Agotado', 'Activo', 'Vencido']),
            'descripcion' => fn($v) => !empty($v) && preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s,.\-#]{2,250}$/u', $v),
            'cantidad' => fn($v) => is_numeric($v) && $v >= 0,
            'id_empleado' => fn($v) => is_numeric($v) && $v > 0,
            'id_insumo' => fn($v) => is_numeric($v) && $v > 0
        ];

        // Validar solo si existe una regla definida para el atributo
        if (isset($validaciones[$nombre])) {
            if (!$validaciones[$nombre]($valor)) {
                throw new Exception("Valor inválido para el campo: $nombre");
            }
        }

        $this->atributos[$nombre] = $valor;
    }

    public function __get($name){
        return $this->atributos[$name];
    }

    public function manejarAccion($action){
        switch($action){
            case 'obtenerPresentaciones':
                return $this->obtenerPresentaciones();

            case 'obtenerEstadisticas':
                return $this->obtenerEstadisticas();

            case 'registrar_insumo':
                return $this->registrar_insumo();

            case 'actualizar_insumo':
                return $this->actualizarInsumo();

            case 'eliminar_insumo':
                return $this->inventario_eliminar();

            case 'consultar_inventario':
                return $this->consultar_inventario();

            case 'consultar_movimientos':
                return $this->consultar_movimientos();

            case 'obtenerInsumosValidos':
                return $this->obtenerInsumosValidos();

            case 'registrar_entrada':
                return $this->registrar_entrada();

            case 'obtener_insumo_entrada':
                return $this->obtener_insumo_entrada();

            case 'obtenerInsumosParaSalida':
                return $this->obtenerInsumosParaSalida();

            case 'obtenerInsumosParaSalidaDiagnosticos':
                return $this->obtenerInsumosParaSalidaDiagnosticos();

            case 'registrar_salida':
                return $this->registrar_salida();

            case 'inventario_detalle':
                return $this->inventario_detalle();

            default:
                throw new Exception('Acción no permitida');
        }
    }

    private function obtenerPresentaciones(){
        try{
            $query = "SELECT * FROM presentacion_insumo";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(Throwable $e){
            return [];
        }
    }

    private function obtenerEstadisticas(){
        try{
            // Total insumos
            $queryTotal = "SELECT COUNT(*) as total FROM insumos";
            $stmtTotal = $this->conn->query($queryTotal);
            $total = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];

            // Insumos Activos
            $queryActivos = "SELECT COUNT(*) as total FROM insumos WHERE estatus = 'Disponible'";
            $stmtActivos = $this->conn->query($queryActivos);
            $activos = $stmtActivos->fetch(PDO::FETCH_ASSOC)['total'];

            // Por Vencer (30 días)
            $queryVencer = "SELECT COUNT(*) as total FROM insumos WHERE fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
            $stmtVencer = $this->conn->query($queryVencer);
            $vencer = $stmtVencer->fetch(PDO::FETCH_ASSOC)['total'];

            // Stock Crítico (< 10 y activo)
            $queryCritico = "SELECT COUNT(*) as total FROM insumos WHERE cantidad < 10 AND estatus = 'Disponible'";
            $stmtCritico = $this->conn->query($queryCritico);
            $critico = $stmtCritico->fetch(PDO::FETCH_ASSOC)['total'];

            return [
                'total_insumos' => $total,
                'insumos_activos' => $activos,
                'insumos_por_vencer' => $vencer,
                'stock_critico' => $critico
            ];

        } catch(Throwable $e){
            return [
                'total_insumos' => 0,
                'insumos_activos' => 0,
                'insumos_por_vencer' => 0,
                'stock_critico' => 0
            ];
        }
    }

    private function registrar_insumo(){
        try {
            $this->conn->beginTransaction();
            // Verificar si el insumo ya existe
            $queryCheck = "SELECT COUNT(*) FROM insumos WHERE id_presentacion = :id_presentacion AND nombre_insumo = :nombre_insumo AND tipo_insumo = :tipo_insumo AND fecha_vencimiento = :fecha_vencimiento";
            $stmtCheck = $this->conn->prepare($queryCheck);
            $stmtCheck->bindValue(':id_presentacion', $this->__get('id_presentacion'), PDO::PARAM_INT);
            $stmtCheck->bindValue(':nombre_insumo', $this->__get('nombre_insumo'), PDO::PARAM_STR);
            $stmtCheck->bindValue(':tipo_insumo', $this->__get('tipo_insumo'), PDO::PARAM_STR);
            $stmtCheck->bindValue(':fecha_vencimiento', $this->__get('fecha_vencimiento'), PDO::PARAM_STR);
            $stmtCheck->execute();
            $exists = $stmtCheck->fetchColumn();
    
            if ($exists > 0) {
                throw new Exception("Este insumo ya esta registrado en el inventario médico.");
            }
    
            $query1 = "INSERT INTO insumos (id_presentacion, nombre_insumo, descripcion, tipo_insumo, fecha_vencimiento, fecha_creacion, cantidad, estatus)
                    VALUES (:id_presentacion, :nombre_insumo, :descripcion, :tipo_insumo, :fecha_vencimiento, CURDATE(), :cantidad, :estatus)";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_presentacion', $this->__get('id_presentacion'), PDO::PARAM_INT);
            $stmt1->bindValue(':nombre_insumo', $this->__get('nombre_insumo'), PDO::PARAM_STR);
            $stmt1->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt1->bindValue(':tipo_insumo', $this->__get('tipo_insumo'), PDO::PARAM_STR);
            $stmt1->bindValue(':fecha_vencimiento', $this->__get('fecha_vencimiento'), PDO::PARAM_STR);
            $stmt1->bindValue(':cantidad', $this->__get('cantidad'), PDO::PARAM_INT);
            $stmt1->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_STR);
            $stmt1->execute();
            $id_insumo_generado = $this->conn->lastInsertId();
            $tipo_movimiento = 'Registro';
            $descripcion = 'Nuevo registro';

            $query2 = "INSERT INTO inventario_medico (id_insumo, id_empleado, fecha_movimiento, tipo_movimiento, cantidad, descripcion)
            VALUES (:id_insumo, :id_empleado, NOW(), :tipo_movimiento, :cantidad, :descripcion)";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindParam(':id_insumo', $id_insumo_generado, PDO::PARAM_INT);
            $stmt2->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt2->bindParam(':tipo_movimiento', $tipo_movimiento, PDO::PARAM_STR);
            $stmt2->bindValue(':cantidad', $this->__get('cantidad'), PDO::PARAM_INT);
            $stmt2->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
            $stmt2->execute();
    
            $this->conn->commit();
    
            return [
                'exito' => true,
                'mensaje' => 'Insumo Médico registrado exitosamente.'
            ];

        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function actualizarInsumo(){
        try{
            $query = "UPDATE insumos SET 
                        nombre_insumo = :nombre_insumo,
                        tipo_insumo = :tipo_insumo,
                        id_presentacion = :id_presentacion,
                        fecha_vencimiento = :fecha_vencimiento,
                        descripcion = :descripcion
                      WHERE id_insumo = :id_insumo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_insumo', $this->__get('id_insumo'), PDO::PARAM_INT);
            $stmt->bindValue(':nombre_insumo', $this->__get('nombre_insumo'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_insumo', $this->__get('tipo_insumo'), PDO::PARAM_STR);
            $stmt->bindValue(':id_presentacion', $this->__get('id_presentacion'), PDO::PARAM_INT);
            $stmt->bindValue(':fecha_vencimiento', $this->__get('fecha_vencimiento'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Insumo actualizado exitosamente.'
            ];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function inventario_eliminar() {
        try {
            if($this->validar_insumo_medicina($this->__get('id_insumo'))){
                return [
                    'exito' => false,
                    'mensaje' => 'No se puede eliminar el insumo porque está relacionado con un medicamento.'
                ];
            }

            if($this->validar_stock($this->__get('id_insumo'))){
                return [
                    'exito' => false,
                    'mensaje' => 'No se puede eliminar el insumo porque tiene stock disponible.'
                ];
            }

            if ($this->tiene_movimientos_reales($this->__get('id_insumo'))) {
                return [
                    'exito' => false,
                    'mensaje' => 'No se puede eliminar el insumo porque ya tiene movimientos de entrada o salida.'
                ];
            }

            $this->conn->beginTransaction();
    
            // 1. Eliminar registros relacionados en inventario_medico
            $query1 = "DELETE FROM inventario_medico WHERE id_insumo = :id_insumo";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindValue(':id_insumo', $this->__get('id_insumo'), PDO::PARAM_INT);
            $stmt1->execute();
    
            // 2. Eliminar el insumo
            $query2 = "DELETE FROM insumos WHERE id_insumo = :id_insumo";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_insumo', $this->__get('id_insumo'), PDO::PARAM_INT);
            $stmt2->execute();
    
            $this->conn->commit();
            return [
                'exito' => true,
                'mensaje' => 'Insumo eliminado exitosamente.'
            ];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function validar_stock($id_insumo) {
        $query = "SELECT cantidad FROM insumos WHERE id_insumo = :id_insumo";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
        $stmt->execute();
        
        $cantidad = $stmt->fetchColumn();
        return ($cantidad !== false && $cantidad > 0);
    }

    private function validar_insumo_medicina($id_insumo) {
        $query = "SELECT COUNT(*) FROM detalle_insumo WHERE id_insumo = :id_insumo";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
        $stmt->execute();
        
        return ($stmt->fetchColumn() > 0);
    }

    private function tiene_movimientos_reales($id_insumo) {
        $query = "SELECT COUNT(*) FROM inventario_medico 
                WHERE id_insumo = :id_insumo AND tipo_movimiento != 'Registro'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchColumn() > 0;
    }
    private function consultar_inventario(){
        try{
            $query = "SELECT insumos.*, presentacion_insumo.nombre_presentacion AS presentacion 
                      FROM insumos 
                      JOIN presentacion_insumo ON insumos.id_presentacion = presentacion_insumo.id_presentacion";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            return [];
        }
    }

    private function inventario_detalle(){
        try{
            $query = "SELECT 
                        i.id_insumo,
                        i.nombre_insumo,
                        i.descripcion,
                        i.id_presentacion,
                        p.nombre_presentacion,
                        i.tipo_insumo,
                        i.fecha_vencimiento,
                        i.fecha_creacion,
                        i.cantidad,
                        i.estatus
                    FROM insumos i
                    JOIN presentacion_insumo p ON i.id_presentacion = p.id_presentacion
                    WHERE i.id_insumo = :id_insumo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_insumo', $this->__get('id_insumo'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function consultar_movimientos(){
        try{
            $query = "SELECT 
                        im.id_inv_med,
                        i.nombre_insumo,
                        CONCAT(e.nombre, ' ', e.apellido) as responsable,
                        im.fecha_movimiento,
                        im.tipo_movimiento,
                        im.cantidad,
                        im.descripcion
                    FROM inventario_medico im
                    JOIN insumos i ON im.id_insumo = i.id_insumo
                    JOIN dirpoles_security.empleado e ON im.id_empleado = e.id_empleado
                    ORDER BY im.fecha_movimiento DESC";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(Throwable $e){
            return [];
        }
    }

    private function obtenerInsumosValidos() {
        try {
            // Insumos no vencidos y activos
            $query = "SELECT id_insumo, nombre_insumo, cantidad, fecha_vencimiento 
                      FROM insumos 
                      WHERE estatus != 'Vencido' 
                      AND fecha_vencimiento >= CURDATE()
                      ORDER BY nombre_insumo ASC";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [];
        }
    }

    private function registrar_entrada() {
        try {
            $this->conn->beginTransaction();

            $id_insumo = $this->__get('id_insumo');
            $cantidad_entrada = $this->__get('cantidad');
            $descripcion = $this->__get('descripcion');
            $id_empleado = $this->__get('id_empleado');

            // 1. Verificar insumo actual
            $stmtInfo = $this->conn->prepare("SELECT cantidad FROM insumos WHERE id_insumo = :id");
            $stmtInfo->bindValue(':id', $id_insumo, PDO::PARAM_INT);
            $stmtInfo->execute();
            $insumo = $stmtInfo->fetch(PDO::FETCH_ASSOC);

            if (!$insumo) {
                throw new Exception("Insumo no encontrado.");
            }

            // 2. Actualizar stock
            $nuevo_stock = $insumo['cantidad'] + $cantidad_entrada;
            $stmtUpdate = $this->conn->prepare("UPDATE insumos SET cantidad = :cantidad, estatus = CASE WHEN cantidad > 0 THEN 'Disponible' ELSE estatus END WHERE id_insumo = :id");
            $stmtUpdate->bindValue(':cantidad', $nuevo_stock, PDO::PARAM_INT);
            $stmtUpdate->bindValue(':id', $id_insumo, PDO::PARAM_INT);
            $stmtUpdate->execute();

            // 3. Registrar movimiento
            $queryMov = "INSERT INTO inventario_medico (id_insumo, id_empleado, fecha_movimiento, tipo_movimiento, cantidad, descripcion)
                         VALUES (:id_insumo, :id_empleado, NOW(), 'Entrada', :cantidad, :descripcion)";
            $stmtMov = $this->conn->prepare($queryMov);
            $stmtMov->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
            $stmtMov->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmtMov->bindValue(':cantidad', $cantidad_entrada, PDO::PARAM_INT);
            $stmtMov->bindValue(':descripcion', $descripcion, PDO::PARAM_STR);
            $stmtMov->execute();

            $this->conn->commit();

            return [
                'exito' => true,
                'mensaje' => 'Entrada registrada exitosamente.'
            ];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar entrada: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_insumo_entrada(){
        try{
            $query = "SELECT nombre_insumo FROM insumos WHERE id_insumo = :id_insumo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_insumo', $this->__get('id_insumo'), PDO::PARAM_INT);
            $stmt->execute();
            $insumo = $stmt->fetch(PDO::FETCH_ASSOC);
            return $insumo['nombre_insumo'];

        } catch(Throwable $e){
            return [];
        }
    }

    private function obtenerInsumosParaSalida() {
        try {
            // Insumos con cantidad > 0 (No importa si están vencidos, se pueden dar de baja por vencimiento)
            $query = "SELECT id_insumo, nombre_insumo, cantidad, fecha_vencimiento, estatus 
                      FROM insumos 
                      WHERE cantidad > 0 
                      ORDER BY nombre_insumo ASC";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [];
        }
    }

    private function obtenerInsumosParaSalidaDiagnosticos() {
        try {
            $query = "SELECT id_insumo, nombre_insumo, cantidad, fecha_vencimiento, estatus 
                      FROM insumos 
                      WHERE cantidad > 0 AND fecha_vencimiento >= CURDATE()
                      ORDER BY nombre_insumo ASC";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [];
        }
    }

    private function registrar_salida() {
        try {
            $this->conn->beginTransaction();

            $id_insumo = $this->__get('id_insumo');
            $cantidad_salida = $this->__get('cantidad');
            $motivo = $this->__get('motivo'); // 'Vencimiento', 'Daño', 'Pérdida', 'Donación', etc.
            $descripcion = $this->__get('descripcion'); // Detalle adicional
            $id_empleado = $this->__get('id_empleado');

            // 1. Verificar insumo actual
            $stmtInfo = $this->conn->prepare("SELECT cantidad FROM insumos WHERE id_insumo = :id");
            $stmtInfo->bindValue(':id', $id_insumo, PDO::PARAM_INT);
            $stmtInfo->execute();
            $insumo = $stmtInfo->fetch(PDO::FETCH_ASSOC);

            if (!$insumo) {
                throw new Exception("Insumo no encontrado.");
            }

            if ($insumo['cantidad'] < $cantidad_salida) {
                throw new Exception("Stock insuficiente. Disponible: " . $insumo['cantidad']);
            }

            // 2. Actualizar stock
            $nuevo_stock = $insumo['cantidad'] - $cantidad_salida;
            // Si llega a 0, estatus = 'Agotado'. Si sigue > 0, mantenemos estatus (puede ser 'Disponible' o 'Vencido')
            // Nota: El usuario pidió manejar estados: 'Disponible', 'Agotado', 'Vencido'.
            // Al restar, si es 0 -> Agotado.
            
            $estatus_sql = "estatus"; // Default keep same
            if ($nuevo_stock == 0) {
                $estatus_sql = "'Agotado'";
            }
            
            $stmtUpdate = $this->conn->prepare("UPDATE insumos SET cantidad = :cantidad, estatus = CASE WHEN cantidad = 0 THEN 'Agotado' ELSE estatus END WHERE id_insumo = :id");
            $stmtUpdate->bindValue(':cantidad', $nuevo_stock, PDO::PARAM_INT);
            $stmtUpdate->bindValue(':id', $id_insumo, PDO::PARAM_INT);
            $stmtUpdate->execute();

            // 3. Registrar movimiento
            // Tipo Movimiento = 'Salida'
            // Descripción = Motivo + " - " + Descripción
            $descripcion_final = $motivo . " - " . $descripcion;

            $queryMov = "INSERT INTO inventario_medico (id_insumo, id_empleado, fecha_movimiento, tipo_movimiento, cantidad, descripcion)
                         VALUES (:id_insumo, :id_empleado, NOW(), 'Salida', :cantidad, :descripcion)";
            $stmtMov = $this->conn->prepare($queryMov);
            $stmtMov->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
            $stmtMov->bindValue(':id_empleado', $id_empleado, PDO::PARAM_INT);
            $stmtMov->bindValue(':cantidad', $cantidad_salida, PDO::PARAM_INT);
            $stmtMov->bindValue(':descripcion', $descripcion_final, PDO::PARAM_STR);
            $stmtMov->execute();

            $this->conn->commit();

            return [
                'exito' => true,
                'mensaje' => 'Salida registrada exitosamente.'
            ];

        } catch (Throwable $e) {
            $this->conn->rollBack();
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar salida: ' . $e->getMessage()
            ];
        }
    }

    
}