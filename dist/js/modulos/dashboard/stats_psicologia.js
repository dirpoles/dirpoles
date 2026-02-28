/**
 * Dashboard Statistics Loader
 * Handles Ajax requests to populate dashboard cards dynamically
 */
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar carga de estadísticas según lo que esté presente en el DOM
    initDashboardStats();
});

async function initDashboardStats() {
    // 1. Estadísticas de Psicología
    if (document.getElementById('stat-total-diagnosticos') || document.getElementById('stat-total-conteo')) {
        await cargarStatsPsicologia();
    }
}

/**
 * Carga las estadísticas del módulo de Psicología
 */
async function cargarStatsPsicologia() {
    try {
        const response = await fetch('psicologia_stats_json');
        const data = await response.json();

        if (data.exito) {
            actualizarValor('stat-total-conteo', data.total_conteo, ' Cons.');
            actualizarValor('stat-total-diagnosticos', data.total_diagnosticos);
            actualizarValor('stat-citas-mes', data.citas_mes);
            actualizarValor('stat-retiros-temporales', data.retiros_activos);
            actualizarValor('stat-cambios-carrera', data.cambios_carrera);
        } else {
            console.error('Error al cargar stats de psicología:', data.mensaje);
            marcarErrorStats(['stat-total-diagnosticos', 'stat-citas-mes', 'stat-retiros-temporales', 'stat-cambios-carrera']);
        }
    } catch (error) {
        console.error('Error en la petición de stats psicología:', error);
        marcarErrorStats(['stat-total-diagnosticos', 'stat-citas-mes', 'stat-retiros-temporales', 'stat-cambios-carrera']);
    }
}


/**
 * Actualiza un valor en el DOM con una pequeña animación
 */
function actualizarValor(id, valor, suffix = '') {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor + suffix;
        // Opcional: añadir clase de animación
        elemento.classList.add('fade-in');
    }
}

/**
 * Marca los elementos con un guion o error en caso de fallo
 */
function marcarErrorStats(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
}
