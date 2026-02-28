/**
 * Inicializa las validaciones para el formulario de edición de un insumo
 * @param {number} id - ID del insumo que se está editando
 */

function validarEditarInsumo(id) {
    const form = document.getElementById('formEditarInsumo')
    if (!form) return;

    const elements = {
        nombre_insumo: document.getElementById('editar_nombre_insumo'),
        tipo_insumo: document.getElementById('editar_tipo_insumo'),
        id_presentacion: document.getElementById('editar_presentacion'),
        fecha_vencimiento: document.getElementById('editar_fecha_vencimiento'),
        descripcion: document.getElementById('editar_descripcion')
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

    // Inputs de texto
    elements.nombre_insumo.addEventListener("input", validarNombreInsumo);
    elements.descripcion.addEventListener("input", validarDescripcion);

    // Selects con Select2 (tipo_insumo y id_presentacion)
    $(elements.tipo_insumo).on('change', validarTipoInsumo);
    $(elements.id_presentacion).on('change', validarPresentacion);

    // Fecha
    elements.fecha_vencimiento.addEventListener("change", validarFechaVencimiento);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarNombreInsumo(),
            validarDescripcion(),
            validarTipoInsumo(),
            validarPresentacion(),
            validarFechaVencimiento()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);

                const response = await fetch('actualizar_insumo', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Edición exitosa", data.mensaje).then(() => {
                            $('#modalGenerico').modal('hide');

                            // Recargar DataTable
                            if ($.fn.DataTable.isDataTable('#tabla_insumos')) {
                                $('#tabla_insumos').DataTable().ajax.reload(null, false);
                            }
                        });
                    } else {
                        AlertManager.error("Error", data.error || data.mensaje || "Error desconocido");
                    }
                } else {
                    AlertManager.error("Error", "Error en la petición al servidor");
                }

            } catch (error) {
                console.error(error);
                AlertManager.error("Error", "Ocurrió un error inesperado");
            }
        } else {
            AlertManager.warning("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });
}