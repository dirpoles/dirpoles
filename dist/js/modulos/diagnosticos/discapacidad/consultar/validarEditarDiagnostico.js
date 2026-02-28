/**
 * Inicializa las validaciones para el formulario de edición de un diagnostico
 * @param {number} id - ID del diagnostico que se está editando
 */
function validarEditarDiagnostico(id) {
    const form = document.getElementById('formEditarDiscapacidad')
    if (!form) return;

    const elements = {
        tipo_discapacidad: document.getElementById('editar_tipo_discapacidad'),
        disc_especifica: document.getElementById('editar_disc_especifica'),
        diagnostico: document.getElementById('editar_diagnostico'),
        grado: document.getElementById('editar_grado'),
        medicamentos: document.getElementById('editar_medicamentos'),
        habilidades_funcionales: document.getElementById('editar_habilidades_funcionales'),
        requiere_asistencia: document.getElementById('editar_requiere_asistencia'),
        dispositivo_asistencia: document.getElementById('editar_dispositivo_asistencia'),
        carnet_discapacidad: document.getElementById('editar_carnet_discapacidad'),
        observaciones: document.getElementById('editar_observaciones'),
        recomendaciones: document.getElementById('editar_recomendaciones'),
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

    // --- Funciones Genéricas de Validación ---

    /**
     * Valida un input de texto genérico
     * @param {HTMLElement} field - El elemento input o textarea
     * @param {number} minLength - Longitud mínima requerida
     * @param {number} maxLength - Longitud máxima permitida
     * @param {boolean} required - Si el campo es obligatorio
     * @returns {boolean} - true si es válido, false si no
     */
    const validarTexto = (field, minLength = 0, maxLength = 255, required = false) => {
        const value = field.value.trim();

        if (required && value === "") {
            showError(field, "Este campo es obligatorio");
            return false;
        }

        if (value.length > 0 && value.length < minLength) {
            showError(field, `Debe tener al menos ${minLength} caracteres`);
            return false;
        }

        if (value.length > maxLength) {
            showError(field, `No puede exceder los ${maxLength} caracteres`);
            return false;
        }

        // Validación anti-XSS básica: no permitir < >
        if (/[<>]/.test(value)) {
            showError(field, "No se permiten caracteres especiales como < o >");
            return false;
        }

        clearError(field);
        return true;
    };

    /**
     * Valida un elemento select
     * @param {HTMLElement} field - El elemento select
     * @param {boolean} required - Si es obligatorio seleccionar una opción (value != "")
     * @returns {boolean}
     */
    const validarSelect = (field, required = true) => {
        if (required && (field.value === "" || field.value === null)) {
            showError(field, "Seleccione una opción válida");
            return false;
        }
        clearError(field);
        return true;
    };

    // --- Validaciones Específicas usando las Genéricas ---

    const validarTipoDiscapacidad = () => validarSelect(elements.tipo_discapacidad, true);
    const validarDiscEspecifica = () => validarTexto(elements.disc_especifica, 3, 200, false);
    const validarDiagnostico = () => validarTexto(elements.diagnostico, 5, 255, true);
    const validarGrado = () => validarSelect(elements.grado, true);
    const validarMedicamentos = () => validarTexto(elements.medicamentos, 3, 255, false);
    const validarHabilidades = () => validarTexto(elements.habilidades_funcionales, 5, 255, true);
    const validarRequiereAsistencia = () => validarSelect(elements.requiere_asistencia, false); // No es required en HTML
    const validarDispositivo = () => validarTexto(elements.dispositivo_asistencia, 3, 255, false);

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
        if (numero.length > 20) { // Ajustado a 20 según maxlength del HTML, usuario dijo 10 pero input tiene 20
            showError(elements.carnet_discapacidad, "El carnet debe tener menos de 20 dígitos");
            return false;
        }

        clearError(elements.carnet_discapacidad);
        return true;
    }

    const validarObservaciones = () => validarTexto(elements.observaciones, 5, 500, true); // Textarea suele permitir más
    const validarRecomendaciones = () => validarTexto(elements.recomendaciones, 5, 500, false);

    // --- Lógica Condicional ---

    const manejarCambioTipoDiscapacidad = (e) => {
        const tipo = elements.tipo_discapacidad.value;

        if (tipo === "Otro") {
            elements.disc_especifica.readOnly = false;
            if (elements.disc_especifica.value === "No aplica") {
                elements.disc_especifica.value = "";
            }
        } else {
            elements.disc_especifica.readOnly = true;
            elements.disc_especifica.value = "No aplica";
            clearError(elements.disc_especifica);
        }

        // Solo validar si es disparado por un evento (usuario)
        if (e && e.type === 'change') {
            validarTipoDiscapacidad();
        }
    };


    // --- Event Listeners para Validación en Tiempo Real ---

    elements.tipo_discapacidad.addEventListener('change', manejarCambioTipoDiscapacidad);
    elements.disc_especifica.addEventListener('input', validarDiscEspecifica);
    elements.diagnostico.addEventListener('input', validarDiagnostico);
    elements.grado.addEventListener('change', validarGrado);
    elements.medicamentos.addEventListener('input', validarMedicamentos);
    elements.habilidades_funcionales.addEventListener('input', validarHabilidades);
    elements.requiere_asistencia.addEventListener('change', validarRequiereAsistencia);
    elements.dispositivo_asistencia.addEventListener('input', validarDispositivo);
    elements.carnet_discapacidad.addEventListener('input', validarCarnetDiscapacidad);
    elements.observaciones.addEventListener('input', validarObservaciones);
    elements.recomendaciones.addEventListener('input', validarRecomendaciones);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarTipoDiscapacidad(),
            validarDiscEspecifica(),
            validarDiagnostico(),
            validarGrado(),
            validarMedicamentos(),
            validarHabilidades(),
            validarRequiereAsistencia(),
            validarDispositivo(),
            validarCarnetDiscapacidad(),
            validarObservaciones(),
            validarRecomendaciones()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch('discapacidad_actualizar', {
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
                            if ($.fn.DataTable.isDataTable('#tabla_discapacidad')) {
                                $('#tabla_discapacidad').DataTable().ajax.reload(null, false);
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