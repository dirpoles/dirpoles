document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-consulta-medica')
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        id_patologia: document.getElementById('id_patologia'),
        estatura: document.getElementById('estatura'),
        peso: document.getElementById('peso'),
        tipo_sangre: document.getElementById('tipo_sangre'),
        motivo_visita: document.getElementById('motivo_visita'),
        diagnostico: document.getElementById('diagnostico'),
        tratamiento: document.getElementById('tratamiento'),
        observaciones: document.getElementById('observaciones'),
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
                $(document).off('click', '.btn-seleccionar-beneficiario').on('click', '.btn-seleccionar-beneficiario', function () {
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
            elements.estatura,
            elements.peso,
            elements.tipo_sangre,
            elements.motivo_visita,
            elements.diagnostico,
            elements.tratamiento,
            elements.observaciones
        ];

        fields.forEach(field => {
            if (!field) return;
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

        if (patologia === null || patologia === "") {
            showError(elements.id_patologia, "La patología es obligatoria");
            return false;
        }

        clearError(elements.id_patologia);
        return true;
    }

    function validarEstatura() {
        const estatura = elements.estatura.value;
        if (estatura === "" || estatura <= 0) {
            showError(elements.estatura, "La estatura es obligatoria y debe ser mayor a 0");
            return false;
        }
        if (estatura > 3) {
            showError(elements.estatura, "Ingrese una estatura válida (metros)");
            return false;
        }
        clearError(elements.estatura);
        return true;
    }

    function validarPeso() {
        const peso = elements.peso.value;
        if (peso === "" || peso <= 0) {
            showError(elements.peso, "El peso es obligatorio y debe ser mayor a 0kg");
            return false;
        }
        if (peso > 200) {
            showError(elements.peso, "El peso debe ser menor a 200kg");
            return false;
        }
        clearError(elements.peso);
        return true;
    }

    function validarTipoSangre() {
        const tipo_sangre = elements.tipo_sangre.value;
        if (tipo_sangre === "") {
            showError(elements.tipo_sangre, "Seleccione el tipo de sangre");
            return false;
        }
        clearError(elements.tipo_sangre);
        return true;
    }

    function validarMotivoVisita() {
        let motivo = elements.motivo_visita.value.trim();
        if (motivo === "") {
            showError(elements.motivo_visita, "El motivo de visita es obligatorio");
            return false;
        }
        if (motivo.length < 5) {
            showError(elements.motivo_visita, "El motivo debe tener al menos 5 caracteres");
            return false;
        }
        clearError(elements.motivo_visita);
        return true;
    }

    function validarDiagnostico() {
        let diagnostico = elements.diagnostico.value.trim();
        if (diagnostico === "") {
            showError(elements.diagnostico, "El diagnóstico es obligatorio");
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
        let tratamiento = elements.tratamiento.value.trim();
        if (tratamiento === "") {
            showError(elements.tratamiento, "El tratamiento es obligatorio");
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
        let observaciones = elements.observaciones.value.trim();
        if (observaciones === "") {
            showError(elements.observaciones, "Las observaciones son obligatorias");
            return false;
        }
        clearError(elements.observaciones);
        return true;
    }

    function validarInsumos() {
        // Obtenemos todos los selects de insumos
        const selects = document.querySelectorAll('.select2-insumo');
        let isValid = true;

        selects.forEach(select => {
            if (!select.value) {
                isValid = false;
                select.classList.add('is-invalid');
            } else {
                select.classList.remove('is-invalid');
            }
        });

        const inputs = document.querySelectorAll('.input-cantidad');
        inputs.forEach(input => {
            const val = parseInt(input.value);
            const max = parseInt(input.max);

            if (!val || val <= 0 || val > max) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // EventListeners para tiempo real
    $(elements.id_patologia).on('change', function () {
        clearError(elements.id_patologia);
        validarPatologia();
    });
    elements.estatura.addEventListener('input', validarEstatura);
    elements.peso.addEventListener('input', validarPeso);
    elements.tipo_sangre.addEventListener('change', validarTipoSangre);
    elements.motivo_visita.addEventListener('input', validarMotivoVisita);
    elements.diagnostico.addEventListener('input', validarDiagnostico);
    elements.tratamiento.addEventListener('input', validarTratamiento);
    elements.observaciones.addEventListener('input', validarObservaciones);
    elements.limpiarFormulario.addEventListener('click', limpiarFormulario);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarBeneficiario(),
            validarPatologia(),
            validarEstatura(),
            validarPeso(),
            validarTipoSangre(),
            validarMotivoVisita(),
            validarDiagnostico(),
            validarTratamiento(),
            validarObservaciones(),
            validarInsumos()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.exito) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        text: data.mensaje || 'Consulta médica registrada correctamente',
                        showConfirmButton: true
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.mensaje || 'No se pudo registrar la consulta'
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error inesperado al procesar la solicitud'
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Formulario incompleto',
                text: 'Por favor, rellene todos los campos obligatorios correctamente'
            });
        }
    });

    setupEliminarButtons();
    inicializarDataTableBeneficiarios();
});
