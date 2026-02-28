<?php

namespace App\Models;

use App\Models\BusinessModel;
use PDO;
use Throwable;
use Exception;

class JornadasModel extends BusinessModel
{
    private $atributos = [];

    public function __set($nombre, $valor)
    {
        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre)
    {
        return $this->atributos[$nombre];
    }

    public function manejarAccion($action)
    {
        switch ($action) {
            case 'registrar_jornada':
                return $this->registrarJornada();

            case 'consultar_jornadas':
                return $this->consultarJornadas();

            case 'jornada_detalle':
                return $this->jornadaDetalle();

            case 'actualizar_jornada':
                return $this->actualizarJornada();

            case 'consultar_beneficiarios_jornada':
                return $this->consultarBeneficiariosJornada();

            case 'agregar_beneficiario_jornada':
                return $this->agregarBeneficiarioJornada();

            case 'agregar_diagnostico_jornada':
                return $this->agregarDiagnosticoJornada();

            case 'detalle_diagnosticosJornada':
                return $this->detalle_diagnosticosJornada();

            case 'actualizar_diagnostico_jornada':
                return $this->actualizarDiagnosticoJornada();

            case 'obtener_estadisticas':
                return $this->obtenerEstadisticas();

            default:
                throw new Exception('Accion no valida');
        }
    }

