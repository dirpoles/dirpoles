document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-gestion-emb');
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        genero: document.getElementById('genero'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        id_patologia_emb: document.getElementById('id_patologia_emb'),
        codigo_patria: document.getElementById('codigo_patria'),
        semanas_gest: document.getElementById('semanas_gest'),
        serial_patria: document.getElementById('serial_patria'),
        btnLimpiarFormularioGestionEmb: document.getElementById('btnLimpiarFormularioGestionEmb')
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
            elements.id_patologia_emb,
            elements.codigo_patria,
            elements.semanas_gest,
            elements.serial_patria,
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
        const genero = elements.genero.value;

        if (beneficiario_nombre === "") {
            showError(elements.beneficiario_nombre, "El beneficiario es obligatorio");
            return false;
        }

        if (genero !== "Femenino") {
            showError(elements.beneficiario_nombre, "El beneficiario debe ser femenino");
            return false;
        }

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
        const id_patologia = elements.id_patologia_emb.value;

        if (id_patologia === "") {
            showError(elements.id_patologia_emb, "La patología es obligatoria");
            return false;
        }

        clearError(elements.id_patologia_emb);
        return true;
    }

    function validarCodigoPatria() {
        const codigo_patria = elements.codigo_patria.value;

        if (codigo_patria === "") {
            clearError(elements.codigo_patria);
            return true;
        }

        if (codigo_patria.length > 10) {
            showError(elements.codigo_patria, "El código de la patria debe tener máximo 10 caracteres");
            return false;
        }

        clearError(elements.codigo_patria);
        return true;
    }

    function validarSemanasGest() {
        const semanas_gest = elements.semanas_gest.value;

        if (semanas_gest < 1 || semanas_gest > 42) {
            showError(elements.semanas_gest, "Las semanas de gestación deben estar entre 1 y 42");
            return false;
        }

        if (semanas_gest === "") {
            showError(elements.semanas_gest, "Las semanas de gestación son obligatorias");
            return false;
        }

        clearError(elements.semanas_gest);
        return true;
    }

    function validarSerialPatria() {
        const serial_patria = elements.serial_patria.value;

        if (serial_patria === "") {
            clearError(elements.serial_patria);
            return true;
        }

        if (serial_patria.length > 10) {
            showError(elements.serial_patria, "El serial de la patria debe tener máximo 10 caracteres");
            return false;
        }

        clearError(elements.serial_patria);
        return true;
    }


    $('#id_patologia_emb').on('select2:select', function (e) {
        validarPatologia();
    });
    elements.id_beneficiario.addEventListener("change", function (e) {
        validarBeneficiario();
    });
    elements.btnEliminarBeneficiario.addEventListener("click", function (e) {
        toggleBotonEliminar();
    });
    elements.semanas_gest.addEventListener('input', validarSemanasGest);
    elements.codigo_patria.addEventListener('input', validarCodigoPatria);
    elements.serial_patria.addEventListener('input', validarSerialPatria);
    elements.btnLimpiarFormularioGestionEmb.addEventListener('click', function (e) {
        limpiarFormulario();
    });

    // Forzar solo números en los tres inputs
    ["semanas_gest", "codigo_patria", "serial_patria"].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener("input", function () {
            // Reemplazar todo lo que no sea dígito
            this.value = this.value.replace(/\D/g, "");
        });
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarPatologia(),
            validarBeneficiario(),
            validarCodigoPatria(),
            validarSemanasGest(),
            validarSerialPatria()
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
            if (elements.genero.value !== "Femenino" && elements.beneficiario_nombre.value !== "") {
                AlertManager.error("Error", "El beneficiario debe ser femenino");
            } else {
                AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
            }
        }
    });
});