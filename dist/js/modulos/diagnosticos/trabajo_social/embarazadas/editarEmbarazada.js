/**
 * Editar una embarazada existente
 * @param {number} id - ID de la gestión de embarazada
 * @param {string} tipo - Tipo de la gestión de embarazada
 */
function editarEmbarazada(id, tipo) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Editar diágnostico de Embarazadas');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del servicio de Embarazadas...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'listar_detalle_json',
        method: 'GET',
        data: {
            id_gestion: id,
            tipo: tipo
        },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalGlobal .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para editar este servicio de Embarazadas.
                    </div>
                `);
                return;
            }

            const embarazada = data.data;

            //Formatear datos
            const beneficiario = `${embarazada.beneficiario}`.trim();
            const empleado = `${embarazada.empleado}`.trim();
            const fecha_creacion = moment(embarazada.fecha_creacion).format('DD/MM/YYYY'); // formatear con moment.js
            const patologia = `${embarazada.patologia}`.trim();
            const semanas_gest = `${embarazada.semanas_gest}`.trim();
            const codigo_patria = `${embarazada.codigo_patria}`.trim();
            const serial_patria = `${embarazada.serial_patria}`.trim();
            const id_beneficiario = embarazada.id_beneficiario;
            const id_patologia = embarazada.id_patologia;
            const id_detalle_patologia = embarazada.id_detalle_patologia;
            const id_gestion = embarazada.id_gestion;
            const estado = embarazada.estado;

            const modalContent = generarContenidoModalEditarEmb({
                beneficiario,
                empleado,
                fecha_creacion,
                patologia,
                semanas_gest,
                codigo_patria,
                serial_patria,
                id_beneficiario,
                id_patologia,
                id_detalle_patologia,
                id_gestion,
                estado
            });

            //Mostrar modal
            $('#modalDiagnostico .modal-body').html(modalContent);

            // Inicializar validaciones
            initTooltipsModalEditarEmb();
            validarEditarEmb(id);
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
                            <p class="mb-0">No se pudo obtener la información de la embarazada. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarEmbarazada(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el formulario HTML para editar una gestión de embarazada
 * @param {Object} datos - Objeto con los datos de la embarazada
 * @returns {string} HTML del formulario
 */
function generarContenidoModalEditarEmb(datos) {
    return `
        <form id="formEditarEmb" data-id="${datos.id_gestion}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura) -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-info-circle me-2"></i> Información General
                            </h6>
                            <input type="hidden" name="id_gestion" value="${datos.id_gestion}">
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
                                <i class="fas fa-edit me-2"></i> Detalles del Embarazo
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

                            <!-- Semanas de Gestación (Editable) -->
                            <div class="mb-4 position-relative">
                                <label for="semanas_gest" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-baby-carriage me-1"></i> Semanas de Gestación <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-calendar-week text-muted"></i>
                                    </span>
                                    <input type="text" 
                                           class="form-control border-start-0 ps-0 form-control-lg fs-6" 
                                           id="semanas_gest" 
                                           name="semanas_gest" 
                                           min="1" max="45"
                                           value="${datos.semanas_gest || ''}" required>
                                </div>
                                <div id="semanas_gestError" class="form-text text-danger position-absolute top-100 start-0"></div>
                            </div>

                            <!-- Estado (Editable) -->
                             <div class="mb-4 position-relative">
                                <label for="estado" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-clipboard-check me-1"></i> Estado <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-tasks text-muted"></i>
                                    </span>
                                    <select class="form-select border-start-0 ps-0 form-control-lg fs-6" 
                                            name="estado" 
                                            id="estado" required>
                                        <option value="En Proceso" ${datos.estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                                        <option value="Aprobado" ${datos.estado === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                                        <option value="Rechazado" ${datos.estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                                    </select>
                                </div>
                                <div id="estadoError" class="form-text text-danger position-absolute top-100 start-0"></div>
                            </div>
                            
                            <hr class="my-3">
                            <h6 class="fw-bold text-secondary mb-3 small text-uppercase">Información del Carnet de la Patria</h6>

                            <!-- Código Patria (Editable) -->
                            <div class="mb-3 position-relative">
                                <label for="codigo_patria" class="form-label small text-muted">
                                    Código Patria
                                </label>
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text bg-light">
                                        <i class="fas fa-id-card text-muted"></i>
                                    </span>
                                    <input type="text" 
                                           class="form-control" 
                                           id="codigo_patria" 
                                           name="codigo_patria" 
                                           placeholder="Código" 
                                           value="${datos.codigo_patria || ''}">
                                </div>
                                <div id="codigo_patriaError" class="form-text text-danger position-absolute top-100 start-0"></div>
                            </div>

                            <!-- Serial Patria (Editable) -->
                            <div class="mb-3 position-relative">
                                <label for="serial_patria" class="form-label small text-muted">
                                    Serial Patria
                                </label>
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text bg-light">
                                        <i class="fas fa-barcode text-muted"></i>
                                    </span>
                                    <input type="text" 
                                           class="form-control" 
                                           id="serial_patria" 
                                           name="serial_patria" 
                                           placeholder="Serial" 
                                           value="${datos.serial_patria || ''}">
                                </div>
                                <div id="serial_patriaError" class="form-text text-danger position-absolute top-100 start-0"></div>
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
                <button type="submit" class="btn btn-primary" id="btnGuardarEmb">
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
 * Inicializa los tooltips en el modal de editar exoneracion
 */
function initTooltipsModalEditarEmb() {
    const tooltips = document.querySelectorAll('#modalDiagnostico [data-bs-toggle="tooltip"]');
    tooltips.forEach(el => {
        new bootstrap.Tooltip(el, {
            trigger: 'hover'
        });
    });
}