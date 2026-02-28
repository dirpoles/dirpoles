<?php
namespace App\Models;
use App\Models\SecurityModel;
use PDO;
use Throwable;
use Exception;

class loginModel extends SecurityModel {
    private $atributos = [];

    public function __set($nombre, $valor){
        $this->atributos[$nombre] = $valor;
    }

    public function __get($atributo){
        return isset($this->atributos[$atributo]) ? $this->atributos[$atributo] : null;
    }

    public function manejador($action){
        switch($action){
            case 'Autenticar':
                return $this->authenticate();

            case 'Verificar_username':
                return $this->existe_usuario();

            case 'Deshabilitar':
                return $this->Deshabilitar_usuario();

            case 'Estadisticas':
                return [
                    'Empleados' => $this->obtenerConteoEmpleados(),
                    'Beneficiarios' => $this->obtenerConteoBeneficiarios(),
                    'Citas' => $this->obtenerConteoCitas(),
                    'Diagnosticos' => $this->obtenerConteoDiagnosticos(),
                    'CitaxDia' => $this->obtenerCitasPorDia(),
                    'ProductosBajoStock' => $this->productosBajoStock(),
                    'ReferenciasPorEstado' => $this->referenciasPendientes()
                ];
        }
    }

    private function authenticate() {
        try{
            $query = "
                SELECT empleado.*, tipo_empleado.tipo AS nombre_tipo
                FROM empleado
                JOIN tipo_empleado ON empleado.id_tipo_empleado = tipo_empleado.id_tipo_emp
                WHERE empleado.correo = :correo
            ";

            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue('correo', $this->__get('correo'), PDO::PARAM_STR);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verifica el password solo si se encontro un usuario
            if ($user && password_verify($this->__get('password'), $user['clave'])) {
                return [
                    'estado' => 'exito',
                    'usuario' => $user
                ];
            }

            return [
                'estado' => 'error',
                'mensaje' => 'Credenciales inválidas'
            ];

        } catch(Throwable $e){
            error_log($e->getMessage());
            throw new Exception('Error al autenticar: '. $e->getMessage());
        }
    }

    private function Deshabilitar_usuario() {
        try{
            $query = "UPDATE empleado SET estatus = 0 WHERE correo = :correo";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':correo', $this->__get('correo'), PDO::PARAM_STR);
            return $stmt->execute();

        } catch(Exception $e){
            error_log($e->getMessage());
            throw new Exception('Error al deshabilitar el usuario: '. $e->getMessage());
        }
    }

    private function existe_usuario(){
        try{
            $query = "SELECT correo FROM empleado WHERE correo = :correo";
            $stmt = $this->conn_security->prepare($query);
            $stmt->bindValue(':correo', $this->__get('correo'), PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch(Exception $e){
            error_log($e->getMessage());
            throw new Exception('Error al verificar el username: '. $e->getMessage());
        }
    }

    private function obtenerConteoEmpleados() {
        try {
            $query = $this->conn_security->query("SELECT COUNT(*) as total FROM empleado");
            $result = $query->fetch(PDO::FETCH_ASSOC);
            
            return $result['total'];
        } catch (Throwable $e) {
            error_log("Error en obtenerConteoEmpleados: " . $e->getMessage());
            throw new Exception("Error al obtener el conteo de empleados: " . $e->getMessage());
        }
    }

    private function obtenerConteoCitas() {
        try {
            $query = $this->conn_security->query("SELECT COUNT(*) as total FROM dirpoles_business.cita WHERE fecha >= CURDATE()");
            $result = $query->fetch(PDO::FETCH_ASSOC);
            
            return $result['total'];
        } catch (Throwable $e) {
            error_log("Error en obtenerConteoCitas: " . $e->getMessage());
            throw new Exception("Error al obtener el conteo de citas: " . $e->getMessage());
        }
    }

    private function obtenerConteoBeneficiarios() {
        try {     
            $query = $this->conn_security->query("SELECT COUNT(*) as total FROM dirpoles_business.beneficiario");
            $result = $query->fetch(PDO::FETCH_ASSOC);
            
            return $result['total'];
        } catch (Throwable $e) {
            error_log("Error en obtenerConteoBeneficiarios: " . $e->getMessage());
            throw new Exception("Error al obtener el conteo de beneficiarios: " . $e->getMessage());
        }
    }

    private function obtenerConteoDiagnosticos() {
        try {   
            $query = "SELECT 
                        (SELECT COUNT(*) FROM dirpoles_business.consulta_medica) AS total_consulta_medica,
                        (SELECT COUNT(*) FROM dirpoles_business.consulta_psicologica) AS total_consulta_psicologica,
                        (SELECT COUNT(*) FROM dirpoles_business.discapacidad) AS total_discapacidad,
                        (SELECT COUNT(*) FROM dirpoles_business.orientacion) AS total_orientacion,
                        (SELECT COUNT(*) FROM dirpoles_business.fames) AS total_fames,
                        (SELECT COUNT(*) FROM dirpoles_business.exoneracion) AS total_exoneracion,
                        (SELECT COUNT(*) FROM dirpoles_business.becas) AS total_becas";

            $stmt = $this->conn_security->query($query);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Si deseas el total general:
            $total = array_sum($result);
            
            return [
                'por_area' => $result,
                'total' => $total
            ];
        } catch (Throwable $e) {
            error_log("Error en obtenerConteoDiagnosticos: " . $e->getMessage());
            throw new Exception("Error al obtener el conteo de diagnósticos: " . $e->getMessage());
        }
    }

    private function obtenerCitasPorDia() {
        try {
            $query = "
                SELECT DATE(fecha) AS dia, COUNT(*) AS total 
                FROM dirpoles_business.cita 
                WHERE fecha >= CURDATE() 
                AND fecha < CURDATE() + INTERVAL 7 DAY 
                GROUP BY DATE(fecha) 
                ORDER BY DATE(fecha)";
            
            $stmt = $this->conn_security->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error en obtenerCitasPorDia: " . $e->getMessage());
            throw new Exception("Error al obtener las citas por día: " . $e->getMessage());
        }
    }

    //Estadisticas generales
    private function referenciasPendientes() {
        try {
            $sql = "SELECT estado, COUNT(*) as total
                    FROM referencias
                    WHERE id_empleado_destino = :id_empleado
                    GROUP BY estado";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id_empleado', $this->__get('id_empleado'), PDO::PARAM_INT);
            $stmt->execute();

        } catch (Throwable $e) {
            error_log("Error contar referencias: " . $e->getMessage());
            return ['Pendiente'=>0,'Aceptada'=>0,'Rechazada'=>0];
        }
    }

    private function productosBajoStock($limite = 5, $threshold = 5) {
        try {
            $sql = "SELECT i.id_insumo, i.nombre_insumo, i.cantidad, i.fecha_vencimiento, p.nombre_presentacion
                    FROM insumos i
                    LEFT JOIN presentacion_insumo p ON i.id_presentacion = p.id_presentacion
                    WHERE i.cantidad <= :threshold
                    ORDER BY i.cantidad ASC, i.fecha_vencimiento ASC
                    LIMIT :limite";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':threshold', (int)$threshold, PDO::PARAM_INT);
            $stmt->bindValue(':limite', (int)$limite, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            error_log("Error productos bajo stock: " . $e->getMessage());
            return [];
        }
    }



    
    
}

?>