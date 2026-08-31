/**
 * Función para editar un mobiliario
 * @param {number} id - ID del mobiliario
 */
function editarMobiliario(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    $('#modalGenericoTitle').text('Editar Mobiliario');

    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del mobiliario...</p>
        </div>
    `);

    modal.show();

    $.ajax({
        url: 'mobiliario_detalle_editar',
        method: 'GET',
        data: { id_mobiliario: id },
        dataType: 'json',
        success: function (data) {
            if (!data || !data.mobiliario) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este mobiliario.
                    </div>
                `);
                return;
            }
            const m = data.mobiliario;
            const tipos = data.tipos_mobiliario || [];
            const servicios = data.servicios || [];

            let optionsTipos = '<option value="" disabled>Seleccione un tipo</option>';
            tipos.forEach(function(t) {
                const selected = t.id_tipo_mobiliario == m.id_tipo_mobiliario ? 'selected' : '';
                optionsTipos += `<option value="${t.id_tipo_mobiliario}" ${selected}>${t.nombre}</option>`;
            });

            let optionsServicios = '<option value="" disabled>Seleccione un servicio</option>';
            servicios.forEach(function(s) {
                const selected = s.id_servicios == m.id_servicios ? 'selected' : '';
                optionsServicios += `<option value="${s.id_servicios}" ${selected}>${s.nombre_serv}</option>`;
            });

            const modalContent = `
                <form id="formEditarMobiliario">
                    <div class="card border-0 rounded-0 bg-light">
                        <div class="card-body p-4">
                            <div class="row">
                                <!-- Columna Izquierda -->
                                <div class="col-md-6 border-end">
                                    <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-chair me-2"></i> Información del Mobiliario
                                    </h6>

                                    <div class="mb-3">
                                        <label for="editar_tipo_mobiliario" class="form-label text-muted small mb-1">
                                            <i class="fas fa-tag text-primary me-1"></i> Tipo de Mobiliario <span class="text-danger">*</span>
                                        </label>
                                        <select class="form-select form-select-sm" id="editar_tipo_mobiliario" name="id_tipo_mobiliario" required>
                                            ${optionsTipos}
                                        </select>
                                        <div class="text-danger form-text" id="editar_tipo_mobiliarioError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_marca" class="form-label text-muted small mb-1">
                                            <i class="fas fa-industry text-primary me-1"></i> Marca <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control form-control-sm" id="editar_marca" name="marca" value="${m.marca || ''}" required>
                                        <div class="text-danger form-text" id="editar_marcaError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_modelo" class="form-label text-muted small mb-1">
                                            <i class="fas fa-box text-primary me-1"></i> Modelo <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control form-control-sm" id="editar_modelo" name="modelo" value="${m.modelo || ''}" required>
                                        <div class="text-danger form-text" id="editar_modeloError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_color" class="form-label text-muted small mb-1">
                                            <i class="fas fa-palette text-primary me-1"></i> Color
                                        </label>
                                        <input type="text" class="form-control form-control-sm" id="editar_color" name="color" value="${m.color || ''}">
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_fecha_adquisicion" class="form-label text-muted small mb-1">
                                            <i class="fas fa-calendar text-primary me-1"></i> Fecha de Adquisición <span class="text-danger">*</span>
                                        </label>
                                        <input type="date" class="form-control form-control-sm" id="editar_fecha_adquisicion" name="fecha_adquisicion" value="${m.fecha_adquisicion || ''}" required>
                                        <div class="text-danger form-text" id="editar_fecha_adquisicionError"></div>
                                    </div>
                                </div>

                                <!-- Columna Derecha -->
                                <div class="col-md-6">
                                    <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-clipboard-check me-2"></i> Detalles de Inventario
                                    </h6>

                                    <div class="mb-3">
                                        <label for="editar_servicio" class="form-label text-muted small mb-1">
                                            <i class="fas fa-map-marker-alt text-primary me-1"></i> Servicio / Ubicación <span class="text-danger">*</span>
                                        </label>
                                        <select class="form-select form-select-sm" id="editar_servicio" name="id_servicios" required>
                                            ${optionsServicios}
                                        </select>
                                        <div class="text-danger form-text" id="editar_servicioError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_estado" class="form-label text-muted small mb-1">
                                            <i class="fas fa-cog text-primary me-1"></i> Estado <span class="text-danger">*</span>
                                        </label>
                                        <select class="form-select form-select-sm" id="editar_estado" name="estado" required>
                                            <option value="" disabled>Seleccione un estado</option>
                                            <option value="Nuevo" ${m.estado === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
                                            <option value="Bueno" ${m.estado === 'Bueno' ? 'selected' : ''}>Bueno</option>
                                            <option value="Regular" ${m.estado === 'Regular' ? 'selected' : ''}>Regular</option>
                                            <option value="Malo" ${m.estado === 'Malo' ? 'selected' : ''}>Malo</option>
                                            <option value="En reparación" ${m.estado === 'En reparación' ? 'selected' : ''}>En reparación</option>
                                        </select>
                                        <div class="text-danger form-text" id="editar_estadoError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_cantidad" class="form-label text-muted small mb-1">
                                            <i class="fas fa-sort-numeric-up text-primary me-1"></i> Cantidad <span class="text-danger">*</span>
                                        </label>
                                        <input type="number" class="form-control form-control-sm" id="editar_cantidad" name="cantidad" value="${m.cantidad || 1}" min="1" required>
                                        <div class="text-danger form-text" id="editar_cantidadError"></div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_descripcion" class="form-label text-muted small mb-1">
                                            <i class="fas fa-align-left text-primary me-1"></i> Descripción Adicional
                                        </label>
                                        <textarea class="form-control form-control-sm" id="editar_descripcion" name="descripcion" rows="3">${m.descripcion_adicional || ''}</textarea>
                                    </div>

                                    <div class="mb-3">
                                        <label for="editar_observaciones" class="form-label text-muted small mb-1">
                                            <i class="fas fa-sticky-note text-primary me-1"></i> Observaciones
                                        </label>
                                        <textarea class="form-control form-control-sm" id="editar_observaciones" name="observaciones" rows="2">${m.observaciones || ''}</textarea>
                                    </div>
                                </div>
                            </div>

                            <input type="hidden" name="id_mobiliario" id="id_mobiliario" value="${m.id_mobiliario || id}">
                        </div>
                    </div>

                    <div class="modal-footer border-top-0 bg-light py-3">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary" id="btnGuardarCambiosMobiliario">
                            <i class="fas fa-save me-1"></i> Guardar Cambios
                        </button>
                    </div>
                </form>
            `;

            $('#modalGenerico .modal-body').html(modalContent);

            // Inicializar validación
            inicializarValidarEditarMobiliario(id);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);
            $('#modalGenerico .modal-body').html(`
                <div class="alert alert-danger m-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del mobiliario.</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarMobiliario(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}

/**
 * Inicializa la validación y envío del formulario de edición de mobiliario
 */
function inicializarValidarEditarMobiliario(id) {
    const form = document.getElementById('formEditarMobiliario');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Limpiar errores previos
        $(form).find('.text-danger.form-text').text('');

        // Obtener datos del formulario
        const formData = new FormData(form);

        // Validaciones básicas
        let errores = [];

        if (!formData.get('id_tipo_mobiliario')) {
            $('#editar_tipo_mobiliarioError').text('Debe seleccionar un tipo de mobiliario');
            errores.push('tipo');
        }
        if (!formData.get('marca') || formData.get('marca').trim() === '') {
            $('#editar_marcaError').text('La marca es obligatoria');
            errores.push('marca');
        }
        if (!formData.get('modelo') || formData.get('modelo').trim() === '') {
            $('#editar_modeloError').text('El modelo es obligatorio');
            errores.push('modelo');
        }
        if (!formData.get('id_servicios')) {
            $('#editar_servicioError').text('Debe seleccionar un servicio');
            errores.push('servicio');
        }
        if (!formData.get('estado')) {
            $('#editar_estadoError').text('Debe seleccionar un estado');
            errores.push('estado');
        }
        if (!formData.get('cantidad') || parseInt(formData.get('cantidad')) < 1) {
            $('#editar_cantidadError').text('La cantidad debe ser al menos 1');
            errores.push('cantidad');
        }
        if (!formData.get('fecha_adquisicion')) {
            $('#editar_fecha_adquisicionError').text('La fecha de adquisición es obligatoria');
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
        const btnGuardar = $('#btnGuardarCambiosMobiliario');
        btnGuardar.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i> Guardando...');

        // Enviar petición
        $.ajax({
            url: 'mobiliario_actualizar',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(response) {
                if (response.exito) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualizado',
                        text: response.mensaje || 'Mobiliario actualizado exitosamente',
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true
                    }).then(() => {
                        $('#modalGenerico').modal('hide');
                        // Recargar DataTable
                        if ($.fn.DataTable.isDataTable('#tabla_mobiliario')) {
                            $('#tabla_mobiliario').DataTable().ajax.reload(null, false);
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.mensaje || 'Error al actualizar el mobiliario',
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
                    text: 'Ocurrió un error al actualizar el mobiliario',
                    confirmButtonText: 'Entendido'
                });
                btnGuardar.prop('disabled', false).html('<i class="fas fa-save me-1"></i> Guardar Cambios');
            }
        });
    });
}
