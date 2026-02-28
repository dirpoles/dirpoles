/**
 * Función para mostrar los detalles de una cita en un modal
 * @param {number} id - ID de la cita
 */
function verCita(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalCita');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalCitaTitle').text('Detalle de la Cita');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalCita .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la cita...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'cita_detalle',
        method: 'GET',
        data: { id_cita: id },
        dataType: 'json',
        success: function (data) {
            console.log('Datos recibidos de la cita:', data);

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalCita .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta cita.
                    </div>
                `);
                return;
            }
            const cita = data.data;

            //Formatear datos
            const nombreBeneficiario = `${cita.beneficiario}`.trim();
            const cedulaBeneficiario = `${cita.cedula_beneficiario}`;
            const fechaFormateada = cita.fecha_formateada;
            const horaFormateada = cita.hora_formateada;
            const nombreEmpleado = `${cita.empleado}`.trim();
            const estatus = cita.estatus;

            const modalContent = generarContenidoModalCita({
                nombreBeneficiario,
                cedulaBeneficiario,
                fechaFormateada,
                horaFormateada,
                nombreEmpleado,
                estatus
            });

            //Mostrar modal
            $('#modalCita .modal-body').html(modalContent);
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
                            <p class="mb-0">No se pudo obtener la información de la cita. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verCita(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
/**
 * Genera el contenido HTML para el modal de detalles de la cita
 * @param {Object} datos - Objeto con los datos formateados de la cita
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModalCita(datos) {
    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Información de la Cita -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-calendar-alt me-2"></i> Información de la Cita
                        </h6>
                        
                        <!-- Fecha -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.fechaFormateada || 'No especificada'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Hora -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Hora</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.horaFormateada || '--:--'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Estado de la Cita (con tooltip) -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Estado de la Cita</label>
                                    <div class="mt-1">
                                        ${generarBadgeEstatusCita(datos.estatus)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Psicólogo Asignado -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-md"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Psicólogo Asignado</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.nombreEmpleado || 'No asignado'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha - Información del Beneficiario -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-user-circle me-2"></i> Información del Beneficiario
                        </h6>

                        <!-- Nombre del Beneficiario -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Nombre Completo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.nombreBeneficiario || 'Sin nombre'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cédula del Beneficiario -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-id-card"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Cédula de Identidad</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.cedulaBeneficiario || 'Sin cédula'}
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
 * Genera el badge para el estado de la cita (con tooltip)
 * @param {number} estatus - ID del estado de la cita (1-5)
 * @returns {string} HTML del badge con tooltip
 */
function generarBadgeEstatusCita(estatus) {
    const estadosCita = {
        1: {
            nombre: 'Pendiente',
            clase: 'warning',
            icono: 'fas fa-clock',
            descripcion: 'Cita agendada y pendiente de atención'
        },
        2: {
            nombre: 'Confirmada',
            clase: 'info',
            icono: 'fas fa-check-circle',
            descripcion: 'Cita confirmada por el beneficiario'
        },
        3: {
            nombre: 'Atendida',
            clase: 'success',
            icono: 'fas fa-user-check',
            descripcion: 'Cita completada exitosamente'
        },
        4: {
            nombre: 'Cancelada',
            clase: 'danger',
            icono: 'fas fa-times-circle',
            descripcion: 'Cita cancelada'
        },
        5: {
            nombre: 'No asistió',
            clase: 'secondary',
            icono: 'fas fa-user-slash',
            descripcion: 'Beneficiario no se presentó'
        }
    };

    const estado = estadosCita[estatus] || {
        nombre: 'Desconocido',
        clase: 'secondary',
        icono: 'fas fa-question',
        descripcion: 'Estado no definido'
    };

    return `
        <span class="badge bg-${estado.clase} px-3 py-2 d-flex align-items-center gap-1" 
              style="font-size: 0.9rem; cursor: default;"
              data-bs-toggle="tooltip" 
              data-bs-placement="top" 
              title="${estado.descripcion}">
            <i class="${estado.icono}"></i>
            ${estado.nombre}
        </span>
    `;
}

/**
 * Inicializa los tooltips en el modal de cita
 */
function initTooltipsModalCita() {
    const tooltips = document.querySelectorAll('#modalCita [data-bs-toggle="tooltip"]');
    tooltips.forEach(el => {
        new bootstrap.Tooltip(el, {
            trigger: 'hover'
        });
    });
}