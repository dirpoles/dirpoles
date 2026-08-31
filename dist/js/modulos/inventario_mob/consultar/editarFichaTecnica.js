/**
 * Función para editar una ficha técnica
 * @param {number} id - ID de la ficha técnica
 */
function editarFichaTecnica(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    $('#modalGenericoTitle').text('Editar Ficha Técnica');

    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la ficha técnica...</p>
        </div>
    `);

    modal.show();

    $.ajax({
        url: 'ficha_detalle_editar',
        method: 'GET',
        data: { id_ficha: id },
        dataType: 'json',
        success: function (data) {
            if (!data || !data.ficha) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta ficha técnica.
                    </div>
                `);
                return;
            }
            const f = data.ficha;
            const servicios = data.servicios || [];
            const empleados = data.empleados || [];

            let optionsServicios = '<option value="" disabled>Seleccione un servicio</option>';
            servicios.forEach(function(s) {
                const selected = s.id_servicios == f.id_servicio ? 'selected' : '';
                optionsServicios += `<option value="${s.id_servicios}" ${selected}>${s.nombre_serv}</option>`;
            });

            let optionsEmpleados = '<option value="">Ninguno</option>';
            empleados.forEach(function(e) {
                const selected = e.id_empleado == f.id_empleado_responsable ? 'selected' : '';
                optionsEmpleados += `<option value="${e.id_empleado}" ${selected}>${e.nombre_completo}</option>`;
            });

            const modalContent = `
                <form id="formEditarFichaTecnica">
                    <div class="card border-0 rounded-0 bg-light">
                        <div class="card-body p-4">
                            <div class="row">
                                <!-- Columna Izquierda -->
                                <div class="col-md-6 border-end">
                                    <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-file-alt me-2"></i> Información de la Ficha
                                    </h6>

                                    <div class="mb-3">
                                        <label for="editar_nombre_ficha" class="form-label text-muted small mb-1">
                                            <i class="fas fa-tag text-primary me-1"></i> Nombre de la Ficha <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control form-control-sm" id="editar_nombre_ficha" name="nombre_ficha" value="${f.nombre_ficha || ''}" required maxlength="100">
                                        <div class="text-danger form-text" id="editar_nombre_fichaError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_servicio" class="form-label text-muted small mb-1">
                                            <i class="fas fa-hospital text-primary me-1"></i> Servicio <span class="text-danger">*</span>
                                        </label>
                                        <select class="form-select form-select-sm" id="editar_servicio" name="id_servicio" required>
                                            ${optionsServicios}
                                        </select>
                                        <div class="text-danger form-text" id="editar_servicioError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_empleado_responsable" class="form-label text-muted small mb-1">
                                            <i class="fas fa-user text-primary me-1"></i> Responsable
                                        </label>
                                        <select class="form-select form-select-sm" id="editar_empleado_responsable" name="id_empleado_responsable">
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
                                        <label for="editar_fecha_creacion" class="form-label text-muted small mb-1">
                                            <i class="fas fa-calendar text-primary me-1"></i> Fecha de Creación <span class="text-danger">*</span>
                                        </label>
                                        <input type="date" class="form-control form-control-sm" id="editar_fecha_creacion" name="fecha_creacion" value="${f.fecha_creacion || ''}" required>
                                        <div class="text-danger form-text" id="editar_fecha_creacionError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_estatus" class="form-label text-muted small mb-1">
                                            <i class="fas fa-toggle-on text-primary me-1"></i> Estatus
                                        </label>
                                        <select class="form-select form-select-sm" id="editar_estatus" name="estatus">
                                            <option value="1" ${f.estatus == 1 ? 'selected' : ''}>Activo</option>
                                            <option value="0" ${f.estatus == 0 ? 'selected' : ''}>Inactivo</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_descripcion" class="form-label text-muted small mb-1">
                                            <i class="fas fa-align-left text-primary me-1"></i> Descripción
                                        </label>
                                        <textarea class="form-control form-control-sm" id="editar_descripcion" name="descripcion" rows="4">${f.descripcion || ''}</textarea>
                                    </div>
                                </div>
                            </div>

                            <input type="hidden" name="id_ficha" id="id_ficha" value="${f.id_ficha || id}">
                        </div>
                    </div>

                    <div class="modal-footer border-top-0 bg-light py-3">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary" id="btnGuardarCambiosFicha">
                            <i class="fas fa-save me-1"></i> Guardar Cambios
                        </button>
                    </div>
                </form>
            `;

            $('#modalGenerico .modal-body').html(modalContent);

            // Inicializar validación
            inicializarValidarEditarFicha(id);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);
            $('#modalGenerico .modal-body').html(`
                <div class="alert alert-danger m-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información de la ficha técnica.</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarFichaTecnica(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Inicializa la validación y envío del formulario de edición de ficha técnica
 */
function inicializarValidarEditarFicha(id) {
    const form = document.getElementById('formEditarFichaTecnica');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Limpiar errores previos
        $(form).find('.text-danger.form-text').text('');

        // Obtener datos del formulario
        const formData = new FormData(form);

        // Validaciones básicas
        let errores = [];

        if (!formData.get('nombre_ficha') || formData.get('nombre_ficha').trim() === '') {
            $('#editar_nombre_fichaError').text('El nombre de la ficha es obligatorio');
            errores.push('nombre');
        }
        if (!formData.get('id_servicio')) {
            $('#editar_servicioError').text('Debe seleccionar un servicio');
            errores.push('servicio');
        }
        if (!formData.get('fecha_creacion')) {
            $('#editar_fecha_creacionError').text('La fecha de creación es obligatoria');
            errores.push('fecha');
        }

        if (errores.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos obligatorios.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Deshabilitar botón de guardar
        const btnGuardar = $('#btnGuardarCambiosFicha');
        btnGuardar.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i> Guardando...');

        // Enviar petición
        $.ajax({
            url: 'ficha_actualizar',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(response) {
                if (response.exito) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualizada',
                        text: response.mensaje || 'Ficha técnica actualizada exitosamente',
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true
                    }).then(() => {
                        $('#modalGenerico').modal('hide');
                        // Recargar DataTable
                        if ($.fn.DataTable.isDataTable('#tabla_fichas')) {
                            $('#tabla_fichas').DataTable().ajax.reload(null, false);
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.mensaje || 'Error al actualizar la ficha técnica',
                        confirmButtonText: 'Entendido'
                    });
                    btnGuardar.prop('disabled', false).html('<i class="fas fa-save me-1"></i> Guardar Cambios');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al actualizar:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar la ficha técnica',
                    confirmButtonText: 'Entendido'
                });
                btnGuardar.prop('disabled', false).html('<i class="fas fa-save me-1"></i> Guardar Cambios');
            }
        });
    });
}
