document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-retiro-temporal');
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        motivo_retiro: document.getElementById('motivo_retiro'),
        duracion_retiro: document.getElementById('duracion_retiro'),
        motivo_retiro_otro: document.getElementById('motivo_retiro_otro'),
        observaciones_retiro: document.getElementById('observaciones_retiro'),
        btnLimpiarFormularioRetiro: document.getElementById('btnLimpiarFormularioRetiro')
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
            elements.motivo_retiro,
            elements.duracion_retiro,
            elements.motivo_retiro_otro,
            elements.observaciones_retiro
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

    function validarMotivoRetiro() {
        const motivoSelect = elements.motivo_retiro.value;
        const motivoOtro = elements.motivo_retiro_otro.value.trim();

        // Validar select principal
        if (!motivoSelect || motivoSelect === "") {
            showError(elements.motivo_retiro, "El motivo del retiro es obligatorio");
            return false;
        }

        // Si selecciona "Otro", validar el campo adicional
        if (motivoSelect === "Otro") {
            if (motivoOtro === "") {
                showError(elements.motivo_retiro_otro, "Debe especificar el motivo del retiro");
                return false;
            }
            clearError(elements.motivo_retiro_otro);
            return true;
        }

        // Limpiar errores si todo está correcto
        clearError(elements.motivo_retiro);
        return true;
    }

    function validarDuracionRetiro() {
        const duracionRetiro = elements.duracion_retiro.value;

        if (duracionRetiro === "") {
            showError(elements.duracion_retiro, "La duración del retiro es obligatoria");
            return false;
        }

        clearError(elements.duracion_retiro);
        return true;
    }

    function validarObservacionesRetiro() {
        const observacionesRetiro = elements.observaciones_retiro.value;

        if (observacionesRetiro === "") {
            showError(elements.observaciones_retiro, "Las observaciones del retiro son obligatorias");
            return false;
        }

        clearError(elements.observaciones_retiro);
        return true;
    }

    //listeners
    elements.motivo_retiro.addEventListener('change', function () {
        const otroMotivoContainer = document.getElementById('otro-motivo-container');

        if (this.value === "Otro") {
            // Mostrar el input
            otroMotivoContainer.style.display = "block";
            // No validamos inmediatamente para dar chance a escribir
            clearError(elements.motivo_retiro); // Limpiamos error del select si lo hubiera
        } else {
            // Ocultar el input y limpiar su valor
            otroMotivoContainer.style.display = "none";
            elements.motivo_retiro_otro.value = "";
            clearError(elements.motivo_retiro_otro);
            validarMotivoRetiro(); // Validamos si seleccionó una opción válida normal
        }
    });

    elements.motivo_retiro_otro.addEventListener('input', function () {
        validarMotivoRetiro();
    });

    elements.duracion_retiro.addEventListener('change', function () {
        validarDuracionRetiro();
    });
    elements.observaciones_retiro.addEventListener('input', function () {
        validarObservacionesRetiro();
    });
    elements.btnLimpiarFormularioRetiro.addEventListener('click', limpiarFormulario);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarBeneficiario(),
            validarMotivoRetiro(),
            validarDuracionRetiro(),
            validarObservacionesRetiro()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                if (elements.motivo_retiro.value === 'Otro') {
                    formData.set('motivo_retiro', elements.motivo_retiro_otro.value);
                }

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