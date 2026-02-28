/**
 * Función para mostrar los detalles de una cita en un modal
 * @param {number} id - ID de la cita
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
            <p class="mt-3 text-muted">Cargando información de la cita a editar...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'diagnostico_detalle',
        method: 'GET',
        data: { id_psicologia: id },
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

            const psicologia = data.data;

            //Formatear datos
            const id_psicologia = psicologia.id_psicologia;
            const beneficiario = `${psicologia.beneficiario}`.trim();
            const empleado = `${psicologia.empleado}`.trim();
            const tipoConsulta = psicologia.tipo_consulta;
            const diagnostico = psicologia.diagnostico;
            const tratamiento_gen = psicologia.tratamiento_gen;
            const motivo_retiro = psicologia.motivo_retiro;
            const duracion_retiro = psicologia.duracion_retiro;
            const motivo_cambio = psicologia.motivo_cambio;
            const observaciones = psicologia.observaciones;
            const fecha_creacion = psicologia.fecha_creacion;
            const id_detalle_patologia = psicologia.id_detalle_patologia;

            const modalContent = generarContenidoModalEditarDiagnostico({
                id_psicologia,
                beneficiario,
                empleado,
                tipoConsulta,
                diagnostico,
                tratamiento_gen,
                motivo_retiro,
                duracion_retiro,
                motivo_cambio,
                observaciones,
                fecha_creacion,
                id_detalle_patologia
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
        <form id="formEditarDiagnostico" data-id="${datos.id_psicologia}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura y editables) -->
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

                            <!-- Psicólogo (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user-md text-primary me-1"></i> Psicólogo
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.empleado || 'No asignado'}
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> Este campo no puede ser modificado
                                </small>
                            </div>

                            <!-- Tipo de Consulta (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-clipboard-list text-primary me-1"></i> Tipo de Consulta
                                </label>
                                <div class="mt-1">
                                    <span class="badge bg-info fs-6">${datos.tipoConsulta || 'No especificado'}</span>
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

                        <!-- Columna Derecha - Detalles Editables del Diagnóstico -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-notes-medical me-2"></i> Detalles del Diagnóstico
                            </h6>

                            <!-- Patología (Editable - solo para Diagnóstico) -->
                            ${datos.tipoConsulta === 'Diagnóstico' ? `
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
                                          rows="4" 
                                          placeholder="Describa el diagnóstico psicológico..."
                                          required>${datos.diagnostico || ''}</textarea>
                                <small class="form-text text-muted">
                                    Incluya observaciones sobre el estado mental, emocional y conductual
                                </small>
                                <div id="editar_diagnosticoError" class="form-text text-danger"></div>
                            </div>

                            <!-- Tratamiento General (Editable) -->
                            <div class="mb-3">
                                <label for="editar_tratamiento_gen" class="form-label text-muted small mb-1">
                                    <i class="fas fa-pills text-primary me-1"></i> Tratamiento
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_tratamiento_gen" 
                                          name="tratamiento_gen" 
                                          rows="3" 
                                          placeholder="Describa el tratamiento general recomendado...">${datos.tratamiento_gen || ''}</textarea>
                                <small class="form-text text-muted">
                                    Terapias, actividades, seguimientos, medicación (si aplica)
                                </small>
                                <div id="editar_tratamiento_genError" class="form-text text-danger"></div>
                            </div>
                            ` : ''}

                            <!-- Motivo de Retiro (Editable - solo para Retiro temporal) -->
                            ${datos.tipoConsulta === 'Retiro temporal' ? `
                            <div class="mb-3">
                                <label for="editar_motivo_retiro" class="form-label text-muted small mb-1">
                                    <i class="fas fa-pause-circle text-warning me-1"></i> Motivo del Retiro
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select form-select-sm" id="editar_motivo_retiro" name="motivo_retiro" required>
                                    <option value="" disabled>Seleccione el motivo</option>
                                    <option value="Problemas personales/familiares" ${datos.motivo_retiro === 'Problemas personales/familiares' ? 'selected' : ''}>Problemas personales/familiares</option>
                                    <option value="Problemas económicos" ${datos.motivo_retiro === 'Problemas económicos' ? 'selected' : ''}>Problemas económicos</option>
                                    <option value="Salud física" ${datos.motivo_retiro === 'Salud física' ? 'selected' : ''}>Salud física</option>
                                    <option value="Salud mental" ${datos.motivo_retiro === 'Salud mental' ? 'selected' : ''}>Salud mental</option>
                                    <option value="Trabajo/empleo" ${datos.motivo_retiro === 'Trabajo/empleo' ? 'selected' : ''}>Trabajo/empleo</option>
                                    <option value="Situación migratoria" ${datos.motivo_retiro === 'Situación migratoria' ? 'selected' : ''}>Situación migratoria</option>
                                    <option value="Otro" ${datos.motivo_retiro === 'Otro' || (!['Problemas personales/familiares', 'Problemas económicos', 'Salud física', 'Salud mental', 'Trabajo/empleo', 'Situación migratoria'].includes(datos.motivo_retiro)) ? 'selected' : ''}>Otro motivo</option>
                                </select>
                                <div id="editar_motivo_retiroError" class="form-text text-danger"></div>
                            </div>

                            <!-- Otro motivo (si selecciona "Otro") -->
                            <div class="mb-3" id="editar-otro-motivo-container" style="display: ${(datos.motivo_retiro && !['Problemas personales/familiares', 'Problemas económicos', 'Salud física', 'Salud mental', 'Trabajo/empleo', 'Situación migratoria'].includes(datos.motivo_retiro)) ? 'block' : 'none'};">
                                <label for="editar_motivo_retiro_otro" class="form-label text-muted small mb-1">
                                    Especifique el motivo
                                </label>
                                <input type="text" 
                                       class="form-control form-control-sm" 
                                       id="editar_motivo_retiro_otro" 
                                       name="motivo_retiro_otro" 
                                       placeholder="Describa el motivo del retiro..."
                                       value="${(datos.motivo_retiro && !['Problemas personales/familiares', 'Problemas económicos', 'Salud física', 'Salud mental', 'Trabajo/empleo', 'Situación migratoria'].includes(datos.motivo_retiro)) ? datos.motivo_retiro : ''}">
                                <div id="editar_motivo_retiro_otroError" class="form-text text-danger"></div>
                            </div>

                            <!-- Duración del Retiro (Editable) -->
                            <div class="mb-3">
                                <label for="editar_duracion_retiro" class="form-label text-muted small mb-1">
                                    <i class="fas fa-hourglass-half text-warning me-1"></i> Duración Estimada
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select form-select-sm" id="editar_duracion_retiro" name="duracion_retiro" required>
                                    <option value="" disabled>Seleccione duración</option>
                                    <option value="15 días" ${datos.duracion_retiro === '15 días' ? 'selected' : ''}>15 días</option>
                                    <option value="1 mes" ${datos.duracion_retiro === '1 mes' ? 'selected' : ''}>1 mes</option>
                                    <option value="2 meses" ${datos.duracion_retiro === '2 meses' ? 'selected' : ''}>2 meses</option>
                                    <option value="3 meses" ${datos.duracion_retiro === '3 meses' ? 'selected' : ''}>3 meses</option>
                                    <option value="6 meses" ${datos.duracion_retiro === '6 meses' ? 'selected' : ''}>6 meses</option>
                                    <option value="1 año" ${datos.duracion_retiro === '1 año' ? 'selected' : ''}>1 año</option>
                                    <option value="Indefinido" ${datos.duracion_retiro === 'Indefinido' ? 'selected' : ''}>Indefinido</option>
                                </select>
                                <div id="editar_duracion_retiroError" class="form-text text-danger"></div>
                            </div>
                            ` : ''}

                            <!-- Motivo de Cambio (Editable - solo para Cambio de carrera) -->
                            ${datos.tipoConsulta === 'Cambio de carrera' ? `
                            <div class="mb-3">
                                <label for="editar_motivo_cambio" class="form-label text-muted small mb-1">
                                    <i class="fas fa-exchange-alt text-info me-1"></i> Motivo del Cambio
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_motivo_cambio" 
                                          name="motivo_cambio" 
                                          rows="4" 
                                          placeholder="Explique los motivos psicológicos/vocacionales del cambio..."
                                          required>${datos.motivo_cambio || ''}</textarea>
                                <small class="form-text text-muted">
                                    Incluya aspectos psicológicos, vocacionales, intereses, aptitudes, etc.
                                </small>
                                <div id="editar_motivo_cambioError" class="form-text text-danger"></div>
                            </div>
                            ` : ''}

                            <!-- Observaciones (Editable - siempre se muestra) -->
                            <div class="mb-3">
                                <label for="editar_observaciones" class="form-label text-muted small mb-1">
                                    <i class="fas fa-comment-medical text-primary me-1"></i> Observaciones
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_observaciones" 
                                          name="observaciones" 
                                          rows="3" 
                                          placeholder="Observaciones adicionales, recomendaciones...">${datos.observaciones || ''}</textarea>
                                <small class="form-text text-muted">
                                    Notas adicionales, seguimiento recomendado
                                </small>
                                <div id="editar_observacionesError" class="form-text text-danger"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Campos ocultos para datos necesarios -->
                    <input type="hidden" name="id_psicologia" id="id_psicologia" value="${datos.id_psicologia || ''}">
                    <input type="hidden" name="tipo_consulta" id="tipo_consulta" value="${datos.tipoConsulta || ''}">
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
            // Cargar patologías si es tipo Diagnóstico
            if ('${datos.tipoConsulta}' === 'Diagnóstico') {
                $.ajax({
                    url: 'obtener_patologias_json',
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
                                const option = new Option(optionText, patologia.id_detalle_patologia);
                                
                                // Pre-seleccionar la patología actual si existe
                                if ('${datos.id_detalle_patologia}' && patologia.id_detalle_patologia == '${datos.id_detalle_patologia}') {
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
            }
            
            // Manejar cambio en motivo_retiro para mostrar/ocultar campo "Otro"
            $('#editar_motivo_retiro').on('change', function() {
                if ($(this).val() === 'Otro') {
                    $('#editar-otro-motivo-container').show();
                } else {
                    $('#editar-otro-motivo-container').hide();
                    $('#editar_motivo_retiro_otro').val('');
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