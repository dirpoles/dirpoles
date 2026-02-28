<?php 
$titulo = "Crear Citas";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Citas</h1>
                    </div>

                    <!-- Content Row - Cards -->
                    <div class="row">
                        <!-- Total de Citas -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-primary shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Total de Citas</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($citas_totales) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-calendar fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Citas Pendientes -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-warning shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Citas Pendientes</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($citas_pendientes) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-clock fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Citas Rechazadas -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-danger shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Citas rechazadas</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($citas_rechazadas) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-times-circle fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Citas Atendidas -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-success shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Citas atendidas
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($citas_atendidas) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-user-check fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Formulario de Registro de Cita -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Registrar Nueva Cita</h6>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>cita_registrar" method="POST" autocomplete="off" id="formulario-cita">
                                        <div class="row">
                                            <!-- Beneficiario -->
                                            <div class="col-md-6 mb-3">
                                                <label for="beneficiario" class="form-label">Beneficiario</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control" id="beneficiario_nombre" placeholder="Seleccione un beneficiario" readonly>
                                                    <input type="hidden" name="id_beneficiario" id="id_beneficiario">
                                                    <button class="btn btn-outline-danger" type="button" id="btnEliminarBeneficiario">
                                                        <i class="fa-solid fa-x"></i>
                                                    </button>
                                                    <button class="btn btn-outline-secondary" type="button" id="btnSeleccionarBeneficiario" data-bs-toggle="modal" data-bs-target="#modalSeleccionarBeneficiario">
                                                        <i class="fas fa-search"></i>
                                                    </button>
                                                </div>
                                                <div id="id_beneficiarioError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Psicólogo (Empleado) -->
                                            <div class="col-md-6 mb-3">
                                                <label for="psicologo" class="form-label">Psicólogo</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control" id="psicologo_nombre" placeholder="Seleccione un psicólogo" readonly>
                                                    <input type="hidden" name="id_empleado" id="id_empleado">
                                                    <button class="btn btn-outline-danger" type="button" id="btnEliminarPsicologo">
                                                        <i class="fa-solid fa-x"></i>
                                                    </button>
                                                    <button class="btn btn-outline-secondary" type="button" id="btnSeleccionarPsicologo" data-bs-toggle="modal" data-bs-target="#modalSeleccionarPsicologo">
                                                        <i class="fas fa-search"></i>
                                                    </button>
                                                </div>
                                                <div id="id_empleadoError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Fecha -->
                                            <div class="col-md-6 mb-3">
                                                <label for="fecha" class="form-label">Fecha</label>
                                                <input type="date" name="fecha" id="fecha" class="form-control">
                                                <div id="fechaError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Hora -->
                                            <div class="col-md-6 mb-3">
                                                <label for="hora" class="form-label">Hora</label>
                                                <input type="time" name="hora" id="hora"  class="form-control">
                                                <div id="horaError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="reset" class="btn btn-secondary" id="btnLimpiarCita">
                                                        <i class="fa-solid fa-eraser"></i> Limpiar
                                                    </button>
                                                    <button type="submit" id="btnRegistrarCita" class="btn btn-primary">
                                                        <i class="fa-solid fa-calendar-check"></i> Registrar Cita
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección para mostrar horarios del psicólogo seleccionado -->
                    <div class="row mt-4">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary" id="titulo-horarios">Horario del Psicólogo</h6>
                                </div>
                                <div class="card-body">
                                    <div id="tabla-horarios-container">
                                        <!-- La tabla de horarios se cargará dinámicamente aquí -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <?php include BASE_PATH . '/app/Views/citas/modales.php'; ?>
            <!-- Footer -->
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

   <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
   <script src="<?= BASE_URL ?>dist/js/modulos/citas/crear_cita.js"></script>

</body>
</html>