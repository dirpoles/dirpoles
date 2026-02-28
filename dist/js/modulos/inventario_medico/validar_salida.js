
window.inicializarValidacionSalida = function () {
    const form = document.getElementById('formRegistrarSalida');
    if (!form) return;

    const elements = {
        id_insumo: document.getElementById('id_insumo_salida'),
        cantidad: document.getElementById('cantidad_salida'),
        motivo: document.getElementById('motivo_salida'),
        descripcion: document.getElementById('descripcion_salida'),
    };

    // Helper to Add/Remove Error Styling - Duplicate from validar_entrada (could be shared Util but keeping isolated for now as requested)
    const showError = (element, message) => {
        let errorId = `${element.id}Error`;
        let errorElement = document.getElementById(errorId);

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'form-text text-danger';
            element.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        element.classList.add('is-invalid');
        element.classList.remove('is-valid');

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

        if ($(element).hasClass('select2-hidden-accessible')) {
            $(element).next('.select2-container').find('.select2-selection').removeClass('is-invalid').addClass('is-valid');
        }
    };

    // Validations
    function validarInsumo() {
        const value = $(elements.id_insumo).val();
        if (!value) {
            showError(elements.id_insumo, "Debe seleccionar un insumo");
            return false;
        }
        clearError(elements.id_insumo);
        return true;
    }

    function validarMotivo() {
        const value = elements.motivo.value;
        if (!value) {
            showError(elements.motivo, "Debe seleccionar un motivo");
            return false;
        }
        clearError(elements.motivo);
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
        // Max validation depends on stock, usually handled by checking data attribute or server response, 
        // but for now we trust the user won't exceed what they see in the picker (or handled by backend error)
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
    elements.motivo.addEventListener('change', validarMotivo);
    elements.descripcion.addEventListener('input', validarDescripcion);

    // Form Submit
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarInsumo(),
            validarCantidad(),
            validarMotivo(),
            validarDescripcion()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                if (!formData.has('id_insumo')) {
                    formData.append('id_insumo', $(elements.id_insumo).val());
                }

                const response = await fetch('procesar_salida_inventario', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.exito) {
                    if (typeof AlertManager !== 'undefined') {
                        AlertManager.success('Salida Registrada', data.mensaje).then(() => {
                            const modalEl = document.getElementById('modalGenerico');
                            const modalInstance = bootstrap.Modal.getInstance(modalEl);
                            if (modalInstance) modalInstance.hide();

                            if ($.fn.DataTable.isDataTable('#tabla_insumos')) {
                                $('#tabla_insumos').DataTable().ajax.reload();
                            }
                        });
                    } else {
                        // Fallback
                        Swal.fire({
                            icon: 'success',
                            title: 'Salida Registrada',
                            text: data.mensaje,
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            const modalEl = document.getElementById('modalGenerico');
                            const modalInstance = bootstrap.Modal.getInstance(modalEl);
                            if (modalInstance) modalInstance.hide();
                            $('#tabla_insumos').DataTable().ajax.reload();
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
};
