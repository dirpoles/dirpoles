document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-presentacion-insumo');
    if (!form) return;

    const elements = {
        nombre_presentacion: document.getElementById('nombre_presentacion')
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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validar = [
            await validarPresentacion()
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