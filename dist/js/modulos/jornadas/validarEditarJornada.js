/**
 * Inicializa las validaciones para el formulario de edición de una jornada médica
 * @param {number} id - ID de la jornada médica que se esta editando
 */

function validarEditarJornada(id) {
    const form = document.getElementById('formEditarJornada');
    if (!form) {
        return;
    }

    const elements = {
        nombre_jornada: document.getElementById('editar_nombre_jornada'),
        tipo_jornada: document.getElementById('editar_tipo_jornada'),
        ubicacion: document.getElementById('editar_ubicacion'),
        aforo_maximo: document.getElementById('editar_aforo_maximo'),
        fecha_inicio: document.getElementById('editar_fecha_inicio'),
        fecha_fin: document.getElementById('editar_fecha_fin'),
        descripcion: document.getElementById('editar_descripcion'),
        estatus: document.getElementById('editar_estatus')
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

    function validarNombreJornada() {
        const nombre_jornada = elements.nombre_jornada.value.trim();
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (nombre_jornada === "") {
            showError(elements.nombre_jornada, "El nombre de la jornada es obligatorio");
            return false;
        }

        if (nombre_jornada.length < 5) {
            showError(elements.nombre_jornada, "El nombre de la jornada debe tener al menos 5 caracteres");
            return false;
        }

        if (nombre_jornada.length > 100) {
            showError(elements.nombre_jornada, "El nombre de la jornada no debe exceder los 100 caracteres");
            return false;
        }

        if (!regex.test(nombre_jornada)) {
            showError(elements.nombre_jornada, "El nombre de la jornada solo puede contener letras y espacios");
            return false;
        }
        clearError(elements.nombre_jornada);
        return true;
    }

    function validarTipoJornada() {
        const tipo_jornada = elements.tipo_jornada.value.trim();
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (tipo_jornada === "") {
            showError(elements.tipo_jornada, "El tipo de jornada es obligatorio");
            return false;
        }

        if (tipo_jornada.length < 5) {
            showError(elements.tipo_jornada, "El tipo de jornada debe tener al menos 5 caracteres");
            return false;
        }

        if (tipo_jornada.length > 100) {
            showError(elements.tipo_jornada, "El tipo de jornada no debe exceder los 100 caracteres");
            return false;
        }

        if (!regex.test(tipo_jornada)) {
            showError(elements.tipo_jornada, "El tipo de jornada solo puede contener letras y espacios");
            return false;
        }
        clearError(elements.tipo_jornada);
        return true;
    }

    function validarUbicacion() {
        const ubicacion = elements.ubicacion.value.trim();
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,#-]+$/;

        if (ubicacion === "") {
            showError(elements.ubicacion, "La ubicacion es obligatoria");
            return false;
        }

        if (ubicacion.length < 5) {
            showError(elements.ubicacion, "La ubicacion debe tener al menos 5 caracteres");
            return false;
        }

        if (ubicacion.length > 100) {
            showError(elements.ubicacion, "La ubicacion no debe exceder los 100 caracteres");
            return false;
        }

        if (!regex.test(ubicacion)) {
            showError(elements.ubicacion, "La ubicacion solo puede contener letras, numeros, espacios y simbolos . , # -");
            return false;
        }
        clearError(elements.ubicacion);
        return true;
    }

    function validarAforoMaximo() {
        const aforo_maximo = elements.aforo_maximo.value.trim();
        const regex = /^[0-9]+$/;
        const valorAforo = parseInt(elements.aforo_maximo.value);

        if (aforo_maximo === "") {
            showError(elements.aforo_maximo, "El aforo maximo es obligatorio");
            return false;
        }

        if (aforo_maximo.length < 1) {
            showError(elements.aforo_maximo, "El aforo maximo debe tener al menos 1 digito");
            return false;
        }

        if (valorAforo > 500) {
            showError(elements.aforo_maximo, "El aforo maximo no debe exceder las 500 personas");
            return false;
        }

        if (!regex.test(aforo_maximo)) {
            showError(elements.aforo_maximo, "El aforo maximo solo puede contener numeros");
            return false;
        }
        clearError(elements.aforo_maximo);
        return true;
    }

    function validarDescripcion() {
        const descripcion = elements.descripcion.value.trim();

        if (descripcion === "") {
            showError(elements.descripcion, "La descripcion es obligatoria");
            return false;
        }
        clearError(elements.descripcion);
        return true;
    }


    function validarFechaInicio() {
        const fechaInicioVal = elements.fecha_inicio.value;
        const fechaFinVal = elements.fecha_fin.value;

        if (!fechaInicioVal) {
            showError(elements.fecha_inicio, "La fecha de inicio es obligatoria");
            return false;
        }

        const fechaInicio = new Date(fechaInicioVal);
        const fechaFin = new Date(fechaFinVal);
        const ahora = new Date();

        // Optional: Validate not too far in the past? 
        // For editing, we might want to allow past dates if the event already started/ended.
        // But if it's strictly for future events, we could add:
        // if (fechaInicio < ahora) ... (Skipping for now unless requested)

        if (isNaN(fechaInicio.getTime())) {
            showError(elements.fecha_inicio, "Fecha de inicio inválida");
            return false;
        }

        // Cross-validation: Start date must be before End date
        if (fechaFinVal && !isNaN(fechaFin.getTime())) {
            if (fechaInicio >= fechaFin) {
                showError(elements.fecha_inicio, "La fecha de inicio debe ser anterior a la fecha de fin");
                return false;
            } else {
                // Clear error on end date if it was complaining about order
                if (elements.fecha_fin.classList.contains('is-invalid')) {
                    validarFechaFin(); // Re-validate end date to clear its error if fixed
                }
            }
        }

        clearError(elements.fecha_inicio);
        return true;
    }

    function validarFechaFin() {
        const fechaInicioVal = elements.fecha_inicio.value;
        const fechaFinVal = elements.fecha_fin.value;

        if (!fechaFinVal) {
            showError(elements.fecha_fin, "La fecha de fin es obligatoria");
            return false;
        }

        const fechaInicio = new Date(fechaInicioVal);
        const fechaFin = new Date(fechaFinVal);

        if (isNaN(fechaFin.getTime())) {
            showError(elements.fecha_fin, "Fecha de fin inválida");
            return false;
        }

        // Cross-validation: End date must be after Start date
        if (fechaInicioVal && !isNaN(fechaInicio.getTime())) {
            if (fechaFin <= fechaInicio) {
                showError(elements.fecha_fin, "La fecha de fin debe ser posterior a la fecha de inicio");
                return false;
            }
        }

        clearError(elements.fecha_fin);
        return true;
    }

    elements.nombre_jornada.addEventListener('input', validarNombreJornada);
    elements.tipo_jornada.addEventListener('input', validarTipoJornada);
    elements.ubicacion.addEventListener('input', validarUbicacion);
    elements.aforo_maximo.addEventListener('input', validarAforoMaximo);
    elements.descripcion.addEventListener('input', validarDescripcion);
    elements.fecha_inicio.addEventListener('input', validarFechaInicio);
    elements.fecha_fin.addEventListener('input', validarFechaFin);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarNombreJornada(),
            validarTipoJornada(),
            validarUbicacion(),
            validarAforoMaximo(),
            validarDescripcion(),
            validarFechaInicio(),
            validarFechaFin()
        ];

        if (validaciones.every(v => v === true)) {
            // Disable button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Guardando...';
            }

            try {
                const formData = new FormData(form);
                const fechaInicioIso = formData.get('fecha_inicio');
                const fechaFinIso = formData.get('fecha_fin');

                if (fechaInicioIso) formData.set('fecha_inicio', fechaInicioIso.replace('T', ' '));
                if (fechaFinIso) formData.set('fecha_fin', fechaFinIso.replace('T', ' '));

                const response = await fetch('actualizar_jornada', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Edición exitosa", data.mensaje).then(() => {
                            $('#modalJornada').modal('hide');

                            // Recargar DataTable
                            if ($.fn.DataTable.isDataTable('#tabla_jornadas')) {
                                $('#tabla_jornadas').DataTable().ajax.reload(null, false);
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
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-save me-1"></i> Guardar Cambios';
                }
            }
        } else {
            AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });
}
