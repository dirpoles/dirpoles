/**
 * Inicializa las validaciones para el formulario de edición de citas
 * @param {number} id - ID de la cita que se está editando
 */
function validarEditarCita(id) {
    const form = document.getElementById('formEditarCita');
    if (!form) return;

    const elements = {
        fecha: document.getElementById('editar_fecha_cita'),
        hora: document.getElementById('editar_hora_cita'),
        id_cita: document.getElementById('id_cita'),
        id_empleado: document.getElementById('id_empleado')
    };

    const showError = (field, msg) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = msg;
            errorElement.style.display = 'block';
        }

        field.classList.add("is-invalid");
        field.classList.remove("is-valid");

        // Aplicar estilo al contenedor Select2 si existe
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

    async function validarFecha() {
        const fecha = elements.fecha.value;
        const idEmpleado = elements.id_empleado.value;
        const idCita = elements.id_cita.value;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (!fecha) {
            showError(elements.fecha, "La fecha es obligatoria");
            return false;
        }
        const fechaSeleccionada = new Date(fecha + 'T00:00:00');
        if (fechaSeleccionada < hoy) {
            showError(elements.fecha, "No puede seleccionar fechas pasadas");
            return false;
        }

        if (!idEmpleado) {
            showError(elements.fecha, "Primero seleccione un psicólogo");
            return false;
        }

        // Mapear getDay() (0..6) a nombres exactos que usa la BD
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dia_semana = dias[fechaSeleccionada.getDay()];

        try {
            const response = await fetch('validar_fecha_cita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({
                    id_cita: idCita,
                    id_empleado: idEmpleado,
                    dia_semana: dia_semana,
                    fecha: fecha
                })
            });

            if (!response.ok) throw new Error('Error HTTP ' + response.status);

            const data = await response.json();
            console.log("Respuesta validación fecha:", data);

            // Esperamos { exito:true, existe:true/false, mensaje:... }
            if (!data.exito) {
                showError(elements.fecha, data.mensaje || "Error al validar la fecha");
                return false;
            }
            if (!data.existe) {
                showError(elements.fecha, data.mensaje || "El psicólogo no trabaja este día");
                return false;
            }

            // Fecha OK
            clearError(elements.fecha);
            return true;

        } catch (err) {
            console.error('Error validando la fecha:', err);
            showError(elements.fecha, "Error al validar la fecha");
            return false;
        }
    }

    async function validarHora() {
        const hora = elements.hora.value;
        const fecha = elements.fecha.value;
        const idEmpleado = elements.id_empleado.value;
        const idCita = elements.id_cita.value;

        if (!hora) {
            showError(elements.hora, "La hora es obligatoria");
            return false;
        }
        if (!idEmpleado) {
            showError(elements.hora, "Primero seleccione un psicólogo");
            return false;
        }
        if (!fecha) {
            showError(elements.hora, "Primero seleccione una fecha");
            return false;
        }

        // Mapear día con acento
        const fechaObj = new Date(fecha + 'T00:00:00');
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaSemana = dias[fechaObj.getDay()];

        try {
            const response = await fetch('validar_hora_cita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new URLSearchParams({
                    id_cita: idCita,
                    id_empleado: idEmpleado,
                    hora: hora,
                    dia_semana: diaSemana,
                    fecha: fecha
                })
            });

            if (!response.ok) throw new Error('Error HTTP ' + response.status);

            const data = await response.json();
            console.log("Respuesta validación hora:", data);

            if (!data.exito) {
                showError(elements.hora, data.mensaje || "Error en validación");
                return false;
            }
            // data.existe => si la hora pertenece a la franja del psicólogo
            // data.disponible => si no existe cita que choque
            if (data.existe === false) {
                showError(elements.hora, data.mensaje || "La hora seleccionada no está dentro del horario del psicólogo");
                return false;
            }
            if (data.disponible === false) {
                showError(elements.hora, data.mensaje || "Esta hora ya está ocupada para este psicólogo");
                return false;
            }

            clearError(elements.hora);
            return true;

        } catch (err) {
            console.error('Error validando la hora:', err);
            showError(elements.hora, "Error al validar la hora");
            return false;
        }
    }

    //Listeners
    elements.fecha.addEventListener('change', validarFecha);
    elements.hora.addEventListener('input', validarHora);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            await validarFecha(),
            await validarHora()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch('actualizar_cita', {
                    method: 'POST',
                    body: formData
                })
                AlertManager.close();

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Edición exitosa", data.mensaje).then(() => {
                            $('#modalCita').modal('hide');
                            // Recargar DataTable con Ajax
                            if (window.dataTableInstance) {
                                window.dataTableInstance.ajax.reload(null, false);
                            } else if ($.fn.DataTable.isDataTable('#tabla_citas')) {
                                $('#tabla_citas').DataTable().ajax.reload(null, false);
                            }

                        });
                    } else {
                        AlertManager.error("Error", data.error || data.mensaje || "Error desconocido");
                    }
                } else {
                    AlertManager.error("Error", "Error en la petición al servidor");
                }

            } catch (error) {
                AlertManager.close();
                console.error(error);
                AlertManager.error("Error", "Ocurrió un error inesperado");
            }
        } else {
            AlertManager.error("Formulario incompleto", "Corrige los campos resaltados antes de continuar");
        }
    });
}