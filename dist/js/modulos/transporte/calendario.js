// En tu archivo JS principal
document.addEventListener('DOMContentLoaded', function() {
    // Restaurar tab activo si existe
    const activeTab = sessionStorage.getItem('activeTransportTab');
    if (activeTab) {
        $(`#transportTabs a[href="${activeTab}"]`).tab('show');
    }
    
    // Guardar tab activo al cambiar
    $('#transportTabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        const tabId = e.target.getAttribute('href');
        sessionStorage.setItem('activeTransportTab', tabId);
        
        // Si es el tab de calendario, actualizar FullCalendar
        if (tabId === '#inicio') {
            actualizarCalendario();
        }
    });
    
    // Inicializar calendario si es el tab activo
    if (activeTab === '#inicio' || !activeTab) {
        setTimeout(inicializarCalendario, 50);
    }
});

// Variable global para la instancia del calendario
let calendar;

function inicializarCalendario() {
    // Destruir calendario existente si hay uno
    if (calendar) {
        calendar.destroy();
    }
    
    const calendarEl = document.getElementById('calendar');
    
    // Solo inicializar si el elemento existe
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            contentHeight: 'auto',
            aspectRatio: 1.35,
            locale: 'es',
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día'
            },
            events: 'index.php?action=cargar_asignaciones',
            eventClick: function(info) {
                $('#modalDetalleAsignacion').modal('show');
                const vehiculo = info.event.extendedProps.vehiculo.split(' - ');
                $('#detalle_ruta').text(info.event.title);
                $('#detalle_fecha').text(info.event.start.toLocaleDateString('es-ES'));
                $('.modelo-vehiculo').text(vehiculo[0]);
                $('.placa-vehiculo').text(`(Placa: ${vehiculo[1]})`);
                $('#detalle_chofer').text(info.event.extendedProps.chofer);
                $('#detalle_estatus').text(info.event.extendedProps.estatus);
                $('#detalle_tipo_ruta').text(info.event.extendedProps.tipo_ruta);
            },
            eventRender: function(event, element) {
                element.attr('title', event.extendedProps.description);
                element.tooltip();
            },
            datesSet: function() {
                // Ajustar dimensiones después de cambiar vista
                setTimeout(function() {
                    calendar.updateSize();
                }, 100);
            }
        });
        
        calendar.render();
        
        // Ajustar tamaño después de la renderización inicial
        setTimeout(function() {
            calendar.updateSize();
        }, 300);
    }
}

function actualizarCalendario() {
    if (calendar) {
        // Refrescar eventos y ajustar tamaño
        calendar.refetchEvents();
        setTimeout(function() {
            calendar.updateSize();
        }, 100);
    } else {
        // Inicializar si no existe
        inicializarCalendario();
    }
}

// Función para manejar éxito en operaciones AJAX
async function handleSuccess(data) {
    await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: data.message,
        confirmButtonColor: '#3085d6'
    });
    
    // Redirigir manteniendo el tab activo
    const currentHash = window.location.hash || sessionStorage.getItem('activeTransportTab') || '';
    window.location.href = `index.php?action=gestionar_transporte${currentHash}`;
}



$(document).ready(function() {
    $('#id_ruta').select2({
        theme: 'bootstrap4'
    });
});