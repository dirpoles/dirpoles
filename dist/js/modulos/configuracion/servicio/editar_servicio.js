$(function () {
    // 1. Delegación de evento para abrir el modal
    $(document).on('click', '.btn-editar[data-tipo="servicio"]', async function () {
        const id = $(this).data('id');
        const modal = $('#modalConfig');

        // 1. Configurar Header del Modal
        $('#modalConfigTitle').text('Editar Servicio');
        $('#modalConfigSubtitle').text('Modifica los datos del Servicio seleccionado');

        // 2. Inyectar HTML del Formulario
        const formHTML = `
            <form id="form-editar-servicio" method="POST" action="actualizar_servicio" class="needs-validation p-4" novalidate>
                <input type="hidden" name="id_servicios" id="id_servicios" value="${id}">
                <input type="hidden" name="tipo" value="servicio">
                
                <div class="row g-4">
                    <div class="col-md-12">
                        <label for="edit_nombre_serv" class="form-label">Nombre del Servicio</label>
                        <div class="input-group">
                            <span class="input-group-text">Servicio</span>
                            <input type="text" class="form-control" id="edit_nombre_serv" name="nombre_serv" placeholder="Servicios que ofrecen el área." required>
                            <div class="invalid-feedback" id="edit_nombre_servError"></div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div class="form-floating">
                            <select class="form-select" id="edit_estatus" name="estatus" required>
                                <option value="" selected disabled>Seleccione...</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                            <label for="edit_estatus">Estatus del Servicio</label>
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
            const response = await fetch(`obtener_detalle_json?id=${id}&tipo=servicio`); // GET request
            if (!response.ok) throw new Error('Error al obtener datos');

            const result = await response.json();

            if (result.exito) {
                const data = result.data;
                // Rellenar campos
                $('#edit_nombre_serv').val(data.nombre_serv);
                $('#edit_estatus').val(data.estatus);

                // Mostrar Modal solo cuando todo esté listo
                modal.modal('show');

                // 4. Inicializar Validaciones
                initValidationEditarServicio();

            } else {
                Swal.fire('Error', result.mensaje || 'No se pudieron cargar los datos', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    });

    // 2. Lógica de Validación (Encapsulada)
    function initValidationEditarServicio() {
        const form = document.getElementById('form-editar-servicio');
        const elements = {
            id_servicios: document.getElementById('id_servicios'), // Necesario para excluirse a sí mismo
            nombre_serv: document.getElementById('edit_nombre_serv'),
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

        async function validarServicio() {
            const nombre_serv = elements.nombre_serv.value.trim();

            if (nombre_serv === "") {
                showError(elements.nombre_serv, "El Servicio es obligatorio");
                return false;
            }

            if (nombre_serv.length < 3 || nombre_serv.length > 100) {
                showError(elements.nombre_serv, "El Servicio debe tener entre 3 y 100 caracteres");
                return false;
            }

            if (nombre_serv.length < 3 || nombre_serv.length > 100) {
                showError(elements.nombre_serv, "El Servicio debe tener entre 3 y 100 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
            if (!regex.test(nombre_serv)) {
                showError(elements.nombre_serv, "El Servicio debe contener solo letras");
                return false;
            }

            try {
                const response = await fetch('validar_servicio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: new URLSearchParams({
                        nombre_serv: nombre_serv,
                        id_servicios: elements.id_servicios.value
                    })
                });

                if (!response.ok) {
                    throw new Error('Error en la petición: ' + response.status);
                }

                const data = await response.json();

                if (data.existe) {
                    showError(elements.nombre_serv, "Este servicio ya está registrado en el sistema");
                    return false;
                }

                clearError(elements.nombre_serv);
                return true;
            } catch (error) {
                console.error('Error validando Servicio:', error);
                showError(elements.nombre_serv, "Error al validar Servicio");
                return false;
            }
        }

        elements.nombre_serv.addEventListener('input', validarServicio);
        elements.estatus.addEventListener('change', validarEstatus);

        // Submit Handler
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const isNameValid = await validarServicio();
            const isStatusValid = await validarEstatus();

            if (isNameValid && isStatusValid) {
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
