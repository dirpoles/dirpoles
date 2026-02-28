<?php
$titulo = "Detallar Jornada";
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
                        <h1 class="h3 mb-0 text-gray-800">Detallar Jornada Médica</h1>
                        <a href="consultar_jornadas" class="btn btn-primary">Volver</a>
                    </div>

                    <!-- Content Row -->
                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-info-circle me-2"></i>Jornada Médica
                                    </h6>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6 border-right">
                                            <p>
                                                <i class="fas fa-tag text-gray-400 me-2"></i>
                                                <b>Nombre Jornada:</b> <span id="nombre_jornada" class="text-dark ml-2"></span>
                                            </p>
                                            <p>
                                                <i class="fas fa-layer-group text-gray-400 me-2"></i>
                                                <b>Tipo Jornada:</b> <span id="tipo_jornada" class="text-dark ml-2"></span>
                                            </p>
                                            <p>
                                                <i class="fas fa-users text-gray-400 me-2"></i>
                                                <b>Aforo Máximo:</b> <span id="aforo_maximo" class="badge bg-info text-white ml-2"></span>
                                            </p>
                                            <p>
                                                <i class="fas fa-map-marker-alt text-gray-400 me-2"></i>
                                                <b>Ubicación:</b> <span id="ubicacion" class="text-dark ml-2"></span>
                                            </p>
                                        </div>

                                        <div class="col-md-6">
                                            <p>
                                                <i class="fas fa-calendar-alt text-gray-400 me-2"></i>
                                                <b>Fecha Inicio:</b> <span id="fecha_inicio" class="text-dark ml-2"></span>
                                            </p>
                                            <p>
                                                <i class="fas fa-calendar-check text-gray-400 me-2"></i>
                                                <b>Fecha Fin:</b> <span id="fecha_fin" class="text-dark ml-2"></span>
                                            </p>
                                            <hr>
                                            <p>
                                                <i class="fas fa-align-left text-gray-400 me-2"></i>
                                                <b>Descripción:</b>
                                            </p>
                                            <div class="bg-light p-3 rounded">
                                                <span id="descripcion" class="text-muted"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contador de Aforo -->
                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4 border-left-primary">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Aforo de la Jornada
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                                <span id="beneficiarios_count">0</span> / <span id="aforo_max_display">0</span> Beneficiarios
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-users fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <div class="progress">
                                            <div id="progress_aforo" class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Beneficiarios Atendidos</h6>
                                </div>
                                <div class="card-body">
                                    <table id="tabla_beneficiarios_atendidos" class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Nombres</th>
                                                <th>Apellidos</th>
                                                <th>Cédula</th>
                                                <th>Edad</th>
                                                <th>Género</th>
                                                <th>Tipo</th>
                                                <th>Telefono</th>
                                                <th>Fecha de Atención</th>
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

                    <!-- Formulario para agregar beneficiario -->
                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Agregar Beneficiario a la Jornada</h6>
                                </div>
                                <div class="card-body">
                                    <form id="formulario-beneficiario-jornada" autocomplete="off">
                                        <div class="row">
                                            <!-- Cédula -->
                                            <div class="col-md-6 mb-3">
                                                <label for="cedula" class="form-label">Cédula</label>
                                                <div class="input-group">
                                                    <select class="form-select w-auto" id="tipo_cedula" name="tipo_cedula" style="max-width: 80px;">
                                                        <option value="V">V</option>
                                                        <option value="E">E</option>
                                                    </select>
                                                    <input type="text" name="cedula" id="cedula" class="form-control" placeholder="Número de cédula" maxlength="15">
                                                </div>
                                                <div id="cedulaError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Nombres -->
                                            <div class="col-md-6 mb-3">
                                                <label for="nombres" class="form-label">Nombres</label>
                                                <input type="text" name="nombres" id="nombres" class="form-control" placeholder="Nombres del beneficiario">
                                                <div id="nombresError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Apellidos -->
                                            <div class="col-md-6 mb-3">
                                                <label for="apellidos" class="form-label">Apellidos</label>
                                                <input type="text" name="apellidos" id="apellidos" class="form-control" placeholder="Apellidos del beneficiario">
                                                <div id="apellidosError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Correo -->
                                            <div class="col-md-6 mb-3">
                                                <label for="correo" class="form-label">Correo Electrónico</label>
                                                <input type="email" name="correo" id="correo" class="form-control" placeholder="correo@gmail.com">
                                                <div id="correoError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Teléfono -->
                                            <div class="col-md-4 mb-3">
                                                <label for="telefono" class="form-label">Teléfono</label>
                                                <div class="input-group">
                                                    <select name="telefono_prefijo" id="telefono_prefijo" class="form-select w-auto" style="max-width: 100px;">
                                                        <option value="" disabled selected>Prefijo</option>
                                                        <option value="0416">0416</option>
                                                        <option value="0426">0426</option>
                                                        <option value="0414">0414</option>
                                                        <option value="0424">0424</option>
                                                        <option value="0412">0412</option>
                                                        <option value="0422">0422</option>
                                                    </select>
                                                    <input type="text" name="telefono_numero" id="telefono_numero" class="form-control" placeholder="Número" maxlength="7">
                                                </div>
                                                <div id="telefonoError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Género -->
                                            <div class="col-md-2 mb-3">
                                                <label for="genero" class="form-label">Género</label>
                                                <select name="genero" id="genero" class="form-select">
                                                    <option value="" disabled selected>Seleccione</option>
                                                    <option value="Masculino">Masculino</option>
                                                    <option value="Femenino">Femenino</option>
                                                </select>
                                                <div id="generoError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Fecha de Nacimiento -->
                                            <div class="col-md-6 mb-3">
                                                <label for="fecha_nacimiento" class="form-label">Fecha de Nacimiento</label>
                                                <input type="date" class="form-control" id="fecha_nacimiento" name="fecha_nacimiento">
                                                <div id="fecha_nacimientoError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Tipo de Paciente -->
                                            <div class="col-md-6 mb-3">
                                                <label for="tipo_paciente" class="form-label">Tipo de Paciente</label>
                                                <select name="tipo_paciente" id="tipo_paciente" class="form-select">
                                                    <option value="" disabled selected>Seleccione un tipo</option>
                                                    <option value="Estudiante">Estudiante</option>
                                                    <option value="Personal Obrero">Personal Obrero</option>
                                                    <option value="Personal Docente">Personal Docente</option>
                                                    <option value="Personal Administrativo">Personal Administrativo</option>
                                                    <option value="Comunidad">Comunidad</option>
                                                </select>
                                                <div id="tipo_pacienteError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Dirección -->
                                            <div class="col-md-6 mb-3">
                                                <label for="direccion" class="form-label">Dirección</label>
                                                <textarea class="form-control" id="direccion" name="direccion" placeholder="Dirección completa" rows="3"></textarea>
                                                <div id="direccionError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="reset" class="btn btn-secondary">Limpiar Formulario</button>
                                                    <button type="submit" id="btnAgregar" class="btn btn-primary">Agregar Beneficiario</button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Campos hidden -->
                                        <input type="hidden" name="telefono" id="telefono">
                                        <input type="hidden" name="id_jornada" id="id_jornada">
                                    </form>
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

    <!-- Modal para Diagnóstico -->
    <div class="modal fade" id="modalDiagnostico" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalDiagnosticoTitle">Agregar Diagnóstico</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <!-- El contenido se carga dinámicamente -->
                </div>
            </div>
        </div>
    </div>

    <?php include 'app/Views/template/script.php'; ?>
    <!-- Scripts para esta página -->
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/detallarJornada.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/validarBeneficiarioJornada.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/diagnostico_jornada/agregarDiagnostico.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/diagnostico_jornada/verDiagnostico.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/diagnostico_jornada/editarDiagnostico.js"></script>
    <script src="<?= BASE_URL ?>dist/js/modulos/jornadas/diagnostico_jornada/validarEditarDiagnosticoJornada.js"></script>

</body>

</html>