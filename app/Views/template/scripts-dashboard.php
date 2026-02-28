<?php

$tipo_empleado = $_SESSION['tipo_empleado'];

switch($tipo_empleado){
    case 'Psicologo':
        echo '<script src="dist/js/modulos/dashboard/stats_psicologia.js"></script>';
        break;
    case 'Medico':
        echo '<script src="dist/js/modulos/dashboard/stats_medicina.js"></script>';
        break;
    case 'Orientador':
        echo '<script src="dist/js/modulos/dashboard/stats_orientacion.js"></script>';
        break;
    case 'Trabajador Social':
       echo '<script src="dist/js/modulos/dashboard/stats_ts.js"></script>';
        break;
    case 'Discapacidad':
       echo '<script src="dist/js/modulos/dashboard/stats_discapacidad.js"></script>';
        break;
    case 'Administrador':
        echo '<script src="dist/js/modulos/dashboard/stats_admin.js"></script>';
        break;
    case 'Superusuario':
        echo '<script src="dist/js/modulos/dashboard/stats_admin.js"></script>';
        break;
    default:
        break;
}