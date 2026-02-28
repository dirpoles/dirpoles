<?php 
$titulo = "Psicología";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Diagnostico de Psicología</h1>
                        <a href="<?= BASE_URL ?>diagnostico_psicologia_consultar" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
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
                                        <i class="fas fa-stethoscope me-2"></i>Diagnóstico General
                                    </h6>
                                    <span class="badge bg-primary">Consulta Completa</span>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>diagnostico_psicologia_registrar" method="POST" id="form-diagnostico-general" class="needs-validation" novalidate>
                                        <!-- ID de solicitud oculto (asumo que viene de alguna parte) -->
                                        <input type="hidden" name="tipo_consulta" value="Diagnóstico">
                                        <input type="hidden" name="id_beneficiario" class="id_beneficiario_hidden">
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">
                                        
                                        <div class="row">
                                            <!-- Fila 1: Patología y Diagnóstico -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-heartbeat me-2"></i>Información Patológica
                                                </h6>
                                                
                                                <div class="mb-4">
                                                    <label for="id_patologia" class="form-label">
                                                        Patología Identificada <span class="text-danger">*</span>
                                                    </label>
                                                    <select name="id_patologia" id="id_patologia" class="form-select select2" >
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

                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-file-medical me-2"></i>Evaluación Psicológica
                                                </h6>
                                                
                                                <div class="mb-3">
                                                    <label for="diagnostico" class="form-label">
                                                        Diagnóstico <span class="text-danger">*</span>
                                                    </label>
                                                    <textarea class="form-control" id="diagnostico" name="diagnostico" 
                                                            rows="4" placeholder="Describa el diagnóstico psicológico..." 
                                                            ></textarea>
                                                    <div class="invalid-feedback" id="diagnosticoError"></div>
                                                    <small class="form-text text-muted">
                                                        Incluya observaciones sobre el estado mental, emocional y conductual
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Fila 2: Observaciones y Tratamiento -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-clipboard-list me-2"></i>Observaciones y Recomendaciones
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="observaciones_diagnostico" class="form-label">Observaciones Finales</label>
                                                    <textarea class="form-control" id="observaciones_diagnostico" name="observaciones" 
                                                            rows="3" placeholder="Observaciones adicionales, recomendaciones, pronóstico..."></textarea>
                                                    <small class="form-text text-muted">
                                                        Notas adicionales, seguimiento recomendado, observaciones del psicólogo
                                                    </small>
                                                    <div class="invalid-feedback" id="observaciones_diagnosticoError"></div>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-6 mb-3">
                                                <!-- Spacer header to align with left side if needed, or just padding -->
                                                <h6 class="text-primary mb-3" style="visibility: visible;"> 
                                                    <i class="fas fa-notes-medical me-2"></i>Plan de Tratamiento
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="tratamiento_gen" class="form-label">
                                                        Tratamiento Recomendado
                                                    </label>
                                                    <textarea class="form-control" id="tratamiento_gen" name="tratamiento_gen" 
                                                            rows="3" placeholder="Describa el tratamiento general recomendado..."></textarea>
                                                    <small class="form-text text-muted">
                                                        Terapias, actividades, seguimientos, medicación (si aplica)
                                                    </small>
                                                    <div class="invalid-feedback" id="tratamiento_genError"></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Botones de acción -->
                                        <div class="row mt-4">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="button" class="btn btn-secondary" id="limpiarFormulario">
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

                    <!-- Fila 2: Retiro Temporal y Cambio de Carrera (en columnas) -->
                    <div class="row">
                        <!-- Columna 1: Retiro Temporal -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-warning">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-warning">
                                        <i class="fas fa-pause-circle me-2"></i>Retiro Temporal
                                    </h6>
                                    <span class="badge bg-warning">Suspensión Temporal</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>registrar_retiro_temporal" method="POST" id="form-retiro-temporal" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <input type="hidden" name="tipo_consulta" value="Retiro temporal">
                                        <input type="hidden" name="id_beneficiario" class="id_beneficiario_hidden">
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">
                                        
                                        <div class="row">
                                            <!-- Motivo del Retiro -->
                                            <div class="col-md-6 mb-3">
                                                <label for="motivo_retiro" class="form-label">
                                                    Motivo del Retiro <span class="text-danger">*</span>
                                                </label>
                                                <select class="form-select" id="motivo_retiro" name="motivo_retiro">
                                                    <option value="" selected disabled>Seleccione el motivo</option>
                                                    <option value="Problemas personales/familiares">Problemas personales/familiares</option>
                                                    <option value="Problemas económicos">Problemas económicos</option>
                                                    <option value="Salud física">Salud física</option>
                                                    <option value="Salud mental">Salud mental</option>
                                                    <option value="Trabajo/empleo">Trabajo/empleo</option>
                                                    <option value="Situación migratoria">Situación migratoria</option>
                                                    <option value="Otro">Otro motivo</option>
                                                </select>
                                                <div class="invalid-feedback" id="motivo_retiroError"></div>
                                            </div>

                                            <!-- Duración del Retiro -->
                                            <div class="col-md-6 mb-3">
                                                <label for="duracion_retiro" class="form-label">
                                                    Duración Estimada <span class="text-danger">*</span>
                                                </label>
                                                <select class="form-select" id="duracion_retiro" name="duracion_retiro" >
                                                    <option value="" selected disabled>Seleccione duración</option>
                                                    <option value="15 días">15 días</option>
                                                    <option value="1 mes">1 mes</option>
                                                    <option value="2 meses">2 meses</option>
                                                    <option value="3 meses">3 meses</option>
                                                    <option value="6 meses">6 meses</option>
                                                    <option value="1 año">1 año</option>
                                                    <option value="Indefinido">Indefinido</option>
                                                </select>
                                                <div class="invalid-feedback" id="duracion_retiroError"></div>
                                            </div>
                                            
                                            <!-- Otro motivo (si selecciona "Otro") -->
                                            <div class="col-12 mb-3" id="otro-motivo-container" style="display: none;" >
                                                <label for="motivo_retiro_otro" class="form-label">
                                                    Especifique el motivo
                                                </label>
                                                <input type="text" class="form-control" id="motivo_retiro_otro" name="motivo_retiro_otro" 
                                                    placeholder="Describa el motivo del retiro...">
                                                <div class="invalid-feedback" id="motivo_retiro_otroError"></div>
                                            </div>
                                            
                                            <!-- Observaciones para Retiro -->
                                            <div class="col-12 mb-3">
                                                <label for="observaciones_retiro" class="form-label">Observaciones</label>
                                                <textarea class="form-control" id="observaciones_retiro" name="observaciones_retiro" 
                                                        rows="3" placeholder="Observaciones sobre el retiro temporal..."></textarea>
                                                <small class="form-text text-muted">
                                                    Recomendaciones, condiciones para el retorno, seguimiento requerido
                                                </small>
                                                <div class="invalid-feedback" id="observaciones_retiroError"></div>
                                            </div>
                                        </div>
                                        
                                        <!-- Botones -->
                                        <div class="text-end mt-auto pt-3">
                                            <button type="button" class="btn btn-outline-secondary" id="btnLimpiarFormularioRetiro">
                                                <i class="fas fa-times me-1"></i> Limpiar
                                            </button>
                                            <button type="submit" class="btn btn-warning">
                                                <i class="fas fa-pause me-1"></i> Registrar Retiro
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Columna 2: Cambio de Carrera -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-info">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-info">
                                        <i class="fas fa-exchange-alt me-2"></i>Cambio de Carrera
                                    </h6>
                                    <span class="badge bg-info">Reorientación Vocacional</span>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>registrar_cambio_carrera" method="POST" id="form-cambio-carrera" class="needs-validation" novalidate>
                                        <input type="hidden" name="tipo_consulta" value="Cambio de carrera">
                                        <input type="hidden" name="id_beneficiario" class="id_beneficiario_hidden">
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">
                                        
                                        <div class="row">
                                            <!-- Motivo del Cambio -->
                                            <div class="col-12 mb-3">
                                                <label for="motivo_cambio" class="form-label">
                                                    Motivo del Cambio <span class="text-danger">*</span>
                                                </label>
                                                <textarea class="form-control" id="motivo_cambio" name="motivo_cambio" 
                                                        rows="4" placeholder="Explique los motivos psicológicos/vocacionales del cambio..." 
                                                        ></textarea>
                                                <div class="invalid-feedback" id="motivo_cambioError"></div>
                                                <small class="form-text text-muted">
                                                    Incluya aspectos psicológicos, vocacionales, intereses, aptitudes, etc.
                                                </small>
                                                <div class="invalid-feedback" id="motivo_cambioError"></div>
                                            </div>
                                            
                                            <!-- Observaciones para Cambio -->
                                            <div class="col-12 mb-3">
                                                <label for="observaciones_cambio" class="form-label">Observaciones y Recomendaciones</label>
                                                <textarea class="form-control" id="observaciones_cambio" name="observaciones_cambio" 
                                                        rows="3" placeholder="Recomendaciones, seguimiento, aspectos a considerar..."></textarea>
                                                <small class="form-text text-muted">
                                                    Recomendaciones vocacionales, aspectos a trabajar, pronóstico de adaptación
                                                </small>
                                                <div class="invalid-feedback" id="observaciones_cambioError"></div>
                                            </div>
                                        </div>
                                        
                                        <!-- Botones -->
                                        <div class="d-flex justify-content-end gap-2 mt-3">
                                            <button type="button" class="btn btn-outline-secondary" id="btnLimpiarFormularioCambio">
                                                <i class="fas fa-times me-1"></i> Limpiar
                                            </button>
                                            <button type="submit" class="btn btn-info">
                                                <i class="fas fa-exchange-alt me-1"></i> Registrar Cambio
                                            </button>
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
   <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/validar_diagnostico_gen.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/validar_retiro.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/validar_cambio.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/crear_diagnostico.js"></script>

   
<!-- CSS adicional para mejoras visuales -->
<style>
/* Estilos para las tarjetas de formularios */
.card {
    border-radius: 10px;
    overflow: hidden;
}

.card-header {
    border-bottom: 2px solid rgba(0,0,0,.125);
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* Bordes izquierdos coloridos */
.border-left-primary {
    border-left: 4px solid #4e73df !important;
}

.border-left-warning {
    border-left: 4px solid #f6c23e !important;
}

.border-left-info {
    border-left: 4px solid #36b9cc !important;
}

/* Mejoras para textareas */
textarea.form-control {
    min-height: 80px;
    resize: vertical;
}

/* Responsive para móviles */
@media (max-width: 768px) {
    .card-body {
        padding: 1rem;
    }
    
    .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
    
    .d-flex.justify-content-end.gap-2 {
        flex-direction: column;
    }
}
</style>
                                                                
</body>
</html>