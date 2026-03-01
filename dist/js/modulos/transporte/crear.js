              
function guardarRuta(){
    if(!document.getElementById("formCrearRuta").checkValidity()) {
        Swal.fire('Error', 'No se han completado todos los campos requeridos', 'error');
        return;
    }

    const formData = {
        nombre_ruta: $('#nombre_ruta').val(),
        tipo_ruta: $('#tipo_ruta').val(),
        horario_salida: $('#horario_salida').val(),
        horario_llegada: $('#horario_llegada').val(),
        estatus: $('#estatus').val(),
        punto_partida: $('#punto_partida').val(),
        punto_destino: $('#punto_destino').val(),
        trayectoria: $('#trayectoria').val()
    };

    $.ajax({
        url: 'index.php?action=ruta_registrar',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function(response){
            if(response.success){
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: response.message,
                }).then(() => {
                    const currentHash = window.location.hash || '#vehiculos';
                    // Parámetros ANTES del hash
                    window.location.href = 
                        window.location.pathname + 
                        `?action=gestionar_transporte&r=${Math.random()}${currentHash}`;
                });
                $('#modalCrearRuta').modal('hide');
                $('#formCrearRuta')[0].reset();
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                });
            }
        },
        error: function(xhr){
            let errorMsg = 'Error de conexión con el servidor';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMsg = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMsg
            });
        }
    });
}

function guardarAsignacion() {
    if (!document.getElementById("formAsignarRecursos").checkValidity()) {
        Swal.fire('Error', 'No se han completado todos los campos requeridos', 'error');
        return;
    }

    const formData = {
        id_ruta: $('#id_ruta').val(),
        fecha_asignacion: $('#fecha_asignacion').val(),
        id_vehiculo: $('#id_vehiculo').val(),
        id_empleado: $('#id_empleado').val(),
        estatus: $('#estatus').val()
    };

    $.ajax({
        url: 'index.php?action=asignar_recursos',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: response.message,
                }).then((result) => {
                    // Cerrar modal después de confirmar la alerta
                    $('#modalAsignarRecursos').modal('hide');
                    
                    // Resetear formulario
                    const form = document.getElementById('formAsignarRecursos');
                    if(form) form.reset();
                    
                    // Resetear selects de Select2
                    ['#id_ruta', '#id_vehiculo', '#id_empleado'].forEach(selector => {
                        $(selector).val(null).trigger('change');
                    });

                    // Actualizar calendario con manejo de errores
                    try {
                        const calendarEl = document.getElementById('calendar');
                        if(calendarEl) {
                            // Compatibilidad con versiones antiguas y nuevas de FullCalendar
                            const calendar = window.FullCalendar ? 
                                FullCalendar.getApi(calendarEl) : 
                                $(calendarEl).fullCalendar('getCalendar');
                            
                            if(calendar && typeof calendar.refetchEvents === 'function') {
                                calendar.refetchEvents();
                            }
                        }
                    } catch(error) {
                        console.error('Error actualizando calendario:', error);
                    }
                    // 4. Recargar página manteniendo pestaña activa (NUEVO)
                    const currentHash = window.location.hash || '#rutas'; // Ajusta según tu pestaña
                    window.location.href = window.location.pathname + 
                                        `?action=gestionar_transporte&r=${Math.random()}${currentHash}`;
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                });
            }
        },
        error: function(xhr) {
            let errorMsg = 'Error de conexión con el servidor';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMsg = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMsg
            });
        }
    });
}

//Funcion para guardar repuestos
function guardarRepuesto() {
    // 1. Validar HTML5 y estado de la placa
    if (!document.getElementById("formCrearRepuesto").checkValidity() || $('#nombre_repuesto').hasClass('is-invalid')) {
        Swal.fire('Error', 'Corrige los errores antes de enviar', 'error');
        return;
    }

    // 2. Obtener datos del formulario
    const formData = {
        nombre_repuesto: $('#nombre_repuesto').val(),
        cantidad: $('#cantidad').val(),
        id_proveedor: $('#id_proveedor').val(),
        descripcion: $('#descripcion').val(),
        fecha_creacion: $('#fecha_creacion').val(),
        estatus_repuesto: $('#estatus_repuesto').val()
    };

    // 3. Enviar por AJAX
    $.ajax({
        url: 'index.php?action=repuestos_registrar',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: response.message,
                    timer: 3000
                }).then(() => {
                    const currentHash = window.location.hash || '#repuestos';
                    // Parámetros ANTES del hash
                    window.location.href = 
                        window.location.pathname + 
                        `?action=gestionar_transporte&r=${Math.random()}${currentHash}`;
                });
                
                $('#modalCrearRepuestos').modal('hide');
                $('#formCrearRepuesto')[0].reset();
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

//Funcion para guardar entrada de repuestos
function guardarEntradaRepuesto(){
    // 2. Obtener datos del formulario
    const formData = {
        id_repuesto: $('#id_repuesto').val(),
        cantidad: $('#cantidad').val(),
        razon_movimiento: $('#razon_movimiento').val(),
        tipo_movimiento: $('#tipo_movimiento').val()
    };

    // 3. Enviar por AJAX
    $.ajax({
        url: 'index.php?action=repuestos_entrada',
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: response.message,
                    timer: 3000
                }).then(() => {
                    const currentHash = window.location.hash || '#repuestos';
                    // Parámetros ANTES del hash
                    window.location.href = 
                        window.location.pathname + 
                        `?action=gestionar_transporte&r=${Math.random()}${currentHash}`;
                });
                
                $('#modalEntradaRepuesto').modal('hide');
                $('#formEntradaRepuesto')[0].reset();
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

function guardarMantenimiento() {
    const formData = new FormData(document.getElementById('formCrearMantenimiento'));
    const repuestosData = [];

    // Recoger solo repuestos válidos
    $('.repuesto-row').each(function() {
        const $row = $(this);
        const idRepuesto = $row.find('select[name="repuestos[]"]').val();
        const cantidad = $row.find('select[name="cantidades[]"]').val();
        
        // Solo agregar si hay un repuesto seleccionado y cantidad > 0
        if (idRepuesto && cantidad > 0) {
            repuestosData.push({
                id_repuesto: idRepuesto,
                cantidad: cantidad
            });
        }
    });

    // Agregar datos adicionales al FormData
    formData.append('repuestos', JSON.stringify(repuestosData));

    $.ajax({
        url: 'index.php?action=registrar_mantenimiento_vehiculo',
        type: 'POST',
        dataType: 'json',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if(response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.message,
                    confirmButtonColor: '#001F3F'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                    confirmButtonColor: '#001F3F'
                });
            }
        },
        error: function(xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error en la comunicación con el servidor',
                confirmButtonColor: '#001F3F'
            });
        }
    });
}

