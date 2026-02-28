/**
 * Función para mostrar los detalles de una consulta en un modal
 * @param {number} id - ID de la consulta
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
        url: 'diagnostico_orientacion_detalle',
        method: 'GET',
        data: { id_orientacion: id },
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
            const orientacion = data.data;

            //Formatear datos
            const beneficiario = `${orientacion.beneficiario}`.trim();
            const empleado = `${orientacion.empleado}`.trim();
            const motivo_orientacion = orientacion.motivo_orientacion;
            const descripcion_orientacion = orientacion.descripcion_orientacion;
            const obs_adic_orientacion = orientacion.observaciones;
            const indicaciones_orientacion = orientacion.indicaciones_orientacion;
            const fecha_creacion = moment(orientacion.fecha_creacion).format('DD/MM/YYYY');


            const modalContent = generarContenidoModal({
                beneficiario,
                empleado,
                motivo_orientacion,
                descripcion_orientacion,
                obs_adic_orientacion,
                indicaciones_orientacion,
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
                        <button class="btn btn-outline-danger" onclick="verCita(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
/**
 * Genera el contenido HTML para el modal de detalles de la consulta
 * @param {Object} datos - Objeto con los datos formateados de la consulta
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModal(datos) {
    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Información General de la Orientación -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-comments me-2"></i> Información General
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

                        <!-- Psicólogo/Orientador -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Psicólogo/Orientador</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.empleado || 'No asignado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Motivo de Orientación -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-question-circle"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Motivo de Orientación</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 120px; overflow-y: auto;">
                                        ${datos.motivo_orientacion || 'No especificado'}
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

                    <!-- Columna Derecha - Detalles de la Sesión -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-clipboard-check me-2"></i> Detalles de la Sesión
                        </h6>

                        <!-- Descripción de la Orientación -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Descripción de la Sesión</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 120px; overflow-y: auto;">
                                        ${datos.descripcion_orientacion || 'No especificada'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Indicaciones -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-tasks"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Indicaciones</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 120px; overflow-y: auto;">
                                        ${datos.indicaciones_orientacion || 'No se especificaron indicaciones'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Observaciones Adicionales -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-clipboard-list"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Observaciones Adicionales</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 120px; overflow-y: auto;">
                                        ${datos.obs_adic_orientacion || 'Sin observaciones adicionales'}
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