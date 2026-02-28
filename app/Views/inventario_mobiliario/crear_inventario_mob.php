<?php
$titulo = "Inventario Mobiliario";
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
                        <!-- Total de Insumos -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-primary shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Total de Mobiliarios</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($total_mobiliarios) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-boxes fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Insumos Activos -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-success shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Total de Equipos</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($total_equipos) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-computer fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Insumos por Vencer (Próximos 30 días) -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-warning shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Empleados con Ficha Técnica</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($fichas_tecnicas) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-folder fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Insumos Escasos (Stock bajo) -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-danger shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Inventario agregado este mes</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($inventario_mes) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-calendar-plus fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Registrar nuevos ítems en inventario</h6>
                                </div>
                                <div class="card-body">
                                    <!-- Tabs de navegación -->
                                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                                        <li class="nav-item">
                                            <a class="nav-link active" id="mobiliario-tab" data-bs-toggle="tab" data-bs-target="#mobiliario" href="#mobiliario" role="tab">Mobiliario</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="equipo-tab" data-bs-toggle="tab" data-bs-target="#equipo" href="#equipo" role="tab">Equipo</a>
                                        </li>
                                    </ul>

                                    <div class="tab-content" id="myTabContent">
                                        <!-- ==================== FORMULARIO MOBILIARIO ==================== -->
                                        <div class="tab-pane fade show active" id="mobiliario" role="tabpanel">
                                            <form action="mobiliario_registrar" method="POST" class="mt-3" id="form-mobiliario">
                                                <div id="items-container-mobiliario">
                                                    <!-- Fila inicial (debe conservar los ids con _0) -->
                                                    <div class="item-row-mobiliario mb-3 border-bottom pb-3">
                                                        <div class="row">
                                                            <div class="col-md-6 mb-3">
                                                                <label for="id_tipo_mobiliario_0" class="form-label">Tipo de Mobiliario <span class="text-danger">*</span></label>
                                                                <select class="form-control select2 tipo-mobiliario" name="id_tipo_mobiliario[]" id="id_tipo_mobiliario_0">
                                                                    <option value="">Seleccione...</option>
                                                                    <?php foreach ($tiposMobiliario as $tipo): ?>
                                                                        <option value="<?= $tipo['id_tipo_mobiliario'] ?>"><?= htmlspecialchars($tipo['nombre']) ?></option>
                                                                    <?php endforeach; ?>
                                                                </select>
                                                                <div id="id_tipo_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label for="id_servicios_mobiliario_0" class="form-label">Ubicación <span class="text-danger">*</span></label>
                                                                <select class="form-control select2" name="id_servicios[]" id="id_servicios_mobiliario_0">
                                                                    <option value="">Seleccione...</option>
                                                                    <?php foreach ($servicios as $servicio): ?>
                                                                        <option value="<?= $servicio['id_servicios'] ?>"><?= htmlspecialchars($servicio['nombre_serv']) ?></option>
                                                                    <?php endforeach; ?>
                                                                </select>
                                                                <div id="id_servicios_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                        </div>

                                                        <div class="row">
                                                            <div class="col-md-2 mb-3">
                                                                <label for="marca_mobiliario_0" class="form-label">Marca <span class="text-danger">*</label>
                                                                <input type="text" class="form-control" name="marca[]" id="marca_mobiliario_0">
                                                                <div id="marca_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="modelo_mobiliario_0" class="form-label">Modelo <span class="text-danger">*</label>
                                                                <input type="text" class="form-control" name="modelo[]" id="modelo_mobiliario_0">
                                                                <div id="modelo_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="color_mobiliario_0" class="form-label">Color <span class="text-danger">*</label>
                                                                <input type="text" class="form-control" name="color[]" id="color_mobiliario_0">
                                                                <div id="color_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="estado_mobiliario_0" class="form-label">Estado <span class="text-danger">*</span></label>
                                                                <select class="form-control" name="estado[]" id="estado_mobiliario_0">
                                                                    <option value="" disabled selected>Seleccione una opción...</option>
                                                                    <option value="Bueno">Bueno</option>
                                                                    <option value="Regular">Regular</option>
                                                                    <option value="Malo">Malo</option>
                                                                </select>
                                                                <div id="estado_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="cantidad_mobiliario_0" class="form-label">Cantidad <span class="text-danger">*</span></label>
                                                                <input type="text" class="form-control" name="cantidad[]" id="cantidad_mobiliario_0">
                                                                <div id="cantidad_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="fecha_adquisicion_mobiliario_0" class="form-label">Fecha Adquisición <span class="text-danger">*</label>
                                                                <input type="date" class="form-control" name="fecha_adquisicion[]" id="fecha_adquisicion_mobiliario_0">
                                                                <div id="fecha_adquisicion_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                        </div>

                                                        <div class="row">
                                                            <div class="col-md-5 mb-3">
                                                                <label for="descripcion_mobiliario_0" class="form-label">Descripción <span class="text-danger">*</label>
                                                                <textarea class="form-control" name="descripcion[]" rows="2" id="descripcion_mobiliario_0"></textarea>
                                                                <div id="descripcion_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label for="observaciones_mobiliario_0" class="form-label">Observaciones</label>
                                                                <textarea class="form-control" name="observaciones[]" rows="2" id="observaciones_mobiliario_0"></textarea>
                                                                <div id="observaciones_mobiliario_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-1 d-flex align-items-end justify-content-end gap-2 mb-3">
                                                                <button type="button" class="btn btn-danger btn-sm btn-remove-row" title="Eliminar fila">
                                                                    <i class="fa-solid fa-trash-can"></i>
                                                                </button>
                                                                <button type="button" class="btn btn-success btn-sm btn-add-row" data-target="mobiliario" title="Agregar fila">
                                                                    <i class="fa-solid fa-plus"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Botones de acción del formulario -->
                                                <div class="row">
                                                    <div class="col-md-6"></div>
                                                    <div class="col-md-6">
                                                        <div class="d-flex justify-content-end gap-2">
                                                            <button type="reset" class="btn btn-secondary" id="btnLimpiarMobiliario">
                                                                <i class="fa-solid fa-eraser"></i> Limpiar
                                                            </button>
                                                            <button type="submit" class="btn btn-primary">
                                                                <i class="fa-solid fa-check"></i> Registrar Mobiliario
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <!-- ==================== FORMULARIO EQUIPO ==================== -->
                                        <div class="tab-pane fade" id="equipo" role="tabpanel">
                                            <form action="equipo_registrar" method="POST" class="mt-3" id="form-equipo">
                                                <div id="items-container-equipo">
                                                    <!-- Fila inicial equipo -->
                                                    <div class="item-row-equipo mb-3 border-bottom pb-3">
                                                        <div class="row">
                                                            <div class="col-md-6 mb-3">
                                                                <label for="id_tipo_equipo_0" class="form-label">Tipo de Equipo <span class="text-danger">*</span></label>
                                                                <select class="form-control select2 tipo-equipo" name="id_tipo_equipo[]" id="id_tipo_equipo_0">
                                                                    <option value="">Seleccione...</option>
                                                                    <?php foreach ($tiposEquipos as $tipo): ?>
                                                                        <option value="<?= $tipo['id_tipo_equipo'] ?>"><?= htmlspecialchars($tipo['nombre']) ?></option>
                                                                    <?php endforeach; ?>
                                                                </select>
                                                                <div id="id_tipo_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label for="id_servicios_equipo_0" class="form-label">Ubicación <span class="text-danger">*</span></label>
                                                                <select class="form-control select2" name="id_servicios[]" id="id_servicios_equipo_0">
                                                                    <option value="">Seleccione...</option>
                                                                    <?php foreach ($servicios as $servicio): ?>
                                                                        <option value="<?= $servicio['id_servicios'] ?>"><?= htmlspecialchars($servicio['nombre_serv']) ?></option>
                                                                    <?php endforeach; ?>
                                                                </select>
                                                                <div id="id_servicios_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                        </div>

                                                        <div class="row">
                                                            <div class="col-md-2 mb-3">
                                                                <label for="marca_equipo_0" class="form-label">Marca</label>
                                                                <input type="text" class="form-control" name="marca[]" id="marca_equipo_0">
                                                                <div id="marca_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="modelo_equipo_0" class="form-label">Modelo</label>
                                                                <input type="text" class="form-control" name="modelo[]" id="modelo_equipo_0">
                                                                <div id="modelo_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="serial_equipo_0" class="form-label">Serial</label>
                                                                <input type="text" class="form-control" name="serial[]" id="serial_equipo_0">
                                                                <div id="serial_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="color_equipo_0" class="form-label">Color</label>
                                                                <input type="text" class="form-control" name="color[]" id="color_equipo_0">
                                                                <div id="color_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="estado_equipo_0" class="form-label">Estado <span class="text-danger">*</span></label>
                                                                <select class="form-control" name="estado[]" id="estado_equipo_0">
                                                                    <option value="" disabled selected>Seleccione...</option>
                                                                    <option value="Nuevo">Nuevo</option>
                                                                    <option value="Bueno">Bueno</option>
                                                                    <option value="Regular">Regular</option>
                                                                    <option value="Malo">Malo</option>
                                                                    <option value="En reparación">En reparación</option>
                                                                </select>
                                                                <div id="estado_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-2 mb-3">
                                                                <label for="fecha_adquisicion_equipo_0" class="form-label">Fecha Adquisición</label>
                                                                <input type="date" class="form-control" name="fecha_adquisicion[]" id="fecha_adquisicion_equipo_0">
                                                                <div id="fecha_adquisicion_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                        </div>

                                                        <div class="row">
                                                            <div class="col-md-5 mb-3">
                                                                <label for="descripcion_adicional_equipo_0" class="form-label">Descripción Adicional</label>
                                                                <textarea class="form-control" name="descripcion[]" rows="2" id="descripcion_adicional_equipo_0"></textarea>
                                                                <div id="descripcion_adicional_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label for="observaciones_equipo_0" class="form-label">Observaciones</label>
                                                                <textarea class="form-control" name="observaciones[]" rows="2" id="observaciones_equipo_0"></textarea>
                                                                <div id="observaciones_equipo_0Error" class="form-text text-danger"></div>
                                                            </div>
                                                            <div class="col-md-1 d-flex align-items-end justify-content-end gap-2 mb-3">
                                                                <button type="button" class="btn btn-danger btn-sm btn-remove-row" title="Eliminar fila">
                                                                    <i class="fa-solid fa-trash-can"></i>
                                                                </button>
                                                                <button type="button" class="btn btn-success btn-sm btn-add-row" data-target="equipo" title="Agregar fila">
                                                                    <i class="fa-solid fa-plus"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Botones de acción -->
                                                <div class="row">
                                                    <div class="col-md-6"></div>
                                                    <div class="col-md-6">
                                                        <div class="d-flex justify-content-end gap-2">
                                                            <button type="reset" class="btn btn-secondary" id="btnLimpiarEquipo">
                                                                <i class="fa-solid fa-eraser"></i> Limpiar
                                                            </button>
                                                            <button type="submit" class="btn btn-primary">
                                                                <i class="fa-solid fa-check"></i> Registrar Equipo
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
    <script src="<?= BASE_URL ?>/dist/js/modulos/inventario_mob/crear_mobiliario.js"></script>
    <script src="<?= BASE_URL ?>/dist/js/modulos/inventario_mob/crear_equipo.js"></script>


</body>

</html>