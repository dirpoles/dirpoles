document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-servicio');
    if (!form) return;

    const elements = {
        nombre_serv: document.getElementById('nombre_serv'),
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
                    nombre_serv: nombre_serv
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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validar = [
            await validarServicio()
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