<?php
namespace App\Models;
use Exception;
use PDO;
use Throwable;
use App\Models\BusinessModel;

class ConfigModel extends BusinessModel {
    private $atributos = [];

    public function __set($atributo, $valor){
        $this->atributos[$atributo] = $valor;
    }

    public function __get($atributo){
        return $this->atributos[$atributo] ?? null;
    }

    public function manejarAccion($action){
        switch($action){
            case 'validar_patologia':
                return $this->validarPatologia();
            case 'validar_pnf':
                return $this->validarPNF();
            case 'validar_servicio':
                return $this->validarServicio();
            case 'validar_tipo_empleado':
                return $this->validarTipoEmpleado();
            case 'validar_presentacion':
                return $this->validarPresentacionInsumo();

            case 'registrar_patologia':
                return $this->registrarPatologia();
            case 'registrar_pnf':
                return $this->registrarPNF();
            case 'registrar_servicio':
                return $this->registrarServicio();
            case 'registrar_tipo_empleado':
                return $this->registrarTipoEmpleado();
            case 'registrar_tipo_mobiliario':
                return $this->registrarTipoMobiliario();
            case 'registrar_tipo_equipo':
                return $this->registrarTipoEquipo();
            case 'registrar_presentacion_insumo':
                return $this->registrarPresentacionInsumo();

            case 'obtener_servicios':
                return $this->obtenerServicios();
            case 'consultar_patologias':
                return $this->consultarPatologias();
            case 'consultar_pnf':
                return $this->consultarPNF();
            case 'consultar_servicios':
                return $this->consultarServicios();
            case 'consultar_tipo_empleado':
                return $this->consultarTipoEmpleado();
            case 'consultar_tipo_mobiliario':
                return $this->consultarTipoMobiliario();
            case 'consultar_tipo_equipo':
                return $this->consultarTipoEquipo();
            case 'consultar_presentacion_insumo':
                return $this->consultarPresentacionInsumo();

            case 'detalle_patologia':
                return $this->detallePatologia();
            case 'detalle_pnf':
                return $this->detallePNF();
            case 'detalle_presentacion_insumo':
                return $this->detallePresentacionInsumo();
            case 'detalle_servicio':
                return $this->detalleServicio();
            case 'detalle_tipo_empleado':
                return $this->detalleTipoEmpleado();
            case 'detalle_tipo_mobiliario':
                return $this->detalleTipoMobiliario();
            case 'detalle_tipo_equipo':
                return $this->detalleTipoEquipo();


            case 'actualizar_patologia':
                return $this->actualizarPatologia();
            case 'actualizar_pnf':
                return $this->actualizarPNF();
            case 'actualizar_presentacion_insumo':
                return $this->actualizarPresentacionInsumo();
            case 'actualizar_servicio':
                return $this->actualizarServicio();
            case 'actualizar_tipo_empleado':
                return $this->actualizarTipoEmpleado();
            case 'actualizar_tipo_mobiliario':
                return $this->actualizarTipoMobiliario();
            case 'actualizar_tipo_equipo':
                return $this->actualizarTipoEquipo();

            default:
                throw new Exception('Acción no permitida');
        }
    }

    private function validarPatologia(){
        try{
            $query = "SELECT nombre_patologia, tipo_patologia FROM patologia WHERE nombre_patologia = :nombre_patologia AND tipo_patologia = :tipo_patologia";

            //Excluir el registro actual si se esta editando
            if($this->__get('id_patologia')){
                $query .= " AND id_patologia != :id_patologia";
            }

            $query .= " LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_patologia', $this->__get('nombre_patologia'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_patologia', $this->__get('tipo_patologia'), PDO::PARAM_STR);
            
            //Si se esta editando, excluir el registro actual
            if($this->__get('id_patologia')){
                $stmt->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            }

            $stmt->execute();
            return $stmt->fetch() ? true : false;
            
        }catch(Throwable $th){
            error_log("Error al validar patologia: " . $th->getMessage());
            return false;
        }
    }

