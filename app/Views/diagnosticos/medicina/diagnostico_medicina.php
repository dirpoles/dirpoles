<?php 
$titulo = "Medicina";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Diagnostico de Medicina</h1>
                        <a href="<?= BASE_URL ?>diagnostico_medicina_consultar" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                            <i class="fas fa-clipboard-list fa-sm text-white-50 me-1"></i> Consultar Diagnósticos
                        </a>
                    </div>

                    <!-- Sección de Selección de Beneficiario (Global) -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-user-injured me-2"></i>Datos del Beneficiario
                                    </h6>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="input-group">
                                                <span class="input-group-text bg-light text-primary fw-bold">
                                                    <i class="fas fa-user me-2"></i>Beneficiario
                                                </span>
                                                <input type="text" class="form-control bg-white" id="beneficiario_nombre" 
                                                       placeholder="Seleccione un beneficiario desde la lupa..." readonly 
                                                       style="color: #4e73df;">
                                                <input type="hidden" id="id_beneficiario">
                                                
                                                <button class="btn btn-outline-danger" type="button" id="btnEliminarBeneficiario" title="Limpiar selección" style="display: none;">
                                                    <i class="fa-solid fa-times"></i>
                                                </button>
                                                <button class="btn btn-primary" type="button" id="btnSeleccionarBeneficiario" 
                                                        data-bs-toggle="modal" data-bs-target="#modalSeleccionarBeneficiario">
                                                    <i class="fas fa-search me-1"></i> Buscar
                                                </button>
                                            </div>
                                            <div class="invalid-feedback" id="beneficiario_nombreError"></div>
                                            <small class="text-muted mt-2 d-block ms-1">
                                                <i class="fas fa-info-circle me-1"></i>
                                                El beneficiario seleccionado se aplicará automáticamente a todos los formularios de esta página.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Formulario de Registro -->
                    <!-- Fila 1: Diagnóstico General (completo) -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4 border-left-primary">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-stethoscope me-2"></i>Consulta Médica
                                    </h6>
                                    <span class="badge bg-primary">Registro Médico</span>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>diagnostico_medicina_registrar" method="POST" id="form-consulta-medica" class="needs-validation" novalidate>
                                        
                                        <!-- ID oculto -->
                                        <input type="hidden" name="id_beneficiario" class="id_beneficiario_hidden">
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">

                                        <div class="row">
                                            <!-- Patología -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-heartbeat me-2"></i>Información Patológica
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="id_patologia" class="form-label">
                                                        Patología <span class="text-danger">*</span>
                                                    </label>
                                                    <select name="id_patologia" id="id_patologia" class="form-select select2">
                                                        <option value="" selected disabled>Seleccione una patología</option>
                                                        <?php foreach ($patologias as $patologia): ?>
                                                            <option value="<?= $patologia['id_patologia'] ?>">
                                                                <?= htmlspecialchars($patologia['nombre_patologia']) ?>
                                                            </option>
                                                        <?php endforeach; ?>
                                                    </select>
                                                    <div class="invalid-feedback" id="id_patologiaError"></div>
                                                </div>
                                            </div>

                                            <!-- Estatura y Peso -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-ruler-vertical me-2"></i>Datos Antropométricos
                                                </h6>
                                                <div class="row">
                                                    <div class="col-md-6 mb-3">
                                                        <label for="estatura" class="form-label">Estatura (m) <span class="text-danger">*</span></label>
                                                        <input type="number" step="0.01" min="0" class="form-control" id="estatura" name="estatura" required>
                                                        <div class="invalid-feedback" id="estaturaError"></div>
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label for="peso" class="form-label">Peso (kg) <span class="text-danger">*</span></label>
                                                        <input type="number" step="0.01" min="0" class="form-control" id="peso" name="peso" required>
                                                        <div class="invalid-feedback" id="pesoError"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Tipo de sangre -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-tint me-2"></i>Información Clínica
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="tipo_sangre" class="form-label">Tipo de Sangre <span class="text-danger">*</span></label>
                                                    <select name="tipo_sangre" id="tipo_sangre" class="form-select" required>
                                                        <option value="" selected disabled>Seleccione tipo de sangre</option>
                                                        <option value="A+">A+</option>
                                                        <option value="A-">A-</option>
                                                        <option value="B+">B+</option>
                                                        <option value="B-">B-</option>
                                                        <option value="AB+">AB+</option>
                                                        <option value="AB-">AB-</option>
                                                        <option value="O+">O+</option>
                                                        <option value="O-">O-</option>
                                                    </select>
                                                    <div class="invalid-feedback" id="tipo_sangreError"></div>
                                                </div>
                                            </div>

                                            <!-- Motivo de visita -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-notes-medical me-2"></i>Motivo de Visita
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="motivo_visita" class="form-label">Motivo <span class="text-danger">*</span></label>
                                                    <textarea class="form-control" id="motivo_visita" name="motivo_visita" rows="3" placeholder="Describa el motivo de la consulta..." required></textarea>
                                                    <div class="invalid-feedback" id="motivo_visitaError"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Diagnóstico -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-file-medical me-2"></i>Diagnóstico
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="diagnostico" class="form-label">Diagnóstico <span class="text-danger">*</span></label>
                                                    <textarea class="form-control" id="diagnostico" name="diagnostico" rows="4" placeholder="Describa el diagnóstico médico..." required></textarea>
                                                    <div class="invalid-feedback" id="diagnosticoError"></div>
                                                </div>
                                            </div>

                                            <!-- Tratamiento -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-pills me-2"></i>Tratamiento
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="tratamiento" class="form-label">Tratamiento <span class="text-danger">*</span></label>
                                                    <textarea class="form-control" id="tratamiento" name="tratamiento" rows="4" placeholder="Describa el tratamiento recomendado..." required></textarea>
                                                    <div class="invalid-feedback" id="tratamientoError"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Observaciones -->
                                            <div class="col-md-12 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-clipboard-list me-2"></i>Observaciones
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="observaciones" class="form-label">Observaciones</label>
                                                    <textarea class="form-control" id="observaciones" name="observaciones" rows="3" placeholder="Observaciones adicionales, recomendaciones, pronóstico..."></textarea>
                                                    <div class="invalid-feedback" id="observacionesError"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Insumos Utilizados -->
                                            <div class="col-md-12 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-first-aid me-2"></i>Insumos Utilizados (Opcional)
                                                </h6>
                                                <div class="table-responsive">
                                                    <table class="table table-bordered" id="tabla_insumos_diagnostico">
                                                        <thead>
                                                            <tr>
                                                                <th style="width: 60%;">Insumo</th>
                                                                <th style="width: 20%;">Cantidad</th>
                                                                <th style="width: 20%;">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="lista_insumos">
                                                            <!-- Filas dinámicas -->
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="text-end">
                                                    <button type="button" class="btn btn-success btn-sm" id="btnAgregarInsumo">
                                                        <i class="fas fa-plus me-1"></i> Agregar Insumo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Botones -->
                                        <div class="row mt-4">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="button" class="btn btn-secondary" id="limpiarFormulario">
                                                        <i class="fas fa-times me-1"></i> Limpiar
                                                    </button>
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save me-1"></i> Guardar Consulta
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
                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <!-- Footer -->
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
            <!-- End of Footer -->
            
            <!-- Modales -->
            <?php include BASE_PATH . '/app/Views/citas/modales.php'; ?>

        </div>
        <!-- End of Content Wrapper -->

    </div>

   <?php include BASE_PATH . '/app/Views/template/script.php'; ?>

   <!-- JavaScript Modulares para Diagnóstico -->
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/medicina/crear_diagnostico.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/medicina/insumos_diagnostico.js"></script>
    <script>
        // Pasar inventario a JS para validaciones
        window.inventarioInsumos = <?= json_encode($insumos ?? []) ?>;
    </script>
                                                                
</body>
</html>