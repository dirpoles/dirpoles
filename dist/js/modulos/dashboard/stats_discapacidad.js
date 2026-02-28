// dist/js/modulos/discapacidad/stats_discapacidad.js
document.addEventListener('DOMContentLoaded', function () {

    initDashboardStats();
});

async function initDashboardStats() {


    // Verificar por ALGUNO de los IDs reales de discapacidad
    const hasDiscapacidadCards =
        document.getElementById('stat-total-discapacidades') !== null ||
        document.getElementById('stat-discapacidades-mes') !== null ||
        document.getElementById('stat-discapacidades-graves') !== null ||
        document.getElementById('stat-con-carnet') !== null;

    if (hasDiscapacidadCards) {
        await cargarStatsDiscapacidad();
    }
}

async function cargarStatsDiscapacidad() {
    try {
        const response = await fetch('stats_discapacidad');
        const data = await response.json();


        if (data.exito) {
            // Actualizar TODOS los elementos que existan
            actualizarValor('stat-total-discapacidades', data.total_discapacidades, ' Casos');
            actualizarValor('stat-discapacidades-mes', data.discapacidades_mes, ' Casos');
            actualizarValor('stat-discapacidades-graves', data.discapacidades_graves, ' Casos');
            actualizarValor('stat-con-carnet', data.con_carnet, ' Carnets');
        } else {
            marcarErrorStats();
        }
    } catch (error) {

        marcarErrorStats();
    }
}

function actualizarValor(id, valor, suffix = '') {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor + suffix;
        elemento.classList.add('fade-in');

    } else {

    }
}

function marcarErrorStats() {
    const ids = [
        'stat-total-discapacidades',
        'stat-discapacidades-mes',
        'stat-discapacidades-graves',
        'stat-con-carnet'
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = '0';

        }
    });
}