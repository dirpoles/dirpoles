/**
 * Función para mostrar los detalles de un diagnostico de la jornada
 * @param {number} id - ID de la relación jornada-beneficiario
 */
function editarDiagnostico(id) {
    const modalElement = document.getElementById('modalDiagnostico');
    let modal = bootstrap.Modal.getInstance(modalElement);

    if (!modal) {
        modal = new bootstrap.Modal(modalElement);
    }

    // Configurar título del modal
    $('#modalDiagnosticoTitle').text('Editar Diagnóstico');

    // Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del diagnóstico...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    // Hacer AJAX para obtener datos del diagnóstico
    $.ajax({
        url: 'diagnostico_jornada_detalle',
        method: 'GET',
        data: { id_jornada_beneficiario: id },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data) {
                $('#modalDiagnostico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este diagnóstico.
                    </div>
                `);
                return;
            }

            // El backend devuelve un objeto con fetch, o un array con fetchAll
            const diagnostico = data;

            //  3. Formatear datos
            const cedula = diagnostico.cedula_completa;
            const beneficiario = diagnostico.beneficiario;
            const diagnostico_jornada = diagnostico.diagnostico;
            const tratamiento = diagnostico.tratamiento;
            const observaciones = diagnostico.observaciones;
            const fecha_diagnostico = diagnostico.fecha_diagnostico;
            const id_jornada_diagnostico = diagnostico.id_jornada_diagnostico;
            const insumos = diagnostico.insumos || [];

            //  4. Generar HTML del modal
            const modalContent = modalDiagnosticoEditarJornada({
                cedula,
                beneficiario,
                diagnostico_jornada,
                tratamiento,
                observaciones,
                fecha_diagnostico,
                id_jornada_diagnostico,
                insumos
            });

            //  5. Insertar el nuevo contenido
            $('#modalDiagnostico .modal-body').html(modalContent);
            validarEditarDiagnosticoJornada();

        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //  7. Mostrar error en el modal
            $('#modalDiagnostico .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información para editar el diagnóstico. Código de error: ${xhr.status}</p>
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
 * Genera el contenido HTML para el modal de editar el diagnostico
 * @param {Object} datos - Objeto con los datos formateados del diagnostico
 * @returns {string} HTML del contenido del modal
 */
function modalDiagnosticoEditarJornada(datos) {
    // Generar texto de insumos (solo lectura)
    let insumosText = 'No se registraron insumos utilizados.';
    if (datos.insumos && datos.insumos.length > 0) {
        insumosText = datos.insumos.map(i => `${i.nombre_insumo} (${i.cantidad_usada})`).join(', ');
    }

    return `
        <form id="formEditarDiagnosticoJornada">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura) -->
                        <div class="col-md-5 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-info-circle me-2"></i> Información del Paciente
                            </h6>
                            
                            <!-- Beneficiario -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user text-primary me-1"></i> Beneficiario
                                </label>
                                <div class="form-control form-control-sm bg-white text-dark fw-bold" style="cursor: not-allowed; border-left: 3px solid #0d6efd;">
                                    ${datos.beneficiario}
                                </div>
                            </div>

                            <!-- Cédula -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-id-card text-primary me-1"></i> Cédula
                                </label>
                                <div class="form-control form-control-sm bg-white text-dark" style="cursor: not-allowed;">
                                    ${datos.cedula}
                                </div>
                            </div>

                            <!-- Fecha de Registro -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-calendar-alt text-primary me-1"></i> Fecha de Registro
                                </label>
                                <div class="form-control form-control-sm bg-white text-dark" style="cursor: not-allowed;">
                                    ${new Date(datos.fecha_diagnostico).toLocaleString('es-VE')}
                                </div>
                            </div>

                            <!-- Insumos Utilisados (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-box-open text-primary me-1"></i> Insumos Entregados
                                </label>
                                <div class="form-control form-control-sm bg-white text-muted" style="cursor: not-allowed; min-height: 60px; overflow-y: auto;">
                                    ${insumosText}
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> Los insumos no pueden ser modificados.
                                </small>
                            </div>
                        </div>

                        <!-- Columna Derecha - Campos Editables -->
                        <div class="col-md-7">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-edit me-2"></i> Editar Detalles Médicos
                            </h6>

                            <!-- Diagnóstico -->
                            <div class="mb-3">
                                <label for="editar_diagnostico" class="form-label text-muted small mb-1">
                                    <i class="fas fa-stethoscope text-danger me-1"></i> Diagnóstico
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_diagnostico" 
                                          name="diagnostico" 
                                          rows="4" 
                                          required>${datos.diagnostico_jornada || ''}</textarea>
                                <div id="editar_diagnosticoError" class="form-text text-danger"></div>
                            </div>

                            <!-- Tratamiento -->
                            <div class="mb-3">
                                <label for="editar_tratamiento" class="form-label text-muted small mb-1">
                                    <i class="fas fa-pills text-success me-1"></i> Tratamiento
                                    <span class="text-danger">*</span>
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_tratamiento" 
                                          name="tratamiento" 
                                          rows="4"
                                          required>${datos.tratamiento || ''}</textarea>
                                <div id="editar_tratamientoError" class="form-text text-danger"></div>
                            </div>

                            <!-- Observaciones -->
                            <div class="mb-3">
                                <label for="editar_observaciones" class="form-label text-muted small mb-1">
                                    <i class="fas fa-comment-medical text-info me-1"></i> Observaciones Adicionales
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_observaciones" 
                                          name="observaciones" 
                                          rows="3">${datos.observaciones || ''}</textarea>
                                <div id="editar_observacionesError" class="form-text text-danger"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Campos ocultos -->
                    <input type="hidden" name="id_jornada_diagnostico" value="${datos.id_jornada_diagnostico}">
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
    `;
}
