<?php 
$titulo = "Trabajo Social";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestión de Trabajo Social</h1>

                        <!-- Contenedor para los botones -->
                        <div class="btn-group">
                            <button type="button" class="d-none d-sm-inline-block btn btn-sm btn-warning shadow-sm" data-bs-toggle="modal" data-bs-target="#modalSeleccionarExoneracion">
                                <i class="fas fa-user-injured fa-sm text-white-50 me-1"></i> Registrar Estudio Socio-Económico
                            </button>

                            <a href="<?= BASE_URL ?>diagnostico_trabajo_social_consultar" 
                            class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm ms-2">
                                <i class="fas fa-clipboard-list fa-sm text-white-50 me-1"></i> Consultar Diagnósticos
                            </a>
                        </div>
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

                    <!-- Fila 1: Becas y Exoneración -->
                    <div class="row">
                        <!-- Columna 1: Becas -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-success">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-success">
                                        <i class="fas fa-graduation-cap me-2"></i>Registro de Becas
                                    </h6>
                                    <span class="badge bg-success">Ayuda Económica</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>becas_registrar" method="POST" id="form-becas" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <input type="hidden" name="id_beneficiario" class="id_beneficiario_hidden">
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">
                                        
                                        <div class="row">
                                            <!-- Tipo de Banco -->
                                            <div class="col-md-6 mb-3">
                                                <label for="tipo_banco" class="form-label">
                                                    Tipo de Banco <span class="text-danger">*</span>
                                                </label>
                                                <select name="tipo_banco" id="tipo_banco" class="form-select select2">
                                                    <option value="" selected disabled>Seleccione tipo de banco</option>
                                                    <option value="0102">BANCO DE VENEZUELA</option>
                                                    <option value="0156">100% BANCO</option>
                                                    <option value="0172">BANCAMIGA BANCO MICROFINANCIERO C.A</option>
                                                    <option value="0114">BANCARIBE</option>
                                                    <option value="0171">BANCO ACTIVO</option>
                                                    <option value="0166">BANCO AGRICOLA DE VENEZUELA</option>
                                                    <option value="0175">BANCO DIGITAL DE LOS TRABAJADORES</option>
                                                    <option value="0128">BANCO CARONI</option>
                                                    <option value="0163">BANCO DEL TESORO</option>
                                                    <option value="0115">BANCO EXTERIOR</option>
                                                    <option value="0151">BANCO FONDO COMUN</option>
                                                    <option value="0173">BANCO INTERNACIONAL DE DESARROLLO</option>
                                                    <option value="0105">BANCO MERCANTIL</option>
                                                    <option value="0191">BANCO NACIONAL DE CREDITO</option>
                                                    <option value="0138">BANCO PLAZA</option>
                                                    <option value="0137">BANCO SOFITASA</option>
                                                    <option value="0104">BANCO VENEZOLANO DE CREDITO</option>
                                                    <option value="0168">BANCRECER</option>
                                                    <option value="0134">BANESCO</option>
                                                    <option value="0177">BANFANB</option>
                                                    <option value="0146">BANGENTE</option>
                                                    <option value="0174">BANPLUS</option>
                                                    <option value="0108">BBVA PROVINCIAL</option>
                                                    <option value="0157">DELSUR BANCO UNIVERSAL</option>
                                                    <option value="0169">MI BANCO</option>
                                                    <option value="0178">N58 BANCO DIGITAL BANCO MICROFINANCIERO S.A</option>
                                                </select>
                                                <div class="invalid-feedback" id="tipo_bancoError"></div>
                                                <small class="form-text text-muted">
                                                    Tipo de cuenta bancaria
                                                </small>
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <label for="cta_bcv" class="form-label">
                                                    Cuenta BCV <span class="text-danger">*</span>
                                                </label>
                                                <input type="text" class="form-control" id="cta_bcv" name="cta_bcv" 
                                                    placeholder="Ej: 12345678901234567890" maxlength="16">
                                                <div class="invalid-feedback" id="cta_bcvError"></div>
                                                <small class="form-text text-muted">
                                                    Número de cuenta bancaria (16 dígitos)
                                                </small>
                                            </div>
                                            
                                            <!-- Dirección PDF -->
                                            <div class="col-12 mb-3">
                                                <label for="planilla" class="form-label">
                                                    Planilla de Inscripción <span class="text-danger">*</span>
                                                </label>
                                                <input type="file" class="form-control" id="planilla" name="planilla" 
                                                    placeholder="Ruta del archivo PDF subido..." maxlength="100">
                                                <div class="invalid-feedback" id="planillaError"></div>
                                                <small class="form-text text-muted">
                                                    Archivo subido al sistema en formato PDF
                                                </small>
                                            </div>
                                        </div>
                                        
                                        <!-- Botones -->
                                        <div class="text-end mt-auto pt-3">
                                            <button type="button" class="btn btn-outline-secondary" id="btnLimpiarFormularioBecas">
                                                <i class="fas fa-times me-1"></i> Limpiar
                                            </button>
                                            <button type="submit" class="btn btn-success">
                                                <i class="fas fa-graduation-cap me-1"></i> Registrar Beca
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Columna 2: Exoneración -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-warning">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-warning">
                                        <i class="fas fa-file-contract me-2"></i>Registro de Exoneración
                                    </h6>
                                    <span class="badge bg-warning">Beneficio Estatal</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>exoneracion_registrar" method="POST" id="form-exoneracion" 
                                        class="needs-validation d-flex flex-column h-100" novalidate>
                                        <input type="hidden" name="id_beneficiario" class="id_beneficiario_hidden">
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">

                                        <div class="row">
                                            <!-- Motivo -->
                                            <div class="col-md-6 mb-3">
                                                <label for="motivo" class="form-label">
                                                    Motivo <span class="text-danger">*</span>
                                                </label>
                                                <select name="motivo" id="motivo" class="form-select" required>
                                                    <option value="" selected disabled>Seleccione motivo</option>
                                                    <option value="Inscripción">Inscripción</option>
                                                    <option value="Paquete de Grado">Paquete de Grado</option>
                                                    <option value="Otro">Otro</option>
                                                </select>
                                                <div class="invalid-feedback" id="motivoError"></div>
                                                <small class="form-text text-muted">
                                                    Motivo de la inscripción
                                                </small>
                                            </div>

                                            <!-- Carnet de Discapacidad -->
                                            <div class="col-md-6 mb-3">
                                                <label for="carnet_discapacidad" class="form-label">
                                                    Carnet Discapacidad
                                                </label>
                                                <input type="text" class="form-control" id="carnet_discapacidad" name="carnet_discapacidad"
                                                    placeholder="Ej: D-0000000000" required>
                                                <div class="invalid-feedback" id="carnet_discapacidadError"></div>
                                                <small class="form-text text-muted">
                                                    Carnet de discapacidad
                                                </small>
                                            </div>
                                        </div>

                                        <div class="row" style="display: none;">
                                            <div class="col-md-12 mb-3">
                                                <label for="otro_motivo" class="form-label">
                                                    Otro Motivo
                                                </label>
                                                <textarea name="otro_motivo" id="otro_motivo" class="form-control"></textarea>
                                                <div class="invalid-feedback" id="otro_motivoError"></div>
                                                <small class="form-text text-muted">
                                                    Otro motivo de la inscripción
                                                </small>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Carta -->
                                            <div class="col-md-12 mb-3">
                                                <label for="carta" class="form-label">
                                                    Carta <span class="text-danger">*</span>
                                                </label>
                                                <input type="file" class="form-control" id="carta" name="carta"
                                                    accept="application/pdf" required>
                                                <div class="invalid-feedback" id="cartaError"></div>
                                                <small class="form-text text-muted">
                                                    Carta para la exoneración
                                                </small>
                                            </div>
                                        </div>

                                        <!-- Botones -->
                                        <div class="text-end mt-auto pt-3">
                                            <button type="button" class="btn btn-outline-secondary" id="limpiarFormularioEx">
                                                <i class="fas fa-times me-1"></i> Limpiar
                                            </button>
                                            <button type="submit" class="btn btn-warning">
                                                <i class="fas fa-file-contract me-1"></i> Registrar Exoneración
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fila 2: FAMES y Gestión de Embarazadas -->
                    <div class="row">
                        <!-- Columna 1: FAMES -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-info">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-info">
                                        <i class="fas fa-hand-holding-heart me-2"></i>Registro FAMES
                                    </h6>
                                    <span class="badge bg-info">Ayuda Alimentaria</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>fames_registrar" method="POST" id="form-fames" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <input type="hidden" name="id_beneficiario" class="id_beneficiario_hidden">
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">
                                        
                                        <div class="row">
                                            <!-- Patología -->
                                            <div class="col-md-6 mb-3">
                                                <label for="id_detalle_patologia" class="form-label">
                                                    Patología <span class="text-danger">*</span>
                                                </label>
                                                <select name="id_patologia" id="id_patologia" class="form-select select2" required>
                                                    <option value="" selected disabled>Seleccione una patología</option>
                                                    <?php foreach ($patologias as $patologia): ?>
                                                        <option value="<?= $patologia['id_patologia'] ?>">
                                                            <?= htmlspecialchars($patologia['nombre_patologia']) ?>
                                                        </option>
                                                    <?php endforeach; ?>
                                                </select>
                                                <div class="invalid-feedback" id="id_patologiaError"></div>
                                                <small class="form-text text-muted">
                                                    Patología
                                                </small>
                                            </div>

                                            <!-- Tipo de Ayuda -->
                                            <div class="col-md-6 mb-3">
                                                <label for="tipo_ayuda" class="form-label">
                                                    Tipo de Ayuda <span class="text-danger">*</span>
                                                </label>
                                                <select name="tipo_ayuda" id="tipo_ayuda" class="form-select" required>
                                                    <option value="" selected disabled>Seleccione tipo</option>
                                                    <option value="Económica">Económica</option>
                                                    <option value="Operaciones">Operaciones</option>
                                                    <option value="Exámenes">Exámenes</option>
                                                    <option value="Otros">Otros</option>
                                                </select>
                                                <div class="invalid-feedback" id="tipo_ayudaError"></div>
                                                <small class="form-text text-muted">
                                                    Tipo de ayuda
                                                </small>
                                            </div>
                                            
                                            <!-- Otro tipo (condicional) -->
                                            <div class="col-12 mb-3" id="otro_tipo_container" style="display: none;">
                                                <label for="otro_tipo" class="form-label">
                                                    Especifique otro tipo
                                                </label>
                                                <input type="text" class="form-control" id="otro_tipo" name="otro_tipo" 
                                                    placeholder="Describa el tipo de ayuda..." maxlength="100">
                                                <div class="invalid-feedback" id="otro_tipoError"></div>
                                                <small class="form-text text-muted">
                                                    Otro tipo de ayuda
                                                </small>
                                            </div>
                                        </div>
                                        
                                        <!-- Botones -->
                                        <div class="text-end mt-auto pt-3">
                                            <button type="button" class="btn btn-outline-secondary" id="btnLimpiarFormularioFames">
                                                <i class="fas fa-times me-1"></i> Limpiar
                                            </button>
                                            <button type="submit" class="btn btn-info">
                                                <i class="fas fa-hand-holding-heart me-1"></i> Registrar FAMES
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Columna 2: Gestión de Embarazadas -->
                        <div class="col-lg-6 mb-4">
                            <div class="card shadow h-100 border-left-primary">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-baby me-2"></i>Gestión de Embarazadas
                                    </h6>
                                    <span class="badge bg-primary">Control Prenatal</span>
                                </div>
                                <div class="card-body d-flex flex-column">
                                    <form action="<?= BASE_URL ?>emb_registrar" method="POST" id="form-gestion-emb" class="needs-validation d-flex flex-column h-100" novalidate>
                                        <input type="hidden" name="id_beneficiario" class="id_beneficiario_hidden">
                                        <input type="hidden" name="id_empleado" value="<?= $_SESSION['id_empleado'] ?>">
                                        <input type="hidden" name="genero" id="genero" class="id_beneficiario_genero">
                                        
                                        <div class="row">
                                            <!-- Patología (embarazo) -->
                                            <div class="col-md-6 mb-3">
                                                <label for="id_patologia_emb" class="form-label">
                                                    Patología (Embarazo) <span class="text-danger">*</span>
                                                </label>
                                                <select name="id_patologia" id="id_patologia_emb" class="form-select select2" required>
                                                    <option value="" selected disabled>Seleccione patología de embarazo</option>
                                                    <?php foreach ($patologias as $patologia): ?>
                                                        <option value="<?= $patologia['id_patologia'] ?>">
                                                            <?= htmlspecialchars($patologia['nombre_patologia']) ?>
                                                        </option>
                                                    <?php endforeach; ?>
                                                </select>
                                                <div class="invalid-feedback" id="id_patologia_embError"></div>
                                                <small class="form-text text-muted">
                                                    Patología
                                                </small>
                                            </div>

                                            <!-- Semanas de Gestación -->
                                            <div class="col-md-6 mb-3">
                                                <label for="semanas_gest" class="form-label">
                                                    Semanas de Gestación <span class="text-danger">*</span>
                                                </label>
                                                <input type="number" class="form-control" id="semanas_gest" name="semanas_gest" 
                                                    min="1" max="45" placeholder="Ej: 28" required>
                                                <div class="invalid-feedback" id="semanas_gestError"></div>
                                                <small class="form-text text-muted">
                                                    Semanas de gestación
                                                </small>
                                            </div>
                                            
                                            <!-- Código Patria -->
                                            <div class="col-md-6 mb-3">
                                                <label for="codigo_patria" class="form-label">
                                                    Código Patria (Opcional)
                                                </label>
                                                <input type="number" class="form-control" id="codigo_patria" name="codigo_patria" 
                                                    placeholder="Código del carnet de la Patria">
                                                <div class="invalid-feedback" id="codigo_patriaError"></div>
                                                <small class="form-text text-muted">
                                                    Código del carnet de la Patria (Opcional)
                                                </small>
                                            </div>
                                            
                                            <!-- Serial Patria -->
                                            <div class="col-md-6 mb-3">
                                                <label for="serial_patria" class="form-label">
                                                    Serial Patria (Opcional)
                                                </label>
                                                <input type="number" class="form-control" id="serial_patria" name="serial_patria" 
                                                    placeholder="Serial del carnet de la Patria">
                                                <div class="invalid-feedback" id="serial_patriaError"></div>
                                                <small class="form-text text-muted">
                                                    Serial del carnet de la Patria (Opcional)
                                                </small>
                                            </div>
                                            
                                            <!-- Estado -->
                                            <div class="col-md-6 mb-3" style="display: none;">
                                                <label for="estado" class="form-label">
                                                    Estado <span class="text-danger">*</span>
                                                </label>
                                                <select name="estado" id="estado" class="form-select" required>
                                                    <option value="En Proceso" selected>En Proceso</option>
                                                    <option value="Aprobado">Aprobado</option>
                                                    <option value="Rechazado">Rechazado</option>
                                                </select>
                                                <div class="invalid-feedback" id="estadoError"></div>
                                                <small class="form-text text-muted">
                                                    Estado de la solicitud
                                                </small>
                                            </div>
                                        </div>
                                        
                                        <!-- Botones -->
                                        <div class="text-end mt-auto pt-3">
                                            <button type="button" class="btn btn-outline-secondary" id="btnLimpiarFormularioGestionEmb">
                                                <i class="fas fa-times me-1"></i> Limpiar
                                            </button>
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-baby me-1"></i> Registrar Gestión
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
            <?php include BASE_PATH . '/app/Views/diagnosticos/trabajo_social/estudio-socioe.php'; ?>

            <!-- Modal Seleccionar Exoneración Pendiente -->
            <div class="modal fade" id="modalSeleccionarExoneracion" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-white">
                            <h5 class="modal-title" id="modalLabel">
                                <i class="fas fa-tasks me-2"></i> Exoneraciones Pendientes por Estudio
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info py-2 small">
                                <i class="fas fa-info-circle me-1"></i> Seleccione una solicitud para iniciar el Estudio Socio-Económico.
                            </div>
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover text-center" id="tablaExoneracionesPendientes" width="100%">
                                    <thead class="bg-light">
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Beneficiario</th>
                                            <th>Cédula</th>
                                            <th>Motivo</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Se llena con JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- End of Content Wrapper -->

    </div>

   <?php include BASE_PATH . '/app/Views/template/script.php'; ?>

   <!-- JavaScript Modulares para Diagnóstico -->
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/exoneraciones/crear_ex.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/becas/crear_beca.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/fames/crear_fames.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/embarazadas/crear_emb.js"></script>
   <!-- JavaScript Puro -->

                                                                
</body>
</html>