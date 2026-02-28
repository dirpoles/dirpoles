document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-cambio-carrera');
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        motivo_cambio: document.getElementById('motivo_cambio'),
        observaciones_cambio: document.getElementById('observaciones_cambio'),
        btnLimpiarFormularioCambio: document.getElementById('btnLimpiarFormularioCambio')
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

    function limpiarFormulario() {
        form.reset();

        // Limpiar campos de beneficiario manualmente y ocultar botón de eliminar
        elements.id_beneficiario.value = '';
        elements.beneficiario_nombre.value = '';
        $('.id_beneficiario_hidden').val('');
        toggleBotonEliminar();

        // Remover clases de validación y mensajes de error
        const fields = [
            elements.id_beneficiario,
            elements.motivo_cambio,
            elements.observaciones_cambio
        ];

        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');

            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = "";
                errorElement.style.display = 'none';
            }

            if ($(field).hasClass('select2')) {
                $(field).next('.select2-container').find('.select2-selection')
                    .removeClass('is-invalid')
                    .removeClass('is-valid');
            }
        });
    }

    function toggleBotonEliminar() {
        if (elements.id_beneficiario && elements.id_beneficiario.value && elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.style.display = 'block';
        } else if (elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.style.display = 'none';
        }
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

    function validarMotivoCambio() {
        const motivoCambio = elements.motivo_cambio.value;

        // Validar select principal
        if (!motivoCambio || motivoCambio === "") {
            showError(elements.motivo_cambio, "El motivo del cambio es obligatorio");
            return false;
        }

        if (motivoCambio.length > 250) {
            showError(elements.motivo_cambio, "El motivo del cambio debe tener menos de 250 caracteres");
            return false;
        }

        // Limpiar errores si todo está correcto
        clearError(elements.motivo_cambio);
        return true;
    }


    function validarObservacionesCambio() {
        const observacionesCambio = elements.observaciones_cambio.value;

        if (observacionesCambio === "") {
            showError(elements.observaciones_cambio, "Las observaciones del cambio son obligatorias");
            return false;
        }

        if (observacionesCambio.length > 250) {
            showError(elements.observaciones_cambio, "Las observaciones del cambio deben tener menos de 250 caracteres");
            return false;
        }

        clearError(elements.observaciones_cambio);
        return true;
    }

    elements.motivo_cambio.addEventListener('input', function () {
        validarMotivoCambio();
    });

    elements.observaciones_cambio.addEventListener('input', function () {
        validarObservacionesCambio();
    });
    elements.btnLimpiarFormularioCambio.addEventListener('click', limpiarFormulario);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarBeneficiario(),
            validarMotivoCambio(),
            validarObservacionesCambio()
        ];

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
            AlertManager.error("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });

});