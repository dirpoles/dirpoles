document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-patologia');
    if (!form) return;

    const elements = {
        nombre_patologia: document.getElementById('nombre_patologia'),
        tipo_patologia: document.getElementById('tipo_patologia'),
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

    async function validarPatologia() {
        const nombre_patologia = elements.nombre_patologia.value.trim();
        const tipo_patologia = elements.tipo_patologia.value.trim();

        if (nombre_patologia === "") {
            showError(elements.nombre_patologia, "La patología es obligatoria");
            return false;
        }

        if (tipo_patologia === "") {
            showError(elements.tipo_patologia, "El tipo de patología es obligatorio");
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

        try {
            const response = await fetch('validar_patologia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({
                    nombre_patologia: nombre_patologia,
                    tipo_patologia: tipo_patologia
                })
            });

            if (!response.ok) {
                throw new Error('Error en la petición: ' + response.status);
            }

            const data = await response.json();

            if (data.existe) {
                showError(elements.nombre_patologia, "Esta patología ya está registrada en el sistema");
                return false;
            }

            clearError(elements.nombre_patologia);
            return true;
        } catch (error) {
            console.error('Error validando patología:', error);
            showError(elements.nombre_patologia, "Error al validar patología");
            return false;
        }
    }

    async function ValidarTipoPatologiaCompuesta() {
        const tipo_patologia = elements.tipo_patologia.value.trim();
        const nombre_patologia = elements.nombre_patologia.value.trim();

        if (tipo_patologia === "") {
            showError(elements.tipo_patologia, "El tipo de patología es obligatorio");
            return false;
        }

        clearError(elements.tipo_patologia);

        // Si ya hay algo escrito en el tipo, re-validamos la combinación
        if (nombre_patologia !== "") {
            await validarPatologia();
        }

        return true;
    }

    elements.nombre_patologia.addEventListener('input', validarPatologia);
    $(elements.tipo_patologia).change(ValidarTipoPatologiaCompuesta);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validar = [
            await validarPatologia(),
            ValidarTipoPatologiaCompuesta()
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