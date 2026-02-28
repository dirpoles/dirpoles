/**
 * Función para mostrar los detalles de una referencia en un modal
 * @param {number} id - ID de la referencia
 */
function verReferencia(id) {
    const modalElement = document.getElementById('modalReferencia');
    const modal = new bootstrap.Modal(modalElement);

    // Configurar título del modal
    $('#modalReferenciaTitle').text('Detalle de la Referencia');

    // Limpiar y mostrar spinner en el body del modal
    $('#modalReferencia .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la referencia...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    // Hacer AJAX para obtener datos de la referencia
    $.ajax({
        url: 'referencia_detalle',
        method: 'GET',
        data: { id_referencia: id },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data) {
                $('#modalReferencia .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta referencia.
                    </div>
                `);
                return;
            }

            const referencia = data;

            //  3. Formatear datos
            const fecha_referencia = referencia.fecha_referencia;
            const fecha_formateada = moment(fecha_referencia).format('DD/MM/YYYY hh:mm A');
            const beneficiario = referencia.beneficiario;
            const empleado_origen = referencia.empleado_origen;
            const empleado_destino = referencia.empleado_destino;
            const servicio_origen = referencia.servicio_origen;
            const servicio_destino = referencia.servicio_destino;
            const estado = referencia.estado;
            const motivo = referencia.motivo;
            const observaciones = referencia.observaciones;
            const razon_rechazo = referencia.razon_rechazo;

            //  4. Generar HTML del modal
            const modalContent = modalReferencia({
                fecha_formateada,
                beneficiario,
                empleado_origen,
                empleado_destino,
                servicio_origen,
                servicio_destino,
                estado,
                motivo,
                observaciones,
                razon_rechazo
            });

            //  5. Insertar el nuevo contenido
            $('#modalReferencia .modal-body').html(modalContent);

        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //  6. Mostrar error en el modal
            $('#modalReferencia .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información de la referencia. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verReferencia(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para el modal de detalles de la referencia
 * @param {Object} datos - Objeto con los datos formateados de la referencia
 * @returns {string} HTML del contenido del modal
 */
function modalReferencia(datos) {
    return `
        <!-- Tarjeta de Información Principal -->
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Información General -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-info-circle me-2"></i> Información General
                        </h6>
                        
                        <!-- Beneficiario -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-injured"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Beneficiario</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.beneficiario}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fecha de Referencia -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Referencia</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.fecha_formateada}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Estatus -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Estado de la Referencia</label>
                                    <div class="mt-1">
                                        ${generarBadgeEstado(datos.estado)}
                                    </div>
                                </div>
                            </div>
                        </div>

                       <!-- Razon de Rechazo (Solo si está rechazada) -->
                        ${datos.estado === 'Rechazada' && datos.razon_rechazo ? `
                        <div class="info-item mb-3 bg-danger bg-opacity-10 rounded p-2 border border-danger">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-white me-2 mt-1">
                                    <i class="fas fa-exclamation-circle"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-white small mb-1 fw-bold">Motivo del Rechazo</label>
                                    <div class="form-control-plaintext text-white small mb-0">
                                        ${datos.razon_rechazo}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Columna Derecha - Detalles del Traslado -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-exchange-alt me-2"></i> Detalles del Traslado
                        </h6>

                        <!-- Origen -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-hospital-user"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Servicio y Empleado de Origen</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        <div><strong>Servicio:</strong> ${datos.servicio_origen}</div>
                                        <div class="small text-muted">Refiere: ${datos.empleado_origen}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Destino -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-md"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Servicio y Especialista de Destino</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        <div><strong>Servicio:</strong> ${datos.servicio_destino}</div>
                                        <div class="small text-muted">Recibe: ${datos.empleado_destino}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <!-- Fila Inferior - Motivo y Observaciones -->
                <div class="row">
                    <div class="col-12">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-file-medical-alt me-2"></i> Detalles Clínicos
                        </h6>
                    </div>

                    <!-- Motivo -->
                    <div class="col-md-12 mb-3">
                        <div class="info-item">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-clipboard-list"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Motivo de la Referencia</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.motivo}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Observaciones -->
                    <div class="col-md-12">
                        <div class="info-item">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-sticky-note"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Observaciones</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.observaciones || '<em class="text-muted">Sin observaciones adicionales</em>'}
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

/**
 * Genera el badge del estado de la referencia
 * @param {number} estado - Estado de la referencia ('Pendiente, Aceptada, Rechazada')
 * @returns {string} HTML del badge
 */
function generarBadgeEstado(estado) {
    if (estado == 'Pendiente') {
        return `
            <div class="d-inline-flex align-items-center bg-warning rounded-pill px-3 py-1">
                <i class="fas fa-circle me-2" style="font-size: 0.6rem; color: white"></i>
                <span class="fw-semibold" style="color: white">Pendiente</span>
            </div>
        `;
    } else if (estado == 'Aceptada') {
        return `
            <div class="d-inline-flex align-items-center bg-success rounded-pill px-3 py-1">
                <i class="fas fa-circle me-2" style="font-size: 0.6rem; color: white"></i>
                <span class="fw-semibold" style="color: white">Aceptada</span>
            </div>
        `;
    } else if (estado == 'Rechazada') {
        return `
            <div class="d-inline-flex align-items-center bg-danger rounded-pill px-3 py-1">
                <i class="fas fa-circle me-2" style="font-size: 0.6rem; color: white"></i>
                <span class="fw-semibold" style="color: white">Rechazada</span>
            </div>
        `;
    }
}