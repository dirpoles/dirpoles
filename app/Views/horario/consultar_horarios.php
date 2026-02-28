<?php 
$titulo = "Consultar Horarios";
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
                        <h1 class="h3 mb-0 text-gray-800">Gestionar Horarios</h1>
                    </div>

                    <!-- Content Row -->
                    <div class="row">
                        <div class="col-lg-12 mb-4">
                            <div class="card shadow mb-4">
                                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 class="m-0 font-weight-bold text-primary">
                                        <i class="fas fa-calendar-alt me-2"></i> Horarios de Psicología
                                    </h6>
                                    <button type="button" class="btn btn-success" id="btn-nuevo-horario">
                                        <i class="fa-solid fa-clock me-1"></i> Nuevo Horario
                                    </button>
                                </div>
                                <div class="card-body">
                                    <!-- Filtros -->
                                    <div class="row mb-4">
                                        <div class="col-md-4">
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                                <input type="text" class="form-control" id="filter-psicologo" 
                                                    placeholder="Buscar psicólogo...">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <select class="form-select select2" id="filter-dia">
                                                <option value="">Todos los días</option>
                                                <option value="Lunes">Lunes</option>
                                                <option value="Martes">Martes</option>
                                                <option value="Miércoles">Miércoles</option>
                                                <option value="Jueves">Jueves</option>
                                                <option value="Viernes">Viernes</option>
                                                <option value="Sábado">Sábado</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- Calendario Semanal -->
                                    <div class="table-responsive" id="calendario-semanal">
                                        <table class="table table-bordered align-middle text-center">
                                            <thead class="table-light">
                                                <tr>
                                                    <th width="20%" class="psicologo-header">Psicólogo</th>
                                                    <th width="12%">Lunes</th>
                                                    <th width="12%">Martes</th>
                                                    <th width="12%">Miércoles</th>
                                                    <th width="12%">Jueves</th>
                                                    <th width="12%">Viernes</th>
                                                    <th width="12%">Sábado</th>
                                                </tr>
                                            </thead>
                                            <tbody id="calendario-body">
                                                <!-- Se cargará con AJAX -->
                                                <tr>
                                                    <td colspan="8" class="text-center py-5">
                                                        <div class="spinner-border text-primary" role="status">
                                                            <span class="visually-hidden">Cargando...</span>
                                                        </div>
                                                        <p class="mt-2 text-muted">Cargando horarios...</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <!-- Leyenda -->
                                    <!-- Leyenda mejorada y más útil -->
                                    <div class="row mt-4">
                                        <div class="col-md-12">
                                            <div class="card border-0 shadow-sm">
                                                <div class="card-body py-2">
                                                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                                                        <div class="d-flex flex-wrap gap-3">
                                                            <span class="d-flex align-items-center">
                                                                <span class="badge bg-success me-2" style="width: 20px; height: 20px;"></span>
                                                                <small>Horario completo (+6h) <i class="fas fa-info-circle"></i></small>
                                                            </span>
                                                            <span class="d-flex align-items-center">
                                                                <span class="badge bg-warning me-2" style="width: 20px; height: 20px;"></span>
                                                                <small>Horario parcial (3-6h) <i class="fas fa-info-circle"></i></small>
                                                            </span>
                                                            <span class="d-flex align-items-center">
                                                                <span class="badge bg-danger me-2" style="width: 20px; height: 20px;"></span>
                                                                <small>Horario corto (0-3h) <i class="fas fa-info-circle"></i></small>
                                                            </span>
                                                        </div>
                                                        <div class="text-end">
                                                            <small class="text-muted">
                                                                <i class="fas fa-mouse-pointer me-1"></i> Click en cualquier horario para ver detalles
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <?php require_once BASE_PATH . '/app/Views/horario/modal_consulta.php'; ?>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- End of Main Content -->
            <?php require_once BASE_PATH . '/app/Views/horario/modalEditar.php'; ?>
            <!-- Footer -->
            <?php include 'app/Views/template/footer.php'; ?>
            <!-- End of Footer -->
        </div>
        <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

   <?php include 'app/Views/template/script.php'; ?>
   <!-- Script principal de la página -->
   
   <script src="<?php BASE_URL ?>dist/js/modulos/horario/editar_horario.js"></script>
   <script src="<?php BASE_URL ?>dist/js/modulos/horario/validar_editar_horario.js"></script>
   <script src="<?php BASE_URL ?>dist/js/modulos/horario/eliminar_horario.js"></script>
   <script src="<?php BASE_URL ?>dist/js/modulos/horario/calendario_horario.js"></script>

   <style>
    /* calendario_horarios.css */
    #calendario-semanal table {
        font-size: 0.9rem;
    }

    #calendario-semanal th {
        font-weight: 600;
        background-color: #f8f9fa;
        vertical-align: middle;
        padding: 12px 8px;
    }

    #calendario-semanal td {
        padding: 8px;
        vertical-align: top;
        height: 120px;
        position: relative;
    }

    .psicologo-header {
        text-align: left !important;
        padding-left: 16px !important;
        background-color: #e9ecef;
    }

    .horario-cell {
        min-height: 100px;
        border: 1px solid #dee2e6;
    }

    .horario-item {
        margin-bottom: 4px;
        padding: 6px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
        border-left: 3px solid;
    }

    .horario-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .horario-normal {
        background-color: #d1e7dd;
        border-left-color: #198754;
        color: #0f5132;
    }

    .horario-parcial {
        background-color: #fff3cd;
        border-left-color: #ffc107;
        color: #664d03;
    }

    .horario-conflicto {
        background-color: #f8d7da;
        border-left-color: #dc3545;
        color: #842029;
    }

    .horario-empty {
        color: #6c757d;
        font-style: italic;
        font-size: 0.85rem;
    }

    .psicologo-row td:first-child {
        font-weight: 500;
        background-color: #f8f9fa;
        border-right: 2px solid #dee2e6;
    }

    .horario-time {
        font-weight: 600;
        display: block;
        margin-bottom: 2px;
    }

    .horario-actions {
        display: flex;
        gap: 4px;
        margin-top: 4px;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .horario-item:hover .horario-actions {
        opacity: 1;
    }

    .horario-actions .btn {
        padding: 1px 4px;
        font-size: 0.7rem;
    }

    /* Para días sin horarios */
    .dia-vacio {
        background-color: #f8f9fa;
    }

    

    /* Mejoras visuales generales */
.horario-item {
    position: relative;
    overflow: hidden;
}

.horario-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
}

.horario-normal::before { background-color: #198754; }
.horario-parcial::before { background-color: #ffc107; }
.horario-conflicto::before { background-color: #dc3545; }

/* Efecto hover mejorado */
.horario-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 10;
}

/* Responsive para móviles */
@media (max-width: 768px) {
    .psicologo-header {
        font-size: 0.85rem;
    }
    
    .horario-time {
        font-size: 0.75rem;
    }
    
    .horario-actions .btn {
        padding: 2px 5px;
        font-size: 0.7rem;
    }
}

/* Animaciones suaves */
.psicologo-row {
    transition: all 0.3s ease;
}

.psicologo-row:hover {
    background-color: #f8f9fa;
}
   </style>

</body>
</html>