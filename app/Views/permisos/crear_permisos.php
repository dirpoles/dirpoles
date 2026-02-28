<?php 
$titulo = "Crear Permisos";
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
                        <h1 class="h2 mb-0 text-gray-800">Gestionar Permisos de Empleados</h1>
                    </div>

                    <!-- Content Row - Cards -->
                    <div class="row">
                        <!-- Roles con permisos asignados -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-info shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Roles con permisos
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($roles_con_permisos) ?? 0 ?>
                                            </div>
                                            <div class="text-xs text-white-50 mt-1">
                                                Tipos de empleados con permisos asignados
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-users-gear fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Permisos otorgados -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-primary shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Permisos otorgados
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($total_permisos_otorgados) ?? 0 ?>
                                            </div>
                                            <div class="text-xs text-white-50 mt-1">
                                                Total de asignaciones en el sistema
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-key fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Módulo más usado -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-warning shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Módulo más usado
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($modulo_mas_usado) ?? 0 ?>
                                            </div>
                                            <div class="text-xs text-white-50 mt-1">
                                                Con mayor cobertura de roles
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-layer-group fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Acción más frecuente -->
                        <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card text-bg-success shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-white text-uppercase mb-1">
                                                Acción más frecuente
                                            </div>
                                            <div class="h5 mb-0 font-weight-bold text-white">
                                                <?= htmlspecialchars($accion_mas_frecuente) ?? 0 ?>
                                            </div>
                                            <div class="text-xs text-white-50 mt-1">
                                                Permiso más asignado (Crear, Leer, Editar, Eliminar)
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fa-solid fa-shield-halved fa-2x text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Formulario de Registro y Edición de Permisos por Empleado -->
                    <div class="row" id="dashboard-permisos">
                        <!-- Cards de cada Tipo de Empleado -->
                        <?php foreach ($data['tipos_empleado'] as $rol): ?>
                        <div class="col-xl-4 col-lg-6 mb-4">
                            <div class="card border-left-primary shadow h-100">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-user-tag me-2"></i><?= htmlspecialchars($rol['tipo']) ?>
                                    </h6>
                                    <span class="badge bg-info"><?= count($data['modulos']) ?> módulos</span>
                                </div>
                                <div class="card-body">
                                    <!-- Filtro rápido dentro de la card -->
                                    <div class="input-group mb-3">
                                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                                        <input type="text" class="form-control filter-modules" 
                                            placeholder="Buscar módulo..." data-rol-id="<?= $rol['id_tipo_emp'] ?>">
                                    </div>
                                    
                                    <!-- Lista de módulos con acordeón -->
                                    <div class="accordion accordion-flush" id="accordionRol<?= $rol['id_tipo_emp'] ?>">
                                        <?php foreach ($data['modulos'] as $mod): ?>
                                        <div class="accordion-item module-item">
                                            <h2 class="accordion-header">
                                                <button class="accordion-button collapsed" type="button" 
                                                        data-bs-toggle="collapse" 
                                                        data-bs-target="#collapse<?= $rol['id_tipo_emp'] ?>_<?= $mod['id_modulo'] ?>">
                                                    <i class="fas fa-folder me-2 text-warning"></i>
                                                    <?= htmlspecialchars($mod['nombre']) ?>
                                                    <span class="badge bg-secondary ms-2 permission-count" 
                                                        data-rol="<?= $rol['id_tipo_emp'] ?>" 
                                                        data-modulo="<?= $mod['id_modulo'] ?>">
                                                        <!-- Se actualizará con JS -->
                                                    </span>
                                                </button>
                                            </h2>
                                            <div id="collapse<?= $rol['id_tipo_emp'] ?>_<?= $mod['id_modulo'] ?>" 
                                                class="accordion-collapse collapse" 
                                                data-bs-parent="#accordionRol<?= $rol['id_tipo_emp'] ?>">
                                                <div class="accordion-body">
                                                    <!-- Permisos como botones toggle -->
                                                    <div class="d-flex flex-wrap gap-2">
                                                        <?php foreach ($data['permisos'] as $perm): ?>
                                                        <?php $tienePermiso = in_array($perm['id_permiso'], 
                                                            $data['mapa_permisos'][$rol['id_tipo_emp']][$mod['id_modulo']] ?? [], 
                                                            true); ?>
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input permission-toggle" 
                                                                type="checkbox" 
                                                                role="switch"
                                                                name="perm[<?= $rol['id_tipo_emp'] ?>][<?= $mod['id_modulo'] ?>][<?= $perm['id_permiso'] ?>]"
                                                                value="<?= $perm['id_permiso'] ?>"
                                                                id="perm_<?= $rol['id_tipo_emp'] ?>_<?= $mod['id_modulo'] ?>_<?= $perm['id_permiso'] ?>"
                                                                <?= $tienePermiso ? 'checked' : '' ?>
                                                                data-rol="<?= $rol['id_tipo_emp'] ?>"
                                                                data-modulo="<?= $mod['id_modulo'] ?>"
                                                                data-permiso="<?= $perm['id_permiso'] ?>">
                                                            <label class="form-check-label" 
                                                                for="perm_<?= $rol['id_tipo_emp'] ?>_<?= $mod['id_modulo'] ?>_<?= $perm['id_permiso'] ?>">
                                                                <span class="badge 
                                                                    <?= $tienePermiso ? 'bg-success' : 'bg-light text-dark' ?>">
                                                                    <i class="fas fa-<?= 
                                                                        $perm['clave'] == 'crear' ? 'plus' : 
                                                                        ($perm['clave'] == 'leer' ? 'eye' : 
                                                                        ($perm['clave'] == 'editar' ? 'edit' : 'trash')) 
                                                                    ?> me-1"></i>
                                                                    <?= ucfirst($perm['clave']) ?>
                                                                </span>
                                                            </label>
                                                        </div>
                                                        <?php endforeach; ?>
                                                    </div>
                                                    
                                                    <!-- Quick Actions -->
                                                    <div class="mt-3 pt-2 border-top">
                                                        <button type="button" 
                                                                class="btn btn-sm btn-outline-success select-all-perms"
                                                                data-rol="<?= $rol['id_tipo_emp'] ?>"
                                                                data-modulo="<?= $mod['id_modulo'] ?>">
                                                            <i class="fas fa-check-double"></i> Seleccionar todos
                                                        </button>
                                                        <button type="button" 
                                                                class="btn btn-sm btn-outline-danger deselect-all-perms"
                                                                data-rol="<?= $rol['id_tipo_emp'] ?>"
                                                                data-modulo="<?= $mod['id_modulo'] ?>">
                                                            <i class="fas fa-times"></i> Limpiar todos
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <small class="text-muted">
                                        <i class="fas fa-sync-alt"></i> Los cambios se guardan al enviar el formulario
                                    </small>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>

                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <!-- Footer -->
            
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->
        <?php include BASE_PATH . '/app/Views/template/footer.php'; ?>
    </div>
    <!-- End of Page Wrapper -->

   <?php include BASE_PATH . '/app/Views/template/script.php'; ?>
   <script src="<?= BASE_URL ?>dist/js/modulos/permisos/permisos_manager.js"></script>

</body>
</html>