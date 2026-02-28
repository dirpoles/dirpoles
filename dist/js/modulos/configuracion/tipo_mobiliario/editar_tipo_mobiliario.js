$(function () {
    // 1. Delegación de evento para abrir el modal
    $(document).on('click', '.btn-editar[data-tipo="tipo_mobiliario"]', async function () {
        const id = $(this).data('id');
        const modal = $('#modalConfig');

        // 1. Configurar Header del Modal
        $('#modalConfigTitle').text('Editar Tipo de Mobiliario');
        $('#modalConfigSubtitle').text('Modifica los datos del Tipo de Mobiliario seleccionado');

        // 2. Inyectar HTML del Formulario
        const formHTML = `
            <form id="form-editar-tipo_mobiliario" method="POST" action="actualizar_tipo_mobiliario" class="needs-validation p-4" novalidate>
                <input type="hidden" name="id_tipo_mobiliario" id="id_tipo_mobiliario" value="${id}">
                <input type="hidden" name="tipo" value="tipo_mobiliario">
                
                <div class="row g-4">
                    <div class="col-md-12">
                        <label for="edit_nombre_tipo_mobiliario" class="form-label">Nombre del Tipo de Mobiliario</label>
                        <div class="input-group">
                            <span class="input-group-text">Tipo de Mobiliario</span>
                            <input type="text" class="form-control" id="edit_nombre_tipo_mobiliario" name="nombre" placeholder="Tipo de mobiliario" required>
                            <div class="invalid-feedback" id="edit_nombre_tipo_mobiliarioError"></div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <label for="edit_descripcion_tipo_mobiliario" class="form-label">Descripción del Tipo de Mobiliario</label>
                        <div class="input-group">
                            <span class="input-group-text">Descripción</span>
                            <input type="text" class="form-control" id="edit_descripcion_tipo_mobiliario" name="descripcion" placeholder="Descripción del tipo de mobiliario" required>
                            <div class="invalid-feedback" id="edit_descripcion_tipo_mobiliarioError"></div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div class="form-floating">
                            <select class="form-select" id="edit_estatus" name="estatus" required>
                                <option value="" selected disabled>Seleccione...</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                            <label for="edit_estatus">Estatus del Tipo de Mobiliario</label>
                            <div class="invalid-feedback" id="edit_estatusError"></div>
                        </div>
                    </div>
                    
                    <div class="col-md-12">
                        <div class="d-flex justify-content-end gap-2 mt-4">
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-2"></i>Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        `;

        modal.find('.modal-body').html(formHTML);

        // 3. Obtener Datos y Rellenar (AJAX)
        try {
            const response = await fetch(`obtener_detalle_json?id=${id}&tipo=tipo_mobiliario`); // GET request
            if (!response.ok) throw new Error('Error al obtener datos');

            const result = await response.json();

            if (result.exito) {
                const data = result.data;
                // Rellenar campos
                $('#edit_nombre_tipo_mobiliario').val(data.nombre);
                $('#edit_descripcion_tipo_mobiliario').val(data.descripcion);
                $('#edit_estatus').val(data.estatus);

                // Mostrar Modal solo cuando todo esté listo
                modal.modal('show');

                // 4. Inicializar Validaciones
                initValidationEditarTipoMobiliario();

            } else {
                Swal.fire('Error', result.mensaje || 'No se pudieron cargar los datos', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    });

    // 2. Lógica de Validación (Encapsulada)
    function initValidationEditarTipoMobiliario() {
        const form = document.getElementById('form-editar-tipo_mobiliario');
        const elements = {
            id_tipo_mobiliario: document.getElementById('id_tipo_mobiliario'), // Necesario para excluirse a sí mismo
            nombre_mobiliario: document.getElementById('edit_nombre_tipo_mobiliario'),
            descripcion_mobiliario: document.getElementById('edit_descripcion_tipo_mobiliario'),
            estatus: document.getElementById('edit_estatus'),
        };

        const showError = (field, msg) => {
            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = msg;
                errorElement.style.display = 'block';
            }
            field.classList.add("is-invalid");
            field.classList.remove("is-valid");
        };

        const clearError = (field) => {
            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = "";
                errorElement.style.display = 'none';
            }
            field.classList.remove("is-invalid");
            field.classList.add("is-valid");
        };

        async function validarEstatus() {
            const estatus = elements.estatus.value;
            if (estatus === "" || estatus === null) {
                showError(elements.estatus, "El estatus es obligatorio");
                return false;
            }
            clearError(elements.estatus);
            return true;
        }

        function validarTipoMobiliario() {
            const nombre_mobiliario = elements.nombre_mobiliario.value.trim();

            if (nombre_mobiliario === "") {
                showError(elements.nombre_mobiliario, "El tipo de mobiliario es obligatorio");
                return false;
            }

            if (nombre_mobiliario.length < 3 || nombre_mobiliario.length > 50) {
                showError(elements.nombre_mobiliario, "El tipo de mobiliario debe tener entre 3 y 50 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;
            if (!regex.test(nombre_mobiliario)) {
                showError(elements.nombre_mobiliario, "El tipo de mobiliario debe comenzar con una letra");
                return false;
            }

            clearError(elements.nombre_mobiliario);
            return true;
        }

        function validarDescripcionMobiliario() {
            const descripcion_mobiliario = elements.descripcion_mobiliario.value.trim();

            if (descripcion_mobiliario === "") {
                showError(elements.descripcion_mobiliario, "La descripción del mobiliario es obligatoria");
                return false;
            }

            if (descripcion_mobiliario.length < 3 || descripcion_mobiliario.length > 50) {
                showError(elements.descripcion_mobiliario, "La descripción del mobiliario debe tener entre 3 y 50 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;
            if (!regex.test(descripcion_mobiliario)) {
                showError(elements.descripcion_mobiliario, "La descripción del mobiliario debe comenzar con una letra");
                return false;
            }

            clearError(elements.descripcion_mobiliario);
            return true;
        }

        elements.nombre_mobiliario.addEventListener('input', validarTipoMobiliario);
        elements.descripcion_mobiliario.addEventListener('input', validarDescripcionMobiliario);
        elements.estatus.addEventListener('change', validarEstatus);

        // Submit Handler
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const validaciones = [
                validarTipoMobiliario(),
                validarDescripcionMobiliario(),
                validarEstatus()
            ];

            if (validaciones.every(v => v) === true) {
                try {
                    const formData = new FormData(form);
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.exito) {
                            $('#modalConfig').modal('hide'); // Cerrar modal
                            AlertManager.success("Actualización exitosa", data.mensaje);
                            // Recargar tabla en lugar de reload completo (si se puede)
                            if (typeof tablaConfig !== 'undefined') {
                                tablaConfig.ajax.reload(null, false);
                            } else {
                                window.location.reload();
                            }
                        } else {
                            AlertManager.error("Error", data.mensaje || "Error al actualizar");
                        }
                    } else {
                        AlertManager.error("Error", "Error del servidor");
                    }
                } catch (error) {
                    AlertManager.error("Error", "Ocurrió un error inesperado");
                }
            } else {
                AlertManager.warning("Formulario incompleto", "Por favor corrige los errores");
            }
        });
    }
});
