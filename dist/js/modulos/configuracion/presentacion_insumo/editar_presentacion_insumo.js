$(function () {
    // 1. Delegación de evento para abrir el modal
    $(document).on('click', '.btn-editar[data-tipo="presentacion_insumo"]', async function () {
        const id = $(this).data('id');
        const modal = $('#modalConfig');

        // 1. Configurar Header del Modal
        $('#modalConfigTitle').text('Editar Presentación de Insumo');
        $('#modalConfigSubtitle').text('Modifica los datos de la Presentación de Insumo seleccionada');

        // 2. Inyectar HTML del Formulario
        const formHTML = `
            <form id="form-editar-presentacion_insumo" method="POST" action="actualizar_presentacion_insumo" class="needs-validation p-4" novalidate>
                <input type="hidden" name="id_presentacion" id="edit_id_presentacion" value="${id}">
                <input type="hidden" name="tipo" value="presentacion_insumo">
                
                <div class="row g-4">
                    <div class="col-md-12">
                        <label for="edit_nombre_presentacion" class="form-label">Nombre de la Presentación de Insumo</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="edit_nombre_presentacion" name="nombre_presentacion" placeholder="Ej: Kilogramo, Litro, Gramo..." required>
                            <div class="invalid-feedback" id="edit_nombre_presentacionError"></div>
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
            const response = await fetch(`obtener_detalle_json?id=${id}&tipo=presentacion_insumo`); // GET request
            if (!response.ok) throw new Error('Error al obtener datos');

            const result = await response.json();

            if (result.exito) {
                const data = result.data;
                // Rellenar campos
                $('#edit_nombre_presentacion').val(data.nombre_presentacion);

                // Mostrar Modal solo cuando todo esté listo
                modal.modal('show');

                // 4. Inicializar Validaciones
                initValidationEditarPresentacionInsumo();

            } else {
                Swal.fire('Error', result.mensaje || 'No se pudieron cargar los datos', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    });

    // 2. Lógica de Validación (Encapsulada)
    function initValidationEditarPresentacionInsumo() {
        const form = document.getElementById('form-editar-presentacion_insumo');
        const elements = {
            id_presentacion: document.getElementById('edit_id_presentacion'), // Necesario para excluirse a sí mismo
            nombre_presentacion: document.getElementById('edit_nombre_presentacion'),
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

        async function validarPresentacion() {
            const nombre_presentacion = elements.nombre_presentacion.value.trim();

            if (nombre_presentacion === "") {
                showError(elements.nombre_presentacion, "La presentación es obligatoria");
                return false;
            }

            if (nombre_presentacion.length < 3 || nombre_presentacion.length > 100) {
                showError(elements.nombre_presentacion, "La presentación debe tener entre 3 y 100 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;
            if (!regex.test(nombre_presentacion)) {
                showError(elements.nombre_presentacion, "La presentación debe comenzar con una letra");
                return false;
            }

            try {
                const response = await fetch('validar_presentacion_insumo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: new URLSearchParams({
                        id_presentacion: elements.id_presentacion.value,
                        nombre_presentacion: nombre_presentacion
                    })
                });

                if (!response.ok) {
                    throw new Error('Error en la petición: ' + response.status);
                }

                const data = await response.json();

                if (data.existe) {
                    showError(elements.nombre_presentacion, "Esta presentación ya está registrada en el sistema");
                    return false;
                }

                clearError(elements.nombre_presentacion);
                return true;
            } catch (error) {
                console.error('Error validando presentación:', error);
                showError(elements.nombre_presentacion, "Error al validar presentación");
                return false;
            }
        }


        elements.nombre_presentacion.addEventListener('input', validarPresentacion);

        // Submit Handler
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const isPresentacionValid = await validarPresentacion();

            if (isPresentacionValid) {
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
