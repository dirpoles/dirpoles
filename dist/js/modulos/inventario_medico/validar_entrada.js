window.inicializarValidacionEntrada = function () {
    const form = document.getElementById('formRegistrarEntrada');
    if (!form) return;

    const elements = {
        id_insumo: document.getElementById('id_insumo_entrada'),
        cantidad: document.getElementById('cantidad_entrada'),
        descripcion: document.getElementById('descripcion_entrada'),
    };

    // Helper to Add/Remove Error Styling
    const showError = (element, message) => {
        // Check if error message container exists, if not create it (for dynamic elements sometimes helpful, but we usually have it in HTML)
        // In the HTML string in consultar_inventario.js, we didn't add the <div class="invalid-feedback"> or similar containers.
        // We should probably add them in the HTML generation or handle it here.
        // The example used `document.getElementById(`${field.id}Error`)`. I need to ensure the HTML string includes these IDs.

        let errorId = `${element.id}Error`;
        let errorElement = document.getElementById(errorId);

        if (!errorElement) {
            // Create dynamically if missing (since we control the HTML string in JS)
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'form-text text-danger';
            element.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        element.classList.add('is-invalid');
        element.classList.remove('is-valid');

        // Handle Select2
        if ($(element).hasClass('select2-hidden-accessible')) {
            $(element).next('.select2-container').find('.select2-selection').addClass('is-invalid').removeClass('is-valid');
        }
    };

    const clearError = (element) => {
        let errorId = `${element.id}Error`;
        let errorElement = document.getElementById(errorId);

        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }

        element.classList.remove('is-invalid');
        element.classList.add('is-valid');

        // Handle Select2
        if ($(element).hasClass('select2-hidden-accessible')) {
            $(element).next('.select2-container').find('.select2-selection').removeClass('is-invalid').addClass('is-valid');
        }
    };

    // Validations
    function validarInsumo() {
        const value = $(elements.id_insumo).val(); // Select2 value
        if (!value) {
            showError(elements.id_insumo, "Debe seleccionar un insumo");
            return false;
        }
        clearError(elements.id_insumo);
        return true;
    }

    function validarCantidad() {
        const value = elements.cantidad.value;
        if (value === "") {
            showError(elements.cantidad, "La cantidad es obligatoria");
            return false;
        }
        const num = parseInt(value);
        if (isNaN(num) || num < 1) {
            showError(elements.cantidad, "La cantidad debe ser mayor a 0");
            return false;
        }
        if (num > 500) {
            showError(elements.cantidad, "La cantidad máxima permitida es 500");
            return false;
        }
        clearError(elements.cantidad);
        return true;
    }

    function validarDescripcion() {
        const value = elements.descripcion.value.trim();
        if (value === "") {
            showError(elements.descripcion, "La descripción es obligatoria");
            return false;
        }
        if (value.length > 50) {
            showError(elements.descripcion, "La descripción no puede superar los 50 caracteres");
            return false;
        }
        clearError(elements.descripcion);
        return true;
    }

    // Event Listeners
    $(elements.id_insumo).on('change', validarInsumo);
    elements.cantidad.addEventListener('input', validarCantidad);
    elements.descripcion.addEventListener('input', validarDescripcion);

    // Form Submit
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarInsumo(),
            validarCantidad(),
            validarDescripcion()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                // Add id_insumo manually if FormData misses it due to Select2 quirks (usually works, but safe to check)
                if (!formData.has('id_insumo')) {
                    formData.append('id_insumo', $(elements.id_insumo).val());
                }

                const response = await fetch('procesar_entrada_inventario', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.exito) {
                    if (typeof AlertManager !== 'undefined') {
                        AlertManager.success('Entrada Registrada', data.mensaje).then(() => {
                            const modalEl = document.getElementById('modalGenerico');
                            const modalInstance = bootstrap.Modal.getInstance(modalEl);
                            if (modalInstance) modalInstance.hide();

                            if ($.fn.DataTable.isDataTable('#tabla_insumos')) {
                                $('#tabla_insumos').DataTable().ajax.reload();
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Entrada Registrada',
                            text: data.mensaje,
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            const modalEl = document.getElementById('modalGenerico');
                            const modalInstance = bootstrap.Modal.getInstance(modalEl);
                            if (modalInstance) modalInstance.hide();
                            if ($.fn.DataTable.isDataTable('#tabla_insumos')) {
                                $('#tabla_insumos').DataTable().ajax.reload();
                            }
                        });
                    }
                } else {
                    Swal.fire('Error', data.mensaje, 'error');
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
                text: 'Por favor, revise los errores en el formulario'
            });
        }
    });

    console.log("Validación de entrada inicializada.");
};
