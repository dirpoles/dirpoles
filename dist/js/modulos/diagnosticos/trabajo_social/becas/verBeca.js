/**
 * Ver detalles de una beca
 * @param {number} id - ID de la beca
 * @param {string} tipo - Tipo de diagnóstico (becas, exoneraciones, fames, embarazadas)
 */
function verBeca(id, tipo) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Detalle de la Beca');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalDiagnostico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la beca...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'listar_detalle_json',
        method: 'GET',
        data: {
            tipo: tipo,
            id_becas: id
        },
        dataType: 'json',
        success: function (data) {

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalDiagnostico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta beca.
                    </div>
                `);
                return;
            }
            const beca = data.data;

            //Formatear datos
            const beneficiario = `${beca.beneficiario}`.trim();
            const empleado = `${beca.empleado}`.trim();
            const cta_bcv = beca.cta_bcv;
            const tipo_banco = beca.tipo_banco;
            const fecha_creacion = moment(beca.fecha_creacion).format('DD/MM/YYYY'); // formatear con moment.js
            const nombre_banco = beca.nombre_banco;

            const modalContent = generarContenidoModalBeca({
                beneficiario,
                empleado,
                fecha_creacion,
                cta_bcv,
                tipo_banco,
                nombre_banco
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
                            <p class="mb-0">No se pudo obtener la información de la beca. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verBeca(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
/**
 * Genera el contenido HTML para el modal de detalles de la beca
 * @param {Object} datos - Objeto con los datos formateados de la beca
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModalBeca(datos) {
    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-graduation-cap me-2"></i> Detalles de la Beca
                        </h6>
                        
                        <!-- Beneficiario -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-graduate"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Beneficiario</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <h5 class="mb-0 text-primary">${datos.beneficiario || 'No especificado'}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empleado -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Registrado por</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <span class="fs-5">${datos.empleado || 'No especificado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fecha de Creación -->
                        <div class="info-item">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Registro</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border">
                                        <span class="fs-5">
                                            <i class="far fa-calendar me-2"></i>
                                            ${datos.fecha_creacion || 'No especificada'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-university me-2"></i> Datos Bancarios
                        </h6>

                        <!-- Cuenta BCV -->
                        <div class="info-item mb-4">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-success me-2 mt-1">
                                    <i class="fas fa-credit-card"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Cuenta BCV</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border bg-success bg-opacity-10">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-wallet text-success me-3 fs-4"></i>
                                            <div>
                                                <h4 class="mb-0 text-success">${datos.cta_bcv || 'No registrada'}</h4>
                                                <small class="text-muted">Número de cuenta</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tipo de Banco -->
                        <div class="info-item">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-info me-2 mt-1">
                                    <i class="fas fa-landmark"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Banco</label>
                                    <div class="form-control-plaintext bg-white rounded p-3 border bg-info bg-opacity-10">
                                        <div class="d-flex align-items-center">
                                            <i class="fas fa-bank text-info me-3 fs-4"></i>
                                            <div>
                                                <h5 class="mb-0 text-info">${datos.nombre_banco || 'No especificado'}</h5>
                                                <small class="text-muted">Código: ${datos.tipo_banco || 'N/A'}</small>
                                            </div>
                                        </div>
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