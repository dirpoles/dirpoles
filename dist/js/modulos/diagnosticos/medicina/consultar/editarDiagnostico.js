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
        url: 'diagnostico_medicina_detalle',
        method: 'GET',
        data: { id_consulta_med: id },
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

            const medicina = data.data;

            //Formatear datos
            const id_consulta_med = medicina.id_consulta_med;
            const beneficiario = `${medicina.beneficiario}`.trim();
            const empleado = `${medicina.empleado}`.trim();
            const diagnostico = medicina.diagnostico;
            const tratamiento = medicina.tratamiento;
            const motivo_visita = medicina.motivo_visita;
            const observaciones = medicina.observaciones;
            const estatura = medicina.estatura;
            const peso = medicina.peso;
            const tipo_sangre = medicina.tipo_sangre;
            const fecha_creacion = medicina.fecha_creacion;
            const id_detalle_patologia = medicina.id_detalle_patologia;
            const id_patologia = medicina.id_patologia;
            const insumos_usados = medicina.insumos_usados;
            const id_beneficiario = medicina.id_beneficiario;

            const modalContent = generarContenidoModalEditarDiagnostico({
                id_consulta_med,
                beneficiario,
                empleado,
                tipo_sangre,
                diagnostico,
                tratamiento,
                motivo_visita,
                peso,
                estatura,
                observaciones,
                fecha_creacion,
                id_detalle_patologia,
                id_patologia,
                insumos_usados,
                id_beneficiario
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
function generarContenidoModalEditarDiagnostico(datos) {
    return `
        <form id="formEditarDiagnostico" data-id="${datos.id_consulta_med}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura y algunos editables) -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-file-medical me-2"></i> Información General
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

                            <!-- Médico (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user-md text-primary me-1"></i> Médico
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

                            <!-- Motivo de Visita (Editable) -->
                            <div class="mb-3">
                                <label for="editar_motivo_visita" class="form-label text-muted small mb-1">
                                    <i class="fas fa-clipboard-list text-primary me-1"></i> Motivo de Visita
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_motivo_visita" 
                                          name="motivo_visita" 
                                          rows="3" 
                                          >${datos.motivo_visita || ''}</textarea>
                            </div>
                            <div class="text-danger form-text" id="editar_motivo_visitaError"></div>
                        </div>

                        <!-- Columna Derecha - Detalles Médicos Editables -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-notes-medical me-2"></i> Detalles Médicos
                            </h6>

                            <!-- Datos Antropométricos -->
                            <div class="row g-2 mb-3">
                                <div class="col-md-4">
                                    <label for="editar_peso" class="form-label text-muted small mb-1">
                                        <i class="fas fa-weight text-primary me-1"></i> Peso (kg)
                                    </label>
                                    <input type="number" step="0.01" class="form-control form-control-sm" id="editar_peso" name="peso" value="${datos.peso || ''}">
                                </div>
                                <div class="col-md-4">
                                    <label for="editar_estatura" class="form-label text-muted small mb-1">
                                        <i class="fas fa-ruler-vertical text-primary me-1"></i> Altura (m)
                                    </label>
                                    <input type="number" step="0.01" class="form-control form-control-sm" id="editar_estatura" name="estatura" value="${datos.estatura || ''}">
                                </div>
                                <div class="col-md-4">
                                    <label for="editar_tipo_sangre" class="form-label text-muted small mb-1">
                                        <i class="fas fa-tint text-danger me-1"></i> Sangre
                                    </label>
                                    <select class="form-select form-select-sm" id="editar_tipo_sangre" name="tipo_sangre">
                                        <option value="" disabled>Seleccione</option>
                                        ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => `<option value="${t}" ${datos.tipo_sangre === t ? 'selected' : ''}>${t}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="text-danger form-text" id="editar_tipo_sangreError"></div>
                                <div class="text-danger form-text" id="editar_pesoError"></div>
                                <div class="text-danger form-text" id="editar_estaturaError"></div>
                            </div>

                            <!-- Patología (Editable) -->
                            <div class="mb-3">
                                <label for="editar_id_patologia" class="form-label text-muted small mb-1">
                                    <i class="fas fa-heartbeat text-primary me-1"></i> Patología
                                    <span class="text-danger">*</span>
                                </label>
                                
                                <select class="form-select form-select-sm" id="editar_id_patologia" name="id_patologia" required>
                                    <option value="" disabled>Seleccione una patología</option>
                                    <!-- Las opciones se cargarán dinámicamente vía AJAX -->
                                </select>
                                <div id="editar_id_patologiaError" class="form-text text-danger"></div>
                            </div>

                            <!-- Diagnóstico (Editable) -->
                            <div class="mb-3">
                                <label for="editar_diagnostico" class="form-label text-muted small mb-1">
                                    <i class="fas fa-stethoscope text-primary me-1"></i> Diagnóstico
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_diagnostico" 
                                          name="diagnostico" 
                                          rows="3" 
                                          >${datos.diagnostico || ''}</textarea>
                                <div id="editar_diagnosticoError" class="form-text text-danger"></div>
                            </div>

                            <!-- Tratamiento (Editable) -->
                            <div class="mb-3">
                                <label for="editar_tratamiento" class="form-label text-muted small mb-1">
                                    <i class="fas fa-pills text-primary me-1"></i> Tratamiento
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_tratamiento" 
                                          name="tratamiento" 
                                          rows="3">${datos.tratamiento || ''}</textarea>
                                <div id="editar_tratamientoError" class="form-text text-danger"></div>
                            </div>

                            <!-- Insumos Utilizados (Solo Lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-box-open text-primary me-1"></i> Insumos Utilizados
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed; min-height: 38px;">
                                    ${datos.insumos_usados || 'No se utilizaron insumos'}
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> Este campo no puede ser modificado
                                </small>
                            </div>

                            <!-- Observaciones (Editable) -->
                            <div class="mb-3">
                                <label for="editar_observaciones" class="form-label text-muted small mb-1">
                                    <i class="fas fa-comment-medical text-primary me-1"></i> Observaciones
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_observaciones" 
                                          name="observaciones" 
                                          rows="2">${datos.observaciones || ''}</textarea>
                                <div id="editar_observacionesError" class="form-text text-danger"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Campos ocultos para datos necesarios -->
                    <input type="hidden" name="id_consulta_med" id="id_consulta_med" value="${datos.id_consulta_med || ''}">
                    <input type="hidden" name="id_detalle_patologia" id="id_detalle_patologia" value="${datos.id_detalle_patologia || ''}">
                    <input type="hidden" name="id_beneficiario" id="id_beneficiario" value="${datos.id_beneficiario || ''}">
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarDiagnostico">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>

        <script>
            // Cargar patologías
            $.ajax({
                url: 'obtener_patologias_medicina_json',
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.data && response.data.length > 0) {
                        const selectPatologia = $('#editar_id_patologia');
                        
                        // Limpiar opciones existentes excepto la primera
                        selectPatologia.find('option:not(:first)').remove();
                        
                        // Agregar las patologías al select
                        response.data.forEach(function(patologia) {
                            const optionText = patologia.nombre_patologia;
                            const option = new Option(optionText, patologia.id_patologia);
                            
                            // Pre-seleccionar la patología actual si existe
                            /* Nota: datos.id_patologia viene del backend (join con patologia), 
                               asegúrate de que el modelo lo devuelva. */
                            if ('${datos.id_patologia}' && patologia.id_patologia == '${datos.id_patologia}') {
                                option.selected = true;
                            }
                            
                            selectPatologia.append(option);
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error al cargar patologías:', error);
                }
            });
        </script>
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