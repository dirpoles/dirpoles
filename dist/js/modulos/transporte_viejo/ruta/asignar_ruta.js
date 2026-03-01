document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAsignarRecursos');
    if (!form) return;

    // Elementos del formulario
    const elements = {
        id_ruta: form.querySelector('#id_ruta'),
        fecha_asignacion: form.querySelector('#fecha_asignacion'),
        id_vehiculo: form.querySelector('#id_vehiculo'),
        id_empleado: form.querySelector('#id_empleado'),
        estatus: form.querySelector('#estatus'),
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
    function validarIdRuta() {
        const field = elements.id_ruta;
        const val   = field.value.trim();

        if (!val) {
            showError(field, 'La ruta de la ruta es obligatoria');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarFechaAsignacion() {
        const field = elements.fecha_asignacion;
        const val   = field.value.trim();

        if (!val) {
            showError(field, 'La fecha es obligatoria');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarEmpleado() {
        const field = elements.id_empleado;
        const val   = field.value;

        if (!val) {
            showError(field, 'Debe seleccionar un chofer');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarVehiculo() {
        const field = elements.id_vehiculo;
        const val   = field.value.trim();
        
        if (!val) {
            showError(field, 'El vehiculo es obligatorio');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarEstatus() {
        const field = elements.estatus;
        const val   = field.value.trim();
        
        if (!val) {
            showError(field, 'Debes seleccionar un estatus');
            return false;
        }

        clearError(field);
        return true;
    }

    // Event Listeners para validación en tiempo real
    $(elements.id_ruta).on('change', validarIdRuta);
    elements.fecha_asignacion.addEventListener('change', validarFechaAsignacion);
    $(elements.id_vehiculo).on('change', validarVehiculo);
    $(elements.id_empleado).on('change', validarEmpleado);
    elements.estatus.addEventListener('change', validarEstatus);

    // Submit Handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Realizar todas las validaciones
        const RutaValida = validarIdRuta();
        const FechaValida =  validarFechaAsignacion();
        const VehiculoValido = validarVehiculo();
        const ChoferValido = validarEmpleado();
        const EstatusValido = validarEstatus();
        
        const isValid = RutaValida && FechaValida && VehiculoValido && ChoferValido && EstatusValido;
        
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