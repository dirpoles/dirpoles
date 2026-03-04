function inicializarValidacionesRepuesto() {
    const form = document.getElementById("formCrearRepuesto");
    if (!form) return;

    // Elementos del formulario
    const elements = {
        nombre_repuesto: form.querySelector("#nombre_repuesto"),
        id_proveedor: form.querySelector("#id_proveedor"),
        descripcion: form.querySelector("#descripcion"),
        fecha_creacion: form.querySelector("#fecha_creacion"),
        estatus_repuesto: form.querySelector("#estatus_repuesto"),
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
    function validarIdProveedor() {
        const field = elements.id_proveedor;
        const val = field.value.trim();

        if (!val) {
            showError(field, "El proveedor es obligatorio");
            return false;
        }

        clearError(field);
        return true;
    }

    function validarFecha() {
        const field = elements.fecha_creacion;
        const val = field.value.trim();

        if (!val) {
            showError(field, "La fecha es obligatoria");
            return false;
        }

        clearError(field);
        return true;
    }

    function validarNombreRepuesto() {
        const field = elements.nombre_repuesto;
        const val = field.value.trim();
        const regex = /^[A-Za-zÀ-ÿ0-9\s]{2,50}$/;

        if (!val) {
            showError(field, "El nombre es obligatorio");
            return false;
        }

        if (!regex.test(val)) {
            showError(field, "Solo letras, números y espacios, máximo 50 caracteres");
            return false;
        }

        clearError(field);
        return true;
    }

    function validarDescripcion() {
        const field = elements.descripcion;
        const val = field.value.trim();
        const regex = /^[A-Za-zÀ-ÿ0-9\s]{2,50}$/;

        if (!val) {
            showError(field, "La descripción es obligatoria");
            return false;
        }

        if (!regex.test(val)) {
            showError(
                field,
                "Solo letras, números y espacios, máximo 150 caracteres"
            );
            return false;
        }

        clearError(field);
        return true;
    }

    function validarEstatus() {
        const field = elements.estatus_repuesto;
        const val = field.value.trim();

        if (!val) {
            showError(field, "Debes seleccionar un estatus");
            return false;
        }

        clearError(field);
        return true;
    }

    // Event Listeners para validación en tiempo real
    $(elements.id_proveedor).on("change", validarIdProveedor);
    elements.nombre_repuesto.addEventListener("input", validarNombreRepuesto);
    elements.estatus_repuesto.addEventListener("change", validarEstatus);
    elements.descripcion.addEventListener("input", validarDescripcion);
    elements.fecha_creacion.addEventListener("change", validarFecha);

    // Submit Handler
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Realizar todas las validaciones
        const nombreValido = validarNombreRepuesto();
        const FechaValida = validarFecha();
        const ProveedorValido = validarIdProveedor();
        const DescripcionValida = validarDescripcion();
        const EstatusValido = validarEstatus();

        if (nombreValido && FechaValida && ProveedorValido && DescripcionValida && EstatusValido) {
            enviarFormularioRepuesto(form);
        } else {
            AlertManager.warning('Atención', 'Por favor, corrige los errores en el formulario');
        }
    });
}

async function enviarFormularioRepuesto(form) {
    try {
        // Bloquear el botón de submit para evitar doble clic
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

        const formData = new FormData(form);
        const response = await fetch('repuesto_registrar', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error('Error en la comunicación con el servidor');

        const data = await response.json();

        if (data.exito || data.success) {
            AlertManager.success('Exito', data.mensaje || 'Repuesto registrado correctamente.');

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
            AlertManager.error('Error', data.mensaje || 'No se pudo registrar el repuesto.');
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
