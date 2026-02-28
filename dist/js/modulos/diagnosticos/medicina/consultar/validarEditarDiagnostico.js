/**
 * Inicializa las validaciones para el formulario de edición de un diagnostico medico
 * @param {number} id - ID del diagnostico que se está editando
 */
function validarEditarDiagnostico(id) {
    const form = document.getElementById('formEditarDiagnostico');
    if (!form) return;

    const elements = {
        idConsultaMed: document.getElementById('id_consulta_med'),
        idPatologia: document.getElementById('editar_id_patologia'),
        motivoVisita: document.getElementById('editar_motivo_visita'),
        peso: document.getElementById('editar_peso'),
        estatura: document.getElementById('editar_estatura'),
        tipo_sangre: document.getElementById('editar_tipo_sangre'),
        diagnostico: document.getElementById('editar_diagnostico'),
        tratamiento: document.getElementById('editar_tratamiento'),
        observaciones: document.getElementById('editar_observaciones')
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
        if (!elements.idPatologia) return true;
        const valor = elements.idPatologia.value;
        if (!valor) {
            showError(elements.idPatologia, "Debe seleccionar una patología");
            return false;
        }
        clearError(elements.idPatologia);
        return true;
    }

    function validarMotivoVisita() {
        if (!elements.motivoVisita) return true;
        const valor = elements.motivoVisita.value.trim();
        if (!valor) {
            showError(elements.motivoVisita, "El motivo de la visita es obligatorio");
            return false;
        }
        clearError(elements.motivoVisita);
        return true;
    }

    function validarDiagnostico() {
        if (!elements.diagnostico) return true;

        const valor = elements.diagnostico.value.trim();
        if (!valor) {
            showError(elements.diagnostico, "El diagnóstico es obligatorio");
            return false;
        }
        if (valor.length < 5) {
            showError(elements.diagnostico, "El diagnóstico debe tener al menos 5 caracteres");
            return false;
        }
        clearError(elements.diagnostico);
        return true;
    }

    function validarTratamiento() {
        if (!elements.tratamiento) return true;
        const valor = elements.tratamiento.value.trim();
        if (!valor) {
            showError(elements.tratamiento, "El tratamiento es obligatorio");
            return false;
        }
        clearError(elements.tratamiento);
        return true;
    }

    function validarEstatura() {
        if (!elements.estatura) return true;
        const valor = elements.estatura.value.trim();
        if (!valor) {
            showError(elements.estatura, "La estatura es obligatoria");
            return false;
        }
        clearError(elements.estatura);
        return true;
    }

    function validarPeso() {
        if (!elements.peso) return true;
        const valor = elements.peso.value.trim();
        if (!valor) {
            showError(elements.peso, "El peso es obligatorio");
            return false;
        }

        if (valor < 0) {
            showError(elements.peso, "El peso debe ser mayor a 0kg");
            return false;
        }

        if (valor > 200) {
            showError(elements.peso, "El peso debe ser menor a 200kg");
            return false;
        }

        clearError(elements.peso);
        return true;
    }

    function validarTipoSangre() {
        if (!elements.tipo_sangre) return true;
        const valor = elements.tipo_sangre.value.trim();
        if (!valor) {
            showError(elements.tipo_sangre, "El tipo de sangre es obligatorio");
            return false;
        }
        clearError(elements.tipo_sangre);
        return true;
    }

    function validarObservaciones() {
        if (!elements.observaciones) return true;
        const valor = elements.observaciones.value.trim();
        if (!valor) {
            showError(elements.observaciones, "Las observaciones son obligatorias");
            return false;
        }
        clearError(elements.observaciones);
        return true;
    }

    // Listeners
    if (elements.idPatologia) elements.idPatologia.addEventListener('change', validarPatologia);
    if (elements.motivoVisita) elements.motivoVisita.addEventListener('input', validarMotivoVisita);
    if (elements.diagnostico) elements.diagnostico.addEventListener('input', validarDiagnostico);
    if (elements.tratamiento) elements.tratamiento.addEventListener('input', validarTratamiento);
    if (elements.estatura) elements.estatura.addEventListener('input', validarEstatura);
    if (elements.peso) elements.peso.addEventListener('input', validarPeso);
    if (elements.tipo_sangre) elements.tipo_sangre.addEventListener('input', validarTipoSangre);
    if (elements.observaciones) elements.observaciones.addEventListener('input', validarObservaciones);

    // ============= SUBMIT DEL FORMULARIO =============
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarPatologia(),
            validarMotivoVisita(),
            validarDiagnostico(),
            validarTratamiento(),
            validarEstatura(),
            validarPeso(),
            validarTipoSangre(),
            validarObservaciones()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                const response = await fetch('actualizar_diagnostico_medicina', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Edición exitosa", data.mensaje).then(() => {
                            $('#modalDiagnostico').modal('hide');

                            // Recargar DataTable
                            if ($.fn.DataTable.isDataTable('#tabla_medicina')) {
                                $('#tabla_medicina').DataTable().ajax.reload(null, false);
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
                AlertManager.error("Error", "Ocurrió un error inesperado");
            }
        } else {
            AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });
}