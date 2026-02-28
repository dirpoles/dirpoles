<?php
$titulo = "Jornadas Médicas";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Jornadas Médicas</h1>
                    </div>

                    <!-- Formulario de Registro -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card bg-primary shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">Total Jornadas</div>
                                                    <div class="h5 mb-0 font-weight-bold text-white"><?= $jornadas_totales ?? 0; ?></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-hospital-user fa-2x text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card bg-warning shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">En Progreso</div>
                                                    <div class="h5 mb-0 font-weight-bold text-white"><?= $jornadas_activas ?? 0; ?></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-spinner fa-spin fa-2x text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card bg-success shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">Finalizadas</div>
                                                    <div class="h5 mb-0 font-weight-bold text-white"><?= $jornadas_finalizadas ?? 0; ?></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-check-double fa-2x text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card bg-info shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">Este Mes</div>
                                                    <div class="h5 mb-0 font-weight-bold text-white"><?= $jornadas_mes ?? 0; ?></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-calendar-check fa-2x text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">Registrar Nueva Jornada Médica</h6>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>registrar_jornada" method="POST" autocomplete="off" id="formulario-jornada" novalidate>

                                        <h6 class="text-secondary mb-3 pl-2" style="border-left: 4px solid #4e73df;">Información General</h6>
                                        <div class="row mb-4">
                                            <div class="col-md-7">
                                                <label for="nombre_jornada" class="form-label font-weight-bold">Nombre de la Jornada <span class="text-danger">*</span></label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="fas fa-heading text-primary"></i></span>
                                                    <input type="text" class="form-control" name="nombre_jornada" id="nombre_jornada" placeholder="Ej: Operativo Médico-Social Sector Sur">
                                                </div>
                                                <div id="nombre_jornadaError" class="form-text text-danger"></div>
                                            </div>
                                            <div class="col-md-5">
                                                <label for="tipo_jornada" class="form-label font-weight-bold">Tipo de Jornada</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="fas fa-list-ul text-primary"></i></span>
                                                    <input type="text" class="form-control" list="tipoJornadas" name="tipo_jornada" id="tipo_jornada" placeholder="Seleccione o escriba...">
                                                    <datalist id="tipoJornadas">
                                                        <option value="Médica Integral">
                                                        <option value="Vacunación">
                                                        <option value="Odontológica">
                                                        <option value="Pediátrica">
                                                        <option value="Asistencia Social">
                                                    </datalist>
                                                </div>
                                                <div id="tipo_jornadaError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <hr>

                                        <h6 class="text-secondary mb-3 pl-2" style="border-left: 4px solid #4e73df;">Logística y Capacidad</h6>
                                        <div class="row mb-4">
                                            <div class="col-md-8">
                                                <label for="ubicacion" class="form-label font-weight-bold">Ubicación / Dirección <span class="text-danger">*</span></label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="fas fa-map-marker-alt text-danger"></i></span>
                                                    <input type="text" class="form-control" name="ubicacion" id="ubicacion" placeholder="Indique el lugar exacto del evento">
                                                </div>
                                                <div id="ubicacionError" class="form-text text-danger"></div>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="aforo_maximo" class="form-label font-weight-bold">Aforo Máximo (Personas)</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light"><i class="fas fa-users text-primary"></i></span>
                                                    <input type="number" class="form-control" name="aforo_maximo" id="aforo_maximo" min="1" placeholder="Ej: 100">
                                                </div>
                                                <div id="aforo_maximoError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <hr>

                                        <h6 class="text-secondary mb-3 pl-2" style="border-left: 4px solid #4e73df;">Cronograma del Evento</h6>
                                        <div class="row">
                                            <div class="col-md-6 border-end">
                                                <div class="mb-3">
                                                    <label class="form-label font-weight-bold">Fecha y Hora de Inicio <span class="text-danger">*</span></label>
                                                    <div class="input-group mb-2">
                                                        <span class="input-group-text bg-light"><i class="fas fa-calendar-alt"></i></span>
                                                        <input type="date" class="form-control" id="fecha_inicio_date">
                                                        <input type="time" class="form-control" id="fecha_inicio_time">
                                                    </div>
                                                    <input type="hidden" name="fecha_inicio" id="fecha_inicio">
                                                    <div id="fecha_inicioError" class="form-text text-danger"></div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label font-weight-bold">Fecha y Hora de Fin <span class="text-danger">*</span></label>
                                                    <div class="input-group mb-2">
                                                        <span class="input-group-text bg-light"><i class="fas fa-calendar-check"></i></span>
                                                        <input type="date" class="form-control" id="fecha_fin_date">
                                                        <input type="time" class="form-control" id="fecha_fin_time">
                                                    </div>
                                                    <input type="hidden" name="fecha_fin" id="fecha_fin">
                                                    <div id="fecha_finError" class="form-text text-danger"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr>

                                        <h6 class="text-secondary mb-3 pl-2" style="border-left: 4px solid #4e73df;">Descripción del Operativo</h6>
                                        <div class="row mb-4">
                                            <div class="col-md-12">
                                                <textarea class="form-control" name="descripcion" id="descripcion" rows="4"
                                                    placeholder="Describa los servicios médicos que se ofrecerán, requerimientos especiales o información relevante para el personal..."></textarea>
                                                <div id="descripcionError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row mt-3">
                                            <div class="col-12 text-right">
                                                <hr>
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="reset" class="btn btn-secondary shadow-sm mr-2" id="limpiar_form">
                                                        <i class="fas fa-eraser me-1"></i> Limpiar Formulario
                                                    </button>
                                                    <button type="submit" class="btn btn-primary shadow-sm px-4">
                                                        <i class="fas fa-save me-1"></i> Registrar Jornada
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <?php require_once BASE_PATH . '/app/Views/referencias/modalBeneficiario.php'; ?>
                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <!-- Footer -->
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>

    <?php include BASE_PATH . '/app/Views/template/script.php'; ?>

    <script src="<?= BASE_URL ?>/dist/js/modulos/jornadas/crear_jornada.js"></script>

</body>

</html>