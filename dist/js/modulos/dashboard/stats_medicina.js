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
    if (document.getElementById('stat-total-conteo') || document.getElementById('stat-consultas-mes')) {
        await cargarStatsMedicina();
    }
}

/**
 * Carga las estadísticas del módulo de Psicología
 */
async function cargarStatsMedicina() {
    try {
        const response = await fetch('medicina_stats_json');
        const data = await response.json();

        if (data.exito) {
            actualizarValor('stat-total-conteo', data.total_consultas, ' Cons.');
            actualizarValor('stat-consultas-mes', data.consultas_mes, ' Cons. ');
            actualizarValor('stat-insumos-disponibles', data.insumos_disponibles, ' Und.');
            actualizarValor('stat-insumos-bajo-stock', data.insumos_bajo_stock, ' Und.');
        } else {
            console.error('Error al cargar stats de medicina:', data.mensaje);
            marcarErrorStats(['stat-total-conteo', 'stat-consultas-mes', 'stat-insumos-disponibles', 'stat-insumos-bajo-stock']);
        }
    } catch (error) {
        console.error('Error en la petición de stats medicina:', error);
        marcarErrorStats(['stat-total-conteo', 'stat-consultas-mes', 'stat-insumos-disponibles', 'stat-insumos-bajo-stock']);
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
