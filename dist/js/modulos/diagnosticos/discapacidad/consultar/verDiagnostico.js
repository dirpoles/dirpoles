/**
 * Función para mostrar los detalles de una cita en un modal
 * @param {number} id - ID de la cita
 */
function verDiagnostico(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Detalle del Diagnóstico');

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
        url: 'discapacidad_detalle',
        method: 'GET',
        data: { id_discapacidad: id },
        dataType: 'json',
        success: function (data) {

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalDiagnostico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este diagnóstico.
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

            const modalContent = generarContenidoModalDiscapacidad({
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
                fecha_creacion
            });

            //Mostrar modal
            $('#modalDiagnostico .modal-body').html(modalContent);
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
 * Genera el contenido HTML para el modal de detalles de la cita
 * @param {Object} datos - Objeto con los datos formateados de la cita
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModalDiscapacidad(datos) {
    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Información General del Diagnóstico -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-wheelchair me-2"></i> Información General
                        </h6>
                        
                        <!-- Beneficiario -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Beneficiario</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.beneficiario || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empleado -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-md"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Registrado por</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.empleado || 'No asignado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tipo de Discapacidad -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-tag"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Tipo de Discapacidad</label>
                                    <div class="mt-1">
                                        <span class="badge bg-info fs-6">${datos.tipo_discapacidad || 'No especificado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Discapacidad Específica -->
                        ${datos.disc_especifica ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-info-circle"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Discapacidad Específica</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.disc_especifica}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Carnet de Discapacidad -->
                        ${datos.carnet_discapacidad ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-success me-2 mt-1">
                                    <i class="fas fa-id-card"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Carnet de Discapacidad</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        <span class="badge bg-success">${datos.carnet_discapacidad}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Fecha de Creación -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Registro</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.fecha_creacion || 'No especificada'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha - Detalles del Diagnóstico -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-stethoscope me-2"></i> Detalles de la Discapacidad
                        </h6>

                        <!-- Diagnóstico -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-file-medical"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Diagnóstico</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.diagnostico || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Grado -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-warning me-2 mt-1">
                                    <i class="fas fa-thermometer-half"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Grado</label>
                                    <div class="mt-1">
                                        ${datos.grado ? `
                                            <span class="badge ${datos.grado === 'Grave' ? 'bg-danger' :
                datos.grado === 'Moderado' ? 'bg-warning text-dark' :
                    'bg-info'
            } fs-6">
                                                ${datos.grado}
                                            </span>
                                        ` : '<span class="badge bg-secondary fs-6">No especificado</span>'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Medicamentos -->
                        ${datos.medicamentos ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-info me-2 mt-1">
                                    <i class="fas fa-pills"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Medicamentos</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.medicamentos}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Habilidades Funcionales -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-success me-2 mt-1">
                                    <i class="fas fa-tasks"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Habilidades Funcionales</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 100px; overflow-y: auto;">
                                        ${datos.habilidades_funcionales || 'No especificadas'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Requiere Asistencia -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon ${datos.requiere_asistencia === 'SI' ? 'text-warning' : 'text-secondary'} me-2 mt-1">
                                    <i class="fas fa-hands-helping"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">¿Requiere Asistencia?</label>
                                    <div class="mt-1">
                                        ${datos.requiere_asistencia === 'Si' ?
            '<span class="badge bg-warning text-dark fs-6">Sí</span>' :
            datos.requiere_asistencia === 'No' ?
                '<span class="badge bg-secondary fs-6">No</span>' :
                '<span class="badge bg-light text-dark fs-6">No especificado</span>'
        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Dispositivo de Asistencia -->
                        ${datos.dispositivo_asistencia ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-crutch"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Dispositivo de Asistencia</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.dispositivo_asistencia}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Observaciones -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-clipboard-list"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Observaciones</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 100px; overflow-y: auto;">
                                        ${datos.observaciones || 'Sin observaciones'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Recomendaciones -->
                        ${datos.recomendaciones ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-info me-2 mt-1">
                                    <i class="fas fa-lightbulb"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Recomendaciones</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 100px; overflow-y: auto;">
                                        ${datos.recomendaciones}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}
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