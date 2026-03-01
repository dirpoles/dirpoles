document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formCrearMantenimiento');
    if (!form) return;

    // Elementos clave del formulario
    const elements = {
        id_vehiculo: document.getElementById('id_vehiculo_mantenimiento'),
        fecha_mantenimiento: document.getElementById('fecha_mantenimiento'),
        tipo_mantenimiento: document.getElementById('tipo_mantenimiento'),
        descripcion: document.getElementById('descripcion_mant'),
        uso_repuestos: document.getElementById('uso_repuestos'),
        repuestos_container: document.getElementById('repuestos_container'),
        btn_agregar_repuesto: document.getElementById('btn-agregar-repuesto')
    };

    // Helper functions para mostrar y limpiar errores
    const showError = (field, msg) => {
        let errorElement = document.getElementById(`${field.id}Error`);

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

    function validarIdVehiculo(){
        const vehiculo = elements.id_vehiculo.value.trim();

        if (!vehiculo) {
            showError(elements.id_vehiculo, 'Este campo es obligatorio');
            return false;
        }

        clearError(elements.id_vehiculo);
        return true;
    }

    function validarDescripcion(){
        const descripcion = elements.descripcion.value.trim();
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d\-\.,:;]+$/;

        if(!descripcion){
            showError(elements.descripcion, 'Este campo es obligatorio.');
            return false;
        }

        if (!regex.test(descripcion)) {
            showError(elements.descripcion, 'Caracteres no permitidos');
            return false;
        }

        if (descripcion.length > 150) {
            showError(elements.descripcion, 'El modelo no puede exceder 150 caracteres');
            return false;
        }

        clearError(elements.descripcion);
        return true;
    }

    function validarTipo(){
        const tipo = elements.tipo_mantenimiento.value.trim();

        if (!tipo) {
            showError(elements.tipo_mantenimiento, 'Este campo es obligatorio');
            return false;
        }

        clearError(elements.tipo_mantenimiento);
        return true;
    }

    function validarFecha(){
        const fecha_mantenimiento = elements.fecha_mantenimiento.value;
        const fecha = new Date(fecha_mantenimiento);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if(!fecha_mantenimiento){
            showError(elements.fecha_mantenimiento, 'Este campo es obligatorio');
            return false;
        }

        
        clearError(elements.fecha_mantenimiento);
        return true;
    }

    // Función para obtener datos de repuestos
    function getRepuestosData() {
        const repuestosData = [];
        
        document.querySelectorAll('.repuesto-row').forEach(row => {
            const repuestoSelect = row.querySelector('select[name="repuestos[]"]');
            const cantidadSelect = row.querySelector('select[name="cantidades[]"]');
            
            if (repuestoSelect && cantidadSelect) {
                const idRepuesto = repuestoSelect.value;
                const cantidad = cantidadSelect.value;
                
                if (idRepuesto && cantidad > 0) {
                    repuestosData.push({
                        id_repuesto: idRepuesto,
                        cantidad: cantidad
                    });
                }
            }
        });
        
        return repuestosData;
    }

    // Toggle visibilidad repuestos
    elements.uso_repuestos.addEventListener('change', function() {
        const mostrar = this.value === '1';
        elements.repuestos_container.style.display = mostrar ? 'block' : 'none';
        
        if (mostrar && document.querySelectorAll('.repuesto-row').length === 0) {
            agregarRepuesto();
        }
    });

    function agregarRepuesto() {
        // Verificar que hay repuestos disponibles
        if (!window.repuestos || window.repuestos.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Sin repuestos',
                text: 'No hay repuestos disponibles en el inventario',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Generar opciones de repuestos
        const repuestoOptions = window.repuestos.map(r => `
            <option value="${r.id_repuesto}" data-cantidad="${r.cantidad}">
                ${r.nombre} (Disponibles: ${r.cantidad})
            </option>
        `).join('');

        const newRow = document.createElement('div');
        newRow.className = 'row repuesto-row mb-3 align-items-center';
        newRow.innerHTML = `
            <div class="col-md-6">
                <select class="form-control select2-repuesto" name="repuestos[]">
                    <option value="">Seleccionar repuesto...</option>
                    ${repuestoOptions}
                </select>
            </div>
            <div class="col-md-4">
                <select class="form-control cantidad-repuesto" name="cantidades[]" disabled>
                    <option value="">Cantidad</option>
                </select>
            </div>
            <div class="col-md-2 text-center">
                <button type="button" class="btn btn-danger btn-eliminar-repuesto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        document.getElementById('repuestos_rows').appendChild(newRow);
        
         // Inicializar Select2 para el nuevo repuesto
        const $selectRepuesto = $(newRow).find('.select2-repuesto').select2({
            theme: 'bootstrap4',
            dropdownParent: $('#modalCrearMantenimiento')
        });
        
        // Evento para actualizar cantidades - ¡CORRECCIÓN CLAVE AQUÍ!
        $selectRepuesto.on('change', function(e) {
            const selectedOption = e.target.selectedOptions[0];
            const maxCantidad = parseInt(selectedOption.dataset.cantidad) || 0;
            const $cantidadSelect = $(this).closest('.repuesto-row').find('.cantidad-repuesto');
            
            // Limpiar y llenar opciones de cantidad
            $cantidadSelect.empty().append('<option value="">Cantidad</option>');
            
            for (let i = 1; i <= maxCantidad; i++) {
                $cantidadSelect.append(new Option(i, i));
            }
            
            // Habilitar/deshabilitar el select de cantidad
            $cantidadSelect.prop('disabled', maxCantidad === 0);
        });

        // Añadir evento para cuando se abre el dropdown
        $selectRepuesto.on('select2:open', function(e) {
            // Forzar un evento change al seleccionar para actualizar cantidades
            setTimeout(() => $(this).trigger('change'), 100);
        });
    }

    // Evento para agregar repuesto
    elements.btn_agregar_repuesto.addEventListener('click', agregarRepuesto);

    // Evento delegado para eliminar repuestos
    document.getElementById('repuestos_rows').addEventListener('click', function(e) {
        if (e.target.closest('.btn-eliminar-repuesto')) {
            e.target.closest('.repuesto-row').remove();
        }
    });

    //Event listener para validacion en tiempo real

    $(elements.id_vehiculo).on('change', validarIdVehiculo);
    elements.descripcion.addEventListener('input', validarDescripcion);
    elements.tipo_mantenimiento.addEventListener('change', validarTipo);
    elements.fecha_mantenimiento.addEventListener('change', validarFecha);

    // Submit Handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar campos principales
        const vehiculoValido = validarIdVehiculo();
        const descValida = validarDescripcion();
        const tipoValido = validarTipo();
        const fechaValida = validarFecha();

        // Validar repuestos si es necesario
        let repuestosValidos = true;
        if (elements.uso_repuestos.value === '1') {
            const repuestosRows = document.querySelectorAll('.repuesto-row');
            if (repuestosRows.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Repuestos requeridos',
                    text: 'Debe agregar al menos un repuesto',
                    confirmButtonColor: '#d33'
                });
                return;
            }
            
            // Validar cada fila de repuestos
            repuestosRows.forEach(row => {
                const repuestoSelect = row.querySelector('select[name="repuestos[]"]');
                const cantidadSelect = row.querySelector('select[name="cantidades[]"]');
                
                if (!repuestoSelect.value || !cantidadSelect.value) {
                    repuestosValidos = false;
                    row.classList.add('border', 'border-danger');
                } else {
                    row.classList.remove('border', 'border-danger');
                }
            });
        }

        const isValid = vehiculoValido && descValida && tipoValido && fechaValida && repuestosValidos;

        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validación',
                text: 'Revise los campos resaltados',
                confirmButtonColor: '#d33'
            });
            return;
        }

        try {
            // Crear FormData
            const formData = new FormData(form);
            
            // Agregar datos de repuestos
            if (elements.uso_repuestos.value === '1') {
                const repuestosData = getRepuestosData();
                formData.append('repuestos_data', JSON.stringify(repuestosData));
            }

            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success === true) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: data.message,
                    confirmButtonColor: '#3085d6',
                    timer: 2000
                });

                // Cerrar modal y recargar
                $('#modalCrearMantenimiento').modal('hide');
                window.location.reload();

            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Error al registrar el mantenimiento',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Error de conexión con el servidor',
                confirmButtonColor: '#d33'
            });
        }
    });
});