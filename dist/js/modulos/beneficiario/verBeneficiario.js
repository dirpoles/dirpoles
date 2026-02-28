// dist/js/modulos/beneficiario/verBeneficiario.js

/**
 * Función para mostrar los detalles de un beneficiario en un modal
 * @param {number} id - ID del beneficiario
 */
function verBeneficiario(id) {
    // ✅ 1. Mostrar modal INMEDIATAMENTE con spinner
    const modalElement = document.getElementById('modalGlobal');
    const modal = new bootstrap.Modal(modalElement);

    // Configurar título del modal
    $('#modalGlobalTitle').text('Detalle del Beneficiario');

    // Limpiar y mostrar spinner en el body del modal
    $('#modalGlobal .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del beneficiario...</p>
        </div>
    `);

    // Mostrar modal
    modal.show();

    // ✅ 2. Hacer AJAX para obtener datos del beneficiario
    $.ajax({
        url: 'beneficiario_detalle',
        method: 'GET',
        data: { id_beneficiario: id },
        dataType: 'json',
        success: function (data) {
            console.log('Datos recibidos para beneficiario:', data);

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalGlobal .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este beneficiario.
                    </div>
                `);
                return;
            }

            const beneficiario = data.data;

            // ✅ 3. Formatear datos
            const nombreCompleto = `${beneficiario.nombres || ''} ${beneficiario.apellidos || ''}`.trim();
            const cedulaCompleta = beneficiario.tipo_cedula && beneficiario.cedula
                ? `${beneficiario.tipo_cedula}-${beneficiario.cedula}`
                : beneficiario.cedula || 'No especificado';

            const telefonoCompleto = beneficiario.telefono || 'No especificado';
            const correo = beneficiario.correo || 'No especificado';
            const direccion = beneficiario.direccion || 'No especificado';
            const fechaNac = beneficiario.fecha_nac || 'No especificado';
            const genero = beneficiario.genero;
            const pnf = beneficiario.nombre_pnf || beneficiario.pnf || 'No especificado';
            const seccion = beneficiario.seccion || 'No especificado';
            const estatus = beneficiario.estatus || 1;

            // ✅ 4. Generar HTML del modal
            const modalContent = generarContenidoModalBeneficiario({
                nombreCompleto,
                cedulaCompleta,
                telefonoCompleto,
                correo,
                direccion,
                fechaNac,
                genero,
                pnf,
                seccion,
                estatus,
                fechaRegistro: beneficiario.fecha_registro
            });

            // ✅ 5. Insertar el nuevo contenido
            $('#modalGlobal .modal-body').html(modalContent);

        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            // ✅ 6. Mostrar error en el modal
            $('#modalGlobal .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del beneficiario. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verBeneficiario(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Genera el contenido HTML para el modal de detalles del beneficiario
 * @param {Object} datos - Objeto con los datos formateados del beneficiario
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModalBeneficiario(datos) {
    return `
        <!-- Tarjeta de Información Principal -->
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Datos Personales -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-user-circle me-2"></i> Información Personal
                        </h6>
                        
                        <!-- Nombre Completo -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Nombre Completo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.nombreCompleto}
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
                                    <label class="form-label text-muted small mb-1">Cédula de Identidad</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.cedulaCompleta}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Correo -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Correo Electrónico</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.correo}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Teléfono -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-phone"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Teléfono</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.telefonoCompleto}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fecha de Nacimiento -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-birthday-cake"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Nacimiento</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.fechaNac}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha - Datos Académicos -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-graduation-cap me-2"></i> Información Académica
                        </h6>

                        <!-- PNF -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-university"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Programa Nacional de Formación (PNF)</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.pnf}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sección -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Sección</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.seccion}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Género -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-venus-mars"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Género</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.genero}
                                    </div>
                                </div>
                            </div>
                        </div>


                        <!-- Estatus -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Estado del Beneficiario</label>
                                    <div class="mt-1">
                                        ${generarBadgeEstatus(datos.estatus)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fecha de Registro -->
                        ${datos.fechaRegistro ? `
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Registro</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.fechaRegistro}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                    </div>
                    <!-- Dirección -->
                    <div class="info-item mb-3">
                        <div class="d-flex align-items-start">
                            <div class="info-icon text-primary me-2 mt-1">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="flex-grow-1">
                                <label class="form-label text-muted small mb-1">Dirección</label>
                                <div class="form-control-plaintext bg-white rounded p-2">
                                    ${datos.direccion}
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

/**
 * Genera el badge de estatus
 * @param {number} estatus - Estatus del beneficiario (1=Activo, 0=Inactivo)
 * @returns {string} HTML del badge
 */
function generarBadgeEstatus(estatus) {
    if (estatus == 1) {
        return `
            <div class="d-inline-flex align-items-center bg-success rounded-pill px-3 py-1">
                <i class="fas fa-circle me-2" style="font-size: 0.6rem; color: white"></i>
                <span class="fw-semibold" style="color: white">Activo</span>
            </div>
        `;
    } else {
        return `
            <div class="d-inline-flex align-items-center bg-danger rounded-pill px-3 py-1">
                <i class="fas fa-circle me-2" style="font-size: 0.6rem; color: white"></i>
                <span class="fw-semibold" style="color: white">Inactivo</span>
            </div>
        `;
    }
}