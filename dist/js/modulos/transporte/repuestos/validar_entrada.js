function inicializarValidacionesEntrada() {
    const form = document.getElementById('formEntradaRepuesto');
    if (!form) return;

    // Elementos del formulario
    const elements = {
        id_repuesto: form.querySelector('#id_repuesto'),
        cantidad: form.querySelector('#cantidad'),
        razon_movimiento: form.querySelector('#razon_movimiento')
    };

    // Helper functions
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

    // Validaciones específicas
    function validarIdRepuesto() {
        const field = elements.id_repuesto;
        const val = field.value.trim();

        if (!val) {
            showError(field, 'El repuesto es obligatorio');
            return false;
        }

        clearError(field);
        return true;
    };

    function validarCantidad() {
        const field = elements.cantidad;
        const val = field.value.trim();
        const regex = /^\d+$/;

        if (!val) {
            showError(field, "La cantidad es obligatoria");
            return false;
        }

        if (!regex.test(val)) {
            showError(field, "Solamente se pueden ingresar números positivos");
            return false;
        }

        if (val < 1) {
            showError(field, "La cantidad debe ser mayor a 0");
            return false;
        }

        // Si se desea un límite máximo (ej. 500):
        if (val > 1000) {
            showError(field, "La cantidad máxima de entrada es de 1000 unidades");
            return false;
        }

        clearError(field);
        return true;
    };

    function validarRazon() {
        const field = elements.razon_movimiento;
        let val = field.value.trim();
        const regex = /^[A-Za-zÀ-ÿ0-9\s]{2,100}$/;

        if (!val) {
            showError(field, "La razon de la entrada es obligatoria");
            return false;
        }

        if (!regex.test(val)) {
            showError(field, "La razon de la entrada solo puede contener letras y espacios");
            return false;
        }

        clearError(field);
        return true;
    };


    elements.cantidad.addEventListener('keypress', e => {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
    $(elements.id_repuesto).on('change', validarIdRepuesto);
    elements.razon_movimiento.addEventListener('input', validarRazon);
    elements.cantidad.addEventListener('input', validarCantidad);

    // Submit Handler
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Realizar todas las validaciones
        const RepuestoValido = validarIdRepuesto();
        const RazonValida = validarRazon();
        const CantidadValida = validarCantidad();

        const isValid = RepuestoValido && RazonValida && CantidadValida;

        if (!isValid) {
            AlertManager.warning('Atención', 'Corrige los errores para poder registrar la entrada');
            return;
        } else {
            enviarFormularioEntrada(form);
        }
    });
}

async function enviarFormularioEntrada(form) {
    try {
        // Bloquear el botón de submit para evitar doble clic
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

        const formData = new FormData(form);
        const response = await fetch('registrar_entrada_repuesto', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error('Error en la comunicación con el servidor');

        const data = await response.json();

        if (data.exito || data.success) {
            AlertManager.success('Exito', data.mensaje || 'Entrada registrada correctamente.');

            // 1. Resetear el formulario
            form.reset();
            // 2. Cerrar el modal (usando el ID genérico que definiste)
            const modalElement = document.getElementById('modalGenerico');
            const bsModal = bootstrap.Modal.getInstance(modalElement);
            if (bsModal) bsModal.hide();

            // 3. Recargar DataTable específicamente
            if ($.fn.DataTable.isDataTable('#tabla_repuestos')) {
                $('#tabla_repuestos').DataTable().ajax.reload(null, false);
                // null, false permite recargar sin perder la página actual de la tabla
            } else {
                // Si por alguna razón la tabla no es DataTable, recarga la página
                window.location.reload();
            }

        } else {
            AlertManager.error('Error', data.mensaje || 'No se pudo registrar la entrada.');
        }

    } catch (error) {
        console.error('Error en el registro:', error);
        AlertManager.error('Error crítico', 'Ocurrió un fallo inesperado: ' + error.message);
    } finally {
        // Restaurar botón
        const btnSubmit = form.querySelector('button[type="submit"]');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fas fa-save"></i> Registrar';
    }
}