<?php
$titulo = "Reportes | Medicina";
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
                        <h1 class="h3 mb-0 text-gray-800">Reportes estadísticos | Medicina</h1>
                        <i id="btn-ayuda" class="fas fa-question-circle text-info fa-lg" data-toggle="tooltip" title="Ayuda" style="cursor: pointer;"></i>
                    </div>

                    <div class="card shadow mb-4 border-left-primary">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-filter mr-2"></i>Parámetros del Reporte</h6>
                        </div>
                        <div class="card-body">
                            <form id="form-reporte" novalidate>
                                <div class="row g-3 align-items-end">
                                    <div id="fecha_iniciod" class="col-md-2 mb-3">
                                        <label for="fecha_inicio" class="form-label font-weight-bold small">Fecha Inicio:</label>
                                        <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm">
                                    </div>
                                    <div id="fecha_find" class="col-md-2 mb-3">
                                        <label for="fecha_fin" class="form-label font-weight-bold small">Fecha Fin:</label>
                                        <input type="date" id="fecha_fin" name="fecha_fin" class="form-control form-control-sm">
                                    </div>
                                    <div id="tipo_reported" class="col-md-2 mb-3">
                                        <label for="tipo_reporte" class="form-label font-weight-bold small">Tipo de Reporte:</label>
                                        <select id="tipo_reporte" name="tipo_reporte" class="form-control form-control-sm">
                                            <option value="" selected>Seleccione...</option>
                                            <option value="morbilidad">Morbilidad</option>
                                            <option value="inventario">Inventario</option>
                                        </select>
                                    </div>

                                    <!-- Filtros Morbilidad -->
                                    <div class="col-md-2 mb-3 filtro-morb" id="div-filtro-genero" style="display: none;">
                                        <label for="genero" class="form-label font-weight-bold small">Género:</label>
                                        <select id="genero" name="genero" class="form-control form-control-sm">
                                            <option value="" selected>Todos</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2 mb-3 filtro-morb" id="div-filtro-pnf" style="display: none;">
                                        <label for="pnf" class="form-label font-weight-bold small">PNF:</label>
                                        <select id="pnf" name="pnf" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2 mb-3 filtro-morb" id="div-filtro-sangre" style="display: none;">
                                        <label for="tipo_sangre" class="form-label font-weight-bold small">Tipo de Sangre:</label>
                                        <select id="tipo_sangre" name="tipo_sangre" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>

                                    <!-- Filtros Inventario -->
                                    <div class="col-md-2 mb-3 filtro-inv" id="div-filtro-estado" style="display: none;">
                                        <label for="estadoI" class="form-label font-weight-bold small">Estado:</label>
                                        <select id="estadoI" name="estadoI" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2 mb-3 filtro-inv" id="div-filtro-tipo-insumo" style="display: none;">
                                        <label for="tipoI" class="form-label font-weight-bold small">Tipo de Insumo:</label>
                                        <select id="tipoI" name="tipoI" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2 mb-3 filtro-inv" id="div-filtro-presentacion" style="display: none;">
                                        <label for="presentacion" class="form-label font-weight-bold small">Presentación:</label>
                                        <select id="presentacion" name="presentacion" class="form-control form-control-sm">
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

                    <!-- ==================== CONTENEDOR MORBILIDAD ==================== -->
                    <div id="contenedor_medicina" style="display: none;">
                        <div class="card shadow mb-4 border-left-info">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-chart-bar mr-2"></i>Gráficas - Morbilidad Médica</h6>
                                <div class="d-flex align-items-center">
                                    <label for="select-grafica-med" class="small font-weight-bold mr-2 mb-0">Mostrar:</label>
                                    <select id="select-grafica-med" class="form-control form-control-sm" style="width: 200px;">
                                        <option value="todos" selected>Todos</option>
                                        <option value="genero">Por Género</option>
                                        <option value="pnf">Por PNF</option>
                                        <option value="sangre">Por Tipo de Sangre</option>
                                    </select>
                                    <label for="select-tipo-chart-med" class="small font-weight-bold ml-3 mr-2 mb-0">Tipo:</label>
                                    <select id="select-tipo-chart-med" class="form-control form-control-sm" style="width: 150px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-4 col-lg-6 mb-4 chart-wrapper-med" id="wrapper-chartG">
                                        <h6 class="text-center font-weight-bold text-primary mb-2">Por Género</h6>
                                        <div class="chart-container" style="position: relative; height:280px; width:100%">
                                            <canvas id="chartG"></canvas>
                                        </div>
                                    </div>
                                    <div class="col-xl-4 col-lg-6 mb-4 chart-wrapper-med" id="wrapper-chartP">
                                        <h6 class="text-center font-weight-bold text-primary mb-2">Por PNF</h6>
                                        <div class="chart-container" style="position: relative; height:280px; width:100%">
                                            <canvas id="chartP"></canvas>
                                        </div>
                                    </div>
                                    <div class="col-xl-4 col-lg-12 mb-4 chart-wrapper-med" id="wrapper-chartTS">
                                        <h6 class="text-center font-weight-bold text-primary mb-2">Por Tipo de Sangre</h6>
                                        <div class="chart-container" style="position: relative; height:280px; width:100%">
                                            <canvas id="chartTS"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">Detalle de Registros - Morbilidad</h6>
                                <div id="botones-exportacion-med"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_medicina" class="table table-bordered table-striped table-hover text-center w-100">
                                        <thead>
                                            <tr style="background-color: #4e73df; color: white;">
                                                <th>Fecha</th>
                                                <th>Nombres</th>
                                                <th>Cédula</th>
                                                <th>PNF</th>
                                                <th>Estatura</th>
                                                <th>Peso</th>
                                                <th>Tipo de Sangre</th>
                                                <th>Motivo</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ==================== CONTENEDOR INVENTARIO ==================== -->
                    <div id="contenedor_inventario" style="display: none;">
                        <div class="card shadow mb-4 border-left-info">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-chart-bar mr-2"></i>Gráficas - Inventario Médico</h6>
                                <div class="d-flex align-items-center">
                                    <label for="select-grafica-inv" class="small font-weight-bold mr-2 mb-0">Mostrar:</label>
                                    <select id="select-grafica-inv" class="form-control form-control-sm" style="width: 220px;">
                                        <option value="todos" selected>Todos</option>
                                        <option value="estado">Por Estado</option>
                                        <option value="tipo_insumo">Por Tipo de Insumo</option>
                                        <option value="presentacion">Por Presentación</option>
                                    </select>
                                    <label for="select-tipo-chart-inv" class="small font-weight-bold ml-3 mr-2 mb-0">Tipo:</label>
                                    <select id="select-tipo-chart-inv" class="form-control form-control-sm" style="width: 150px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-4 col-lg-6 mb-4 chart-wrapper-inv" id="wrapper-chartE">
                                        <h6 class="text-center font-weight-bold text-primary mb-2">Por Estado</h6>
                                        <div class="chart-container" style="position: relative; height:280px; width:100%">
                                            <canvas id="chartE"></canvas>
                                        </div>
                                    </div>
                                    <div class="col-xl-4 col-lg-6 mb-4 chart-wrapper-inv" id="wrapper-chartTI">
                                        <h6 class="text-center font-weight-bold text-primary mb-2">Por Tipo de Insumo</h6>
                                        <div class="chart-container" style="position: relative; height:280px; width:100%">
                                            <canvas id="chartTI"></canvas>
                                        </div>
                                    </div>
                                    <div class="col-xl-4 col-lg-12 mb-4 chart-wrapper-inv" id="wrapper-chartPRE">
                                        <h6 class="text-center font-weight-bold text-primary mb-2">Por Presentación</h6>
                                        <div class="chart-container" style="position: relative; height:280px; width:100%">
                                            <canvas id="chartPRE"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">Detalle de Registros - Inventario Médico</h6>
                                <div id="botones-exportacion-inv"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_inventario" class="table table-bordered table-striped table-hover text-center w-100">
                                        <thead>
                                            <tr style="background-color: #4e73df; color: white;">
                                                <th>Fecha Vencimiento</th>
                                                <th>Stock</th>
                                                <th>Nombre Insumo</th>
                                                <th>Tipo Insumo</th>
                                                <th>Presentación</th>
                                                <th>Cantidad</th>
                                                <th>Estado</th>
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
    <script src="<?= BASE_URL ?>dist/js/modulos/reportes/medicina.js"></script>
</body>

</html>