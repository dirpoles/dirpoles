$(function () {
    // 1. Delegación de evento para abrir el modal
    $(document).on('click', '.btn-editar[data-tipo="tipo_equipo"]', async function () {
        const id = $(this).data('id');
        const modal = $('#modalConfig');

        // 1. Configurar Header del Modal
        $('#modalConfigTitle').text('Editar Tipo de Equipo');
        $('#modalConfigSubtitle').text('Modifica los datos del Tipo de Equipo seleccionado');

        // 2. Inyectar HTML del Formulario
        const formHTML = `
            <form id="form-editar-tipo_equipo" method="POST" action="actualizar_tipo_equipo" class="needs-validation p-4" novalidate>
                <input type="hidden" name="id_tipo_equipo" id="id_tipo_equipo" value="${id}">
                <input type="hidden" name="tipo" value="tipo_equipo">
                
                <div class="row g-4">
                    <div class="col-md-12">
                        <label for="edit_nombre_tipo_equipo" class="form-label">Nombre del Tipo de Equipo</label>
                        <div class="input-group">
                            <span class="input-group-text">Tipo de Equipo</span>
                            <input type="text" class="form-control" id="edit_nombre_tipo_equipo" name="nombre" placeholder="Tipo de equipo" required>
                            <div class="invalid-feedback" id="edit_nombre_tipo_equipoError"></div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <label for="edit_descripcion_tipo_equipo" class="form-label">Descripción del Tipo de Equipo</label>
                        <div class="input-group">
                            <span class="input-group-text">Descripción</span>
                            <input type="text" class="form-control" id="edit_descripcion_tipo_equipo" name="descripcion" placeholder="Descripción del tipo de equipo" required>
                            <div class="invalid-feedback" id="edit_descripcion_tipo_equipoError"></div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div class="form-floating">
                            <select class="form-select" id="edit_estatus" name="estatus" required>
                                <option value="" selected disabled>Seleccione...</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                            <label for="edit_estatus">Estatus del Tipo de Equipo</label>
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
            const response = await fetch(`obtener_detalle_json?id=${id}&tipo=tipo_equipo`); // GET request
            if (!response.ok) throw new Error('Error al obtener datos');

            const result = await response.json();

            if (result.exito) {
                const data = result.data;
                // Rellenar campos
                $('#edit_nombre_tipo_equipo').val(data.nombre);
                $('#edit_descripcion_tipo_equipo').val(data.descripcion);
                $('#edit_estatus').val(data.estatus);

                // Mostrar Modal solo cuando todo esté listo
                modal.modal('show');

                // 4. Inicializar Validaciones
                initValidationEditarTipoEquipo();

            } else {
                Swal.fire('Error', result.mensaje || 'No se pudieron cargar los datos', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    });

    // 2. Lógica de Validación (Encapsulada)
    function initValidationEditarTipoEquipo() {
        const form = document.getElementById('form-editar-tipo_equipo');
        const elements = {
            id_tipo_equipo: document.getElementById('id_tipo_equipo'), // Necesario para excluirse a sí mismo
            nombre_equipo: document.getElementById('edit_nombre_tipo_equipo'),
            descripcion_equipo: document.getElementById('edit_descripcion_tipo_equipo'),
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

        function validarTipoEquipo() {
            const nombre_equipo = elements.nombre_equipo.value.trim();

            if (nombre_equipo === "") {
                showError(elements.nombre_equipo, "El tipo de equipo es obligatorio");
                return false;
            }

            if (nombre_equipo.length < 3 || nombre_equipo.length > 50) {
                showError(elements.nombre_equipo, "El tipo de equipo debe tener entre 3 y 50 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;
            if (!regex.test(nombre_equipo)) {
                showError(elements.nombre_equipo, "El tipo de equipo debe comenzar con una letra");
                return false;
            }

            clearError(elements.nombre_equipo);
            return true;
        }

        function validarDescripcionEquipo() {
            const descripcion_equipo = elements.descripcion_equipo.value.trim();

            if (descripcion_equipo === "") {
                showError(elements.descripcion_equipo, "La descripción del equipo es obligatoria");
                return false;
            }

            if (descripcion_equipo.length < 3 || descripcion_equipo.length > 50) {
                showError(elements.descripcion_equipo, "La descripción del equipo debe tener entre 3 y 50 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;
            if (!regex.test(descripcion_equipo)) {
                showError(elements.descripcion_equipo, "La descripción del equipo debe comenzar con una letra");
                return false;
            }

            clearError(elements.descripcion_equipo);
            return true;
        }

        elements.nombre_equipo.addEventListener('input', validarTipoEquipo);
        elements.descripcion_equipo.addEventListener('input', validarDescripcionEquipo);
        elements.estatus.addEventListener('change', validarEstatus);

        // Submit Handler
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const validaciones = [
                validarTipoEquipo(),
                validarDescripcionEquipo(),
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
