<?php 
$titulo = "Crear Empleado";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Empleados</h1>
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
                                                Total de Empleados</div>
                                            <div class="h5 mb-0 font-weight-bold text-white"><?= $total_empleados ?? 0; ?></div>
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
                                                Empleados Activos</div>
                                            <div class="h5 mb-0 font-weight-bold text-white"><?= $empleados_act ?? 0; ?></div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-user fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empleados Inactivos -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-warning shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Empleados Inactivos</div>
                                            <div class="h5 mb-0 font-weight-bold text-white"><?= $empleados_inact ?? 0; ?></div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-user-slash fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Nuevos Empleados -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-info shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Nuevos Empleados (este mes)
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-white"><?= $empleados_nuevos_mes ?? 0; ?></div>
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
                                    <h6 class="m-0 font-weight-bold text-primary">Registrar Nuevo Empleado</h6>
                                </div>
                                <div class="card-body">
                                    <form action="<?= BASE_URL ?>empleado_registrar" method="POST" autocomplete="off" id="formulario-empleado">
                                        <div class="row">
                                            <!-- Cédula -->
                                            <div class="col-md-6 mb-3">
                                                <label for="cedula" class="form-label">Cédula</label>
                                                <div class="input-group">
                                                    <select class="form-select w-auto" id="tipo_cedula" name="tipo_cedula" style="max-width: 80px;">
                                                        <option value="V">V</option>
                                                        <option value="E">E</option>
                                                    </select>
                                                    <input type="text" name="cedula" id="cedula" class="form-control" placeholder="Número de cédula" maxlength="8" >
                                                </div>
                                                <div id="cedulaError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Nombre -->
                                            <div class="col-md-6 mb-3">
                                                <label for="nombre" class="form-label">Nombre</label>
                                                <input type="text" name="nombre" id="nombre" class="form-control" placeholder="Nombre del empleado" >
                                                <div id="nombreError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Apellido -->
                                            <div class="col-md-6 mb-3">
                                                <label for="apellido" class="form-label">Apellido</label>
                                                <input type="text" name="apellido" id="apellido" class="form-control" placeholder="Apellido del empleado">
                                                <div id="apellidoError" class="form-text text-danger"></div>
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
                                            <div class="col-md-6 mb-3">
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
                                                    <div id="telefono_numeroError" class="form-text text-danger"></div>
                                                </div>
                                                <div id="telefonoError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Tipo de Empleado -->
                                            <div class="col-md-6 mb-3">
                                                <label for="id_tipo_empleado" class="form-label">Cargo</label>
                                                <select name="id_tipo_empleado" id="id_tipo_empleado" class="select2" data-placeholder="Seleccione un cargo">
                                                    <option value="" disabled selected></option>
                                                    <?php 
                                                    foreach ($tipos_empleado as $tipo): 
                                                    ?>
                                                        <option value="<?= $tipo['id_tipo_emp'] ?>"><?= htmlspecialchars($tipo['tipo']) ?></option>
                                                    <?php endforeach; ?>
                                                </select>
                                                <div id="id_tipo_empleadoError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Fecha de Nacimiento -->
                                            <div class="col-md-4 mb-3">
                                                <label for="fecha_nacimiento" class="form-label">Fecha de Nacimiento</label>
                                                <input type="date" class="form-control" id="fecha_nacimiento" name="fecha_nacimiento">
                                                <div id="fecha_nacimientoError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Clave -->
                                            <div class="col-md-4 mb-3">
                                                <label for="clave" class="form-label">Contraseña</label>
                                                <input type="password" class="form-control" id="clave" name="clave" autocomplete="false" placeholder="Escribe una contraseña" maxlength="50">
                                                <div id="claveError" class="form-text text-danger"></div>
                                            </div>

                                            <!-- Estatus (Oculto) -->
                                            <div class="col-md-4 mb-3">
                                                <label for="estatus" class="form-label">Estatus</label>
                                                <select class="form-select" id="estatus" name="estatus">
                                                    <option value="" disabled selected>Seleccionar</option>
                                                    <option value="1">Activo</option>
                                                    <option value="0">Inactivo</option>
                                                </select>
                                                <div id="estatusError" class="form-text text-danger"></div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <!-- Dirección -->
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
                                                    <button type="submit" id="btnRegistrar" class="btn btn-primary">Registrar Empleado</button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Campo hidden para teléfono completo -->
                                        <input type="hidden" name="telefono" id="telefono">
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
        // Agregar esto antes de cargar tu script
        const BASE_URL = '<?= BASE_URL ?>';
    </script>

   <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
   <script src="<?= BASE_URL ?>dist/js/modulos/empleado/crear_empleado.js"></script>

</body>
</html>