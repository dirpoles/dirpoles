<?php
$titulo = "Reportes | Trabajo Social";
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
                        <h1 class="h3 mb-0 text-gray-800">Reportes estadísticos | Trabajo Social</h1>
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
                                    <div id="tipoReported" class="col-md-2 mb-3">
                                        <label for="tipoReporte" class="form-label font-weight-bold small">Tipo de Reporte:</label>
                                        <select id="tipoReporte" name="tipoReporte" class="form-control form-control-sm">
                                            <option value="" selected disabled>Seleccione...</option>
                                            <option value="becas">Becas</option>
                                            <option value="exoneracion">Exoneración</option>
                                            <option value="fames">F.A.M.E.S</option>
                                            <option value="embarazo">Gestión Embarazadas</option>
                                        </select>
                                    </div>

                                    <!-- Filtros Generales (mostrados/ocultos dinámicamente) -->
                                    <div id="pnfd" class="col-md-2 mb-3 filtro-general" style="display: none;">
                                        <label for="pnf" class="form-label font-weight-bold small">PNF:</label>
                                        <select id="pnf" name="pnf" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div id="generod" class="col-md-2 mb-3 filtro-general" style="display: none;">
                                        <label for="genero" class="form-label font-weight-bold small">Género:</label>
                                        <select id="genero" name="genero" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>

                                    <!-- Filtros Específicos -->
                                    <div id="bancod" class="col-md-2 mb-3 filtro-becas" style="display: none;">
                                        <label for="banco" class="form-label font-weight-bold small">Banco:</label>
                                        <select id="banco" name="banco" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>

                                    <div id="discapacidadd" class="col-md-2 mb-3 filtro-exoneracion" style="display: none;">
                                        <label for="discapacidad" class="form-label font-weight-bold small">Discapacidad:</label>
                                        <select id="discapacidad" name="discapacidad" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="si">Si</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>

                                    <div id="patologiad" class="col-md-2 mb-3 filtro-fames filtro-embarazo" style="display: none;">
                                        <label for="patologia" class="form-label font-weight-bold small">Patología:</label>
                                        <select id="patologia" name="patologia" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>

                                    <div id="tipoAyudad" class="col-md-2 mb-3 filtro-fames" style="display: none;">
                                        <label for="tipoAyuda" class="form-label font-weight-bold small">Tipo Ayuda:</label>
                                        <select id="tipoAyuda" name="tipoAyuda" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="economica">Económica</option>
                                            <option value="operaciones">Operaciones</option>
                                            <option value="examenes">Exámenes</option>
                                            <option value="embarazo">Embarazo</option>
                                            <option value="otros">Otros</option>
                                        </select>
                                    </div>

                                    <div id="estadod" class="col-md-2 mb-3 filtro-embarazo" style="display: none;">
                                        <label for="estado" class="form-label font-weight-bold small">Estado:</label>
                                        <select id="estado" name="estado" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="Aprobado">Aprobado</option>
                                            <option value="En proceso">En proceso</option>
                                            <option value="Rechazado">Rechazado</option>
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

                    <!-- ==================== CONTENEDORES DE RESULTADOS ==================== -->

                    <!-- Becas -->
                    <div id="contenedor_becas" class="contenedor-resultado" style="display: none;">
                        <div class="card shadow mb-4 border-left-info">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-chart-bar mr-2"></i>Gráficas - Becas</h6>
                                <div class="d-flex align-items-center">
                                    <select id="select-grafica-becas" class="form-control form-control-sm mr-2" style="width: 200px;">
                                        <option value="todos">Todos</option>
                                        <option value="genero">Género</option>
                                        <option value="pnf">PNF</option>
                                        <option value="banco">Banco</option>
                                    </select>
                                    <select id="select-tipo-chart-becas" class="form-control form-control-sm" style="width: 120px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-4 col-md-6 mb-4 wrapper-chart-becas" id="wrapper-chartBG"><canvas id="chartBG"></canvas></div>
                                    <div class="col-xl-4 col-md-6 mb-4 wrapper-chart-becas" id="wrapper-chartBPnf"><canvas id="chartBPnf"></canvas></div>
                                    <div class="col-xl-4 col-md-12 mb-4 wrapper-chart-becas" id="wrapper-chartBB"><canvas id="chartBB"></canvas></div>
                                </div>
                            </div>
                        </div>
                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">Detalle Becas</h6>
                                <div id="btn-exp-becas"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_becas" class="table table-bordered table-striped text-center w-100">
                                        <thead>
                                            <tr class="bg-primary text-white">
                                                <th>Fecha</th>
                                                <th>Nombres</th>
                                                <th>Cédula</th>
                                                <th>PNF</th>
                                                <th>Banco</th>
                                                <th>Cuenta</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Exoneracion -->
                    <div id="contenedor_exoneracion" class="contenedor-resultado" style="display: none;">
                        <div class="card shadow mb-4 border-left-info">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-chart-bar mr-2"></i>Gráficas - Exoneración</h6>
                                <div class="d-flex align-items-center">
                                    <select id="select-grafica-ex" class="form-control form-control-sm mr-2" style="width: 200px;">
                                        <option value="todos">Todos</option>
                                        <option value="genero">Género</option>
                                        <option value="pnf">PNF</option>
                                        <option value="discapacidad">Discapacidad</option>
                                    </select>
                                    <select id="select-tipo-chart-ex" class="form-control form-control-sm" style="width: 120px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-4 col-md-6 mb-4 wrapper-chart-ex" id="wrapper-chartEG"><canvas id="chartEG"></canvas></div>
                                    <div class="col-xl-4 col-md-6 mb-4 wrapper-chart-ex" id="wrapper-chartEP"><canvas id="chartEP"></canvas></div>
                                    <div class="col-xl-4 col-md-12 mb-4 wrapper-chart-ex" id="wrapper-chartED"><canvas id="chartED"></canvas></div>
                                </div>
                            </div>
                        </div>
                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">Detalle Exoneración</h6>
                                <div id="btn-exp-ex"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_exoneracion" class="table table-bordered table-striped text-center w-100">
                                        <thead>
                                            <tr class="bg-primary text-white">
                                                <th>Fecha</th>
                                                <th>Nombres</th>
                                                <th>Cédula</th>
                                                <th>PNF</th>
                                                <th>Motivo</th>
                                                <th>Discapacidad</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- FAMES -->
                    <div id="contenedor_fames" class="contenedor-resultado" style="display: none;">
                        <div class="card shadow mb-4 border-left-info">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-chart-bar mr-2"></i>Gráficas - FAMES</h6>
                                <div class="d-flex align-items-center">
                                    <select id="select-grafica-fames" class="form-control form-control-sm mr-2" style="width: 200px;">
                                        <option value="todos">Todos</option>
                                        <option value="genero">Género</option>
                                        <option value="pnf">PNF</option>
                                        <option value="patologia">Patología</option>
                                        <option value="ayuda">Tipo Ayuda</option>
                                    </select>
                                    <select id="select-tipo-chart-fames" class="form-control form-control-sm" style="width: 120px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-3 col-md-6 mb-4 wrapper-chart-fames" id="wrapper-chartFG"><canvas id="chartFG"></canvas></div>
                                    <div class="col-xl-3 col-md-6 mb-4 wrapper-chart-fames" id="wrapper-chartFP"><canvas id="chartFP"></canvas></div>
                                    <div class="col-xl-3 col-md-6 mb-4 wrapper-chart-fames" id="wrapper-chartFPT"><canvas id="chartFPT"></canvas></div>
                                    <div class="col-xl-3 col-md-6 mb-4 wrapper-chart-fames" id="wrapper-chartFTA"><canvas id="chartFTA"></canvas></div>
                                </div>
                            </div>
                        </div>
                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">Detalle FAMES</h6>
                                <div id="btn-exp-fames"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_fames" class="table table-bordered table-striped text-center w-100">
                                        <thead>
                                            <tr class="bg-primary text-white">
                                                <th>Fecha</th>
                                                <th>Nombres</th>
                                                <th>Cédula</th>
                                                <th>PNF</th>
                                                <th>Patología</th>
                                                <th>Tipo Ayuda</th>
                                                <th>Observaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Embarazo -->
                    <div id="contenedor_emb" class="contenedor-resultado" style="display: none;">
                        <div class="card shadow mb-4 border-left-info">
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-chart-bar mr-2"></i>Gráficas - Embarazo</h6>
                                <div class="d-flex align-items-center">
                                    <select id="select-grafica-emb" class="form-control form-control-sm mr-2" style="width: 200px;">
                                        <option value="todos">Todos</option>
                                        <option value="pnf">PNF</option>
                                        <option value="patologia">Patología</option>
                                        <option value="estado">Estado</option>
                                    </select>
                                    <select id="select-tipo-chart-emb" class="form-control form-control-sm" style="width: 120px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Anillo</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-4 col-md-6 mb-4 wrapper-chart-emb" id="wrapper-chartEmbP"><canvas id="chartEmbP"></canvas></div>
                                    <div class="col-xl-4 col-md-6 mb-4 wrapper-chart-emb" id="wrapper-chartEmbPT"><canvas id="chartEmbPT"></canvas></div>
                                    <div class="col-xl-4 col-md-12 mb-4 wrapper-chart-emb" id="wrapper-chartEmbE"><canvas id="chartEmbE"></canvas></div>
                                </div>
                            </div>
                        </div>
                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">Detalle Gestión Embarazo</h6>
                                <div id="btn-exp-emb"></div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tabla_emb" class="table table-bordered table-striped text-center w-100">
                                        <thead>
                                            <tr class="bg-primary text-white">
                                                <th>Fecha</th>
                                                <th>Nombres</th>
                                                <th>Cédula</th>
                                                <th>PNF</th>
                                                <th>Patología</th>
                                                <th>Semanas</th>
                                                <th>Código C.P</th>
                                                <th>Serial C.P</th>
                                                <th>Teléfono</th>
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
    <script src="<?= BASE_URL ?>dist/js/modulos/reportes/trabajo_social.js"></script>
</body>

</html>