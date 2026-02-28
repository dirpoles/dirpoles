/**
 * Función para mostrar los detalles de una cita en un modal
 * @param {number} id - ID de la cita
 */

function editarCita(id) {
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
            <p class="mt-3 text-muted">Cargando información de la cita a editar...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'cita_detalle_editar',
        method: 'GET',
        data: { id_cita: id },
        dataType: 'json',
        success: function (data) {
            console.log('Datos recibidos para editar la cita:', data);

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalGlobal .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para editar esta cita.
                    </div>
                `);
                return;
            }

            const cita = data.data;

            //Formatear datos
            const nombreBeneficiario = `${cita.beneficiario}`.trim();
            const cedulaBeneficiario = `${cita.cedula_beneficiario}`;
            const fecha = cita.fecha;
            const hora = cita.hora;
            const nombreEmpleado = `${cita.empleado}`.trim();
            const estatus = cita.estatus;
            const id_empleado = cita.id_empleado;
            const id_cita = cita.id_cita;
            const id_beneficiario = cita.id_beneficiario;

            const modalContent = generarContenidoModalEditarCita({
                nombreBeneficiario,
                cedulaBeneficiario,
                fecha,
                hora,
                nombreEmpleado,
                estatus,
                id_empleado,
                id_cita,
                id_beneficiario
            });

            //Mostrar modal
            $('#modalCita .modal-body').html(modalContent);

            // Inicializar validaciones
            validarEditarCita(id);
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
 * Genera el formulario HTML para editar una cita
 * @param {Object} datos - Objeto con los datos de la cita
 * @returns {string} HTML del formulario
 */
function generarContenidoModalEditarCita(datos) {
    return `
        <form id="formEditarCita" data-id="${datos.id}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información de la Cita (Editables) -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-calendar-alt me-2"></i> Información de la Cita
                            </h6>
                            
                            <!-- Fecha -->
                            <div class="mb-3">
                                <label for="editar_fecha_cita" class="form-label text-muted small mb-1">
                                    <i class="fas fa-calendar-day text-primary me-1"></i> Fecha
                                    <span class="text-danger">*</span>
                                </label>
                                <input type="date" 
                                    class="form-control form-control-sm" 
                                    id="editar_fecha_cita" 
                                    name="fecha"
                                    value="${datos.fecha || ''}"
                                    required>
                                <div id="editar_fecha_citaError" class="form-text text-danger"></div>
                            </div>
                            
                            <!-- Hora -->
                            <div class="mb-3">
                                <label for="editar_hora_cita" class="form-label text-muted small mb-1">
                                    <i class="fas fa-clock text-primary me-1"></i> Hora
                                    <span class="text-danger">*</span>
                                </label>
                                <input type="time" 
                                    class="form-control form-control-sm" 
                                    id="editar_hora_cita" 
                                    name="hora"
                                    value="${datos.hora || ''}"
                                    required>
                                <div id="editar_hora_citaError" class="form-text text-danger"></div>
                            </div>
                            
                            
                            <!-- Psicólogo Asignado (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user-md text-primary me-1"></i> Psicólogo Asignado
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.nombreEmpleado || 'No asignado'}
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> Este campo no puede ser modificado
                                </small>
                            </div>
                        </div>
                        
                        <!-- Columna Derecha - Información del Beneficiario (Solo lectura) -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-user-circle me-2"></i> Información del Beneficiario
                            </h6>
                            
                            <!-- Nombre del Beneficiario -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user text-primary me-1"></i> Nombre Completo
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.nombreBeneficiario || 'Sin nombre'}
                                </div>
                            </div>
                            
                            <!-- Cédula del Beneficiario -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-id-card text-primary me-1"></i> Cédula de Identidad
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.cedulaBeneficiario || 'Sin cédula'}
                                </div>
                            </div>
                            
                            <!-- Información adicional sobre cambios -->
                            <div class="alert alert-info mt-4" role="alert">
                                <div class="d-flex align-items-start">
                                    <i class="fas fa-info-circle fa-lg me-2 mt-1"></i>
                                    <div>
                                        <h6 class="alert-heading mb-2">Información importante</h6>
                                        <p class="mb-1 small">
                                            <strong>Beneficiario y Psicólogo:</strong> No pueden ser modificados desde esta vista.
                                        </p>
                                        <p class="mb-1 small">
                                            <strong>Fecha y Hora:</strong> Pueden ser ajustadas según disponibilidad.
                                        </p>
                                        <p class="mb-0 small">
                                            <strong>Estado:</strong> Actualice el estado según el progreso de la cita.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Campos ocultos para datos necesarios -->
                    <input type="hidden" name="id_cita" id="id_cita" value="${datos.id_cita}">
                    <input type="hidden" name="id_empleado" id="id_empleado" value="${datos.id_empleado}">
                    <input type="hidden" name="id_beneficiario" id="id_beneficiario" value="${datos.id_beneficiario}">
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarCita">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>
    `;
}

/**
 * Genera las opciones del select de estatus basado en estado_cita
 * @param {number} estatusActual - ID del estado actual de la cita
 * @returns {string} HTML de las opciones del select
 */
function generarOpcionesEstatusCita(estatusActual) {
    const estadosCita = {
        1: {
            nombre: 'Pendiente',
            descripcion: 'Cita agendada y pendiente de atención'
        },
        2: {
            nombre: 'Confirmada',
            descripcion: 'Cita confirmada por el beneficiario'
        },
        3: {
            nombre: 'Atendida',
            descripcion: 'Cita completada exitosamente'
        },
        4: {
            nombre: 'Cancelada',
            descripcion: 'Cita cancelada'
        },
        5: {
            nombre: 'No asistió',
            descripcion: 'Beneficiario no se presentó'
        }
    };

    let opciones = '<option value="" disabled>Seleccione un estado</option>';

    for (const [id, estado] of Object.entries(estadosCita)) {
        const selected = parseInt(id) === parseInt(estatusActual) ? 'selected' : '';
        opciones += `
            <option value="${id}" ${selected} 
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="${estado.descripcion}">
                ${estado.nombre}
            </option>`;
    }

    return opciones;
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
 * Inicializa los tooltips en el modal de editar cita
 */
function initTooltipsModalEditarCita() {
    const tooltips = document.querySelectorAll('#modalCita [data-bs-toggle="tooltip"]');
    tooltips.forEach(el => {
        new bootstrap.Tooltip(el, {
            trigger: 'hover'
        });
    });
}