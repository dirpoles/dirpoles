<?php 
$titulo = "Crear Horario";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Horario</h1>
                    </div>

                    <!-- Content Row - Cards -->
                    <div class="row">
                        <!-- Total de Psicólogos con Horario -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-info shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Psicólogos Activos</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($psicologos_con_horario) ?>
                                            </div>
                                            <div class="text-xs text-white-50 mt-1">
                                                Con horario asignado
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-user-md fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Total Horas Semanales -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-primary shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Horas Semanales</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($total_horas_semanales) ?>
                                            </div>
                                            <div class="text-xs text-white-50 mt-1">
                                                Disponibles para citas
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-clock fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Día con Mayor Cobertura -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-warning shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Día Más Activo</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($dia_mas_activo) ?>
                                            </div>
                                            <div class="text-xs text-white-50 mt-1">
                                                Mayor disponibilidad
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-calendar-day fa-2x text-white"></i>
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

                    <!-- Formulario de Registro del Horario por Empleado -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Registrar un nuevo horario</h6>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>registrar_horario" method="POST" autocomplete="off" id="formulario-horario">
                                        <div class="row">
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

                                            <!-- Día de la semana -->
                                            <div class="col-md-6 mb-3">
                                                <label for="dia_semana" class="form-label">Día de la semana</label>
                                                <select name="dia_semana" id="dia_semana" class="form-control">
                                                    <option value="" disabled selected>Seleccione un día</option>
                                                    <option value="Lunes">Lunes</option>
                                                    <option value="Martes">Martes</option>
                                                    <option value="Miércoles">Miércoles</option>
                                                    <option value="Jueves">Jueves</option>
                                                    <option value="Viernes">Viernes</option>
                                                    <option value="Sábado">Sábado</option>
                                                </select>
                                                <div id="dia_semanaError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Hora inicio -->
                                            <div class="col-md-6 mb-3">
                                                <label for="hora_inicio" class="form-label">Hora de inicio</label>
                                                <input type="time" class="form-control" name="hora_inicio" id="hora_inicio">
                                                <div id="hora_inicioError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Hora fin -->
                                            <div class="col-md-6 mb-3">
                                                <label for="hora_fin" class="form-label">Hora de fin</label>
                                                <input type="time" class="form-control" name="hora_fin" id="hora_fin">
                                                <div id="hora_finError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="reset" class="btn btn-secondary" id="btnLimpiarHorario">Limpiar Formulario</button>
                                                    <button type="submit" id="btnRegistrarHorario" class="btn btn-primary">Registrar Horario</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <?php include BASE_PATH . '/app/Views/horario/modal_horario.php'; ?>
            <!-- Footer -->
            
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->
        <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
    </div>
    <!-- End of Page Wrapper -->

   <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
   <script src="<?= BASE_URL ?>dist/js/modulos/horario/crear_horario.js"></script>

</body>
</html>