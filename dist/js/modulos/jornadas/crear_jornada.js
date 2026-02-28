document.addEventListener('DOMContentLoaded', function () {
    form = document.getElementById('formulario-jornada');

    const elements = {
        nombre_jornada: document.getElementById('nombre_jornada'),
        tipo_jornada: document.getElementById('tipo_jornada'),
        ubicacion: document.getElementById('ubicacion'),
        aforo_maximo: document.getElementById('aforo_maximo'),
        fecha_inicio: document.getElementById('fecha_inicio'),
        fecha_fin: document.getElementById('fecha_fin'),
        fecha_inicio_date: document.getElementById('fecha_inicio_date'),
        fecha_inicio_time: document.getElementById('fecha_inicio_time'),
        fecha_fin_date: document.getElementById('fecha_fin_date'),
        fecha_fin_time: document.getElementById('fecha_fin_time'),
        descripcion: document.getElementById('descripcion'),
        limpiar_form: document.getElementById('limpiar_form')
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

    function limpiarFormulario() {
        form.reset();

        // Campos a limpiar clases (incluyendo el input de beneficiario)
        const fields = [
            elements.nombre_jornada,
            elements.tipo_jornada,
            elements.ubicacion,
            elements.aforo_maximo,
            elements.fecha_inicio,
            elements.fecha_fin,
            elements.descripcion
        ];

        fields.forEach(field => {
            if (!field) return;

            // Remover clases de validación de Bootstrap
            field.classList.remove('is-valid', 'is-invalid');

            // Limpiar mensaje de error y ocultarlo
            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = "";
                errorElement.style.display = 'none';
            }

            // Manejar clases específicas de Select2 si aplica
            if ($(field).hasClass('select2')) {
                $(field).next('.select2-container').find('.select2-selection')
                    .removeClass('is-invalid')
                    .removeClass('is-valid');
            }
        });
    }

    function syncHiddenDates() {
        const start = buildDateTime(elements.fecha_inicio_date.value, elements.fecha_inicio_time.value);
        const end = buildDateTime(elements.fecha_fin_date.value, elements.fecha_fin_time.value);

        elements.fecha_inicio.value = start.dbValue;
        elements.fecha_fin.value = end.dbValue;
    }

    function buildDateTime(dateStr, timeStr) {
        if (!dateStr || !timeStr) return { dateObj: null, dbValue: "" };
        const combined = `${dateStr}T${timeStr}`;
        const dateObj = new Date(combined);
        const dbValue = `${dateStr} ${timeStr}:00`;
        return { dateObj, dbValue };
    }

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

    function validarFechaInicio() {
        const dateVal = elements.fecha_inicio_date.value;
        const timeVal = elements.fecha_inicio_time.value;

        if (!dateVal || !timeVal) {
            showError(elements.fecha_inicio, "Debe ingresar fecha y hora de inicio");
            elements.fecha_inicio_date.classList.add("is-invalid");
            elements.fecha_inicio_time.classList.add("is-invalid");
            return false;
        }

        elements.fecha_inicio_date.classList.remove("is-invalid");
        elements.fecha_inicio_time.classList.remove("is-invalid");
        clearError(elements.fecha_inicio);
        clearError(elements.fecha_inicio_date);
        clearError(elements.fecha_inicio_time);
        return true;
    }

    function validarFechaFin() {
        const dateVal = elements.fecha_fin_date.value;
        const timeVal = elements.fecha_fin_time.value;

        if (!dateVal || !timeVal) {
            showError(elements.fecha_fin, "Debe ingresar fecha y hora de fin");
            elements.fecha_fin_date.classList.add("is-invalid");
            elements.fecha_fin_time.classList.add("is-invalid");
            return false;
        }

        // Validar que fin sea posterior a inicio
        const start = buildDateTime(elements.fecha_inicio_date.value, elements.fecha_inicio_time.value);
        const end = buildDateTime(dateVal, timeVal);

        if (start.dateObj && end.dateObj && end.dateObj <= start.dateObj) {
            showError(elements.fecha_fin, "La fecha de fin debe ser posterior a la de inicio");
            elements.fecha_fin_date.classList.add("is-invalid");
            elements.fecha_fin_time.classList.add("is-invalid");
            return false;
        }

        elements.fecha_fin_date.classList.remove("is-invalid");
        elements.fecha_fin_time.classList.remove("is-invalid");
        clearError(elements.fecha_fin);
        clearError(elements.fecha_fin_date);
        clearError(elements.fecha_fin_time);
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

    elements.nombre_jornada.addEventListener('input', validarNombreJornada);
    elements.tipo_jornada.addEventListener('input', validarTipoJornada);
    elements.ubicacion.addEventListener('input', validarUbicacion);
    elements.aforo_maximo.addEventListener('input', validarAforoMaximo);
    elements.descripcion.addEventListener('input', validarDescripcion);

    // Event listeners para validación en tiempo real y sincronización
    [elements.fecha_inicio_date, elements.fecha_inicio_time].forEach(el => {
        el.addEventListener('change', () => {
            syncHiddenDates();
            validarFechaInicio();
            if (elements.fecha_fin_date.value && elements.fecha_fin_time.value) {
                validarFechaFin();
            }
        });
    });

    [elements.fecha_fin_date, elements.fecha_fin_time].forEach(el => {
        el.addEventListener('change', () => {
            syncHiddenDates();
            validarFechaFin();
        });
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarNombreJornada(),
            validarTipoJornada(),
            validarUbicacion(),
            validarAforoMaximo(),
            validarFechaInicio(),
            validarFechaFin(),
            validarDescripcion()
        ]

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                AlertManager.close();

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Registro exitoso", data.mensaje).then(() => {
                            window.location.reload();
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
            AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });
});