    private function registrarJornada()
    {
        try {
            $query = "INSERT INTO jornadas_medicas (
                        nombre_jornada, tipo_jornada, aforo_maximo, 
                        fecha_inicio, fecha_fin, ubicacion, descripcion
                      ) VALUES (
                        :nombre_jornada, :tipo_jornada, :aforo_maximo, 
                        :fecha_inicio, :fecha_fin, :ubicacion, :descripcion
                      )";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_jornada', $this->__get('nombre_jornada'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_jornada', $this->__get('tipo_jornada'), PDO::PARAM_STR);
            $stmt->bindValue(':aforo_maximo', $this->__get('aforo_maximo'), PDO::PARAM_INT);
            $stmt->bindValue(':fecha_inicio', $this->__get('fecha_inicio'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_fin', $this->__get('fecha_fin'), PDO::PARAM_STR);
            $stmt->bindValue(':ubicacion', $this->__get('ubicacion'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);

            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Jornada registrada exitosamente'
            ];
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function consultarJornadas()
    {
        try {
            $query = "SELECT * FROM jornadas_medicas";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function jornadaDetalle()
    {
        try {
            $query = "SELECT * FROM jornadas_medicas WHERE id_jornada = :id_jornada";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_jornada', $this->__get('id_jornada'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function actualizarJornada()
    {
        try {
            $query = "UPDATE jornadas_medicas SET
                        nombre_jornada = :nombre_jornada,
                        tipo_jornada = :tipo_jornada,
                        aforo_maximo = :aforo_maximo,
                        ubicacion = :ubicacion,
                        descripcion = :descripcion,
                        fecha_inicio = :fecha_inicio,
                        fecha_fin = :fecha_fin,
                        estatus = :estatus
                      WHERE id_jornada = :id_jornada";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_jornada', $this->__get('nombre_jornada'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_jornada', $this->__get('tipo_jornada'), PDO::PARAM_STR);
            $stmt->bindValue(':aforo_maximo', $this->__get('aforo_maximo'), PDO::PARAM_INT);
            $stmt->bindValue(':ubicacion', $this->__get('ubicacion'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_inicio', $this->__get('fecha_inicio'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_fin', $this->__get('fecha_fin'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_STR);
            $stmt->bindValue(':id_jornada', $this->__get('id_jornada'), PDO::PARAM_INT);
            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Jornada actualizada exitosamente'
            ];
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function consultarBeneficiariosJornada()
    {
        try {
            $query = "SELECT jb.*, 
                      (SELECT COUNT(*) FROM jornada_diagnosticos jd WHERE jd.id_jornada_beneficiario = jb.id_jornada_beneficiario) as tiene_diagnostico
                      FROM jornada_beneficiarios jb
                      WHERE jb.id_jornada = :id_jornada AND jb.estatus = 'Atendido'
                      ORDER BY jb.fecha_atencion DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_jornada', $this->__get('id_jornada'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function agregarBeneficiarioJornada()
    {
        try {
            $query = "INSERT INTO jornada_beneficiarios (
                        tipo_cedula, cedula, nombres, apellidos, 
                        fecha_nacimiento, genero, tipo_paciente, 
                        telefono, correo, direccion, id_jornada
                      ) VALUES (
                        :tipo_cedula, :cedula, :nombres, :apellidos, 
                        :fecha_nacimiento, :genero, :tipo_paciente, 
                        :telefono, :correo, :direccion, :id_jornada
                      )";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':tipo_cedula', $this->__get('tipo_cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':cedula', $this->__get('cedula'), PDO::PARAM_STR);
            $stmt->bindValue(':nombres', $this->__get('nombres'), PDO::PARAM_STR);
            $stmt->bindValue(':apellidos', $this->__get('apellidos'), PDO::PARAM_STR);
            $stmt->bindValue(':fecha_nacimiento', $this->__get('fecha_nacimiento'), PDO::PARAM_STR);
            $stmt->bindValue(':genero', $this->__get('genero'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_paciente', $this->__get('tipo_paciente'), PDO::PARAM_STR);
            $stmt->bindValue(':telefono', $this->__get('telefono'), PDO::PARAM_STR);
            $stmt->bindValue(':correo', $this->__get('correo'), PDO::PARAM_STR);
            $stmt->bindValue(':direccion', $this->__get('direccion'), PDO::PARAM_STR);
            $stmt->bindValue(':id_jornada', $this->__get('id_jornada'), PDO::PARAM_INT);

            $stmt->execute();

            return [
                'exito' => true,
                'mensaje' => 'Beneficiario agregado exitosamente a la jornada'
            ];
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function agregarDiagnosticoJornada()
    {
        try {
            $this->conn->beginTransaction();

            // 1. Insertar Diagnóstico
            $query = "INSERT INTO jornada_diagnosticos (id_jornada_beneficiario, id_empleado_medico, diagnostico, tratamiento, observaciones, fecha_diagnostico) VALUES (:id_jornada_beneficiario, :id_empleado_medico, :diagnostico, :tratamiento, :observaciones, NOW())";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_jornada_beneficiario', $this->__get('id_jornada_beneficiario'), PDO::PARAM_INT);
            $stmt->bindValue(':id_empleado_medico', $this->__get('id_empleado_medico'), PDO::PARAM_INT);
            $stmt->bindValue(':diagnostico', $this->__get('diagnostico'), PDO::PARAM_STR);
            $stmt->bindValue(':tratamiento', $this->__get('tratamiento'), PDO::PARAM_STR);
            $stmt->bindValue(':observaciones', $this->__get('observaciones'), PDO::PARAM_STR);
            $stmt->execute();

            $id_jornada_diagnostico = $this->conn->lastInsertId();

            // 2. Procesar Insumos si existen
            $insumos = $this->__get('insumos'); // Esperamos un array de arrays o objetos

            if (!empty($insumos) && is_array($insumos)) {
                foreach ($insumos as $insumo) {
                    $id_insumo = $insumo['id_insumo'];
                    $cantidad_usada = $insumo['cantidad'];
                    $descripcion_insumo = "Insumo utilizado en jornada médica";

                    // a. Verificar Stock
                    $stmtCheck = $this->conn->prepare("SELECT cantidad, nombre_insumo FROM insumos WHERE id_insumo = :id_insumo");
                    $stmtCheck->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
                    $stmtCheck->execute();
                    $dataInsumo = $stmtCheck->fetch(PDO::FETCH_ASSOC);

                    if (!$dataInsumo) {
                        throw new Exception("El insumo con ID $id_insumo no existe");
                    }

                    if ($dataInsumo['cantidad'] < $cantidad_usada) {
                        throw new Exception("Stock insuficiente para el insumo: " . $dataInsumo['nombre_insumo']);
                    }

                    // b. Registrar en jornada_insumos
                    $queryInsumos = "INSERT INTO jornada_insumos (id_jornada_diagnostico, id_insumo, cantidad_usada, descripcion) VALUES (:id_jornada_diagnostico, :id_insumo, :cantidad_usada, :descripcion)";
                    $stmtInsumos = $this->conn->prepare($queryInsumos);
                    $stmtInsumos->bindValue(':id_jornada_diagnostico', $id_jornada_diagnostico, PDO::PARAM_INT);
                    $stmtInsumos->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
                    $stmtInsumos->bindValue(':cantidad_usada', $cantidad_usada, PDO::PARAM_INT);
                    $stmtInsumos->bindValue(':descripcion', $descripcion_insumo, PDO::PARAM_STR);
                    $stmtInsumos->execute();

                    // c. Descontar del inventario (insumos)
                    $nuevo_stock = $dataInsumo['cantidad'] - $cantidad_usada;
                    // Actualizar estatus si llega a 0
                    $estatus_sql = $nuevo_stock == 0 ? "'Agotado'" : "estatus"; // Mantener estatus si no es 0, o cambiar a Agotado logicamente?
                    // Mejor usar lógica simple: si 0 -> Agotado.

                    $queryUpdate = "UPDATE insumos SET cantidad = :nuevo_stock, estatus = CASE WHEN :nuevo_stock = 0 THEN 'Agotado' ELSE estatus END WHERE id_insumo = :id_insumo";
                    $stmtUpdate = $this->conn->prepare($queryUpdate);
                    $stmtUpdate->bindValue(':nuevo_stock', $nuevo_stock, PDO::PARAM_INT);
                    $stmtUpdate->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
                    $stmtUpdate->execute();

                    // d. Registrar movimiento en bitácora de inventario (inventario_medico)
                    $tipo_movimiento = 'Salida per Jornada';
                    $desc_movimiento = "Uso en Jornada Médica (Diagnóstico #$id_jornada_diagnostico)";

                    $queryMov = "INSERT INTO inventario_medico (id_insumo, id_empleado, fecha_movimiento, tipo_movimiento, cantidad, descripcion)
                                 VALUES (:id_insumo, :id_empleado, NOW(), :tipo_movimiento, :cantidad, :descripcion)";
                    $stmtMov = $this->conn->prepare($queryMov);
                    $stmtMov->bindValue(':id_insumo', $id_insumo, PDO::PARAM_INT);
                    $stmtMov->bindValue(':id_empleado', $this->__get('id_empleado_medico'), PDO::PARAM_INT); // El médico que usa el insumo
                    $stmtMov->bindValue(':tipo_movimiento', $tipo_movimiento, PDO::PARAM_STR);
                    $stmtMov->bindValue(':cantidad', $cantidad_usada, PDO::PARAM_INT);
                    $stmtMov->bindValue(':descripcion', $desc_movimiento, PDO::PARAM_STR);
                    $stmtMov->execute();
                }
            }

            $this->conn->commit();

            return [
                'exito' => true,
                'mensaje' => 'Diagnostico agregado exitosamente a la jornada'
            ];
        } catch (Throwable $e) {
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            return [
                'exito' => false,
                'mensaje' => $e->getMessage()
            ];
        }
    }

    private function detalle_diagnosticosJornada()
    {
        try {
            $id_jornada_beneficiario = $this->__get('id_jornada_beneficiario');

            // 1. Obtener datos básicos del diagnóstico y beneficiario
            $query = "SELECT 
                        jd.*, 
                        CONCAT(jb.tipo_cedula, '-', jb.cedula) AS cedula_completa,
                        CONCAT(jb.nombres, ' ', jb.apellidos) AS beneficiario,
                        jb.tipo_cedula, 
                        jb.cedula, 
                        jb.nombres, 
                        jb.apellidos
                    FROM jornada_diagnosticos jd
                    JOIN jornada_beneficiarios jb ON jd.id_jornada_beneficiario = jb.id_jornada_beneficiario
                    WHERE jd.id_jornada_beneficiario = :id_jornada_beneficiario";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id_jornada_beneficiario', $id_jornada_beneficiario, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($data) {
                // 2. Obtener insumos asociados si existen
                $id_jornada_diagnostico = $data['id_jornada_diagnostico'];
                $queryInsumos = "SELECT ji.*, i.nombre_insumo
                                FROM jornada_insumos ji
                                JOIN insumos i ON ji.id_insumo = i.id_insumo
                                WHERE ji.id_jornada_diagnostico = :id_jornada_diagnostico";

                $stmtIn = $this->conn->prepare($queryInsumos);
                $stmtIn->bindValue(':id_jornada_diagnostico', $id_jornada_diagnostico, PDO::PARAM_INT);
                $stmtIn->execute();
                $data['insumos'] = $stmtIn->fetchAll(PDO::FETCH_ASSOC);
            }

            return $data;
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => "Error en la consulta: " . $e->getMessage()
            ];
        }
    }

    private function actualizarDiagnosticoJornada()
    {
        try {
            $id_jornada_diagnostico = $this->__get('id_jornada_diagnostico');
            $diagnostico = $this->__get('diagnostico');
            $tratamiento = $this->__get('tratamiento');
            $observaciones = $this->__get('observaciones');

            $query = "UPDATE jornada_diagnosticos 
                      SET diagnostico = :diagnostico, 
                          tratamiento = :tratamiento, 
                          observaciones = :observaciones 
                      WHERE id_jornada_diagnostico = :id_jornada_diagnostico";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':diagnostico', $diagnostico);
            $stmt->bindValue(':tratamiento', $tratamiento);
            $stmt->bindValue(':observaciones', $observaciones);
            $stmt->bindValue(':id_jornada_diagnostico', $id_jornada_diagnostico, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return [
                    'exito' => true,
                    'mensaje' => 'Diagnóstico actualizado exitosamente'
                ];
            } else {
                throw new Exception("Error al actualizar el diagnóstico");
            }
        } catch (Throwable $e) {
            return [
                'exito' => false,
                'mensaje' => "Error: " . $e->getMessage()
            ];
        }
    }

    private function obtenerEstadisticas()
    {
        try {
            // Total de jornadas
            $queryTotal = "SELECT COUNT(*) as total FROM jornadas_medicas";
            $stmtTotal = $this->conn->prepare($queryTotal);
            $stmtTotal->execute();
            $total = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];

            // Jornadas en progreso (Activas)
            $queryActivas = "SELECT COUNT(*) as total FROM jornadas_medicas WHERE estatus = 'Activa'";
            $stmtActivas = $this->conn->prepare($queryActivas);
            $stmtActivas->execute();
            $activas = $stmtActivas->fetch(PDO::FETCH_ASSOC)['total'];

            // Jornadas finalizadas
            $queryFin = "SELECT COUNT(*) as total FROM jornadas_medicas WHERE estatus = 'Finalizada'";
            $stmtFin = $this->conn->prepare($queryFin);
            $stmtFin->execute();
            $finalizadas = $stmtFin->fetch(PDO::FETCH_ASSOC)['total'];

            // Jornadas del mes actual
            $queryMes = "SELECT COUNT(*) as total FROM jornadas_medicas WHERE MONTH(fecha_inicio) = MONTH(CURRENT_DATE()) AND YEAR(fecha_inicio) = YEAR(CURRENT_DATE())";
            $stmtMes = $this->conn->prepare($queryMes);
            $stmtMes->execute();
            $mes = $stmtMes->fetch(PDO::FETCH_ASSOC)['total'];

            return [
                'totales' => $total,
                'activas' => $activas,
                'finalizadas' => $finalizadas,
                'mes' => $mes
            ];
        } catch (Throwable $e) {
            throw new Exception('Error al obtener estadisticas: ' . $e->getMessage());
        }
    }
}
