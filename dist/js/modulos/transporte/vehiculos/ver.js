/**
 * Función para mostrar los detalles de un vehiculo
 * @param {number} id - ID del vehiculo
 */
function verVehiculo(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    // Configurar título del modal
    $('#modalGenericoTitle').text('Detalle del Vehiculo');

    // Limpiar y mostrar spinner en el body del modal
    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del vehiculo...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    // Hacer AJAX para obtener datos de la referencia
    $.ajax({
        url: 'vehiculo_detalle',
        method: 'GET',
        data: { id_vehiculo: id },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este vehiculo.
                    </div>
                `);
                return;
            }
            // Generar el contenido del modal
            const modalContent = modalVerVehiculo(data);

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
                            <p class="mb-0">No se pudo obtener la información del vehiculo. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verVehiculo(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para ver los detalles de un vehículo
 * @param {Object} datos - Objeto con placa, modelo, tipo, fecha_adquisicion y estado
 */
function modalVerVehiculo(datos) {
    // Transformar fecha con moment.js
    const fecha = moment(datos.fecha_adquisicion).format('DD/MM/YYYY');

    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-car me-2"></i> Identificación del Vehículo
                        </h6>
                        
                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Número de Placa</label>
                            <div class="form-control-plaintext bg-white rounded p-2 fw-bold text-uppercase">
                                <i class="fas fa-id-card-alt text-primary me-2"></i> ${datos.placa}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Modelo / Descripción</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                <i class="fas fa-tag text-primary me-2"></i> ${datos.modelo}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Estado Operativo</label>
                            <div class="mt-1">
                                ${generarBadgeEstadoVehiculo(datos.estado)}
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 ps-md-4">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-tools me-2"></i> Especificaciones
                        </h6>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Tipo de Vehículo</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                <i class="fas fa-truck text-primary me-2"></i> ${datos.tipo}
                            </div>
                        </div>

                        <div class="info-item mb-3">
                            <label class="form-label text-muted small mb-1">Fecha de Adquisición</label>
                            <div class="form-control-plaintext bg-white rounded p-2">
                                <i class="fas fa-calendar-check text-primary me-2"></i> ${fecha}
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
 * Genera el badge específico para el estado del vehículo
 * @param {string} estado - 'Activo', 'Inactivo', 'Mantenimiento'
 */
function generarBadgeEstadoVehiculo(estado) {
    let colorClass = '';
    let icon = 'fa-circle';

    switch (estado) {
        case 'Activo':
            colorClass = 'bg-success';
            break;
        case 'Inactivo':
            colorClass = 'bg-danger';
            break;
        case 'Mantenimiento':
            colorClass = 'bg-warning';
            icon = 'fa-tools'; // Icono diferente para resaltar mantenimiento
            break;
        default:
            colorClass = 'bg-secondary';
    }

    return `
        <div class="d-inline-flex align-items-center ${colorClass} rounded-pill px-3 py-1 text-white">
            <i class="fas ${icon} me-2" style="font-size: 0.7rem;"></i>
            <span class="fw-semibold">${estado}</span>
        </div>
    `;
}