$(function () {
    // 1. Delegación de evento para abrir el modal
    $(document).on('click', '.btn-editar[data-tipo="patologia"]', async function () {
        const id = $(this).data('id');
        const modal = $('#modalConfig');

        // 1. Configurar Header del Modal
        $('#modalConfigTitle').text('Editar Patología');
        $('#modalConfigSubtitle').text('Modifica los datos de la patología seleccionada');

        // 2. Inyectar HTML del Formulario
        const formHTML = `
            <form id="form-editar-patologia" method="POST" action="actualizar_patologia" class="needs-validation p-4" novalidate>
                <input type="hidden" name="id_patologia" id="edit_id_patologia" value="${id}">
                <input type="hidden" name="tipo" value="patologia">
                
                <div class="row g-4">
                    <div class="col-md-12">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="edit_nombre_patologia" name="nombre_patologia" placeholder="Nombre de la patología" required>
                            <label for="edit_nombre_patologia">Nombre de la Patología</label>
                            <div class="invalid-feedback" id="edit_nombre_patologiaError"></div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div class="form-floating">
                            <select class="form-select" id="edit_tipo_patologia" name="tipo_patologia" required>
                                <option value="" selected disabled>Seleccione...</option>
                                <option value="Medica">Médica</option>
                                <option value="Psicológica">Psicológica</option>
                                <option value="General">General</option>
                            </select>
                            <label for="edit_tipo_patologia">Tipo de Patología</label>
                            <div class="invalid-feedback" id="edit_tipo_patologiaError"></div>
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
            const response = await fetch(`obtener_detalle_json?id=${id}&tipo=patologia`); // GET request
            if (!response.ok) throw new Error('Error al obtener datos');

            const result = await response.json();

            if (result.exito) {
                const data = result.data;
                // Rellenar campos
                $('#edit_nombre_patologia').val(data.nombre_patologia);
                $('#edit_tipo_patologia').val(data.tipo_patologia);

                // Mostrar Modal solo cuando todo esté listo
                modal.modal('show');

                // 4. Inicializar Validaciones
                initValidationEditarPatologia();

            } else {
                Swal.fire('Error', result.mensaje || 'No se pudieron cargar los datos', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    });

    // 2. Lógica de Validación (Encapsulada)
    function initValidationEditarPatologia() {
        const form = document.getElementById('form-editar-patologia');
        const elements = {
            id_patologia: document.getElementById('edit_id_patologia'), // Necesario para excluirse a sí mismo
            nombre_patologia: document.getElementById('edit_nombre_patologia'),
            tipo_patologia: document.getElementById('edit_tipo_patologia'),
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

        async function validarPatologia() {
            const id_patologia = elements.id_patologia.value;
            const nombre_patologia = elements.nombre_patologia.value.trim();
            const tipo_patologia = elements.tipo_patologia.value.trim();

            // Validaciones locales
            if (nombre_patologia === "") {
                showError(elements.nombre_patologia, "La patología es obligatoria");
                return false;
            }

            if (nombre_patologia.length < 3 || nombre_patologia.length > 100) {
                showError(elements.nombre_patologia, "La patología debe tener entre 3 y 100 caracteres");
                return false;
            }

            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;
            if (!regex.test(nombre_patologia)) {
                showError(elements.nombre_patologia, "La patología debe comenzar con una letra");
                return false;
            }

            // Validación Servidor (AJAX) - Verifica Duplicados
            try {
                // Objeto FormData para enviar también el ID
                const formData = new URLSearchParams();
                formData.append('id_patologia', id_patologia); // IMPORTANTE: Enviar ID para excluir validación
                formData.append('nombre_patologia', nombre_patologia);
                formData.append('tipo_patologia', tipo_patologia);

                const response = await fetch('validar_patologia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: formData
                });

                if (!response.ok) throw new Error('Error en petición');

                const data = await response.json();

                if (data.existe) {
                    showError(elements.nombre_patologia, "Esta patología ya existe con este tipo");
                    return false;
                }

                clearError(elements.nombre_patologia);
                return true;
            } catch (error) {
                console.error('Error validando:', error);
                return false; // Fail safe
            }
        }

        async function ValidarTipoCompuesto() {
            const tipo = elements.tipo_patologia.value;
            const nombre = elements.nombre_patologia.value;

            if (tipo === "") {
                showError(elements.tipo_patologia, "El tipo es obligatorio");
                return false;
            }
            clearError(elements.tipo_patologia);

            // Si cambian el tipo, re-validamos si la combinación nombre+tipo ya existe
            if (nombre !== "") {
                await validarPatologia();
            }
            return true;
        }

        // Listeners
        elements.nombre_patologia.addEventListener('input', validarPatologia); // Validate on type
        elements.tipo_patologia.addEventListener('change', ValidarTipoCompuesto); // Validate on change

        // Submit Handler
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const isNameValid = await validarPatologia();
            const isTypeValid = await ValidarTipoCompuesto();

            if (isNameValid && isTypeValid) {
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
