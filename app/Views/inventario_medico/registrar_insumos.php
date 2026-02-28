<?php 
$titulo = "Inventario Médico";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Inventario Médico</h1>
                    </div>

                    <div class="row">
                        <!-- Total de Insumos -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-primary shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Total de Insumos</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($total_insumos) ?>
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
                                                Insumos Disponibles</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($insumos_activos) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-check-circle fa-2x text-white"></i>
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
                                                Por Vencer (30 días)</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($insumos_por_vencer) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-clock fa-2x text-white"></i>
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
                                                Stock Crítico (< 10)</div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($stock_critico) ?>
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-exclamation-triangle fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end row cards-->

                    <!-- Formulario de Registro de Insumo -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Registrar Nuevo Insumo</h6>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>registrar_insumo" method="POST" autocomplete="off" id="formulario-insumo">
                                        <div class="row">
                                            <!-- Nombre del Insumo -->
                                            <div class="col-md-6 mb-3">
                                                <label for="nombre_insumo" class="form-label">Nombre del Insumo <span class="text-danger">*</span></label>
                                                <input type="text" name="nombre_insumo" id="nombre_insumo" class="form-control" 
                                                    placeholder="Ej: Acetaminofén 500mg" maxlength="100">
                                                <div id="nombre_insumoError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Tipo de Insumo -->
                                            <div class="col-md-6 mb-3">
                                                <label for="tipo_insumo" class="form-label">Tipo de Insumo <span class="text-danger">*</span></label>
                                                <select name="tipo_insumo" id="tipo_insumo" class="form-control select2">
                                                    <option value="">Seleccione un tipo</option>
                                                    <option value="Medicamento">Medicamento</option>
                                                    <option value="Material">Material</option>
                                                    <option value="Quirúrgico">Quirúrgico</option>
                                                </select>
                                                <div id="tipo_insumoError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Presentación -->
                                            <div class="col-md-6 mb-3">
                                                <label for="id_presentacion" class="form-label">Presentación <span class="text-danger">*</span></label>
                                                <select name="id_presentacion" id="id_presentacion" class="form-control select2">
                                                    <option value="">Seleccione una presentación</option>
                                                    <?php foreach ($presentaciones as $presentacion): ?>
                                                        <option value="<?= htmlspecialchars($presentacion['id_presentacion']) ?>">
                                                            <?= htmlspecialchars($presentacion['nombre_presentacion']) ?>
                                                        </option>
                                                    <?php endforeach; ?>
                                                </select>
                                                <div id="id_presentacionError" class="form-text text-danger"></div>
                                            </div>
                                            
                                            <!-- Fecha de Vencimiento -->
                                            <div class="col-md-6 mb-3">
                                                <label for="fecha_vencimiento" class="form-label">Fecha de Vencimiento</label>
                                                <input type="date" name="fecha_vencimiento" id="fecha_vencimiento" class="form-control">
                                                <div id="fecha_vencimientoError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row" style="display: none;">
                                            <!-- Estatus -->
                                            <div class="col-md-6 mb-3">
                                                <label for="estatus" class="form-label">Estatus <span class="text-danger">*</span></label>
                                                <select name="estatus" id="estatus" class="form-control">
                                                    <option value="Agotado" selected>Agotado</option>   
                                                    <option value="Activo">Activo</option>
                                                    <option value="Vencido">Vencido</option>
                                                </select>
                                                <div id="estatusError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Descripción -->
                                            <div class="col-12 mb-3">
                                                <label for="descripcion" class="form-label">Descripción <span class="text-danger">*</span></label>
                                                <textarea name="descripcion" id="descripcion" class="form-control" 
                                                        rows="3" maxlength="500" 
                                                        placeholder="Descripción detallada del insumo..."></textarea>
                                                <div id="descripcionError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="reset" class="btn btn-secondary" id="btnLimpiarInsumo">
                                                        <i class="fa-solid fa-eraser"></i> Limpiar
                                                    </button>
                                                    <button type="submit" id="btnRegistrarInsumo" class="btn btn-primary">
                                                        <i class="fa-solid fa-check"></i> Registrar Insumo
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
   <script src="<?= BASE_URL ?>dist/js/modulos/inventario_medico/crear_insumo.js"></script>

</body>
</html>