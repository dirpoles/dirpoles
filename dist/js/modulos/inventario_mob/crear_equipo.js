document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-equipo');
    const container = document.getElementById('items-container-equipo');
    let rowCount = 1;

    // Ocultar botón de eliminar en la primera fila al inicializar
    const firstRowRemoveBtn = container.querySelector('.item-row-equipo .btn-remove-row');
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
    function validarTipoEquipo(field) {
        if (field.value.trim() === "") {
            showError(field, "El tipo de equipo es obligatorio");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarServicios(field) {
        if (field.value.trim() === "") {
            showError(field, "La ubicación es obligatoria");
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

        if (value.length > 100) {
            showError(field, "La marca debe tener menos de 100 caracteres");
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

        if (value.length > 100) {
            showError(field, "El modelo debe tener menos de 100 caracteres");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarSerial(field) {
        const value = field.value.trim();

        if (value === "") {
            showError(field, "El serial es obligatorio");
            return false;
        }

        if (value.length > 100) {
            showError(field, "El serial debe tener menos de 100 caracteres");
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

        if (value.length > 50) {
            showError(field, "El color debe tener menos de 50 caracteres");
            return false;
        }
        clearError(field);
        return true;
    }

    function validarEstado(field) {
        const value = field.value.trim();

        if (value === "") {
            showError(field, "El estado es obligatorio");
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

        clearError(field);
        return true;
    }

    // Agregar eventos a toda la fila para validación
    function attachEvents(row) {
        const inputs = {
            id_tipo_equipo: row.querySelector('[name="id_tipo_equipo[]"]'),
            id_servicios: row.querySelector('[name="id_servicios[]"]'),
            marca: row.querySelector('[name="marca[]"]'),
            modelo: row.querySelector('[name="modelo[]"]'),
            serial: row.querySelector('[name="serial[]"]'),
            color: row.querySelector('[name="color[]"]'),
            estado: row.querySelector('[name="estado[]"]'),
            fecha_adquisicion: row.querySelector('[name="fecha_adquisicion[]"]'),
            descripcion: row.querySelector('[name="descripcion[]"]'),
            observaciones: row.querySelector('[name="observaciones[]"]')
        };

        // Eventos específicos para select2
        $(inputs.id_tipo_equipo).on('change.select2 select2:select', function () {
            validarTipoEquipo(this);
        });

        $(inputs.id_servicios).on('change.select2 select2:select', function () {
            validarServicios(this);
        });

        $(inputs.estado).on('change', function () {
            validarEstado(this);
        });

        inputs.marca.addEventListener('input', () => validarMarca(inputs.marca));
        inputs.modelo.addEventListener('input', () => validarModelo(inputs.modelo));
        inputs.serial.addEventListener('input', () => validarSerial(inputs.serial));

        inputs.color.addEventListener('input', function () {
            this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            validarColor(this);
        });

        inputs.fecha_adquisicion.addEventListener('change', () => validarFechaAdquisicion(inputs.fecha_adquisicion));

        if (inputs.descripcion) {
            inputs.descripcion.addEventListener('input', () => validarDescripcion(inputs.descripcion));
        }

        if (inputs.observaciones) {
            inputs.observaciones.addEventListener('input', () => validarObservaciones(inputs.observaciones));
        }
    }

    // Attach events al cargar la página a la primera fila
    const initialRow = container.querySelector('.item-row-equipo');
    if (initialRow) attachEvents(initialRow);

    // Función para validar todas las filas
    function validarTodo() {
        const rows = container.querySelectorAll('.item-row-equipo');
        let isValid = true;

        rows.forEach(row => {
            const inputs = {
                id_tipo_equipo: row.querySelector('[name="id_tipo_equipo[]"]'),
                id_servicios: row.querySelector('[name="id_servicios[]"]'),
                marca: row.querySelector('[name="marca[]"]'),
                modelo: row.querySelector('[name="modelo[]"]'),
                serial: row.querySelector('[name="serial[]"]'),
                color: row.querySelector('[name="color[]"]'),
                estado: row.querySelector('[name="estado[]"]'),
                fecha_adquisicion: row.querySelector('[name="fecha_adquisicion[]"]'),
                descripcion: row.querySelector('[name="descripcion[]"]'),
                observaciones: row.querySelector('[name="observaciones[]"]')
            };

            const validacionesRow = [
                validarTipoEquipo(inputs.id_tipo_equipo),
                validarServicios(inputs.id_servicios),
                validarMarca(inputs.marca),
                validarModelo(inputs.modelo),
                validarSerial(inputs.serial),
                validarColor(inputs.color),
                validarEstado(inputs.estado),
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
            const currentRows = container.querySelectorAll('.item-row-equipo').length;
            if (currentRows >= 10) {
                AlertManager.warning("Límite alcanzado", "No puedes registrar más de 10 equipos al mismo tiempo.");
                return;
            }

            const firstRow = container.querySelector('.item-row-equipo');

            // Destruir select2 en la primera fila antes de clonar
            if (typeof $.fn.select2 !== 'undefined') {
                $(firstRow).find('.select2').each(function () {
                    if ($(this).hasClass('select2-hidden-accessible')) {
                        $(this).select2('destroy');
                    }
                });
            }

            const newRow = firstRow.cloneNode(true);

            // Reinicializar Select2 en la primera fila
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
                        if (input.name === 'estado[]') {
                            input.value = 'Bueno'; // Valor por defecto en HTML
                        } else {
                            input.selectedIndex = 0;
                        }
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
            const row = btnRemove.closest('.item-row-equipo');
            if (container.querySelectorAll('.item-row-equipo').length > 1) {
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
                    AlertManager.success("Registro exitoso", data.mensaje || "Equipos registrados correctamente").then(() => {
                        window.location.reload();
                    });
                } else {
                    AlertManager.error("Error", data.mensaje || "No se pudieron registrar los equipos");
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
