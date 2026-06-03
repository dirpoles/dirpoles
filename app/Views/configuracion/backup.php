<?php 
$titulo = "Respaldo de Base de Datos";
include BASE_PATH . '/app/Views/template/head.php';
?>

<body id="page-top">
    <!-- Page Wrapper -->
    <div id="wrapper">
        <!-- Sidebar -->
        <?php include BASE_PATH . '/app/Views/template/sidebar.php'; ?>
        <!-- End of Sidebar -->
        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            <!-- Main Content -->
            <div id="content">
                <!-- Topbar -->
                <?php include BASE_PATH . '/app/Views/template/header.php'; ?>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">
                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800"><i class="fas fa-database text-primary me-2"></i>Respaldo y Copias de Seguridad</h1>
                        <i id="btn-ayuda" class="fa fa-question-circle text-primary fa-lg" data-toggle="tooltip" title="Ayuda sobre el módulo de respaldos" style="cursor: pointer;"></i>
                    </div>

                    <!-- Intro Card -->
                    <div class="card shadow mb-4 border-left-info">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="mr-3">
                                    <div class="icon-circle bg-info text-white" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                                        <i class="fas fa-info-circle fa-lg"></i>
                                    </div>
                                </div>
                                <div>
                                    <h5 class="font-weight-bold text-info mb-1">Información Importante</h5>
                                    <p class="text-gray-700 mb-0">Desde este módulo puede generar y descargar copias de seguridad completas de las bases de datos del sistema. Se recomienda realizar copias de seguridad periódicas y almacenarlas en un lugar seguro fuera del servidor.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Content Row -->
                    <div class="row">
                        <!-- BD Negocio Card -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-primary hover-card">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-briefcase me-2"></i>Base de Datos de Negocio
                                    </h6>
                                    <span class="badge bg-primary">dirpoles_business</span>
                                </div>
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <p class="text-muted">Contiene toda la información operativa del sistema:</p>
                                        <ul class="text-gray-700 pl-4 mb-4">
                                            <li>Registro de beneficiarios y expedientes.</li>
                                            <li>Historial de citas médicas, psicológicas y sociales.</li>
                                            <li>Inventarios de insumos médicos y mobiliario.</li>
                                            <li>Planificaciones de transporte y jornadas.</li>
                                        </ul>
                                    </div>
                                    <div class="text-end">
                                        <a href="<?= BASE_URL ?>respaldo/descargar?tipo=negocio" class="btn btn-primary btn-block py-2">
                                            <i class="fas fa-download me-2"></i>Descargar Respaldo (.sql)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- BD Seguridad Card -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-success hover-card">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-success">
                                        <i class="fas fa-shield-alt me-2"></i>Base de Datos de Seguridad
                                    </h6>
                                    <span class="badge bg-success">dirpoles_security</span>
                                </div>
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <p class="text-muted">Contiene la información de control de acceso y auditoría:</p>
                                        <ul class="text-gray-700 pl-4 mb-4">
                                            <li>Cuentas de usuario y credenciales de acceso.</li>
                                            <li>Configuración de roles y permisos del sistema.</li>
                                            <li>Tipos de empleados y vinculaciones de seguridad.</li>
                                            <li>Bitácora de auditoría completa de los movimientos del sistema.</li>
                                        </ul>
                                    </div>
                                    <div class="text-end">
                                        <a href="<?= BASE_URL ?>respaldo/descargar?tipo=seguridad" class="btn btn-success btn-block py-2">
                                            <i class="fas fa-download me-2"></i>Descargar Respaldo (.sql)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <!-- Footer -->
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
            <!-- End of Footer -->
        </div>
        <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

    <?php include BASE_PATH . '/app/Views/template/script.php'; ?>

    <style>
        .hover-card {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
        }
    </style>

    <script>
        $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
            
            // Si el usuario hace clic en ayuda, mostrar un SweetAlert explicativo
            $('#btn-ayuda').on('click', function() {
                Swal.fire({
                    title: 'Módulo de Respaldos',
                    html: 'Este módulo permite descargar la estructura y los datos actuales del sistema.<br><br><b>Base de Datos de Negocio:</b> Almacena la lógica comercial e información diaria.<br><b>Base de Datos de Seguridad:</b> Almacena accesos, roles y registros de bitácora.',
                    icon: 'info',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#4e73df'
                });
            });
        });
    </script>
</body>
</html>
