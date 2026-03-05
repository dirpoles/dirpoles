<?php

namespace App\Models;

use App\Models\BusinessModel;
use PDO;
use Throwable;
use Exception;
use InvalidArgumentException;

class ReportesModel extends BusinessModel
{
    private $atributos = [];

    public function __set($nombre, $valor)
    {
        switch ($nombre) {
            case 'id_tipo_empleado':
            case 'id_empleado':
            case 'id_servicios':
                if (!filter_var($valor, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])) {
                    throw new InvalidArgumentException("El ID debe ser un número entero positivo.");
                }
                break;

            default:
                // Si no es un campo definido, permitimos asignarlo sin validación
                break;
        }

        $this->atributos[$nombre] = $valor;
    }

    public function __get($nombre)
    {
        return isset($this->atributos[$nombre]) ? $this->atributos[$nombre] : null;
    }

    public function manejarAccion($action)
    {
        switch ($action) {
            case 'reporteGeneral':
                return $this->getReportDataGeneral();


                //------------Empleados------------------
            case 'reporteEmpleados':
                return $this->getReportDataEmp();


                //------------Beneficiarios------------------
            case 'reporteBeneficiarios':
                return $this->getReportDataBenef();


                //------------ Psicologia-----------------
            case 'morbilidad':
                return $this->getReportDataPs();


            case 'citas':
                return $this->getReportDataPsCit();


                //------------------------------------------------
                //--------------Medicina--------------------------

            case 'reporteMed':
                return $this->getReportDataMed();


            case 'reporteInvMed':
                return $this->getReportInvMed();

                //---------------------------------------------------

                //------------Orientacion----------------------

            case 'reporteOrientacion':
                return $this->getReportDataOr();


                //--------TrabajoSocial---------------------------------
            case 'reporteBecas':
                return $this->getReportDataBecas();


            case 'reporteEx':
                return $this->getReportDataEx();


            case 'reporteFames':
                return $this->getReportDataFames();


            case 'reporteEmb':
                return $this->getReportDataEmb();


                //--------------------------------------------------

                //---------------Discapacidad------------------------

            case 'reporteDiscapacidad':
                return $this->getReportDataD();

                //----------------------------------------------------
                //---------------Referencias--------------------------

            case 'reporteReferencia':
                return $this->reporteReferencia();


                //----------------------------------------------------
                //---------------Mobiliario--------------------------
            case 'dataMob':
                return [
                    'servicio' => $this->getDataMob('servicio'),
                    'tipoMob' => $this->getDataMob('tipoMob'),
                    'marca' => $this->getDataMob('marca'),
                    'modelo' => $this->getDataMob('modelo'),
                ];


            case 'dataEq':
                return [
                    'servicio' => $this->getDataEq('servicio'),
                    'tipoE' => $this->getDataEq('tipoE'),
                    'marca' => $this->getDataEq('marca'),
                    'modelo' => $this->getDataEq('modelo'),
                    'serial' => $this->getDataEq('serial')
                ];


            case 'reporteMob':
                return $this->getReportDataMob();


            case 'reporteEq':
                return $this->getReportDataEq();


                //---------------Transporte--------------------------

            case 'dataTrans':
                return [
                    'vehiculos' => $this->getReportDataTransp('getVehiculo'),
                    'proveedores' => $this->getReportDataTransp('getProveedores'),
                    'rutas' => $this->getReportDataTransp('getRutas'),
                    'repuestos' => $this->getReportDataTransp('getRepuestos'),
                ];


                //---------------Jornada--------------------------

            case 'dataJornada':
                return $this->getDataJorn();
        }
    }

    private function obtenerPNF($arg)
    {
        $joins = [
            'becas' => "JOIN becas be ON ss.id_solicitud_serv = be.id_solicitud_serv",
            'exoneracion' => "JOIN exoneracion ex ON ss.id_solicitud_serv = ex.id_solicitud_serv",
            'fames' => "JOIN fames f ON ss.id_solicitud_serv = f.id_solicitud_serv",
            'emb' => "JOIN gestion_emb ge ON ss.id_solicitud_serv = ge.id_solicitud_serv",
        ];
        $joins2 = ['becas' => ", be.tipo_banco"];

        try {
            $sql = "SELECT p.id_pnf, p.nombre_pnf, p.estatus" . ($joins2[$arg] ?? "") . "
            FROM pnf p
            JOIN beneficiario bn ON p.id_pnf = bn.id_pnf
            JOIN solicitud_de_servicio ss ON bn.id_beneficiario = ss.id_beneficiario 
            " . $joins[$arg] . " 
            WHERE p.estatus = 1 
            ORDER BY p.nombre_pnf ASC";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception("Error al obtener los PNF: " . $e->getMessage());
        }
    }

    private function patologias()
    {

        try {
            $query = "SELECT DISTINCT p.id_patologia, p.nombre_patologia
        FROM patologia p
        JOIN detalle_patologia dp ON p.id_patologia = dp.id_patologia
        JOIN fames f ON dp.id_detalle_patologia = f.id_detalle_patologia";
            $stmt = $this->conn->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception("Error al obtener patologias: " . $e->getMessage());
        }
    }

    private function getReportDataGeneral()
    {
        try {
            $query = "SELECT
                    b.nombres, 
                    b.apellidos, 
                    b.cedula,
                    b.genero,
                    pnf.nombre_pnf, 
                    'Becas' AS nombre_serv,
                    bp.fecha_creacion
                FROM 
                    beneficiario b
                LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
                LEFT JOIN solicitud_de_servicio ss ON ss.id_beneficiario = b.id_beneficiario
                LEFT JOIN becas bp ON ss.id_solicitud_serv = bp.id_solicitud_serv
                WHERE bp.fecha_creacion IS NOT NULL";

            $query .= " UNION ALL 

            SELECT
                b.nombres, 
                b.apellidos, 
                b.cedula,
                b.genero,
                pnf.nombre_pnf, 
                'Exoneración' AS nombre_serv,
                ep.fecha_creacion
            FROM 
                beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            LEFT JOIN solicitud_de_servicio ss ON ss.id_beneficiario = b.id_beneficiario
            LEFT JOIN exoneracion ep ON ss.id_solicitud_serv = ep.id_solicitud_serv
            WHERE ep.fecha_creacion IS NOT NULL";

            $query .= " UNION ALL

            SELECT
                b.nombres, 
                b.apellidos, 
                b.cedula,
                b.genero,
                pnf.nombre_pnf, 
                'FAMES' AS nombre_serv,
                fp.fecha_creacion
            FROM 
                beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            LEFT JOIN solicitud_de_servicio ss ON ss.id_beneficiario = b.id_beneficiario
            LEFT JOIN fames fp ON ss.id_solicitud_serv = fp.id_solicitud_serv
            WHERE fp.fecha_creacion IS NOT NULL";

            $query .= " UNION ALL

            SELECT
                b.nombres, 
                b.apellidos, 
                b.cedula,
                b.genero,
                pnf.nombre_pnf, 
                s.nombre_serv,
                mp.fecha_creacion
            FROM 
                beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            LEFT JOIN solicitud_de_servicio ss ON ss.id_beneficiario = b.id_beneficiario
            LEFT JOIN servicio s ON ss.id_servicios = s.id_servicios
            LEFT JOIN consulta_medica mp ON ss.id_solicitud_serv = mp.id_solicitud_serv
            WHERE mp.fecha_creacion IS NOT NULL";

            $query .= " UNION ALL

            SELECT
                b.nombres, 
                b.apellidos, 
                b.cedula,
                b.genero,
                pnf.nombre_pnf, 
                s.nombre_serv,
                op.fecha_creacion
            FROM 
                beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            LEFT JOIN solicitud_de_servicio ss ON ss.id_beneficiario = b.id_beneficiario
            LEFT JOIN servicio s ON ss.id_servicios = s.id_servicios
            LEFT JOIN orientacion op ON ss.id_solicitud_serv = op.id_solicitud_serv
            WHERE op.fecha_creacion IS NOT NULL";

            $query .= " UNION ALL

            SELECT
                b.nombres, 
                b.apellidos, 
                b.cedula,
                b.genero,
                pnf.nombre_pnf, 
                s.nombre_serv,
                dp.fecha_creacion
            FROM 
                beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            LEFT JOIN solicitud_de_servicio ss ON ss.id_beneficiario = b.id_beneficiario
            LEFT JOIN servicio s ON ss.id_servicios = s.id_servicios
            LEFT JOIN discapacidad dp ON ss.id_solicitud_serv = dp.id_solicitud_serv
            WHERE dp.fecha_creacion IS NOT NULL";

            $query .= " UNION ALL

            SELECT
                b.nombres, 
                b.apellidos, 
                b.cedula,
                b.genero,
                pnf.nombre_pnf, 
                s.nombre_serv,
                cp.fecha_creacion
            FROM 
                beneficiario b
            LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf
            LEFT JOIN solicitud_de_servicio ss ON ss.id_beneficiario = b.id_beneficiario
            LEFT JOIN servicio s ON ss.id_servicios = s.id_servicios
            LEFT JOIN consulta_psicologica cp ON ss.id_solicitud_serv = cp.id_solicitud_serv
            LEFT JOIN dirpoles_security.empleado e ON e.id_empleado = ss.id_empleado
            LEFT JOIN dirpoles_security.tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_emp
            WHERE cp.fecha_creacion IS NOT NULL";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getReportDataEmp()
    {
        try {
            $query = "SELECT e.*, te.tipo, s.nombre_serv
            FROM dirpoles_security.empleado e
            JOIN dirpoles_security.tipo_empleado te ON e.id_tipo_empleado = te.id_tipo_emp
            JOIN servicio s ON te.id_servicios = s.id_servicios";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getReportDataBenef()
    {
        try {
            $query = "SELECT b.*, p.nombre_pnf
                    FROM beneficiario b
                    JOIN pnf p ON b.id_pnf = p.id_pnf";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getReportDataPs()
    {
        try {
            $query = "SELECT p.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, pnf.nombre_pnf, b.genero
         FROM consulta_psicologica p
         LEFT JOIN solicitud_de_servicio ss ON p.id_solicitud_serv = ss.id_solicitud_serv
         LEFT JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
         LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la bd: ' . $e->getMessage());
        }
    }

    private function getReportDataPsCit()
    {
        try {
            $query = "SELECT ct.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, pnf.nombre_pnf, b.genero
         FROM cita ct
         LEFT JOIN dirpoles_security.empleado e ON ct.id_empleado = e.id_empleado
         LEFT JOIN beneficiario b ON ct.id_beneficiario = b.id_beneficiario
         LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la bd: ' . $e->getMessage());
        }
    }

    private function getReportDataMed()
    {
        try {
            $query = "SELECT cm.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, pnf.nombre_pnf, b.genero
         FROM consulta_medica cm
         LEFT JOIN solicitud_de_servicio ss ON cm.id_solicitud_serv = ss.id_solicitud_serv
         LEFT JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
         LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la bd: ' . $e->getMessage());
        }
    }

    private function getReportInvMed()
    {
        try {
            $query = "SELECT i.*, pi.nombre_presentacion
         FROM insumos i
         JOIN presentacion_insumo pi ON i.id_presentacion = pi.id_presentacion";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la bd: ' . $e->getMessage());
        }
    }

    private function getReportDataOr()
    {
        try {
            $query = "SELECT o.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, pnf.nombre_pnf, b.genero, b.tipo_cedula
         FROM orientacion o
         LEFT JOIN solicitud_de_servicio ss ON o.id_solicitud_serv = ss.id_solicitud_serv
         LEFT JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
         LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf";

            $stmt = $this->conn->prepare($query);


            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la base de datos: ' . $e->getMessage());
        }
    }

    private function getReportDataBecas()
    {
        try {
            $query = "SELECT bc.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, pnf.id_pnf, pnf.nombre_pnf, b.genero
         FROM becas bc
         LEFT JOIN solicitud_de_servicio ss ON bc.id_solicitud_serv = ss.id_solicitud_serv
         LEFT JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
         LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la base de datos: ' . $e->getMessage());
        }
    }

    private function getReportDataEx()
    {
        try {
            $query = "SELECT ex.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, pnf.nombre_pnf, pnf.id_pnf, b.genero
         FROM exoneracion ex
         JOIN solicitud_de_servicio ss ON ex.id_solicitud_serv = ss.id_solicitud_serv
         JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
         JOIN pnf ON b.id_pnf = pnf.id_pnf";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la base de datos: ' . $e->getMessage());
        }
    }

    private function getReportDataFames()
    {
        try {
            $query = "SELECT fm.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, b.genero, pnf.id_pnf, pnf.nombre_pnf, p.id_patologia, p.nombre_patologia
         FROM fames fm
         LEFT JOIN detalle_patologia pt ON fm.id_detalle_patologia = pt.id_detalle_patologia
         LEFT JOIN patologia p ON pt.id_patologia = p.id_patologia
         LEFT JOIN solicitud_de_servicio ss ON fm.id_solicitud_serv = ss.id_solicitud_serv
         LEFT JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
         LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la base de datos: ' . $e->getMessage());
        }
    }

    private function getReportDataEmb()
    {
        try {
            $query = "SELECT ge.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, b.genero, pnf.id_pnf, pnf.nombre_pnf, p.id_patologia, p.nombre_patologia
         FROM gestion_emb ge
         LEFT JOIN detalle_patologia pt ON ge.id_detalle_patologia = pt.id_detalle_patologia
         LEFT JOIN patologia p ON pt.id_patologia = p.id_patologia
         LEFT JOIN solicitud_de_servicio ss ON ge.id_solicitud_serv = ss.id_solicitud_serv
         LEFT JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
         LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf";


            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la base de datos: ' . $e->getMessage());
        }
    }

    private function getReportDataD()
    {
        try {
            $query = "SELECT d.*, b.id_beneficiario, b.nombres, b.apellidos, b.cedula, pnf.nombre_pnf, b.genero, b.tipo_cedula
         FROM discapacidad d
         LEFT JOIN solicitud_de_servicio ss ON d.id_solicitud_serv = ss.id_solicitud_serv
         LEFT JOIN beneficiario b ON ss.id_beneficiario = b.id_beneficiario
         LEFT JOIN pnf ON b.id_pnf = pnf.id_pnf";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la base de datos: ' . $e->getMessage());
        }
    }

    private function reporteReferencia()
    {
        try {
            $query = "SELECT 
        r.id_referencia,
        r.id_beneficiario,
        r.id_empleado_origen,
        r.id_servicio_origen,
        r.id_empleado_destino,
        r.id_servicio_destino,
        r.fecha_referencia,
        r.motivo,
        r.estado,
        b.nombres,
        b.apellidos,
        b.cedula,
        b.genero,
        so.nombre_serv AS servicio_origen,
        sd.nombre_serv AS servicio_destino,
        CONCAT(eo.nombre,' ',eo.apellido) AS nombre_empleado_origen,
        CONCAT(ed.nombre,' ',ed.apellido) AS nombre_empleado_destino
        FROM referencias r
        JOIN beneficiario b ON r.id_beneficiario = b.id_beneficiario
        JOIN servicio so ON r.id_servicio_origen = so.id_servicios
        JOIN servicio sd ON r.id_servicio_destino = sd.id_servicios
        JOIN dirpoles_security.empleado eo ON r.id_empleado_origen = eo.id_empleado
        JOIN dirpoles_security.empleado ed ON r.id_empleado_destino = ed.id_empleado";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function chartRefG()
    {
        try {
            $query = "SELECT
                (SELECT COUNT(*) FROM referencias r 
                JOIN beneficiario b ON b.id_beneficiario = r.id_beneficiario 
                WHERE b.genero = 'M') AS totalM,
                (SELECT COUNT(*) FROM referencias r 
                JOIN beneficiario b ON b.id_beneficiario = r.id_beneficiario 
                WHERE b.genero = 'F') AS totalF,
                (SELECT COUNT(*) FROM referencias r WHERE r.estado = 'Aceptada') AS estadoA,
                (SELECT COUNT(*) FROM referencias r WHERE r.estado = 'Pendiente') AS estadoP,
                (SELECT COUNT(*) FROM referencias r WHERE r.estado = 'Rechazada') AS estadoR
                ";

            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function chartRefAO($arg)
    {
        $joins = [
            'origen' => "r.id_servicio_origen",
            'destino' => "r.id_servicio_destino"
        ];
        try {
            $query = "SELECT s.nombre_serv, COUNT(*) AS total
                  FROM referencias r
                  JOIN servicio s ON " . $joins[$arg] . " = s.id_servicios
                  GROUP BY s.nombre_serv";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getDataMob($arg)
    {
        try {
            if ($arg == 'servicio') {

                $query = "SELECT DISTINCT s.*
            FROM servicio s
            JOIN mobiliario m ON s.id_servicios = m.id_servicios
            ORDER BY s.nombre_serv ASC";
            }

            if ($arg == 'tipoMob') {

                $query = "SELECT DISTINCT tm.*
            FROM tipo_mobiliario tm
            JOIN mobiliario m ON tm.id_tipo_mobiliario = m.id_tipo_mobiliario
            ORDER BY tm.nombre ASC";
            }

            if ($arg == 'marca') {
                $query = "SELECT DISTINCT m.*
                FROM mobiliario m
                GROUP BY m.marca
                ORDER BY m.marca ASC";
            }

            if ($arg == 'modelo') {
                $query = "SELECT DISTINCT m.*
                FROM mobiliario m
                GROUP BY m.modelo
                ORDER BY m.modelo ASC";
            }

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getReportDataMob()
    {
        try {
            $query = "SELECT m.*, tm.estatus, tm.nombre, s.id_servicios, s.nombre_serv, s.estatus
            FROM mobiliario m
            JOIN tipo_mobiliario tm ON m.id_tipo_mobiliario = tm.id_tipo_mobiliario
            JOIN servicio s ON m.id_servicios = s.id_servicios";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getDataEq($arg)
    {
        try {
            if ($arg == 'servicio') {

                $query = "SELECT DISTINCT s.*
            FROM servicio s
            JOIN equipos e ON s.id_servicios = e.id_servicios
            ORDER BY s.nombre_serv ASC";
            }

            if ($arg == 'tipoE') {

                $query = "SELECT DISTINCT te.*
            FROM tipo_equipo te
            JOIN equipos e ON te.id_tipo_equipo = e.id_tipo_equipo
            ORDER BY te.nombre ASC";
            }

            if ($arg == 'marca') {
                $query = "SELECT DISTINCT e.*
                FROM equipos e
                GROUP BY e.marca
                ORDER BY e.marca ASC";
            }

            if ($arg == 'modelo') {
                $query = "SELECT DISTINCT e.*
                FROM equipos e
                GROUP BY e.modelo
                ORDER BY e.modelo ASC";
            }

            if ($arg == "serial") {
                $query = "SELECT DISTINCT e.* 
                FROM equipos e 
                GROUP BY e.serial 
                ORDER BY e.serial ASC";
            }

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getReportDataEq()
    {
        try {
            $query = "SELECT e.*, te.estatus, te.nombre, s.id_servicios, s.nombre_serv, s.estatus
            FROM equipos e
            JOIN tipo_equipo te ON e.id_tipo_equipo = te.id_tipo_equipo
            JOIN servicio s ON e.id_servicios = s.id_servicios";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getReportDataTransp($arg)
    {
        try {
            if ($arg == 'getVehiculo') {

                $query = "SELECT DISTINCT v.*
            FROM vehiculos v
            ORDER BY v.modelo ASC";
            }

            if ($arg == 'getProveedores') {

                $query = "SELECT DISTINCT p.*
            FROM proveedores p
            ORDER BY p.nombre ASC";
            }

            if ($arg == 'getRutas') {
                $query = "SELECT DISTINCT r.*
                FROM rutas r
                ORDER BY r.nombre_ruta ASC";
            }

            if ($arg == 'getRepuestos') {
                $query = "SELECT DISTINCT rv.*, p.nombre as nombre_prov
                FROM repuestos_vehiculos rv
                JOIN proveedores p ON rv.id_proveedor = p.id_proveedor
                ORDER BY rv.nombre ASC";
            }

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }

    private function getDataJorn()
    {
        try {
            $query = "SELECT j.* FROM jornadas_medicas j";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            throw new Exception('Error en la consulta: ' . $e->getMessage());
        }
    }
}
