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
                        <a href="<?= BASE_URL ?>consultar_horarios"
                            class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                            <i class="fas fa-clipboard-list fa-sm text-white-50 me-1"></i> Consultar Horarios
                        </a>
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
                                <div class="card-body p-4">
                                    <form action="<?= BASE_URL ?>registrar_horario" method="POST" autocomplete="off" id="formulario-horario">
                                        <div class="row">
                                            <!-- Psicólogo (Empleado) -->
                                            <div class="col-md-12 mb-4">
                                                <label for="psicologo" class="form-label font-weight-bold">Psicólogo Seleccionado</label>
                                                <div class="input-group shadow-sm">
                                                    <span class="input-group-text bg-light"><i class="fa-solid fa-user-md"></i></span>
                                                    <input type="text" class="form-control bg-white" id="psicologo_nombre" placeholder="Seleccione un psicólogo haciendo clic en la lupa -->" readonly style="cursor: default;">
                                                    <input type="hidden" name="id_empleado" id="id_empleado">
                                                    <button class="btn btn-outline-danger" type="button" id="btnEliminarPsicologo" title="Quitar selección">
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                    <button class="btn btn-primary" type="button" id="btnSeleccionarPsicologo" data-bs-toggle="modal" data-bs-target="#modalSeleccionarPsicologo">
                                                        <i class="fas fa-search me-1"></i> Buscar Psicólogo
                                                    </button>
                                                </div>
                                                <div id="id_empleadoError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <hr class="mb-4">

                                        <!-- Sección de Horarios Dinámicos -->
                                        <div class="row mb-4 mt-2">
                                            <div class="col-12 d-flex justify-content-between align-items-center">
                                                <h6 class="font-weight-bold text-dark mb-0">
                                                    <i class="fa-solid fa-calendar-check me-2 text-primary"></i>Configuración de Días y Horas
                                                </h6>
                                                <button type="button" id="btnAgregarFila" class="btn btn-success btn-sm shadow-sm px-3">
                                                    <i class="fa-solid fa-plus me-1"></i> Añadir un Día
                                                </button>
                                            </div>
                                        </div>

                                        <div class="table-responsive px-1">
                                            <table class="table table-hover border align-middle mb-0" id="tablaHorarios">
                                                <thead class="table-light border-bottom">
                                                    <tr>
                                                        <th class="py-3" style="width: 30%;">Día de la Semana</th>
                                                        <th class="py-3" style="width: 30%;">Hora de Inicio</th>
                                                        <th class="py-3" style="width: 30%;">Hora de Finalización</th>
                                                        <th class="py-3" style="width: 10%; text-align: center;">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="contenedorHorarios">
                                                    <!-- Las filas se agregarán dinámicamente aquí -->
                                                    <tr class="fila-vacia">
                                                        <td colspan="4" class="text-center text-muted py-5">
                                                            <i class="fa-solid fa-clock-rotate-left fa-2x mb-3 d-block opacity-25"></i>
                                                            No has añadido ningún día. Haz clic en "Añadir un Día" para comenzar.
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="row mt-3 mb-4">
                                            <div class="col-12 text-muted small bg-light p-2 rounded border-start border-primary border-4" style="margin-left: 12px; width: calc(100% - 24px);">
                                                <i class="fa-solid fa-circle-info me-1 text-primary"></i> 
                                                Puedes registrar hasta 6 días (Lunes a Sábado). <strong>No se permiten días duplicados</strong> ni días que el psicólogo ya tenga registrados.
                                            </div>
                                        </div>

                                        <div class="row mt-5">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-3 border-top pt-4">
                                                    <button type="reset" class="btn btn-light border px-4" id="btnLimpiarHorario">Limpiar Todo</button>
                                                    <button type="submit" id="btnRegistrarHorario" class="btn btn-primary shadow-sm px-5 py-2 font-weight-bold" disabled>
                                                        <i class="fa-solid fa-save me-1"></i> Guardar Todos los Horarios
                                                    </button>
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
                <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
                <!-- End of Footer -->
            </div>
            <!-- End of Content Wrapper -->
        </div>
        <!-- End of Page Wrapper -->

        <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
        <script src="<?= BASE_URL ?>dist/js/modulos/horario/crear_horario.js"></script>

</body>

</html>