    private function validarPNF(){
        try{
            $query = "SELECT nombre_pnf FROM pnf WHERE nombre_pnf = :nombre_pnf";

            //Excluir el registro actual si se esta editando
            if($this->__get('id_pnf')){
                $query .= " AND id_pnf != :id_pnf";
            }

            $query .= " LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_pnf', $this->__get('nombre_pnf'), PDO::PARAM_STR);
            
            //Si se esta editando, excluir el registro actual
            if($this->__get('id_pnf')){
                $stmt->bindValue(':id_pnf', $this->__get('id_pnf'), PDO::PARAM_INT);
            }

            $stmt->execute();
            return $stmt->fetch() ? true : false;
            
        }catch(Throwable $th){
            error_log("Error al validar PNF: " . $th->getMessage());
            return false;
        }
    }

    private function validarServicio(){
        try{
            $query = "SELECT nombre_serv FROM servicio WHERE nombre_serv = :nombre_serv";

            //Excluir el registro actual si se esta editando
            if($this->__get('id_servicios')){
                $query .= " AND id_servicios != :id_servicios";
            }

            $query .= " LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_serv', $this->__get('nombre_serv'), PDO::PARAM_STR);
            
            //Si se esta editando, excluir el registro actual
            if($this->__get('id_servicios')){
                $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            }

            $stmt->execute();
            return $stmt->fetch() ? true : false;
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function obtenerServicios(){
        try{
            $query = "SELECT id_servicios, nombre_serv FROM servicio";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function validarTipoEmpleado(){
        try{
            $query = "SELECT tipo, id_servicios FROM dirpoles_security.tipo_empleado WHERE tipo = :tipo AND id_servicios = :id_servicios";

            //Excluir el registro actual si se esta editando
            if($this->__get('id_tipo_emp')){
                $query .= " AND id_tipo_emp != :id_tipo_emp";
            }

            $query .= " LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':tipo', $this->__get('tipo'), PDO::PARAM_STR);
            $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            
            //Si se esta editando, excluir el registro actual
            if($this->__get('id_tipo_emp')){
                $stmt->bindValue(':id_tipo_emp', $this->__get('id_tipo_emp'), PDO::PARAM_INT);
            }

            $stmt->execute();
            return $stmt->fetch() ? true : false;
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function registrarPatologia(){
        try{
            $query = "INSERT INTO patologia (nombre_patologia, tipo_patologia, fecha_creacion) VALUES (:nombre_patologia, :tipo_patologia, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_patologia', $this->__get('nombre_patologia'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_patologia', $this->__get('tipo_patologia'), PDO::PARAM_STR);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Patología registrada exitosamente'
            ];

        }catch(Throwable $th){
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar la patología: ' . $th->getMessage()
            ];
        }
    }

    private function registrarPNF(){
        try{
            $query = "INSERT INTO pnf (nombre_pnf, estatus, fecha_creacion) VALUES (:nombre_pnf, '1', NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_pnf', $this->__get('nombre_pnf'), PDO::PARAM_STR);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'PNF registrado exitosamente'
            ];

        }catch(Throwable $th){
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar el PNF: ' . $th->getMessage()
            ];
        }
    }

    private function registrarServicio(){
        try{
            $query = "INSERT INTO servicio (nombre_serv, estatus, fecha_creacion) VALUES (:nombre_serv, '1', NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_serv', $this->__get('nombre_serv'), PDO::PARAM_STR);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Servicio registrado exitosamente'
            ];

        }catch(Throwable $th){
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar el Servicio: ' . $th->getMessage()
            ];
        }
    }

