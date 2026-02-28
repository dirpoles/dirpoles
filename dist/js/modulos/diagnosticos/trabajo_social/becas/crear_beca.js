document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-becas');
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        tipo_banco: document.getElementById('tipo_banco'),
        cta_bcv: document.getElementById('cta_bcv'),
        planilla: document.getElementById('planilla'),
        btnLimpiarFormularioBecas: document.getElementById('btnLimpiarFormularioBecas')
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
            elements.tipo_banco,
            elements.cta_bcv,
            elements.planilla
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

    function validarTipoBanco() {
        const tipo_banco = elements.tipo_banco.value;

        if (tipo_banco === "") {
            showError(elements.tipo_banco, "El tipo de banco es obligatorio");
            return false;
        }

        clearError(elements.tipo_banco);
        return true;
    }

    function validarCtaBcv() {
        const cta_bcv = elements.cta_bcv.value;

        if (cta_bcv === "") {
            showError(elements.cta_bcv, "La cuenta BCV es obligatoria");
            return false;
        }

        if (!/^\d{16}$/.test(cta_bcv)) {
            showError(elements.cta_bcv, "La cuenta BCV debe tener exactamente 16 dígitos numéricos");
            return false;
        }

        clearError(elements.cta_bcv);
        return true;
    }

    function validarPlanilla() {
        const input = elements.planilla;
        const files = input.files;

        if (!files || files.length === 0) {
            showError(input, "La planilla es obligatoria");
            return false;
        }

        const file = files[0];

        // Validar tipo MIME
        if (file.type !== "application/pdf") {
            showError(input, "La planilla debe ser un archivo PDF");
            return false;
        }

        // Validar extensión
        const extension = file.name.split(".").pop().toLowerCase();
        if (extension !== "pdf") {
            showError(input, "La planilla debe tener extensión .pdf");
            return false;
        }

        // Validar tamaño (ejemplo: máximo 5 MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showError(input, "La planilla no debe superar los 5 MB");
            return false;
        }

        clearError(input);
        return true;
    }

    elements.cta_bcv.addEventListener("input", function (e) {
        // Eliminar todo lo que no sea dígito
        e.target.value = e.target.value.replace(/\D/g, "");

        // Limitar a 16 dígitos
        if (e.target.value.length > 16) {
            e.target.value = e.target.value.slice(0, 16);
        }
    });

    elements.planilla.addEventListener("change", function (e) {
        validarPlanilla();
    });
    $('#tipo_banco').on('select2:select', function (e) {
        validarTipoBanco();
    });
    elements.id_beneficiario.addEventListener("change", function (e) {
        validarBeneficiario();
    });
    elements.btnEliminarBeneficiario.addEventListener("click", function (e) {
        toggleBotonEliminar();
    });
    elements.cta_bcv.addEventListener('input', validarCtaBcv);
    elements.btnLimpiarFormularioBecas.addEventListener('click', function (e) {
        limpiarFormulario();
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarTipoBanco(),
            validarCtaBcv(),
            validarBeneficiario(),
            validarPlanilla()
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