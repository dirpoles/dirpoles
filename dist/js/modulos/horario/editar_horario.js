/**
 * Función para mostrar los detalles del horario en un modal
 * @param {number} id - ID del horario
 */

function editarHorario(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalHorario');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalHorarioTitle').text('Detalle del Horario');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalHorario .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del horario a editar...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'horario_detalle_editar',
        method: 'GET',
        data: { id_horario: id },
        dataType: 'json',
        success: function (data) {
            console.log('Datos recibidos para editar el horario:', data);

            if (!data || !data.data) {
                $('#modalHorario .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para editar este horario.
                    </div>
                `);
                return;
            }

            const horario = data.data;

            // Ahora accedes directo a las propiedades
            const id_empleado = horario.id_empleado;
            const id_horario = horario.id_horario;
            const dia_semana = horario.dia_semana;
            const hora_inicio = horario.hora_inicio;
            const hora_fin = horario.hora_fin;
            const nombreEmpleado = horario.nombre_completo.trim();

            const modalContent = generarContenidoModalEditarHorario({
                id_empleado,
                id_horario,
                dia_semana,
                hora_inicio,
                hora_fin,
                nombreEmpleado,
            });

            $('#modalHorario .modal-body').html(modalContent);
            validar_editar_horario(id);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //Mostrar error en el modal
            $('#modalHorario .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del horario. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarHorario(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        },
    });
}

/**
 * Genera el formulario HTML para editar un horario
 * @param {Object} datos - Objeto con los datos del horario
 * @returns {string} HTML del formulario
 */
function generarContenidoModalEditarHorario(datos) {
    return `
        <form id="formEditarHorario" data-id="${datos.id_horario || ''}">
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                        <i class="fas fa-calendar-alt me-2"></i> Editar Horario
                    </h6>

                    <!-- Día de la semana -->
                    <div class="mb-3">
                        <label for="editar_dia_semana" class="form-label text-muted small mb-1">
                            <i class="fas fa-calendar-day text-primary me-1"></i> Día de la semana
                            <span class="text-danger">*</span>
                        </label>
                        <select class="form-select form-control-sm" 
                                id="editar_dia_semana" 
                                name="dia_semana" 
                                required>
                            <option value="">Seleccione...</option>
                            <option value="Lunes" ${datos.dia_semana === 'Lunes' ? 'selected' : ''}>Lunes</option>
                            <option value="Martes" ${datos.dia_semana === 'Martes' ? 'selected' : ''}>Martes</option>
                            <option value="Miércoles" ${datos.dia_semana === 'Miércoles' ? 'selected' : ''}>Miércoles</option>
                            <option value="Jueves" ${datos.dia_semana === 'Jueves' ? 'selected' : ''}>Jueves</option>
                            <option value="Viernes" ${datos.dia_semana === 'Viernes' ? 'selected' : ''}>Viernes</option>
                            <option value="Sábado" ${datos.dia_semana === 'Sábado' ? 'selected' : ''}>Sábado</option>
                        </select>
                        <div id="editar_dia_semanaError" class="form-text text-danger"></div>
                    </div>

                    <!-- Hora de inicio -->
                    <div class="mb-3">
                        <label for="editar_hora_inicio" class="form-label text-muted small mb-1">
                            <i class="fas fa-clock text-primary me-1"></i> Hora de inicio
                            <span class="text-danger">*</span>
                        </label>
                        <input type="time" 
                               class="form-control form-control-sm" 
                               id="editar_hora_inicio" 
                               name="hora_inicio" 
                               value="${datos.hora_inicio || ''}" 
                               required>
                        <div id="editar_hora_inicioError" class="form-text text-danger"></div>
                    </div>

                    <!-- Hora de fin -->
                    <div class="mb-3">
                        <label for="editar_hora_fin" class="form-label text-muted small mb-1">
                            <i class="fas fa-clock text-primary me-1"></i> Hora de fin
                            <span class="text-danger">*</span>
                        </label>
                        <input type="time" 
                               class="form-control form-control-sm" 
                               id="editar_hora_fin" 
                               name="hora_fin" 
                               value="${datos.hora_fin || ''}" 
                               required>
                        <div id="editar_hora_finError" class="form-text text-danger"></div>
                    </div>

                    <!-- Campo oculto -->
                    <input type="hidden" name="id_horario" id="editar_id_horario" value="${datos.id_horario || ''}">
                    <input type="hidden" name="id_empleado" id="editar_id_empleado" value="${datos.id_empleado || ''}">
                </div>
            </div>

            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarHorario">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>
    `;
}