/**
 * Función para mostrar los detalles de una ruta
 * @param {number} id - ID de la ruta
 */
function verRuta(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    // Configurar título del modal
    $('#modalGenericoTitle').text('Detalle de la Ruta');

    // Limpiar y mostrar spinner en el body del modal
    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la ruta...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    // Hacer AJAX para obtener datos de la referencia
    $.ajax({
        url: 'ruta_detalle',
        method: 'GET',
        data: { id_ruta: id },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta ruta.
                    </div>
                `);
                return;
            }
            // Generar el contenido del modal
            const modalContent = modalVerRuta(data);

            //  5. Insertar el nuevo contenido
            $('#modalGenerico .modal-body').html(modalContent);

        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //  6. Mostrar error en el modal
            $('#modalGenerico .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información de la ruta. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verRuta(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para ver los detalles de una ruta
 * @param {Object} datos - Objeto con los campos de la tabla rutas
 */
function modalVerRuta(datos) {
    // Formatear la fecha de creación si es necesario
    const registro = moment(datos.fecha_creacion).format('DD/MM/YYYY');

    // Formatear horarios (asumiendo formato HH:mm:ss de MySQL)
    const salida = datos.horario_salida ? datos.horario_salida.substring(0, 5) : 'No definida';
    const llegada = datos.horario_llegada ? datos.horario_llegada.substring(0, 5) : 'No definida';

    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row mb-4">
                    <div class="col-12 text-center">
                        <h4 class="fw-bold text-primary mb-1 text-uppercase">
                             <i class="fas fa-route me-2"></i> ${datos.nombre_ruta}
                        </h4>
                        <span class="text-muted small">Tipo: <strong>${datos.tipo_ruta}</strong></span>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-map-marked-alt me-2"></i> Puntos de Trayecto
                        </h6>
                        
                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Origen (Partida)</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                <i class="fas fa-map-marker-alt text-success me-2"></i> ${datos.punto_partida || 'No especificado'}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Destino Final</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                <i class="fas fa-flag-checkered text-danger me-2"></i> ${datos.punto_destino || 'No especificado'}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Trayectoria Detallada</label>
                            <div class="form-control-plaintext bg-white rounded p-2 small" style="max-height: 80px; overflow-y: auto;">
                                ${datos.trayectoria || '<em class="text-muted">Sin detalles de trayectoria</em>'}
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 ps-md-4">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-clock me-2"></i> Horarios y Estatus
                        </h6>

                        <div class="row mb-3">
                            <div class="col-6">
                                <label class="form-label text-muted small mb-1">Salida</label>
                                <div class="form-control-plaintext bg-white rounded p-2 text-center">
                                    <i class="far fa-clock text-primary me-1"></i> ${salida}
                                </div>
                            </div>
                            <div class="col-6">
                                <label class="form-label text-muted small mb-1">Llegada Est.</label>
                                <div class="form-control-plaintext bg-white rounded p-2 text-center">
                                    <i class="fas fa-clock text-primary me-1"></i> ${llegada}
                                </div>
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Estatus de la Ruta</label>
                            <div class="mt-1">
                                ${generarBadgeEstatusRuta(datos.estatus)}
                            </div>
                        </div>

                        <div class="info-item mb-3 mt-4 pt-3 border-top text-end">
                            <small class="text-muted">
                                <i class="fas fa-calendar-alt me-1"></i> Registrada: ${registro}
                            </small>
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
 * Genera el badge específico para el estatus de la ruta
 * @param {string} estatus - 'Activa', 'Inactiva'
 */
function generarBadgeEstatusRuta(estatus) {
    const colorClass = (estatus === 'Activa') ? 'bg-success' : 'bg-danger';
    const icono = (estatus === 'Activa') ? 'fa-check-circle' : 'fa-times-circle';

    return `
        <div class="d-inline-flex align-items-center ${colorClass} rounded-pill px-3 py-1 text-white">
            <i class="fas ${icono} me-2" style="font-size: 0.7rem;"></i>
            <span class="fw-semibold">${estatus}</span>
        </div>
    `;
}