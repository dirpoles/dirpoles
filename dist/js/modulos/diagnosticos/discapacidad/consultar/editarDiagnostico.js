/**
 * Función para mostrar los detalles del diagnostico de discapacidad en un modal
 * @param {number} id - ID del diagnostico de discapacidad
 */

function editarDiagnostico(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Detalle del Diagnostico');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del diagnostico...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'discapacidad_detalle',
        method: 'GET',
        data: { id_discapacidad: id },
        dataType: 'json',
        success: function (data) {
            console.log('Datos recibidos para editar el diagnostico:', data);

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

            const discapacidad = data.data;

            //Formatear datos
            const beneficiario = `${discapacidad.beneficiario}`.trim();
            const empleado = `${discapacidad.empleado}`.trim();
            const tipo_discapacidad = discapacidad.tipo_discapacidad;
            const disc_especifica = discapacidad.disc_especifica;
            const diagnostico = discapacidad.diagnostico;
            const grado = discapacidad.grado;
            const medicamentos = discapacidad.medicamentos;
            const habilidades_funcionales = discapacidad.habilidades_funcionales;
            const requiere_asistencia = discapacidad.requiere_asistencia;
            const dispositivo_asistencia = discapacidad.dispositivo_asistencia;
            const observaciones = discapacidad.observaciones;
            const recomendaciones = discapacidad.recomendaciones;
            const carnet_discapacidad = discapacidad.carnet_discapacidad;
            const fecha_creacion = discapacidad.fecha_creacion;
            const id_discapacidad = discapacidad.id_discapacidad;
            const id_beneficiario = discapacidad.id_beneficiario;

            const modalContent = generarContenidoModalEditarDiscapacidad({
                beneficiario,
                empleado,
                tipo_discapacidad,
                disc_especifica,
                diagnostico,
                grado,
                medicamentos,
                habilidades_funcionales,
                requiere_asistencia,
                dispositivo_asistencia,
                observaciones,
                recomendaciones,
                carnet_discapacidad,
                fecha_creacion,
                id_beneficiario,
                id_discapacidad
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
                            <p class="mb-0">No se pudo obtener la información del diagnostico de discapacidad. Código de error: ${xhr.status}</p>
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
function generarContenidoModalEditarDiscapacidad(datos) {
    return `
        <form id="formEditarDiscapacidad" data-id="${datos.id_discapacidad}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura) -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-wheelchair me-2"></i> Información General
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

                            <!-- Empleado (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user-md text-primary me-1"></i> Registrado por
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

                        <!-- Columna Derecha - Detalles Editables de la Discapacidad -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-stethoscope me-2"></i> Detalles de la Discapacidad
                            </h6>

                            <!-- Tipo de Discapacidad (Editable) -->
                            <div class="mb-3">
                                <label for="editar_tipo_discapacidad" class="form-label text-muted small mb-1">
                                    <i class="fas fa-tag text-primary me-1"></i> Tipo de Discapacidad
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select form-select-sm" id="editar_tipo_discapacidad" name="tipo_discapacidad" required>
                                    <option value="" disabled>Seleccione un tipo</option>
                                    <option value="Física" ${datos.tipo_discapacidad === 'Física' ? 'selected' : ''}>Física</option>
                                    <option value="Sensorial" ${datos.tipo_discapacidad === 'Sensorial' ? 'selected' : ''}>Sensorial</option>
                                    <option value="Intelectual" ${datos.tipo_discapacidad === 'Intelectual' ? 'selected' : ''}>Intelectual</option>
                                    <option value="Múltiple" ${datos.tipo_discapacidad === 'Múltiple' ? 'selected' : ''}>Múltiple</option>
                                    <option value="Otro" ${datos.tipo_discapacidad === 'Otro' ? 'selected' : ''}>Otro</option>
                                </select>
                                <div id="editar_tipo_discapacidadError" class="form-text text-danger"></div>
                            </div>

                            <!-- Discapacidad Específica (Editable) -->
                            <div class="mb-3">
                                <label for="editar_disc_especifica" class="form-label text-muted small mb-1">
                                    <i class="fas fa-info-circle text-primary me-1"></i> Discapacidad Específica
                                </label>
                                <input type="text" 
                                       class="form-control form-control-sm" 
                                       id="editar_disc_especifica" 
                                       name="disc_especifica" 
                                       placeholder="Ej: Parálisis cerebral, Autismo, Sordera, etc."
                                       value="${datos.disc_especifica || ''}"
                                       maxlength="200">
                                <div id="editar_disc_especificaError" class="form-text text-danger"></div>
                            </div>

                            <!-- Diagnóstico (Editable) -->
                            <div class="mb-3">
                                <label for="editar_diagnostico" class="form-label text-muted small mb-1">
                                    <i class="fas fa-file-medical text-primary me-1"></i> Diagnóstico
                                    <span class="text-danger">*</span>
                                </label>
                                <input type="text" 
                                       class="form-control form-control-sm" 
                                       id="editar_diagnostico" 
                                       name="diagnostico" 
                                       placeholder="Ingrese el diagnóstico clínico formal..."
                                       value="${datos.diagnostico || ''}"
                                       maxlength="255" 
                                       required>
                                <div id="editar_diagnosticoError" class="form-text text-danger"></div>
                            </div>

                            <!-- Grado (Editable) -->
                            <div class="mb-3">
                                <label for="editar_grado" class="form-label text-muted small mb-1">
                                    <i class="fas fa-thermometer-half text-warning me-1"></i> Grado
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select form-select-sm" id="editar_grado" name="grado" required>
                                    <option value="" disabled>Seleccione el grado</option>
                                    <option value="Leve" ${datos.grado === 'Leve' ? 'selected' : ''}>Leve</option>
                                    <option value="Moderado" ${datos.grado === 'Moderado' ? 'selected' : ''}>Moderado</option>
                                    <option value="Grave" ${datos.grado === 'Grave' ? 'selected' : ''}>Grave</option>
                                </select>
                                <div id="editar_gradoError" class="form-text text-danger"></div>
                            </div>

                            <!-- Medicamentos (Editable) -->
                            <div class="mb-3">
                                <label for="editar_medicamentos" class="form-label text-muted small mb-1">
                                    <i class="fas fa-pills text-info me-1"></i> Medicamentos
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_medicamentos" 
                                          name="medicamentos" 
                                          rows="2" 
                                          placeholder="Lista de medicamentos que toma actualmente..."
                                          maxlength="255">${datos.medicamentos || ''}</textarea>
                                <div id="editar_medicamentosError" class="form-text text-danger"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Segunda fila de campos -->
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <hr class="my-3">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-hands-helping me-2"></i> Apoyos y Asistencia
                            </h6>
                        </div>
                        
                        <!-- Habilidades Funcionales (Editable) -->
                        <div class="col-md-6 mb-3">
                            <label for="editar_habilidades_funcionales" class="form-label text-muted small mb-1">
                                <i class="fas fa-tasks text-success me-1"></i> Habilidades Funcionales
                                <span class="text-danger">*</span>
                            </label>
                            <textarea class="form-control form-control-sm" 
                                      id="editar_habilidades_funcionales" 
                                      name="habilidades_funcionales" 
                                      rows="3" 
                                      placeholder="Describa las habilidades funcionales del beneficiario..."
                                      maxlength="255" 
                                      required>${datos.habilidades_funcionales || ''}</textarea>
                            <div id="editar_habilidades_funcionalesError" class="form-text text-danger"></div>
                        </div>

                        <!-- Requiere Asistencia (Editable) -->
                        <div class="col-md-6 mb-3">
                            <label for="editar_requiere_asistencia" class="form-label text-muted small mb-1">
                                <i class="fas fa-hands-helping ${datos.requiere_asistencia === 'Si' ? 'text-warning' : 'text-secondary'} me-1"></i> ¿Requiere Asistencia?
                            </label>
                            <select class="form-select form-select-sm" id="editar_requiere_asistencia" name="requiere_asistencia">
                                <option value="" ${!datos.requiere_asistencia ? 'selected' : ''}>Seleccione</option>
                                <option value="Si" ${datos.requiere_asistencia === 'Si' ? 'selected' : ''}>Sí</option>
                                <option value="No" ${datos.requiere_asistencia === 'No' ? 'selected' : ''}>No</option>
                            </select>
                            <div id="editar_requiere_asistenciaError" class="form-text text-danger"></div>
                        </div>
                        
                        <!-- Dispositivo de Asistencia (Editable) -->
                        <div class="col-md-6 mb-3">
                            <label for="editar_dispositivo_asistencia" class="form-label text-muted small mb-1">
                                <i class="fas fa-crutch text-primary me-1"></i> Dispositivo de Asistencia
                            </label>
                            <input type="text" 
                                   class="form-control form-control-sm" 
                                   id="editar_dispositivo_asistencia" 
                                   name="dispositivo_asistencia" 
                                   placeholder="Ej: Silla de ruedas, audífonos, lentes, etc."
                                   value="${datos.dispositivo_asistencia || ''}"
                                   maxlength="255">
                            <div id="editar_dispositivo_asistenciaError" class="form-text text-danger"></div>
                        </div>

                        <!-- Carnet de Discapacidad (Editable) -->
                        <div class="col-md-6 mb-3">
                            <label for="editar_carnet_discapacidad" class="form-label text-muted small mb-1">
                                <i class="fas fa-id-card text-success me-1"></i> Carnet de Discapacidad
                            </label>
                            <input type="text" 
                                   class="form-control form-control-sm" 
                                   id="editar_carnet_discapacidad" 
                                   name="carnet_discapacidad" 
                                   placeholder="Número del carnet de discapacidad"
                                   value="${datos.carnet_discapacidad || ''}"
                                   maxlength="20">
                            <div id="editar_carnet_discapacidadError" class="form-text text-danger"></div>
                        </div>
                    </div>
                    
                    <!-- Tercera fila de campos -->
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <hr class="my-3">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-clipboard-list me-2"></i> Observaciones y Recomendaciones
                            </h6>
                        </div>
                        
                        <!-- Observaciones (Editable) -->
                        <div class="col-md-6 mb-3">
                            <label for="editar_observaciones" class="form-label text-muted small mb-1">
                                <i class="fas fa-clipboard-list text-primary me-1"></i> Observaciones
                                <span class="text-danger">*</span>
                            </label>
                            <textarea class="form-control form-control-sm" 
                                      id="editar_observaciones" 
                                      name="observaciones" 
                                      rows="4" 
                                      placeholder="Observaciones adicionales sobre la discapacidad..."
                                      required>${datos.observaciones || ''}</textarea>
                            <div id="editar_observacionesError" class="form-text text-danger"></div>
                        </div>

                        <!-- Recomendaciones (Editable) -->
                        <div class="col-md-6 mb-3">
                            <label for="editar_recomendaciones" class="form-label text-muted small mb-1">
                                <i class="fas fa-lightbulb text-info me-1"></i> Recomendaciones
                            </label>
                            <textarea class="form-control form-control-sm" 
                                      id="editar_recomendaciones" 
                                      name="recomendaciones" 
                                      rows="4" 
                                      placeholder="Recomendaciones para el manejo, apoyos, adaptaciones, etc.">${datos.recomendaciones || ''}</textarea>
                            <div id="editar_recomendacionesError" class="form-text text-danger"></div>
                        </div>
                    </div>
                    
                    <!-- Campos ocultos para datos necesarios -->
                    <input type="hidden" name="id_discapacidad" id="id_discapacidad" value="${datos.id_discapacidad || ''}">
                    <input type="hidden" name="id_beneficiario" id="id_beneficiario" value="${datos.id_beneficiario || ''}">
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarDiscapacidad">
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