document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-mobiliario');
    const container = document.getElementById('items-container-mobiliario');
    let rowCount = 1;

    // Ocultar botón de eliminar en la primera fila al inicializar
    const firstRowRemoveBtn = container.querySelector('.item-row-mobiliario .btn-remove-row');
    if (firstRowRemoveBtn) {
        firstRowRemoveBtn.style.display = 'none';
    }

    // ============================================================
    // Funciones auxiliares de validación
    // ============================================================
    const showError = (field, message) => {
        const errorDiv = document.getElementById(`${field.id}Error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');

        // Manejo especial para Select2
        if ($(field).hasClass('select2-hidden-accessible') || $(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        const errorDiv = document.getElementById(`${field.id}Error`);
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');

        if ($(field).hasClass('select2-hidden-accessible') || $(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .removeClass('is-invalid')
                .addClass('is-valid');
        }
    };

    // Funciones de validación dinámicas
    function validarTipoMobiliario(field) {
        if (field.value.trim() === "") {
            showError(field, "El tipo de mobiliario es obligatorio");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarServicios(field) {
        if (field.value.trim() === "") {
            showError(field, "El servicio es obligatorio");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarMarca(field) {
        const value = field.value.trim();
        if (value === "") {
            showError(field, "La marca es obligatoria");
            return false;
        }
        if (value.length > 50) {
            showError(field, "La marca debe tener menos de 50 caracteres");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarModelo(field) {
        const value = field.value.trim();
        if (value === "") {
            showError(field, "El modelo es obligatorio");
            return false;
        }
        if (value.length > 50) {
            showError(field, "El modelo debe tener menos de 50 caracteres");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarColor(field) {
        const value = field.value.trim();
        if (value === "") {
            showError(field, "El color es obligatorio");
            return false;
        }
        if (value.length > 20) {
            showError(field, "El color debe tener menos de 20 caracteres");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarEstado(field) {
        if (field.value.trim() === "") {
            showError(field, "El estado es obligatorio");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarCantidad(field) {
        const value = field.value.trim();
        if (value === "") {
            showError(field, "La cantidad es obligatoria");
            return false;
        }
        if (value <= 0) {
            showError(field, "La cantidad debe ser mayor a 0");
            return false;
        }
        if (value > 100) {
            showError(field, "La cantidad debe ser menor a 100");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarFechaAdquisicion(field) {
        const value = field.value.trim();
        if (value === "") {
            showError(field, "La fecha de adquisición es obligatoria");
            return false;
        }
        const fechaActual = new Date();
        const fechaAdquisicion = new Date(value);
        if (fechaAdquisicion > fechaActual) {
            showError(field, "La fecha de adquisición no puede ser mayor a la fecha actual");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarDescripcion(field) {
        const value = field.value.trim();
        if (value === "") {
            showError(field, "La descripción es obligatoria");
            return false;
        }
        if (value.length < 5) {
            showError(field, "La descripción debe tener al menos 5 caracteres");
            return false;
        }
        if (value.length > 200) {
            showError(field, "La descripción debe tener menos de 200 caracteres");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarObservaciones(field) {
        const value = field.value.trim();
        if (value === "") {
            showError(field, "Las observaciones son obligatorias");
            return false;
        }
        if (value.length < 5) {
            showError(field, "Las observaciones deben tener al menos 5 caracteres");
            return false;
        }
        if (value.length > 200) {
            showError(field, "Las observaciones deben tener menos de 200 caracteres");
            return false;
        }
        clearError(field);
        return true;
    }

    // Agregar eventos a toda la fila para validación
    function attachEvents(row) {
        const inputs = {
            id_tipo_mobiliario: row.querySelector('[name="id_tipo_mobiliario[]"]'),
            id_servicios: row.querySelector('[name="id_servicios[]"]'),
            marca: row.querySelector('[name="marca[]"]'),
            modelo: row.querySelector('[name="modelo[]"]'),
            color: row.querySelector('[name="color[]"]'),
            estado: row.querySelector('[name="estado[]"]'),
            cantidad: row.querySelector('[name="cantidad[]"]'),
            fecha_adquisicion: row.querySelector('[name="fecha_adquisicion[]"]'),
            descripcion: row.querySelector('[name="descripcion[]"]'),
            observaciones: row.querySelector('[name="observaciones[]"]')
        };

        // Eventos específicos para select2
        $(inputs.id_tipo_mobiliario).on('change.select2 select2:select', function () {
            validarTipoMobiliario(this);
        });

        $(inputs.id_servicios).on('change.select2 select2:select', function () {
            validarServicios(this);
        });

        $(inputs.estado).on('change', function () {
            validarEstado(this);
        });

        inputs.marca.addEventListener('input', () => validarMarca(inputs.marca));
        inputs.modelo.addEventListener('input', () => validarModelo(inputs.modelo));

        inputs.color.addEventListener('input', function () {
            this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            validarColor(this);
        });

        inputs.cantidad.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            validarCantidad(this);
        });

        inputs.fecha_adquisicion.addEventListener('change', () => validarFechaAdquisicion(inputs.fecha_adquisicion));
        inputs.descripcion.addEventListener('input', () => validarDescripcion(inputs.descripcion));
        inputs.observaciones.addEventListener('input', () => validarObservaciones(inputs.observaciones));
    }

    // Attach events al cargar la página a la primera fila
    const initialRow = container.querySelector('.item-row-mobiliario');
    if (initialRow) attachEvents(initialRow);

    // Función para validar todas las filas
    function validarTodo() {
        const rows = container.querySelectorAll('.item-row-mobiliario');
        let isValid = true;

        rows.forEach(row => {
            const inputs = {
                id_tipo_mobiliario: row.querySelector('[name="id_tipo_mobiliario[]"]'),
                id_servicios: row.querySelector('[name="id_servicios[]"]'),
                marca: row.querySelector('[name="marca[]"]'),
                modelo: row.querySelector('[name="modelo[]"]'),
                color: row.querySelector('[name="color[]"]'),
                estado: row.querySelector('[name="estado[]"]'),
                cantidad: row.querySelector('[name="cantidad[]"]'),
                fecha_adquisicion: row.querySelector('[name="fecha_adquisicion[]"]'),
                descripcion: row.querySelector('[name="descripcion[]"]'),
                observaciones: row.querySelector('[name="observaciones[]"]')
            };

            const validacionesRow = [
                validarTipoMobiliario(inputs.id_tipo_mobiliario),
                validarServicios(inputs.id_servicios),
                validarMarca(inputs.marca),
                validarModelo(inputs.modelo),
                validarColor(inputs.color),
                validarEstado(inputs.estado),
                validarCantidad(inputs.cantidad),
                validarFechaAdquisicion(inputs.fecha_adquisicion),
                validarDescripcion(inputs.descripcion),
                validarObservaciones(inputs.observaciones)
            ];

            if (validacionesRow.includes(false)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Agregar y Eliminar filas dinámicamente
    container.addEventListener('click', function (e) {
        // Al darle al botón de agregar fila
        const btnAdd = e.target.closest('.btn-add-row');
        if (btnAdd) {
            const currentRows = container.querySelectorAll('.item-row-mobiliario').length;
            if (currentRows >= 10) {
                AlertManager.warning("Límite alcanzado", "No puedes registrar más de 10 mobiliarios al mismo tiempo.");
                return;
            }

            const firstRow = container.querySelector('.item-row-mobiliario');

            // Destruir select2 en la primera fila antes de clonar para evitar copiar eventos internos de jQuery/Select2
            if (typeof $.fn.select2 !== 'undefined') {
                $(firstRow).find('.select2').each(function () {
                    if ($(this).hasClass('select2-hidden-accessible')) {
                        $(this).select2('destroy');
                    }
                });
            }

            const newRow = firstRow.cloneNode(true);

            // Reinicializar Select2 en la primera fila inmediatamente
            if (typeof $.fn.select2 !== 'undefined') {
                $(firstRow).find('.select2').select2({
                    theme: 'bootstrap-5',
                    width: '100%',
                    placeholder: "Seleccione..."
                });
            }

            // Actualizar IDs y resetear valores
            const inputs = newRow.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const oldId = input.id;
                if (oldId) {
                    const baseId = oldId.replace(/_\d+$/, '');
                    const newId = `${baseId}_${rowCount}`;
                    input.id = newId;

                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    } else {
                        input.value = '';
                    }

                    input.classList.remove('is-valid', 'is-invalid');

                    const errorDiv = newRow.querySelector(`#${oldId}Error`);
                    if (errorDiv) {
                        errorDiv.id = `${newId}Error`;
                        errorDiv.textContent = '';
                        errorDiv.style.display = 'none';
                    }

                    const label = newRow.querySelector(`label[for="${oldId}"]`);
                    if (label) {
                        label.setAttribute('for', newId);
                    }
                }
            });

            // Mostrar el botón de eliminar porque no es la primera fila
            const removeBtn = newRow.querySelector('.btn-remove-row');
            if (removeBtn) {
                removeBtn.style.display = 'inline-block';
            }

            container.appendChild(newRow);

            // Reinicializar Select2 en la nueva fila
            if (typeof $.fn.select2 !== 'undefined') {
                $(newRow).find('.select2').select2({
                    theme: 'bootstrap-5',
                    width: '100%',
                    placeholder: "Seleccione..."
                });
            }

            // Aplicar eventos a la nueva fila
            attachEvents(newRow);
            rowCount++;
        }

        // Al darle al botón de eliminar fila
        const btnRemove = e.target.closest('.btn-remove-row');
        if (btnRemove) {
            const row = btnRemove.closest('.item-row-mobiliario');
            if (container.querySelectorAll('.item-row-mobiliario').length > 1) {
                if (typeof $.fn.select2 !== 'undefined') {
                    const selects = $(row).find('.select2');
                    selects.each(function () {
                        if ($(this).hasClass('select2-hidden-accessible')) {
                            $(this).select2('destroy');
                        }
                    });
                }
                row.remove();
            }
        }
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (validarTodo()) {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.exito) {
                    AlertManager.success("Registro exitoso", data.mensaje || "Mobiliario registrado correctamente").then(() => {
                        window.location.reload();
                    });
                } else {
                    AlertManager.error("Error", data.mensaje || "No se pudo registrar el mobiliario");
                }

            } catch (error) {
                console.error('Error:', error);
                AlertManager.error("Error", "Ocurrió un error inesperado al procesar la solicitud");
            }
        } else {
            AlertManager.warning("Formulario incompleto", "Por favor, rellene todos los campos obligatorios correctamente");
        }
    });
});