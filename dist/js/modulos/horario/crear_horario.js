document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-horario');

    const elements = {
        hora_inicio: document.getElementById('hora_inicio'),
        hora_fin: document.getElementById('hora_fin'),
        dia_semana: document.getElementById('dia_semana'),
        id_empleado: document.getElementById('id_empleado'),
        psicologo_nombre: document.getElementById('psicologo_nombre'),
        btnEliminarPsicologo: document.getElementById('btnEliminarPsicologo'),
        btnLimpiarHorario: document.getElementById('btnLimpiarHorario')
    };

    // Variables para almacenar el horario actual del psicólogo
    let horarioActual = [];

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

    const resetField = (field) => {
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = 'none';
        }

        // REMOVER ambas clases, no agregar is-valid
        field.classList.remove("is-invalid");
        field.classList.remove("is-valid");

        if ($(field).hasClass('select2')) {
            $(field).next('.select2-container').find('.select2-selection')
                .removeClass('is-invalid')
                .removeClass('is-valid');
        }
    };

    // ============================
    // VALIDACIONES DE PSICÓLOGO
    // ============================
    function validarEmpleado() {
        const id_empleado = elements.id_empleado.value;
        const psicologo_nombre = elements.psicologo_nombre.value;

        if (id_empleado === "") {
            showError(elements.id_empleado, "Debe seleccionar un psicólogo");
            return false;
        }

        if (psicologo_nombre === "") {
            showError(elements.psicologo_nombre, "El nombre del psicólogo es obligatorio");
            return false;
        }

        clearError(elements.id_empleado);
        clearError(elements.psicologo_nombre);
        return true;
    }

    // ============================
    // VALIDACIONES DE DÍA DE LA SEMANA
    // ============================
    function validarDiaSemana() {
        const dia_semana = elements.dia_semana.value;

        if (dia_semana === "") {
            showError(elements.dia_semana, "Debe seleccionar un día de la semana");
            return false;
        }

        clearError(elements.dia_semana);
        return true;
    }

    /**
     * Valida en tiempo real si el día ya está registrado para el psicólogo
     */
    async function validarDiaUnico() {
        const id_empleado = elements.id_empleado.value;
        const dia_semana = elements.dia_semana.value;

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
                    dia_semana: dia_semana
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

    // ============================
    // VALIDACIONES DE HORAS
    // ============================
    function validarHoraInicio() {
        const hora_inicio = elements.hora_inicio.value;

        if (hora_inicio === "") {
            showError(elements.hora_inicio, "La hora de inicio es obligatoria");
            return false;
        }

        // Validar formato HH:MM
        const horaRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!horaRegex.test(hora_inicio)) {
            showError(elements.hora_inicio, "Formato de hora inválido (use HH:MM)");
            return false;
        }

        const horaEnMinutos = convertirHoraAMinutos(hora_inicio);

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
    }

    function validarHoraFin() {
        const hora_fin = elements.hora_fin.value;

        if (hora_fin === "") {
            showError(elements.hora_fin, "La hora de fin es obligatoria");
            return false;
        }

        const horaRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!horaRegex.test(hora_fin)) {
            showError(elements.hora_fin, "Formato de hora inválido (use HH:MM)");
            return false;
        }

        const horaEnMinutos = convertirHoraAMinutos(hora_fin);

        // Rango estricto: 7:00 AM (420) a 4:00 PM (960)
        if (horaEnMinutos < 420) {
            showError(elements.hora_fin, "La hora de fin no puede ser antes de las 7:00 AM");
            return false;
        }

        if (horaEnMinutos > 960) {
            showError(elements.hora_fin, "La hora de fin no puede ser después de las 4:00 PM");
            return false;
        }

        clearError(elements.hora_fin);
        return true;
    }

    /**
 * Valida que la hora de fin sea mayor que la hora de inicio
 * y que el rango completo esté dentro del horario permitido
 */
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

    function convertirHoraAMinutos(hora) {
        const [horas, minutos] = hora.split(':').map(Number);
        return horas * 60 + minutos;
    }

    // ============================
    // FUNCIONES AUXILIARES
    // ============================
    function toggleBotonEliminar() {
        if (elements.id_empleado && elements.id_empleado.value && elements.btnEliminarPsicologo) {
            elements.btnEliminarPsicologo.style.display = 'block';
        } else if (elements.btnEliminarPsicologo) {
            elements.btnEliminarPsicologo.style.display = 'none';
        }
    }

    /**
     * Validación global que combina todas las validaciones de horas
     */
    function validarHorarioCompleto() {
        const validaciones = [
            validarHoraInicio(),
            validarHoraFin(),
            validarRangoHoras()
        ];

        return validaciones.every(val => val === true);
    }

    /**
     * Establece los límites en los inputs de tiempo para evitar entradas inválidas
     */
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

    function setupEliminarButtons() {
        // Botón para eliminar psicólogo
        if (elements.btnEliminarPsicologo) {
            elements.btnEliminarPsicologo.addEventListener('click', function () {
                elements.id_empleado.value = '';
                elements.psicologo_nombre.value = '';
                resetField(elements.id_empleado);
                resetField(elements.psicologo_nombre);
                toggleBotonEliminar();
                validarEmpleado();

                // Limpiar horario actual
                horarioActual = [];
            });
        }
    }

    /**
     * Carga el horario actual del psicólogo para referencia
     */
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

    // ============================
    // EVENTOS Y CONFIGURACIÓN
    // ============================

    // Evento para validar día único cuando cambia el select
    elements.dia_semana.addEventListener('change', async function () {
        validarDiaSemana();
        await validarDiaUnico();
    });

    // Eventos de validación en tiempo real
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

    // Evento cuando se selecciona un psicólogo
    elements.id_empleado.addEventListener('change', async function () {
        validarEmpleado();
        if (elements.id_empleado.value) {
            await cargarHorarioActual(elements.id_empleado.value);
        }
    });

    // Configurar modal de selección de psicólogos
    function inicializarDataTablePsicologos() {
        $('#tablaPsicologosModal').DataTable({
            ajax: {
                url: 'psicologos_data_json',
                dataSrc: 'data'
            },
            searching: true,
            pageLength: 10,
            language: {
                url: 'plugins/DataTables/js/languaje.json'
            },
            columns: [
                { data: 'cedula_completa' },
                { data: 'nombre_completo' },
                { data: 'correo' },
                { data: 'telefono' },
                {
                    data: 'id_empleado',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-sm btn-primary btn-seleccionar-psicologo" 
                                    data-id="${data}" 
                                    data-nombre="${row.nombre_completo}">
                                <i class="fas fa-check"></i> Seleccionar
                            </button>
                        `;
                    }
                }
            ],
            initComplete: function () {
                $(document).on('click', '.btn-seleccionar-psicologo', async function () {
                    const id = $(this).data('id');
                    const nombre = $(this).data('nombre');

                    elements.id_empleado.value = id;
                    elements.psicologo_nombre.value = nombre;
                    clearError(elements.id_empleado);
                    clearError(elements.psicologo_nombre);
                    toggleBotonEliminar();

                    $('#modalSeleccionarPsicologo').modal('hide');

                    // Cargar horario actual del psicólogo
                    await cargarHorarioActual(id);
                    validarEmpleado();

                    // Disparar evento de cambio
                    const event = new Event('change');
                    elements.id_empleado.dispatchEvent(event);

                    AlertManager.success('Psicólogo seleccionado',
                        `Has seleccionado a ${nombre}. Ahora configure su horario.`
                    );
                });
            }
        });
    }

    // ============================
    // VALIDACIÓN FINAL DEL FORMULARIO
    // ============================
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Ejecutar todas las validaciones
        const validaciones = [
            validarEmpleado(),
            validarDiaSemana(),
            validarHoraInicio(),
            validarHoraFin(),
            validarRangoHoras(),
            validarHorarioCompleto(),
            await validarDiaUnico()
        ];

        // Verificar si todas las validaciones pasaron
        const todasValidas = validaciones.every(val => val === true);

        if (todasValidas) {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            AlertManager.close();

            const data = await response.json();
            if (data.exito) {
                AlertManager.success('Registro exitoso', data.mensaje || 'El horario se ha registrado correctamente.');
                window.location.reload();
            } else {
                AlertManager.error('Error al registrar horario', data.mensaje || 'Ocurrió un error al registrar el horario.');
            }
        } else {
            AlertManager.error('Validación incompleta',
                'Por favor, corrija los errores marcados en el formulario antes de continuar.'
            );
        }
    });

    // ============================
    // INICIALIZACIÓN
    // ============================
    function inicializar() {
        setupEliminarButtons();
        toggleBotonEliminar();
        inicializarDataTablePsicologos();
        configurarLimitesInputTime();

        // Validación inicial si hay valores por defecto
        if (elements.hora_inicio.value || elements.hora_fin.value) {
            validarHorarioCompleto();
        }
    }

    // Iniciar
    inicializar();
});