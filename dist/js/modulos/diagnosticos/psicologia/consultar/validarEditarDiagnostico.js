/**
 * Inicializa las validaciones para el formulario de edición de un diagnostico
 * @param {number} id - ID del diagnostico que se está editando
 */
function validarEditarDiagnostico(id) {
    const form = document.getElementById('formEditarDiagnostico');
    if (!form) return;

    const elements = {
        idPsicologia: document.getElementById('id_psicologia'),
        tipoConsulta: document.getElementById('tipo_consulta'),
        idPatologia: document.getElementById('editar_id_patologia'),
        diagnostico: document.getElementById('editar_diagnostico'),
        observaciones: document.getElementById('editar_observaciones'),
        tratamientoGen: document.getElementById('editar_tratamiento_gen'),
        motivoRetiro: document.getElementById('editar_motivo_retiro'),
        motivoOtro: document.getElementById('editar_motivo_retiro_otro'),
        duracionRetiro: document.getElementById('editar_duracion_retiro'),
        motivoCambio: document.getElementById('editar_motivo_cambio')
    };

    const tipoConsulta = elements.tipoConsulta ? elements.tipoConsulta.value : '';

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

    // ============= VALIDACIONES PARA DIAGNÓSTICO =============
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

    function validarDiagnostico() {
        if (!elements.diagnostico) return true;

        const valor = elements.diagnostico.value.trim();
        if (!valor) {
            showError(elements.diagnostico, "El diagnóstico es obligatorio");
            return false;
        }
        if (valor.length < 10) {
            showError(elements.diagnostico, "El diagnóstico debe tener al menos 10 caracteres");
            return false;
        }
        clearError(elements.diagnostico);
        return true;
    }

    function validarTratamiento() {
        if (!elements.tratamientoGen) return true;

        // El tratamiento es opcional, solo validar si tiene contenido
        const valor = elements.tratamientoGen.value.trim();
        if (valor && valor.length < 10) {
            showError(elements.tratamientoGen, "El tratamiento debe tener al menos 10 caracteres");
            return false;
        }
        clearError(elements.tratamientoGen);
        return true;
    }

    // ============= VALIDACIONES PARA RETIRO TEMPORAL =============
    function validarMotivoRetiro() {
        if (!elements.motivoRetiro) return true;

        const valor = elements.motivoRetiro.value;
        if (!valor) {
            showError(elements.motivoRetiro, "Debe seleccionar un motivo de retiro");
            return false;
        }

        // Si seleccionó "Otro", validar el campo de texto
        if (valor === "Otro" && elements.motivoOtro) {
            const otroValor = elements.motivoOtro.value.trim();
            if (!otroValor) {
                showError(elements.motivoOtro, "Debe especificar el motivo del retiro");
                return false;
            }
            if (otroValor.length < 5) {
                showError(elements.motivoOtro, "El motivo debe tener al menos 5 caracteres");
                return false;
            }
            clearError(elements.motivoOtro);
        }

        clearError(elements.motivoRetiro);
        return true;
    }

    function validarDuracionRetiro() {
        if (!elements.duracionRetiro) return true;

        const valor = elements.duracionRetiro.value;
        if (!valor) {
            showError(elements.duracionRetiro, "Debe seleccionar la duración del retiro");
            return false;
        }
        clearError(elements.duracionRetiro);
        return true;
    }

    // ============= VALIDACIONES PARA CAMBIO DE CARRERA =============
    function validarMotivoCambio() {
        if (!elements.motivoCambio) return true;

        const valor = elements.motivoCambio.value.trim();
        if (!valor) {
            showError(elements.motivoCambio, "El motivo del cambio es obligatorio");
            return false;
        }
        if (valor.length < 20) {
            showError(elements.motivoCambio, "El motivo debe tener al menos 20 caracteres para explicar adecuadamente");
            return false;
        }
        clearError(elements.motivoCambio);
        return true;
    }

    // ============= VALIDACIONES COMUNES =============
    function validarObservaciones() {
        // Las observaciones no son opcionales, validar si tienen contenido
        const valor = elements.observaciones.value.trim();
        if (!valor) {
            showError(elements.observaciones, "Las observaciones son obligatorias");
            return false;
        }
        if (valor.length < 5) {
            showError(elements.observaciones, "Las observaciones deben tener al menos 5 caracteres");
            return false;
        }
        clearError(elements.observaciones);
        return true;
    }

    // ============= LISTENERS SEGÚN TIPO DE CONSULTA =============
    switch (tipoConsulta) {
        case 'Diagnóstico':
            if (elements.idPatologia) {
                elements.idPatologia.addEventListener('change', validarPatologia);
            }
            if (elements.diagnostico) {
                elements.diagnostico.addEventListener('input', validarDiagnostico);
            }
            if (elements.tratamientoGen) {
                elements.tratamientoGen.addEventListener('input', validarTratamiento);
            }
            break;

        case 'Retiro temporal':
            if (elements.motivoRetiro) {
                elements.motivoRetiro.addEventListener('change', validarMotivoRetiro);
            }
            if (elements.motivoOtro) {
                elements.motivoOtro.addEventListener('input', validarMotivoRetiro);
            }
            if (elements.duracionRetiro) {
                elements.duracionRetiro.addEventListener('change', validarDuracionRetiro);
            }
            break;

        case 'Cambio de carrera':
            if (elements.motivoCambio) {
                elements.motivoCambio.addEventListener('input', validarMotivoCambio);
            }
            break;
    }

    // Listener común para observaciones
    if (elements.observaciones) {
        elements.observaciones.addEventListener('input', validarObservaciones);
    }

    // ============= SUBMIT DEL FORMULARIO =============
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        let validaciones = [];

        // Validar según el tipo de consulta
        switch (tipoConsulta) {
            case 'Diagnóstico':
                validaciones = [
                    validarPatologia(),
                    validarDiagnostico(),
                    validarTratamiento(),
                    validarObservaciones()
                ];
                break;

            case 'Retiro temporal':
                validaciones = [
                    validarMotivoRetiro(),
                    validarDuracionRetiro(),
                    validarObservaciones()
                ];
                break;

            case 'Cambio de carrera':
                validaciones = [
                    validarMotivoCambio(),
                    validarObservaciones()
                ];
                break;

            default:
                AlertManager.error("Error", "Tipo de consulta no válido");
                return;
        }

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                // Si es retiro temporal y seleccionó "Otro", usar el valor del input
                if (tipoConsulta === 'Retiro temporal' && elements.motivoRetiro && elements.motivoRetiro.value === 'Otro') {
                    formData.set('motivo_retiro', elements.motivoOtro.value);
                }

                const response = await fetch('actualizar_diagnostico_psicologia', {
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
                            if ($.fn.DataTable.isDataTable('#tabla_diagnostico_general')) {
                                $('#tabla_diagnostico_general').DataTable().ajax.reload(null, false);
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