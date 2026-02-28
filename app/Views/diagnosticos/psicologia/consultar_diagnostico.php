<?php 
$titulo = "Psicología";
include 'app/Views/template/head.php';
$es_admin = in_array($_SESSION['tipo_empleado'], ['Administrador', 'Superusuario']);
?>

<script>
    window.esAdmin = <?= json_encode($es_admin) ?>;
</script>

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
                        <h1 class="h3 mb-0 text-gray-800">Gestionar Diagnosticos de Psicología</h1>
                    </div>

                    <!-- Content Row (Diagnostico Generales) -->
                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Diagnósticos Generales</h6>
                                </div>
                                <div class="card-body">
                                    <table id="tabla_diagnostico_general" class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Beneficiario</th>
                                                <th>Empleado</th>
                                                <th>Tipo de consulta</th>
                                                <th>Patología</th>
                                                <th>Diagnostico</th>
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
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <?php require_once BASE_PATH . '/app/Views/citas/modalCitas.php'; ?>
            <?php require_once BASE_PATH . '/app/Views/diagnosticos/modal_diagnosticos.php'; ?>
            <!-- Footer -->
            <?php include 'app/Views/template/footer.php'; ?>
            <!-- End of Footer -->
        </div>
        <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

   <?php include 'app/Views/template/script.php'; ?>
   <!-- Script principal de la página -->
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/consultar/consultar_diagnosticos.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/consultar/verDiagnostico.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/consultar/editarDiagnostico.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/consultar/validarEditarDiagnostico.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/psicologia/consultar/eliminar_Diagnostico.js"></script>
    
</body>
</html>