    private function registrarTipoEmpleado(){
        try{
            $query = "INSERT INTO dirpoles_security.tipo_empleado (tipo, id_servicios, estatus, fecha_creacion) VALUES (:tipo, :id_servicios, '1', NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':tipo', $this->__get('tipo'), PDO::PARAM_STR);
            $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Tipo de Empleado registrado exitosamente'
            ];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar el Tipo de Empleado: ' . $e->getMessage()
            ];
        }
    }

    private function registrarTipoMobiliario(){
        try{
            $query = "INSERT INTO tipo_mobiliario (nombre, descripcion, estatus, fecha_creacion) VALUES (:nombre, :descripcion, '1', NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre', $this->__get('nombre'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Tipo de Mobiliario registrado exitosamente'
            ];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar el Tipo de Mobiliario: ' . $e->getMessage()
            ];
        }
    }

    private function registrarTipoEquipo(){
        try{
            $query = "INSERT INTO tipo_equipo (nombre, descripcion, estatus, fecha_creacion) VALUES (:nombre, :descripcion, '1', NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre', $this->__get('nombre'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Tipo de Equipo registrado exitosamente'
            ];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar el Tipo de Equipo: ' . $e->getMessage()
            ];
        }
    }

    private function validarPresentacionInsumo(){
        try{
            $query = "SELECT nombre_presentacion FROM presentacion_insumo WHERE nombre_presentacion = :nombre_presentacion";

            //Excluir el registro actual si se esta editando
            if($this->__get('id_presentacion')){
                $query .= " AND id_presentacion != :id_presentacion";
            }

            $query .= " LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_presentacion', $this->__get('nombre_presentacion'), PDO::PARAM_STR);
            
            //Si se esta editando, excluir el registro actual
            if($this->__get('id_presentacion')){
                $stmt->bindValue(':id_presentacion', $this->__get('id_presentacion'), PDO::PARAM_INT);
            }

            $stmt->execute();
            return $stmt->fetch() ? true : false;
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function registrarPresentacionInsumo(){
        try{
            $query = "INSERT INTO presentacion_insumo (nombre_presentacion, fecha_creacion) VALUES (:nombre_presentacion, NOW())";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_presentacion', $this->__get('nombre_presentacion'), PDO::PARAM_STR);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Presentación de Insumo registrada exitosamente'
            ];

        } catch(Throwable $e){
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar la Presentación de Insumo: ' . $e->getMessage()
            ];
        }
    }

    private function consultarPatologias(){
        try{
            $query = "SELECT id_patologia, nombre_patologia, tipo_patologia, fecha_creacion FROM patologia ORDER BY fecha_creacion DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function consultarPNF(){
        try{
            $query = "SELECT id_pnf, nombre_pnf, estatus, fecha_creacion FROM pnf ORDER BY fecha_creacion DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function consultarServicios(){
        try{
            $query = "SELECT id_servicios, nombre_serv AS nombre_servicio, estatus, fecha_creacion FROM servicio ORDER BY fecha_creacion DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function consultarTipoEmpleado(){
        try{
            $query = "SELECT 
                t.id_tipo_emp, 
                t.tipo AS tipo_empleado, 
                t.id_servicios, 
                s.nombre_serv AS servicio, 
                t.estatus, 
                t.fecha_creacion
            FROM dirpoles_security.tipo_empleado t
            INNER JOIN servicio s ON t.id_servicios = s.id_servicios
            ORDER BY t.fecha_creacion DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function consultarTipoMobiliario(){
        try{
            $query = "SELECT id_tipo_mobiliario, nombre AS nombre_mobiliario, descripcion AS descripcion_mobiliario, estatus, fecha_creacion FROM tipo_mobiliario ORDER BY fecha_creacion DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function consultarTipoEquipo(){
        try{
            $query = "SELECT id_tipo_equipo, nombre AS nombre_equipo, descripcion AS descripcion_equipo, estatus, fecha_creacion FROM tipo_equipo ORDER BY fecha_creacion DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function consultarPresentacionInsumo(){
        try{
            $query = "SELECT id_presentacion, nombre_presentacion, fecha_creacion FROM presentacion_insumo ORDER BY fecha_creacion DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function detallePatologia(){
        try{
            $query = "SELECT id_patologia, nombre_patologia, tipo_patologia, fecha_creacion FROM patologia WHERE id_patologia = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $this->__get('id'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function actualizarPatologia(){
        try{
            $query = "UPDATE patologia SET nombre_patologia = :nombre_patologia, tipo_patologia = :tipo_patologia WHERE id_patologia = :id_patologia";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_patologia', $this->__get('nombre_patologia'), PDO::PARAM_STR);
            $stmt->bindValue(':tipo_patologia', $this->__get('tipo_patologia'), PDO::PARAM_STR);
            $stmt->bindValue(':id_patologia', $this->__get('id_patologia'), PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Patología actualizada exitosamente'
            ];
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function detallePNF(){
        try{
            $query = "SELECT id_pnf, nombre_pnf, estatus FROM pnf WHERE id_pnf = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $this->__get('id'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function actualizarPNF(){
        try{
            $query = "UPDATE pnf SET nombre_pnf = :nombre_pnf, estatus = :estatus WHERE id_pnf = :id_pnf";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_pnf', $this->__get('nombre_pnf'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_STR);
            $stmt->bindValue(':id_pnf', $this->__get('id_pnf'), PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'PNF actualizado exitosamente'
            ];
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function detallePresentacionInsumo(){
        try{
            $query = "SELECT id_presentacion, nombre_presentacion FROM presentacion_insumo WHERE id_presentacion = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $this->__get('id'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function actualizarPresentacionInsumo(){
        try{
            $query = "UPDATE presentacion_insumo SET nombre_presentacion = :nombre_presentacion WHERE id_presentacion = :id_presentacion";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_presentacion', $this->__get('nombre_presentacion'), PDO::PARAM_STR);
            $stmt->bindValue(':id_presentacion', $this->__get('id_presentacion'), PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Presentación de insumo actualizada exitosamente'
            ];
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function detalleServicio(){
        try{
            $query = "SELECT id_servicios, nombre_serv, estatus FROM servicio WHERE id_servicios = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $this->__get('id'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function actualizarServicio(){
        try{
            $query = "UPDATE servicio SET nombre_serv = :nombre_serv, estatus = :estatus WHERE id_servicios = :id_servicios";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre_serv', $this->__get('nombre_serv'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_STR);
            $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Servicio actualizado exitosamente'
            ];
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function detalleTipoEmpleado(){
        try{
            $query = "SELECT id_tipo_emp, tipo, id_servicios FROM dirpoles_security.tipo_empleado WHERE id_tipo_emp = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $this->__get('id'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function actualizarTipoEmpleado(){
        try{
            $query = "UPDATE dirpoles_security.tipo_empleado SET tipo = :tipo, id_servicios = :id_servicios WHERE id_tipo_emp = :id_tipo_emp";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':tipo', $this->__get('tipo'), PDO::PARAM_STR);
            $stmt->bindValue(':id_servicios', $this->__get('id_servicios'), PDO::PARAM_INT);
            $stmt->bindValue(':id_tipo_emp', $this->__get('id_tipo_emp'), PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Tipo de empleado actualizado exitosamente'
            ];
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function detalleTipoMobiliario(){
        try{
            $query = "SELECT id_tipo_mobiliario, nombre, descripcion, estatus FROM tipo_mobiliario WHERE id_tipo_mobiliario = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $this->__get('id'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function actualizarTipoMobiliario(){
        try{
            $query = "UPDATE tipo_mobiliario SET nombre = :nombre, descripcion = :descripcion, estatus = :estatus WHERE id_tipo_mobiliario = :id_tipo_mobiliario";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre', $this->__get('nombre'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_STR);
            $stmt->bindValue(':id_tipo_mobiliario', $this->__get('id_tipo_mobiliario'), PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Tipo de mobiliario actualizado exitosamente'
            ];
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function detalleTipoEquipo(){
        try{
            $query = "SELECT id_tipo_equipo, nombre, descripcion, estatus FROM tipo_equipo WHERE id_tipo_equipo = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $this->__get('id'), PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(Throwable $th){
            throw $th;
        }
    }

    private function actualizarTipoEquipo(){
        try{
            $query = "UPDATE tipo_equipo SET nombre = :nombre, descripcion = :descripcion, estatus = :estatus WHERE id_tipo_equipo = :id_tipo_equipo";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':nombre', $this->__get('nombre'), PDO::PARAM_STR);
            $stmt->bindValue(':descripcion', $this->__get('descripcion'), PDO::PARAM_STR);
            $stmt->bindValue(':estatus', $this->__get('estatus'), PDO::PARAM_STR);
            $stmt->bindValue(':id_tipo_equipo', $this->__get('id_tipo_equipo'), PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'exito'=> true,
                'mensaje' => 'Tipo de equipo actualizado exitosamente'
            ];
        }catch(Throwable $th){
            throw $th;
        }
    }
}