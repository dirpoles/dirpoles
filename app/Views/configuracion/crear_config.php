<?php 
$titulo = "Configuración";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Configuraciones</h1>
                    </div>

                    <!-- Fila 1: Patologia y PNF -->
                    <div class="row">
                        <!-- Columna 1: Registro de Patología -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-danger">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-danger">
                                        <i class="fas fa-heartbeat me-2"></i>Registro de Patología
                                    </h6>
                                    <span class="badge bg-danger">Salud</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>registrar_patologia" method="POST" id="form-patologia" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <div class="mb-3">
                                            <label for="nombre_patologia" class="form-label">Nombre de la Patología <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="nombre_patologia" name="nombre_patologia" required placeholder="Ej: Gripe, Ansiedad...">
                                            <div class="invalid-feedback" id="nombre_patologiaError"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="tipo_patologia" class="form-label">Tipo de Patología <span class="text-danger">*</span></label>
                                            <select class="form-select" id="tipo_patologia" name="tipo_patologia" required>
                                                <option value="" selected disabled>Seleccione...</option>
                                                <option value="Medica">Médica</option>
                                                <option value="Psicológica">Psicológica</option>
                                                <option value="General">General</option>
                                            </select>
                                            <div class="invalid-feedback" id="tipo_patologiaError"></div>
                                        </div>
                                        <div class="text-end mt-auto pt-3">
                                            <button type="submit" id="btn-registrar-patologia" class="btn btn-danger"><i class="fas fa-save me-1"></i> Registrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Columna 2: Registro de PNF -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-primary">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-graduation-cap me-2"></i>Registro de PNF
                                    </h6>
                                    <span class="badge bg-primary">Académico</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>registrar_pnf" method="POST" id="form-pnf" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <div class="mb-3">
                                            <label for="nombre_pnf" class="form-label">Nombre del PNF <span class="text-danger">*</span></label>
                                            <div class="input-group">
                                                <span class="input-group-text">PNF</span>
                                                <input type="text" class="form-control" id="nombre_pnf" name="nombre_pnf" required placeholder="Ej: Informática, Administración...">
                                                <div class="invalid-feedback" id="nombre_pnfError"></div>
                                            </div>
                                        </div>
                                        <div class="text-end mt-auto pt-3">
                                            <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> Registrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fila 2: Servicio y Tipo de Empleado -->
                    <div class="row">
                        <!-- Columna 1: Registro de Servicio -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-info">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-info">
                                        <i class="fas fa-concierge-bell me-2"></i>Registro de Servicio
                                    </h6>
                                    <span class="badge bg-info">Institucional</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>registrar_servicio" method="POST" id="form-servicio" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <div class="mb-3">
                                            <label for="nombre_serv" class="form-label">Nombre del Servicio <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="nombre_serv" name="nombre_serv" required placeholder="Ej: Mantenimiento, Docencia...">
                                            <div class="invalid-feedback" id="nombre_servError"></div>
                                        </div>
                                        <div class="text-end mt-auto pt-3">
                                            <button type="submit" class="btn btn-info"><i class="fas fa-save me-1"></i> Registrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Columna 2: Registro de Tipo de Empleado -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-warning">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-warning">
                                        <i class="fas fa-user-tie me-2"></i>Registro de Tipo de Empleado
                                    </h6>
                                    <span class="badge bg-warning">Personal</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>registrar_tipo_empleado" method="POST" id="form-tipo-empleado" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <div class="mb-3">
                                            <label for="tipo" class="form-label">Tipo de Empleado <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="tipo" name="tipo" required placeholder="Ej: Docente, Obrero...">
                                            <div class="invalid-feedback" id="tipoError"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="id_servicios" class="form-label">Servicio Asociado <span class="text-danger">*</span></label>
                                            <select class="form-select select2" id="id_servicios" name="id_servicios" required>
                                                <option value="" selected disabled>Seleccione un servicio...</option>
                                                <?php if(isset($servicios) && !empty($servicios)): ?>
                                                    <?php foreach ($servicios as $servicio): ?>
                                                        <option value="<?= $servicio['id_servicios'] ?>"><?= $servicio['nombre_serv'] ?></option>
                                                    <?php endforeach; ?>
                                                <?php endif; ?>
                                            </select>
                                            <div class="invalid-feedback" id="id_serviciosError"></div>
                                        </div>
                                        <div class="text-end mt-auto pt-3">
                                            <button type="submit" class="btn btn-warning"><i class="fas fa-save me-1"></i> Registrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fila 3: Tipo Mobiliario y Tipo Equipo -->
                    <div class="row">
                        <!-- Columna 1: Registro de Tipo Mobiliario -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-secondary">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-secondary">
                                        <i class="fas fa-chair me-2"></i>Registro de Tipo de Mobiliario
                                    </h6>
                                    <span class="badge bg-secondary">Inventario</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>registrar_tipo_mobiliario" method="POST" id="form-tipo-mobiliario" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <div class="mb-3">
                                            <label for="nombre_mobiliario" class="form-label">Nombre del Mobiliario <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="nombre_mobiliario" name="nombre" required placeholder="Ej: Silla giratoria, Escritorio...">
                                            <div class="invalid-feedback" id="nombre_mobiliarioError"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="descripcion_mobiliario" class="form-label">Descripción</label>
                                            <textarea class="form-control" id="descripcion_mobiliario" name="descripcion" placeholder="Descripción..."></textarea>
                                            <div class="invalid-feedback" id="descripcion_mobiliarioError"></div>
                                        </div>
                                        <div class="text-end mt-auto pt-3">
                                            <button type="submit" class="btn btn-secondary"><i class="fas fa-save me-1"></i> Registrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Columna 2: Registro de Tipo Equipo -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-dark">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-dark">
                                        <i class="fas fa-desktop me-2"></i>Registro de Tipo de Equipo
                                    </h6>
                                    <span class="badge bg-dark">Tecnología</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>registrar_tipo_equipo" method="POST" id="form-tipo-equipo" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <div class="mb-3">
                                            <label for="nombre_equipo" class="form-label">Nombre del Equipo <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="nombre_equipo" name="nombre" required placeholder="Ej: Laptop, Video Beam...">
                                            <div class="invalid-feedback" id="nombre_equipoError"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="descripcion_equipo" class="form-label">Descripción</label>
                                            <textarea class="form-control" id="descripcion_equipo" name="descripcion" placeholder="Descripción..."></textarea>
                                            <div class="invalid-feedback" id="descripcion_equipoError"></div>
                                        </div>
                                        <div class="text-end mt-auto pt-3">
                                            <button type="submit" class="btn btn-dark"><i class="fas fa-save me-1"></i> Registrar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                         <!-- Columna 1: Registro de Presentación para Insumos -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-primary">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-box me-2"></i>Registro de Presentación para Insumos
                                    </h6>
                                    <span class="badge bg-primary">Insumos</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>registrar_presentacion_insumo" method="POST" id="form-presentacion-insumo" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <div class="mb-3">
                                            <label for="nombre_presentacion" class="form-label">Nombre de Presentación para Insumos <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="nombre_presentacion" name="nombre_presentacion" required placeholder="Ej: Capsulas, Pastillas...">
                                            <div class="invalid-feedback" id="nombre_presentacionError"></div>
                                        </div>
                                        <div class="text-end mt-auto pt-3">
                                            <button type="submit" class="btn btn-primary"><i class="fas fa-save me-1"></i> Registrar</button>
                                        </div>
                                    </form>
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

   <?php include BASE_PATH . '/app/Views/template/script.php'; ?>

   <script src="<?= BASE_URL ?>dist/js/modulos/configuracion/patologia/crear_patologia.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/configuracion/pnf/crear_pnf.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/configuracion/servicio/crear_servicio.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/configuracion/tipo_empleado/crear_tipo_empleado.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/configuracion/tipo_mobiliario/crear_tipo_mobiliario.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/configuracion/tipo_equipo/crear_tipo_equipo.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/configuracion/presentacion_insumo/crear_presentacion.js"></script>

                                                                
</body>
</html>