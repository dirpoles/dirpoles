/**
 * Función para mostrar los detalles de un mobiliario
 * @param {number} id - ID del mobiliario
 */
function verMobiliario(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    $('#modalGenericoTitle').text('Detalle del Mobiliario');

    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del mobiliario...</p>
        </div>
    `);

    modal.show();

    $.ajax({
        url: 'mobiliario_detalle',
        method: 'GET',
        data: { id_mobiliario: id },
        dataType: 'json',
        success: function (data) {
            if (!data || !data.data) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este mobiliario.
                    </div>
                `);
                return;
            }
            const m = data.data;

            const estadoBadge = {
                'Nuevo': 'bg-success',
                'Bueno': 'bg-info',
                'Regular': 'bg-warning',
                'Malo': 'bg-danger',
                'En reparación': 'bg-secondary'
            };

            const estatusBadge = m.estatus === 'Activo' ? 'bg-success' : 'bg-secondary';

            const modalContent = `
                <div class="card border-0 rounded-0 bg-light">
                    <div class="card-body p-4">
                        <div class="row">
                            <!-- Columna Izquierda -->
                            <div class="col-md-6 border-end">
                                <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                    <i class="fas fa-chair me-2"></i> Información del Mobiliario
                                </h6>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-tag text-primary me-1"></i> Tipo de Mobiliario</label>
                                    <div class="form-control-plaintext bg-white rounded p-2 fw-bold">${m.tipo_mobiliario || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-industry text-primary me-1"></i> Marca</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${m.marca || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-box text-primary me-1"></i> Modelo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${m.modelo || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-palette text-primary me-1"></i> Color</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${m.color || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-calendar-plus text-primary me-1"></i> Fecha de Registro</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${m.fecha_registro || 'No especificado'}</div>
                                </div>
                            </div>

                            <!-- Columna Derecha -->
                            <div class="col-md-6">
                                <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                    <i class="fas fa-clipboard-check me-2"></i> Detalles de Inventario
                                </h6>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-cog text-primary me-1"></i> Estado</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        <span class="badge ${estadoBadge[m.estado] || 'bg-secondary'}">${m.estado || 'No especificado'}</span>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-toggle-on text-primary me-1"></i> Estatus</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        <span class="badge ${estatusBadge}">${m.estatus || 'No especificado'}</span>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-sort-numeric-up text-primary me-1"></i> Cantidad</label>
                                    <div class="form-control-plaintext bg-white rounded p-2 fw-bold">${m.cantidad || 0} unidades</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-map-marker-alt text-primary me-1"></i> Ubicación / Servicio</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${m.ubicacion || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-calendar text-primary me-1"></i> Fecha de Adquisición</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${m.fecha_adquisicion || 'No especificado'}</div>
                                </div>
                            </div>
                        </div>

                        ${m.descripcion_adicional ? `
                        <div class="row mt-2">
                            <div class="col-12">
                                <hr>
                                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-align-left me-2"></i> Descripción Adicional</h6>
                                <div class="bg-white rounded p-3 border">${m.descripcion_adicional}</div>
                            </div>
                        </div>` : ''}

                        ${m.observaciones ? `
                        <div class="row mt-2">
                            <div class="col-12">
                                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-sticky-note me-2"></i> Observaciones</h6>
                                <div class="bg-white rounded p-3 border">${m.observaciones}</div>
                            </div>
                        </div>` : ''}
                    </div>
                </div>
            `;

            $('#modalGenerico .modal-body').html(modalContent);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);
            $('#modalGenerico .modal-body').html(`
                <div class="alert alert-danger m-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del mobiliario.</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verMobiliario(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
