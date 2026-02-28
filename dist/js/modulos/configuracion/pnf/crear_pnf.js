document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-pnf');
    if (!form) return;

    const elements = {
        nombre_pnf: document.getElementById('nombre_pnf'),
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
                    nombre_pnf: 'PNF ' + nombre_pnf
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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validar = [
            await validarPNF()
        ];

        if (validar.every(v => v) === true) {
            try {
                const formData = new FormData(form);
                // Agregar prefijo PNF
                formData.set('nombre_pnf', 'PNF ' + elements.nombre_pnf.value.trim());

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