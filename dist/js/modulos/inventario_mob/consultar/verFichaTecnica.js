/**
 * Función para mostrar los detalles de una ficha técnica
 * @param {number} id - ID de la ficha técnica
 */
function verFichaTecnica(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    $('#modalGenericoTitle').text('Detalle de la Ficha Técnica');

    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la ficha técnica...</p>
        </div>
    `);

    modal.show();

    $.ajax({
        url: 'ficha_detalle',
        method: 'GET',
        data: { id_ficha: id },
        dataType: 'json',
        success: function (data) {
            if (!data || !data.data) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta ficha técnica.
                    </div>
                `);
                return;
            }
            const f = data.data;

            const estatusBadge = (f.estatus == 1) ? 'bg-success' : 'bg-secondary';
            const estatusTexto = (f.estatus == 1) ? 'Activo' : 'Inactivo';

            const modalContent = `
                <div class="card border-0 rounded-0 bg-light">
                    <div class="card-body p-4">
                        <div class="row">
                            <!-- Columna Izquierda -->
                            <div class="col-md-6 border-end">
                                <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                    <i class="fas fa-file-alt me-2"></i> Información de la Ficha
                                </h6>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-tag text-primary me-1"></i> Nombre de la Ficha</label>
                                    <div class="form-control-plaintext bg-white rounded p-2 fw-bold">${f.nombre_ficha || 'Sin nombre'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-hospital text-primary me-1"></i> Servicio</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${f.servicio || 'Sin servicio'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-user text-primary me-1"></i> Responsable</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${f.responsable || 'Sin responsable'}</div>
                                </div>
                            </div>

                            <!-- Columna Derecha -->
                            <div class="col-md-6">
                                <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                    <i class="fas fa-clipboard-check me-2"></i> Detalles
                                </h6>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-calendar-plus text-primary me-1"></i> Fecha de Creación</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">${f.fecha_creacion || 'Sin fecha'}</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small mb-1"><i class="fas fa-toggle-on text-primary me-1"></i> Estatus</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        <span class="badge ${estatusBadge}">${estatusTexto}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        ${f.descripcion ? `
                        <div class="row mt-2">
                            <div class="col-12">
                                <hr>
                                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-align-left me-2"></i> Descripción</h6>
                                <div class="bg-white rounded p-3 border">${f.descripcion}</div>
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
                            <p class="mb-0">No se pudo obtener la información de la ficha técnica.</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verFichaTecnica(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
