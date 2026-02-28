<?php 
$titulo = "Configuración";
include 'app/Views/template/head.php';
?>

<body id="page-top">
    <div id="wrapper">
        <?php include 'app/Views/template/sidebar.php'; ?>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <?php include 'app/Views/template/header.php'; ?>

                <div class="container-fluid">
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Consultar Configuración</h1>
                    </div>

                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <ul class="nav nav-tabs card-header-tabs" id="tsTabs" role="tablist">
                                <li class="nav-item">
                                    <button class="nav-link active" id="patologias-tab" data-bs-toggle="tab" data-bs-target="#patologias" type="button" role="tab" onclick="cargarTabla('patologia')">
                                        <i class="fas fa-heartbeat me-2 text-danger"></i>Patologías
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="pnf-tab" data-bs-toggle="tab" data-bs-target="#pnf" type="button" role="tab" onclick="cargarTabla('pnf')">
                                        <i class="fas fa-graduation-cap me-2 text-primary"></i>PNF
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="servicios-tab" data-bs-toggle="tab" data-bs-target="#servicios" type="button" role="tab" onclick="cargarTabla('servicio')">
                                        <i class="fas fa-concierge-bell me-2 text-info"></i>Servicios
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="tipo_empleados-tab" data-bs-toggle="tab" data-bs-target="#tipo_empleados" type="button" role="tab" onclick="cargarTabla('tipo_empleado')">
                                        <i class="fas fa-user-tie me-2 text-warning"></i>Tipo de Empleados
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="tipo_mobiliarios-tab" data-bs-toggle="tab" data-bs-target="#tipo_mobiliarios" type="button" role="tab" onclick="cargarTabla('tipo_mobiliario')">
                                        <i class="fas fa-chair me-2 text-secondary"></i>Tipo de Mobiliarios
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="tipo_equipos-tab" data-bs-toggle="tab" data-bs-target="#tipo_equipos" type="button" role="tab" onclick="cargarTabla('tipo_equipo')">
                                        <i class="fas fa-laptop me-2 text-dark"></i>Tipo de Equipos
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="presentacion_insumos-tab" data-bs-toggle="tab" data-bs-target="#presentacion_insumos" type="button" role="tab" onclick="cargarTabla('presentacion_insumo')">
                                        <i class="fas fa-pills me-2 text-success"></i>Presentación de Insumos
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div class="card-body">
                            <div class="tab-content" id="ConfigTabsContent">
                                <!-- Tabla General (Se reconstruye dinámicamente) -->
                                <div class="table-responsive">
                                    <table id="tabla_config" class="table table-bordered table-striped" width="100%" cellspacing="0">
                                        <thead>
                                            <!-- Se llena dinámicamente -->
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Global para reutilizar -->
            <div class="modal fade" id="modalConfig" tabindex="-1" aria-labelledby="modalConfigLabel" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content border-0 shadow-lg">
                        <!-- Header dinámico -->
                        <div class="modal-header bg-gradient-primary text-white py-3">
                            <div class="d-flex align-items-center">
                                <div class="modal-icon bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                                    <i class="fas fa-cog text-primary"></i>
                                </div>
                                <div>
                                    <h5 class="modal-title mb-0 fw-bold" id="modalConfigTitle">Título</h5>
                                    <small class="opacity-75" id="modalConfigSubtitle"></small>
                                </div>
                            </div>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>

                        <!-- Body dinámico -->
                        <div class="modal-body p-0">
                            <!-- Contenido se cargará aquí via JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
            
            <?php include 'app/Views/template/footer.php'; ?>
        </div>
    </div>

    <?php include 'app/Views/template/script.php'; ?>
    <script src="<?= BASE_URL ?>dist/js/modulos/configuracion/config_consultar_gen.js"></script>
</body>
</html>