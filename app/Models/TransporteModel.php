<?php

namespace App\Models;

use App\Models\BusinessModel;
use PDO;
use Throwable;
use InvalidArgumentException;
use Exception;
use DateTime;

class TransporteModel extends BusinessModel
{
    private $atributos = [];

    public function __set($nombre, $valor)
    {
        // Aplicar sanitización base
        if (is_string($valor)) {
            $valor = html_entity_decode(trim($valor), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        switch ($nombre) {
            // Validación de la placa (debe tener un formato alfanumérico común)
            case 'placa':
                if (empty($valor)) {
                    throw new InvalidArgumentException("La placa no puede estar vacía");
                }
                break;

            // Validación del modelo del vehículo
            case 'modelo':
                if (empty($valor)) {
                    throw new InvalidArgumentException("El modelo no puede estar vacío");
                }
                if (mb_strlen($valor) > 100) {
                    throw new InvalidArgumentException("El modelo no puede exceder 100 caracteres");
                }
                break;

            // Validación del tipo de vehículo
            case 'tipo':
                if (empty($valor)) {
                    throw new InvalidArgumentException("El tipo de vehículo no puede estar vacío");
                }
                if (!preg_match('/^[\p{L}\s]+$/u', $valor)) {
                    throw new InvalidArgumentException("El tipo de vehículo contiene caracteres no permitidos");
                }
                break;

            // Validación de fecha de adquisición
            case 'fecha_adquisicion':
                if (empty($valor)) {
                    throw new InvalidArgumentException("La fecha de adquisición no puede estar vacía");
                }
                $fecha = DateTime::createFromFormat('Y-m-d', $valor);
                if (!$fecha || $fecha->format('Y-m-d') !== $valor) {
                    throw new InvalidArgumentException("Formato de fecha inválido, debe ser YYYY-MM-DD");
                }
                break;

            // Validación de estado del vehículo
            case 'estado':
                if (empty($valor)) {
                    throw new InvalidArgumentException("El estado no puede estar vacío");
                }
                $estadosPermitidos = ['Activo', 'Inactivo', 'Mantenimiento'];
                if (!in_array($valor, $estadosPermitidos, true)) {
                    throw new InvalidArgumentException("Estado no válido");
                }
                break;

            default:
                // Si el campo no tiene validación específica, lo asignamos sin restricciones
                $this->atributos[$nombre] = $valor;
                return;
        }

        // Asignar el valor validado a los atributos del objeto
        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre)
    {
        return $this->atributos[$nombre] ?? null;
    }

    public function manejarAccion($action)
    {
        switch ($action) {
            case 'Crear':
                return [
                    'Vehiculos' => $this->obtener_vehiculos(),
                    'Proveedores' => $this->obtener_proveedores(),
                    'Rutas' => $this->obtener_rutas(),
                    'Asignaciones' => $this->asignaciones_para_calendario(),
                    'Repuestos' => $this->obtener_repuestos(),
                    'Mantenimientos' => $this->obtener_mantenimientos(),
                    'Choferes' => $this->obtener_choferes(),
                    'Vehiculos_mant' => $this->obtener_vehiculos_sin_mantenimiento(),
                    'Inventario_repuestos' => $this->obtener_inventario_repuestos(),
                    'Rutas_asignadas' => $this->obtener_asignaciones_rutas(),
                    'Vehiculos_activos' => $this->obtener_vehiculos_activos()
                ];
                break;

            case 'Registrar_vehiculo':
                return $this->registrar_vehiculo();
                break;

            case 'Validar_placa':
                return $this->validar_placa();
                break;

            case 'Registrar_proveedor':
                return $this->registrar_proveedor();
                break;

            case 'Registrar_ruta':
                return $this->registrar_ruta();
                break;

            case 'Registrar_asignacion':
                return $this->asignar_recursos();
                break;

            case 'Asignaciones_calendario':
                return $this->asignaciones_para_calendario();
                break;

            case 'Detalles_ruta':
                return $this->obtener_detalles_ruta();
                break;

            case 'Registrar_repuesto':
                return $this->registrar_repuesto();
                break;

            case 'Registrar_entrada_repuesto':
                return $this->registrar_entrada_repuesto();
                break;

            case 'Registrar_mantenimiento':
                return $this->registrar_mantenimiento();
                break;

            case 'Editar_vehiculo':
                return $this->obtener_vehiculos_id();
                break;

            case 'Actualizar_vehiculo':
                return $this->actualizar_vehiculo();
                break;

            case 'Eliminar_vehiculo':
                return $this->eliminar_vehiculo();
                break;

            case 'Editar_proveedor':
                return $this->obtener_proveedorID();
                break;

            case 'Actualizar_proveedor':
                return $this->actualizar_proveedor();
                break;

            case 'Eliminar_proveedor':
                return $this->eliminar_proveedor();
                break;

            case 'Editar_ruta':
                return $this->obtener_rutaID();
                break;

            case 'Actualizar_ruta':
                return $this->ruta_actualizar();
                break;

            case 'Eliminar_ruta':
                return $this->ruta_eliminar();
                break;

            case 'Eliminar_asignacion':
                return $this->Eliminar_asignacion();
                break;

            case 'Editar_repuesto':
                return [
                    'ID' => $this->obtener_repuestoID(),
                    'Proveedores' => $this->obtener_proveedores()
                ];
                break;

            case 'Actualizar_repuesto':
                return $this->actualizar_repuesto();
                break;

            case 'Eliminar_repuesto':
                return $this->eliminar_repuesto();
                break;
        }
    }

    private function obtener_choferes()
    {
        try {
            $query = "SELECT * FROM dirpoles_security.empleado WHERE id_tipo_empleado = 8"; //id=8 es Chofer
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener los valores: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_vehiculos()
    {
        try {

            $query = "SELECT * FROM vehiculos";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $vehiculos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $vehiculos;
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al consultar los vehiculos: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_vehiculos_activos()
    {
        try {

            $query = "SELECT * FROM vehiculos WHERE estado = 'Activo'";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $vehiculos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $vehiculos;
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al consultar los vehiculos: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_vehiculos_sin_mantenimiento()
    {
        try {

            $query = "SELECT * FROM vehiculos WHERE estado != 'Mantenimiento'";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $vehiculos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $vehiculos;
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al consultar los vehiculos sin mantenimiento: ' . $e->getMessage()
            ];
        }
    }

    private function registrar_vehiculo()
    {
        try {


            // Validar si la placa ya existe (por si JS está desactivado)
            if ($this->validar_placa()) {
                throw new Exception('La placa ingresada ya esta registrada');
            }

            $query = "INSERT INTO vehiculos (placa, modelo, tipo, fecha_adquisicion, estado) 
                  VALUES (:placa, :modelo, :tipo, :fecha_adquisicion, :estado)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':placa', $this->__get('placa'));
            $stmt->bindValue(':modelo', $this->__get('modelo'));
            $stmt->bindValue(':tipo', $this->__get('tipo'));
            $stmt->bindValue(':fecha_adquisicion', $this->__get('fecha_adquisicion'));
            $stmt->bindValue(':estado', $this->__get('estado'));
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Vehiculo registrado exitosamente"
            ];
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al registrar el vehículo: ' . $e->getMessage()
            ];
        }
    }

    private function validar_documentos($id_excluir = null)
    {
        $sql = "SELECT COUNT(*) as total 
                FROM proveedores 
                WHERE tipo_documento = :tipo_documento 
                AND num_documento   = :num_documento";
        if ($id_excluir !== null) {
            $sql .= " AND id_proveedor != :id_excluir";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':tipo_documento', $this->__get('tipo_documento'));
        $stmt->bindValue(':num_documento', $this->__get('num_documento'));
        if ($id_excluir !== null) {
            $stmt->bindParam(':id_excluir', $id_excluir, PDO::PARAM_INT);
        }
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($resultado['total'] > 0);
    }

    private function registrar_proveedor()
    {

        if ($this->validar_documentos()) {
            throw new Exception("El documento ya está registrado");
        }

        try {
            $query = "INSERT INTO proveedores (tipo_documento, num_documento, nombre, telefono, correo, estatus, direccion, fecha_creacion) 
                  VALUES (:tipo_documento, :num_documento, :nombre, :telefono, :correo, 'Activo', :direccion, CURDATE())";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':tipo_documento', $this->__get('tipo_documento'));
            $stmt->bindValue(':num_documento', $this->__get('num_documento'));
            $stmt->bindValue(':nombre', $this->__get('nombre'));
            $stmt->bindValue(':telefono', $this->__get('telefono'));
            $stmt->bindValue(':correo', $this->__get('correo'));
            $stmt->bindValue(':direccion', $this->__get('direccion'));
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Proveedor registrado exitosamente"
            ];
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al registrar el proveedor: ' . $e->getMessage()
            ];
        }
    }

    private function validar_ruta()
    {
        $query = "SELECT COUNT(*) as total 
                FROM rutas 
                WHERE nombre_ruta = :nombre_ruta";

        $params = [':nombre_ruta' => $this->__get('nombre_ruta')];

        // Solo excluir en edición (cuando id_ruta no es nulo)
        $id_ruta = $this->__get('id_ruta');
        if ($id_ruta !== null && $id_ruta !== '') {
            $query .= " AND id_ruta != :id_ruta";
            $params[':id_ruta'] = $id_ruta;
        }

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($resultado['total'] > 0);
    }

    private function registrar_ruta()
    {


        if ($this->validar_ruta()) {
            throw new Exception("Ya existe una ruta con este nombre");
        }

        try {

            $query = "INSERT INTO rutas (nombre_ruta, tipo_ruta, horario_salida, horario_llegada, estatus, punto_partida, punto_destino, trayectoria, fecha_creacion) 
                    VALUES (:nombre_ruta, :tipo_ruta, :horario_salida, :horario_llegada, :estatus, :punto_partida, :punto_destino, :trayectoria, CURDATE())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_ruta', $this->__get('nombre_ruta'));
            $stmt->bindValue(':tipo_ruta', $this->__get('tipo_ruta'));
            $stmt->bindValue(':horario_salida', $this->__get('horario_salida'));
            $stmt->bindValue(':horario_llegada', $this->__get('horario_llegada'));
            $stmt->bindValue(':estatus', $this->__get('estatus'));
            $stmt->bindValue(':punto_partida', $this->__get('punto_partida'));
            $stmt->bindValue(':punto_destino', $this->__get('punto_destino'));
            $stmt->bindValue(':trayectoria', $this->__get('trayectoria'));
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Ruta registrada exitosamente"
            ];
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al registrar la ruta: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_rutas()
    {
        try {

            $query = "SELECT * FROM rutas";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $rutas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $rutas;
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener los proveedores: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_proveedores()
    {
        try {

            $query = "SELECT * FROM proveedores";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $proveedores;
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener los proveedores: ' . $e->getMessage()
            ];
        }
    }

    private function validar_asignacion()
    {
        $query = "SELECT COUNT(*) as total FROM asignaciones_rutas WHERE id_ruta = :id_ruta AND fecha_asignacion = :fecha_asignacion";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_ruta', $this->__get('id_ruta'));
        $stmt->bindValue(':fecha_asignacion', $this->__get('fecha_asignacion'));
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($resultado['total'] > 0);
    }

    private function asignar_recursos()
    {
        if ($this->validar_asignacion()) {
            throw new Exception("La ruta ya está asignada para esa fecha");
        }
        try {
            $query = "INSERT INTO asignaciones_rutas (id_ruta, fecha_asignacion, id_vehiculo, id_empleado, estatus) 
                  VALUES (:id_ruta, :fecha_asignacion, :id_vehiculo, :id_empleado, :estatus)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_ruta', $this->__get('id_ruta'));
            $stmt->bindValue(':fecha_asignacion', $this->__get('fecha_asignacion'));
            $stmt->bindValue(':id_vehiculo', $this->__get('id_vehiculo'));
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'));
            $stmt->bindValue(':estatus', $this->__get('estatus'));
            $stmt->execute();
            return [
                "status" => true,
                "mensaje" => "Asignación de recursos exitosa"
            ];
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al asignar los recuros a la ruta: ' . $e->getMessage()
            ];
        }
    }

    private function asignaciones_para_calendario()
    {
        try {

            $query = "
                SELECT 
                    ar.id_asignacion,
                    r.nombre_ruta,
                    ar.fecha_asignacion,
                    CONCAT(v.modelo, ' - ', v.placa) AS vehiculo,
                    e.nombre AS nombre_chofer,
                    e.apellido AS apellido_chofer,
                    ar.estatus,
                    r.tipo_ruta
                FROM 
                    asignaciones_rutas ar
                JOIN 
                    rutas r ON ar.id_ruta = r.id_ruta
                JOIN 
                    vehiculos v ON ar.id_vehiculo = v.id_vehiculo
                JOIN 
                    dirpoles_security.empleado e ON ar.id_empleado = e.id_empleado
                WHERE 
                    ar.estatus = 'Activa'
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener los valores: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_detalles_ruta()
    {
        try {
            // 1. Obtener datos básicos de la ruta
            $query = "SELECT 
                        nombre_ruta,
                        tipo_ruta,
                        punto_partida,
                        punto_destino,
                        horario_salida,
                        horario_llegada,
                        TIMEDIFF(horario_llegada, horario_salida) AS duracion_calculada
                    FROM rutas 
                    WHERE id_ruta = :id_ruta";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_ruta', $this->__get('id_ruta'));
            $stmt->execute();
            $ruta = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$ruta) {
                return false;
            }

            // 2. Obtener vehículos asignados a esta ruta
            $query2 = "SELECT 
                        v.placa, 
                        v.modelo 
                    FROM asignaciones_rutas ar
                    JOIN vehiculos v ON ar.id_vehiculo = v.id_vehiculo
                    WHERE ar.id_ruta = :id_ruta";

            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_ruta', $this->__get('id_ruta'));
            $stmt2->execute();
            $vehiculos = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            // Combinar resultados
            $ruta['vehiculos'] = $vehiculos;

            // Calcular la duración si no está definida
            if (empty($ruta['duracion_estimada'])) {
                $ruta['duracion_estimada'] = $ruta['duracion_calculada'] ?? 'N/A';
            }

            return $ruta;
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener los detalles de la ruta: ' . $e->getMessage()
            ];
        }
    }

    public function obtener_repuestos()
    {

        try {
            $query = "SELECT
            re.*,
            pr.nombre AS nombre_proveedor
            FROM
            repuestos_vehiculos re
            JOIN
            proveedores pr ON re.id_proveedor = pr.id_proveedor";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener los valores: ' . $e->getMessage()
            ];
        }
    }

    private function validar_repuesto()
    {
        $query = "SELECT COUNT(*) as total FROM repuestos_vehiculos WHERE nombre = :nombre_repuesto";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':nombre_repuesto', $this->__get('nombre_repuesto'));
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($resultado['total'] > 0);
    }

    private function registrar_repuesto()
    {
        try {
            if ($this->validar_repuesto()) {
                return [
                    "status" => false,
                    "mensaje" => "El repuesto ya está registrado"
                ];
            }

            $query = "INSERT INTO repuestos_vehiculos (nombre, descripcion, id_proveedor, fecha_creacion, estatus) 
                VALUES (:nombre_repuesto, :descripcion, :id_proveedor, :fecha_creacion, :estatus_repuesto)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_repuesto', $this->__get('nombre_repuesto'));
            $stmt->bindValue(':descripcion', $this->__get('descripcion'));
            $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'));
            $stmt->bindValue(':fecha_creacion', $this->__get('fecha_creacion'));
            $stmt->bindValue(':estatus_repuesto', $this->__get('estatus_repuesto'));
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Repuesto registrado exitosamente"
            ];
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al registrar el repuesto: ' . $e->getMessage()
            ];
        }
    }

    private function registrar_entrada_repuesto()
    {
        try {
            $this->conn->beginTransaction();

            $query1 = "
                INSERT INTO inventario_repuestos 
                    (id_repuesto, id_empleado, cantidad, tipo_movimiento, razon_movimiento, fecha_movimiento) 
                VALUES 
                    (:id_repuesto, :id_empleado, :cantidad, :tipo_movimiento, :razon_movimiento, NOW())
            ";

            $query1 = $this->conn->prepare($query1);
            $query1->bindValue(':id_repuesto', $this->__get('id_repuesto'), PDO::PARAM_INT);
            $query1->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $query1->bindValue(':cantidad', $this->__get('cantidad'), PDO::PARAM_INT);
            $query1->bindValue(':tipo_movimiento', $this->__get('tipo_movimiento'), PDO::PARAM_STR);
            $query1->bindValue(':razon_movimiento', $this->__get('razon_movimiento'), PDO::PARAM_STR);
            $query1->execute();

            // 2. Actualizar stock en repuestos_vehiculos
            $query2 = "
                UPDATE repuestos_vehiculos 
                SET cantidad = cantidad + :cantidad 
                WHERE id_repuesto = :id_repuesto
            ";

            $query2 = $this->conn->prepare($query2);
            $query2->bindValue(':id_repuesto', $this->__get('id_repuesto'), PDO::PARAM_INT);
            $query2->bindValue(':cantidad', $this->__get('cantidad'), PDO::PARAM_INT);
            $query2->execute();

            $this->conn->commit();

            return [
                "status" => true,
                "mensaje" => "Entrada registrada exitosamente"
            ];
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al registrar la entrada: ' . $e->getMessage()
            ];
        }
    }

    private function registrar_mantenimiento()
    {
        $this->conn->beginTransaction();

        try {
            // Insertar mantenimiento principal
            $query = "INSERT INTO mantenimiento_vehiculos 
                    (id_vehiculo, tipo, fecha, descripcion) 
                    VALUES (:id_vehiculo, :tipo, :fecha, :descripcion)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_vehiculo', $this->__get('id_vehiculo_mantenimiento'));
            $stmt->bindValue(':tipo', $this->__get('tipo_mantenimiento'));
            $stmt->bindValue(':fecha', $this->__get('fecha_mantenimiento'));
            $stmt->bindValue(':descripcion', $this->__get('descripcion_mant'));
            $stmt->execute();
            $id_mantenimiento = $this->conn->lastInsertId();

            // Insertar repuestos si existen
            $repuestos = $this->__get('repuestos');
            if (!empty($repuestos) && is_array($repuestos)) {
                foreach ($repuestos as $repuesto) {
                    // Validar estructura del repuesto
                    if (!isset($repuesto['id_repuesto'], $repuesto['cantidad'])) {
                        throw new Exception("Estructura de repuesto inválida");
                    }

                    $id_repuesto = (int)$repuesto['id_repuesto'];
                    $cantidad = (int)$repuesto['cantidad'];

                    // Validar cantidad disponible
                    $cantidad_disponible = $this->obtener_cantidad_repuesto($id_repuesto);

                    if ($cantidad_disponible < $cantidad) {
                        throw new Exception("Cantidad insuficiente para el repuesto ID: $id_repuesto");
                    }

                    // Insertar en repuestos_mantenimiento
                    $query2 = "INSERT INTO repuestos_mantenimiento 
                            (id_mantenimiento, id_repuesto, cantidad) 
                            VALUES (:id_mantenimiento, :id_repuesto, :cantidad)";

                    $stmt2 = $this->conn->prepare($query2);
                    $stmt2->bindValue(':id_mantenimiento', $id_mantenimiento);
                    $stmt2->bindValue(':id_repuesto', $id_repuesto);
                    $stmt2->bindValue(':cantidad', $cantidad);
                    $stmt2->execute();

                    $query3 = "INSERT INTO inventario_repuestos (id_repuesto, id_empleado, cantidad, tipo_movimiento, razon_movimiento, fecha_movimiento) VALUES (:id_repuesto, :id_empleado, :cantidad, :tipo_movimiento, :razon_movimiento, NOW())";
                    $stmt3 = $this->conn->prepare($query3);
                    $stmt3->bindValue(':id_repuesto', $id_repuesto);
                    $stmt3->bindValue(':id_empleado', $this->__get('id_empleado'));
                    $stmt3->bindValue(':cantidad', $cantidad);
                    $stmt3->bindValue(':tipo_movimiento', $this->__get('tipo_movimiento'));
                    $stmt3->bindValue(':razon_movimiento', $this->__get('razon_movimiento'));
                    $stmt3->execute();

                    // Actualizar inventario
                    $this->actualizar_inventario_repuesto($id_repuesto, $cantidad);
                }
            }

            // Actualizar estado del vehículo
            $query3 = "UPDATE vehiculos SET estado = 'Mantenimiento' WHERE id_vehiculo = :id_vehiculo";
            $stmt3 = $this->conn->prepare($query3);
            $stmt3->bindValue(':id_vehiculo', $this->__get('id_vehiculo_mantenimiento'));
            $stmt3->execute();

            error_log("Repuestos recibidos: " . print_r($this->__get('repuestos'), true));
            $this->conn->commit();
            return [
                "status" => true,
                "mensaje" => "Mantenimiento registrado exitosamente"
            ];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            return [
                'status' => false,
                'mensaje' => 'Error al registrar el mantenimiento: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_cantidad_repuesto($id_repuesto)
    {
        $query = "SELECT cantidad FROM repuestos_vehiculos WHERE id_repuesto = :id_repuesto";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_repuesto', $id_repuesto);
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado ? (int)$resultado['cantidad'] : 0;
    }

    private function actualizar_inventario_repuesto($id_repuesto, $cantidad)
    {
        try {
            $query = "UPDATE repuestos_vehiculos 
                    SET cantidad = cantidad - :cantidad 
                    WHERE id_repuesto = :id_repuesto";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':cantidad', $cantidad);
            $stmt->bindValue(':id_repuesto', $id_repuesto);
            $stmt->execute();
        } catch (Throwable $e) {
            error_log("Error actualizando inventario: " . $e->getMessage());
            throw $e; // Relanzar para manejar en el nivel superior
        }
    }

    public function obtener_mantenimientos()
    {

        try {
            $query = "SELECT mv.*, mv.tipo AS tipo_mantenimiento, v.*, modelo.*
                    FROM mantenimiento_vehiculos mv
                    JOIN vehiculos v ON mv.id_vehiculo = v.id_vehiculo
                    LEFT JOIN vehiculos modelo ON mv.id_vehiculo = modelo.id_vehiculo";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener los valores: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_vehiculos_id()
    {
        $query = "SELECT * FROM vehiculos WHERE id_vehiculo = :id_vehiculo";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_vehiculo', $this->__get('id_vehiculo'));
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function actualizar_vehiculo()
    {
        try {

            $id_vehiculo = $this->__get('id_vehiculo');
            $nueva_placa = $this->__get('placa');

            $placa_actual = $this->obtener_placa();

            // Solo validar si la placa cambió
            if ($nueva_placa !== $placa_actual) {
                if ($this->validar_placa()) {
                    throw new Exception("La placa $nueva_placa ya está registrada");
                }
            }

            $query = "UPDATE vehiculos 
                    SET placa = :placa, 
                        modelo = :modelo, 
                        tipo = :tipo, 
                        fecha_adquisicion = :fecha_adquisicion, 
                        estado = :estado 
                    WHERE id_vehiculo = :id_vehiculo";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':placa', $nueva_placa);
            $stmt->bindValue(':modelo', $this->__get('modelo_vehiculo'));
            $stmt->bindValue(':tipo', $this->__get('tipo'));
            $stmt->bindValue(':fecha_adquisicion', $this->__get('fecha_adquisicion'));
            $stmt->bindValue(':estado', $this->__get('estado'));
            $stmt->bindValue(':id_vehiculo', $id_vehiculo);
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Vehiculo actualizado exitosamente"
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al actualizar el vehiculo: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_placa()
    {
        $query = "SELECT placa FROM vehiculos WHERE id_vehiculo = :id_vehiculo";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_vehiculo', $this->__get('id_vehiculo'));
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    private function validar_placa()
    {
        try {


            $query = "SELECT COUNT(*) as total FROM vehiculos WHERE placa = :placa";

            if ($this->__get('id_vehiculo')) {
                $query .= " AND id_vehiculo != :id_vehiculo";
            }

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':placa', $this->__get('placa'));

            // Enlazar id_vehiculo si existe
            if ($this->__get('id_vehiculo')) {
                $stmt->bindValue(':id_vehiculo', $this->__get('id_vehiculo'), PDO::PARAM_INT);
            }

            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

            return ($resultado['total'] > 0);
        } catch (Throwable $e) {
            error_log("Error en validar_placa: " . $e->getMessage());
            return false;
        }
    }

    private function eliminar_vehiculo()
    {

        // Validar si el vehículo está asignado a una ruta
        if ($this->vehiculo_asignado()) {
            throw new Exception('El vehículo no puede ser eliminado porque está asignado a una ruta');
        }
        // Validar si el vehículo tiene mantenimientos registrados
        if (!empty($this->obtener_vehiculo_mantenimiento())) {
            throw new Exception('El vehículo no puede ser eliminado porque tiene mantenimientos registrados');
        }
        try {
            $query = "DELETE FROM vehiculos WHERE id_vehiculo = :id_vehiculo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_vehiculo', $this->__get('id_vehiculo'));
            $stmt->execute();
            return [
                "status" => true,
                "mensaje" => "Vehiculo eliminado exitosamente"
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al eliminar el vehiculo: ' . $e->getMessage()
            ];
        }
    }

    private function vehiculo_asignado()
    {
        $query = "SELECT COUNT(*) as total FROM asignaciones_rutas WHERE id_vehiculo = :id_vehiculo";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_vehiculo', $this->__get('id_vehiculo'));
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($resultado['total'] > 0);
    }

    private function obtener_vehiculo_mantenimiento()
    {
        $query = "SELECT * FROM mantenimiento_vehiculos WHERE id_vehiculo = :id_vehiculo";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_vehiculo', $this->__get('id_vehiculo'));
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function obtener_proveedorID()
    {
        $query = "SELECT * FROM proveedores WHERE id_proveedor = :id_proveedor";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'));
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function obtener_documentoID()
    {

        try {
            $query = "SELECT tipo_documento, num_documento 
                    FROM proveedores 
                    WHERE id_proveedor = :id_proveedor";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'));
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al obtener los documentos: ' . $e->getMessage()
            ];
        }
    }

    private function actualizar_proveedor()
    {


        try {
            // Obtener documento actual
            $documento_actual = $this->obtener_documentoID();
            $id_proveedor = $this->__get('id_proveedor');

            $nuevo_tipo = $this->__get('tipo_documento');
            $nuevo_num = $this->__get('num_documento');

            // Verificar si el documento cambió
            $documento_cambio = false;
            if ($documento_actual) {
                $documento_cambio = ($documento_actual['tipo_documento'] !== $nuevo_tipo) ||
                    ($documento_actual['num_documento'] !== $nuevo_num);
            }

            // Validar solo si hubo cambios en el documento
            if ($documento_cambio) {
                if ($this->validar_documentos()) {
                    throw new Exception("El documento ya está registrado");
                }
            }

            $query = "UPDATE proveedores 
                    SET tipo_documento = :tipo_documento, 
                        num_documento = :num_documento, 
                        nombre = :nombre, 
                        telefono = :telefono, 
                        correo = :correo, 
                        direccion = :direccion 
                    WHERE id_proveedor = :id_proveedor";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':tipo_documento', $nuevo_tipo);
            $stmt->bindValue(':num_documento', $nuevo_num);
            $stmt->bindValue(':nombre', $this->__get('nombre'));
            $stmt->bindValue(':telefono', $this->__get('telefono'));
            $stmt->bindValue(':correo', $this->__get('correo'));
            $stmt->bindValue(':direccion', $this->__get('direccion'));
            $stmt->bindValue(':id_proveedor', $id_proveedor);
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Proveedor actualizado exitosamente"
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al actualizar el proveedor: ' . $e->getMessage()
            ];
        }
    }

    private function eliminar_proveedor()
    {

        try {
            if ($this->validar_proveedor_repuesto()) {
                throw new Exception('El proveedor no puede ser eliminado porque tiene repuestos asociados');
            }
            $query = "DELETE FROM proveedores WHERE id_proveedor = :id_proveedor";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'));
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Proveedor eliminado exitosamente"
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al eliminar el proveedor: ' . $e->getMessage()
            ];
        }
    }

    private function validar_proveedor_repuesto()
    {
        $query = "SELECT COUNT(*) as total FROM repuestos_vehiculos WHERE id_proveedor = :id_proveedor";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'));
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($resultado['total'] > 0);
    }

    private function obtener_rutaID()
    {
        try {

            $query = "SELECT * FROM rutas WHERE id_ruta = :id_ruta";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_ruta', $this->__get('id_ruta'), PDO::PARAM_INT);
            $stmt->execute();
            $ruta = $stmt->fetch(PDO::FETCH_ASSOC);

            return $ruta ?: ['status' => false, 'mensaje' => 'No se encontró ninguna ruta con el ID especificado'];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al consultar la ruta específica: ' . $e->getMessage()
            ];
        }
    }

    private function ruta_actualizar()
    {


        // Validar si existe otra ruta con el mismo nombre (excluyendo la actual)
        if ($this->validar_ruta()) {
            throw new Exception('Ya hay otra ruta registrada con ese nombre');
        }

        try {
            // Consulta corregida
            $query = "UPDATE rutas 
                    SET nombre_ruta = :nombre_ruta,
                        tipo_ruta = :tipo_ruta,
                        punto_partida = :punto_partida,
                        punto_destino = :punto_destino,
                        horario_salida = :horario_salida,
                        horario_llegada = :horario_llegada,
                        estatus = :estatus,
                        trayectoria = :trayectoria 
                    WHERE id_ruta = :id_ruta";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_ruta', $this->__get('nombre_ruta'));
            $stmt->bindValue(':tipo_ruta', $this->__get('tipo_ruta'));
            $stmt->bindValue(':punto_partida', $this->__get('punto_partida'));
            $stmt->bindValue(':punto_destino', $this->__get('punto_destino'));
            $stmt->bindValue(':horario_salida', $this->__get('horario_salida'));
            $stmt->bindValue(':horario_llegada', $this->__get('horario_llegada'));
            $stmt->bindValue(':estatus', $this->__get('estatus'));
            $stmt->bindValue(':trayectoria', $this->__get('trayectoria'));
            $stmt->bindValue(':id_ruta', $this->__get('id_ruta'));
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Ruta actualizada exitosamente"
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al actualizar la ruta: ' . $e->getMessage()
            ];
        }
    }

    private function ruta_eliminar()
    {

        try {
            if ($this->validar_ruta_asignacion()) {
                throw new Exception('Hay asignaciones en esta ruta. Debes eliminarlas primero para poder eliminar la ruta');
            }


            $query = "DELETE FROM rutas WHERE id_ruta = :id_ruta";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_ruta', $this->__get('id_ruta'));
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Ruta eliminada exitosamente"
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al eliminar el registro: ' . $e->getMessage()
            ];
        }
    }

    private function validar_ruta_asignacion()
    {
        $query = "SELECT COUNT(*) as total 
                FROM asignaciones_rutas 
                WHERE id_ruta = :id_ruta";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_ruta', $this->__get('id_ruta'));
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($resultado['total'] > 0);
    }

    private function Eliminar_asignacion()
    {

        try {
            $query = "DELETE FROM asignaciones_rutas WHERE id_asignacion = :id_asignacion";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_asignacion', $this->__get('id_asignacion'));
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Asignación eliminada exitosamente"
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al eliminar el registro: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_inventario_repuestos()
    {
        try {
            $query = "
                SELECT 
                    ir.id_inventario,
                    rv.nombre AS nombre_repuesto,
                    CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
                    ir.cantidad,
                    ir.tipo_movimiento,
                    ir.razon_movimiento,
                    ir.fecha_movimiento
                FROM 
                    inventario_repuestos ir
                JOIN 
                    repuestos_vehiculos rv ON ir.id_repuesto = rv.id_repuesto
                JOIN 
                    dirpoles_security.empleado e ON ir.id_empleado = e.id_empleado
                ORDER BY 
                    ir.fecha_movimiento DESC
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener el inventario de repuestos: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_repuestoID()
    {
        try {


            $query = "SELECT * FROM repuestos_vehiculos WHERE id_repuesto = :id_repuesto";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_repuesto', $this->__get('id_repuesto'));
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener el repuesto: ' . $e->getMessage()
            ];
        }
    }

    private function obtener_asignaciones_rutas()
    {
        try {
            $query = "
                SELECT 
                    ar.id_asignacion,
                    r.nombre_ruta,
                    ar.fecha_asignacion,
                    v.modelo AS modelo_vehiculo,
                    CONCAT(e.nombre, ' ', e.apellido) AS nombre_empleado,
                    ar.estatus
                FROM 
                    asignaciones_rutas ar
                JOIN 
                    rutas r ON ar.id_ruta = r.id_ruta
                JOIN 
                    vehiculos v ON ar.id_vehiculo = v.id_vehiculo
                JOIN 
                    dirpoles_security.empleado e ON ar.id_empleado = e.id_empleado
                ORDER BY 
                    ar.fecha_asignacion DESC
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al obtener las asignaciones de rutas: ' . $e->getMessage()
            ];
        }
    }

    private function actualizar_repuesto()
    {
        try {


            $query = "
                UPDATE repuestos_vehiculos 
                SET 
                    nombre = :nombre,
                    estatus = :estatus,
                    id_proveedor = :id_proveedor,
                    descripcion = :descripcion
                WHERE id_repuesto = :id_repuesto
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre', $this->__get('nombre'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_STR);
            $stmt->bindValue(':id_proveedor', $this->__get('id_proveedor'), PDO::PARAM_INT);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':id_repuesto', $this->__get('id_repuesto'), PDO::PARAM_INT);
            $stmt->execute();

            return [
                'status' => true,
                'mensaje' => 'Repuesto actualizado correctamente.'
            ];
        } catch (Throwable $e) {
            error_log("Error: " . $e->getMessage());
            return [
                'status' => false,
                'mensaje' => 'Error al actualizar el repuesto: ' . $e->getMessage()
            ];
        }
    }

    private function eliminar_repuesto()
    {
        try {


            // Verificar si el repuesto tiene stock o entradas en el inventario
            if ($this->verificar_repuesto()) {
                throw new Exception('No puedes eliminar un repuesto que tenga stock o registros en el inventario.');
            }

            $query = "DELETE FROM repuestos_vehiculos WHERE id_repuesto = :id_repuesto";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_repuesto', $this->__get('id_repuesto'), PDO::PARAM_INT);
            $stmt->execute();

            return [
                "status" => true,
                "mensaje" => "Repuesto eliminado exitosamente."
            ];
        } catch (Throwable $e) {
            return [
                'status' => false,
                'mensaje' => 'Error al eliminar el registro: ' . $e->getMessage()
            ];
        }
    }

    private function verificar_repuesto()
    {
        try {
            $query = "SELECT cantidad FROM repuestos_vehiculos WHERE id_repuesto = :id_repuesto";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_repuesto', $this->__get('id_repuesto'), PDO::PARAM_INT);
            $stmt->execute();
            $resultadoStock = $stmt->fetch(PDO::FETCH_ASSOC);

            $query2 = "SELECT COUNT(*) as total FROM inventario_repuestos WHERE id_repuesto = :id_repuesto";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindValue(':id_repuesto', $this->__get('id_repuesto'), PDO::PARAM_INT);
            $stmt2->execute();
            $resultadoInventario = $stmt2->fetch(PDO::FETCH_ASSOC);

            //Si el repuesto tiene stock (>0) o aparece en el inventario, impedimos la eliminacion
            return ($resultadoStock && $resultadoStock['cantidad'] > 0) || ($resultadoInventario && $resultadoInventario['total'] > 0);
        } catch (Throwable $e) {
            error_log("Error en verificar_repuesto: " . $e->getMessage());
            return false;
        }
    }
}
