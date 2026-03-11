/**
 * Función para mostrar los detalles de una ruta
 * @param {number} id - ID de la ruta
 */
function verRepuesto(id) {
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
        url: 'repuesto_detalle',
        method: 'GET',
        data: { id_repuesto: id },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este repuesto.
                    </div>
                `);
                return;
            }
            // Generar el contenido del modal
            const modalContent = modalVerRepuesto(data);

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
                            <p class="mb-0">No se pudo obtener la información del repuesto. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verRepuesto(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para ver los detalles de un repuesto
 * @param {Object} datos - Objeto con id_repuesto, nombre, descripcion, cantidad, nombre_proveedor, fecha_creacion, estatus
 */
function modalVerRepuesto(datos) {
    const fechaReg = datos.fecha_creacion ? moment(datos.fecha_creacion).format('DD/MM/YYYY') : 'No registrada';

    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row mb-4">
                    <div class="col-12 text-center">
                        <h4 class="fw-bold text-primary mb-1 text-uppercase">
                            <i class="fas fa-cogs me-2"></i> ${datos.nombre}
                        </h4>
                        <div class="mt-2">
                            ${generarBadgeDisponibilidad(datos.cantidad)}
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-clipboard-list me-2"></i> Información
                        </h6>
                        
                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Condición Física</label>
                            <div>
                                ${generarBadgeCondicionRepuesto(datos.estatus)}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Descripción</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                ${datos.descripcion || 'Sin descripción'}
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 ps-md-4">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-boxes me-2"></i> Inventario
                        </h6>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Cantidad en Existencia</label>
                            <div class="form-control-plaintext bg-white rounded p-2 fw-bold text-center">
                                <span class="h5 mb-0">${datos.cantidad} Unidades</span>
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Proveedor</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                <i class="fas fa-truck text-muted me-2"></i> ${datos.nombre_proveedor || 'No asignado'}
                            </div>
                        </div>

                        <div class="text-end mt-4">
                            <small class="text-muted">Registrado: ${fechaReg}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer bg-light">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
    `;
}

/**
 * Genera el badge para la condición física del repuesto
 * @param {string} estatus - 'Nuevo', 'Usado', 'Dañado'
 */
function generarBadgeCondicionRepuesto(estatus) {
    let colorClass = 'bg-secondary';
    let icono = 'fa-info-circle';

    switch (estatus) {
        case 'Nuevo':
            colorClass = 'bg-primary';
            icono = 'fa-sparkles'; // O fa-star
            break;
        case 'Usado':
            colorClass = 'bg-info text-dark';
            icono = 'fa-recycle';
            break;
        case 'Dañado':
            colorClass = 'bg-dark';
            icono = 'fa-tools';
            break;
    }

    return `
        <div class="d-inline-flex align-items-center ${colorClass} rounded-pill px-3 py-1 text-white">
            <i class="fas ${icono} me-2" style="font-size: 0.7rem;"></i>
            <span class="fw-semibold">${estatus}</span>
        </div>
    `;
}

/**
 * Genera el badge de disponibilidad basado en la cantidad
 * @param {number} cantidad 
 */
function generarBadgeDisponibilidad(cantidad) {
    const cant = parseInt(cantidad) || 0;
    let badge = '';

    if (cant === 0) {
        badge = '<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i> Agotado</span>';
    } else if (cant < 5) {
        badge = '<span class="badge bg-warning text-dark"><i class="fas fa-exclamation-triangle me-1"></i> Bajo stock</span>';
    } else {
        badge = '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i> Disponible</span>';
    }
    return badge;
}