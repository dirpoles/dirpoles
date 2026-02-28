document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-discapacidad')
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        tipo_discapacidad: document.getElementById('tipo_discapacidad'),
        disc_especifica: document.getElementById('disc_especifica'),
        diagnostico: document.getElementById('diagnostico'),
        grado: document.getElementById('grado'),
        medicamentos: document.getElementById('medicamentos'),
        habilidades_funcionales: document.getElementById('habilidades_funcionales'),
        requiere_asistencia: document.getElementById('requiere_asistencia'),
        dispositivo_asistencia: document.getElementById('dispositivo_asistencia'),
        carnet_discapacidad: document.getElementById('carnet_discapacidad'),
        observaciones: document.getElementById('observaciones'),
        recomendaciones: document.getElementById('recomendaciones'),
        limpiarFormulario: document.getElementById('limpiarFormularioDiscapacidad')
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

    function inicializarDataTableBeneficiarios() {
        $('#tablaBeneficiariosModal').DataTable({
            ajax: {
                url: 'beneficiarios_activos_data_json',
                dataSrc: 'data'
            },
            searching: true,
            pageLength: 10,
            language: {
                url: 'plugins/DataTables/js/languaje.json'
            },
            columns: [
                { data: 'cedula_completa' },
                { data: 'nombre_completo' },
                { data: 'nombre_pnf' },
                { data: 'seccion' },
                {
                    data: 'id_beneficiario',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-sm btn-primary btn-seleccionar-beneficiario" 
                                    data-id="${data}" 
                                    data-nombre="${row.nombre_completo}">
                                <i class="fas fa-check"></i> Seleccionar
                            </button>
                        `;
                    }
                }
            ],
            initComplete: function () {
                $(document).on('click', '.btn-seleccionar-beneficiario', function () {
                    const id = $(this).data('id');
                    const nombre = $(this).data('nombre');

                    elements.id_beneficiario.value = id;
                    // Actualizar también los inputs ocultos
                    $('.id_beneficiario_hidden').val(id);

                    elements.beneficiario_nombre.value = nombre;
                    clearError(elements.id_beneficiario);
                    clearError(elements.beneficiario_nombre);
                    toggleBotonEliminar();

                    $('#modalSeleccionarBeneficiario').modal('hide');
                    validarBeneficiario();
                });
            }
        });
    }

    function limpiarFormulario() {
        form.reset();

        // Limpiar campos de beneficiario manualmente y ocultar botón de eliminar
        elements.id_beneficiario.value = '';
        elements.beneficiario_nombre.value = '';
        $('.id_beneficiario_hidden').val('');
        toggleBotonEliminar();

        // Remover clases de validación y mensajes de error
        const fields = [
            elements.id_beneficiario,
            elements.beneficiario_nombre,
            elements.tipo_discapacidad,
            elements.disc_especifica,
            elements.diagnostico,
            elements.grado,
            elements.medicamentos,
            elements.habilidades_funcionales,
            elements.requiere_asistencia,
            elements.dispositivo_asistencia,
            elements.carnet_discapacidad,
            elements.observaciones,
            elements.recomendaciones
        ];

        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');

            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = "";
                errorElement.style.display = 'none';
            }

            if ($(field).hasClass('select2')) {
                $(field).next('.select2-container').find('.select2-selection')
                    .removeClass('is-invalid')
                    .removeClass('is-valid');
            }
        });
    }

    function validarBeneficiario() {
        const beneficiario_nombre = elements.beneficiario_nombre.value;

        if (beneficiario_nombre === "") {
            showError(elements.id_beneficiario, "El beneficiario es obligatorio");
            showError(elements.beneficiario_nombre, "El beneficiario es obligatorio");
            return false;
        }

        clearError(elements.id_beneficiario);
        clearError(elements.beneficiario_nombre);
        toggleBotonEliminar();
        return true;
    }

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

    function toggleBotonEliminar() {
        if (elements.id_beneficiario && elements.id_beneficiario.value && elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.style.display = 'block';
        } else if (elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.style.display = 'none';
        }
    }

    function setupEliminarButtons() {
        // Botón para eliminar beneficiario
        if (elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.addEventListener('click', function () {
                elements.id_beneficiario.value = '';
                // Limpiar también los inputs ocultos
                $('.id_beneficiario_hidden').val('');

                elements.beneficiario_nombre.value = '';
                clearError(elements.id_beneficiario);
                clearError(elements.beneficiario_nombre);
                toggleBotonEliminar();
                validarBeneficiario();
            });
        }
    }

    elements.limpiarFormulario.addEventListener('click', limpiarFormulario);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarBeneficiario(),
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
            AlertManager.error("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });

    setupEliminarButtons();
    inicializarDataTableBeneficiarios();

    // Inicializar estado de condicionales
    manejarCambioTipoDiscapacidad();
});