/**
 * Editar una beca existente
 * @param {number} id - ID de la beca
 * @param {string} tipo - Tipo de beca
 */
function editarBeca(id, tipo) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalDiagnostico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalDiagnosticoTitle').text('Editar Beca');

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
            id_becas: id,
            tipo: tipo
        },
        dataType: 'json',
        success: function (data) {
            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalGlobal .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para editar esta beca.
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
            const fecha_creacion = beca.fecha_creacion;
            const id_beneficiario = beca.id_beneficiario;
            const id_becas = beca.id_becas;

            const modalContent = generarContenidoModalEditar({
                id_becas,
                beneficiario,
                empleado,
                cta_bcv,
                tipo_banco,
                fecha_creacion,
                id_beneficiario,
            });

            //Mostrar modal
            $('#modalDiagnostico .modal-body').html(modalContent);

            // Inicializar validaciones
            initTooltipsModalEditarBeca();
            validarEditarBeca(id);
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
 * Genera el formulario HTML para editar una cita
 * @param {Object} datos - Objeto con los datos de la cita
 * @returns {string} HTML del formulario
 */
function generarContenidoModalEditar(datos) {
    return `
        <form id="formEditarBeca" data-id="${datos.id_becas}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General (Solo lectura) -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-info-circle me-2"></i> Información General
                            </h6>
                            <input type="hidden" name="id_becas" value="${datos.id_becas}">
                            <input type="hidden" name="id_beneficiario" value="${datos.id_beneficiario}">
                            
                            <!-- Beneficiario (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-user text-primary me-1"></i> Beneficiario
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
                                    ${moment(datos.fecha_creacion).format('DD/MM/YYYY') || 'No especificada'}
                                </div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Este campo no puede ser modificado</small>
                            </div>
                        </div>

                        <!-- Columna Derecha - Datos Editables -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-edit me-2"></i> Datos Bancarios
                            </h6>

                            <!-- Tipo de Banco (Editable) -->
                           <div class="mb-4 position-relative">
                                <label for="tipo_banco" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-landmark me-1"></i> Tipo de Banco <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-university text-muted"></i>
                                    </span>
                                    <select class="form-select border-start-0 ps-0 form-control-lg fs-6 select2" 
                                            name="tipo_banco" 
                                            id="tipo_banco" 
                                            >
                                        <option value="" disabled>Seleccione tipo de banco</option>
                                        <option value="0102" ${datos.tipo_banco === '0102' ? 'selected' : ''}>BANCO DE VENEZUELA</option>
                                        <option value="0156" ${datos.tipo_banco === '0156' ? 'selected' : ''}>100% BANCO</option>
                                        <option value="0172" ${datos.tipo_banco === '0172' ? 'selected' : ''}>BANCAMIGA BANCO MICROFINANCIERO C.A</option>
                                        <option value="0114" ${datos.tipo_banco === '0114' ? 'selected' : ''}>BANCARIBE</option>
                                        <option value="0171" ${datos.tipo_banco === '0171' ? 'selected' : ''}>BANCO ACTIVO</option>
                                        <option value="0166" ${datos.tipo_banco === '0166' ? 'selected' : ''}>BANCO AGRICOLA DE VENEZUELA</option>
                                        <option value="0175" ${datos.tipo_banco === '0175' ? 'selected' : ''}>BANCO DIGITAL DE LOS TRABAJADORES</option>
                                        <option value="0128" ${datos.tipo_banco === '0128' ? 'selected' : ''}>BANCO CARONI</option>
                                        <option value="0163" ${datos.tipo_banco === '0163' ? 'selected' : ''}>BANCO DEL TESORO</option>
                                        <option value="0115" ${datos.tipo_banco === '0115' ? 'selected' : ''}>BANCO EXTERIOR</option>
                                        <option value="0151" ${datos.tipo_banco === '0151' ? 'selected' : ''}>BANCO FONDO COMUN</option>
                                        <option value="0173" ${datos.tipo_banco === '0173' ? 'selected' : ''}>BANCO INTERNACIONAL DE DESARROLLO</option>
                                        <option value="0105" ${datos.tipo_banco === '0105' ? 'selected' : ''}>BANCO MERCANTIL</option>
                                        <option value="0191" ${datos.tipo_banco === '0191' ? 'selected' : ''}>BANCO NACIONAL DE CREDITO</option>
                                        <option value="0138" ${datos.tipo_banco === '0138' ? 'selected' : ''}>BANCO PLAZA</option>
                                        <option value="0137" ${datos.tipo_banco === '0137' ? 'selected' : ''}>BANCO SOFITASA</option>
                                        <option value="0104" ${datos.tipo_banco === '0104' ? 'selected' : ''}>BANCO VENEZOLANO DE CREDITO</option>
                                        <option value="0168" ${datos.tipo_banco === '0168' ? 'selected' : ''}>BANCRECER</option>
                                        <option value="0134" ${datos.tipo_banco === '0134' ? 'selected' : ''}>BANESCO</option>
                                        <option value="0177" ${datos.tipo_banco === '0177' ? 'selected' : ''}>BANFANB</option>
                                        <option value="0146" ${datos.tipo_banco === '0146' ? 'selected' : ''}>BANGENTE</option>
                                        <option value="0174" ${datos.tipo_banco === '0174' ? 'selected' : ''}>BANPLUS</option>
                                        <option value="0108" ${datos.tipo_banco === '0108' ? 'selected' : ''}>BBVA PROVINCIAL</option>
                                        <option value="0157" ${datos.tipo_banco === '0157' ? 'selected' : ''}>DELSUR BANCO UNIVERSAL</option>
                                        <option value="0169" ${datos.tipo_banco === '0169' ? 'selected' : ''}>MI BANCO</option>
                                        <option value="0178" ${datos.tipo_banco === '0178' ? 'selected' : ''}>N58 BANCO DIGITAL BANCO MICROFINANCIERO S.A</option>
                                    </select>
                                </div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Nombre del banco</small>
                                <div id="tipo_bancoError" class="form-text text-danger position-absolute top-100 start-0"></div>
                            </div>

                            <!-- Cuenta BCV (Editable) -->
                            <div class="mb-4 position-relative">
                                <label for="cta_bcv" class="form-label fw-semibold text-secondary">
                                    <i class="fas fa-credit-card me-1"></i> Cuenta BCV (20 dígitos) <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="fas fa-hashtag text-muted"></i>
                                    </span>
                                    <input type="text" 
                                           class="form-control border-start-0 ps-0 form-control-lg fs-6" 
                                           id="cta_bcv" 
                                           name="cta_bcv" 
                                           placeholder="Ingrese los 16 dígitos" 
                                           maxlength="16" 
                                           value="${datos.cta_bcv || ''}"
                                           >
                                </div>
                                <div id="cta_bcvError" class="form-text text-danger position-absolute top-100 start-0"></div>
                                <small class="text-muted d-block mt-1"><i class="fas fa-info-circle me-1"></i>Número de cuenta</small>
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
                <button type="submit" class="btn btn-primary" id="btnGuardarBeca">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>
    `;
}

/**
 * Inicializa los tooltips en el modal de editar beca
 */
function initTooltipsModalEditarBeca() {
    const tooltips = document.querySelectorAll('#modalDiagnostico [data-bs-toggle="tooltip"]');
    tooltips.forEach(el => {
        new bootstrap.Tooltip(el, {
            trigger: 'hover'
        });
    });
}