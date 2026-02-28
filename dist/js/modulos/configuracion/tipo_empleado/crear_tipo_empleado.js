document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-tipo-empleado');
    if (!form) return;

    const elements = {
        tipo: document.getElementById('tipo'),
        id_servicios: document.getElementById('id_servicios'),
    };

    const showError = (field, msg) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = msg;
            errorElement.style.display = 'block';
        }

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = 'none';
        }

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");

        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .removeClass('is-invalid')
                .addClass('is-valid');
        }
    };

    async function validarTipoEmpleado() {
        const tipo = elements.tipo.value.trim();
        const id_servicios = elements.id_servicios.value.trim();

        if (tipo === "") {
            showError(elements.tipo, "El tipo de empleado es obligatorio");
            return false;
        }

        if (id_servicios === "") {
            showError(elements.id_servicios, "El servicio es obligatorio");
            return false;
        }

        if (tipo.length < 3 || tipo.length > 30) {
            showError(elements.tipo, "El tipo de empleado debe tener entre 3 y 30 caracteres");
            return false;
        }

        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*$/;
        if (!regex.test(tipo)) {
            showError(elements.tipo, "El tipo de empleado debe comenzar con una letra");
            return false;
        }

        try {
            const response = await fetch('validar_tipo_empleado', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({
                    tipo: tipo,
                    id_servicios: id_servicios
                })
            });

            if (!response.ok) {
                throw new Error('Error en la petición: ' + response.status);
            }

            const data = await response.json();

            if (data.existe) {
                showError(elements.tipo, "Este tipo de empleado ya está registrado en el sistema");
                return false;
            }

            clearError(elements.tipo);
            return true;
        } catch (error) {
            console.error('Error validando tipo de empleado:', error);
            showError(elements.tipo, "Error al validar tipo de empleado");
            return false;
        }
    }

    async function validarServicioCompuesto() {
        const id_servicios = elements.id_servicios.value.trim();
        const tipo = elements.tipo.value.trim();

        if (id_servicios === "") {
            showError(elements.id_servicios, "El servicio es obligatorio");
            return false;
        }

        clearError(elements.id_servicios);

        // Si ya hay algo escrito en el tipo, re-validamos la combinación
        if (tipo !== "") {
            await validarTipoEmpleado();
        }

        return true;
    }

    elements.tipo.addEventListener('input', validarTipoEmpleado);
    $(elements.id_servicios).change(validarServicioCompuesto);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validar = [
            await validarTipoEmpleado(),
            await validarServicioCompuesto()
        ];

        if (validar.every(v => v) === true) {
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
});