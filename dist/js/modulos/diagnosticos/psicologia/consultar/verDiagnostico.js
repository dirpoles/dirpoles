/**
 * Función para mostrar los detalles de una cita en un modal
 * @param {number} id - ID de la cita
 */
function verDiagnostico(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Detalle del Diagnóstico');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del diagnóstico...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'diagnostico_detalle',
        method: 'GET',
        data: { id_psicologia: id },
        dataType: 'json',
        success: function (data) {

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalDiagnostico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este diagnóstico.
                    </div>
                `);
                return;
            }
            const psicologia = data.data;

            //Formatear datos
            const beneficiario = `${psicologia.beneficiario}`.trim();
            const empleado = `${psicologia.empleado}`.trim();
            const tipoConsulta = psicologia.tipo_consulta;
            const diagnostico = psicologia.diagnostico;
            const tratamiento_gen = psicologia.tratamiento_gen;
            const motivo_retiro = psicologia.motivo_retiro;
            const duracion_retiro = psicologia.duracion_retiro;
            const motivo_cambio = psicologia.motivo_cambio;
            const observaciones = psicologia.observaciones;
            const fecha_creacion = psicologia.fecha_creacion;

            const modalContent = generarContenidoModalPsicologia({
                beneficiario,
                empleado,
                tipoConsulta,
                diagnostico,
                tratamiento_gen,
                motivo_retiro,
                duracion_retiro,
                motivo_cambio,
                observaciones,
                fecha_creacion
            });

            //Mostrar modal
            $('#modalDiagnostico .modal-body').html(modalContent);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //Mostrar error en el modal
            $('#modalGlobal .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del diagnóstico. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verDiagnostico(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
/**
 * Genera el contenido HTML para el modal de detalles de la cita
 * @param {Object} datos - Objeto con los datos formateados de la cita
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModalPsicologia(datos) {
    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Información General del Diagnóstico -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-file-medical me-2"></i> Información General
                        </h6>
                        
                        <!-- Beneficiario -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Beneficiario</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.beneficiario || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Psicólogo -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-md"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Psicólogo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.empleado || 'No asignado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tipo de Consulta -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-clipboard-list"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Tipo de Consulta</label>
                                    <div class="mt-1">
                                        <span class="badge bg-info fs-6">${datos.tipoConsulta || 'No especificado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fecha de Creación -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Registro</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.fecha_creacion || 'No especificada'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha - Detalles del Diagnóstico -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-notes-medical me-2"></i> Detalles del Diagnóstico
                        </h6>

                        <!-- Diagnóstico (solo si tipo_consulta es Diagnóstico) -->
                        ${datos.tipoConsulta === 'Diagnóstico' ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-stethoscope"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Diagnóstico</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 150px; overflow-y: auto;">
                                        ${datos.diagnostico || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tratamiento General -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-pills"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Tratamiento</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 150px; overflow-y: auto;">
                                        ${datos.tratamiento_gen || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Motivo de Retiro (solo si tipo_consulta es Retiro temporal) -->
                        ${datos.tipoConsulta === 'Retiro temporal' ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-warning me-2 mt-1">
                                    <i class="fas fa-pause-circle"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Motivo del Retiro</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.motivo_retiro || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Duración del Retiro -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-warning me-2 mt-1">
                                    <i class="fas fa-hourglass-half"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Duración Estimada</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.duracion_retiro || 'No especificada'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Motivo de Cambio (solo si tipo_consulta es Cambio de carrera) -->
                        ${datos.tipoConsulta === 'Cambio de carrera' ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-info me-2 mt-1">
                                    <i class="fas fa-exchange-alt"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Motivo del Cambio</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 150px; overflow-y: auto;">
                                        ${datos.motivo_cambio || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Observaciones (siempre se muestra) -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-comment-medical"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Observaciones</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 150px; overflow-y: auto;">
                                        ${datos.observaciones || 'Sin observaciones'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer bg-light py-3">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-1"></i> Cerrar
            </button>
        </div>
    `;
}