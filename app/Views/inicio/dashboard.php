<?php 
$titulo = "Inicio";
include 'app/Views/template/head.php';
?>

<body id="page-top">
    <!-- Page Wrapper -->
    <div id="wrapper">
        <!-- Sidebar -->
         <?php include 'app/Views/template/sidebar.php'; ?>
        <!-- End of Sidebar -->
        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            <!-- Main Content -->
            <div id="content">
                <!-- Topbar -->
                <?php include 'app/Views/template/header.php'; ?>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">
                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Bienvenido, <?= $_SESSION['nombre'] . ' ' . $_SESSION['apellido'] ?></h1>
                        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                class="fas fa-file fa-sm text-white-50"></i> Ver Reportes</a>
                    </div>

                    <!-- Content Row - Statistics Cards -->
                    <div class="row">
                        <?php
                        $tipoEmpleado = $_SESSION['tipo_empleado'] ?? '';
                        
                        // Cargar componentes de estadísticas según el tipo de empleado
                        switch($tipoEmpleado) {
                            case 'Psicologo':
                                include 'components/stats_psicologo.php';
                                break;
                            case 'Medico':
                                include 'components/stats_medico.php';
                                break;
                            case 'Orientador':
                                include 'components/stats_orientador.php';
                                break;
                            case 'Trabajador Social':
                                include 'components/stats_trabajador_social.php';
                                break;
                            case 'Discapacidad':
                                include 'components/stats_discapacidad.php';
                                break;
                            case 'Administrador':
                            case 'Superusuario':
                                include 'components/stats_admin.php';
                                break;
                            default:
                                // Por defecto mostrar card de beneficiarios si no hay rol específico
                                include 'components/card_beneficiarios.php';
                                break;
                        }
                        ?>
                    </div>

                <!-- Content Row - Main Dynamic Content --> 
                    <div class="row">
                        <!-- Sección del Calendario para roles que lo requieren -->
                        <?php include 'components/calendario.php'; ?>
                    </div>

                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <?php include 'app/Views/template/footer.php'; ?>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->


   <?php include 'app/Views/template/script.php'; ?>
   <?php include 'app/Views/template/scripts-dashboard.php'; ?>

   <!-- Calendario personal (debe ir al final) -->
    <script src="<?= BASE_URL ?>dist/js/modulos/calendario/calendario_personal.js"></script>

<style>
    /* Ajustar altura mínima de las celdas */
.fc-daygrid-day {
  min-height: 100px;
}

/* Eventos con estilo más compacto */
.fc-event {
  font-size: 0.85rem;
  padding: 2px 4px;
  border-radius: 0.25rem;
}


/* Hover sobre eventos */
.fc-event:hover {
  opacity: 0.85;
  cursor: pointer;
}

/* Toolbar más compacto */
.fc-toolbar-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.fc-prev-button .fa,
.fc-next-button .fa {
  font-size: 1rem;
  margin-right: 4px;
}
</style>


</body>
</html>