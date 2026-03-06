<?php
$titulo = "Reportes | Mobiliario";
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
                        <h1 class="h3 mb-0 text-gray-800">Reportes estadísticos | Mobiliario y Equipos</h1>
                        <i id="btn-ayuda" class="fas fa-question-circle text-info fa-lg" data-toggle="tooltip" title="Ayuda" style="cursor: pointer;"></i>
                    </div>

                    <div class="card shadow mb-4 border-left-primary">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-filter mr-2"></i>Parámetros del Reporte</h6>
                        </div>
                        <div class="card-body">
                            <form id="form-reporte" novalidate>
                                <div class="row g-3">
                                    <div class="col-md-3 mb-3">
                                        <label for="tipoReporte" class="form-label font-weight-bold small text-primary">Tipo de Reporte:</label>
                                        <select id="tipoReporte" name="tipoReporte" class="form-control form-control-sm border-primary">
                                            <option value="mobiliario" selected>Mobiliario</option>
                                            <option value="equipos">Equipos</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="fecha_inicio" class="form-label font-weight-bold small">Fecha Inicio:</label>
                                        <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm">
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="fecha_fin" class="form-label font-weight-bold small">Fecha Fin:</label>
                                        <input type="date" id="fecha_fin" name="fecha_fin" class="form-control form-control-sm">
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="tipo" class="form-label font-weight-bold small">Tipo:</label>
                                        <select id="tipo" name="tipo" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label for="ubicacion" class="form-label font-weight-bold small">Ubicación:</label>
                                        <select id="ubicacion" name="ubicacion" class="form-control form-control-sm">
                                            <option value="">Todas</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row g-3">
                                    <div class="col-md-2 mb-3">
                                        <label for="marca" class="form-label font-weight-bold small">Marca:</label>
                                        <select id="marca" name="marca" class="form-control form-control-sm">
                                            <option value="">Todas</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="modelo" class="form-label font-weight-bold small">Modelo:</label>
                                        <select id="modelo" name="modelo" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2 mb-3" id="divSerial" style="display: none;">
                                        <label for="serial" class="form-label font-weight-bold small">Serial:</label>
                                        <select id="serial" name="serial" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="estado" class="form-label font-weight-bold small">Estado Físico:</label>
                                        <select id="estado" name="estado" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="Nuevo">Nuevo</option>
                                            <option value="Bueno">Bueno</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Malo">Malo</option>
                                            <option value="En reparacion">En reparación</option>
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

                    <!-- Contenedor MOBILIARIO -->
                    <div id="contenedor_mob" style="display: none;">
                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-navy text-white">
                                <h6 class="m-0 text-primary font-weight-bold"><i class="fas fa-chart-pie mr-2"></i>Visualización Mobiliario</h6>
                                <div class="d-flex align-items-center">
                                    <select id="sel-grafica-mob" class="form-control form-control-sm mr-2" style="width: 180px;">
                                        <option value="todos">Todos los Gráficos</option>
                                        <option value="tipo">Por Tipo</option>
                                        <option value="marca">Por Marca</option>
                                        <option value="estado">Por Estado</option>
                                        <option value="ubicacion">Por Ubicación</option>
                                    </select>
                                    <select id="sel-tipo-chart-mob" class="form-control form-control-sm" style="width: 120px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart-mob" id="w-chartMT">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Tipo</div>
                                            <div class="card-body"><canvas id="chartMT"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart-mob" id="w-chartMMA">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Marca</div>
                                            <div class="card-body"><canvas id="chartMMA"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart-mob" id="w-chartME">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Estado</div>
                                            <div class="card-body"><canvas id="chartME"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart-mob" id="w-chartMU">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Ubicación</div>
                                            <div class="card-body"><canvas id="chartMU"></canvas></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-navy text-white">
                                <h6 class="m-0 text-primary font-weight-bold"><i class="fas fa-list mr-2"></i>Resultados Mobiliario</h6>
                                <div id="btn-exp-mob"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_mob" class="table table-bordered table-striped table-hover text-center text-wrap" width="100%" cellspacing="0">
                                        <thead>
                                            <tr class="bg-navy text-white">
                                                <th>Fecha Ingreso</th>
                                                <th>Tipo</th>
                                                <th>Marca/Modelo</th>
                                                <th>Color</th>
                                                <th>Estado</th>
                                                <th>Ubicación</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contenedor EQUIPOS -->
                    <div id="contenedor_equipos" style="display: none;">
                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-dark text-white">
                                <h6 class="m-0 font-weight-bold"><i class="fas fa-chart-bar mr-2"></i>Visualización Equipos</h6>
                                <div class="d-flex align-items-center">
                                    <select id="sel-grafica-eq" class="form-control form-control-sm mr-2" style="width: 180px;">
                                        <option value="todos">Todos los Gráficos</option>
                                        <option value="tipo">Por Tipo</option>
                                        <option value="marca">Por Marca</option>
                                        <option value="estado">Por Estado</option>
                                        <option value="ubicacion">Por Ubicación</option>
                                    </select>
                                    <select id="sel-tipo-chart-eq" class="form-control form-control-sm" style="width: 120px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart-eq" id="w-chartET">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Tipo</div>
                                            <div class="card-body"><canvas id="chartET"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart-eq" id="w-chartEMA">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Marca</div>
                                            <div class="card-body"><canvas id="chartEMA"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart-eq" id="w-chartEE">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Estado</div>
                                            <div class="card-body"><canvas id="chartEE"></canvas></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 mb-4 wrapper-chart-eq" id="w-chartEU">
                                        <div class="card h-100">
                                            <div class="card-header py-2 text-center small font-weight-bold">Por Ubicación</div>
                                            <div class="card-body"><canvas id="chartEU"></canvas></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-dark text-white">
                                <h6 class="m-0 font-weight-bold"><i class="fas fa-laptop mr-2"></i>Resultados Equipos</h6>
                                <div id="btn-exp-equipos"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_equipos" class="table table-bordered table-striped table-hover text-center text-wrap" width="100%" cellspacing="0">
                                        <thead>
                                            <tr class="bg-dark text-white">
                                                <th>Fecha Ingreso</th>
                                                <th>Tipo</th>
                                                <th>Marca/Modelo</th>
                                                <th>Serial</th>
                                                <th>Estado</th>
                                                <th>Ubicación</th>
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
    <script src="<?= BASE_URL ?>dist/js/modulos/reportes/mobiliario.js"></script>
</body>

</html>