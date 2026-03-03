function inicializarValidacionesVehiculo() {
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


    function validarPlaca() {
        const placa = elements.placa.value.trim().toUpperCase();
        elements.placa.value = placa; // Mantener en mayúsculas
        const placaRegex = /^[A-Z0-9]{7}$/;

        if (!placa) {
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
            fetch("vehiculos_validar_placa", {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `placa=${placa}`
            })
                .then((response) => response.json())
                .then(data => {
                    if (data.existe) {
                        showError(elements.placa, 'La placa ya esta registrada.');
                        resolve(false);
                    } else {
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

    function validarModelo() {
        const modelo = elements.modelo.value.trim();
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d\-\.,:;]+$/;

        if (!modelo) {
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

    function validarTipo() {
        const tipo = elements.tipo.value.trim();

        if (!tipo) {
            showError(elements.tipo, 'Este campo es obligatorio');
            return false;
        }

        clearError(elements.tipo);
        return true;
    }

    function validarFechaAdquisicion() {
        const fecha_adquisicion = elements.fecha_adquisicion.value;
        const fecha = new Date(fecha_adquisicion);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (!fecha_adquisicion) {
            showError(elements.fecha_adquisicion, 'Este campo es obligatorio');
            return false;
        }

        if (fecha > hoy) {
            showError(elements.fecha_adquisicion, 'La fecha de adquisición no puede ser mayor a la fecha actual');
            return false;
        }

        clearError(elements.fecha_adquisicion);
        return true;
    }

    function validarEstado() {
        const estado = elements.estado.value;

        if (!estado) {
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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (await validarPlaca() && validarModelo() && validarTipo() && validarFechaAdquisicion() && validarEstado()) {
            enviarFormularioVehiculo(form);
        } else {
            AlertManager.warning('Atención', 'Por favor, corrige los errores en el formulario.');
        }
    });
}

async function enviarFormularioVehiculo(form) {
    try {
        // Bloquear el botón de submit para evitar doble clic
        const btnSubmit = form.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

        const formData = new FormData(form);
        const response = await fetch('vehiculos_registrar', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error('Error en la comunicación con el servidor');

        const data = await response.json();

        if (data.exito || data.success) {
            AlertManager.success('Exito', data.mensaje || 'Vehículo registrado correctamente.');

            // 1. Resetear el formulario
            form.reset();
            // 2. Cerrar el modal (usando el ID genérico que definiste)
            const modalElement = document.getElementById('modalGenerico');
            const bsModal = bootstrap.Modal.getInstance(modalElement);
            if (bsModal) bsModal.hide();

            // 3. Recargar DataTable específicamente
            if ($.fn.DataTable.isDataTable('#tabla_vehiculos')) {
                $('#tabla_vehiculos').DataTable().ajax.reload(null, false);
                // null, false permite recargar sin perder la página actual de la tabla
            } else {
                // Si por alguna razón la tabla no es DataTable, recarga la página
                window.location.reload();
            }

        } else {
            AlertManager.error('Error', data.mensaje || 'No se pudo registrar el vehículo.');
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