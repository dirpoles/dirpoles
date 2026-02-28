document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap5',
        locale: 'es',
        initialView: 'dayGridMonth',
        buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día' },
        headerToolbar: { start: 'title', center: 'prev,next', end: 'dayGridMonth,dayGridWeek,dayGridDay' },

        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch('citas_calendario_json');
                const data = await response.json();

                if (data.exito) {
                    const eventos = data.data.map(cita => ({
                        id: cita.id_cita,
                        title: `${cita.beneficiario} (${cita.empleado})`,
                        start: `${cita.fecha}T${cita.hora}`,
                        color: estadoColor(cita.estatus), // función helper
                        extendedProps: cita
                    }));
                    successCallback(eventos);
                } else {
                    failureCallback(data.mensaje);
                }
            } catch (error) {
                console.error(error);
                failureCallback(error);
            }
        },

        eventClick: function (info) {
            const cita = info.event.extendedProps;

            Swal.fire({
                title: `<span class="text-primary">Detalle de la Cita #${info.event.id}</span>`,
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
    });

    calendar.render();
});

// Helper para colores según estatus
function estadoColor(estatus) {
    switch (parseInt(estatus)) {
        case 1: return '#ffc107'; // Pendiente
        case 2: return '#0dcaf0'; // Confirmada
        case 3: return '#198754'; // Atendida
        case 4: return '#dc3545'; // Cancelada
        case 5: return '#6c757d'; // No asistió
        default: return '#0d6efd'; // fallback
    }
}