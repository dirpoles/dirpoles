document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-cita');
    if (!form) return;

    const elements = {
        id_beneficiario: document.getElementById('id_beneficiario'),
        id_empleado: document.getElementById('id_empleado'),
        fecha: document.getElementById('fecha'),
        hora: document.getElementById('hora'),
        beneficiario_nombre: document.getElementById('beneficiario_nombre'),
        psicologo_nombre: document.getElementById('psicologo_nombre'),
        btnEliminarBeneficiario: document.getElementById('btnEliminarBeneficiario'),
        btnEliminarPsicologo: document.getElementById('btnEliminarPsicologo')
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

    function validarBeneficiario() {
        const beneficiario_nombre = elements.beneficiario_nombre.value;

        if (beneficiario_nombre === "") {
            showError(elements.id_beneficiario, "El beneficiario es obligatorio");
            showError(elements.beneficiario_nombre, "El beneficiario es obligatorio");
            return false;
        }

        clearError(elements.id_beneficiario);
        clearError(elements.beneficiario_nombre);
        toggleBotonEliminar();
        return true;
    }

    function validarEmpleado() {
        const psicologo_nombre = elements.psicologo_nombre.value;

        if (psicologo_nombre === "") {
            showError(elements.id_empleado, "El psicólogo es obligatorio");
            showError(elements.psicologo_nombre, "El psicólogo es obligatorio");
            return false;
        }

        clearError(elements.id_empleado);
        clearError(elements.psicologo_nombre);
        toggleBotonEliminar();
        return true;
    }

    async function validarFecha() {
        const fecha = elements.fecha.value;
        const idEmpleado = elements.id_empleado.value;
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
                    id_empleado: idEmpleado,
                    dia_semana: dia_semana,
                    fecha: fecha // opcional pero útil
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

    function setupEliminarButtons() {
        // Botón para eliminar beneficiario
        if (elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.addEventListener('click', function () {
                elements.id_beneficiario.value = '';
                elements.beneficiario_nombre.value = '';
                clearError(elements.id_beneficiario);
                clearError(elements.beneficiario_nombre);
                toggleBotonEliminar();
                validarBeneficiario();
            });
        }

        // Botón para eliminar psicólogo
        if (elements.btnEliminarPsicologo) {
            elements.btnEliminarPsicologo.addEventListener('click', function () {
                elements.id_empleado.value = '';
                elements.psicologo_nombre.value = '';
                clearError(elements.id_empleado);
                clearError(elements.psicologo_nombre);
                toggleBotonEliminar();
                validarEmpleado();

                // Limpiar horario y selects
                $('#tabla-horarios-container').html(`
                    <div class="text-center text-muted py-4">
                        <i class="fas fa-calendar-alt fa-2x mb-3"></i>
                        <p>Seleccione un psicólogo para ver su horario</p>
                    </div>
                `);
                $('#titulo-horarios').text('Horario del Psicólogo');

                // Resetear variables globales
                horarioPsicologo = null;
                citasAgendadas = [];
                diasPermitidos = [];
            });
        }
    }

    async function cargarHorarioPsicologo(idEmpleado, nombrePsicologo) {
        try {
            // Mostrar loading
            $('#tabla-horarios-container').html(`
                <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2 text-muted">Cargando horario del psicólogo...</p>
                </div>
            `);

            // Petición para obtener horarios y días del psicólogo
            const response = await fetch(`obtener_horario_psicologo?id_empleado=${idEmpleado}`);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();

            if (data.exito) {
                horarioPsicologo = data.data.horario || [];
                citasAgendadas = data.data.citas || [];
                diasPermitidos = data.data.dias || [];

                // Verificar si hay horarios
                if (horarioPsicologo.length === 0) {
                    $('#tabla-horarios-container').html(`
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Este psicólogo no tiene horario asignado.
                        </div>
                    `);
                    AlertManager.showWarning('Sin horario', 'El psicólogo seleccionado no tiene horario asignado. Debe asignarle un horario primero.');

                    // Deshabilitar fecha y hora
                    resetFechaHoraSelects();
                    return;
                }

                // Mostrar horarios
                $('#titulo-horarios').text(`Horario de ${nombrePsicologo}`);
                mostrarTablaHorarios(horarioPsicologo);

                console.log("Días permitidos cargados:", diasPermitidos);

            } else {
                $('#tabla-horarios-container').html(`
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${data.mensaje || 'No se pudo cargar el horario del psicólogo'}
                    </div>
                `);
                AlertManager.showError('Error', data.mensaje || 'Error al cargar horario');
            }

        } catch (error) {
            console.error('Error al cargar horario:', error);
            $('#tabla-horarios-container').html(`
                <div class="alert alert-danger">
                    <i class="fas fa-times-circle me-2"></i>
                    Error al cargar el horario del psicólogo
                </div>
            `);
            AlertManager.showError('Error', 'Error de conexión al cargar el horario');
        }
    }

    function mostrarTablaHorarios(horarios) {
        if (!horarios || horarios.length === 0) {
            $('#tabla-horarios-container').html(`
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Este psicólogo no tiene horario definido
                </div>
            `);
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="table table-bordered table-sm">
                    <thead class="table-light">
                        <tr>
                            <th>Día</th>
                            <th>Hora Inicio</th>
                            <th>Hora Fin</th>
                            <th>Disponibilidad</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        horarios.forEach(horario => {
            const horasDisponibles = calcularHorasDisponibles(horario.hora_inicio, horario.hora_fin);
            const citasDia = citasAgendadas.filter(c => c.dia_semana === horario.dia_semana);
            const disponible = horasDisponibles - citasDia.length;

            let badgeClass = 'bg-success';
            if (disponible < 3) badgeClass = 'bg-warning';
            if (disponible === 0) badgeClass = 'bg-danger';

            html += `
                <tr>
                    <td><strong>${horario.dia_semana}</strong></td>
                    <td>${formatearHoraDisplay(horario.hora_inicio)}</td>
                    <td>${formatearHoraDisplay(horario.hora_fin)}</td>
                    <td>
                        <span class="badge ${badgeClass}">
                            ${disponible} de ${horasDisponibles} citas disponibles
                        </span>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
            <div class="mt-2 small text-muted">
                <i class="fas fa-info-circle me-1"></i>
                Cada cita tiene una duración de 1 hora
            </div>
        `;

        $('#tabla-horarios-container').html(html);
    }

    function calcularHorasDisponibles(horaInicio, horaFin) {
        const inicioMinutos = convertirAMinutos(horaInicio);
        const finMinutos = convertirAMinutos(horaFin);
        const duracionCita = 60; // 1 hora en minutos
        let horasDisponibles = 0;

        for (let minuto = inicioMinutos; minuto + duracionCita <= finMinutos; minuto += duracionCita) {
            horasDisponibles++;
        }

        return horasDisponibles;
    }

    function convertirAMinutos(hora) {
        const [horas, minutos] = hora.split(':').map(Number);
        return horas * 60 + minutos;
    }

    function formatearHoraDisplay(hora24) {
        const [horas, minutos] = hora24.split(':').map(Number);
        const ampm = horas >= 12 ? 'PM' : 'AM';
        const horas12 = horas % 12 || 12;
        return `${horas12}:${minutos.toString().padStart(2, '0')} ${ampm}`;
    }

    function toggleBotonEliminar() {
        if (elements.id_beneficiario && elements.id_beneficiario.value && elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.style.display = 'block';
        } else if (elements.btnEliminarBeneficiario) {
            elements.btnEliminarBeneficiario.style.display = 'none';
        }

        if (elements.id_empleado && elements.id_empleado.value && elements.btnEliminarPsicologo) {
            elements.btnEliminarPsicologo.style.display = 'block';
        } else if (elements.btnEliminarPsicologo) {
            elements.btnEliminarPsicologo.style.display = 'none';
        }
    }

    function inicializarDataTableBeneficiarios() {
        $('#tablaBeneficiariosModal').DataTable({
            ajax: {
                url: 'beneficiarios_activos_data_json',
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
                { data: 'nombre_pnf' },
                { data: 'seccion' },
                {
                    data: 'id_beneficiario',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-sm btn-primary btn-seleccionar-beneficiario" 
                                    data-id="${data}" 
                                    data-nombre="${row.nombre_completo}">
                                <i class="fas fa-check"></i> Seleccionar
                            </button>
                        `;
                    }
                }
            ],
            initComplete: function () {
                $(document).on('click', '.btn-seleccionar-beneficiario', function () {
                    const id = $(this).data('id');
                    const nombre = $(this).data('nombre');

                    elements.id_beneficiario.value = id;
                    elements.beneficiario_nombre.value = nombre;
                    clearError(elements.id_beneficiario);
                    clearError(elements.beneficiario_nombre);
                    toggleBotonEliminar();

                    $('#modalSeleccionarBeneficiario').modal('hide');
                    validarBeneficiario();
                });
            }
        });
    }

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
                $(document).on('click', '.btn-seleccionar-psicologo', function () {
                    const id = $(this).data('id');
                    const nombre = $(this).data('nombre');

                    elements.id_empleado.value = id;
                    elements.psicologo_nombre.value = nombre;
                    clearError(elements.id_empleado);
                    clearError(elements.psicologo_nombre);

                    $('#modalSeleccionarPsicologo').modal('hide');
                    cargarHorarioPsicologo(id, nombre);
                    validarEmpleado();
                });
            }
        });
    }

    // EventListeners para tiempo real
    if (elements.id_beneficiario) {
        elements.id_beneficiario.addEventListener('change', validarBeneficiario);
        elements.id_beneficiario.addEventListener('change', toggleBotonEliminar);
    }

    if (elements.id_empleado) {
        elements.id_empleado.addEventListener('change', validarEmpleado);
        elements.id_empleado.addEventListener('change', toggleBotonEliminar);
    }

    elements.fecha.addEventListener('input', validarFecha);
    elements.hora.addEventListener('input', validarHora);

    // Configurar eventos para modales DataTables
    $('#modalSeleccionarBeneficiario').on('shown.bs.modal', function () {
        if ($.fn.DataTable.isDataTable('#tablaBeneficiariosModal')) {
            $('#tablaBeneficiariosModal').DataTable().destroy();
        }
        inicializarDataTableBeneficiarios();
    });

    $('#modalSeleccionarPsicologo').on('shown.bs.modal', function () {
        if ($.fn.DataTable.isDataTable('#tablaPsicologosModal')) {
            $('#tablaPsicologosModal').DataTable().destroy();
        }
        inicializarDataTablePsicologos();
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const validaciones = [
            validarBeneficiario(),
            validarEmpleado(),
            await validarFecha(),
            await validarHora()
        ];

        if (validaciones.every(v => v === true)) {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                })
                AlertManager.close();

                if (response.ok) {
                    const data = await response.json();

                    if (data.exito) {
                        AlertManager.success("Registro exitoso", data.mensaje).then(() => {
                            window.location.reload();
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

    // Estado inicial de la tabla de horarios
    $('#tabla-horarios-container').html(`
        <div class="text-center text-muted py-4">
            <i class="fas fa-calendar-alt fa-2x mb-3"></i>
            <p>Seleccione un psicólogo para ver su horario</p>
        </div>
    `);

    // Configurar botones de eliminar
    setupEliminarButtons();

    // Estado inicial de los botones de eliminar
    toggleBotonEliminar();

    console.log('Módulo de citas cargado correctamente');
});