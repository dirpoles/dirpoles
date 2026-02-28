/**
 * Inicializa las validaciones para el formulario de edición de una beca
 * @param {number} id - ID de la beca que se esta editando
 */

function validarEditarBeca(id) {
    const form = document.getElementById('formEditarBeca');
    if (!form) return;

    const elements = {
        cta_bcv: document.getElementById('cta_bcv'),
        tipo_banco: document.getElementById('tipo_banco')
    };

    const showError = (field, msg) => {
        if (!field) return;

        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = msg;
            errorElement.style.display = 'block';
        }

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        // Aplicar estilo al contenedor Select2 si existe
        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        if (!field) return;

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

    elements.cta_bcv.addEventListener('input', validarCtaBcv);
    elements.tipo_banco.addEventListener('change', validarTipoBanco);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarTipoBanco(),
            validarCtaBcv()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                const response = await fetch('beca_actualizar', {
                    method: 'POST',
                    body: formData
                });

                AlertManager.close();

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Edición exitosa", data.mensaje).then(() => {
                            $('#modalDiagnostico').modal('hide');

                            // Recargar DataTable
                            if ($.fn.DataTable.isDataTable('#tabla_ts')) {
                                $('#tabla_ts').DataTable().ajax.reload(null, false);
                            }
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
}