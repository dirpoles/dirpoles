document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEditarRuta');
    if (!form) return;

    // Elementos del formulario
    const elements = {
        nombre_ruta: form.querySelector('#nombre_ruta'),
        tipo_ruta: form.querySelector('#tipo_ruta'),
        horario_salida: form.querySelector('#horario_salida'),
        horario_llegada: form.querySelector('#horario_llegada'),
        estatus_ruta: form.querySelector('#estatus'),
        punto_partida: form.querySelector('#punto_partida'),
        punto_destino: form.querySelector('#punto_destino'),
        trayectoria: form.querySelector('#trayectoria'),
        id_ruta: form.querySelector('#id_ruta')
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
    function validarNombreRuta() {
        const field = elements.nombre_ruta;
        const val   = field.value.trim();
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;

        if (!val) {
            showError(field, 'El nombre de la ruta es obligatorio');
            return false;
        }
        if (!regex.test(val)) {
            showError(field, 'Solo letras y espacios (2-50 caracteres)');
            return false;
        }
        clearError(field);
        return true;
    }

    function validartipoRuta() {
        const field = elements.tipo_ruta;
        const val   = field.value.trim();

        if (!val) {
            showError(field, 'El tipo de ruta es obligatorio');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarHorarioSalida() {
        const field = elements.horario_salida;
        const val   = field.value;
        
        if (!val) {
            showError(field, 'La hora de salida es obligatoria');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarHorarioLlegada() {
        const field   = elements.horario_llegada;
        const salida  = elements.horario_salida.value;
        const llegada = field.value;

        if (!llegada) {
            showError(field, 'La hora de llegada es obligatoria');
            return false;
        }

        // Opcional: llegada ≥ salida
        if (salida && llegada < salida) {
            showError(field, 'La llegada no puede ser antes de la salida');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarEstatusRuta() {
        const field = elements.estatus_ruta;
        const val   = field.value;

        if (!val) {
            showError(field, 'Debe seleccionar un estatus');
            return false;
        }
        clearError(field);
        return true;
    }

    function validarPuntoPartida() {
        const field = elements.punto_partida;
        const val   = field.value.trim();
        
        if (!val) {
            showError(field, 'El punto de partida es obligatorio');
            return false;
        }
        if (val.length < 3) {
            showError(field, 'Mínimo 3 caracteres');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarPuntoDestino() {
        const field = elements.punto_destino;
        const val   = field.value.trim();
        
        if (!val) {
            showError(field, 'El punto de destino es obligatorio');
            return false;
        }
        if (val.length < 3) {
            showError(field, 'Mínimo 3 caracteres');
            return false;
        }

        clearError(field);
        return true;
    }

    function validarTrayectoria() {
        const field = elements.trayectoria;
        const val   = field.value.trim();
        

        if (!val) {
            showError(field, 'La trayectoria es obligatoria');
            return false;
        }
        if (val.length < 10) {
            showError(field, 'Describe al menos 10 caracteres');
            return false;
        }

        clearError(field);
        return true;
    }


    // Event Listeners para validación en tiempo real
    elements.nombre_ruta.addEventListener('input', validarNombreRuta);
    elements.tipo_ruta.addEventListener('change', validartipoRuta);
    elements.horario_llegada.addEventListener('change', validarHorarioLlegada);
    elements.horario_salida.addEventListener('change', validarHorarioSalida);
    elements.estatus_ruta.addEventListener('change', validarEstatusRuta);
    elements.punto_partida.addEventListener('input', validarPuntoPartida);
    elements.punto_destino.addEventListener('input', validarPuntoDestino);
    elements.trayectoria.addEventListener('input', validarTrayectoria);

    // Submit Handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Realizar todas las validaciones
        const nombreRutaValido = validarNombreRuta();
        const tipoRutaValido =  validartipoRuta();
        const horarioLlegadaValido = validarHorarioLlegada();
        const horarioSalidaValido = validarHorarioSalida();
        const EstatusValido = validarEstatusRuta();
        const PartidaValida = validarPuntoPartida();
        const DestinoValido = validarPuntoDestino();
        const TrayectoriaValida = validarTrayectoria();
        
        const isValid = nombreRutaValido && tipoRutaValido && horarioLlegadaValido && horarioSalidaValido && EstatusValido && PartidaValida && DestinoValido && TrayectoriaValida;
        
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