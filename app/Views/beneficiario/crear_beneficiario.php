<?php 
$titulo = "Crear Beneficiario";
include BASE_PATH . '/app/Views/template/head.php';
?>

<body id="page-top">
    <!-- Page Wrapper -->
    <div id="wrapper">
        <!-- Sidebar -->
        <?php include BASE_PATH . '/app/Views/template/sidebar.php'; ?>
        <!-- End of Sidebar -->
        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            <!-- Main Content -->
            <div id="content">
                <!-- Topbar -->
                <?php include BASE_PATH . '/app/Views/template/header.php'; ?>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">
                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Beneficiarios</h1>
                    </div>

                    <!-- Content Row - Cards -->
                    <div class="row">
                        <!-- Total de empleados -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-primary shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Total de Beneficiarios</div>
                                            <div class="h5 mb-0 font-weight-bold text-white"><?= $beneficiarios_totales ?? 0; ?></div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-users fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Empleados Activos -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-success shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Beneficiarios Activos</div>
                                            <div class="h5 mb-0 font-weight-bold text-white"><?= $beneficiarios_act ?? 0; ?></div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-user fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Beneficiarios Inactivos -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-warning shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Beneficiarios Inactivos</div>
                                            <div class="h5 mb-0 font-weight-bold text-white"><?= $beneficiarios_inact ?? 0; ?></div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-user-slash fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Nuevos Beneficiarios -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-info shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Beneficiarios con diagnosticos
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-white"><?= $beneficiarios_diag ?? 0; ?></div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-user-plus fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Formulario de Registro -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Registrar Nuevo Beneficiario</h6>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>beneficiario_registrar" method="POST" autocomplete="off" id="formulario-beneficiario">
                                        <div class="row">
                                            <!-- Cédula -->
                                            <div class="col-md-6 mb-3">
                                                <label for="cedula" class="form-label">Cédula</label>
                                                <div class="input-group">
                                                    <select class="form-select w-auto" id="tipo_cedula" name="tipo_cedula" style="max-width: 80px;">
                                                        <option value="V">V</option>
                                                        <option value="E">E</option>
                                                    </select>
                                                    <input type="text" name="cedula" id="cedula" class="form-control" placeholder="Número de cédula" maxlength="8">
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

                                            <!-- Género (más compacto) -->
                                            <div class="col-md-2 mb-3">
                                                <label for="genero" class="form-label">Género</label>
                                                <select name="genero" id="genero" class="form-select">
                                                    <option value="" disabled selected>Seleccione un género</option>
                                                    <option value="M">Masculino</option>
                                                    <option value="F">Femenino</option>
                                                </select>
                                                <div id="generoError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Fecha de Nacimiento -->
                                            <div class="col-md-6 mb-3">
                                                <label for="fecha_nac" class="form-label">Fecha de Nacimiento</label>
                                                <input type="date" class="form-control" id="fecha_nac" name="fecha_nac">
                                                <div id="fecha_nacError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Sección -->
                                            <div class="col-md-6 mb-3">
                                                <label for="seccion_numero" class="form-label">Sección</label>
                                                <div class="row g-2 align-items-center">
                                                    <div class="col-md-6">
                                                        <input type="text" name="seccion_numero" id="seccion_numero" class="form-control" placeholder="Número" maxlength="4" pattern="[1-4][0-9]{3}" title="Debe ingresar 4 dígitos comenzando con 1-4">
                                                        <div id="seccion_numeroError" class="form-text text-danger"></div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <select name="seccion_sede" id="seccion_sede" class="form-select select2">
                                                            <option value="" disabled selected>Seleccione una sede</option>
                                                            <option value="M">MORÁN</option>
                                                            <option value="C">CRESPO</option>
                                                            <option value="J">JIMÉNEZ</option>
                                                            <option value="U">URDANETA</option>
                                                            <option value="B">BARQUISIMETO</option>
                                                        </select>
                                                        <div id="seccion_sedeError" class="form-text text-danger"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- PNF -->
                                            <div class="col-md-6 mb-3">
                                                <label for="id_pnf" class="form-label">PNF</label>
                                                <select name="id_pnf" id="id_pnf" class="select2" data-placeholder="Seleccione un PNF">
                                                    <option value="" disabled selected></option>
                                                    <?php 
                                                    foreach ($pnfs as $pnf): 
                                                    ?>
                                                        <option value="<?= $pnf['id_pnf'] ?>"><?= htmlspecialchars($pnf['nombre_pnf']) ?></option>
                                                    <?php endforeach; ?>
                                                </select>
                                                <div id="id_pnfError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Dirección (textarea completo) -->
                                            <div class="col-12 mb-3">
                                                <label for="direccion" class="form-label">Dirección</label>
                                                <textarea class="form-control" id="direccion" name="direccion" placeholder="Dirección completa" rows="3"></textarea>
                                                <div id="direccionError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-end gap-2">
                                                    <button type="reset" class="btn btn-secondary">Limpiar Formulario</button>
                                                    <button type="submit" id="btnRegistrar" class="btn btn-primary">Registrar Beneficiario</button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Campos hidden para teléfono completo y sección completa -->
                                        <input type="hidden" name="telefono" id="telefono">
                                        <input type="hidden" name="seccion" id="seccion">
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
            <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->
    <script>
        const BASE_URL = '<?= BASE_URL ?>';
    </script>

   <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
   <script src="<?= BASE_URL ?>dist/js/modulos/beneficiario/crear_beneficiario.js"></script>

</body>
</html>