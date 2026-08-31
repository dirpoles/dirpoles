/**
 * Abre el modal para crear una nueva ficha técnica
 * Carga servicios y empleados vía AJAX y muestra el formulario
 */
function abrirModalCrearFichaTecnica() {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    $('#modalGenericoTitle').text('Crear Ficha Técnica');

    // Mostrar spinner mientras carga
    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando formulario...</p>
        </div>
    `);

    // Ocultar footer previo
    $('#modalGenerico .modal-footer').hide();

    modal.show();

    // Cargar datos del formulario
    $.ajax({
        url: 'ficha_tecnica_form_data',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            const servicios = data.servicios || [];
            const empleados = data.empleados || [];

            let optionsServicios = '<option value="">Seleccione un servicio...</option>';
            servicios.forEach(function (s) {
                optionsServicios += `<option value="${s.id_servicios}">${s.nombre_serv}</option>`;
            });

            let optionsEmpleados = '<option value="">Ninguno</option>';
            empleados.forEach(function (e) {
                optionsEmpleados += `<option value="${e.id_empleado}">${e.nombre_completo}</option>`;
            });

            const hoy = new Date().toISOString().split('T')[0];

            const formHTML = `
                <form id="formCrearFichaTecnicaModal">
                    <div class="card border-0 rounded-0 bg-light">
                        <div class="card-body p-4">
                            <div class="row">
                                <!-- Columna Izquierda -->
                                <div class="col-md-6 border-end">
                                    <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-file-alt me-2"></i> Información de la Ficha
                                    </h6>

                                    <div class="mb-3">
                                        <label for="crear_nombre_ficha" class="form-label text-muted small mb-1">
                                            <i class="fas fa-tag text-primary me-1"></i> Nombre de la Ficha <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control form-control-sm" id="crear_nombre_ficha" name="nombre_ficha"
                                               placeholder="Ej: Ficha de Psicología" maxlength="100">
                                        <div class="text-danger form-text" id="crear_nombre_fichaError" style="display:none;"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="crear_id_servicio" class="form-label text-muted small mb-1">
                                            <i class="fas fa-hospital text-primary me-1"></i> Servicio <span class="text-danger">*</span>
                                        </label>
                                        <select class="form-select form-select-sm" id="crear_id_servicio" name="id_servicio">
                                            ${optionsServicios}
                                        </select>
                                        <div class="text-danger form-text" id="crear_id_servicioError" style="display:none;"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="crear_id_empleado" class="form-label text-muted small mb-1">
                                            <i class="fas fa-user text-primary me-1"></i> Responsable
                                        </label>
                                        <select class="form-select form-select-sm" id="crear_id_empleado" name="id_empleado_responsable">
                                            ${optionsEmpleados}
                                        </select>
                                    </div>
                                </div>

                                <!-- Columna Derecha -->
                                <div class="col-md-6">
                                    <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-clipboard-check me-2"></i> Detalles
                                    </h6>

                                    <div class="mb-3">
                                        <label for="crear_fecha_creacion" class="form-label text-muted small mb-1">
                                            <i class="fas fa-calendar text-primary me-1"></i> Fecha de Creación <span class="text-danger">*</span>
                                        </label>
                                        <input type="date" class="form-control form-control-sm" id="crear_fecha_creacion" name="fecha_creacion" value="${hoy}">
                                        <div class="text-danger form-text" id="crear_fecha_creacionError" style="display:none;"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="crear_descripcion" class="form-label text-muted small mb-1">
                                            <i class="fas fa-align-left text-primary me-1"></i> Descripción
                                        </label>
                                        <textarea class="form-control form-control-sm" id="crear_descripcion" name="descripcion" rows="4"
                                                  placeholder="Descripción de la ficha técnica..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            `;

            const footerHTML = `
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="button" class="btn btn-primary" id="btnGuardarFichaTecnica">
                    <i class="fas fa-save me-1"></i> Registrar Ficha
                </button>
            `;

            $('#modalGenerico .modal-body').html(formHTML);
            $('#modalGenerico .modal-footer').html(footerHTML).show();

            // Inicializar eventos de validación y guardado
            inicializarModalCrearFicha();
        },
        error: function (xhr, status, error) {
            console.error('Error cargando formulario:', error);
            $('#modalGenerico .modal-body').html(`
                <div class="alert alert-danger m-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar el formulario</h5>
                            <p class="mb-0">No se pudieron cargar los datos del formulario.</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="abrirModalCrearFichaTecnica()">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Inicializa las validaciones y el evento de guardado del modal
 */
function inicializarModalCrearFicha() {
    const elements = {
        nombre_ficha: document.getElementById('crear_nombre_ficha'),
        id_servicio: document.getElementById('crear_id_servicio'),
        fecha_creacion: document.getElementById('crear_fecha_creacion'),
        descripcion: document.getElementById('crear_descripcion')
    };

    // ============================================================
    // Funciones auxiliares de validación (patrón del proyecto)
    // ============================================================
    const showError = (field, message) => {
        const errorDiv = document.getElementById(`${field.id}Error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');

        // Manejo para Select2 si aplica
        if ($(field).hasClass('select2-hidden-accessible') || $(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid').removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        const errorDiv = document.getElementById(`${field.id}Error`);
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');

        if ($(field).hasClass('select2-hidden-accessible') || $(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .removeClass('is-invalid').addClass('is-valid');
        }
    };

    // ============================================================
    // Funciones de validación individuales
    // ============================================================
    function validarNombreFicha() {
        const value = elements.nombre_ficha.value.trim();
        if (!value) {
            showError(elements.nombre_ficha, 'El nombre de la ficha es obligatorio');
            return false;
        }
        if (value.length < 3) {
            showError(elements.nombre_ficha, 'El nombre debe tener al menos 3 caracteres');
            return false;
        }
        if (value.length > 100) {
            showError(elements.nombre_ficha, 'El nombre no puede exceder 100 caracteres');
            return false;
        }
        clearError(elements.nombre_ficha);
        return true;
    }

    function validarServicio() {
        if (!elements.id_servicio.value) {
            showError(elements.id_servicio, 'Debe seleccionar un servicio');
            return false;
        }
        clearError(elements.id_servicio);
        return true;
    }

    function validarFechaCreacion() {
        if (!elements.fecha_creacion.value) {
            showError(elements.fecha_creacion, 'La fecha de creación es obligatoria');
            return false;
        }
        clearError(elements.fecha_creacion);
        return true;
    }

    // ============================================================
    // Event listeners para validación en tiempo real
    // ============================================================
    $(elements.nombre_ficha).on('input', validarNombreFicha);
    $(elements.id_servicio).on('change', validarServicio);
    $(elements.fecha_creacion).on('change', validarFechaCreacion);

    // ============================================================
    // Evento de guardado
    // ============================================================
    $(document).off('click', '#btnGuardarFichaTecnica').on('click', '#btnGuardarFichaTecnica', function () {
        // Validar todos los campos
        const v1 = validarNombreFicha();
        const v2 = validarServicio();
        const v3 = validarFechaCreacion();

        if (!v1 || !v2 || !v3) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos obligatorios.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Confirmar
        Swal.fire({
            title: '¿Registrar ficha técnica?',
            text: '¿Está seguro de que desea registrar esta ficha técnica?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                enviarFichaTecnica();
            }
        });
    });
}

/**
 * Envía el formulario de ficha técnica vía AJAX
 */
function enviarFichaTecnica() {
    const btnGuardar = $('#btnGuardarFichaTecnica');
    btnGuardar.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i> Guardando...');

    const form = document.getElementById('formCrearFichaTecnicaModal');
    const formData = new FormData(form);

    $.ajax({
        url: 'ficha_registrar',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (response) {
            if (response.exito) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registrada',
                    text: response.mensaje || 'Ficha técnica registrada exitosamente',
                    timer: 1500,
                    showConfirmButton: false,
                    timerProgressBar: true
                }).then(() => {
                    $('#modalGenerico').modal('hide');
                    // Recargar DataTable de fichas
                    if ($.fn.DataTable.isDataTable('#tabla_fichas')) {
                        $('#tabla_fichas').DataTable().ajax.reload(null, false);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.mensaje || 'Error al registrar la ficha técnica',
                    confirmButtonText: 'Entendido'
                });
                btnGuardar.prop('disabled', false).html('<i class="fas fa-save me-1"></i> Registrar Ficha');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al registrar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al registrar la ficha técnica',
                confirmButtonText: 'Entendido'
            });
            btnGuardar.prop('disabled', false).html('<i class="fas fa-save me-1"></i> Registrar Ficha');
        }
    });
}
