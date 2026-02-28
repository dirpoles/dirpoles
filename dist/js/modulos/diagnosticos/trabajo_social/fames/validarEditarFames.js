/**
 * Inicializa las validaciones para el formulario de edición de una exoneración
 * @param {number} id - ID de la exoneración que se esta editando
 */

function validarEditarFames(id) {
    const form = document.getElementById('formEditarFames');
    if (!form) return;

    const elements = {
        editar_id_patologia: document.getElementById('editar_id_patologia'),
        tipo_ayuda: document.getElementById('tipo_ayuda'),
        otro_tipo: document.getElementById('otro_tipo')
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


    $('#editar_id_patologia').on('select2:select', function (e) {
        validarPatologia();
    });
    elements.tipo_ayuda.addEventListener('change', validarTipoAyuda);
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
            validarTipoAyuda(),
            validarOtroTipo()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                const response = await fetch('fames_actualizar', {
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