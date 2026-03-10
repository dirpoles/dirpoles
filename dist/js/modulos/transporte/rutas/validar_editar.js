function inicializarValidacionesEditarRuta() {
    const form = document.getElementById('formEditarRuta');
    if (!form) return;

    // Elementos del formulario
    const elements = {
        nombre_ruta: form.querySelector("#nombre_ruta"),
        tipo_ruta: form.querySelector("#tipo_ruta"),
        horario_salida: form.querySelector("#horario_salida"),
        horario_llegada: form.querySelector("#horario_llegada"),
        estatus_ruta: form.querySelector("#estatus_ruta"),
        punto_partida: form.querySelector("#punto_partida"),
        punto_destino: form.querySelector("#punto_destino"),
        trayectoria: form.querySelector("#trayectoria"),
    };

    // Helper functions
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

    // Validaciones específicas
    function validarNombreRuta() {
        const field = elements.nombre_ruta;
        const val = field.value.trim();
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;

        if (!val) {
            showError(field, "El nombre de la ruta es obligatorio");
            return false;
        }
        if (!regex.test(val)) {
            showError(field, "Solo letras y espacios (2-50 caracteres)");
            return false;
        }
        clearError(field);
        return true;
    }

    function validartipoRuta() {
        const field = elements.tipo_ruta;
        const val = field.value.trim();

        if (!val) {
            showError(field, "El tipo de ruta es obligatorio");
            return false;
        }

        clearError(field);
        return true;
    }

    function validarHorarioSalida() {
        const field = elements.horario_salida;
        const val = field.value;

        if (!val) {
            showError(field, "La hora de salida es obligatoria");
            return false;
        }
        // Opcional: validar formato HH:MM o HH:MM:SS
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(val)) {
            showError(field, "Formato de hora inválido");
            return false;
        }

        clearError(field);
        return true;
    }

    function validarHorarioLlegada() {
        const field = elements.horario_llegada;
        const salida = elements.horario_salida.value;
        const llegada = field.value;

        if (!llegada) {
            showError(field, "La hora de llegada es obligatoria");
            return false;
        }
        // Opcional: validar formato HH:MM o HH:MM:SS
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(llegada)) {
            showError(field, "Formato de hora inválido");
            return false;
        }
        // Opcional: llegada ≥ salida
        if (salida && llegada < salida) {
            showError(field, "La llegada no puede ser antes de la salida");
            return false;
        }

        clearError(field);
        return true;
    }

    function validarEstatusRuta() {
        const field = elements.estatus_ruta;
        const val = field.value;

        if (!val) {
            showError(field, "Debe seleccionar un estatus");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarPuntoPartida() {
        const field = elements.punto_partida;
        const val = field.value.trim();

        if (!val) {
            showError(field, "El punto de partida es obligatorio");
            return false;
        }
        if (val.length < 3) {
            showError(field, "Mínimo 3 caracteres");
            return false;
        }

        clearError(field);
        return true;
    }

    function validarPuntoDestino() {
        const field = elements.punto_destino;
        const val = field.value.trim();

        if (!val) {
            showError(field, "El punto de destino es obligatorio");
            return false;
        }
        if (val.length < 3) {
            showError(field, "Mínimo 3 caracteres");
            return false;
        }

        clearError(field);
        return true;
    }

    function validarTrayectoria() {
        const field = elements.trayectoria;
        const val = field.value.trim();

        if (!val) {
            showError(field, "La trayectoria es obligatoria");
            return false;
        }
        if (val.length < 10) {
            showError(field, "Describe al menos 10 caracteres");
            return false;
        }

        clearError(field);
        return true;
    }

    // Event Listeners para validación en tiempo real
    elements.nombre_ruta.addEventListener("input", validarNombreRuta);
    elements.tipo_ruta.addEventListener("change", validartipoRuta);
    elements.horario_llegada.addEventListener("change", validarHorarioLlegada);
    elements.horario_salida.addEventListener("change", validarHorarioSalida);
    elements.estatus_ruta.addEventListener("change", validarEstatusRuta);
    elements.punto_partida.addEventListener("input", validarPuntoPartida);
    elements.punto_destino.addEventListener("input", validarPuntoDestino);
    elements.trayectoria.addEventListener("input", validarTrayectoria);

    // Validación del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Ejecutamos todas las validaciones para que se marquen todos los errores
        const isNombreValid = validarNombreRuta();
        const isTipoValid = validartipoRuta();
        const isSalidaValid = validarHorarioSalida();
        const isLlegadaValid = validarHorarioLlegada();
        const isEstatusValid = validarEstatusRuta();
        const isPartidaValid = validarPuntoPartida();
        const isDestinoValid = validarPuntoDestino();
        const isTrayectoriaValid = validarTrayectoria();

        if (isNombreValid && isTipoValid && isSalidaValid && isLlegadaValid && isEstatusValid && isPartidaValid && isDestinoValid && isTrayectoriaValid) {
            enviarFormularioRuta(form);
        } else {
            AlertManager.warning('Atención', 'Por favor, corrige los errores en el formulario.');
        }
    });
}

async function enviarFormularioRuta(form) {
    try {
        // Bloquear el botón de submit para evitar doble clic
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';

        const formData = new FormData(form);
        const response = await fetch('ruta_actualizar', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error('Error en la comunicación con el servidor');

        const data = await response.json();

        if (data.exito || data.success) {
            AlertManager.success('Exito', data.mensaje || 'Ruta registrada correctamente.');

            // 1. Resetear el formulario
            form.reset();
            // 2. Cerrar el modal (usando el ID genérico que definiste)
            const modalElement = document.getElementById('modalGenerico');
            const bsModal = bootstrap.Modal.getInstance(modalElement);
            if (bsModal) bsModal.hide();

            // 3. Recargar DataTable específicamente
            if ($.fn.DataTable.isDataTable('#tabla_rutas')) {
                $('#tabla_rutas').DataTable().ajax.reload(null, false);
                // null, false permite recargar sin perder la página actual de la tabla
            } else {
                // Si por alguna razón la tabla no es DataTable, recarga la página
                window.location.reload();
            }

        } else {
            AlertManager.error('Error', data.mensaje || 'No se pudo registrar la ruta.');
        }

    } catch (error) {
        console.error('Error en el registro:', error);
        AlertManager.error('Error crítico', 'Ocurrió un fallo inesperado: ' + error.message);
    } finally {
        // Restaurar botón
        const btnSubmit = form.querySelector('button[type="submit"]');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fas fa-save"></i> Registrar';
    }
}