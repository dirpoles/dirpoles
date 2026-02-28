document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-tipo-equipo');
    if (!form) return;

    const elements = {
        nombre_equipo: document.getElementById('nombre_equipo'),
        descripcion_equipo: document.getElementById('descripcion_equipo')
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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validar = [
            validarTipoEquipo(),
            validarDescripcionEquipo()
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