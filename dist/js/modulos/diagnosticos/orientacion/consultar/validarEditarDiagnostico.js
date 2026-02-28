/**
 * Inicializa las validaciones para el formulario de edición de un diagnostico medico
 * @param {number} id - ID del diagnostico que se está editando
 */

function validarEditarDiagnostico(id) {
    const form = document.getElementById('formEditarOrientacion')
    if (!form) return;

    const elements = {
        motivo_orientacion: document.getElementById('editar_motivo_orientacion'),
        descripcion_orientacion: document.getElementById('editar_descripcion_orientacion'),
        indicaciones_orientacion: document.getElementById('editar_indicaciones_orientacion'),
        obs_adic_orientacion: document.getElementById('editar_obs_adic_orientacion'),
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

    function validarMotivoOrientacion() {
        let motivo_orientacion = elements.motivo_orientacion.value;
        motivo_orientacion = motivo_orientacion.replace(/<[^>]*>?/gm, "");

        if (motivo_orientacion === "") {
            showError(elements.motivo_orientacion, "El motivo de orientación es obligatorio");
            return false;
        }

        if (/^\s|\s$/.test(motivo_orientacion)) {
            showError(elements.motivo_orientacion, "El motivo de orientación no puede comenzar ni terminar con espacios");
            return false;
        }

        if (motivo_orientacion.length < 5) {
            showError(elements.motivo_orientacion, "El motivo de orientación debe tener al menos 5 caracteres");
            return false;
        }

        if (motivo_orientacion.length > 250) {
            showError(elements.motivo_orientacion, "El motivo de orientación debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(motivo_orientacion)) {
            showError(elements.motivo_orientacion, "El motivo de orientación solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.motivo_orientacion);
        return true;
    }

    function validarDescripcionOrientacion() {
        let descripcion_orientacion = elements.descripcion_orientacion.value;
        descripcion_orientacion = descripcion_orientacion.replace(/<[^>]*>?/gm, "");

        if (descripcion_orientacion === "") {
            showError(elements.descripcion_orientacion, "La descripción de orientación es obligatoria");
            return false;
        }

        if (/^\s|\s$/.test(descripcion_orientacion)) {
            showError(elements.descripcion_orientacion, "La descripción de orientación no puede comenzar ni terminar con espacios");
            return false;
        }

        if (descripcion_orientacion.length < 5) {
            showError(elements.descripcion_orientacion, "La descripción de orientación debe tener al menos 5 caracteres");
            return false;
        }

        if (descripcion_orientacion.length > 250) {
            showError(elements.descripcion_orientacion, "La descripción de orientación debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(descripcion_orientacion)) {
            showError(elements.descripcion_orientacion, "La descripción de orientación solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.descripcion_orientacion);
        return true;
    }

    function validarIndicacionesOrientacion() {
        let indicaciones_orientacion = elements.indicaciones_orientacion.value;
        indicaciones_orientacion = indicaciones_orientacion.replace(/<[^>]*>?/gm, "");

        if (indicaciones_orientacion === "") {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación son obligatorias");
            return false;
        }

        if (/^\s|\s$/.test(indicaciones_orientacion)) {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación no pueden comenzar ni terminar con espacios");
            return false;
        }

        if (indicaciones_orientacion.length < 5) {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación debe tener al menos 5 caracteres");
            return false;
        }

        if (indicaciones_orientacion.length > 250) {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(indicaciones_orientacion)) {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.indicaciones_orientacion);
        return true;
    }

    function validarObservaciones() {
        let obs_adic_orientacion = elements.obs_adic_orientacion.value;
        obs_adic_orientacion = obs_adic_orientacion.replace(/<[^>]*>?/gm, "");

        if (obs_adic_orientacion === "") {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales son obligatorias");
            return false;
        }

        if (/^\s|\s$/.test(obs_adic_orientacion)) {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales no pueden comenzar ni terminar con espacios");
            return false;
        }

        if (obs_adic_orientacion.length < 5) {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales debe tener al menos 5 caracteres");
            return false;
        }

        if (obs_adic_orientacion.length > 250) {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(obs_adic_orientacion)) {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.obs_adic_orientacion);
        return true;
    }

    //EventListener para tiempo real
    elements.motivo_orientacion.addEventListener('input', validarMotivoOrientacion);
    elements.descripcion_orientacion.addEventListener('input', validarDescripcionOrientacion);
    elements.indicaciones_orientacion.addEventListener('input', validarIndicacionesOrientacion);
    elements.obs_adic_orientacion.addEventListener('input', validarObservaciones);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarMotivoOrientacion(),
            validarDescripcionOrientacion(),
            validarIndicacionesOrientacion(),
            validarObservaciones()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch('diagnostico_orientacion_actualizar', {
                    method: 'POST',
                    body: formData
                });

                AlertManager.close();

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Registro exitoso", data.mensaje).then(() => {
                            $('#modalDiagnostico').modal('hide');

                            // Recargar DataTable
                            if ($.fn.DataTable.isDataTable('#tabla_orientacion')) {
                                $('#tabla_orientacion').DataTable().ajax.reload(null, false);
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
