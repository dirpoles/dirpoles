<?php

namespace App\Models;
use App\Models\BusinessModel;
use App\Models\SecurityModel;
use Exception;
use PDO;

class ReportesIAModel extends BusinessModel
{
    private $atributos = [];

    public function __get($atributo)
    {
        return $this->atributos[$atributo] ?? null;
    }
    public function __set($atributo, $valor)
    {
        $this->atributos[$atributo] = $valor;
    }

    public function manejarAccion($action)
    {
        switch ($action) {
            case 'reporteGeneral':
                return $this->getReportDataGeneral();
            default:
                throw new Exception('Acción no válida');
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
        } catch (\Throwable $e) {
            throw new Exception('Error en la consulta de ReportesIAModel: ' . $e->getMessage());
        }
    }

}