document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    if (!calendarEl) {
        return;
    }

    const hasInteraction = typeof FullCalendar.interaction !== 'undefined';

    const calendarConfig = {
        themeSystem: 'bootstrap5',
        locale: 'es',
        initialView: 'dayGridMonth',
        buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día' },
        headerToolbar: {
            start: 'title',
            center: 'prev,next today',
            end: 'dayGridMonth' + (hasInteraction ? ',timeGridWeek,timeGridDay,listMonth' : '')
        },

        // Combinar ambas fuentes de eventos
        eventSources: [
            // Fuente 1: Citas de psicología
            {
                url: 'citas_calendario_json',
                method: 'GET',
                extraParams: function () {
                    return {};
                },
                success: function (data) {
                    if (data.exito) {
                        return data.data.map(cita => ({
                            id: `cita-${cita.id_cita}`,
                            title: `${cita.beneficiario}`,
                            start: `${cita.fecha}T${cita.hora}`,
                            color: estadoColor(cita.estatus),
                            extendedProps: {
                                tipo: 'cita',
                                ...cita
                            }
                        }));
                    }
                    return [];
                },
                failure: function (error) {
                    console.error('Error cargando citas:', error);
                }
            },
            // Fuente 2: Eventos personales
            {
                url: 'obtener_eventos_calendario',
                method: 'GET',
                extraParams: function () {
                    return {};
                },
                success: function (eventos) {
                    return eventos.map(evento => ({
                        id: `evento-${evento.id}`,
                        title: evento.title,
                        start: evento.start,
                        color: '#6f42c1', // Color púrpura para eventos personales
                        extendedProps: {
                            tipo: 'evento',
                            descripcion: evento.extendedProps?.descripcion || ''
                        }
                    }));
                },
                failure: function (error) {
                    console.error('Error cargando eventos:', error);
                }
            }
        ],

        eventClick: function (info) {
            info.jsEvent.preventDefault();

            // Determinar qué tipo de evento es y abrir el modal correspondiente
            if (info.event.extendedProps.tipo === 'cita') {
                abrirModalCita(info.event);
            } else {
                abrirModalEvento(info.event);
            }
        },

        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        },

        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00'
    };

    if (hasInteraction) {
        calendarConfig.editable = false;
        calendarConfig.selectable = true;
        calendarConfig.selectMirror = true;
        calendarConfig.droppable = false;

        calendarConfig.dateClick = function (info) {
            abrirModalCrearEvento(info.dateStr);
        };

        calendarConfig.select = function (info) {
            abrirModalCrearEvento(info.startStr);
        };
    } else {
        setTimeout(() => {
            const dayCells = document.querySelectorAll('.fc-daygrid-day-frame');
            dayCells.forEach(cell => {
                cell.style.cursor = 'pointer';
                cell.addEventListener('click', function (e) {
                    if (!e.target.closest('.fc-event')) {
                        const dateAttr = this.closest('[data-date]');
                        if (dateAttr) {
                            const dateStr = dateAttr.getAttribute('data-date');
                            abrirModalCrearEvento(dateStr);
                        }
                    }
                });
            });
        }, 500);
    }

    const calendar = new FullCalendar.Calendar(calendarEl, calendarConfig);
    calendar.render();

    window.calendarioPersonal = calendar;
});

// ============================================
// FUNCIONES PARA CITAS (Psicología)
// ============================================

function abrirModalCita(evento) {
    const cita = evento.extendedProps;

    Swal.fire({
        title: `<span class="text-primary">Detalle de la Cita #${evento.id.replace('cita-', '')}</span>`,
        html: `
        <div class="p-3 text-start">
            <div class="d-flex align-items-center mb-3 p-2 bg-light rounded shadow-sm">
                <div class="btn-circle btn-lg bg-${cita.clase || 'primary'} text-white me-3">
                    <i class="${cita.icono || 'fas fa-calendar-check'}"></i>
                </div>
                <div>
                    <h6 class="mb-0 font-weight-bold text-gray-800">${cita.nombre_estado}</h6>
                    <small class="text-muted">Estado Actual</small>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-12">
                    <label class="text-xs font-weight-bold text-uppercase text-muted d-block mb-1">Beneficiario</label>
                    <div class="h6 mb-0 text-gray-800">
                        <i class="fas fa-user-circle text-success me-2"></i> ${cita.beneficiario}
                    </div>
                    <small class="text-muted d-block ms-4">${cita.cedula_beneficiario}</small>
                </div>

                <hr class="my-2 opacity-25">

                <div class="col-md-6">
                    <label class="text-xs font-weight-bold text-uppercase text-muted d-block mb-1">Fecha</label>
                    <div class="h6 mb-0 text-gray-800">
                        <i class="fas fa-calendar-day text-primary me-2"></i> ${cita.fecha}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="text-xs font-weight-bold text-uppercase text-muted d-block mb-1">Hora</label>
                    <div class="h6 mb-0 text-gray-800">
                        <i class="fas fa-clock text-info me-2"></i> ${cita.hora}
                    </div>
                </div>

                <hr class="my-2 opacity-25">

                <div class="col-12">
                    <label class="text-xs font-weight-bold text-uppercase text-muted d-block mb-1">Asignado a</label>
                    <div class="h6 mb-0 text-gray-800">
                        <i class="fas fa-user-md text-info me-2"></i> ${cita.empleado}
                    </div>
                </div>
            </div>
        </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        focusConfirm: false,
        customClass: {
            title: 'pt-4',
            popup: 'rounded-xl shadow-lg border-0'
        }
    });
}

function estadoColor(estatus) {
    switch (parseInt(estatus)) {
        case 1: return '#ffc107'; // Pendiente
        case 2: return '#0dcaf0'; // Confirmada
        case 3: return '#198754'; // Atendida
        case 4: return '#dc3545'; // Cancelada
        case 5: return '#6c757d'; // No asistió
        default: return '#0d6efd';
    }
}

// ============================================
// FUNCIONES PARA EVENTOS PERSONALES
// ============================================

function abrirModalCrearEvento(fechaInicio) {
    let fechaInput = fechaInicio;
    if (fechaInicio && !fechaInicio.includes('T')) {
        const ahora = new Date();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        fechaInput = `${fechaInicio}T${horas}:${minutos}`;
    }

    Swal.fire({
        title: 'Nuevo Evento Personal',
        html: `
            <form id="form-evento-calendario">
                <div class="mb-3">
                    <label class="form-label">Título *</label>
                    <input type="text" class="form-control" id="evento-titulo" required 
                           maxlength="100" placeholder="Ej: Entrega de documentos">
                </div>
                <div class="mb-3">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" id="evento-descripcion" rows="3" 
                              placeholder="Detalles adicionales..."></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Fecha y hora *</label>
                    <input type="datetime-local" class="form-control" 
                           id="evento-fecha" value="${fechaInput}" required>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const titulo = document.getElementById('evento-titulo').value;
            if (!titulo) {
                Swal.showValidationMessage('El título es obligatorio');
            }
            return {
                titulo: titulo,
                descripcion: document.getElementById('evento-descripcion').value,
                fecha: document.getElementById('evento-fecha').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            guardarEventoCalendario(result.value);
        }
    });
}

