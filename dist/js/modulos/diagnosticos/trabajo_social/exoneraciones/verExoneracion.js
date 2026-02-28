/**
 * Ver detalles de una exoneración
 * @param {number} id - ID de la exoneración
 * @param {string} tipo - Tipo de diagnóstico (becas, exoneraciones, fames, embarazadas)
 */
function verExoneracion(id, tipo) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Detalle de la Exoneración');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la exoneración...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'listar_detalle_json',
        method: 'GET',
        data: {
            tipo: tipo,
            id_exoneracion: id  // Cambiado a plural para coincidir con el backend
        },
        dataType: 'json',
        success: function (data) {

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalDiagnostico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta exoneración.
                    </div>
                `);
                return;
            }
            const exoneracion = data.data;

            //Formatear datos
            const beneficiario = `${exoneracion.beneficiario}`.trim();
            const empleado = `${exoneracion.empleado}`.trim();
            const motivo = exoneracion.motivo;
            const otro_motivo = exoneracion.otro_motivo;
            const fecha_creacion = moment(exoneracion.fecha_creacion).format('DD/MM/YYYY'); // formatear con moment.js
            const carnet_discapacidad = exoneracion.carnet_discapacidad;

            const modalContent = generarContenidoModalExoneracion({
                beneficiario,
                empleado,
                fecha_creacion,
                carnet_discapacidad,
                motivo,
                otro_motivo
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
                            <p class="mb-0">No se pudo obtener la información de la exoneración. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verExoneracion(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
/**
 * Genera el contenido HTML para el modal de detalles de la exoneración
 * @param {Object} datos - Objeto con los datos formateados de la exoneración
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModalExoneracion(datos) {
    // Determinar si hay un "otro motivo" relevante para mostrar
    const mostrarOtroMotivo = datos.otro_motivo && datos.otro_motivo !== 'No aplica' && datos.otro_motivo !== '';

    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-graduation-cap me-2"></i> Información General
                        </h6>
                        
                        <!-- Beneficiario -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-graduate"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Beneficiario</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <h5 class="mb-0 text-primary">${datos.beneficiario || 'No especificado'}</h5>
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
                        <div class="info-item">
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
                    </div>

                    <!-- Columna Derecha -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-file-alt me-2"></i> Detalles de la Solicitud
                        </h6>

                        <!-- Motivo -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-info me-2 mt-1">
                                    <i class="fas fa-comment-dots"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Motivo de Exoneración</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border bg-info bg-opacity-10">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-quote-left text-info me-3 fs-4"></i>
                                            <div>
                                                <h5 class="mb-0 text-info">${datos.motivo || 'No especificado'}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Otro Motivo (Condicional) -->
                        ${mostrarOtroMotivo ? `
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-secondary me-2 mt-1">
                                    <i class="fas fa-pen"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Especificación del Motivo</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <span class="fs-6 text-dark">${datos.otro_motivo}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Carnet de Discapacidad -->
                        <div class="info-item">
                            <div class="d-flex align-items-start">
                                <div class="info-icon ${datos.carnet_discapacidad ? 'text-success' : 'text-secondary'} me-2 mt-1">
                                    <i class="fas fa-id-card"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Carnet de Discapacidad</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <div class="d-flex align-items-center">
                                            <i class="fas ${datos.carnet_discapacidad ? 'fa-check-circle text-success' : 'fa-times-circle text-secondary'} me-2 fs-5"></i>
                                            <span class="fs-5 ${datos.carnet_discapacidad ? 'text-success fw-bold' : 'text-secondary'}">
                                                ${datos.carnet_discapacidad ? 'Presenta Carnet' : 'No Presenta' || 'No especificado'}
                                            </span>
                                        </div>
                                        ${datos.carnet_discapacidad ? `<small class="text-muted mt-1 d-block">Código: ${datos.carnet_discapacidad}</small>` : ''}
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