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
    if (document.getElementById('stat-total-conteo') || document.getElementById('stat-orientacion-mes')) {
        await cargarStatsOrientacion();
    }
}

/**
 * Carga las estadísticas del módulo de Psicología
 */
async function cargarStatsOrientacion() {
    try {
        const response = await fetch('stats_orientacion');
        const data = await response.json();

        if (data.exito) {
            actualizarValor('stat-total-conteo', data.total_orientaciones, ' Cons.');
            actualizarValor('stat-orientacion-mes', data.orientaciones_mes);
            actualizarValor('stat-sin-indicaciones', data.sin_indicaciones);
            actualizarValor('stat-con-observaciones', data.con_observaciones);
        } else {
            console.error('Error al cargar stats de orientación:', data.mensaje);
            marcarErrorStats(['stat-total-conteo', 'stat-orientacion-mes', 'stat-sin-indicaciones', 'stat-con-observaciones']);
        }
    } catch (error) {
        console.error('Error en la petición de stats orientación:', error);
        marcarErrorStats(['stat-total-conteo', 'stat-orientacion-mes', 'stat-sin-indicaciones', 'stat-con-observaciones']);
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
