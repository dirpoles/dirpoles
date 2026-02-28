<?php 
$titulo = "Discapacidad";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Diagnostico de Discapacidad</h1>
                        <a href="<?= BASE_URL ?>diagnostico_discapacidad_consultar" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
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

                    <!-- Diagnóstico de Discapacidad -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4 border-left-primary">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-wheelchair me-2"></i>Diagnóstico de Discapacidad
                                    </h6>
                                    <span class="badge bg-primary">Registro Médico</span>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>discapacidad_registrar" method="POST" id="form-discapacidad" class="needs-validation" novalidate>
                                        
                                        <!-- ID del empleado (médico/psicólogo) -->
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">
                                        <input type="hidden" name="id_beneficiario" id="id_beneficiario" class="id_beneficiario_hidden">
                                        
                                        <div class="row">
                                            <!-- Tipo de Discapacidad -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-tag me-2"></i>Tipo de Discapacidad
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="tipo_discapacidad" class="form-label">
                                                        Tipo de Discapacidad <span class="text-danger">*</span>
                                                    </label>
                                                    <select class="form-select" id="tipo_discapacidad" name="tipo_discapacidad" required>
                                                        <option value="" selected disabled>Seleccione un tipo</option>
                                                        <option value="Física">Física</option>
                                                        <option value="Sensorial">Sensorial</option>
                                                        <option value="Intelectual">Intelectual</option>
                                                        <option value="Múltiple">Múltiple</option>
                                                        <option value="Otro">Otro</option>
                                                    </select>
                                                    <div class="invalid-feedback" id="tipo_discapacidadError"></div>
                                                    <small class="form-text text-muted">Seleccione el tipo principal de discapacidad.</small>
                                                </div>
                                            </div>

                                            <!-- Discapacidad Específica -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-info-circle me-2"></i>Discapacidad Específica
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="disc_especifica" class="form-label">
                                                        Discapacidad Específica
                                                    </label>
                                                    <input type="text" class="form-control" id="disc_especifica" name="disc_especifica" 
                                                        placeholder="Ej: Parálisis cerebral, Autismo, Sordera, etc." 
                                                        maxlength="200">
                                                    <div class="invalid-feedback" id="disc_especificaError"></div>
                                                    <small class="form-text text-muted">Especifique la discapacidad si es necesario.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Diagnóstico -->
                                            <div class="col-md-12 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-stethoscope me-2"></i>Diagnóstico Médico
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="diagnostico" class="form-label">
                                                        Diagnóstico <span class="text-danger">*</span>
                                                    </label>
                                                    <input type="text" class="form-control" id="diagnostico" name="diagnostico" 
                                                        placeholder="Ingrese el diagnóstico clínico formal..." 
                                                        maxlength="255" required>
                                                    <div class="invalid-feedback" id="diagnosticoError"></div>
                                                    <small class="form-text text-muted">Diagnóstico clínico formal según CIE-10.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Grado -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-thermometer-half me-2"></i>Grado de Discapacidad
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="grado" class="form-label">
                                                        Grado <span class="text-danger">*</span>
                                                    </label>
                                                    <select class="form-select" id="grado" name="grado" required>
                                                        <option value="" selected disabled>Seleccione el grado</option>
                                                        <option value="Leve">Leve</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Grave">Grave</option>
                                                    </select>
                                                    <div class="invalid-feedback" id="gradoError"></div>
                                                    <small class="form-text text-muted">Nivel de afectación de la discapacidad.</small>
                                                </div>
                                            </div>

                                            <!-- Medicamentos -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-pills me-2"></i>Medicamentos
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="medicamentos" class="form-label">
                                                        Medicamentos Actuales
                                                    </label>
                                                    <textarea class="form-control" id="medicamentos" name="medicamentos" 
                                                            rows="2" placeholder="Lista de medicamentos que toma actualmente..." 
                                                            maxlength="255"></textarea>
                                                    <div class="invalid-feedback" id="medicamentosError"></div>
                                                    <small class="form-text text-muted">Medicamentos, dosis y frecuencia si es conocido.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Habilidades Funcionales -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-tasks me-2"></i>Habilidades Funcionales
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="habilidades_funcionales" class="form-label">
                                                        Habilidades Funcionales <span class="text-danger">*</span>
                                                    </label>
                                                    <textarea class="form-control" id="habilidades_funcionales" name="habilidades_funcionales" 
                                                            rows="3" placeholder="Describa las habilidades funcionales del beneficiario..." 
                                                            maxlength="255" required></textarea>
                                                    <div class="invalid-feedback" id="habilidades_funcionalesError"></div>
                                                    <small class="form-text text-muted">Capacidades para realizar actividades diarias.</small>
                                                </div>
                                            </div>

                                            <!-- Requiere Asistencia -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-hands-helping me-2"></i>Asistencia Requerida
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="requiere_asistencia" class="form-label">
                                                        ¿Requiere Asistencia Personal?
                                                    </label>
                                                    <select class="form-select" id="requiere_asistencia" name="requiere_asistencia">
                                                        <option value="" selected>Seleccione</option>
                                                        <option value="Si">Si</option>
                                                        <option value="No">No</option>
                                                    </select>
                                                    <div class="invalid-feedback" id="requiere_asistenciaError"></div>
                                                    <small class="form-text text-muted">Indique si el beneficiario necesita asistencia personal.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Dispositivo de Asistencia -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-crutch me-2"></i>Dispositivo de Asistencia
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="dispositivo_asistencia" class="form-label">
                                                        Dispositivo de Asistencia
                                                    </label>
                                                    <input type="text" class="form-control" id="dispositivo_asistencia" name="dispositivo_asistencia" 
                                                        placeholder="Ej: Silla de ruedas, audífonos, lentes, etc." 
                                                        maxlength="255">
                                                    <div class="invalid-feedback" id="dispositivo_asistenciaError"></div>
                                                    <small class="form-text text-muted">Dispositivos que utiliza el beneficiario.</small>
                                                </div>
                                            </div>

                                            <!-- Carnet de Discapacidad -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-id-card me-2"></i>Carnet de Discapacidad
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="carnet_discapacidad" class="form-label">
                                                        Número de Carnet
                                                    </label>
                                                    <input type="text" class="form-control" id="carnet_discapacidad" name="carnet_discapacidad" 
                                                        placeholder="Número del carnet de discapacidad" 
                                                        maxlength="20">
                                                    <div class="invalid-feedback" id="carnet_discapacidadError"></div>
                                                    <small class="form-text text-muted">Número del carnet oficial si posee.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Observaciones -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-clipboard-list me-2"></i>Observaciones
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="observaciones" class="form-label">
                                                        Observaciones <span class="text-danger">*</span>
                                                    </label>
                                                    <textarea class="form-control" id="observaciones" name="observaciones" 
                                                            rows="4" placeholder="Observaciones adicionales sobre la discapacidad..." 
                                                            required></textarea>
                                                    <div class="invalid-feedback" id="observacionesError"></div>
                                                    <small class="form-text text-muted">Notas importantes, detalles adicionales, etc.</small>
                                                </div>
                                            </div>

                                            <!-- Recomendaciones -->
                                            <div class="col-md-6 mb-3">
                                                <h6 class="text-primary mb-3">
                                                    <i class="fas fa-lightbulb me-2"></i>Recomendaciones
                                                </h6>
                                                <div class="mb-3">
                                                    <label for="recomendaciones" class="form-label">
                                                        Recomendaciones
                                                    </label>
                                                    <textarea class="form-control" id="recomendaciones" name="recomendaciones" 
                                                            rows="4" placeholder="Recomendaciones para el manejo, apoyos, adaptaciones, etc."></textarea>
                                                    <div class="invalid-feedback" id="recomendacionesError"></div>
                                                    <small class="form-text text-muted">Sugerencias para el beneficiario, familia o institución.</small>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Botones -->
                                        <div class="row mt-4">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="button" class="btn btn-secondary" id="limpiarFormularioDiscapacidad">
                                                        <i class="fas fa-times me-1"></i> Limpiar
                                                    </button>
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save me-1"></i> Guardar Diagnóstico de Discapacidad
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
    <script src="<?= BASE_URL ?>/dist/js/modulos/diagnosticos/discapacidad/crear_diagnostico.js"></script>
    
                                                                
</body>
</html>