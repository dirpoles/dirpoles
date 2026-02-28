document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-diagnostico-general')
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        id_patologia: document.getElementById('id_patologia'),
        diagnostico: document.getElementById('diagnostico'),
        observaciones_diagnostico: document.getElementById('observaciones_diagnostico'),
        tratamiento_gen: document.getElementById('tratamiento_gen'),
        limpiarFormulario: document.getElementById('limpiarFormulario')
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

        // Limpiar Select2
        $(elements.id_patologia).val(null).trigger('change');

        // Limpiar campos de beneficiario manualmente y ocultar botón de eliminar
        elements.id_beneficiario.value = '';
        elements.beneficiario_nombre.value = '';
        $('.id_beneficiario_hidden').val('');
        toggleBotonEliminar();

        // Remover clases de validación y mensajes de error
        const fields = [
            elements.id_beneficiario,
            elements.beneficiario_nombre,
            elements.id_patologia,
            elements.diagnostico,
            elements.observaciones_diagnostico,
            elements.tratamiento_gen
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

    function validarPatologia() {
        const patologia = elements.id_patologia.value;

        if (patologia === "") {
            showError(elements.id_patologia, "La patología es obligatoria");
            return false;
        }

        clearError(elements.id_patologia);
        return true;
    }

    function validarDiagnostico() {
        let diagnostico = elements.diagnostico.value;
        diagnostico = diagnostico.replace(/<[^>]*>?/gm, "");

        if (diagnostico === "") {
            showError(elements.diagnostico, "El diagnostico es obligatorio");
            return false;
        }

        if (/^\s|\s$/.test(diagnostico)) {
            showError(elements.diagnostico, "El diagnostico no puede comenzar ni terminar con espacios");
            return false;
        }

        if (diagnostico.length < 5) {
            showError(elements.diagnostico, "El diagnostico debe tener al menos 5 caracteres");
            return false;
        }

        if (diagnostico.length > 250) {
            showError(elements.diagnostico, "El diagnostico debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(diagnostico)) {
            showError(elements.diagnostico, "El diagnóstico solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.diagnostico);
        return true;
    }

    function validarObservacionesDiagnostico() {
        let observaciones = elements.observaciones_diagnostico.value;
        observaciones = observaciones.replace(/<[^>]*>?/gm, "");

        if (observaciones === "") {
            showError(elements.observaciones_diagnostico, "Las observaciones son obligatorias");
            return false;
        }

        if (/^\s|\s$/.test(observaciones)) {
            showError(elements.observaciones_diagnostico, "Las observaciones no pueden comenzar ni terminar con espacios");
            return false;
        }

        if (observaciones.length < 5) {
            showError(elements.observaciones_diagnostico, "Las observaciones debe tener al menos 5 caracteres");
            return false;
        }

        if (observaciones.length > 250) {
            showError(elements.observaciones_diagnostico, "Las observaciones deben tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(observaciones)) {
            showError(elements.observaciones_diagnostico, "Las observaciones solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.observaciones_diagnostico);
        return true;
    }

    function validarTratamiento() {
        let tratamiento_gen = elements.tratamiento_gen.value;
        tratamiento_gen = tratamiento_gen.replace(/<[^>]*>?/gm, "");

        if (tratamiento_gen === "") {
            showError(elements.tratamiento_gen, "El tratamiento es obligatorio");
            return false;
        }

        if (/^\s|\s$/.test(tratamiento_gen)) {
            showError(elements.tratamiento_gen, "El tratamiento no puede comenzar ni terminar con espacios");
            return false;
        }

        if (tratamiento_gen.length < 5) {
            showError(elements.tratamiento_gen, "El tratamiento debe tener al menos 5 caracteres");
            return false;
        }

        if (tratamiento_gen.length > 250) {
            showError(elements.tratamiento_gen, "El tratamiento debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(tratamiento_gen)) {
            showError(elements.tratamiento_gen, "El tratamiento solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.tratamiento_gen);
        return true;
    }

    //EventListener para tiempo real
    elements.id_beneficiario.addEventListener('input', validarBeneficiario);
    elements.id_patologia.addEventListener('change', validarPatologia);
    elements.diagnostico.addEventListener('input', validarDiagnostico);
    elements.observaciones_diagnostico.addEventListener('input', validarObservacionesDiagnostico);
    elements.tratamiento_gen.addEventListener('input', validarTratamiento);
    elements.limpiarFormulario.addEventListener('click', limpiarFormulario);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarPatologia(),
            validarBeneficiario(),
            validarDiagnostico(),
            validarObservacionesDiagnostico(),
            validarTratamiento()
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
});