/**
 * Función para mostrar los detalles de un equipo
 * @param {number} id - ID del equipo
 */
function verEquipo(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    $('#modalGenericoTitle').text('Detalle del Equipo');

    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del equipo...</p>
        </div>
    `);

    modal.show();

    $.ajax({
        url: 'equipo_detalle',
        method: 'GET',
        data: { id_equipo: id },
        dataType: 'json',
        success: function (data) {
            if (!data || !data.data) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este equipo.
                    </div>
                `);
                return;
            }
            const e = data.data;

            const estadoBadge = {
                'Nuevo': 'bg-success',
                'Bueno': 'bg-info',
                'Regular': 'bg-warning',
                'Malo': 'bg-danger',
                'En reparación': 'bg-secondary'
            };

            const estatusBadge = e.estatus === 'Activo' ? 'bg-success' : 'bg-secondary';

            const modalContent = `
                <div class="card border-0 rounded-0 bg-light">
                    <div class="card-body p-4">
                        <div class="row">
                            <!-- Columna Izquierda -->
                            <div class="col-md-6 border-end">
                                <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                    <i class="fas fa-computer me-2"></i> Información del Equipo
                                </h6>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-tag text-primary me-1"></i> Tipo de Equipo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2 fw-bold">${e.tipo_equipo || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-industry text-primary me-1"></i> Marca</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${e.marca || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-box text-primary me-1"></i> Modelo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${e.modelo || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-barcode text-primary me-1"></i> Serial</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${e.serial || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-palette text-primary me-1"></i> Color</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${e.color || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-calendar-plus text-primary me-1"></i> Fecha de Registro</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${e.fecha_registro || 'No especificado'}</div>
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
                                        <span class="badge ${estadoBadge[e.estado] || 'bg-secondary'}">${e.estado || 'No especificado'}</span>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-toggle-on text-primary me-1"></i> Estatus</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        <span class="badge ${estatusBadge}">${e.estatus || 'No especificado'}</span>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-map-marker-alt text-primary me-1"></i> Ubicación / Servicio</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${e.ubicacion || 'No especificado'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-calendar text-primary me-1"></i> Fecha de Adquisición</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${e.fecha_adquisicion || 'No especificado'}</div>
                                </div>
                            </div>
                        </div>

                        ${e.descripcion ? `
                        <div class="row mt-2">
                            <div class="col-12">
                                <hr>
                                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-align-left me-2"></i> Descripción</h6>
                                <div class="bg-white rounded p-3 border">${e.descripcion}</div>
                            </div>
                        </div>` : ''}

                        ${e.observaciones ? `
                        <div class="row mt-2">
                            <div class="col-12">
                                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-sticky-note me-2"></i> Observaciones</h6>
                                <div class="bg-white rounded p-3 border">${e.observaciones}</div>
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
                            <p class="mb-0">No se pudo obtener la información del equipo.</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verEquipo(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
