$(function () {
    // 1. Delegación de evento para abrir el modal
    $(document).on('click', '.btn-editar[data-tipo="pnf"]', async function () {
        const id = $(this).data('id');
        const modal = $('#modalConfig');

        // 1. Configurar Header del Modal
        $('#modalConfigTitle').text('Editar PNF');
        $('#modalConfigSubtitle').text('Modifica los datos del PNF seleccionado');

        // 2. Inyectar HTML del Formulario
        const formHTML = `
            <form id="form-editar-pnf" method="POST" action="actualizar_pnf" class="needs-validation p-4" novalidate>
                <input type="hidden" name="id_pnf" id="edit_id_pnf" value="${id}">
                <input type="hidden" name="tipo" value="pnf">
                
                <div class="row g-4">
                    <div class="col-md-12">
                        <label for="edit_nombre_pnf" class="form-label">Nombre del PNF</label>
                        <div class="input-group">
                            <span class="input-group-text">PNF</span>
                            <input type="text" class="form-control" id="edit_nombre_pnf" name="nombre_pnf" placeholder="Ej: Informática, Administración..." required>
                            <div class="invalid-feedback" id="edit_nombre_pnfError"></div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div class="form-floating">
                            <select class="form-select" id="edit_estatus" name="estatus" required>
                                <option value="" selected disabled>Seleccione...</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                            <label for="edit_estatus">Estatus del PNF</label>
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
            const response = await fetch(`obtener_detalle_json?id=${id}&tipo=pnf`); // GET request
            if (!response.ok) throw new Error('Error al obtener datos');

            const result = await response.json();

            if (result.exito) {
                const data = result.data;
                // Rellenar campos
                // Eliminamos el prefijo "PNF " (case insensitive) si existe para mostrar solo el nombre
                let nombreClean = data.nombre_pnf.replace(/^PNF\s+/i, '');
                $('#edit_nombre_pnf').val(nombreClean);

                $('#edit_estatus').val(data.estatus);

                // Mostrar Modal solo cuando todo esté listo
                modal.modal('show');

                // 4. Inicializar Validaciones
                initValidationEditarPnf();

            } else {
                Swal.fire('Error', result.mensaje || 'No se pudieron cargar los datos', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    });

    // 2. Lógica de Validación (Encapsulada)
    function initValidationEditarPnf() {
        const form = document.getElementById('form-editar-pnf');
        const elements = {
            id_pnf: document.getElementById('edit_id_pnf'), // Necesario para excluirse a sí mismo
            nombre_pnf: document.getElementById('edit_nombre_pnf'),
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

        async function validarPNF() {
            const nombre_pnf = elements.nombre_pnf.value.trim();

            if (nombre_pnf === "") {
                showError(elements.nombre_pnf, "El PNF es obligatorio");
                return false;
            }

            if (nombre_pnf.length < 3 || nombre_pnf.length > 100) {
                showError(elements.nombre_pnf, "El PNF debe tener entre 3 y 100 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
            if (!regex.test(nombre_pnf)) {
                showError(elements.nombre_pnf, "El PNF debe contener solo letras");
                return false;
            }

            try {
                const response = await fetch('validar_pnf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: new URLSearchParams({
                        id_pnf: elements.id_pnf.value,
                        nombre_pnf: 'PNF ' + nombre_pnf // Validamos enviando el prefijo
                    })
                });

                if (!response.ok) {
                    throw new Error('Error en la petición: ' + response.status);
                }

                const data = await response.json();

                if (data.existe) {
                    showError(elements.nombre_pnf, "Este PNF ya está registrado en el sistema");
                    return false;
                }

                clearError(elements.nombre_pnf);
                return true;
            } catch (error) {
                console.error('Error validando PNF:', error);
                showError(elements.nombre_pnf, "Error al validar PNF");
                return false;
            }
        }

        elements.nombre_pnf.addEventListener('input', validarPNF);
        elements.estatus.addEventListener('change', validarEstatus);

        // Submit Handler
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const isNameValid = await validarPNF();
            const isStatusValid = await validarEstatus();

            if (isNameValid && isStatusValid) {
                try {
                    const formData = new FormData(form);
                    // IMPORTANTE: Agregar el prefijo "PNF " al valor que se envía
                    formData.set('nombre_pnf', 'PNF ' + elements.nombre_pnf.value.trim());

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