async function guardarEventoCalendario(datos) {
    if (!datos.titulo || !datos.fecha) {
        AlertManager.error('El título y la fecha son obligatorios');
        return;
    }

    try {
        const response = await fetch('guardar_evento_calendario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                fecha: datos.fecha,
            })
        });

        const resultado = await response.json();

        if (resultado.exito) {
            AlertManager.success(resultado.mensaje);

            if (window.calendarioPersonal) {
                window.calendarioPersonal.refetchEvents();
            }
        } else {
            AlertManager.error(resultado.mensaje || 'Error al guardar el evento');
        }
    } catch (error) {
        console.error('Error:', error);
        AlertManager.error('Error de conexión');
    }
}

function abrirModalEvento(evento) {
    Swal.fire({
        title: `<i class="fas fa-calendar-alt text-purple me-2"></i>${evento.title}`,
        html: `
            <div class="p-3 text-start">
                <div class="mb-3">
                    <label class="text-xs font-weight-bold text-uppercase text-muted d-block mb-1">Descripción</label>
                    <p class="text-gray-800">${evento.extendedProps?.descripcion || 'Sin descripción'}</p>
                </div>
                <div class="mb-3">
                    <label class="text-xs font-weight-bold text-uppercase text-muted d-block mb-1">Fecha</label>
                    <p class="text-gray-800"><i class="fas fa-clock text-info me-2"></i>${formatFecha(evento.start)}</p>
                </div>
            </div>
        `,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '<i class="fas fa-edit me-1"></i> Editar',
        denyButtonText: '<i class="fas fa-trash me-1"></i> Eliminar',
        cancelButtonText: 'Cerrar',
        focusConfirm: false,
        showCloseButton: true,
        reverseButtons: true,
        customClass: {
            denyButton: 'btn-danger',
            confirmButton: 'btn-primary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            abrirModalEditarEvento(evento);
        } else if (result.isDenied) {
            eliminarEventoCalendario(evento.id.replace('evento-', ''));
        }
    });
}

function abrirModalEditarEvento(evento) {
    const fechaFormateada = evento.start.toISOString().slice(0, 16);

    Swal.fire({
        title: 'Editar Evento Personal',
        html: `
            <form id="form-editar-evento">
                <div class="mb-3">
                    <label class="form-label">Título *</label>
                    <input type="text" class="form-control" id="editar-titulo" required 
                           maxlength="100" value="${evento.title}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" id="editar-descripcion" rows="3">${evento.extendedProps?.descripcion || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Fecha y hora *</label>
                    <input type="datetime-local" class="form-control" 
                           id="editar-fecha" value="${fechaFormateada}" required>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const titulo = document.getElementById('editar-titulo').value;
            if (!titulo) {
                Swal.showValidationMessage('El título es obligatorio');
            }
            return {
                id_evento: evento.id.replace('evento-', ''),
                titulo: titulo,
                descripcion: document.getElementById('editar-descripcion').value,
                fecha: document.getElementById('editar-fecha').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            actualizarEventoCalendario(result.value);
        }
    });
}

async function actualizarEventoCalendario(datos) {
    try {
        const response = await fetch('actualizar_evento_calendario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(datos)
        });

        const resultado = await response.json();

        if (resultado.exito) {
            AlertManager.success(resultado.mensaje);

            if (window.calendarioPersonal) {
                window.calendarioPersonal.refetchEvents();
            }
        } else {
            AlertManager.error(resultado.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        AlertManager.error('Error al actualizar evento');
    }
}

async function eliminarEventoCalendario(idEvento) {
    try {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar evento?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            const response = await fetch('eliminar_evento_calendario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ id_evento: idEvento })
            });

            const resultado = await response.json();

            if (resultado.exito) {
                AlertManager.success('Evento eliminado');

                if (window.calendarioPersonal) {
                    window.calendarioPersonal.refetchEvents();
                }
            } else {
                AlertManager.error(resultado.mensaje);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        AlertManager.error('Error al eliminar evento');
    }
}

function formatFecha(fecha) {
    if (!fecha) return 'N/A';

    return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}