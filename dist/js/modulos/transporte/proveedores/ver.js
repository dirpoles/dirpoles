/**
 * Función para mostrar los detalles de un proveedor
 * @param {number} id - ID del proveedor
 */
function verProveedor(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    // Configurar título del modal
    $('#modalGenericoTitle').text('Detalle del Proveedor');

    // Limpiar y mostrar spinner en el body del modal
    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del proveedor...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    // Hacer AJAX para obtener datos de la referencia
    $.ajax({
        url: 'proveedor_detalle',
        method: 'GET',
        data: { id_proveedor: id },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este proveedor.
                    </div>
                `);
                return;
            }
            // Generar el contenido del modal
            const modalContent = modalVerProveedor(data);

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
                            <p class="mb-0">No se pudo obtener la información del proveedor. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verProveedor(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para ver los detalles de un proveedor
 * @param {Object} datos - Objeto con los campos de la tabla proveedores
 */
function modalVerProveedor(datos) {
    // Unir tipo y número de documento (Ej: V-28281433)
    const documentoCompleto = `${datos.tipo_documento}-${datos.num_documento}`;

    // Formatear la fecha de creación con moment.js
    const fechaRegistro = moment(datos.fecha_creacion).format('DD/MM/YYYY hh:mm A');

    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-id-card me-2"></i> Datos Fiscales
                        </h6>
                        
                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Nombre / Razón Social</label>
                            <div class="form-control-plaintext bg-white rounded p-2 fw-bold">
                                <i class="fas fa-building text-primary me-2"></i> ${datos.nombre}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Documento de Identidad</label>
                            <div class="form-control-plaintext bg-white rounded p-2 text-uppercase">
                                <i class="fas fa-fingerprint text-primary me-2"></i> ${documentoCompleto}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Estatus del Proveedor</label>
                            <div class="mt-1">
                                ${generarBadgeEstatusProveedor(datos.estatus)}
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 ps-md-4">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-address-book me-2"></i> Contacto y Ubicación
                        </h6>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Teléfono</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                <i class="fas fa-phone text-primary me-2"></i> ${datos.telefono}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Correo Electrónico</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                <i class="fas fa-envelope text-primary me-2"></i> ${datos.correo}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Dirección</label>
                            <div class="form-control-plaintext bg-white rounded p-2 small">
                                <i class="fas fa-map-marker-alt text-primary me-2"></i> ${datos.direccion}
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-3">
                
                <div class="row">
                    <div class="col-12 text-end">
                        <small class="text-muted">
                            <i class="fas fa-history me-1"></i> Registrado el: ${fechaRegistro}
                        </small>
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
 * Genera el badge para el estatus del proveedor
 * @param {string} estatus - 'Activo', 'Inactivo'
 */
function generarBadgeEstatusProveedor(estatus) {
    // Normalizamos a minúsculas por si acaso en la BD varía
    const estado = estatus;
    let badgeClass = '';
    let icono = '';

    if (estado === 'Activo') {
        badgeClass = 'bg-success';
        icono = 'fa-check-circle';
    } else {
        badgeClass = 'bg-danger';
        icono = 'fa-times-circle';
    }

    return `
        <div class="d-inline-flex align-items-center ${badgeClass} rounded-pill px-3 py-1 text-white">
            <i class="fas ${icono} me-2" style="font-size: 0.7rem;"></i>
            <span class="fw-semibold text-capitalize">${estatus}</span>
        </div>
    `;
}