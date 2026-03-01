document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formCrearVehiculo');
    if (!form) return;

    // Elementos clave del formulario
    const elements = {
        placa: document.getElementById('placa'),
        modelo: document.getElementById('modelo'),
        tipo: document.getElementById('tipo'),
        fecha_adquisicion: document.getElementById('fecha_adquisicion'),
        estado: document.getElementById('estado')
    };

    // Helper functions para mostrar y limpiar errores
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

    function validarPlaca(){
        const placa = elements.placa.value.trim().toUpperCase();
        elements.placa.value = placa; // Mantener en mayúsculas
        const placaRegex = /^[A-Z0-9]{7}$/;

        if(!placa){
            showError(elements.placa, 'La placa es requerida.');
            return false;
        }

        if (placa.length !== 7) {
            showError(elements.placa, 'La placa debe tener exactamente 7 caracteres.');
            return false;
        }

        if (!placaRegex.test(placa)) {
            showError(elements.placa, 'Solo mayúsculas y números permitidos (ej: ABC1234)');
            return false;
        }

        return new Promise((resolve) => {
            fetch("index.php?action=vehiculos_validar_placa", {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `placa=${placa}`
            })
            .then((response) => response.json())
            .then(data => {
                if(data.existe){
                    showError(elements.placa, 'La placa ya esta registrada.');
                    resolve(false);
                }else{
                    clearError(elements.placa);
                    resolve(true);
                }
            })
            .catch(() => {
                showError(elements.placa, 'Error al validar la placa.');
                resolve(false);
            });
        });
    }

    function validarModelo(){
        const modelo = elements.modelo.value.trim();
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d\-\.,:;]+$/;

        if(!modelo){
            showError(elements.modelo, 'Este campo es obligatorio.');
            return false;
        }

        if (!regex.test(modelo)) {
            showError(elements.modelo, 'Caracteres no permitidos');
            return false;
        }

        if (modelo.length > 50) {
            showError(elements.modelo, 'El modelo no puede exceder 50 caracteres');
            return false;
        }

        clearError(elements.modelo);
        return true;
    }

    function validarTipo(){
        const tipo = elements.tipo.value.trim();

        if (!tipo) {
            showError(elements.tipo, 'Este campo es obligatorio');
            return false;
        }

        clearError(elements.tipo);
        return true;
    }

    function validarFechaAdquisicion(){
        const fecha_adquisicion = elements.fecha_adquisicion.value;
        const fecha = new Date(fecha_adquisicion);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if(!fecha_adquisicion){
            showError(elements.fecha_adquisicion, 'Este campo es obligatorio');
            return false;
        }

        if(fecha > hoy){
            showError(elements.fecha_adquisicion, 'La fecha de adquisición no puede ser mayor a la fecha actual');
            return false;
        }
        
        clearError(elements.fecha_adquisicion);
        return true;
    }

    function validarEstado(){
        const estado = elements.estado.value;
        
        if(!estado){
            showError(elements.estado, 'Este campo es obligatorio');
            return false;
        }

        clearError(elements.estado);
        return true;
    }

    //Event listener para validacion en tiempo real

    elements.placa.addEventListener('input', validarPlaca);
    elements.modelo.addEventListener('input', validarModelo);
    elements.tipo.addEventListener('change', validarTipo);
    elements.fecha_adquisicion.addEventListener('change', validarFechaAdquisicion);
    elements.estado.addEventListener('change', validarEstado);

    //Submit Handler

    form.addEventListener('submit', async function(e){
        e.preventDefault();

        const placaValida = await validarPlaca();
        const modeloValido = validarModelo();
        const tipoValido = validarTipo();
        const fechaValida = validarFechaAdquisicion();
        const estadoValido = validarEstado();

        const isValid = placaValida && modeloValido && tipoValido && fechaValida && estadoValido;

        if(!isValid){
            Swal.fire({
                icon: 'error',
                title: 'Validación',
                text: 'Revise los campos resaltados',
                confirmButtonColor: '#d33'
            });
            return;
        }

        try{
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if(data.success === true){
                await Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: data.message,
                    confirmButtonColor: '#3085d6'
                });

                form.reset();
                $('#modalCrearVehiculo').modal('hide');
                window.location.reload();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
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