<?php 
$titulo = "Consultar Inventario Médico";
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
                        <h1 class="h3 mb-0 text-gray-800">Gestionar Inventario Médico</h1>
                    </div>

                    
                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Insumos del Inventario</h6>
                                </div>
                                <div class="card-body">
                                    <table id="tabla_insumos" class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Nombre del Insumo</th>
                                                <th>Tipo de Insumo</th>
                                                <th>Presentación</th>
                                                <th>Cantidad</th>
                                                <th>Fecha de Vencimiento</th>
                                                <th>Estatus</th>
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

            <!-- Footer -->
            <?php include 'app/Views/template/footer.php'; ?>
            <!-- End of Footer -->
        </div>
        <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

   <?php include 'app/Views/template/script.php'; ?>
   <!-- Script principal de la página -->

   <script src="<?= BASE_URL ?>dist/js/modulos/inventario_medico/consultar_inventario.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/inventario_medico/validar_entrada.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/inventario_medico/validar_salida.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/inventario_medico/consultar/editarInsumo.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/inventario_medico/consultar/eliminarInsumo.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/inventario_medico/consultar/verInsumo.js"></script>
   <script src="<?= BASE_URL ?>dist/js/modulos/inventario_medico/consultar/validarEditarInsumo.js"></script>

   <!-- Modal Genérico -->
    <div class="modal fade" id="modalGenerico" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalGenericoTitle">Título del Modal</h5>
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