document.querySelectorAll('form[data-tipo]').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        switch (form.dataset.tipo) {
            case 'vehiculo':
                editarVehiculo();
                break;

            case 'proveedor':
                editarProveedor();
                break;

            case 'ruta':
                editarRuta();
                break;

            case 'repuesto':
                editarRepuesto();
                break;
                
            default:
                console.error('Tipo de formulario no reconocido');
                break;
        }
    });
});

function editarVehiculo() {
    // 1. Validar HTML5 y estado de la placa
    if (!document.getElementById("formEditarVehiculo").checkValidity() || $('#placa').hasClass('is-invalid')) {
        Swal.fire('Error', 'Corrige los errores antes de enviar', 'error');
        return;
    }

    // 2. Obtener datos del formulario
    const formData = {
        placa: $('#placa').val(),
        modelo: $('#modelo').val(),
        tipo: $('#tipo').val(),
        fecha_adquisicion: $('#fecha_adquisicion').val(),
        estado: $('#estado').val(),
        id_vehiculo: $('input[name="id_vehiculo"]').val()
    };

    // 3. Enviar por AJAX
    $.ajax({
        url: 'index.php?action=vehiculo_actualizar',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: response.message,
                    timer: 2000
                }).then(() => {
                    const currentHash = window.location.hash || '#vehiculos';
                    // Parámetros ANTES del hash
                    window.location.href = 
                        window.location.pathname + 
                        `?action=gestionar_transporte&r=${Math.random()}${currentHash}`;
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    });
}

function editarProveedor(){
    // 1. Validar HTML5
    if (!document.getElementById("formEditarProveedor").checkValidity()) {
        Swal.fire('Error', 'Corrige los errores antes de enviar', 'error');
        return;
    }

    // 2. Obtener datos del formulario
    const formData = {
        id_proveedor: $('input[name="id_proveedor"]').val(),
        tipo_documento: $('#tipo_documento').val(),
        num_documento: $('#num_documento').val(),
        nombre: $('#nombre').val(),
        telefono: $('#telefono').val(),
        correo: $('#correo').val(),
        direccion: $('#direccion').val()
    };

    // 3. Enviar por AJAX
    $.ajax({
        url: 'index.php?action=proveedor_actualizar',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: response.message,
                    timer: 2000
                }).then(() => {
                    const currentHash = window.location.hash || '#proveedores';
                    // Parámetros ANTES del hash
                    window.location.href =
                        window.location.pathname + `?action=gestionar_transporte&r=${Math.random()}${currentHash}`;
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    });
}

function editarRuta(){
    // 1. Validar HTML5
    if (!document.getElementById("formEditarRuta").checkValidity()) {
        Swal.fire('Error', 'Corrige los errores antes de enviar', 'error');
        return;
    }

    // 2. Obtener datos del formulario
    const formData = {
        id_ruta: $('input[name="id_ruta"]').val(),
        nombre_ruta: $('#nombre_ruta').val(),
        tipo_ruta: $('#tipo_ruta').val(),
        punto_partida: $('#punto_partida').val(),
        punto_destino: $('#punto_destino').val(),
        horario_salida: $('#horario_salida').val(),
        horario_llegada: $('#horario_llegada').val(),
        estatus: $('#estatus').val(),
        trayectoria: $('#trayectoria').val(),
    };

    // 3. Enviar por AJAX
    $.ajax({
        url: 'index.php?action=actualizar_ruta',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: response.message,
                    timer: 2000
                }).then(() => {
                    const currentHash = window.location.hash || '#rutas';
                    // Parámetros ANTES del hash
                    window.location.href =
                        window.location.pathname + `?action=gestionar_transporte&r=${Math.random()}${currentHash}`;
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    });
}

function editarRepuesto(){
    // 1. Validar HTML5
    if (!document.getElementById("formEditarRepuesto").checkValidity()) {
        Swal.fire('Error', 'Corrige los errores antes de enviar', 'error');
        return;
    }

    // 2. Obtener datos del formulario
    const formData = {
        id_repuesto: $('#id_repuesto').val(),
        estatus: $('#estatus').val(),
        id_proveedor: $('#id_proveedor').val(),
        nombre: $('#nombre').val(),
        descripcion: $('#descripcion').val(),
    };

    // 3. Enviar por AJAX
    $.ajax({
        url: 'index.php?action=repuesto_actualizar',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: response.message,
                    timer: 2000
                }).then(() => {
                    const currentHash = window.location.hash || '#repuestos';
                    // Parámetros ANTES del hash
                    window.location.href =
                        window.location.pathname + `?action=gestionar_transporte&r=${Math.random()}${currentHash}`;
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    });
}
