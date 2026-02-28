document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-insumo')
    if (!form) return;

    const elements = {
        nombre_insumo: document.getElementById('nombre_insumo'),
        tipo_insumo: document.getElementById('tipo_insumo'),
        id_presentacion: document.getElementById('id_presentacion'),
        fecha_vencimiento: document.getElementById('fecha_vencimiento'),
        estatus: document.getElementById('estatus'),
        descripcion: document.getElementById('descripcion'),
        btnLimpiarInsumo: document.getElementById('btnLimpiarInsumo')
    };

    const showError = (field, msg) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = msg;
            errorElement.style.display = 'block';
        }

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = 'none';
        }

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");

        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .removeClass('is-invalid')
                .addClass('is-valid');
        }
    };

    function validarNombreInsumo() {
        const nombre = elements.nombre_insumo.value.trim();

        if (nombre === "") {
            showError(elements.nombre_insumo, "El nombre del insumo es obligatorio");
            return false;
        }

        if (nombre.length > 50) {
            showError(elements.nombre_insumo, "El nombre del insumo no puede superar los 50 caracteres");
            return false;
        }

        clearError(elements.nombre_insumo);
        return true;
    }

    function validarTipoInsumo() {
        const tipo = elements.tipo_insumo.value;

        if (tipo === "" || tipo === null) {
            showError(elements.tipo_insumo, "Debe seleccionar un tipo de insumo");
            return false;
        }

        clearError(elements.tipo_insumo);
        return true;
    }

    function validarPresentacion() {
        const presentacion = elements.id_presentacion.value;

        if (presentacion === "" || presentacion === null) {
            showError(elements.id_presentacion, "Debe seleccionar una presentación");
            return false;
        }

        clearError(elements.id_presentacion);
        return true;
    }

    function validarFechaVencimiento() {
        const fecha = elements.fecha_vencimiento.value;

        if (fecha === "") {
            showError(elements.fecha_vencimiento, "La fecha de vencimiento es obligatoria");
            return false;
        }

        const hoy = new Date().toISOString().split("T")[0];
        if (fecha < hoy) {
            showError(elements.fecha_vencimiento, "La fecha de vencimiento no puede ser anterior a hoy");
            return false;
        }

        clearError(elements.fecha_vencimiento);
        return true;
    }

    function validarEstatus() {
        const estatus = elements.estatus.value;

        if (estatus === "" || estatus === null) {
            showError(elements.estatus, "Debe seleccionar un estatus");
            return false;
        }

        clearError(elements.estatus);
        return true;
    }

    function validarDescripcion() {
        const descripcion = elements.descripcion.value.trim();

        if (descripcion === "") {
            showError(elements.descripcion, "La descripción es obligatoria");
            return false;
        }

        if (descripcion.length > 255) {
            showError(elements.descripcion, "La descripción no puede superar los 255 caracteres");
            return false;
        }

        clearError(elements.descripcion);
        return true;
    }

    function limpiarFormulario() {
        form.reset();

        // Limpiar Select2
        $(elements.tipo_insumo).val(null).trigger('change');
        $(elements.id_presentacion).val(null).trigger('change');


        // Remover clases de validación y mensajes de error
        const fields = [
            elements.nombre_insumo,
            elements.tipo_insumo,
            elements.id_presentacion,
            elements.fecha_vencimiento,
            elements.estatus,
            elements.descripcion,
        ];

        fields.forEach(field => {
            if (!field) return;
            field.classList.remove('is-valid', 'is-invalid');

            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) {
                errorElement.textContent = "";
                errorElement.style.display = 'none';
            }

            if ($(field).hasClass('select2')) {
                $(field).next('.select2-container').find('.select2-selection')
                    .removeClass('is-invalid')
                    .removeClass('is-valid');
            }
        });
    }


    // Inputs de texto
    elements.nombre_insumo.addEventListener("input", validarNombreInsumo);
    elements.descripcion.addEventListener("input", validarDescripcion);

    // Selects con Select2 (tipo_insumo y id_presentacion)
    $(elements.tipo_insumo).on('change', validarTipoInsumo);
    $(elements.id_presentacion).on('change', validarPresentacion);

    // Fecha
    elements.fecha_vencimiento.addEventListener("change", validarFechaVencimiento);

    // Select normal (estatus)
    elements.estatus.addEventListener("change", validarEstatus);
    elements.btnLimpiarInsumo.addEventListener('click', limpiarFormulario);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarNombreInsumo(),
            validarDescripcion(),
            validarTipoInsumo(),
            validarPresentacion(),
            validarFechaVencimiento(),
            validarEstatus()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.exito) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        text: data.mensaje || 'Insumo registrado correctamente',
                        showConfirmButton: true
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.mensaje || 'No se pudo registrar el insumo'
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error inesperado al procesar la solicitud'
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Formulario incompleto',
                text: 'Por favor, rellene todos los campos obligatorios correctamente'
            });
        }
    });
});
