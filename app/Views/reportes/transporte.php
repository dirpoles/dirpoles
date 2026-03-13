<?php
$titulo = "Reportes | Transporte";
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
                        <h1 class="h3 mb-0 text-gray-800">Reportes estadísticos | Transporte</h1>
                        <i id="btn-ayuda" class="fas fa-question-circle text-info fa-lg" data-toggle="tooltip" title="Ayuda" style="cursor: pointer;"></i>
                    </div>

                    <div class="card shadow mb-4 border-left-primary">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-filter mr-2"></i>Parámetros del Reporte de Transporte</h6>
                        </div>
                        <div class="card-body">
                            <form id="form-reporte" novalidate>
                                <div class="row g-3">
                                    <div id="tipoReporte" class="col-md-3 mb-3">
                                        <label for="tipoReporte" class="form-label font-weight-bold small text-primary">Tipo de Reporte:</label>
                                        <select id="tipoReporte" name="tipoReporte" class="form-control form-control-sm border-primary">
                                            <option value="" selected disabled>Seleccione una opción</option>
                                            <option value="vehiculos">Vehículos</option>
                                            <option value="proveedores">Proveedores</option>
                                            <option value="rutas">Rutas</option>
                                            <option value="repuestos">Repuestos</option>
                                        </select>
                                    </div>
                                    <div id="fecha_iniciod" class="col-md-2 mb-3">
                                        <label for="fecha_inicio" class="form-label font-weight-bold small">Fecha Inicio:</label>
                                        <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm">
                                    </div>
                                    <div id="fecha_find" class="col-md-2 mb-3">
                                        <label for="fecha_fin" class="form-label font-weight-bold small">Fecha Fin:</label>
                                        <input type="date" id="fecha_fin" name="fecha_fin" class="form-control form-control-sm">
                                    </div>

                                    <!-- Filtros específicos VEHICULOS -->
                                    <div id="tipoVd" class="col-md-2 mb-3 f-vehiculo" style="display: none;">
                                        <label for="tipoV" class="form-label font-weight-bold small">Tipo de Vehículo:</label>
                                        <select id="tipoV" name="tipoV" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="Autobús">Autobús</option>
                                            <option value="Camioneta">Camioneta</option>
                                            <option value="Automóvil">Automóvil</option>
                                        </select>
                                    </div>
                                    <div id="modelod" class="col-md-3 mb-3 f-vehiculo" style="display: none;">
                                        <label for="modelo" class="form-label font-weight-bold small">Modelo:</label>
                                        <select id="modelo" name="modelo" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>

                                    <!-- Filtros específicos PROVEEDORES -->
                                    <div id="estadoPd" class="col-md-3 mb-3 f-proveedor" style="display: none;">
                                        <label for="estadoP" class="form-label font-weight-bold small">Estado:</label>
                                        <select id="estadoP" name="estadoP" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>

                                    <!-- Filtros específicos RUTAS -->
                                    <div id="tipoRd" class="col-md-2 mb-3 f-ruta" style="display: none;">
                                        <label for="tipoR" class="form-label font-weight-bold small">Tipo de Ruta:</label>
                                        <select id="tipoR" name="tipoR" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="Inter-Urbana">Inter-Urbana</option>
                                            <option value="Extra-Urbana">Extra-Urbana</option>
                                            <option value="Vacacional">Vacacional</option>
                                        </select>
                                    </div>
                                    <div id="partidad" class="col-md-2 mb-3 f-ruta" style="display: none;">
                                        <label for="partida" class="form-label font-weight-bold small">Punto Partida:</label>
                                        <select id="partida" name="partida" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div id="destinod" class="col-md-2 mb-3 f-ruta" style="display: none;">
                                        <label for="destino" class="form-label font-weight-bold small">Punto Destino:</label>
                                        <select id="destino" name="destino" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>

                                    <!-- Filtros específicos REPUESTOS -->
                                    <div id="proveedor_red" class="col-md-2 mb-3 f-repuesto" style="display: none;">
                                        <label for="proveedor_re" class="form-label font-weight-bold small">Proveedor:</label>
                                        <select id="proveedor_re" name="proveedor_re" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div id="estadoREd" class="col-md-2 mb-3 f-repuesto" style="display: none;">
                                        <label for="estadoRE" class="form-label font-weight-bold small">Estado:</label>
                                        <select id="estadoRE" name="estadoRE" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="Nuevo">Nuevo</option>
                                            <option value="Usado">Usado</option>
                                            <option value="Dañado">Dañado</option>
                                        </select>
                                    </div>
                                </div>

                                <div id="estadoVd" class="row g-3 f-vehiculo" style="display: none;">
                                    <div class="col-md-2 mb-3">
                                        <label for="estadoV" class="form-label font-weight-bold small">Estado Operativo:</label>
                                        <select id="estadoV" name="estadoV" class="form-control form-control-sm">
                                            <option value="">Todos</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Mantenimiento">Mantenimiento</option>
                                            <option value="Inactivo">Inactivo</option>
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

                    <!-- RESULTADOS DINÁMICOS -->
                    <div id="wrapper-resultados">
                        <!-- VEHICULOS -->
                        <div id="contenedor_v" class="cont-rep" style="display: none;">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white text-primary">
                                    <h6 class="m-0 font-weight-bold"><i class="fas fa-chart-pie mr-2"></i>Visualización Vehículos</h6>
                                    <select id="sel-tipo-chart-v" class="form-control form-control-sm" style="width: 130px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Dona</option>
                                    </select>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-4 mb-4"><canvas id="chartVM" style="max-height: 250px;"></canvas></div>
                                        <div class="col-md-4 mb-4"><canvas id="chartVT" style="max-height: 250px;"></canvas></div>
                                        <div class="col-md-4 mb-4"><canvas id="chartVE" style="max-height: 250px;"></canvas></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white text-primary border-bottom">
                                    <h6 class="m-0 font-weight-bold"><i class="fas fa-table mr-2"></i>Datos de Vehículos</h6>
                                    <div id="btn-exp-v"></div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table id="tabla_v" class="table table-bordered table-striped table-hover text-center" width="100%">
                                            <thead>
                                                <tr class="bg-navy text-white">
                                                    <th>Registro</th>
                                                    <th>Placa</th>
                                                    <th>Tipo</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- PROVEEDORES -->
                        <div id="contenedor_p" class="cont-rep" style="display: none;">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white text-primary">
                                    <h6 class="m-0 font-weight-bold"><i class="fas fa-chart-pie mr-2"></i>Visualización Proveedores</h6>
                                    <select id="sel-tipo-chart-p" class="form-control form-control-sm" style="width: 130px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Dona</option>
                                    </select>
                                </div>
                                <div class="card-body">
                                    <div class="row d-flex justify-content-center">
                                        <div class="col-md-6 mb-4"><canvas id="chartPE" style="max-height: 250px;"></canvas></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white text-primary border-bottom">
                                    <h6 class="m-0 font-weight-bold"><i class="fas fa-table mr-2"></i>Datos de Proveedores</h6>
                                    <div id="btn-exp-p"></div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table id="tabla_p" class="table table-bordered table-striped table-hover text-center" width="100%">
                                            <thead>
                                                <tr class="bg-dark text-white">
                                                    <th>Registro</th>
                                                    <th>Documento</th>
                                                    <th>Nombre</th>
                                                    <th>Teléfono</th>
                                                    <th>Correo</th>
                                                    <th>Dirección</th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- RUTAS -->
                        <div id="contenedor_ru" class="cont-rep" style="display: none;">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white text-primary">
                                    <h6 class="m-0 font-weight-bold"><i class="fas fa-chart-pie mr-2"></i>Visualización Rutas</h6>
                                    <select id="sel-tipo-chart-ru" class="form-control form-control-sm" style="width: 130px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Dona</option>
                                    </select>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3 mb-4"><canvas id="chartRUT" style="max-height: 250px;"></canvas></div>
                                        <div class="col-md-3 mb-4"><canvas id="chartRUE" style="max-height: 250px;"></canvas></div>
                                        <div class="col-md-3 mb-4"><canvas id="chartRUP" style="max-height: 250px;"></canvas></div>
                                        <div class="col-md-3 mb-4"><canvas id="chartRUD" style="max-height: 250px;"></canvas></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white text-primary border-bottom">
                                    <h6 class="m-0 font-weight-bold"><i class="fas fa-table mr-2"></i>Datos de Rutas</h6>
                                    <div id="btn-exp-ru"></div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table id="tabla_ru" class="table table-bordered table-striped table-hover text-center" width="100%">
                                            <thead>
                                                <tr class="bg-primary text-white">
                                                    <th>Creación</th>
                                                    <th>Nombre</th>
                                                    <th>Tipo</th>
                                                    <th>Partida</th>
                                                    <th>Destino</th>
                                                    <th>Salida</th>
                                                    <th>Llegada</th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- REPUESTOS -->
                        <div id="contenedor_re" class="cont-rep" style="display: none;">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white text-primary">
                                    <h6 class="m-0 font-weight-bold"><i class="fas fa-chart-pie mr-2"></i>Visualización Repuestos</h6>
                                    <select id="sel-tipo-chart-re" class="form-control form-control-sm" style="width: 130px;">
                                        <option value="bar">Barras</option>
                                        <option value="pie">Torta</option>
                                        <option value="doughnut">Dona</option>
                                    </select>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6 mb-4"><canvas id="chartREP" style="max-height: 250px;"></canvas></div>
                                        <div class="col-md-6 mb-4"><canvas id="chartREE" style="max-height: 250px;"></canvas></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between bg-white text-primary border-bottom">
                                    <h6 class="m-0 font-weight-bold"><i class="fas fa-table mr-2"></i>Datos de Repuestos</h6>
                                    <div id="btn-exp-re"></div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table id="tabla_re" class="table table-bordered table-striped table-hover text-center" width="100%">
                                            <thead>
                                                <tr class="bg-success text-white">
                                                    <th>Fecha</th>
                                                    <th>Nombre</th>
                                                    <th>Cant.</th>
                                                    <th>Proveedor</th>
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
            </div>
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
        </div>
    </div>
    <script>
        const BASE_URL = "<?= BASE_URL ?>";
    </script>

    <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
    <script src="<?= BASE_URL ?>dist/js/dashboard/Chart.min.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/reportes/transporte.js"></script>
</body>

</html>