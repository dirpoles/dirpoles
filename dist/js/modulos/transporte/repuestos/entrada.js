document.addEventListener('DOMContentLoaded', function() {
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
    function validarIdRepuesto() {
        const field = elements.id_repuesto;
        const val   = field.value.trim();

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

        if(val < 1) {
            showError(field, "La cantidad debe ser mayor a 0");
            return false;
        }

        if(val > 1000){
            showError(field, "La cantidad minima de entrada es de 1000 unidades");
            return false;
        }
        
        clearError(field);
        return true;
    };

    function validarRazon(){
        const field = elements.razon_movimiento;
        let val = field.value.trim();
        const regex = /^[A-Za-zÀ-ÿ\s]{2,50}$/;

        if(!val){
            showError(field, "La razon de la entrada es obligatoria");
            return false;
        }

        if(!regex.test(val)){
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
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Realizar todas las validaciones
        const RepuestoValido = validarIdRepuesto();
        const RazonValida =  validarRazon();
        const CantidadValida = validarCantidad();
        
        const isValid = RepuestoValido && RazonValida && CantidadValida;
        
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
                
                form.reset();
                window.location.reload(true);
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