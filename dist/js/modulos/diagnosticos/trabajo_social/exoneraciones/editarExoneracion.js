/**
 * Editar una exoneración existente
 * @param {number} id - ID de la exoneración
 * @param {string} tipo - Tipo de diagnóstico (becas, exoneraciones, fames, embarazadas)
 */
function editarExoneracion(id, tipo) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Editar Exoneración');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la exoneración...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'listar_detalle_json',
        method: 'GET',
        data: {
            id_exoneracion: id,
            tipo: tipo
        },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalGlobal .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para editar esta exoneración.
                    </div>
                `);
                return;
            }

            const exoneracion = data.data;

            //Formatear datos
            const beneficiario = `${exoneracion.beneficiario}`.trim();
            const empleado = `${exoneracion.empleado}`.trim();
            const motivo = exoneracion.motivo;
            const otro_motivo = exoneracion.otro_motivo;
            const fecha_creacion = moment(exoneracion.fecha_creacion).format('DD/MM/YYYY'); // formatear con moment.js
            const carnet_discapacidad = exoneracion.carnet_discapacidad;
            const id_beneficiario = exoneracion.id_beneficiario;
            const id_exoneracion = exoneracion.id_exoneracion;

            const modalContent = generarContenidoModalEditarExoneracion({
                id_exoneracion,
                beneficiario,
                empleado,
                fecha_creacion,
                carnet_discapacidad,
                motivo,
                otro_motivo,
                id_beneficiario
            });

            //Mostrar modal
            $('#modalDiagnostico .modal-body').html(modalContent);

            // Inicializar validaciones
            initTooltipsModalEditarExoneracion();
            validarEditarExoneracion(id);
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
function generarContenidoModalEditarExoneracion(datos) {
    // Determinar si "Otro" está seleccionado para mostrar el campo adicional
    const mostrarOtroMotivo = datos.motivo === 'Otro';

    return `
        <form id="formEditarExoneracion" data-id="${datos.id_exoneracion}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura) -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-info-circle me-2"></i> Información General
                            </h6>
                            <input type="hidden" name="id_exoneracion" value="${datos.id_exoneracion}">
                            <input type="hidden" name="id_beneficiario" value="${datos.id_beneficiario}">
                            
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
                                <i class="fas fa-edit me-2"></i> Detalles de Exoneración
                            </h6>

                            <!-- Motivo de Exoneración (Editable) -->
                            <div class="mb-4 position-relative">
                                <label for="motivo" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-comment-dots me-1"></i> Motivo de Exoneración <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-clipboard-list text-muted"></i>
                                    </span>
                                    <select class="form-select border-start-0 ps-0 form-control-lg fs-6" 
                                            name="motivo" 
                                            id="motivo">
                                        <option value="" disabled>Seleccione un motivo</option>
                                        <option value="Inscripción" ${datos.motivo === 'Inscripción' ? 'selected' : ''}>Inscripción</option>
                                        <option value="Paquete de Grado" ${datos.motivo === 'Paquete de Grado' ? 'selected' : ''}>Paquete de Grado</option>
                                        <option value="Otro" ${datos.motivo === 'Otro' ? 'selected' : ''}>Otro</option>
                                    </select>
                                </div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Razón de la exoneración</small>
                                <div id="motivoError" class="form-text text-danger position-absolute top-100 start-0"></div>
                            </div>

                            <!-- Otro Motivo (Condicional - Solo si "Otro" está seleccionado) -->
                            <div class="mb-4 position-relative" id="otro_motivo_container" style="display: ${mostrarOtroMotivo ? 'block' : 'none'};">
                                <label for="otro_motivo" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-pen me-1"></i> Especifique el Motivo <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-keyboard text-muted"></i>
                                    </span>
                                    <input type="text" 
                                           class="form-control border-start-0 ps-0 form-control-lg fs-6" 
                                           id="otro_motivo" 
                                           name="otro_motivo" 
                                           placeholder="Describa el motivo" 
                                           maxlength="100" 
                                           value="${datos.otro_motivo || ''}">
                                </div>
                                <div id="otro_motivoError" class="form-text text-danger position-absolute top-100 start-0"></div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Descripción del motivo</small>
                            </div>

                            <!-- Carnet de Discapacidad (Editable) -->
                            <div class="mb-4 position-relative">
                                <label for="carnet_discapacidad" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-id-card me-1"></i> Carnet de Discapacidad
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-hashtag text-muted"></i>
                                    </span>
                                    <input type="text" 
                                           class="form-control border-start-0 ps-0 form-control-lg fs-6" 
                                           id="carnet_discapacidad" 
                                           name="carnet_discapacidad" 
                                           placeholder="Ingrese el código del carnet (opcional)" 
                                           maxlength="100" 
                                           value="${datos.carnet_discapacidad || ''}">
                                </div>
                                <div id="carnet_discapacidadError" class="form-text text-danger position-absolute top-100 start-0"></div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Código del carnet (dejar vacío si no aplica)</small>
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
                <button type="submit" class="btn btn-primary" id="btnGuardarExoneracion">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>
        
        <script>
            // Mostrar/ocultar campo "Otro Motivo" dinámicamente
            $('#motivo').on('change', function() {
                if ($(this).val() === 'Otro') {
                    $('#otro_motivo_container').slideDown(200);
                    $('#otro_motivo').prop('required', true);
                } else {
                    $('#otro_motivo_container').slideUp(200);
                    $('#otro_motivo').prop('required', false).val('');
                }
            });
        </script>
    `;
}

/**
 * Inicializa los tooltips en el modal de editar exoneracion
 */
function initTooltipsModalEditarExoneracion() {
    const tooltips = document.querySelectorAll('#modalDiagnostico [data-bs-toggle="tooltip"]');
    tooltips.forEach(el => {
        new bootstrap.Tooltip(el, {
            trigger: 'hover'
        });
    });
}