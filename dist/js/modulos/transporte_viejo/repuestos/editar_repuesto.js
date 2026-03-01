document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEditarRepuesto');
    if (!form) return;

    // Elementos del formulario
    const elements = {
        nombre_repuesto: form.querySelector('#nombre'),
        id_proveedor: form.querySelector('#id_proveedor'),
        descripcion: form.querySelector('#descripcion'),
        estatus_repuesto: form.querySelector('#estatus'),
    };

    // Helper functions
    const showError = (field, msg) => {
        // Buscar si ya existe un elemento de error
        let errorElement = document.getElementById(`${field.id}Error`);
        
        // Si no existe, crearlo
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = `${field.id}Error`;
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = msg;
        field.classList.add('is-invalid');
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('is-invalid');
    };

    // Validaciones específicas
    function validarIdProveedor() {
        const field = elements.id_proveedor;
        const val   = field.value.trim();

        if (!val) {
            showError(field, 'El proveedor es obligatorio');
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
        const regex = /^[A-Za-zÀ-ÿ0-9\s]{2,150}$/;
        
        if (!val) {
            showError(field, "La descripción es obligatoria");
            return false;
        }
        
        if (!regex.test(val)) {
            showError(field, "Solo letras, números y espacios, máximo 150 caracteres");
            return false;
        }
        
        clearError(field);
        return true;
    }

    function validarEstatus() {
        const field = elements.estatus_repuesto;
        const val   = field.value.trim();
        
        if (!val) {
            showError(field, 'Debes seleccionar un estatus');
            return false;
        }

        clearError(field);
        return true;
    }

    // Event Listeners para validación en tiempo real
    $(elements.id_proveedor).on('change', validarIdProveedor);
    elements.nombre_repuesto.addEventListener('input', validarNombreRepuesto);
    elements.estatus_repuesto.addEventListener('change', validarEstatus);
    elements.descripcion.addEventListener('input', validarDescripcion);

    // Submit Handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Realizar todas las validaciones
        const nombreValido = validarNombreRepuesto();
        const ProveedorValido = validarIdProveedor();
        const DescripcionValida = validarDescripcion();
        const EstatusValido = validarEstatus();
        
        const isValid = nombreValido && ProveedorValido && DescripcionValida && EstatusValido;
        
        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validación',
                text: 'Revise los campos resaltados',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Envío del formulario
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success === true) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: data.message,
                    confirmButtonColor: '#3085d6'
                });
                
                window.location.href = 'index.php?action=gestionar_transporte';

            } else {
                await Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: data.message,
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonColor: '#d33'
            });
        }
    });
});