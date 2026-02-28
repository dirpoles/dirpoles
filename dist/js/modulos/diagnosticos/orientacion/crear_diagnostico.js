document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-orientacion')
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        motivo_orientacion: document.getElementById('motivo_orientacion'),
        descripcion_orientacion: document.getElementById('descripcion_orientacion'),
        indicaciones_orientacion: document.getElementById('indicaciones_orientacion'),
        obs_adic_orientacion: document.getElementById('obs_adic_orientacion'),
        limpiarFormulario: document.getElementById('limpiarFormularioOrientacion')
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
            elements.motivo_orientacion,
            elements.descripcion_orientacion,
            elements.indicaciones_orientacion,
            elements.obs_adic_orientacion
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

    function validarMotivoOrientacion() {
        let motivo_orientacion = elements.motivo_orientacion.value;
        motivo_orientacion = motivo_orientacion.replace(/<[^>]*>?/gm, "");

        if (motivo_orientacion === "") {
            showError(elements.motivo_orientacion, "El motivo de orientación es obligatorio");
            return false;
        }

        if (/^\s|\s$/.test(motivo_orientacion)) {
            showError(elements.motivo_orientacion, "El motivo de orientación no puede comenzar ni terminar con espacios");
            return false;
        }

        if (motivo_orientacion.length < 5) {
            showError(elements.motivo_orientacion, "El motivo de orientación debe tener al menos 5 caracteres");
            return false;
        }

        if (motivo_orientacion.length > 250) {
            showError(elements.motivo_orientacion, "El motivo de orientación debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(motivo_orientacion)) {
            showError(elements.motivo_orientacion, "El motivo de orientación solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.motivo_orientacion);
        return true;
    }

    function validarDescripcionOrientacion() {
        let descripcion_orientacion = elements.descripcion_orientacion.value;
        descripcion_orientacion = descripcion_orientacion.replace(/<[^>]*>?/gm, "");

        if (descripcion_orientacion === "") {
            showError(elements.descripcion_orientacion, "La descripción de orientación es obligatoria");
            return false;
        }

        if (/^\s|\s$/.test(descripcion_orientacion)) {
            showError(elements.descripcion_orientacion, "La descripción de orientación no puede comenzar ni terminar con espacios");
            return false;
        }

        if (descripcion_orientacion.length < 5) {
            showError(elements.descripcion_orientacion, "La descripción de orientación debe tener al menos 5 caracteres");
            return false;
        }

        if (descripcion_orientacion.length > 250) {
            showError(elements.descripcion_orientacion, "La descripción de orientación debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(descripcion_orientacion)) {
            showError(elements.descripcion_orientacion, "La descripción de orientación solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.descripcion_orientacion);
        return true;
    }

    function validarIndicacionesOrientacion() {
        let indicaciones_orientacion = elements.indicaciones_orientacion.value;
        indicaciones_orientacion = indicaciones_orientacion.replace(/<[^>]*>?/gm, "");

        if (indicaciones_orientacion === "") {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación son obligatorias");
            return false;
        }

        if (/^\s|\s$/.test(indicaciones_orientacion)) {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación no pueden comenzar ni terminar con espacios");
            return false;
        }

        if (indicaciones_orientacion.length < 5) {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación debe tener al menos 5 caracteres");
            return false;
        }

        if (indicaciones_orientacion.length > 250) {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(indicaciones_orientacion)) {
            showError(elements.indicaciones_orientacion, "Las indicaciones de orientación solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.indicaciones_orientacion);
        return true;
    }

    function validarObservaciones() {
        let obs_adic_orientacion = elements.obs_adic_orientacion.value;
        obs_adic_orientacion = obs_adic_orientacion.replace(/<[^>]*>?/gm, "");

        if (obs_adic_orientacion === "") {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales son obligatorias");
            return false;
        }

        if (/^\s|\s$/.test(obs_adic_orientacion)) {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales no pueden comenzar ni terminar con espacios");
            return false;
        }

        if (obs_adic_orientacion.length < 5) {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales debe tener al menos 5 caracteres");
            return false;
        }

        if (obs_adic_orientacion.length > 250) {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales debe tener menos de 250 caracteres");
            return false;
        }

        // Validación de caracteres permitidos
        const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

        if (!regex.test(obs_adic_orientacion)) {
            showError(elements.obs_adic_orientacion, "Las observaciones adicionales solo puede contener letras, números, espacios, comas, puntos guiones y #");
            return false
        }

        clearError(elements.obs_adic_orientacion);
        return true;
    }

    //EventListener para tiempo real
    elements.id_beneficiario.addEventListener('input', validarBeneficiario);
    elements.motivo_orientacion.addEventListener('input', validarMotivoOrientacion);
    elements.descripcion_orientacion.addEventListener('input', validarDescripcionOrientacion);
    elements.indicaciones_orientacion.addEventListener('input', validarIndicacionesOrientacion);
    elements.obs_adic_orientacion.addEventListener('input', validarObservaciones);
    elements.limpiarFormulario.addEventListener('click', limpiarFormulario);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarBeneficiario(),
            validarMotivoOrientacion(),
            validarDescripcionOrientacion(),
            validarIndicacionesOrientacion(),
            validarObservaciones()
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