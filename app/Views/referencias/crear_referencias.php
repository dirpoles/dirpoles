<?php 
$titulo = "Referencias";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Referencias</h1>
                    </div>

                    <!-- Formulario de Registro -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row">
                                <!-- Total de Referencias -->
                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card bg-primary shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                        Total Referencias</div>
                                                    <div class="h5 mb-0 font-weight-bold text-white"><?= $referencias_totales ?? 0; ?></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-clipboard-list fa-2x text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Referencias Pendientes -->
                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card bg-warning shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                        Pendientes</div>
                                                    <div class="h5 mb-0 font-weight-bold text-white"><?= $referencias_pendientes ?? 0; ?></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-clock fa-2x text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Referencias Finalizadas -->
                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card bg-success shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                        Finalizadas</div>
                                                    <div class="h5 mb-0 font-weight-bold text-white"><?= $referencias_finalizadas ?? 0; ?></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-check-circle fa-2x text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Referencias del Mes -->
                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card bg-info shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                        Generadas este Mes</div>
                                                    <div class="h5 mb-0 font-weight-bold text-white"><?= $referencias_mes ?? 0; ?></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-calendar fa-2x text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Registrar Nueva Referencia</h6>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>referencia_registrar" method="POST" autocomplete="off" id="formulario-referencia">
                                        
                                        <h6 class="text-secondary mb-3 pl-2" style="border-left: 4px solid #4e73df;">Datos del Beneficiario</h6>
                                        
                                        <div class="row mb-4">
                                            <div class="col-md-12">
                                                <label for="beneficiario_nombre" class="form-label">Seleccionar Beneficiario</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control bg-light" id="beneficiario_nombre" 
                                                        placeholder="Haga clic en buscar para seleccionar..." readonly>
                                                    
                                                    <input type="hidden" name="id_beneficiario" id="id_beneficiario">

                                                    <button class="btn btn-outline-danger" type="button" id="btnEliminarBeneficiario" 
                                                            title="Limpiar selección" style="display: none;">
                                                        <i class="fa-solid fa-times"></i>
                                                    </button>
                                                    <button class="btn btn-primary" type="button" id="btnSeleccionarBeneficiario" 
                                                            data-bs-toggle="modal" data-bs-target="#modalSeleccionarBeneficiario">
                                                        <i class="fas fa-search me-1"></i> Buscar
                                                    </button>
                                                </div>
                                                <div id="id_beneficiarioError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <hr>

                                        <h6 class="text-secondary mb-3 pl-2" style="border-left: 4px solid #4e73df;">Datos del Traslado</h6>

                                        <div class="row">
                                            <div class="col-md-6 border-end">
                                                <div class="mb-3">
                                                    <label for="id_servicio_origen" class="form-label font-weight-bold">Servicio de Origen</label>
                                                    <?php 
                                                        $es_admin = in_array($_SESSION['tipo_empleado'], ['Administrador', 'Superusuario']);
                                                    ?>
                                                    <select name="id_servicio_origen" id="id_servicio_origen" class="form-select select2" <?= !$es_admin ? 'readonly' : '' ?>>
                                                        <?php if ($es_admin): ?>
                                                            <option value="" disabled selected>Seleccione servicio origen</option>
                                                            <?php foreach ($servicios as $srv): ?>
                                                                <option value="<?= $srv['id_servicios'] ?>"><?= htmlspecialchars($srv['nombre_servicio']) ?></option>
                                                            <?php endforeach; ?>
                                                        <?php else: ?>
                                                            <?php foreach ($servicios as $srv): ?>
                                                                <?php if ($srv['id_servicios'] == $id_servicio_propio): ?>
                                                                    <option value="<?= $srv['id_servicios'] ?>" selected><?= htmlspecialchars($srv['nombre_servicio']) ?></option>
                                                                <?php endif; ?>
                                                            <?php endforeach; ?>
                                                        <?php endif; ?>
                                                    </select>
                                                    <div id="id_servicio_origenError" class="form-text text-danger"></div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="id_empleado_origen" class="form-label">Empleado que Refiere</label>
                                                    <select name="id_empleado_origen" id="id_empleado_origen" class="form-select select2" <?= !$es_admin ? 'readonly' : '' ?>>
                                                        <option value="<?= $_SESSION['id_empleado'] ?? '' ?>" selected>
                                                            <?= $_SESSION['nombre'] . ' ' . $_SESSION['apellido'] ?? 'Usuario Actual' ?>
                                                        </option>
                                                    </select>
                                                    <div id="id_empleado_origenError" class="form-text text-danger"></div>
                                                </div>
                                            </div>

                                            <!-- Inyectar datos de sesión para JavaScript -->
                                            <script>
                                                const USER_SESSION = {
                                                    id_empleado: <?= json_encode($_SESSION['id_empleado']) ?>,
                                                    nombre_completo: <?= json_encode($_SESSION['nombre'] . ' ' . $_SESSION['apellido']) ?>,
                                                    rol: <?= json_encode($_SESSION['tipo_empleado']) ?>,
                                                    id_servicio: <?= json_encode($id_servicio_propio) ?>,
                                                    es_admin: <?= json_encode($es_admin) ?>
                                                };
                                            </script>

                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="id_servicio_destino" class="form-label font-weight-bold text-primary">Servicio de Destino</label>
                                                    <select name="id_servicio_destino" id="id_servicio_destino" class="form-select select2">
                                                        <option value="" disabled selected>Seleccione a dónde se refiere</option>
                                                        <?php foreach ($servicios as $srv): ?>
                                                            <option value="<?= $srv['id_servicios'] ?>"><?= htmlspecialchars($srv['nombre_servicio']) ?></option>
                                                        <?php endforeach; ?>
                                                    </select>
                                                    <div id="id_servicio_destinoError" class="form-text text-danger"></div>
                                                </div>

                                                <div class="mb-3">
                                                    <label for="id_empleado_destino" class="form-label">Empleado Destino</label>
                                                    <select name="id_empleado_destino" id="id_empleado_destino" class="form-select select2">
                                                        <option value="" selected disabled>Cualquier especialista disponible</option>
                                                    </select>
                                                    <div id="id_empleado_destinoError" class="form-text text-danger"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr>

                                        <h6 class="text-secondary mb-3 pl-2" style="border-left: 4px solid #4e73df;">Detalles de la Referencia</h6>

                                        <div class="row">
                                            <div class="col-md-12 mb-3">
                                                <label for="motivo" class="form-label">Motivo de la Referencia <span class="text-danger">*</span></label>
                                                <input type="text" name="motivo" id="motivo" class="form-control" 
                                                    placeholder="Ej: Evaluación psicológica requerida, Valoración médica, etc." maxlength="255">
                                                <div id="motivoError" class="form-text text-danger"></div>
                                            </div>

                                            <div class="col-md-12 mb-3">
                                                <label for="observaciones" class="form-label">Observaciones / Informe Breve</label>
                                                <textarea class="form-control" id="observaciones" name="observaciones" rows="4" 
                                                        placeholder="Detalles adicionales sobre el caso..."></textarea>
                                                <div id="observacionesError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row mt-3">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="reset" class="btn btn-secondary" id="limpiar_form">
                                                        <i class="fas fa-eraser me-1"></i> Limpiar
                                                    </button>
                                                    <button type="submit" id="btnRegistrarReferencia" class="btn btn-primary">
                                                        <i class="fas fa-paper-plane me-1"></i> Crear Referencia
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
   <script src="<?= BASE_URL ?>dist/js/modulos/referencias/crear_referencias.js"></script>

</body>
</html>