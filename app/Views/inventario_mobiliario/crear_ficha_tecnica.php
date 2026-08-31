<?php
$titulo = "Crear Ficha Técnica";
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
                    <div class="row">
                        <!-- Total de Fichas Técnicas -->
                        <div class="col-xl-4 col-md-6 mb-4">
                            <div class="card text-bg-primary shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Fichas Técnicas Activas</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($totalFichas ?? 0) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-file-alt fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Botón volver -->
                        <div class="col-xl-8 col-md-6 mb-4 d-flex align-items-end justify-content-end">
                            <a href="consultar_inventario_mob" class="btn btn-outline-secondary">
                                <i class="fas fa-arrow-left me-1"></i> Volver al Inventario
                            </a>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-8 mx-auto">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-file-alt me-2"></i> Registrar Nueva Ficha Técnica
                                    </h6>
                                </div>
                                <div class="card-body">
                                    <form action="ficha_registrar" method="POST" id="formCrearFichaTecnica">

                                        <!-- Nombre de la Ficha -->
                                        <div class="row">
                                            <div class="col-md-12 mb-3">
                                                <label for="nombre_ficha" class="form-label">
                                                    Nombre de la Ficha <span class="text-danger">*</span>
                                                </label>
                                                <input type="text" class="form-control" id="nombre_ficha" name="nombre_ficha"
                                                       placeholder="Ej: Ficha de Psicología General" maxlength="100" required>
                                                <div id="nombre_fichaError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <!-- Servicio y Responsable -->
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="id_servicio" class="form-label">
                                                    Servicio <span class="text-danger">*</span>
                                                </label>
                                                <select class="form-control select2" id="id_servicio" name="id_servicio" required>
                                                    <option value="">Seleccione un servicio...</option>
                                                    <?php foreach ($servicios as $servicio): ?>
                                                        <option value="<?= $servicio['id_servicios'] ?>"><?= htmlspecialchars($servicio['nombre_serv']) ?></option>
                                                    <?php endforeach; ?>
                                                </select>
                                                <div id="id_servicioError" class="form-text text-danger"></div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="id_empleado_responsable" class="form-label">
                                                    Responsable
                                                </label>
                                                <select class="form-control select2" id="id_empleado_responsable" name="id_empleado_responsable">
                                                    <option value="">Ninguno</option>
                                                    <?php foreach ($empleados as $empleado): ?>
                                                        <option value="<?= $empleado['id_empleado'] ?>"><?= htmlspecialchars($empleado['nombre_completo']) ?></option>
                                                    <?php endforeach; ?>
                                                </select>
                                                <div id="id_empleado_responsableError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <!-- Fecha de Creación -->
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="fecha_creacion" class="form-label">
                                                    Fecha de Creación <span class="text-danger">*</span>
                                                </label>
                                                <input type="date" class="form-control" id="fecha_creacion" name="fecha_creacion" required>
                                                <div id="fecha_creacionError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <!-- Descripción -->
                                        <div class="row">
                                            <div class="col-md-12 mb-3">
                                                <label for="descripcion" class="form-label">
                                                    Descripción
                                                </label>
                                                <textarea class="form-control" id="descripcion" name="descripcion" rows="4"
                                                          placeholder="Descripción de la ficha técnica..."></textarea>
                                                <div id="descripcionError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <!-- Botones de acción -->
                                        <div class="row">
                                            <div class="col-md-6">
                                                <button type="reset" class="btn btn-secondary" id="btnLimpiarFicha">
                                                    <i class="fa-solid fa-eraser"></i> Limpiar
                                                </button>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <a href="consultar_inventario_mob" class="btn btn-outline-danger">
                                                        <i class="fa-solid fa-times"></i> Cancelar
                                                    </a>
                                                    <button type="submit" class="btn btn-primary" id="btnRegistrarFicha">
                                                        <i class="fa-solid fa-check"></i> Registrar Ficha
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
                <!-- end container-fluid -->

            </div>
            <!-- end content -->
            <!-- Footer -->
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
            <!-- End of Footer -->
        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
    <script src="<?= BASE_URL ?>dist/js/modulos/inventario_mob/crear_ficha_tecnica.js?v=1"></script>

</body>

</html>
