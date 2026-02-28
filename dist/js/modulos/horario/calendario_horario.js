// calendario_horarios.js
$(document).ready(function () {
    let horariosData = [];
    let currentHorarioId = null;

    // Inicializar
    cargarCalendario();

    // Botones de navegación semanal
    $('#prev-week').click(() => alert('Funcionalidad por implementar'));
    $('#next-week').click(() => alert('Funcionalidad por implementar'));
    $('#current-week').click(() => cargarCalendario());

    // Botón de tabla
    $('#btn-ver-tabla').click(function () {
        window.location.href = 'horarios_tabla'; // Puedes crear esta vista si la necesitas
    });

    // Botón nuevo horario
    $('#btn-nuevo-horario').click(function () {
        window.location.href = 'crear_horario';
    });

    // Filtros
    $('#filter-psicologo').on('input', filtrarCalendario);
    $('#filter-dia').on('change', filtrarCalendario);

    // Función principal para cargar el calendario
    function cargarCalendario() {
        $.ajax({
            url: 'horarios_calendario_json',
            method: 'GET',
            dataType: 'json',
            beforeSend: function () {
                $('#calendario-body').html(`
                    <tr>
                        <td colspan="8" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Cargando...</span>
                            </div>
                            <p class="mt-2 text-muted">Cargando horarios...</p>
                        </td>
                    </tr>
                `);
            },
            success: function (response) {
                if (response.exito) {
                    horariosData = response.data;
                    renderizarCalendario(horariosData);
                } else {
                    mostrarError('Error al cargar horarios: ' + response.mensaje);
                }
            },
            error: function (xhr, status, error) {
                mostrarError('Error de conexión: ' + error);
            }
        });
    }

    // Renderizar el calendario
    function renderizarCalendario(data) {
        const tbody = $('#calendario-body');
        tbody.empty();

        if (!data || data.length === 0) {
            tbody.html(`
                <tr>
                    <td colspan="8" class="text-center py-5">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            No hay horarios registrados.
                        </div>
                        <button class="btn btn-primary mt-2" onclick="window.location.href='crear_horario'">
                            <i class="fa-solid fa-clock me-1"></i> Crear primer horario
                        </button>
                    </td>
                </tr>
            `);
            return;
        }

        // Agrupar horarios por psicólogo
        const horariosPorPsicologo = {};

        data.forEach(horario => {
            const key = horario.id_empleado;
            if (!horariosPorPsicologo[key]) {
                horariosPorPsicologo[key] = {
                    id_empleado: horario.id_empleado,
                    nombre_completo: horario.nombre_completo,
                    horarios: []
                };
            }
            horariosPorPsicologo[key].horarios.push(horario);
        });

        // Crear filas para cada psicólogo
        Object.values(horariosPorPsicologo).forEach(psicologo => {
            const row = $('<tr class="psicologo-row"></tr>');

            // Columna del psicólogo
            row.append(`
                <td class="psicologo-name">
                    <strong>${psicologo.nombre_completo}</strong><br>
                    <small class="text-muted">${psicologo.horarios.length} horario(s)</small>
                </td>
            `);

            // Crear celdas para cada día de la semana
            const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

            dias.forEach(dia => {
                const horariosDia = psicologo.horarios.filter(h => h.dia_semana === dia);
                const cell = $('<td class="horario-cell"></td>');

                if (horariosDia.length > 0) {
                    // Ordenar por hora de inicio
                    horariosDia.sort((a, b) => {
                        return a.hora_inicio.localeCompare(b.hora_inicio);
                    });

                    // Agregar cada horario del día
                    horariosDia.forEach(horario => {
                        const duracion = calcularDuracion(horario.hora_inicio, horario.hora_fin);
                        const claseTipo = duracion >= 6 ? 'horario-normal' :
                            duracion >= 3 ? 'horario-parcial' : 'horario-conflicto';

                        const horarioHtml = `
                            <div class="horario-item ${claseTipo}" 
                                 data-id="${horario.id_horario}"
                                 data-psicologo="${psicologo.nombre_completo}"
                                 data-dia="${dia}"
                                 data-inicio="${horario.hora_inicio}"
                                 data-fin="${horario.hora_fin}">
                                <span class="horario-time">
                                    ${formatearHora(horario.hora_inicio)} - ${formatearHora(horario.hora_fin)}
                                </span>
                                <small>${duracion}h</small>
                                <div class="horario-actions">
                                    <button class="btn btn-sm btn-outline-primary btn-editar-horario" 
                                            data-id="${horario.id_horario}"
                                            title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger btn-eliminar-horario" 
                                            data-id="${horario.id_horario}"
                                            title="Eliminar">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                        cell.append(horarioHtml);
                    });
                } else {
                    cell.addClass('dia-vacio');
                    cell.html('<span class="horario-empty">Sin horario</span>');
                }

                row.append(cell);
            });

            tbody.append(row);
        });

        // Asignar eventos a los horarios
        asignarEventosHorarios();
    }

    // Función para filtrar el calendario
    function filtrarCalendario() {
        const filtroPsicologo = $('#filter-psicologo').val().toLowerCase();
        const filtroDia = $('#filter-dia').val();

        $('.psicologo-row').each(function () {
            const $row = $(this);
            const nombrePsicologo = $row.find('.psicologo-name strong').text().toLowerCase();
            let mostrarFila = true;

            // Filtrar por psicólogo
            if (filtroPsicologo && !nombrePsicologo.includes(filtroPsicologo)) {
                mostrarFila = false;
            }

            // Filtrar por día
            if (filtroDia) {
                const tieneHorarioDia = $row.find(`td:nth-child(${obtenerIndiceDia(filtroDia)}) .horario-item`).length > 0;
                if (!tieneHorarioDia) {
                    mostrarFila = false;
                }
            }

            $row.toggle(mostrarFila);
        });
    }

    // Asignar eventos a los horarios
    function asignarEventosHorarios() {
        // Click en horario para ver detalle
        $('.horario-item').off('click').on('click', function (e) {
            if (!$(e.target).closest('.horario-actions').length) {
                const id = $(this).data('id');
                mostrarDetalleHorario(id);
            }
        });

        // Botones de edición
        $('.btn-editar-horario').off('click').on('click', function (e) {
            e.stopPropagation();
            const id = $(this).data('id');
            editarHorario(id);
        });

        // Botones de eliminación
        $('.btn-eliminar-horario').off('click').on('click', function (e) {
            e.stopPropagation();
            const id = $(this).data('id');
            eliminarHorario(id);
        });
    }

    // Mostrar detalle del horario en modal
    // Función mejorada para mostrar detalle del horario
    function mostrarDetalleHorario(id) {
        const horario = horariosData.find(h => h.id_horario == id);
        if (!horario) {
            AlertManager.showError('Error', 'No se encontró el horario seleccionado');
            return;
        }

        // Buscar todos los horarios del mismo psicólogo
        const horariosPsicologo = horariosData.filter(h => h.id_empleado === horario.id_empleado);

        // Calcular estadísticas
        const duracion = calcularDuracion(horario.hora_inicio, horario.hora_fin);
        const totalHoras = calcularTotalHorasSemana(horariosPsicologo);
        const diasAsignados = new Set(horariosPsicologo.map(h => h.dia_semana)).size;
        const promedioDiario = diasAsignados > 0 ? (totalHoras / diasAsignados).toFixed(1) : 0;

        // Determinar tipo de horario
        let tipoColor, tipoTexto, tipoIcono;
        if (duracion >= 6) {
            tipoColor = 'bg-success';
            tipoTexto = 'Jornada Completa';
            tipoIcono = 'fas fa-check-circle';
        } else if (duracion >= 3) {
            tipoColor = 'bg-warning';
            tipoTexto = 'Media Jornada';
            tipoIcono = 'fas fa-clock';
        } else {
            tipoColor = 'bg-danger';
            tipoTexto = 'Turno Corto';
            tipoIcono = 'fas fa-exclamation-triangle';
        }

        // Mapeo de colores para días (consistente con el calendario)
        const diasColors = {
            'Lunes': 'primary',
            'Martes': 'success',
            'Miércoles': 'info',
            'Jueves': 'warning',
            'Viernes': 'danger',
            'Sábado': 'secondary'
        };

        const diaColor = diasColors[horario.dia_semana] || 'secondary';

        // Actualizar barra de estado
        $('#modal-status-bar').html(`
        <span class="badge ${tipoColor} d-flex align-items-center">
            <i class="${tipoIcono} me-1"></i> ${tipoTexto}
        </span>
        <span class="text-muted small ms-2">
            <i class="fas fa-calendar me-1"></i>${horario.dia_semana} • 
            <i class="fas fa-clock me-1"></i>${formatearHora(horario.hora_inicio)} - ${formatearHora(horario.hora_fin)}
        </span>
    `);

        // Llenar datos principales
        $('#detalle-nombre-psicologo').text(horario.nombre_completo || 'Sin nombre');
        $('#detalle-cedula').text(extractCedula(horario) || 'Sin cédula');
        $('#detalle-hora-inicio').text(formatearHora(horario.hora_inicio));
        $('#detalle-hora-fin').text(formatearHora(horario.hora_fin));
        $('#detalle-duracion').text(`${duracion.toFixed(1)} horas`);

        // Actualizar badge del día
        $('#detalle-dia-badge').html(`
        <span class="badge bg-${diaColor} p-2 px-3">
            <i class="fas fa-calendar-day me-2"></i>${horario.dia_semana}
        </span>
    `);

        // Actualizar estadísticas
        $('#detalle-total-horarios').text(horariosPsicologo.length);
        $('#detalle-total-dias').text(diasAsignados);
        $('#detalle-total-horas').text(totalHoras.toFixed(1));
        $('#detalle-promedio-diario').text(promedioDiario);

        currentHorarioId = id;
        $('#modalHorarioDetalle').modal('show');
    }

    // Funciones de utilidad adicionales
    function calcularTotalHorasSemana(horarios) {
        return horarios.reduce((total, horario) => {
            return total + calcularDuracion(horario.hora_inicio, horario.hora_fin);
        }, 0);
    }

    // Función corregida para extraer cédula
    function extractCedula(horario) {
        // Si ya tenemos cedula_completa, usarla directamente
        if (horario.cedula_completa) {
            return horario.cedula_completa;
        }

        // Si tenemos tipo_cedula y cedula separados, combinarlos
        if (horario.tipo_cedula && horario.cedula) {
            return `${horario.tipo_cedula}-${horario.cedula}`;
        }

        // Intentar extraer del nombre_completo si tiene formato especial
        if (horario.nombre_completo && horario.nombre_completo.includes('(')) {
            const match = horario.nombre_completo.match(/\(([^)]+)\)/);
            return match ? match[1] : 'Sin cédula';
        }

        return 'Sin cédula';
    }

    // Función para formatear hora (24h a 12h AM/PM)
    function formatearHora(hora24) {
        if (!hora24) return '--:--';

        const [horas, minutos] = hora24.split(':').map(Number);
        const ampm = horas >= 12 ? 'PM' : 'AM';
        const horas12 = horas % 12 || 12;
        return `${horas12.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} ${ampm}`;
    }

    // Función para calcular duración
    function calcularDuracion(inicio, fin) {
        if (!inicio || !fin) return 0;

        const [h1, m1] = inicio.split(':').map(Number);
        const [h2, m2] = fin.split(':').map(Number);
        const horas = h2 - h1;
        const minutos = m2 - m1;
        return horas + (minutos / 60);
    }

    // Función para calcular total de horas semanales
    function calcularTotalHorasSemana(horarios) {
        return horarios.reduce((total, h) => {
            return total + calcularDuracion(h.hora_inicio, h.hora_fin);
        }, 0);
    }

    function obtenerIndiceDia(dia) {
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias.indexOf(dia) + 2; // +2 porque la primera columna es el psicólogo
    }

    function mostrarError(mensaje) {
        $('#calendario-body').html(`
            <tr>
                <td colspan="8" class="text-center py-5">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${mensaje}
                    </div>
                    <button class="btn btn-warning mt-2" onclick="cargarCalendario()">
                        <i class="fas fa-redo me-1"></i> Reintentar
                    </button>
                </td>
            </tr>
        `);
    }

    // Asignar eventos a botones del modal
    $('#btn-editar-modal').click(function () {
        if (currentHorarioId) {
            $('#modalHorarioDetalle').modal('hide');
            editarHorario(currentHorarioId);
        }
    });

    $('#btn-eliminar-modal').click(function () {
        if (currentHorarioId) {
            $('#modalHorarioDetalle').modal('hide');
            eliminarHorario(currentHorarioId);
        }
    });
});