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
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">Gestión de Inventario de Mobiliarios y Equipos</h6>
                                </div>
                                <div class="card-body">
                                    <!-- Tabs de navegación -->
                                    <ul class="nav nav-tabs" id="inventarioTab" role="tablist">
                                        <li class="nav-item">
                                            <a class="nav-link active" id="mobiliario-tab" data-bs-toggle="tab" data-bs-target="#mobiliario" href="#mobiliario" role="tab">
                                                <i class="fa-solid fa-chair me-1"></i> Mobiliario
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="equipos-tab" data-bs-toggle="tab" data-bs-target="#equipos" href="#equipos" role="tab">
                                                <i class="fa-solid fa-computer me-1"></i> Equipos
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" id="fichas-tab" data-bs-toggle="tab" data-bs-target="#fichas" href="#fichas" role="tab">
                                                <i class="fa-solid fa-file-lines me-1"></i> Fichas Técnicas
                                            </a>
                                        </li>
                                    </ul>

                                    <div class="tab-content" id="inventarioTabContent">
                                        <!-- ==================== TAB MOBILIARIO ==================== -->
                                        <div class="tab-pane fade show active" id="mobiliario" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_mobiliario" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>Tipo</th>
                                                            <th>Marca</th>
                                                            <th>Modelo</th>
                                                            <th>Color</th>
                                                            <th>Estado</th>
                                                            <th>Estatus</th>
                                                            <th>Cantidad</th>
                                                            <th>Ubicación</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--dinamicamente con ajax-->
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- ==================== TAB EQUIPOS ==================== -->
                                        <div class="tab-pane fade" id="equipos" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_equipos" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>Tipo</th>
                                                            <th>Marca</th>
                                                            <th>Modelo</th>
                                                            <th>Serial</th>
                                                            <th>Estado</th>
                                                            <th>Ubicación</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!--dinamicamente con ajax-->
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- ==================== TAB FICHAS TÉCNICAS ==================== agregue -->
                                        <div class="tab-pane fade" id="fichas" role="tabpanel">
                                            <div class="table-responsive mt-3">
                                                <table class="table table-striped table-bordered" id="tabla_fichas" width="100%" cellspacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>Ficha Técnica</th>
                                                            <th>Servicio</th>
                                                            <th>Responsable</th>
                                                            <th>Fecha</th>
                                                            <th>Estatus</th>
                                                            <th>Acciones</th>
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
    <script src="<?= BASE_URL ?>dist/js/modulos/inventario_mob/consultar/consultar_mobiliario.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/inventario_mob/consultar/consultar_equipos.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/inventario_mob/consultar/consultar_fichas.js"></script>

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

</body>

</html>