<?php 
$titulo = "Trabajo Social";
include 'app/Views/template/head.php';
$es_admin = in_array($_SESSION['tipo_empleado'], ['Administrador', 'Superusuario']);
?>

<script>
    window.esAdmin = <?= json_encode($es_admin) ?>;
</script>

<body id="page-top">
    <div id="wrapper">
        <?php include 'app/Views/template/sidebar.php'; ?>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <?php include 'app/Views/template/header.php'; ?>

                <div class="container-fluid">
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Gestionar Diagnósticos de Trabajo Social</h1>
                        <a href="<?= BASE_URL ?>pdf/reporte_ts" target="_blank" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                            <i class="fas fa-download fa-sm text-white-50"></i> Generar Reporte
                        </a>
                    </div>

                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <ul class="nav nav-tabs card-header-tabs" id="tsTabs" role="tablist">
                                <li class="nav-item">
                                    <button class="nav-link active" id="becas-tab" data-bs-toggle="tab" data-bs-target="#becas" type="button" role="tab" onclick="cargarTabla('becas')">
                                        <i class="fas fa-graduation-cap me-2 text-primary"></i>Becas
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="exoneraciones-tab" data-bs-toggle="tab" data-bs-target="#exoneraciones" type="button" role="tab" onclick="cargarTabla('exoneraciones')">
                                        <i class="fas fa-file-invoice-dollar me-2 text-warning"></i>Exoneraciones
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="fames-tab" data-bs-toggle="tab" data-bs-target="#fames" type="button" role="tab" onclick="cargarTabla('fames')">
                                        <i class="fas fa-hand-holding-heart me-2 text-danger"></i>FAMES
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link" id="embarazadas-tab" data-bs-toggle="tab" data-bs-target="#embarazadas" type="button" role="tab" onclick="cargarTabla('embarazadas')">
                                        <i class="fas fa-baby me-2 text-info"></i>Embarazadas
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div class="card-body">
                            <div class="tab-content" id="tsTabsContent">
                                <!-- Tabla General (Se reconstruye dinámicamente) -->
                                <div class="table-responsive">
                                    <table id="tabla_ts" class="table table-bordered table-striped" width="100%" cellspacing="0">
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
            
            <?php include 'app/Views/template/footer.php'; ?>
        </div>
    </div>

    <?php include 'app/Views/template/script.php'; ?>
    <?php include 'app/Views/diagnosticos/modal_diagnosticos.php'; ?>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/consultar_general.js"></script>
    <!-- Becas -->
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/becas/verBeca.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/becas/editarBeca.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/becas/validarEditarBeca.js"></script>

    <!-- Exoneraciones -->

    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/exoneraciones/verExoneracion.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/exoneraciones/editarExoneracion.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/exoneraciones/validarEditarExoneracion.js"></script>

    <!-- FAMES -->
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/fames/verFames.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/fames/editarFames.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/fames/validarEditarFames.js"></script>

    <!-- Embarazadas -->
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/embarazadas/verEmbarazada.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/embarazadas/editarEmbarazada.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/diagnosticos/trabajo_social/embarazadas/validarEditarEmb.js"></script>
    
    
</body>
</html>