<?php
$titulo = "DIRPOLES 4 | Ayuda";
include BASE_PATH . '/app/Views/template/head.php';
?>
<link rel="stylesheet" href="<?= BASE_URL ?>dist/css/ayuda/ayuda.css">

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

                        <!-- INICIO DE SESIÓN -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="login sesion acceso contraseña correo dashboard calendario">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-primary">
                                        <i class="fas fa-sign-in-alt"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Inicio de Sesión</h5>
                                    <p class="text-muted small">Acceso al sistema y panel principal.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="login_acceso">
                                            <span>¿Cómo iniciar sesión en el sistema?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="login_dashboard">
                                            <span>¿Qué es el Calendario de Actividades?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- EMPLEADOS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="empleados personal nomina registro crear editar eliminar rol">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-success">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Empleados</h5>
                                    <p class="text-muted small">Gestión del personal de la institución.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="empleados_crear">
                                            <span>¿Cómo registrar un nuevo empleado?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="empleados_consultar">
                                            <span>¿Cómo consultar, editar o eliminar empleados?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- BENEFICIARIOS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="beneficiarios estudiantes cedula pnf registro ficha">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-info">
                                        <i class="fas fa-person-circle-plus"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Beneficiarios</h5>
                                    <p class="text-muted small">Registro y seguimiento de estudiantes atendidos.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="beneficiarios_crear">
                                            <span>¿Cómo registrar un nuevo beneficiario?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="beneficiarios_consultar">
                                            <span>¿Cómo consultar, editar o eliminar beneficiarios?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- CITAS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="citas calendario agenda psicologo horario agendar">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-warning">
                                        <i class="fas fa-calendar-check"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Citas</h5>
                                    <p class="text-muted small">Agenda y programación de atenciones.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="citas_crear">
                                            <span>¿Cómo agendar una nueva cita?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="citas_consultar">
                                            <span>¿Cómo consultar o modificar citas?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- DIAGNÓSTICOS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="diagnostico psicologia medicina orientacion trabajo social discapacidad constancia recipe">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-danger">
                                        <i class="fas fa-file-medical"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Diagnósticos</h5>
                                    <p class="text-muted small">Especialidades médicas y sociales.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="diagnosticos_general">
                                            <span>¿Cómo registrar un diagnóstico?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="diagnosticos_psicologia">
                                            <span>Atención en Psicología</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="diagnosticos_medicina">
                                            <span>Consulta de Medicina General</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="diagnosticos_orientacion">
                                            <span>Registro en Orientación</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="diagnosticos_trabajo_social">
                                            <span>Diagnóstico de Trabajo Social</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="diagnosticos_discapacidad">
                                            <span>Evaluación en Discapacidad</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- INVENTARIO MÉDICO -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="inventario medico insumos medicamentos stock farmacia entrada salida">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-secondary">
                                        <i class="fas fa-boxes"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Inventario Médico</h5>
                                    <p class="text-muted small">Control de insumos y medicamentos.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="inventario_crear">
                                            <span>¿Cómo registrar nuevos insumos?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="inventario_entradas_salidas">
                                            <span>¿Cómo registrar entradas y salidas de stock?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- TRANSPORTE -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="transporte vehiculo ruta proveedor repuestos mantenimiento flota conductor">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-primary">
                                        <i class="fas fa-bus"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Transporte</h5>
                                    <p class="text-muted small">Logística y gestión de flota vehicular.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="transporte_vehiculos">
                                            <span>¿Cómo gestionar vehículos?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="transporte_rutas">
                                            <span>¿Cómo gestionar rutas y horarios?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="transporte_proveedores">
                                            <span>¿Cómo gestionar proveedores?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="transporte_repuestos">
                                            <span>¿Cómo controlar el inventario de repuestos?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="transporte_mantenimiento">
                                            <span>¿Cómo registrar mantenimientos?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- MOBILIARIO Y EQUIPOS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="mobiliario equipos sillas mesas ficha tecnica activos">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-success">
                                        <i class="fas fa-chair"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Mobiliario y Equipos</h5>
                                    <p class="text-muted small">Censo y estado de activos fijos.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="mobiliario_crear">
                                            <span>¿Cómo registrar mobiliario o equipos?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="mobiliario_ficha">
                                            <span>¿Cómo asignar una Ficha Técnica?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="mobiliario_consultar">
                                            <span>¿Cómo consultar el inventario?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- JORNADAS -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="jornadas eventos especiales atencion masiva operativos">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-info">
                                        <i class="fas fa-calendar-day"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Jornadas</h5>
                                    <p class="text-muted small">Eventos especiales y atención masiva.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="jornadas_crear">
                                            <span>¿Cómo crear y gestionar jornadas?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- REFERENCIAS SOCIALES -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="referencias sociales derivacion canalizar instituciones">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-warning">
                                        <i class="fas fa-share-alt"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Referencias Sociales</h5>
                                    <p class="text-muted small">Derivación a instituciones o departamentos.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="referencias_crear">
                                            <span>¿Cómo gestionar referencias sociales?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- REPORTES -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="reportes graficos estadisticas filtros general area">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-danger">
                                        <i class="fas fa-chart-pie"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Reportes</h5>
                                    <p class="text-muted small">Análisis de datos y resultados estadísticos.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="reportes_general">
                                            <span>¿Cómo generar un reporte general?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="reportes_area">
                                            <span>¿Cómo generar un reporte por área?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- EXPORTACIÓN -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="exportar excel pdf descargar archivo documento">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-success">
                                        <i class="fas fa-file-download"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Exportación de Datos</h5>
                                    <p class="text-muted small">Descarga de información en Excel y PDF.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="exportar_datos">
                                            <span>¿Cómo exportar reportes a Excel o PDF?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- SEGURIDAD Y CONFIGURACIÓN -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="seguridad configuracion bitacora permisos auditoria historial">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-dark">
                                        <i class="fas fa-shield-alt"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Seguridad</h5>
                                    <p class="text-muted small">Configuración, permisos y auditoría.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="seguridad_configuracion">
                                            <span>¿Cómo gestionar la configuración?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                        <li class="faq-item open-guide" data-guide="seguridad_bitacora">
                                            <span>¿Cómo revisar la bitácora?</span>
                                            <i class="fas fa-chevron-right fa-sm text-gray-400"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- SOPORTE TÉCNICO -->
                        <div class="col-xl-4 col-md-6 mb-4 help-topic-item" data-keywords="soporte tecnico error problema contacto correo ayuda">
                            <div class="card topic-card">
                                <div class="card-body">
                                    <div class="topic-icon-container bg-soft-secondary">
                                        <i class="fas fa-headset"></i>
                                    </div>
                                    <h5 class="font-weight-bold text-gray-800">Soporte Técnico</h5>
                                    <p class="text-muted small">Contacto para asistencia y reportar errores.</p>
                                    <ul class="faq-list">
                                        <li class="faq-item open-guide" data-guide="soporte_tecnico">
                                            <span>¿Cómo obtener soporte técnico?</span>
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

    <!-- Modal para Guías Textuales -->
    <div class="modal fade" id="modalGuia" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 1rem;">
                <div class="modal-header guide-modal-header">
                    <div>
                        <nav class="guide-breadcrumb" id="guiaBreadcrumb">
                            <span class="breadcrumb-base">Ayuda</span>
                            <i class="fas fa-chevron-right fa-xs mx-1"></i>
                            <span id="guiaCategory">Categoría</span>
                        </nav>
                        <h5 class="modal-title font-weight-bold" id="guiaTitle">Guía</h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body guide-modal-body" id="guiaContent">
                    <!-- Contenido dinámico inyectado por JS -->
                </div>
                <div class="modal-footer border-0 bg-white">
                    <button type="button" class="btn btn-light font-weight-bold px-4" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary font-weight-bold px-4" id="btnDescargarManual">
                        <i class="fas fa-book me-1"></i> Manual Completo
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const BASE_URL = "<?= BASE_URL ?>";
    </script>
    <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
    <script src="<?= BASE_URL ?>dist/js/modulos/ayuda/ayuda-data.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/ayuda/ayuda.js"></script>
</body>

</html>