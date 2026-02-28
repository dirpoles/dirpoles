/**
 * Función para mostrar los detalles de un diagnostico de la jornada
 * @param {number} id - ID de la relación jornada-beneficiario
 */
function verDiagnostico(id) {
    const modalElement = document.getElementById('modalDiagnostico');
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (!modal) {
        modal = new bootstrap.Modal(modalElement);
    }

    // Configurar título del modal
    $('#modalDiagnosticoTitle').text('Detalles del Diagnóstico');

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
            if (!data || (Array.isArray(data) && data.length === 0)) {
                $('#modalDiagnostico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este diagnóstico.
                    </div>
                `);
                return;
            }

            // El backend devuelve un objeto con fetch, o un array con fetchAll
            const diagnostico = Array.isArray(data) ? data[0] : data;

            //  3. Formatear datos
            const cedula = diagnostico.cedula_completa;
            const beneficiario = diagnostico.beneficiario;
            const diagnostico_jornada = diagnostico.diagnostico;
            const tratamiento = diagnostico.tratamiento;
            const observaciones = diagnostico.observaciones;
            const fecha_diagnostico = diagnostico.fecha_diagnostico;
            const insumos = diagnostico.insumos || [];

            //  4. Generar HTML del modal
            const modalContent = modalDiagnostico({
                cedula,
                beneficiario,
                diagnostico_jornada,
                tratamiento,
                observaciones,
                fecha_diagnostico,
                insumos
            });

            //  5. Insertar el nuevo contenido
            $('#modalDiagnostico .modal-body').html(modalContent);

        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //  6. Mostrar error en el modal
            $('#modalDiagnostico .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del diagnóstico. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verDiagnostico(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para el modal de detalles del diagnostico
 * @param {Object} datos - Objeto con los datos formateados del diagnostico
 * @returns {string} HTML del contenido del modal
 */
function modalDiagnostico(datos) {
    // Generar HTML de insumos
    let insumosHTML = '';
    if (datos.insumos && datos.insumos.length > 0) {
        insumosHTML = `
            <div class="table-responsive mt-2">
                <table class="table table-sm table-hover border">
                    <thead class="bg-secondary text-white">
                        <tr>
                            <th class="ps-3">Insumo / Medicamento</th>
                            <th class="text-center pe-3">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.insumos.map(insumo => `
                            <tr>
                                <td class="ps-3 py-2">
                                    <div class="fw-bold">${insumo.nombre_insumo}</div>
                                    <div class="small text-muted">${insumo.descripcion || ''}</div>
                                </td>
                                <td class="text-center align-middle fw-bold text-primary pe-3">
                                    ${insumo.cantidad_usada}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        insumosHTML = `
            <div class="text-center py-3 bg-white rounded border">
                <i class="fas fa-box-open text-muted mb-2 fa-2x"></i>
                <p class="text-muted mb-0">No se registraron insumos utilizados en este diagnóstico.</p>
            </div>
        `;
    }

    return `
        <!-- Tarjeta de Información Principal -->
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Información del Paciente -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-user-circle me-2"></i> Información del Paciente
                        </h6>
                        
                        <!-- Beneficiario -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-0">Nombre de Beneficiario</label>
                                    <div class="fw-bold">
                                        ${datos.beneficiario}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cédula -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-id-card"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-0">Cédula</label>
                                    <div class="fw-bold">
                                        ${datos.cedula}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha - Fecha del Diagnóstico -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-calendar-alt me-2"></i> Registro
                        </h6>

                        <!-- Fecha -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-0">Fecha y Hora</label>
                                    <div class="fw-bold">
                                        ${new Date(datos.fecha_diagnostico).toLocaleString('es-VE')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <!-- Detalles Médicos -->
                <div class="row">
                    <!-- Sección Izquierda: Diagnóstico y Tratamiento -->
                    <div class="col-lg-7">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-stethoscope me-2"></i> Detalles Médicos
                        </h6>

                        <!-- Diagnóstico -->
                        <div class="col-md-12 mb-3">
                            <div class="bg-white rounded p-3 border-start border-4 border-danger h-100">
                                <label class="form-label text-danger small mb-1 fw-bold">
                                    <i class="fas fa-notes-medical me-1"></i> Diagnóstico
                                </label>
                                <div class="text-dark">
                                    ${datos.diagnostico_jornada}
                                </div>
                            </div>
                        </div>

                        <!-- Tratamiento -->
                        <div class="col-md-12 mb-3">
                            <div class="bg-white rounded p-3 border-start border-4 border-success h-100">
                                <label class="form-label text-success small mb-1 fw-bold">
                                    <i class="fas fa-pills me-1"></i> Tratamiento
                                </label>
                                <div class="text-dark">
                                    ${datos.tratamiento}
                                </div>
                            </div>
                        </div>

                        <!-- Observaciones -->
                        <div class="col-md-12 mb-3">
                            <div class="bg-white rounded p-3 border-start border-4 border-info h-100">
                                <label class="form-label text-info small mb-1 fw-bold">
                                    <i class="fas fa-sticky-note me-1"></i> Observaciones Adicionales
                                </label>
                                <div class="text-muted italic">
                                    ${datos.observaciones || '<em>Sin observaciones adicionales</em>'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección Derecha: Insumos -->
                    <div class="col-lg-5">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-box me-2"></i> Insumos Entregados
                        </h6>
                        ${insumosHTML}
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer bg-light py-3">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-1"></i> Cerrar
            </button>
        </div>
    `;
}
