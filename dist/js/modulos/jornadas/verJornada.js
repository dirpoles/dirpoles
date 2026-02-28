/**
 * Función para mostrar los detalles de una jornada médica
 * @param {number} id - ID de la jornada
 */
function verJornada(id) {
    const modalElement = document.getElementById('modalJornada');
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (!modal) {
        modal = new bootstrap.Modal(modalElement);
    }

    // Configurar título del modal
    $('#modalJornadaTitle').text('Detalle de la Jornada');

    // Limpiar y mostrar spinner en el body del modal
    $('#modalJornada .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la jornada...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    // Hacer AJAX para obtener datos de la jornada
    $.ajax({
        url: 'jornada_detalle',
        method: 'GET',
        data: { id_jornada: id },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data) {
                $('#modalJornada .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta jornada.
                    </div>
                `);
                return;
            }

            const jornada = data;

            //  3. Formatear datos
            const nombre_jornada = jornada.nombre_jornada;
            const tipo_jornada = jornada.tipo_jornada;
            const fecha_inicio = jornada.fecha_inicio;
            const fecha_fin = jornada.fecha_fin;
            const ubicacion = jornada.ubicacion;
            const aforo_maximo = jornada.aforo_maximo;
            const descripcion = jornada.descripcion;
            const estatus = jornada.estatus;


            //  4. Generar HTML del modal
            const modalContent = modalJornada({
                nombre_jornada,
                tipo_jornada,
                fecha_inicio,
                fecha_fin,
                ubicacion,
                aforo_maximo,
                descripcion,
                estatus
            });

            //  5. Insertar el nuevo contenido
            $('#modalJornada .modal-body').html(modalContent);

        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //  6. Mostrar error en el modal
            $('#modalJornada .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información de la jornada. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verJornada(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para el modal de detalles de la jornada
 * @param {Object} datos - Objeto con los datos formateados de la jornada
 * @returns {string} HTML del contenido del modal
 */
function modalJornada(datos) {
    // Formatear fechas para mejor lectura
    const formatFecha = (fechaStr) => {
        if (!fechaStr) return 'No definida';
        return moment(fechaStr).format('DD/MM/YYYY hh:mm A');
    };

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
                        
                        <!-- Nombre Jornada -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-heading"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Nombre de la Jornada</label>
                                    <div class="form-control-plaintext bg-white rounded p-2 fw-bold">
                                        ${datos.nombre_jornada}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tipo Jornada -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-list-ul"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Tipo de Jornada</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.tipo_jornada}
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
                                    <label class="form-label text-muted small mb-1">Estado Actual</label>
                                    <div class="mt-1">
                                        ${generarBadgeEstado(datos.estatus)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha - Logística y Fechas -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-calendar-alt me-2"></i> Logística y Cronograma
                        </h6>

                        <!-- Ubicación -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-danger me-2 mt-1">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Ubicación</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.ubicacion}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Aforo -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Aforo Máximo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.aforo_maximo} Personas
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fechas (Inicio y Fin) -->
                        <div class="row">
                            <div class="col-md-12 mb-2">
                                <div class="d-flex align-items-center bg-white rounded p-2 border border-light">
                                    <i class="fas fa-clock text-success me-2"></i>
                                    <div>
                                        <small class="text-muted d-block" style="font-size: 0.75rem;">Inicio</small>
                                        <span class="fw-bold text-dark">${formatFecha(datos.fecha_inicio)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="d-flex align-items-center bg-white rounded p-2 border border-light">
                                    <i class="fas fa-flag-checkered text-danger me-2"></i>
                                    <div>
                                        <small class="text-muted d-block" style="font-size: 0.75rem;">Fin</small>
                                        <span class="fw-bold text-dark">${formatFecha(datos.fecha_fin)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <!-- Fila Inferior - Descripción -->
                <div class="row">
                    <div class="col-12">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-align-left me-2"></i> Descripción y Detalles
                        </h6>
                    </div>

                    <div class="col-md-12">
                        <div class="info-item">
                            <div class="form-control-plaintext bg-white rounded p-3" style="min-height: 80px;">
                                ${datos.descripcion || '<em class="text-muted">Sin descripción detallada.</em>'}
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
 * Genera el badge del estado de la jornada
 * @param {string} estado - Estado de la jornada ('Activa', 'Cancelada', 'Finalizada')
 * @returns {string} HTML del badge
 */
function generarBadgeEstado(estado) {
    if (estado === 'Activa') {
        return `
            <div class="d-inline-flex align-items-center bg-success rounded-pill px-3 py-1">
                <i class="fas fa-check-circle me-2" style="font-size: 0.8rem; color: white"></i>
                <span class="fw-semibold text-white">Activa</span>
            </div>
        `;
    } else if (estado === 'Cancelada') {
        return `
            <div class="d-inline-flex align-items-center bg-danger rounded-pill px-3 py-1">
                <i class="fas fa-ban me-2" style="font-size: 0.8rem; color: white"></i>
                <span class="fw-semibold text-white">Cancelada</span>
            </div>
        `;
    } else if (estado === 'Finalizada') {
        return `
            <div class="d-inline-flex align-items-center bg-secondary rounded-pill px-3 py-1">
                <i class="fas fa-flag-checkered me-2" style="font-size: 0.8rem; color: white"></i>
                <span class="fw-semibold text-white">Finalizada</span>
            </div>
        `;
    } else {
        return `
            <div class="d-inline-flex align-items-center bg-light border rounded-pill px-3 py-1">
                <span class="fw-semibold text-muted">${estado || 'Desconocido'}</span>
            </div>
        `;
    }
}
