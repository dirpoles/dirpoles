/**
 * Función para mostrar los detalles de una cita en un modal
 * @param {number} id - ID de la cita
 */

function editarDiagnostico(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Editar Diagnóstico Médico');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del diagnóstico...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'diagnostico_orientacion_detalle',
        method: 'GET',
        data: { id_orientacion: id },
        dataType: 'json',
        success: function (data) {
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

            const orientacion = data.data;

            //Formatear datos
            const beneficiario = `${orientacion.beneficiario}`.trim();
            const empleado = `${orientacion.empleado}`.trim();
            const motivo_orientacion = orientacion.motivo_orientacion;
            const descripcion_orientacion = orientacion.descripcion_orientacion;
            const obs_adic_orientacion = orientacion.observaciones;
            const indicaciones_orientacion = orientacion.indicaciones_orientacion;
            const id_beneficiario = orientacion.id_beneficiario;
            const id_orientacion = orientacion.id_orientacion;
            const fecha_creacion = orientacion.fecha_creacion;

            const modalContent = generarContenidoModalEditar({
                id_orientacion,
                beneficiario,
                empleado,
                motivo_orientacion,
                descripcion_orientacion,
                obs_adic_orientacion,
                indicaciones_orientacion,
                fecha_creacion,
                id_beneficiario,
            });

            //Mostrar modal
            $('#modalDiagnostico .modal-body').html(modalContent);

            // Inicializar validaciones
            initTooltipsModalEditarDiagnostico();
            validarEditarDiagnostico(id);
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
                            <p class="mb-0">No se pudo obtener la información del diagnostico. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarDiagnostico(${id})">
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
function generarContenidoModalEditar(datos) {
    return `
        <form id="formEditarOrientacion" data-id="${datos.id_orientacion}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura) -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-comments me-2"></i> Información General
                            </h6>
                            
                            <!-- Beneficiario (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user text-primary me-1"></i> Beneficiario
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.beneficiario || 'No especificado'}
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> Este campo no puede ser modificado
                                </small>
                            </div>

                            <!-- Psicólogo/Orientador (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user-tie text-primary me-1"></i> Psicólogo/Orientador
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.empleado || 'No asignado'}
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> Este campo no puede ser modificado
                                </small>
                            </div>

                            <!-- Fecha de Creación (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-calendar-day text-primary me-1"></i> Fecha de Registro
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.fecha_creacion || 'No especificada'}
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> Este campo no puede ser modificado
                                </small>
                            </div>
                        </div>

                        <!-- Columna Derecha - Detalles Editables de la Sesión -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-clipboard-check me-2"></i> Detalles de la Sesión
                            </h6>

                            <!-- Motivo de Orientación (Editable) -->
                            <div class="mb-3">
                                <label for="editar_motivo_orientacion" class="form-label text-muted small mb-1">
                                    <i class="fas fa-question-circle text-primary me-1"></i> Motivo de Orientación
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_motivo_orientacion" 
                                          name="motivo_orientacion" 
                                          rows="3"
                                          maxlength="5000"
                                          required>${datos.motivo_orientacion || ''}</textarea>
                                <div id="editar_motivo_orientacionError" class="form-text text-danger"></div>
                                <small class="form-text text-muted">Descripción del motivo principal de la orientación</small>
                            </div>

                            <!-- Descripción de la Orientación (Editable) -->
                            <div class="mb-3">
                                <label for="editar_descripcion_orientacion" class="form-label text-muted small mb-1">
                                    <i class="fas fa-file-alt text-primary me-1"></i> Descripción de la Sesión
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_descripcion_orientacion" 
                                          name="descripcion_orientacion" 
                                          rows="3"
                                          maxlength="5000"
                                          required>${datos.descripcion_orientacion || ''}</textarea>
                                <div id="editar_descripcion_orientacionError" class="form-text text-danger"></div>
                                <small class="form-text text-muted">Desarrollo y aspectos relevantes de la sesión</small>
                            </div>
                        </div>
                    </div>

                    <!-- Fila Inferior - Campos más largos -->
                    <div class="row mt-3">
                        <!-- Indicaciones (Editable) -->
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="editar_indicaciones_orientacion" class="form-label text-muted small mb-1">
                                    <i class="fas fa-tasks text-primary me-1"></i> Indicaciones
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_indicaciones_orientacion" 
                                          name="indicaciones_orientacion" 
                                          rows="4"
                                          maxlength="5000"
                                          required>${datos.indicaciones_orientacion || ''}</textarea>
                                <div id="editar_indicaciones_orientacionError" class="form-text text-danger"></div>
                                <small class="form-text text-muted">Tareas, ejercicios y recomendaciones para el beneficiario</small>
                            </div>
                        </div>

                        <!-- Observaciones Adicionales (Editable) -->
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="editar_obs_adic_orientacion" class="form-label text-muted small mb-1">
                                    <i class="fas fa-clipboard-list text-primary me-1"></i> Observaciones Adicionales
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_obs_adic_orientacion" 
                                          name="obs_adic_orientacion" 
                                          rows="4"
                                          maxlength="5000">${datos.obs_adic_orientacion || ''}</textarea>
                                <div id="editar_obs_adic_orientacionError" class="form-text text-danger"></div>
                                <small class="form-text text-muted">Notas adicionales, pronóstico, sugerencias de seguimiento</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Campos ocultos para datos necesarios -->
                    <input type="hidden" name="id_orientacion" id="id_orientacion" value="${datos.id_orientacion || ''}">
                    <input type="hidden" name="id_beneficiario" id="id_beneficiario" value="${datos.id_beneficiario || ''}">
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarOrientacion">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>
    `;
}

/**
 * Inicializa los tooltips en el modal de editar diagnostico
 */
function initTooltipsModalEditarDiagnostico() {
    const tooltips = document.querySelectorAll('#modalDiagnostico [data-bs-toggle="tooltip"]');
    tooltips.forEach(el => {
        new bootstrap.Tooltip(el, {
            trigger: 'hover'
        });
    });
}