/**
 * Dashboard Statistics Loader
 * Handles Ajax requests to populate dashboard cards dynamically
 */
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar carga de estadísticas según lo que esté presente en el DOM
    initDashboardStats();
});

async function initDashboardStats() {
    // 1. Estadísticas de Trabajo Social
    if (document.getElementById('stat-total-embarazadas') || document.getElementById('stat-embarazadas-mes')) {
        await cargarStatsTrabajoSocial();
    }
}

/**
 * Carga las estadísticas del módulo de Psicología
 */
async function cargarStatsTrabajoSocial() {
    try {
        const response = await fetch('stats_ts');
        const data = await response.json();

        if (data.exito) {
            // Primera fila: Totales
            actualizarValor('stat-total-embarazadas', data.total_embarazadas, ' Gest.');
            actualizarValor('stat-total-exoneraciones', data.total_exoneraciones, ' Exon.');
            actualizarValor('stat-total-fames', data.total_fames, ' Fam.');
            actualizarValor('stat-total-becas', data.total_becas, ' Bec.');

            // Segunda fila: Del Mes
            actualizarValor('stat-embarazadas-mes', data.embarazadas_mes, ' Gest.');
            actualizarValor('stat-exoneraciones-mes', data.exoneraciones_mes, ' Exon.');
            actualizarValor('stat-fames-mes', data.fames_mes, ' Fam.');
            actualizarValor('stat-becas-mes', data.becas_mes, ' Bec.');

            // Opcional: Si quieres mostrar porcentaje de patria
            console.log('Embarazadas con patria:', data.embarazadas_con_patria,
                `(${data.porcentaje_patria}%)`);
            console.log('Tipos de ayuda FAMES:', data.tipos_fames);

        } else {
            console.error('Error al cargar stats de trabajo social:', data.mensaje);
            // Marcar error en todas las cards
            const ids = [
                'stat-total-embarazadas', 'stat-total-exoneraciones',
                'stat-total-fames', 'stat-total-becas',
                'stat-embarazadas-mes', 'stat-exoneraciones-mes',
                'stat-fames-mes', 'stat-becas-mes'
            ];
            marcarErrorStats(ids);
        }
    } catch (error) {
        console.error('Error en la petición de stats trabajo social:', error);
        const ids = [
            'stat-total-embarazadas', 'stat-total-exoneraciones',
            'stat-total-fames', 'stat-total-becas',
            'stat-embarazadas-mes', 'stat-exoneraciones-mes',
            'stat-fames-mes', 'stat-becas-mes'
        ];
        marcarErrorStats(ids);
    }
}

// Función auxiliar para actualizar valores
function actualizarValor(id, valor, suffix = '') {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor + suffix;
        elemento.classList.add('fade-in');
    }
}

// Función para marcar error
function marcarErrorStats(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
}