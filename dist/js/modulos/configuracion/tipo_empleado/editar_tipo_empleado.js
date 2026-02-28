$(function () {
    // 1. Delegación de evento para abrir el modal
    $(document).on('click', '.btn-editar[data-tipo="tipo_empleado"]', async function () {
        const id = $(this).data('id');
        const modal = $('#modalConfig');

        // 1. Configurar Header del Modal
        $('#modalConfigTitle').text('Editar Tipo de Empleado');
        $('#modalConfigSubtitle').text('Modifica los datos del Tipo de Empleado seleccionado');

        // 2. Obtener Datos
        try {
            // A. Primero obtenemos los servicios
            const servicesResponse = await fetch('consultar_config_json?tipo=servicio');
            if (!servicesResponse.ok) throw new Error('Error al obtener servicios');
            const servicesResult = await servicesResponse.json();

            // B. Luego obtenemos el detalle del registro
            const detailResponse = await fetch(`obtener_detalle_json?id=${id}&tipo=tipo_empleado`);
            if (!detailResponse.ok) throw new Error('Error al obtener detalle');
            const detailResult = await detailResponse.json();

            if (!servicesResult.exito || !detailResult.exito) {
                throw new Error(servicesResult.mensaje || detailResult.mensaje || 'Error cargando información');
            }

            const activeServices = servicesResult.data; // Lista completa
            const data = detailResult.data;             // Detalle del registro

            // 3. Construir opciones del Select de Servicios
            let optionsHTML = '<option value="" disabled>Seleccione un servicio...</option>';
            activeServices.forEach(serv => {
                // Seleccionar si coincide con el del registro
                // Mostrar si está activo (estatus=1) O si es el que tiene asignado actualmente (para no perderlo si se desactivó)
                if (serv.estatus == 1 || serv.id_servicios == data.id_servicios) {
                    const selected = (serv.id_servicios == data.id_servicios) ? 'selected' : '';
                    optionsHTML += `<option value="${serv.id_servicios}" ${selected}>${serv.nombre_servicio}</option>`;
                }
            });

            // 4. Inyectar HTML del Formulario (SIN ESTATUS)
            const formHTML = `
                <form id="form-editar-tipo_empleado" method="POST" action="actualizar_tipo_empleado" class="needs-validation p-4" novalidate>
                    <input type="hidden" name="id_tipo_emp" id="id_tipo_emp" value="${id}">
                    <input type="hidden" name="tipo" value="tipo_empleado">
                    
                    <div class="row g-4">
                        <div class="col-md-12">
                            <label for="edit_tipo" class="form-label">Nombre del Tipo de Empleado</label>
                            <div class="input-group">
                                <span class="input-group-text">Tipo de Empleado</span>
                                <input type="text" class="form-control" id="edit_tipo" name="tipo" value="${data.tipo}" placeholder="Tipo de Empleado" required>
                                <div class="invalid-feedback" id="edit_tipoError"></div>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <label for="edit_id_servicios" class="form-label">Servicio Asociado</label>
                            <select class="form-select" id="edit_id_servicios" name="id_servicios" required>
                                ${optionsHTML}
                            </select>
                            <div class="invalid-feedback" id="edit_id_serviciosError"></div>
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
            modal.modal('show');

            // 5. Inicializar Validaciones
            initValidationEditarTipoEmpleado();

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión o datos inválidos', 'error');
        }
    });

    // 2. Lógica de Validación (Encapsulada)
    function initValidationEditarTipoEmpleado() {
        const form = document.getElementById('form-editar-tipo_empleado');
        const elements = {
            id_tipo_emp: document.getElementById('id_tipo_emp'), // Importante: ID hidden
            tipo: document.getElementById('edit_tipo'),
            id_servicios: document.getElementById('edit_id_servicios')
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

        async function validarTipoEmpleado() {
            const tipo = elements.tipo.value.trim();
            const id_servicios = elements.id_servicios.value.trim();

            if (tipo === "") {
                showError(elements.tipo, "El tipo de empleado es obligatorio");
                return false;
            }

            if (tipo.length < 3 || tipo.length > 30) {
                showError(elements.tipo, "El tipo debe tener entre 3 y 30 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;
            if (!regex.test(tipo)) {
                showError(elements.tipo, "El tipo debe comenzar con una letra");
                return false;
            }

            // Validamos solo si tenemos servicio seleccionado, si no, fallará la validación de servicio
            if (id_servicios === "") return true;

            try {
                const response = await fetch('validar_tipo_empleado', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    // Usamos URLSearchParams que es compatible y simple
                    body: new URLSearchParams({
                        id_tipo_emp: elements.id_tipo_emp.value,
                        tipo: tipo,
                        id_servicios: id_servicios
                    })
                });

                if (!response.ok) throw new Error('Error status: ' + response.status);

                const data = await response.json();

                if (data.existe) {
                    showError(elements.tipo, "Este tipo de empleado ya existe para este servicio");
                    return false;
                }

                clearError(elements.tipo);
                return true;
            } catch (error) {
                console.error('Error validando:', error);
                // No bloqueamos por error de red en validación asíncrona no crítica, o mostramos error genérico
                return false;
            }
        }

        async function validarServicio() {
            const id_servicios = elements.id_servicios.value.trim();
            if (id_servicios === "") {
                showError(elements.id_servicios, "El servicio es obligatorio");
                return false;
            }
            clearError(elements.id_servicios);

            // Si cambia el servicio, debemos re-validar la unicidad del nombre
            if (elements.tipo.value.trim() !== "") {
                await validarTipoEmpleado();
            }
            return true;
        }

        // Listeners
        elements.tipo.addEventListener('input', validarTipoEmpleado);
        $(elements.id_servicios).change(validarServicio);

        // Submit Handler
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Ejecutar validaciones secuenciales
            const isTipoValid = await validarTipoEmpleado();
            const isServicioValid = await validarServicio();

            if (isTipoValid && isServicioValid) {
                try {
                    const formData = new FormData(form);
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.exito) {
                            $('#modalConfig').modal('hide');
                            AlertManager.success("Actualización exitosa", data.mensaje);
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
