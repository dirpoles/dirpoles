function inicializarValidacionesMantenimiento() {
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

    function validarIdVehiculo() {
        const vehiculo = elements.id_vehiculo.value.trim();

        if (!vehiculo) {
            showError(elements.id_vehiculo, 'Este campo es obligatorio');
            return false;
        }

        clearError(elements.id_vehiculo);
        return true;
    }

    function validarDescripcion() {
        const descripcion = elements.descripcion.value.trim();
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d\-\.,:;]+$/;

        if (!descripcion) {
            showError(elements.descripcion, 'Este campo es obligatorio.');
            return false;
        }

        if (!regex.test(descripcion)) {
            showError(elements.descripcion, 'Caracteres no permitidos');
            return false;
        }

        if (descripcion.length > 150) {
            showError(elements.descripcion, 'La descripción no puede exceder 150 caracteres');
            return false;
        }

        clearError(elements.descripcion);
        return true;
    }

    function validarTipo() {
        const tipo = elements.tipo_mantenimiento.value.trim();

        if (!tipo) {
            showError(elements.tipo_mantenimiento, 'Este campo es obligatorio');
            return false;
        }

        clearError(elements.tipo_mantenimiento);
        return true;
    }

    function validarFecha() {
        const fecha_mantenimiento = elements.fecha_mantenimiento.value;

        if (!fecha_mantenimiento) {
            showError(elements.fecha_mantenimiento, 'Este campo es obligatorio');
            return false;
        }

        clearError(elements.fecha_mantenimiento);
        return true;
    }

    /**
     * Valida las filas de repuestos cuando el usuario seleccionó "Sí" en uso_repuestos.
     * Verifica:
     *   1. Que haya al menos una fila de repuesto
     *   2. Que cada fila tenga un repuesto seleccionado
     *   3. Que cada fila tenga una cantidad seleccionada
     *   4. Que no haya repuestos duplicados
     */
    function validarRepuestos() {
        const usaRepuestos = elements.uso_repuestos.value === '1';

        // Si no usa repuestos, la validación pasa automáticamente
        if (!usaRepuestos) return true;

        const filas = document.querySelectorAll('.repuesto-row');

        // 1. Debe haber al menos una fila
        if (filas.length === 0) {
            AlertManager.warning('Repuestos', 'Debes agregar al menos un repuesto o seleccionar "No" en uso de repuestos.');
            return false;
        }

        let valido = true;
        const repuestosSeleccionados = [];

        filas.forEach((fila, index) => {
            const selectRep = fila.querySelector('.select2-repuesto');
            const selectCant = fila.querySelector('.cantidad-repuesto');

            // 2. Validar que se haya seleccionado un repuesto
            if (!selectRep.value) {
                selectRep.classList.add('is-invalid');
                valido = false;
            } else {
                selectRep.classList.remove('is-invalid');
            }

            // 3. Validar que se haya seleccionado una cantidad
            if (!selectCant.value) {
                selectCant.classList.add('is-invalid');
                valido = false;
            } else {
                selectCant.classList.remove('is-invalid');
            }

            // 4. Verificar duplicados
            if (selectRep.value) {
                if (repuestosSeleccionados.includes(selectRep.value)) {
                    selectRep.classList.add('is-invalid');
                    // Mostrar alerta solo la primera vez que se detecta un duplicado
                    if (valido) {
                        AlertManager.warning('Duplicado', `El repuesto "${selectRep.selectedOptions[0].text.trim()}" está seleccionado más de una vez.`);
                    }
                    valido = false;
                } else {
                    repuestosSeleccionados.push(selectRep.value);
                }
            }
        });

        if (!valido && repuestosSeleccionados.length > 0) {
            // Solo mostrar alerta genérica si no se mostró la de duplicados
        } else if (!valido) {
            AlertManager.warning('Repuestos', 'Completa todos los campos de repuestos (selecciona repuesto y cantidad).');
        }

        return valido;
    }

    /**
     * Recopila los datos de repuestos de las filas dinámicas
     * y los empaqueta como JSON para enviar al backend.
     * El backend espera $_POST['repuestos_data'] como JSON string.
     */
    function recopilarRepuestosJSON() {
        const usaRepuestos = elements.uso_repuestos.value === '1';
        if (!usaRepuestos) return '[]';

        const filas = document.querySelectorAll('.repuesto-row');
        const repuestos = [];

        filas.forEach(fila => {
            const selectRep = fila.querySelector('.select2-repuesto');
            const selectCant = fila.querySelector('.cantidad-repuesto');

            if (selectRep.value && selectCant.value) {
                repuestos.push({
                    id_repuesto: selectRep.value,
                    cantidad: selectCant.value
                });
            }
        });

        return JSON.stringify(repuestos);
    }

    // Event listener para validación en tiempo real
    $(elements.id_vehiculo).on('change', validarIdVehiculo);
    elements.descripcion.addEventListener('input', validarDescripcion);
    elements.tipo_mantenimiento.addEventListener('change', validarTipo);
    elements.fecha_mantenimiento.addEventListener('change', validarFecha);

    // Submit Handler
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validar campos principales
        const vehiculoValido = validarIdVehiculo();
        const descValida = validarDescripcion();
        const tipoValido = validarTipo();
        const fechaValida = validarFecha();
        const repuestosValidos = validarRepuestos();

        if (vehiculoValido && descValida && tipoValido && fechaValida && repuestosValidos) {
            // Recopilar los repuestos como JSON antes de enviar
            const repuestosJSON = recopilarRepuestosJSON();
            enviarFormularioMantenimiento(form, repuestosJSON);
        } else {
            AlertManager.warning('Atención', 'Por favor, corrige los errores en el formulario.');
        }
    });
}

async function enviarFormularioMantenimiento(form, repuestosJSON) {
    try {
        // Bloquear el botón de submit para evitar doble clic
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

        const formData = new FormData(form);

        // Eliminar los campos individuales de repuestos[] y cantidades[]
        // ya que el backend espera un solo campo 'repuestos_data' como JSON
        formData.delete('repuestos[]');
        formData.delete('cantidades[]');

        // Agregar los repuestos empaquetados como JSON
        formData.append('repuestos_data', repuestosJSON);

        const response = await fetch('mantenimiento_registrar', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error('Error en la comunicación con el servidor');

        const data = await response.json();

        if (data.exito || data.success) {
            AlertManager.success('Exito', data.mensaje || data.message || 'Mantenimiento registrado correctamente.');

            // 1. Resetear el formulario
            form.reset();
            // 2. Limpiar las filas de repuestos
            const repuestosRows = document.getElementById('repuestos_rows');
            if (repuestosRows) repuestosRows.innerHTML = '';
            // 3. Ocultar el contenedor de repuestos
            const repContainer = document.getElementById('repuestos_container');
            if (repContainer) repContainer.style.display = 'none';

            // 4. Cerrar el modal
            const modalElement = document.getElementById('modalGenerico');
            const bsModal = bootstrap.Modal.getInstance(modalElement);
            if (bsModal) bsModal.hide();

            // 5. Recargar DataTable específicamente
            if ($.fn.DataTable.isDataTable('#tabla_historial_mantenimientos')) {
                $('#tabla_historial_mantenimientos').DataTable().ajax.reload(null, false);
            } else {
                window.location.reload();
            }

        } else {
            AlertManager.error('Error', data.mensaje || data.message || 'No se pudo registrar el mantenimiento.');
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
