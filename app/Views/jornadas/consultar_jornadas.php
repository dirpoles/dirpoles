<?php
$titulo = "Consultar Jornadas";
include 'app/Views/template/head.php';
?>

<body id="page-top">
    <!-- Page Wrapper -->
    <div id="wrapper">
        <!-- Sidebar -->
        <?php include 'app/Views/template/sidebar.php'; ?>
        <!-- End of Sidebar -->
        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            <!-- Main Content -->
            <div id="content">
                <!-- Topbar -->
                <?php include 'app/Views/template/header.php'; ?>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">
                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Consultar Jornadas</h1>
                    </div>

                    <!-- Content Row -->
                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Listado de Jornadas</h6>
                                </div>
                                <div class="card-body">
                                    <table id="tabla_jornadas" class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Tipo de Jornada</th>
                                                <th>Fecha</th>
                                                <th>Ubicación</th>
                                                <th>Capacidad</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- Dinamicamente con AJAX -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- Modal -->
            <?php include 'app/Views/jornadas/modal_jornadas.php'; ?>
            <!-- End of Main Content -->
            <!-- Footer -->
            <?php include 'app/Views/template/footer.php'; ?>
            <!-- End of Footer -->
        </div>
        <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

    <?php include 'app/Views/template/script.php'; ?>
    <!-- Script principal de la página -->
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/consultar_jornadas.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/verJornada.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/editarJornada.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/validarEditarJornada.js"></script>


</body>

</html>