<?php
$titulo = "Reportes | Discapacidad";
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
                        <h1 class="h3 mb-0 text-gray-800">Reportes estadísticos | Discapacidad</h1>
                        <i id="btn-ayuda" class="fas fa-question-circle text-info fa-lg" data-toggle="tooltip" title="Ayuda" style="cursor: pointer;"></i>
                    </div>

                    <div class="card shadow mb-4 border-left-primary">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-filter mr-2"></i>Parámetros del Reporte</h6>
                        </div>
                        <div class="card-body">
                            <form id="form-reporte" novalidate>
                                <div class="row g-3 align-items-end">
                                    <div class="col-md-2 mb-3">
                                        <label for="fecha_inicio" class="form-label font-weight-bold small">Fecha Inicio:</label>
                                        <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm">
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="fecha_fin" class="form-label font-weight-bold small">Fecha Fin:</label>
                                        <input type="date" id="fecha_fin" name="fecha_fin" class="form-control form-control-sm">
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="genero" class="form-label font-weight-bold small">Género:</label>
                                        <select id="genero" name="genero" class="form-control form-control-sm">
                                            <option value="" selected>Todos</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label for="pnf" class="form-label font-weight-bold small">PNF:</label>
                                        <select id="pnf" name="pnf" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label for="area" class="form-label font-weight-bold small">Área:</label>
                                        <select id="area" name="area" class="form-control form-control-sm">
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
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-navy">
                                <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-chart-pie mr-2"></i>Visualización de Datos</h6>
                                <div class="d-flex align-items-center">
                                    <select id="select-grafica" class="form-control form-control-sm mr-2" style="width: 150px;">
                                        <option value="todos">Todos</option>
                                        <option value="genero">Por Género</option>
                                        <option value="pnf">Por PNF</option>
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
                                            <div class="card-header py-3">
                                                <h6 class="m-0 font-weight-bold text-primary text-center">Distribución por Género</h6>
                                            </div>
                                            <div class="card-body">
                                                <div class="chart-area" style="height: 300px;">
                                                    <canvas id="chartG"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart" id="wrapper-chartP">
                                        <div class="card h-100">
                                            <div class="card-header py-3">
                                                <h6 class="m-0 font-weight-bold text-primary text-center">Distribución por PNF</h6>
                                            </div>
                                            <div class="card-body">
                                                <div class="chart-area" style="height: 300px;">
                                                    <canvas id="chartP"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-navy">
                                <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-list mr-2"></i>Resultados del Reporte</h6>
                                <div id="btn-exp-general"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_discapacidad" class="table table-bordered table-striped table-hover text-center text-wrap" width="100%" cellspacing="0">
                                        <thead>
                                            <tr class="bg-navy text-white">
                                                <th>Fecha</th>
                                                <th>Nombres</th>
                                                <th>Cédula</th>
                                                <th>PNF</th>
                                                <th>Condición Médica</th>
                                                <th>Cirugía Previa</th>
                                                <th>Asistencia</th>
                                                <th>Dispositivo</th>
                                                <th>Apoyo Psicológico</th>
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
    <script src="<?= BASE_URL ?>dist/js/modulos/reportes/discapacidad.js"></script>
</body>

</html>