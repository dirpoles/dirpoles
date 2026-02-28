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
        url: 'diagnostico_medicina_detalle',
        method: 'GET',
        data: { id_consulta_med: id },
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
            const medicina = data.data;

            //Formatear datos
            const beneficiario = `${medicina.beneficiario}`.trim();
            const empleado = `${medicina.empleado}`.trim();
            const motivo_visita = medicina.motivo_visita;
            const diagnostico = medicina.diagnostico;
            const tratamiento = medicina.tratamiento;
            const observaciones = medicina.observaciones;
            const estatura = medicina.estatura;
            const peso = medicina.peso;
            const tipo_sangre = medicina.tipo_sangre;
            const fecha_creacion = medicina.fecha_creacion;
            const insumos_usados = medicina.insumos_usados;

            const modalContent = generarContenidoModalMedicina({
                beneficiario,
                empleado,
                tipo_sangre,
                diagnostico,
                tratamiento,
                motivo_visita,
                peso,
                estatura,
                observaciones,
                insumos_usados,
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
                        <button class="btn btn-outline-danger" onclick="verCita(${id})">
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
function generarContenidoModalMedicina(datos) {
    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Información General del Diagnóstico -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-file-medical me-2"></i> Información General
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

                        <!-- Médico -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-md"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Médico</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.empleado || 'No asignado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Motivo de Visita -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-clipboard-list"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Motivo de Visita</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.motivo_visita || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

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
                            <i class="fas fa-notes-medical me-2"></i> Detalles Médicos
                        </h6>

                        <!-- Datos Antropométricos -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-ruler-combined"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Datos Corporales</label>
                                    <div class="row g-2">
                                        <div class="col-4">
                                            <div class="bg-white rounded p-2 text-center border">
                                                <small class="d-block text-muted">Peso</small>
                                                <strong>${datos.peso || '-'} kg</strong>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="bg-white rounded p-2 text-center border">
                                                <small class="d-block text-muted">Estatura</small>
                                                <strong>${datos.estatura || '-'} m</strong>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="bg-white rounded p-2 text-center border">
                                                <small class="d-block text-muted">Sangre</small>
                                                <strong>${datos.tipo_sangre || '-'}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Diagnóstico -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-stethoscope"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Diagnóstico</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 100px; overflow-y: auto;">
                                        ${datos.diagnostico || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tratamiento -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-pills"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Tratamiento</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 100px; overflow-y: auto;">
                                        ${datos.tratamiento || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Insumos Utilizados -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-box-open"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Insumos Utilizados</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 100px; overflow-y: auto;">
                                        ${datos.insumos_usados || 'No se utilizaron insumos'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Observaciones -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-comment-medical"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Observaciones</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 100px; overflow-y: auto;">
                                        ${datos.observaciones || 'Sin observaciones'}
                                    </div>
                                </div>
                            </div>
                        </div>
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