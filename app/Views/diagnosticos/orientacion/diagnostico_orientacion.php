<?php 
$titulo = "Orientación";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Diagnostico de Orientación</h1>
                        <a href="<?= BASE_URL ?>diagnostico_orientacion_consultar" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
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

                    <!-- Fila 1: Diagnóstico de Orientación -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4 border-left-primary">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-comments me-2"></i>Diagnóstico de Orientación
                                    </h6>
                                    <span class="badge bg-primary">Registro Psicológico</span>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>orientacion_registrar" method="POST" id="form-orientacion" class="needs-validation" novalidate>
                                        
                                        <!-- ID del empleado (psicólogo) -->
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">
                                        <input type="hidden" name="id_beneficiario" id="id_beneficiario" class="id_beneficiario_hidden">

                                        <div class="row">
                                            <!-- Motivo de Orientación -->
                                            <div class="col-md-12 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-question-circle me-2"></i>Motivo de Orientación
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="motivo_orientacion" class="form-label">
                                                        Motivo <span class="text-danger">*</span>
                                                    </label>
                                                    <textarea class="form-control" id="motivo_orientacion" name="motivo_orientacion" 
                                                            rows="3" placeholder="Describa el motivo principal de la orientación..." 
                                                            maxlength="5000" required></textarea>
                                                    <div class="invalid-feedback" id="motivo_orientacionError"></div>
                                                    <small class="form-text text-muted">Ej: Problemas académicos, conflictos personales, orientación vocacional, etc.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Descripción de la Orientación -->
                                            <div class="col-md-12 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-file-alt me-2"></i>Descripción de la Sesión
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="descripcion_orientacion" class="form-label">
                                                        Descripción <span class="text-danger">*</span>
                                                    </label>
                                                    <textarea class="form-control" id="descripcion_orientacion" name="descripcion_orientacion" 
                                                            rows="4" placeholder="Describa el desarrollo de la sesión de orientación..." 
                                                            maxlength="5000" required></textarea>
                                                    <div class="invalid-feedback" id="descripcion_orientacionError"></div>
                                                    <small class="form-text text-muted">Incluya aspectos relevantes discutidos, emociones expresadas, puntos clave abordados.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Indicaciones -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-tasks me-2"></i>Indicaciones
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="indicaciones_orientacion" class="form-label">
                                                        Indicaciones <span class="text-danger">*</span>
                                                    </label>
                                                    <textarea class="form-control" id="indicaciones_orientacion" name="indicaciones_orientacion" 
                                                            rows="4" placeholder="Indicaciones y recomendaciones para el beneficiario..." 
                                                            maxlength="5000" required></textarea>
                                                    <div class="invalid-feedback" id="indicaciones_orientacionError"></div>
                                                    <small class="form-text text-muted">Actividades, tareas, ejercicios o cambios sugeridos.</small>
                                                </div>
                                            </div>

                                            <!-- Observaciones Adicionales -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-clipboard-check me-2"></i>Observaciones Adicionales
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="obs_adic_orientacion" class="form-label">
                                                        Observaciones
                                                    </label>
                                                    <textarea class="form-control" id="obs_adic_orientacion" name="obs_adic_orientacion" 
                                                            rows="4" placeholder="Observaciones adicionales, pronóstico, seguimiento recomendado..." 
                                                            maxlength="5000"></textarea>
                                                    <div class="invalid-feedback" id="obs_adic_orientacionError"></div>
                                                    <small class="form-text text-muted">Notas adicionales, impresiones del psicólogo, sugerencias para próximas sesiones.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Botones -->
                                        <div class="row mt-4">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="button" class="btn btn-secondary" id="limpiarFormularioOrientacion">
                                                        <i class="fas fa-times me-1"></i> Limpiar
                                                    </button>
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save me-1"></i> Guardar Diagnóstico
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
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/orientacion/crear_diagnostico.js"></script>
                                                                
</body>
</html>