/**
 * Inicializa las validaciones para el formulario de edición del horario
 * @param {number} id - ID del horario que se está editando
 */

function validar_editar_horario(id) {
    const form = document.getElementById('formEditarHorario');
    if (!form) return;

    const elements = {
        id_horario: document.getElementById('editar_id_horario'),
        id_empleado: document.getElementById('editar_id_empleado'),
        dia_semana: document.getElementById('editar_dia_semana'),
        hora_inicio: document.getElementById('editar_hora_inicio'),
        hora_fin: document.getElementById('editar_hora_fin')
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

    function validarDiaSemana() {
        if (elements.dia_semana.value.trim() === "") {
            showError(elements.dia_semana, "El día de la semana es obligatorio");
            return false;
        }
        clearError(elements.dia_semana);
        return true;
    };

    function validarHoraInicio() {
        const horaInicio = elements.hora_inicio.value.trim();

        if (horaInicio === "") {
            showError(elements.hora_inicio, "La hora de inicio es obligatoria");
            return false;
        }

        // Validar formato HH:MM
        const horaRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!horaRegex.test(horaInicio)) {
            showError(elements.hora_inicio, "Formato de hora inválido (use HH:MM)");
            return false;
        }

        const horaEnMinutos = convertirHoraAMinutos(horaInicio);

        // Rango estricto: 7:00 AM (420) a 4:00 PM (960)
        if (horaEnMinutos < 420) {
            showError(elements.hora_inicio, "La hora de inicio no puede ser antes de las 7:00 AM");
            return false;
        }

        if (horaEnMinutos > 960) {
            showError(elements.hora_inicio, "La hora de inicio no puede ser después de las 4:00 PM");
            return false;
        }

        clearError(elements.hora_inicio);
        return true;
    };

    function validarHoraFin() {
        const horaFin = elements.hora_fin.value.trim();
        if (horaFin === "") {
            showError(elements.hora_fin, "La hora de fin es obligatoria");
            return false;
        }

        // Validar formato HH:MM
        const horaRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!horaRegex.test(horaFin)) {
            showError(elements.hora_fin, "Formato de hora inválido (use HH:MM)");
            return false;
        }

        const horaEnMinutos = convertirHoraAMinutos(horaFin);

        if (horaEnMinutos < 420 || horaEnMinutos > 960) {
            showError(elements.hora_fin, "La hora de fin debe estar entre 7:00 AM y 4:00 PM");
            return false;
        }

        clearError(elements.hora_fin);
        return true;
    };

    function convertirHoraAMinutos(hora) {
        const [horas, minutos] = hora.split(':').map(Number);
        return horas * 60 + minutos;
    }

    function validarRangoHoras() {
        const hora_inicio = elements.hora_inicio.value;
        const hora_fin = elements.hora_fin.value;

        if (!hora_inicio || !hora_fin) {
            return true; // No hay datos suficientes
        }

        const inicioMinutos = convertirHoraAMinutos(hora_inicio);
        const finMinutos = convertirHoraAMinutos(hora_fin);

        // Validar que todo el rango esté dentro de 7:00 AM - 4:00 PM
        if (inicioMinutos < 420 || inicioMinutos > 960) {
            showError(elements.hora_inicio, "El horario completo debe estar entre 7:00 AM y 4:00 PM");
            return false;
        }

        if (finMinutos < 420 || finMinutos > 960) {
            showError(elements.hora_fin, "El horario completo debe estar entre 7:00 AM y 4:00 PM");
            return false;
        }

        // Validar que la hora de fin sea mayor que la de inicio
        if (finMinutos <= inicioMinutos) {
            showError(elements.hora_fin, "La hora de fin debe ser posterior a la hora de inicio");
            return false;
        }

        // Validar duración mínima (1 hora = 60 minutos)
        const duracion = finMinutos - inicioMinutos;
        if (duracion < 60) {
            showError(elements.hora_fin, "La duración mínima del horario es de 1 hora");
            return false;
        }

        // Validar que no exceda el horario laboral máximo (9 horas)
        if (duracion > 540) { // 9 horas = 540 minutos
            showError(elements.hora_fin, "La duración máxima del horario es de 9 horas");
            return false;
        }

        clearError(elements.hora_inicio);
        clearError(elements.hora_fin);
        return true;
    }

    async function validarDiaUnico() {
        const id_empleado = elements.id_empleado.value;
        const dia_semana = elements.dia_semana.value;
        const id_horario = elements.id_horario.value;

        if (!id_empleado || !dia_semana) {
            return true; // No hay datos suficientes para validar
        }

        try {
            const response = await fetch('validar_dia_horario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    id_empleado: id_empleado,
                    dia_semana: dia_semana,
                    id_horario: id_horario
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.existe) {
                showError(elements.dia_semana,
                    `El psicólogo ya tiene un horario registrado para los ${dia_semana}. ` +
                    `Por favor, seleccione otro día o modifique el horario existente.`
                );
                return false;
            } else {
                clearError(elements.dia_semana);
                return true;
            }
        } catch (error) {
            console.error('Error al validar día único:', error);
            // En caso de error, no bloqueamos pero mostramos alerta
            AlertManager.warning('Advertencia', 'No se pudo verificar la disponibilidad del día. Verifique manualmente.');
            return true;
        }
    }

    function validarHorarioCompleto() {
        const validaciones = [
            validarHoraInicio(),
            validarHoraFin(),
            validarRangoHoras(),
            validarDiaUnico()
        ];
        return validaciones.every(val => val === true);
    }

    function configurarLimitesInputTime() {
        // Establecer atributos min y max en los inputs
        elements.hora_inicio.setAttribute('min', '07:00');
        elements.hora_inicio.setAttribute('max', '16:00');
        elements.hora_fin.setAttribute('min', '07:00');
        elements.hora_fin.setAttribute('max', '16:00');

        // Agregar tooltips informativos
        elements.hora_inicio.title = "Horario permitido: 7:00 AM - 4:00 PM";
        elements.hora_fin.title = "Horario permitido: 7:00 AM - 4:00 PM";

        // Evento para validar en tiempo real cuando el usuario interactúa con el input
        elements.hora_inicio.addEventListener('change', function () {
            // Si el usuario selecciona una hora fuera del rango, ajustar
            const hora = this.value;
            if (hora) {
                const minutos = convertirHoraAMinutos(hora);
                if (minutos < 420) {
                    this.value = '07:00';
                    AlertManager.warning('Ajuste automático', 'La hora se ajustó al mínimo permitido (7:00 AM)');
                } else if (minutos > 960) {
                    this.value = '16:00';
                    AlertManager.warning('Ajuste automático', 'La hora se ajustó al máximo permitido (4:00 PM)');
                }
            }
            validarHorarioCompleto();
        });

        elements.hora_fin.addEventListener('change', function () {
            const hora = this.value;
            if (hora) {
                const minutos = convertirHoraAMinutos(hora);
                if (minutos < 420) {
                    this.value = '07:00';
                    AlertManager.warning('Ajuste automático', 'La hora se ajustó al mínimo permitido (7:00 AM)');
                } else if (minutos > 960) {
                    this.value = '16:00';
                    AlertManager.warning('Ajuste automático', 'La hora se ajustó al máximo permitido (4:00 PM)');
                }
            }
            validarHorarioCompleto();
        });
    }

    async function cargarHorarioActual(id_empleado) {
        try {
            const response = await fetch(`obtener_horario_psicologo?id_empleado=${id_empleado}`);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            if (data.exito) {
                horarioActual = data.data.horario || [];
                console.log('Horario actual cargado:', horarioActual);

                // Mostrar advertencia si el psicólogo ya tiene horarios
                if (horarioActual.length > 0) {
                    AlertManager.info('Información',
                        `Este psicólogo ya tiene ${horarioActual.length} día(s) con horario asignado. ` +
                        `Se validará que no se repita el día seleccionado.`
                    );
                }
            }
        } catch (error) {
            console.error('Error al cargar horario actual:', error);
            horarioActual = [];
        }
    }

    //AddEventListener
    elements.dia_semana.addEventListener('change', async function () {
        validarDiaSemana();
        await validarDiaUnico();
    });

    elements.hora_inicio.addEventListener('input', function () {
        validarHoraInicio();
        // Si ya hay una hora de fin, validar el rango
        if (elements.hora_fin.value) {
            validarRangoHoras();
        }
    });

    elements.hora_fin.addEventListener('input', function () {
        validarHoraFin();
        // Si ya hay una hora de inicio, validar el rango
        if (elements.hora_inicio.value) {
            validarRangoHoras();
        }
    });

    // Evento de blur para validación más estricta
    elements.hora_inicio.addEventListener('blur', function () {
        validarHorarioCompleto();
    });

    elements.hora_fin.addEventListener('blur', function () {
        validarHorarioCompleto();
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const resultadoDia = validarDiaSemana();
        const resultadoInicio = validarHoraInicio();
        const resultadoFin = validarHoraFin();
        const resultadoRango = validarRangoHoras();
        const resultadoUnico = await validarDiaUnico();

        console.log('Resultados validación:', {
            resultadoDia,
            resultadoInicio,
            resultadoFin,
            resultadoRango,
            resultadoUnico
        });

        const todasValidas = [
            validarDiaSemana(),
            validarHoraInicio(),
            validarHoraFin(),
            validarRangoHoras(),
            await validarDiaUnico()
        ].every(val => val === true);

        try {
            if (todasValidas) {
                // ✅ CORRECCIÓN: FormData con F mayúscula
                const formData = new FormData(form);

                const response = await fetch('actualizar_horario', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                if (data.exito) {
                    AlertManager.success('Edición exitosa', data.mensaje || 'Horario editado exitosamente');

                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);

                    // Cerrar el modal después de 1.5 segundos
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('modalHorario'));
                        if (modal) {
                            modal.hide();
                        }
                    }, 1500);

                } else {
                    AlertManager.error('Error', data.mensaje || 'Error al editar el horario');
                }
            } else {
                AlertManager.error('Formulario inválido', 'Corrige los errores antes de enviar.');
            }
        } catch (error) {
            console.error('Error al editar horario:', error);
            AlertManager.error('Error', 'No se pudo editar el horario. Intente nuevamente.');
        }
    });

    function inicializar() {
        configurarLimitesInputTime();
        cargarHorarioActual(elements.id_empleado.value);
    }

    inicializar();
}