// Toggle visibilidad repuestos
function toggleRepuestos(select) {
    const container = $('#repuestos_container');
    const mostrar = select.value === '1';
    container.toggle(mostrar);

    if (mostrar) {
        // Limpia el contenedor antes de agregar (opcional)
        container.find('.repuesto-row').remove();

        // Agrega la primera fila automáticamente
        agregarRepuesto();
    }
}

function agregarRepuesto() {
    let repuestoOptions = '<option value="">Seleccionar repuesto...</option>';
    repuestos.forEach(r => {
        repuestoOptions += `
            <option value="${r.id_repuesto}" data-cantidad="${r.cantidad}">
                ${r.nombre} (Disponibles: ${r.cantidad})
            </option>`;
    });

    const newRow = `
        <div class="row repuesto-row mb-3 align-items-center">
            <div class="col-md-6">
                <select class="form-control select2-repuesto" name="repuestos[]" required>
                    ${repuestoOptions}
                </select>
            </div>
            <div class="col-md-4">
                <select class="form-control cantidad-repuesto" name="cantidades[]" disabled required>
                    <option value="">Cantidad</option>
                </select>
            </div>
            <div class="col-md-2 text-center">
                <button type="button" class="btn btn-danger" onclick="eliminarRepuesto(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    $('#repuestos_rows').append(newRow); // en lugar de #repuestos_container

    // Inicializa select2 en el nuevo select de repuestos
    $('#repuestos_container .repuesto-row:last-child .select2-repuesto').select2({
        theme: 'bootstrap4',
        dropdownParent: $('#modalCrearMantenimiento') // ajusta si usas otro modal
    });

    // Lógica de generación de opciones de cantidad
    const $lastRow = $('#repuestos_container .repuesto-row:last-child');
    const $selectRepuesto = $lastRow.find('.select2-repuesto');
    const $selectCantidad = $lastRow.find('.cantidad-repuesto');

    $selectRepuesto.on('change', function () {
        const selectedOption = this.selectedOptions[0];
        const maxCantidad = parseInt(selectedOption.dataset.cantidad || '0');

        $selectCantidad.empty().append('<option value="">Cantidad</option>');
        for (let i = 1; i <= maxCantidad; i++) {
            $selectCantidad.append(`<option value="${i}">${i}</option>`);
        }

        $selectCantidad.prop('disabled', maxCantidad === 0);
    });
}

// Eliminar una fila de repuesto
function eliminarRepuesto(button) {
    $(button).closest('.repuesto-row').remove();
}

// Inicializar Select2 principal del vehículo al cargar la página
$(document).ready(function() {
    $('#id_proveedor').select2({
        theme: 'bootstrap4',
        placeholder: 'Seleccione un proveedor',
        dropdownParent: $('#modalCrearRepuesto')
    });

    $('#id_repuesto').select2({
        theme: 'bootstrap4',
        placeholder: 'Buscar repuesto...',
        dropdownParent: $('#modalEntradaRepuesto')
    });

    $('#id_proveedor').select2({
        theme: 'bootstrap4',
        placeholder: 'Buscar Proveedor...'
    });

    $('#id_vehiculo_mantenimiento').select2({
        theme: 'bootstrap4',
        placeholder: 'Buscar vehiculo...',
        dropdownParent: $('#modalCrearMantenimiento')
    });

    $('#id_vehiculo').select2({
        theme: 'bootstrap4',
        placeholder: 'Buscar vehiculo...'
    });

    $('#id_empleado').select2({
        theme: 'bootstrap4',
        placeholder: 'Buscar empleado...'
    });
});

// Función para actualizar
function actualizarVehiculo() {
    if (!document.getElementById("formEditarVehiculo").checkValidity()) {
        Swal.fire('Error', 'Corrige los errores antes de enviar', 'error');
        return;
    }

    const formData = {
        id_vehiculo: $('#edit_id_vehiculo').val(),
        placa: $('#edit_placa').val(),
        modelo: $('#edit_modelo').val(),
        tipo: $('#edit_tipo').val(),
        fecha_adquisicion: $('#edit_fecha_adquisicion').val(),
        estado: $('#edit_estado').val()
    };

    $.ajax({
        url: 'index.php?action=vehiculos_editar',
        type: 'POST',
        dataType: 'json',   
        data: formData,
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: response.message,
                    timer: 1500
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function() {
            Swal.fire('Error', 'Error de conexión con el servidor', 'error');
        }
    });
}


