<?php
$titulo = "DIRPOLES 4 | Ayuda";
include BASE_PATH . '/app/Views/template/head.php';
?>

<style>
    /* Estilos Facebook Help Center */
    .help-hero {
        background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
        padding: 4rem 1rem;
        text-align: center;
        color: white;
        border-radius: 0 0 2rem 2rem;
        margin-bottom: -3rem;
        position: relative;
        z-index: 1;
    }

    .help-search-container {
        max-width: 600px;
        margin: 1.5rem auto 0;
        position: relative;
    }

    .help-search-input {
        height: 55px;
        border-radius: 30px;
        padding-left: 50px;
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-size: 1.1rem;
    }

    .search-icon {
        position: absolute;
        left: 20px;
        top: 17px;
        color: #6c757d;
        font-size: 1.2rem;
    }

    .topic-card {
        border: none;
        border-radius: 1rem;
        transition: all 0.3s ease;
        cursor: pointer;
        height: 100%;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .topic-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .topic-icon-container {
        width: 60px;
        height: 60px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.2rem;
        font-size: 1.8rem;
    }

    .bg-soft-primary {
        background-color: #e3f2fd;
        color: #1976d2;
    }

    .bg-soft-success {
        background-color: #e8f5e9;
        color: #2e7d32;
    }

    .bg-soft-info {
        background-color: #e0f7fa;
        color: #00838f;
    }

    .bg-soft-warning {
        background-color: #fff3e0;
        color: #ef6c00;
    }

    .bg-soft-danger {
        background-color: #ffebee;
        color: #c62828;
    }

    .bg-soft-secondary {
        background-color: #f5f5f5;
        color: #616161;
    }

    .faq-list {
        list-style: none;
        padding: 0;
        margin-top: 1rem;
    }

    .faq-item {
        padding: 0.8rem 0;
        border-bottom: 1px solid #f1f3f9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #4e73df;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.2s;
    }

    .faq-item:hover {
        color: #2e59d9;
        text-decoration: underline;
    }

    .faq-item:last-child {
        border-bottom: none;
    }

    /* Modal Image adjustment */
    .img-guide {
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: none;
    }

    .maintenance-msg {
        display: none;
        padding: 3rem;
        text-align: center;
        color: #d32f2f;
    }
</style>

<body id="page-top">
    <div id="wrapper">
        <?php include BASE_PATH . '/app/Views/template/sidebar.php'; ?>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <?php include BASE_PATH . '/app/Views/template/header.php'; ?>

                <!-- Hero Section -->
                <div class="help-hero">
                    <div class="container">
                        <h2 class="font-weight-bold">Hola, <?= htmlspecialchars($nombre_usuario) ?>. 👋</h2>
                        <h4 class="mb-4">¿En qué podemos ayudarte hoy?</h4>
                        <div class="help-search-container">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" id="helpSearch" class="form-control help-search-input" placeholder="Busca un módulo o pregunta específica...">
                        </div>
                    </div>
                </div>

                <div class="container-fluid" style="margin-top: 5rem;">
                    <div class="row" id="helpTopics">

                        <!-- EMPLEADOS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="empleados personal nomina registro">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-primary">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Empleados</h5>
                                    <p class="text-muted small">Gestión del personal de la institución.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Crear Empleado" data-img="empleados_crear.jpg">
                                            <span>¿Cómo registrar un nuevo empleado?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Consultar Empleados" data-img="empleados_lista.jpg">
                                            <span>¿Cómo filtrar la lista de personal?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- BENEFICIARIOS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="beneficiarios personas registro adultos">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-success">
                                        <i class="fas fa-person-circle-plus"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Beneficiarios</h5>
                                    <p class="text-muted small">Registro y seguimiento de personas atendidas.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Crear Beneficiario" data-img="beneficiarios_crear.jpg">
                                            <span>¿Cómo crear un beneficiario?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Ficha Social" data-img="beneficiarios_ficha.jpg">
                                            <span>¿Cómo ver la ficha social?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- CITAS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="citas calendario agenda medico">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-info">
                                        <i class="fas fa-calendar-check"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Citas</h5>
                                    <p class="text-muted small">Agenda y programación de atenciones.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Agendar Cita" data-img="citas_agendar.jpg">
                                            <span>¿Cómo agendar una nueva cita?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Calendario" data-img="citas_calendario.jpg">
                                            <span>¿Cómo usar el calendario?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- DIAGNOSTICOS GROUP -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="diagnostico psicologia medicina orientacion trabajador social discapacidad">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-warning">
                                        <i class="fas fa-file-medical"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Diagnósticos</h5>
                                    <p class="text-muted small">Especialidades médicas y sociales.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Diagnóstico Psicología" data-img="diag_psico.jpg">
                                            <span>Atención en Psicología</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Diagnóstico Medicina" data-img="diag_med.jpg">
                                            <span>Consulta Medicina General</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Otras Especialidades" data-img="diag_otros.jpg">
                                            <span>Orientación / Trabajador Social</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- INVENTARIO MEDICO -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="insumos medico farmacia stock">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-danger">
                                        <i class="fas fa-boxes"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Inventario Médico</h5>
                                    <p class="text-muted small">Control de insumos y medicamentos.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Cargar Insumos" data-img="inv_carga.jpg">
                                            <span>¿Cómo cargar stock de insumos?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Consultar Stock" data-img="inv_stock.jpg">
                                            <span>¿Cómo ver el stock actual?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- TRANSPORTE -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="transporte vehiculo ruta proveedor">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-primary">
                                        <i class="fas fa-car"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Transporte</h5>
                                    <p class="text-muted small">Logística y gestión de flota.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Crear Proveedor" data-img="transp_prov.jpg">
                                            <span>¿Cómo crear un proveedor?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Rutas y Horarios" data-img="transp_rutas.jpg">
                                            <span>¿Cómo gestionar rutas?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- MOBILIARIO -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="mobiliario sillas mesas equipos institucion">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-secondary">
                                        <i class="fas fa-chair"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Mobiliario</h5>
                                    <p class="text-muted small">Censo y estado de activos fijos.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Registrar Mobiliario" data-img="mob_crear.jpg">
                                            <span>¿Cómo registrar mobiliario?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Consultar Estado" data-img="mob_lista.jpg">
                                            <span>¿Cómo ver estado del equipo?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- REPORTES -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="reportes graficos estadisticas pdf">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-info">
                                        <i class="fas fa-chart-pie"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Reportes</h5>
                                    <p class="text-muted small">Análisis de datos y resultados.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Filtros Reportes" data-img="rep_filtros.jpg">
                                            <span>¿Cómo aplicar filtros?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Tipos de Gráfico" data-img="rep_charts.jpg">
                                            <span>¿Cómo cambiar de barras a dona?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- CONFIGURACION Y SEGURIDAD -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="configuracion bitacora permisos seguridad">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-dark">
                                        <i class="fas fa-shield-alt text-dark"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Seguridad</h5>
                                    <p class="text-muted small">Permisos y auditoría del sistema.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-title="Bitácora" data-img="seg_bitacora.jpg">
                                            <span>¿Cómo revisar la bitácora?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-title="Permisos" data-img="seg_permisos.jpg">
                                            <span>Asignar permisos a módulos</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
        </div>
    </div>

    <!-- Modal para Guías Visuales -->
    <div class="modal fade" id="modalGuia" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 1rem;">
                <div class="modal-header bg-white border-0 py-3">
                    <h5 class="modal-title font-weight-bold text-primary" id="guiaTitle">Guía Visual</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center bg-light p-0" style="min-height: 200px; display: flex; align-items: center; justify-content: center;">
                    <div id="guiaLoader" class="py-5">
                        <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
                        <p class="mt-2 text-muted">Cargando guía...</p>
                    </div>

                    <!-- Mensaje Mantenimiento -->
                    <div id="guiaMantenimiento" class="maintenance-msg">
                        <i class="fas fa-tools fa-4x mb-3 text-danger"></i>
                        <h4 class="font-weight-bold">Guía en Mantenimiento</h4>
                        <p class="text-muted">Estamos preparando esta sección para ti. <br> Intenta nuevamente más tarde.</p>
                    </div>

                    <img src="" id="guiaImg" class="img-guide" alt="Guía de ayuda">
                </div>
                <div class="modal-footer border-0 bg-white">
                    <button type="button" class="btn btn-light font-weight-bold px-4" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary font-weight-bold px-4" id="btnDescargarManual">Manual Completo</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const BASE_URL = "<?= BASE_URL ?>";
    </script>
    <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
    <script src="<?= BASE_URL ?>dist/js/modulos/ayuda/ayuda.js"></script>
</body>

</html>