document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-fames');
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        id_patologia: document.getElementById('id_patologia'),
        tipo_ayuda: document.getElementById('tipo_ayuda'),
        otro_tipo: document.getElementById('otro_tipo'),
        btnLimpiarFormularioFames: document.getElementById('btnLimpiarFormularioFames')
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
            elements.beneficiario_nombre,
            elements.id_patologia,
            elements.tipo_ayuda,
            elements.otro_tipo,
        ];

        fields.forEach(field => {
            if (!field) return;

            field.classList.remove('is-valid', 'is-invalid');

            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = "";
                errorElement.style.display = 'none';
            }

            if ($(field).hasClass('select2')) {
                // Resetear valor y refrescar Select2
                $(field).val(null).trigger('change');

                // Limpiar clases visuales de Select2
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

    function validarPatologia() {
        const id_patologia = elements.id_patologia.value;

        if (id_patologia === "") {
            showError(elements.id_patologia, "La patología es obligatoria");
            return false;
        }

        clearError(elements.id_patologia);
        return true;
    }

    function validarTipoAyuda() {
        const tipo_ayuda = elements.tipo_ayuda.value;

        if (tipo_ayuda === "") {
            showError(elements.tipo_ayuda, "El tipo de ayuda es obligatorio");
            return false;
        }

        clearError(elements.tipo_ayuda);
        return true;
    }

    function validarOtroTipo() {
        const input = document.getElementById("otro_tipo");
        const valor = input.value.trim();
        const container = document.getElementById("otro_tipo_container");

        if (container.style.display === "none") {
            clearError(input);
            return true;
        }

        if (valor === "") {
            showError(input, "Debe ingresar un tipo de ayuda distinto");
            return false;
        }

        // Validación básica de texto: solo letras, números, espacios y signos comunes
        const regex = /^[a-zA-ZÀ-ÿ0-9\s.,;:()¡!¿?'"-]+$/;
        if (!regex.test(valor)) {
            showError(input, "El tipo de ayuda contiene caracteres inválidos");
            return false;
        }

        clearError(input);
        return true;
    }


    $('#id_patologia').on('select2:select', function (e) {
        validarPatologia();
    });
    elements.id_beneficiario.addEventListener("change", function (e) {
        validarBeneficiario();
    });
    elements.btnEliminarBeneficiario.addEventListener("click", function (e) {
        toggleBotonEliminar();
    });
    elements.tipo_ayuda.addEventListener('change', validarTipoAyuda);
    elements.btnLimpiarFormularioFames.addEventListener('click', function (e) {
        limpiarFormulario();
    });
    document.getElementById("tipo_ayuda").addEventListener("change", function (e) {
        const otroDiv = document.getElementById("otro_tipo_container");
        const otroInput = document.getElementById("otro_tipo");

        if (e.target.value === "Otros") {
            // Mostrar campo
            otroDiv.style.display = "block";
            otroInput.setAttribute("required", "true");
        } else {
            // Ocultar campo y limpiar
            otroDiv.style.display = "none";
            otroInput.removeAttribute("required");
            otroInput.value = "";
            clearError(otroInput);
        }
    });
    // Listener en tiempo real para validar mientras escribe
    document.getElementById("otro_tipo").addEventListener("input", validarOtroTipo);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarPatologia(),
            validarBeneficiario(),
            validarTipoAyuda(),
            validarOtroTipo()
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
            AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });
});