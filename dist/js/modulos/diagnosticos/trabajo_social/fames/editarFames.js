/**
 * Editar un FAMES existente
 * @param {number} id - ID del FAMES
 * @param {string} tipo - Tipo de módulo
 */
function editarFames(id, tipo) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Editar servicio de FAMES');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del servicio de FAMES...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'listar_detalle_json',
        method: 'GET',
        data: {
            id_fames: id,
            tipo: tipo
        },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalGlobal .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para editar este servicio de FAMES.
                    </div>
                `);
                return;
            }

            const fames = data.data;

            //Formatear datos
            const beneficiario = `${fames.beneficiario}`.trim();
            const empleado = `${fames.empleado}`.trim();
            const fecha_creacion = moment(fames.fecha_creacion).format('DD/MM/YYYY'); // formatear con moment.js
            const patologia = `${fames.patologia}`.trim();
            const tipo_ayuda = `${fames.tipo_ayuda}`.trim();
            const otro_tipo = `${fames.otro_tipo}`.trim();
            const id_beneficiario = fames.id_beneficiario;
            const id_fames = fames.id_fames;
            const id_patologia = fames.id_patologia;
            const id_detalle_patologia = fames.id_detalle_patologia;

            const modalContent = generarContenidoModalEditarFames({
                beneficiario,
                empleado,
                fecha_creacion,
                patologia,
                tipo_ayuda,
                otro_tipo,
                id_beneficiario,
                id_fames,
                id_patologia,
                id_detalle_patologia
            });

            //Mostrar modal
            $('#modalDiagnostico .modal-body').html(modalContent);

            // Inicializar validaciones
            initTooltipsModalEditarFames();
            validarEditarFames(id);
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
                            <p class="mb-0">No se pudo obtener la información de la beca. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarBeca(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el formulario HTML para editar una exoneración
 * @param {Object} datos - Objeto con los datos de la exoneración
 * @returns {string} HTML del formulario
 */
function generarContenidoModalEditarFames(datos) {
    // Determinar si "Otros" está seleccionado para mostrar el campo adicional
    const mostrarOtroTipo = datos.tipo_ayuda === 'Otros';

    return `
        <form id="formEditarFames" data-id="${datos.id_fames}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura) -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-info-circle me-2"></i> Información General
                            </h6>
                            <input type="hidden" name="id_fames" value="${datos.id_fames}">
                            <input type="hidden" name="id_beneficiario" value="${datos.id_beneficiario}">
                            <input type="hidden" name="id_detalle_patologia" value="${datos.id_detalle_patologia}">
                            
                            <!-- Beneficiario (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user-graduate text-primary me-1"></i> Beneficiario
                                </label>
                                <div class="form-control form-control-sm bg-white text-dark fw-bold" style="cursor: default;" readonly>
                                    ${datos.beneficiario || 'No especificado'}
                                </div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Este campo no puede ser modificado</small>
                            </div>

                            <!-- Registrado por (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user-tie text-primary me-1"></i> Registrado por
                                </label>
                                <div class="form-control form-control-sm bg-white text-muted" style="cursor: default;" readonly>
                                    ${datos.empleado || 'No asignado'}
                                </div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Este campo no puede ser modificado</small>
                            </div>

                            <!-- Fecha de Registro (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-calendar-alt text-primary me-1"></i> Fecha de Registro
                                </label>
                                <div class="form-control form-control-sm bg-white text-muted" style="cursor: default;" readonly>
                                    ${datos.fecha_creacion || 'No especificada'}
                                </div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Este campo no puede ser modificado</small>
                            </div>
                        </div>

                        <!-- Columna Derecha - Datos Editables -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-edit me-2"></i> Detalles de FAMES
                            </h6>

                            <!-- Patología (Editable - Select AJAX) -->
                            <div class="mb-4 position-relative">
                                <label for="editar_id_patologia" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-heartbeat me-1"></i> Patología <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-notes-medical text-muted"></i>
                                    </span>
                                    <select class="form-select border-start-0 ps-0 form-control-lg fs-6" 
                                            name="id_patologia" 
                                            id="editar_id_patologia" required>
                                        <option value="" disabled>Seleccione una patología</option>
                                        <!-- Opciones cargadas vía AJAX -->
                                    </select>
                                </div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Patología asociada</small>
                                <div id="editar_id_patologiaError" class="form-text text-danger position-absolute top-100 start-0"></div>
                            </div>

                            <!-- Tipo de Ayuda (Editable) -->
                            <div class="mb-4 position-relative">
                                <label for="tipo_ayuda" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-hand-holding-medical me-1"></i> Tipo de Ayuda <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-hands-helping text-muted"></i>
                                    </span>
                                    <select class="form-select border-start-0 ps-0 form-control-lg fs-6" 
                                            name="tipo_ayuda" 
                                            id="tipo_ayuda" required>
                                        <option value="" disabled>Seleccione tipo de ayuda</option>
                                        <option value="Económica" ${datos.tipo_ayuda === 'Económica' ? 'selected' : ''}>Económica</option>
                                        <option value="Operaciones" ${datos.tipo_ayuda === 'Operaciones' ? 'selected' : ''}>Operaciones</option>
                                        <option value="Exámenes" ${datos.tipo_ayuda === 'Exámenes' ? 'selected' : ''}>Exámenes</option>
                                        <option value="Otros" ${datos.tipo_ayuda === 'Otros' ? 'selected' : ''}>Otros</option>
                                    </select>
                                </div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Tipo de ayuda solicitada</small>
                                <div id="tipo_ayudaError" class="form-text text-danger position-absolute top-100 start-0"></div>
                            </div>

                            <!-- Otro Tipo (Condicional - Solo si "Otros" está seleccionado) -->
                            <div class="mb-4 position-relative" id="otro_tipo_container" style="display: ${mostrarOtroTipo ? 'block' : 'none'};">
                                <label for="otro_tipo" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-pen me-1"></i> Especifique el Tipo <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-keyboard text-muted"></i>
                                    </span>
                                    <input type="text" 
                                           class="form-control border-start-0 ps-0 form-control-lg fs-6" 
                                           id="otro_tipo" 
                                           name="otro_tipo" 
                                           placeholder="Describa el tipo de ayuda" 
                                           maxlength="100" 
                                           value="${datos.otro_tipo || ''}">
                                </div>
                                <div id="otro_tipoError" class="form-text text-danger position-absolute top-100 start-0"></div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Descripción del tipo de ayuda</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarFames">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>
        
        <script>
            // Cargar patologías
            $.ajax({
                url: 'patologias_ts_json',
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
                            // Nota: Usamos datos.id_patologia del scope superior
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

            // Mostrar/ocultar campo "Otro Tipo" dinámicamente
            $('#tipo_ayuda').on('change', function() {
                if ($(this).val() === 'Otros') {
                    $('#otro_tipo_container').slideDown(200);
                    $('#otro_tipo').prop('required', true);
                } else {
                    $('#otro_tipo_container').slideUp(200);
                    $('#otro_tipo').prop('required', false).val('');
                }
            });
        </script>
    `;
}

/**
 * Inicializa los tooltips en el modal de editar exoneracion
 */
function initTooltipsModalEditarFames() {
    const tooltips = document.querySelectorAll('#modalDiagnostico [data-bs-toggle="tooltip"]');
    tooltips.forEach(el => {
        new bootstrap.Tooltip(el, {
            trigger: 'hover'
        });
    });
}