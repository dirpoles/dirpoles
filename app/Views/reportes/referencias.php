<?php
$titulo = "Reportes | Referencias";
include BASE_PATH . '/app/Views/template/head.php';
?>

<body id="page-top">
    <div id="wrapper">
        <?php include BASE_PATH . '/app/Views/template/sidebar.php'; ?>

        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <?php include BASE_PATH . '/app/Views/template/header.php'; ?>

                <div class="container-fluid">
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Reportes estadísticos | Referencias</h1>
                        <i id="btn-ayuda" class="fas fa-question-circle text-info fa-lg" data-toggle="tooltip" title="Ayuda" style="cursor: pointer;"></i>
                    </div>

                    <div class="card shadow mb-4 border-left-primary">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-filter mr-2"></i>Parámetros del Reporte</h6>
                        </div>
                        <div class="card-body">
                            <form id="form-reporte" novalidate>
                                <div class="row g-3">
                                    <div id="fecha_iniciod" class="col-md-2 mb-3">
                                        <label for="fecha_inicio" class="form-label font-weight-bold small">Fecha Inicio:</label>
                                        <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm">
                                    </div>
                                    <div id="fecha_find" class="col-md-2 mb-3">
                                        <label for="fecha_fin" class="form-label font-weight-bold small">Fecha Fin:</label>
                                        <input type="date" id="fecha_fin" name="fecha_fin" class="form-control form-control-sm">
                                    </div>
                                    <div id="generod" class="col-md-2 mb-3">
                                        <label for="genero" class="form-label font-weight-bold small">Género:</label>
                                        <select id="genero" name="genero" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                    <div id="estatusd" class="col-md-2 mb-3">
                                        <label for="estatus" class="form-label font-weight-bold small">Estado:</label>
                                        <select id="estatus" name="estatus" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="Aceptada">Aceptada</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Rechazada">Rechazada</option>
                                        </select>
                                    </div>
                                    <div id="id_beneficiariod" class="col-md-4 mb-3">
                                        <label for="id_beneficiario" class="form-label font-weight-bold small">Beneficiario:</label>
                                        <select id="id_beneficiario" name="id_beneficiario" class="form-control form-control-sm select2">
                                            <option value="">Buscar beneficiario...</option>
                                        </select>
                                    </div>

                                    <div id="areaOrd" class="col-md-3 mb-3">
                                        <label for="areaOr" class="form-label font-weight-bold small">Área Origen:</label>
                                        <select id="areaOr" name="areaOr" class="form-control form-control-sm">
                                            <option value="">Todas</option>
                                        </select>
                                    </div>
                                    <div id="areaDestd" class="col-md-3 mb-3">
                                        <label for="areaDest" class="form-label font-weight-bold small">Área Destino:</label>
                                        <select id="areaDest" name="areaDest" class="form-control form-control-sm">
                                            <option value="">Todas</option>
                                        </select>
                                    </div>
                                    <div id="empOrd" class="col-md-3 mb-3">
                                        <label for="empOr" class="form-label font-weight-bold small">Empleado Origen:</label>
                                        <select id="empOr" name="empOr" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div id="empDestd" class="col-md-3 mb-3">
                                        <label for="empDest" class="form-label font-weight-bold small">Empleado Destino:</label>
                                        <select id="empDest" name="empDest" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-12 text-center">
                                        <button type="button" id="btn-limpiar" class="btn btn-secondary btn-sm mr-2">
                                            <i class="fas fa-undo mr-1"></i> Limpiar
                                        </button>
                                        <button type="submit" class="btn btn-primary btn-sm shadow-sm">
                                            <i class="fas fa-chart-line mr-1"></i> Generar Reporte
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div id="contenedor_general" style="display: none;">
                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-navy text-white">
                                <h6 class="m-0 font-weight-bold"><i class="fas fa-chart-pie mr-2"></i>Visualización de Datos</h6>
                                <div class="d-flex align-items-center">
                                    <select id="select-grafica" class="form-control form-control-sm mr-2" style="width: 180px;">
                                        <option value="todos">Todos los Gráficos</option>
                                        <option value="genero">Por Género</option>
                                        <option value="estatus">Por Estado</option>
                                        <option value="areaO">Por Área Origen</option>
                                        <option value="areaD">Por Área Destino</option>
                                        <option value="empO">Por Empl. Origen</option>
                                        <option value="empD">Por Empl. Destino</option>
                                    </select>
                                    <select id="select-tipo-chart" class="form-control form-control-sm" style="width: 120px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart" id="wrapper-chartG">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Género</div>
                                            <div class="card-body"><canvas id="chartGenero"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart" id="wrapper-chartE">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Estado</div>
                                            <div class="card-body"><canvas id="chartE"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart" id="wrapper-chartAO">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Área Origen</div>
                                            <div class="card-body"><canvas id="chartAO"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart" id="wrapper-chartAD">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Área Destino</div>
                                            <div class="card-body"><canvas id="chartAD"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart" id="wrapper-chartEO">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Empleado Origen</div>
                                            <div class="card-body"><canvas id="chartEO"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart" id="wrapper-chartED">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Empleado Destino</div>
                                            <div class="card-body"><canvas id="chartED"></canvas></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-navy text-white">
                                <h6 class="m-0 font-weight-bold"><i class="fas fa-list mr-2"></i>Resultados del Reporte</h6>
                                <div id="btn-exp-general"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_general" class="table table-bordered table-striped table-hover text-center text-wrap" width="100%" cellspacing="0">
                                        <thead>
                                            <tr class="bg-navy text-white">
                                                <th>Fecha</th>
                                                <th>Beneficiario</th>
                                                <th>Cédula</th>
                                                <th>Género</th>
                                                <th>Área Origen</th>
                                                <th>Área Destino</th>
                                                <th>Empleado Origen</th>
                                                <th>Empleado Destino</th>
                                                <th>Motivo</th>
                                                <th>Estatus</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
        </div>
    </div>
    <script>
        const BASE_URL = "<?= BASE_URL ?>";
    </script>

    <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
    <script src="<?= BASE_URL ?>dist/js/dashboard/Chart.min.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/reportes/referencias.js"></script>
</body>

</html>