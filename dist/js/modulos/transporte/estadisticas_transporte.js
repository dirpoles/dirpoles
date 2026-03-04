document.addEventListener('DOMContentLoaded', function () {
    // Inicializar carga de estadísticas según lo que esté presente en el DOM
    initTransporteStats();
});

async function initTransporteStats() {
    if (document.getElementById('card_count_vehiculos')) {
        await cargarStatsTransporte();
    }
}

async function cargarStatsTransporte() {
    try {
        // Asegurate de que la ruta 'transporte_estadisticas' existe y se resuelva
        const response = await fetch(`${BASE_URL}transporte_estadisticas`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.exito) {
            actualizarValor('card_count_vehiculos', result.data.total_vehiculos);
            actualizarValor('card_count_rutas', result.data.rutas_activas);
            actualizarValor('card_count_mantenimiento', result.data.en_mantenimiento);
            actualizarValor('card_count_repuestos', result.data.repuestos_criticos);
        } else {
            console.error('Error al cargar stats de transporte:', result.mensaje);
            marcarErrorStatsTransporte(['card_count_vehiculos', 'card_count_rutas', 'card_count_mantenimiento', 'card_count_repuestos']);
        }
    } catch (error) {
        console.error('Error en la petición de stats transporte:', error);
        marcarErrorStatsTransporte(['card_count_vehiculos', 'card_count_rutas', 'card_count_mantenimiento', 'card_count_repuestos']);
    }
}

/**
 * Actualiza un valor en el DOM con una pequeña animación
 */
function actualizarValor(id, valor, suffix = '') {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor + suffix;
        elemento.classList.add('fade-in');
    }
}

/**
 * Marca los elementos con un guion o error en caso de fallo
 */
function marcarErrorStatsTransporte(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
}

function cambiarTabTransporte(tabId) {
    const triggerEl = document.querySelector(`a[data-bs-target="#${tabId}"]`);
    if (triggerEl) {
        if (window.bootstrap && bootstrap.Tab) {
            const tab = new bootstrap.Tab(triggerEl);
            tab.show();
        } else if (typeof $ !== 'undefined') {
            $(triggerEl).tab('show');
        }
    }
}
