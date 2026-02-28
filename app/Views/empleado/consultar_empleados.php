<?php 
$titulo = "Consultar Empleados";
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
                        <h1 class="h3 mb-0 text-gray-800">Gestionar Empleados</h1>
                    </div>

                    <!-- Content Row -->
                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Listado de Empleados</h6>
                                </div>
                                <div class="card-body">
                                    <table id="miTabla" class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Cedula</th>
                                                <th>Correo</th>
                                                <th>Telefono</th>
                                                <th>Cargo</th>
                                                <th>Estatus</th>
                                                <th>Acciones</th>
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
                    <?php include BASE_PATH . '/app/Views/empleado/modalEmpleado.php'; ?>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <!-- Footer -->
            <?php include 'app/Views/template/footer.php'; ?>
            <!-- End of Footer -->
        </div>
        <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

   <?php include 'app/Views/template/script.php'; ?>
   <script src="<?= BASE_URL ?>dist/js/modulos/empleado/consultar_empleados.js"></script>

</body>
</html>