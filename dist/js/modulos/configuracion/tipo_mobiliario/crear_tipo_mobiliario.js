document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-tipo-mobiliario');
    if (!form) return;

    const elements = {
        nombre_mobiliario: document.getElementById('nombre_mobiliario'),
        descripcion_mobiliario: document.getElementById('descripcion_mobiliario')
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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validar = [
            validarTipoMobiliario(),
            validarDescripcionMobiliario()
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