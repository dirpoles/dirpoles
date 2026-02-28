document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-exoneracion');
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        motivo: document.getElementById('motivo'),
        carnet_discapacidad: document.getElementById('carnet_discapacidad'),
        carta: document.getElementById('carta'),
        limpiarFormularioEx: document.getElementById('limpiarFormularioEx')
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
                                    data-genero="${row.genero}" 
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
                    const genero = $(this).data('genero');

                    elements.id_beneficiario.value = id;
                    // Actualizar también los inputs ocultos
                    $('.id_beneficiario_hidden').val(id);
                    $('.id_beneficiario_genero').val(genero);

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
            elements.motivo,
            elements.carnet_discapacidad,
            elements.direccion_carta
        ];

        fields.forEach(field => {
            if (!field) return; // seguridad

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

        // Limpiar radios aparte
        const radios = document.querySelectorAll('input[name="es_discapacitado"]');
        radios.forEach(radio => {
            radio.checked = false;
            radio.classList.remove('is-valid', 'is-invalid');
        });
        document.getElementById("es_discapacitadoError").textContent = "";
        document.getElementById("es_discapacitadoError").style.display = "none";

        // Ocultar condicionales
        document.getElementById("div_carnet_discapacidad").style.display = "none";
        document.getElementById("div_estudio_socioeconomico").style.display = "none";
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

    function validarMotivo() {
        const motivo = elements.motivo.value;

        if (motivo === "") {
            showError(elements.motivo, "El motivo es obligatorio");
            return false;
        }

        clearError(elements.motivo);
        return true;
    }

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
        if (numero.length > 10) {
            showError(elements.carnet_discapacidad, "El carnet debe tener menos de 10 dígitos");
            return false;
        }

        clearError(elements.carnet_discapacidad);
        return true;
    }

    function validarCarta() {
        const input = elements.carta;
        const files = input.files;

        // Validar que haya archivo
        if (!files || files.length === 0) {
            showError(input, "Debe seleccionar una carta en PDF");
            return false;
        }

        const file = files[0];

        // Validar tipo MIME
        if (file.type !== "application/pdf") {
            showError(input, "La carta debe ser un archivo PDF");
            return false;
        }

        // Validar extensión
        const extension = file.name.split(".").pop().toLowerCase();
        if (extension !== "pdf") {
            showError(input, "La carta debe tener extensión .pdf");
            return false;
        }

        // Validar tamaño (ejemplo: máximo 5 MB)
        const maxSize = 5 * 1024 * 1024; // 5 MB en bytes
        if (file.size > maxSize) {
            showError(input, "La carta no debe superar los 5 MB");
            return false;
        }

        clearError(input);
        return true;
    }

    // Validación del campo "Otro Motivo"
    function validarOtroMotivo() {
        const input = document.getElementById("otro_motivo");
        const valor = input.value.trim();

        // Si está oculto, no validamos
        if (input.closest(".row").style.display === "none") {
            clearError(input);
            return true;
        }

        if (valor === "") {
            showError(input, "Debe ingresar un motivo");
            return false;
        }

        // Validación básica de texto: solo letras, números, espacios y signos comunes
        const regex = /^[a-zA-ZÀ-ÿ0-9\s.,;:()¡!¿?'"-]+$/;
        if (!regex.test(valor)) {
            showError(input, "El motivo contiene caracteres inválidos");
            return false;
        }

        clearError(input);
        return true;
    }


    elements.id_beneficiario.addEventListener('change', validarBeneficiario);
    elements.motivo.addEventListener('change', validarMotivo);
    elements.carnet_discapacidad.addEventListener('input', validarCarnetDiscapacidad);
    elements.carta.addEventListener('change', validarCarta);
    elements.limpiarFormularioEx.addEventListener('click', limpiarFormulario);

    document.getElementById("motivo").addEventListener("change", function (e) {
        const otroDiv = document.querySelector("#otro_motivo").closest(".row");
        const otroInput = document.getElementById("otro_motivo");

        if (e.target.value === "Otro") {
            // Mostrar campo
            otroDiv.style.display = "block";
            otroInput.setAttribute("required", "true");
        } else {
            // Ocultar campo y limpiar
            otroDiv.style.display = "none";
            otroInput.removeAttribute("required");
            otroInput.value = "";
            clearError(otroInput);
        }
    });
    // Listener en tiempo real para validar mientras escribe
    document.getElementById("otro_motivo").addEventListener("input", validarOtroMotivo);



    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarBeneficiario(),
            validarMotivo(),
            validarCarnetDiscapacidad(),
            validarCarta()
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
            AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });

    setupEliminarButtons();
    inicializarDataTableBeneficiarios();
});