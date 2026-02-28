<!-- Modal para detalle de horario - Versión Corregida -->
<div class="modal fade" id="modalHorarioDetalle" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <!-- Header elegante -->
            <div class="modal-header border-0 pb-0 pt-4 px-4">
                <div class="w-100">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="d-flex align-items-center">
                            <div class="bg-primary p-3 rounded-circle me-3">
                                <i class="fas fa-calendar-alt fa-lg text-white"></i>
                            </div>
                            <div>
                                <h5 class="modal-title text-primary mb-0">Detalle del Horario</h5>
                                <small class="text-muted">Información del turno asignado</small>
                            </div>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <!-- Barra de estado mejorada -->
                    <div class="d-flex align-items-center gap-2 mb-3" id="modal-status-bar">
                        <!-- Se llenará dinámicamente -->
                    </div>
                </div>
            </div>
            
            <!-- Body reorganizado -->
            <div class="modal-body pt-0 px-4">
                <div class="row g-4">
                    <!-- Columna izquierda: Información principal -->
                    <div class="col-lg-7">
                        <div class="card border-0 bg-light h-100">
                            <div class="card-body p-4">
                                <!-- Psicólogo -->
                                <div class="mb-4">
                                    <h6 class="text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-user-md me-2"></i> Psicólogo Asignado
                                    </h6>
                                    <div class="d-flex align-items-center p-3 bg-white rounded border">
                                        <div class="flex-shrink-0">
                                            <div class="avatar-circle bg-primary">
                                                <i class="fas fa-user text-white"></i>
                                            </div>
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h5 class="mb-1" id="detalle-nombre-psicologo"></h5>
                                            <p class="mb-0">
                                                <i class="fas fa-id-card text-muted me-1"></i>
                                                <span id="detalle-cedula" class="text-muted"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Información del turno -->
                                <div class="mb-4">
                                    <h6 class="text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-clock me-2"></i> Información del Turno
                                    </h6>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <div class="card border-0 bg-white shadow-sm">
                                                <div class="card-body text-center py-4">
                                                    <div class="text-primary mb-2">
                                                        <i class="fas fa-calendar-day fa-2x"></i>
                                                    </div>
                                                    <h4 class="mb-1" id="detalle-dia-badge"></h4>
                                                    <small class="text-muted">Día de la semana</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card border-0 bg-white shadow-sm">
                                                <div class="card-body text-center py-4">
                                                    <div class="text-success mb-2">
                                                        <i class="fas fa-hourglass-half fa-2x"></i>
                                                    </div>
                                                    <h4 class="mb-1" id="detalle-duracion"></h4>
                                                    <small class="text-muted">Duración total</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Horario específico -->
                                <div>
                                    <h6 class="text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-business-time me-2"></i> Horario Exacto
                                    </h6>
                                    <div class="card border-0 bg-white shadow-sm">
                                        <div class="card-body">
                                            <div class="row align-items-center text-center">
                                                <div class="col-md-5">
                                                    <div class="bg-primary bg-opacity-25 p-4 rounded">
                                                        <div class="text-primary">
                                                            <i class="fas fa-play-circle fa-2x mb-2"></i>
                                                        </div>
                                                        <h3 class="mb-1 text-primary fw-bold" id="detalle-hora-inicio"></h3>
                                                        <small class="text-muted">Hora de inicio</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-2">
                                                    <div class="position-relative h-100 d-flex align-items-center justify-content-center">
                                                        <div class="bg-primary bg-opacity-25 w-100" style="height: 2px;"></div>
                                                        <div class="position-absolute bg-white p-2">
                                                            <i class="fas fa-arrow-right text-primary"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-5">
                                                    <div class="bg-success bg-opacity-25 p-4 rounded">
                                                        <div class="text-success">
                                                            <i class="fas fa-stop-circle fa-2x mb-2"></i>
                                                        </div>
                                                        <h3 class="mb-1 text-success fw-bold" id="detalle-hora-fin"></h3>
                                                        <small class="text-muted">Hora de fin</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Columna derecha: Estadísticas -->
                    <div class="col-lg-5">
                        <div class="card border-0 bg-light h-100">
                            <div class="card-body p-4">
                                <h6 class="text-primary mb-3 d-flex align-items-center">
                                    <i class="fas fa-chart-pie me-2"></i> Estadísticas Semanales
                                </h6>
                                
                                <!-- Resumen -->
                                <div class="alert alert-info border-0">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-info-circle fa-lg me-3"></i>
                                        <div>
                                            <small class="d-block mb-1">Este psicólogo tiene asignado:</small>
                                            <div class="d-flex align-items-center">
                                                <strong id="detalle-total-horarios">0</strong>
                                                <span class="ms-2">horarios esta semana</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Estadísticas -->
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item border-0 bg-transparent d-flex justify-content-between align-items-center px-0 py-3">
                                        <div class="d-flex align-items-center">
                                            <div class="bg-info bg-opacity-25 p-2 rounded me-3">
                                                <i class="fas fa-calendar-alt text-info"></i>
                                            </div>
                                            <div>
                                                <small class="text-muted d-block">Días asignados</small>
                                                <h5 class="mb-0" id="detalle-total-dias">0</h5>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="list-group-item border-0 bg-transparent d-flex justify-content-between align-items-center px-0 py-3">
                                        <div class="d-flex align-items-center">
                                            <div class="bg-warning bg-opacity-25 p-2 rounded me-3">
                                                <i class="fas fa-clock text-warning"></i>
                                            </div>
                                            <div>
                                                <small class="text-muted d-block">Horas semanales</small>
                                                <h5 class="mb-0" id="detalle-total-horas">0</h5>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="list-group-item border-0 bg-transparent d-flex justify-content-between align-items-center px-0 py-3">
                                        <div class="d-flex align-items-center">
                                            <div class="bg-success bg-opacity-25 p-2 rounded me-3">
                                                <i class="fas fa-user-clock text-success"></i>
                                            </div>
                                            <div>
                                                <small class="text-muted d-block">Promedio diario</small>
                                                <h5 class="mb-0" id="detalle-promedio-diario">0</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Información adicional -->
                                <div class="mt-4 pt-3 border-top">
                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-lightbulb text-warning me-2"></i>
                                        <small class="text-muted">
                                            <strong>Nota:</strong> Los horarios son fijos y se mantienen semana a semana.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer con acciones -->
            <div class="modal-footer border-top-0 bg-light pt-3 pb-4 px-4">
                <div class="w-100 d-flex justify-content-between align-items-center">
                    <div class="text-muted">
                        <small>
                            <i class="fas fa-calendar me-1"></i>
                            Sistema de Gestión de Horarios - DIRPOLES 4
                        </small>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cerrar
                        </button>
                        <button type="button" class="btn btn-info" id="btn-editar-modal">
                            <i class="fas fa-edit me-1"></i> Editar
                        </button>
                        <button type="button" class="btn btn-danger" id="btn-eliminar-modal">
                            <i class="fas fa-trash-alt me-1"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Estilos CSS adicionales -->
<style>
.avatar-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
}

.bg-primary.bg-opacity-25 {
    background-color: rgba(13, 110, 253, 0.15) !important;
}

.bg-success.bg-opacity-25 {
    background-color: rgba(25, 135, 84, 0.15) !important;
}

.bg-warning.bg-opacity-25 {
    background-color: rgba(255, 193, 7, 0.15) !important;
}

.bg-info.bg-opacity-25 {
    background-color: rgba(13, 202, 240, 0.15) !important;
}

/* Asegurar que los colores de texto sean visibles */
.text-primary.fw-bold {
    color: #0d6efd !important;
    font-weight: 700 !important;
}

.text-success.fw-bold {
    color: #198754 !important;
    font-weight: 700 !important;
}

/* Mejoras en la barra de estado */
#modal-status-bar .badge {
    font-size: 0.8rem;
    padding: 6px 12px;
    border-radius: 20px;
}

/* Responsive */
@media (max-width: 992px) {
    .modal-dialog.modal-lg {
        margin: 1rem;
        max-width: calc(100% - 2rem);
    }
    
    .modal-body .row.g-4 {
        gap: 1.5rem !important;
    }
    
    .col-lg-7, .col-lg-5 {
        width: 100% !important;
    }
}
</style>