document.addEventListener('DOMContentLoaded', function () {
    form = document.getElementById('formulario-referencia');

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        id_servicio_origen: document.getElementById('id_servicio_origen'),
        id_empleado_origen: document.getElementById('id_empleado_origen'),
        id_servicio_destino: document.getElementById('id_servicio_destino'),
        id_empleado_destino: document.getElementById('id_empleado_destino'),
        motivo: document.getElementById('motivo'),
        observaciones: document.getElementById('observaciones'),
        limpiar_form: document.getElementById('limpiar_form')
    };

    const showError = (field, msg) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) errorElement.textContent = msg;

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        // Si es Select2, aplicar al contenedor visible
        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) errorElement.textContent = "";

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");

        // Si es Select2, aplicar al contenedor visible
        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .removeClass('is-invalid')
                .addClass('is-valid');
        }
    };

    function inicializarDataTableBeneficiarios() {
        $('#tablaBeneficiariosModal').DataTable({
            ajax: {
                url: 'beneficiarios_activos_data_json',
                dataSrc: 'data'
            },
            searching: true,
            pageLength: 10,
            language: {
                url: 'plugins/DataTables/js/languaje.json'
            },
            columns: [
                { data: 'cedula_completa' },
                { data: 'nombre_completo' },
                { data: 'nombre_pnf' },
                { data: 'seccion' },
                {
                    data: 'id_beneficiario',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-sm btn-primary btn-seleccionar-beneficiario" 
                                    data-id="${data}" 
                                    data-nombre="${row.nombre_completo}">
                                <i class="fas fa-check"></i> Seleccionar
                            </button>
                        `;
                    }
                }
            ],
            initComplete: function () {
                $(document).on('click', '.btn-seleccionar-beneficiario', function () {
                    const id = $(this).data('id');
                    const nombre = $(this).data('nombre');

                    elements.id_beneficiario.value = id;
                    elements.beneficiario_nombre.value = nombre;
                    clearError(elements.id_beneficiario);
                    clearError(elements.beneficiario_nombre);
                    toggleBotonEliminar();

                    $('#modalSeleccionarBeneficiario').modal('hide');
                    validarBeneficiario();
                });
            }
        });
    }

    function limpiarFormulario() {
        form.reset();

        // Limpiar campos de beneficiario y ocultar botón 'X'
        elements.id_beneficiario.value = '';
        elements.beneficiario_nombre.value = '';
        toggleBotonEliminar();

        // Lógica de reseteo basada en el rol
        if (USER_SESSION.es_admin) {
            $(elements.id_servicio_origen).val('').trigger('change');
            $(elements.id_empleado_origen).html('<option value="" disabled selected>Seleccione servicio primero</option>').trigger('change');
        } else {
            // Si es empleado, restaurar sus datos por defecto
            $(elements.id_servicio_origen).val(USER_SESSION.id_servicio).trigger('change');
            $(elements.id_empleado_origen).val(USER_SESSION.id_empleado).trigger('change');
        }

        // Limpiar campos de destino
        $(elements.id_servicio_destino).val('').trigger('change');
        $(elements.id_empleado_destino).html('<option value="" selected disabled>Cualquier especialista disponible</option>').trigger('change');

        // Limpiar campos de texto
        elements.motivo.value = '';
        elements.observaciones.value = '';

        // Campos a limpiar clases (incluyendo el input de beneficiario)
        const fields = [
            elements.id_beneficiario,
            elements.id_servicio_origen,
            elements.id_empleado_origen,
            elements.id_servicio_destino,
            elements.id_empleado_destino,
            elements.motivo,
            elements.observaciones,
            elements.beneficiario_nombre
        ];

        fields.forEach(field => {
            if (!field) return;

            // Remover clases de validación de Bootstrap
            field.classList.remove('is-valid', 'is-invalid');

            // Limpiar mensaje de error y ocultarlo
            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = "";
                errorElement.style.display = 'none';
            }

            // Manejar clases específicas de Select2 si aplica
            if ($(field).hasClass('select2')) {
                $(field).next('.select2-container').find('.select2-selection')
                    .removeClass('is-invalid')
                    .removeClass('is-valid');
            }
        });
    }

    function validarBeneficiario() {
        const beneficiario_nombre = elements.beneficiario_nombre.value;

        if (beneficiario_nombre === "") {
            showError(elements.id_beneficiario, "El beneficiario es obligatorio");
            showError(elements.beneficiario_nombre, "El beneficiario es obligatorio");
            return false;
        }

        clearError(elements.id_beneficiario);
        clearError(elements.beneficiario_nombre);
        toggleBotonEliminar();
        return true;
    }

    function toggleBotonEliminar() {
        if (elements.id_beneficiario && elements.id_beneficiario.value && elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.style.display = 'block';
        } else if (elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.style.display = 'none';
        }
    }

    async function loadEmployees(idServicio, targetSelect) {
        try {
            $(targetSelect).prop('disabled', true);

            const response = await $.ajax({
                url: 'obtener_empleados_servicio',
                type: 'POST',
                data: { id_servicios: idServicio },
                dataType: 'json'
            });

            const $select = $(targetSelect);
            $select.empty();

            if (response.exito && response.data.length > 0) {
                $select.append('<option value="" selected>Seleccione un especialista...</option>');
                response.data.forEach(emp => {
                    const isCurrentUser = emp.id_empleado == USER_SESSION.id_empleado;
                    const selected = isCurrentUser ? 'selected' : '';
                    $select.append(`<option value="${emp.id_empleado}" ${selected}>${emp.nombre_completo}  ${emp.cedula_completa}</option>`);
                });
            } else {
                $select.append('<option value="" selected>No hay especialistas disponibles</option>');
            }

            $select.prop('disabled', false).trigger('change');

        } catch (error) {
            console.error('Error cargando empleados:', error);
            $(targetSelect).html('<option value="" selected>Error al cargar</option>').prop('disabled', false).trigger('change');
        }
    }

    function validarServicioOrigen() {
        const servicio_origen = elements.id_servicio_origen.value;
        if (servicio_origen === "") {
            showError(elements.id_servicio_origen, "El servicio de origen es obligatorio");
            return false;
        }
        clearError(elements.id_servicio_origen);
        return true;
    }

    function validarServicioDestino() {
        const servicio_destino = elements.id_servicio_destino.value;
        if (servicio_destino === "") {
            showError(elements.id_servicio_destino, "El servicio de destino es obligatorio");
            return false;
        }
        clearError(elements.id_servicio_destino);
        return true;
    }

    function validarServiciosDiferentes() {
        const origen = elements.id_servicio_origen.value;
        const destino = elements.id_servicio_destino.value;

        if (origen && destino && origen === destino) {
            showError(elements.id_servicio_destino, "No se puede referir al mismo servicio de origen");
            return false;
        } else if (destino) {
            clearError(elements.id_servicio_destino);
        }
        return true;
    }

    function validarObservaciones() {
        const observaciones = elements.observaciones.value.trim();

        if (observaciones === "") {
            showError(elements.observaciones, "Las observaciones son obligatorias");
            return false;
        }

        if (observaciones.length < 5) {
            showError(elements.observaciones, "Las observaciones deben tener al menos 5 caracteres");
            return false;
        }
        clearError(elements.observaciones);
        return true;
    }

    function validarMotivo() {
        const motivo = elements.motivo.value.trim();

        if (motivo === "") {
            showError(elements.motivo, "El motivo es obligatorio");
            return false;
        }

        if (motivo.length < 5) {
            showError(elements.motivo, "El motivo debe tener al menos 5 caracteres");
            return false;
        }
        clearError(elements.motivo);
        return true;
    }

    function validarEmpleadoDestino() {
        const id_empleado_destino = elements.id_empleado_destino.value.trim();

        if (id_empleado_destino === "") {
            showError(elements.id_empleado_destino, "El empleado destino es obligatorio");
            return false;
        }
        clearError(elements.id_empleado_destino);
        return true;
    }

    function validarEmpleadoOrigen() {
        const id_empleado_origen = elements.id_empleado_origen.value.trim();

        if (id_empleado_origen === "") {
            showError(elements.id_empleado_origen, "El empleado origen es obligatorio");
            return false;
        }
        clearError(elements.id_empleado_origen);
        return true;
    }

    function Listeners() {
        // Al cambiar servicio de destino
        $(elements.id_servicio_destino).on('change', function () {
            const idServicio = $(this).val();
            if (idServicio) {
                loadEmployees(idServicio, elements.id_empleado_destino);
            } else {
                $(elements.id_empleado_destino).html('<option value="" selected>Cualquier especialista disponible</option>').trigger('change');
            }
            validarServiciosDiferentes();
        });

        // Al cambiar servicio de origen (solo para Admin)
        if (USER_SESSION.es_admin) {
            $(elements.id_servicio_origen).on('change', function () {
                const idServicio = $(this).val();
                if (idServicio) {
                    loadEmployees(idServicio, elements.id_empleado_origen);
                } else {
                    $(elements.id_empleado_origen).html('<option value="" disabled selected>Seleccione servicio primero</option>').trigger('change');
                }
                validarServiciosDiferentes();
            });
        }
    }

    elements.id_beneficiario.addEventListener('input', validarBeneficiario);
    $(elements.id_servicio_origen).on('change', validarServicioOrigen);
    $(elements.id_servicio_destino).on('change', validarServicioDestino);
    elements.observaciones.addEventListener('input', validarObservaciones);
    elements.motivo.addEventListener('input', validarMotivo);
    $(elements.id_empleado_origen).on('change', validarEmpleadoOrigen);
    $(elements.id_empleado_destino).on('change', validarEmpleadoDestino);
    elements.limpiar_form.addEventListener('click', limpiarFormulario);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarBeneficiario(),
            validarServiciosDiferentes(),
            validarObservaciones(),
            validarMotivo(),
            validarEmpleadoOrigen(),
            validarEmpleadoDestino(),
            validarServicioOrigen(),
            validarServicioDestino()
        ]

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                AlertManager.close();

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Registro exitoso", data.mensaje).then(() => {
                            window.location.reload();
                        });
                    } else {
                        AlertManager.error("Error", data.error || data.mensaje || "Error desconocido");
                    }
                } else {
                    AlertManager.error("Error", "Error en la petición al servidor");
                }


            } catch (error) {
                AlertManager.close();
                console.error(error);
                AlertManager.error("Error", "Ocurrió un error inesperado");
            }
        } else {
            AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });

    Listeners();
    inicializarDataTableBeneficiarios();
});