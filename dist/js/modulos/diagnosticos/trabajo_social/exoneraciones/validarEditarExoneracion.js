/**
 * Inicializa las validaciones para el formulario de edición de una exoneración
 * @param {number} id - ID de la exoneración que se esta editando
 */

function validarEditarExoneracion(id) {
    const form = document.getElementById('formEditarExoneracion');
    if (!form) return;

    const elements = {
        motivo: document.getElementById('motivo'),
        otro_motivo: document.getElementById('otro_motivo'),
        carnet_discapacidad: document.getElementById('carnet_discapacidad')
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

    function validarMotivo() {
        const motivo = elements.motivo.value;

        if (motivo === "") {
            showError(elements.motivo, "El motivo es obligatorio");
            return false;
        }

        clearError(elements.motivo);
        return true;
    }

    function validarCarnetDiscapacidad() {
        let carnet = elements.carnet_discapacidad.value;
        // Eliminar etiquetas HTML por seguridad
        carnet = carnet.replace(/<[^>]*>?/gm, "");
        const prefijo = "D-";

        if (carnet === "") {
            clearError(elements.carnet_discapacidad);
            return true;
        }

        // Si no empieza con D-, lo agregamos
        if (!carnet.startsWith(prefijo)) {
            carnet = prefijo + carnet.replace(/[^0-9]/g, "");
            elements.carnet_discapacidad.value = carnet;
        }

        // Extraer solo la parte numérica después del prefijo
        const numero = carnet.substring(prefijo.length);

        // Validación: solo números
        if (!/^\d+$/.test(numero)) {
            showError(elements.carnet_discapacidad, "El carnet debe contener solo números después de D-");
            return false;
        }

        // Validación: longitud (ejemplo máximo 10 dígitos)
        if (numero.length > 10) {
            showError(elements.carnet_discapacidad, "El carnet debe tener menos de 10 dígitos");
            return false;
        }

        clearError(elements.carnet_discapacidad);
        return true;
    }
    // Validación del campo "Otro Motivo"
    function validarOtroMotivo() {
        const input = document.getElementById("otro_motivo");
        const valor = input.value.trim();

        // Si está oculto, no validamos
        if (input.closest(".row").style.display === "none") {
            clearError(input);
            return true;
        }

        if (valor === "") {
            showError(input, "Debe ingresar un motivo");
            return false;
        }

        // Validación básica de texto: solo letras, números, espacios y signos comunes
        const regex = /^[a-zA-ZÀ-ÿ0-9\s.,;:()¡!¿?'"-]+$/;
        if (!regex.test(valor)) {
            showError(input, "El motivo contiene caracteres inválidos");
            return false;
        }

        clearError(input);
        return true;
    }

    elements.carnet_discapacidad.addEventListener('input', validarCarnetDiscapacidad);
    document.getElementById("motivo").addEventListener("change", function (e) {
        const otroDiv = document.querySelector("#otro_motivo").closest(".row");
        const otroInput = document.getElementById("otro_motivo");

        if (e.target.value === "Otro") {
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
    document.getElementById("otro_motivo").addEventListener("input", validarOtroMotivo);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarMotivo(),
            validarCarnetDiscapacidad(),
            validarOtroMotivo()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                const response = await fetch('exoneracion_actualizar', {
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