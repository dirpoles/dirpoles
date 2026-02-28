/**
 * Inicializa las validaciones para el formulario de edición de una embarazada
 * @param {number} id - ID de la embarazada que se esta editando
 */

function validarEditarEmb(id) {
    const form = document.getElementById('formEditarEmb');
    if (!form) return;

    const elements = {
        editar_id_patologia: document.getElementById('editar_id_patologia'),
        tipo_ayuda: document.getElementById('tipo_ayuda'),
        semanas_gest: document.getElementById('semanas_gest'),
        estado: document.getElementById('estado'),
        codigo_patria: document.getElementById('codigo_patria'),
        serial_patria: document.getElementById('serial_patria')
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

    function validarPatologia() {
        const id_patologia = elements.editar_id_patologia.value;

        if (id_patologia === "") {
            showError(elements.editar_id_patologia, "La patología es obligatoria");
            return false;
        }

        clearError(elements.editar_id_patologia);
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

    // Obtener valor inicial para validación
    const semanasGestacionInicial = parseInt(elements.semanas_gest.value) || 0;

    function validarSemanasGest() {
        const valorActual = parseInt(elements.semanas_gest.value);

        if (elements.semanas_gest.value === "") {
            showError(elements.semanas_gest, "Las semanas de gestación son obligatorias");
            return false;
        }

        if (isNaN(valorActual)) {
            showError(elements.semanas_gest, "Debe ingresar un número válido");
            return false;
        }

        if (valorActual < semanasGestacionInicial) {
            showError(elements.semanas_gest, `La semana debe ser mayor a la actual : (${semanasGestacionInicial})`);
            return false;
        }

        if (valorActual < 1 || valorActual > 42) {
            showError(elements.semanas_gest, "Las semanas de gestación deben estar entre 1 y 42");
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


    $('#editar_id_patologia').on('select2:select', function (e) {
        validarPatologia();
    });
    elements.semanas_gest.addEventListener('input', validarSemanasGest);
    elements.codigo_patria.addEventListener('input', validarCodigoPatria);
    elements.serial_patria.addEventListener('input', validarSerialPatria);

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
            validarSemanasGest(),
            validarCodigoPatria(),
            validarSerialPatria()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                const response = await fetch('embarazadas_actualizar', {
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