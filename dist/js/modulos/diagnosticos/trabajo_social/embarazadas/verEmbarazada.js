/**
 * Ver detalles de un registro de embarazada
 * @param {number} id - ID del registro de embarazada (id_gestion)
 * @param {string} tipo - Tipo de módulo ('embarazadas')
 */
function verEmbarazada(id, tipo) {
    // Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    // Configurar título del modal
    $('#modalDiagnosticoTitle').text('Detalle del Diagnóstico de Embarazada');

    // Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del registro...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    $.ajax({
        url: 'listar_detalle_json',
        method: 'GET',
        data: {
            tipo: tipo,
            id_gestion: id
        },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalDiagnostico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este registro de embarazada.
                    </div>
                `);
                return;
            }

            const emb = data.data;

            // Formatear datos
            const beneficiario = `${emb.beneficiario}`.trim();
            const empleado = `${emb.empleado}`.trim();
            const fecha_creacion = moment(emb.fecha_creacion).format('DD/MM/YYYY');
            const patologia = `${emb.patologia}`.trim();
            const semanas_gest = `${emb.semanas_gest}`.trim();
            const codigo_patria = `${emb.codigo_patria || ''}`.trim();
            const serial_patria = `${emb.serial_patria || ''}`.trim();
            const estado = `${emb.estado}`.trim();

            const modalContent = generarContenidoModalEmbarazada({
                beneficiario,
                empleado,
                fecha_creacion,
                patologia,
                semanas_gest,
                codigo_patria,
                serial_patria,
                estado
            });

            // Mostrar contenido en el modal
            $('#modalDiagnostico .modal-body').html(modalContent);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            // Mostrar error en el modal
            $('#modalDiagnostico .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del registro. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para el modal de detalles de embarazada
 * @param {Object} datos - Objeto con los datos formateados
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModalEmbarazada(datos) {
    const estadoBadge = datos.estado.toLowerCase() === 'aprobado'
        ? '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i> Aprobado</span>'
        : datos.estado.toLowerCase() === 'rechazado'
            ? '<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i> Rechazado</span>'
            : '<span class="badge bg-warning text-dark"><i class="fas fa-clock me-1"></i> En Proceso</span>';

    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-info-circle me-2"></i> Información General
                        </h6>
                        
                        <!-- Beneficiario -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-female"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Beneficiaria</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <h5 class="mb-0 text-primary">${datos.beneficiario || 'No especificada'}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empleado -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Registrado por</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <span class="fs-5">${datos.empleado || 'No especificado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fecha de Creación -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Registro</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <span class="fs-5">
                                            <i class="far fa-calendar me-2"></i>
                                            ${datos.fecha_creacion || 'No especificada'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Estado -->
                        <div class="info-item">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-toggle-on"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Estado del Seguimiento</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        ${estadoBadge}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-baby me-2"></i> Detalles de Gestación
                        </h6>

                        <!-- Semanas de Gestación -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-info me-2 mt-1">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Semanas de Gestación</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border bg-info bg-opacity-10">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-history text-info me-3 fs-4"></i>
                                            <div>
                                                <h5 class="mb-0 text-info">${datos.semanas_gest} semanas</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Patología Relacionada -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-danger me-2 mt-1">
                                    <i class="fas fa-stethoscope"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Patología Relacionada</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <span class="fs-5 text-dark">${datos.patologia || 'Sin patologías registradas'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Carnet de la Patria -->
                        <div class="info-item">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-secondary me-2 mt-1">
                                    <i class="fas fa-id-card"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Información Carnet de la Patria</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <div class="mb-2">
                                            <small class="text-muted d-block small">Código:</small>
                                            <span class="fs-6 fw-bold">${datos.codigo_patria || 'No registrado'}</span>
                                        </div>
                                        <div>
                                            <small class="text-muted d-block small">Serial:</small>
                                            <span class="fs-6 fw-bold">${datos.serial_patria || 'No registrado'}</span>
                                        </div>
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
