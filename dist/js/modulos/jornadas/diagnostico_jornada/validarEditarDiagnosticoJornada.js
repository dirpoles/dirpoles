/**
 * Función para validar los cmapos del diagnostico
 * @param {number} id - ID del diagnostico
 */

function validarEditarDiagnosticoJornada(id) {
    const form = document.getElementById('formEditarDiagnosticoJornada');
    if (!form) {
        return;
    }

    const elements = {
        diagnostico: document.getElementById('editar_diagnostico'),
        tratamiento: document.getElementById('editar_tratamiento'),
        observaciones: document.getElementById('editar_observaciones')
    };

    const showError = (field, msg) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) errorElement.textContent = msg;

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        // Si es Select2, aplicar al contenedor visible
        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) errorElement.textContent = "";

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");

        // Si es Select2, aplicar al contenedor visible
        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .removeClass('is-invalid')
                .addClass('is-valid');
        }
    };

    function validarDiagnostico() {
        const diagnostico = elements.diagnostico.value.trim();
        if (diagnostico === "") {
            showError(elements.diagnostico, "El diagnostico es requerido");
            return false;
        }

        if (diagnostico.length < 5) {
            showError(elements.diagnostico, "El diagnóstico debe tener al menos 5 caracteres");
            return false;
        }

        clearError(elements.diagnostico);
        return true;
    }

    function validarTratamiento() {
        const tratamiento = elements.tratamiento.value.trim();
        if (tratamiento === "") {
            showError(elements.tratamiento, "El tratamiento es requerido");
            return false;
        }

        if (tratamiento.length < 5) {
            showError(elements.tratamiento, "El tratamiento debe tener al menos 5 caracteres");
            return false;
        }

        clearError(elements.tratamiento);
        return true;
    }

    function validarObservaciones() {
        const observaciones = elements.observaciones.value.trim();
        if (observaciones === "") {
            showError(elements.observaciones, "Las observaciones son requeridas");
            return false;
        }

        if (observaciones.length < 5) {
            showError(elements.observaciones, "Las observaciones deben tener al menos 5 caracteres");
            return false;
        }

        clearError(elements.observaciones);
        return true;
    }

    // Eventos de validación en tiempo real
    elements.diagnostico.addEventListener('input', validarDiagnostico);
    elements.tratamiento.addEventListener('input', validarTratamiento);
    elements.observaciones.addEventListener('input', validarObservaciones);

    // Validar formulario al enviar
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarDiagnostico(),
            validarObservaciones(),
            validarTratamiento()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch('actualizar_diagnostico_jornada', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Edición exitosa", data.mensaje).then(() => {
                            $('#modalDiagnostico').modal('hide');
                            // Recargar DataTable
                            if ($.fn.DataTable.isDataTable('#tabla_beneficiarios_atendidos')) {
                                $('#tabla_beneficiarios_atendidos').DataTable().ajax.reload(null, false);
                            }
                        });
                    } else {
                        AlertManager.error("Error", data.error || data.mensaje || "Error desconocido");
                    }
                } else {
                    AlertManager.error("Error", "Error en la petición al servidor");
                }

            } catch (error) {
                console.error(error);
                AlertManager.error("Error", "Ocurrió un error inesperado: " + error);
            }
        } else {
            AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });
}