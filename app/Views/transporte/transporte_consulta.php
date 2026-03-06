<?php
$titulo = "Consultar Inventario Mobiliario";
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
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Módulo de Transporte</h1>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">Gestión de Transporte</h6>
                                    <i id="btn-ayuda" class="fa fa-question-circle fa-lg text-primary" data-toggle="tooltip" title="Ayuda" style="cursor: pointer;"></i>
                                </div>
                                <div class="card-body">
                                    <!-- Tabs de navegación -->
                                    <ul class="nav nav-tabs" id="transporteTab" role="tablist">
                                        <li class="nav-item">
                                            <a class="nav-link active" id="inicio-tab" data-bs-toggle="tab" data-bs-target="#inicio" href="#inicio" role="tab">
                                                <i class="fa-solid fa-car me-1"></i> Inicio
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="vehiculos-tab" data-bs-toggle="tab" data-bs-target="#vehiculos" href="#vehiculos" role="tab">
                                                <i class="fa-solid fa-car me-1"></i> Vehículos
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="proveedores-tab" data-bs-toggle="tab" data-bs-target="#proveedores" href="#proveedores" role="tab">
                                                <i class="fa-solid fa-user me-1"></i> Proveedores
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="rutas-tab" data-bs-toggle="tab" data-bs-target="#rutas" href="#rutas" role="tab">
                                                <i class="fa-solid fa-route me-1"></i> Rutas
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="asignar_recursos-tab" data-bs-toggle="tab" data-bs-target="#asignar_recursos" href="#asignar_recursos" role="tab">
                                                <i class="fa-solid fa-user-check me-1"></i> Asignar Recursos
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="repuestos-tab" data-bs-toggle="tab" data-bs-target="#repuestos" href="#repuestos" role="tab">
                                                <i class="fa-solid fa-tools me-1"></i> Repuestos
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="mantenimientos-tab" data-bs-toggle="tab" data-bs-target="#mantenimientos" href="#mantenimientos" role="tab">
                                                <i class="fa-solid fa-wrench me-1"></i> Mantenimientos
                                            </a>
                                        </li>
                                    </ul>

                                    <div class="tab-content" id="transporteTabContent">
                                        <!-- ==================== TAB INICIO ==================== -->
                                        <div class="tab-pane fade show active" id="inicio" role="tabpanel">
                                            <div id="inicio-tab-content" class="row mt-4">
                                                <!-- Total Vehículos -->
                                                <div class="col-xl-3 col-md-6 mb-4">
                                                    <div class="card border-left-primary shadow h-100 py-2">
                                                        <div class="card-body">
                                                            <div class="row no-gutters align-items-center">
                                                                <div class="col mr-2">
                                                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                        Total Vehículos</div>
                                                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="card_count_vehiculos">0</div>
                                                                </div>
                                                                <div class="col-auto">
                                                                    <i class="fas fa-car fa-2x text-gray-300"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Rutas Activas -->
                                                <div class="col-xl-3 col-md-6 mb-4">
                                                    <div class="card border-left-success shadow h-100 py-2">
                                                        <div class="card-body">
                                                            <div class="row no-gutters align-items-center">
                                                                <div class="col mr-2">
                                                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                        Rutas Activas</div>
                                                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="card_count_rutas">0</div>
                                                                </div>
                                                                <div class="col-auto">
                                                                    <i class="fas fa-route fa-2x text-gray-300"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- En Mantenimiento -->
                                                <div class="col-xl-3 col-md-6 mb-4">
                                                    <div class="card border-left-warning shadow h-100 py-2">
                                                        <div class="card-body">
                                                            <div class="row no-gutters align-items-center">
                                                                <div class="col mr-2">
                                                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                                        En Mantenimiento</div>
                                                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="card_count_mantenimiento">0</div>
                                                                </div>
                                                                <div class="col-auto">
                                                                    <i class="fas fa-wrench fa-2x text-gray-300"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Repuestos Bajo Stock -->
                                                <div class="col-xl-3 col-md-6 mb-4">
                                                    <div class="card border-left-danger shadow h-100 py-2">
                                                        <div class="card-body">
                                                            <div class="row no-gutters align-items-center">
                                                                <div class="col mr-2">
                                                                    <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                                                        Repuestos con poco stock</div>
                                                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="card_count_repuestos">0</div>
                                                                </div>
                                                                <div class="col-auto">
                                                                    <i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <!-- Calendario de Asignaciones -->
                                                <div id="calendario-tab-content" class="col-lg-8 mb-4">
                                                    <div class="card shadow border-0">
                                                        <div class="card-header py-3 bg-white border-bottom-primary">
                                                            <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-calendar-alt me-2"></i> Calendario de Rutas y Asignaciones</h6>
                                                        </div>
                                                        <div class="card-body">
                                                            <div id="calendario_transporte">
                                                                <!-- Aquí se renderizará FullCalendar -->

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Accesos Rápidos -->
                                                <div id="accesos-tab-content" class="col-lg-4 mb-4">
                                                    <div class="card shadow border-0">
                                                        <div class="card-header py-3 bg-white border-bottom-primary">
                                                            <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-bolt me-2"></i> Accesos Rápidos</h6>
                                                        </div>
                                                        <div class="card-body">
                                                            <button class="btn btn-outline-primary btn-block mb-3 text-start" onclick="cambiarTabTransporte('asignar_recursos')">
                                                                <i class="fas fa-user-check fa-fw me-2"></i> Nueva Asignación a Ruta
                                                            </button>
                                                            <button class="btn btn-outline-success btn-block mb-3 text-start" onclick="cambiarTabTransporte('vehiculos')">
                                                                <i class="fas fa-car fa-fw me-2"></i> Registrar Vehículo
                                                            </button>
                                                            <button class="btn btn-outline-warning btn-block mb-3 text-start" onclick="cambiarTabTransporte('mantenimientos')">
                                                                <i class="fas fa-wrench fa-fw me-2"></i> Registrar Mantenimiento
                                                            </button>
                                                            <button class="btn btn-outline-info btn-block mb-3 text-start" onclick="cambiarTabTransporte('repuestos')">
                                                                <i class="fas fa-boxes fa-fw me-2"></i> Entrada de Repuestos
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- ==================== TAB VEHICULOS ==================== -->
                                        <div class="tab-pane fade" id="vehiculos" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_vehiculos" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr id="trVehiculos">
                                                            <th>Modelo</th>
                                                            <th>Placa</th>
                                                            <th>Tipo</th>
                                                            <th>Fecha de Adquisición</th>
                                                            <th>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--dinamicamente con ajax-->
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- ==================== TAB PROVEEDORES ==================== -->
                                        <div class="tab-pane fade" id="proveedores" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_proveedores" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr id="trProveedores">
                                                            <th>Documento</th>
                                                            <th>Nombre</th>
                                                            <th>Teléfono</th>
                                                            <th>Correo</th>
                                                            <th>Dirección</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--Dinamicamente con ajax-->
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- ==================== TAB RUTAS ==================== -->
                                        <div class="tab-pane fade" id="rutas" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_rutas" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr id="trRutas">
                                                            <th>Nombre</th>
                                                            <th>Tipo de Ruta</th>
                                                            <th>Punto de partida</th>
                                                            <th>Punto de Destino</th>
                                                            <th>Horario de Salida</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--Dinamicamente con ajax-->
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- ==================== TAB ASIGNAR RECURSOS ==================== -->
                                        <div class="tab-pane fade" id="asignar_recursos" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_asignar_recursos" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr id="trAsignarRecursos">
                                                            <th>Ruta</th>
                                                            <th>Fecha</th>
                                                            <th>Vehículo</th>
                                                            <th>Chofer</th>
                                                            <th>Estatus</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--Dinamicamente con ajax-->
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- ==================== TAB REPUESTOS ==================== -->
                                        <div class="tab-pane fade" id="repuestos" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_repuestos" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr id="trRepuestos">
                                                            <th>Repuesto</th>
                                                            <th>Nombre</th>
                                                            <th>Descripción</th>
                                                            <th>Cantidad</th>
                                                            <th>Proveedor</th>
                                                            <th>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--Dinamicamente con ajax-->
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- ==================== TAB MANTENIMIENTOS ==================== -->
                                        <div class="tab-pane fade" id="mantenimientos" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_historial_mantenimientos" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr id="trMantenimientos">
                                                            <th>Mantenimiento</th>
                                                            <th>Vehículo</th>
                                                            <th>Placa</th>
                                                            <th>Fecha</th>
                                                            <th>Descripción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--Dinamicamente con ajax-->
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
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
        </div>
        <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

    <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
    <script>
        const BASE_URL = '<?= BASE_URL ?>';
    </script>
    <script src="<?= BASE_URL ?>dist/js/modulos/transporte/consultar_general.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/transporte/estadisticas_transporte.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/transporte/driver_general.js"></script>


    <!-- Modal Genérico -->
    <div class="modal fade" id="modalGenerico" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalGenericoTitle"></h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modalContenido">
                    <!-- Contenido dinámico aquí -->
                </div>
            </div>
        </div>
    </div>

    <!-- Script para persistencia de la Tab Activa -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const transporteTab = document.getElementById('transporteTab');
            if (transporteTab) {
                // Restaurar la última tab activa
                const activeTabId = localStorage.getItem('transporteActiveTab');
                if (activeTabId) {
                    const triggerEl = document.querySelector(`a[data-bs-target="${activeTabId}"]`);
                    if (triggerEl) {
                        if (window.bootstrap && bootstrap.Tab) {
                            const tab = new bootstrap.Tab(triggerEl);
                            tab.show();
                        } else if (typeof $ !== 'undefined') {
                            $(triggerEl).tab('show');
                        }
                    }
                }

                // Guardar la tab activa cuando cambie
                transporteTab.addEventListener('shown.bs.tab', function(event) {
                    const target = event.target.getAttribute('data-bs-target');
                    localStorage.setItem('transporteActiveTab', target);
                });
            }

            var calendario = document.getElementById('calendario_transporte');
            var calendar = new FullCalendar.Calendar(calendario, {
                initialView: 'dayGridMonth',
                locale: 'es',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }
            });
            calendar.render();
        });
    </script>
</body>

</html>