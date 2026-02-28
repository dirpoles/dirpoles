/**
 * Ver detalles de un FAMES
 * @param {number} id - ID del FAMES
 * @param {string} tipo - Tipo de módulo
 */
function verFames(id, tipo) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Detalle del servicio de FAMES');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del servicio de FAMES...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'listar_detalle_json',
        method: 'GET',
        data: {
            tipo: tipo,
            id_fames: id  // Cambiado a plural para coincidir con el backend
        },
        dataType: 'json',
        success: function (data) {

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalDiagnostico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este servicio de FAMES.
                    </div>
                `);
                return;
            }
            const fames = data.data;

            //Formatear datos
            const beneficiario = `${fames.beneficiario}`.trim();
            const empleado = `${fames.empleado}`.trim()
            const fecha_creacion = moment(fames.fecha_creacion).format('DD/MM/YYYY'); // formatear con moment.js
            const patologia = `${fames.patologia}`.trim();
            const tipo_ayuda = `${fames.tipo_ayuda}`.trim();
            const otro_tipo = `${fames.otro_tipo}`.trim();

            const modalContent = generarContenidoModalFames({
                beneficiario,
                empleado,
                fecha_creacion,
                patologia,
                tipo_ayuda,
                otro_tipo
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
                            <p class="mb-0">No se pudo obtener la información del servicio de FAMES. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verFames(${id})">
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
function generarContenidoModalFames(datos) {
    // Determinar si hay un "otro tipo" relevante para mostrar
    const mostrarOtroTipo = datos.otro_tipo && datos.otro_tipo !== 'No aplica' && datos.otro_tipo !== '';

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
                            <i class="fas fa-notes-medical me-2"></i> Detalles Médicos y Ayuda
                        </h6>

                        <!-- Patología -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-danger me-2 mt-1">
                                    <i class="fas fa-stethoscope"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Patología</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <span class="fs-5 text-dark">${datos.patologia || 'No especificada'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tipo de Ayuda -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-success me-2 mt-1">
                                    <i class="fas fa-handshake-angle"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Tipo de Ayuda</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border bg-success bg-opacity-10">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-hand-holding-medical text-success me-3 fs-4"></i>
                                            <div>
                                                <h5 class="mb-0 text-success">${datos.tipo_ayuda || 'No especificado'}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Otro Tipo (Condicional) -->
                        ${mostrarOtroTipo ? `
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-secondary me-2 mt-1">
                                    <i class="fas fa-pen"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Especificación de Ayuda</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <span class="fs-6 text-dark">${datos.otro_tipo}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}
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