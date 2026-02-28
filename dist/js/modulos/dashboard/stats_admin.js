document.addEventListener('DOMContentLoaded', function () {
    // Inicializar carga de estadísticas según lo que esté presente en el DOM
    initDashboardStats();
});

//Estadisticas para el Administrador solamente
async function initDashboardStats() {
    // 1. Estadísticas de Psicología
    if (document.getElementById('stat-total-conteo')) {
        await cargarStatsPsicologia();
    }

    // 2. Estadísticas de Medicina
    if (document.getElementById('stat-medicina-total')) {
        await cargarStatsMedicina();
    }

    // 3. Estadísticas de Orientación
    if (document.getElementById('stat-orientacion-total')) {
        await cargarStatsOrientacion();
    }

    // 4. Estadísticas de Trabajo Social
    if (document.getElementById('stat-trabajo-social-total')) {
        await cargarStatsTrabajoSocial();
    }

    // 5. Estadísticas de Discapacidad
    if (document.getElementById('stat-discapacidad-total')) {
        await cargarStatsDiscapacidad();
    }
}

async function cargarStatsPsicologia() {
    try {
        const response = await fetch('psicologia_stats_json');
        const data = await response.json();

        if (data.exito) {
            actualizarValor('stat-total-conteo', data.total_conteo, ' Cons.');
        } else {
            console.error('Error al cargar stats de psicología:', data.mensaje);
            marcarErrorStats(['stat-total-conteo']);
        }
    } catch (error) {
        console.error('Error en la petición de stats psicología:', error);
        marcarErrorStats(['stat-total-conteo']);
    }
}

async function cargarStatsMedicina() {
    try {
        const response = await fetch('stats_medicina_admin');
        const data = await response.json();

        if (data.exito) {
            actualizarValor('stat-medicina-total', data.total, ' Cons.');
        } else {
            console.error('Error al cargar stats de medicina:', data.mensaje);
            marcarErrorStats(['stat-medicina-total']);
        }
    } catch (error) {
        console.error('Error en la petición de stats medicina:', error);
        marcarErrorStats(['stat-medicina-total']);
    }
}

async function cargarStatsOrientacion() {
    try {
        const response = await fetch('stats_orientacion_admin');
        const data = await response.json();

        if (data.exito) {
            actualizarValor('stat-orientacion-total', data.total, ' Cons.');
        } else {
            console.error('Error al cargar stats de orientación:', data.mensaje);
            marcarErrorStats(['stat-orientacion-total']);
        }
    } catch (error) {
        console.error('Error en la petición de stats de orientación:', error);
        marcarErrorStats(['stat-orientacion-total']);
    }
}

async function cargarStatsTrabajoSocial() {
    try {
        const response = await fetch('stats_ts_admin');
        const data = await response.json();

        if (data.exito) {
            actualizarValor('stat-trabajo-social-total', data.total, ' Cons.');
        } else {
            console.error('Error al cargar stats de trabajo social:', data.mensaje);
            marcarErrorStats(['stat-trabajo-social-total']);
        }
    } catch (error) {
        console.error('Error en la petición de stats de trabajo social:', error);
        marcarErrorStats(['stat-trabajo-social-total']);
    }
}

async function cargarStatsDiscapacidad() {
    try {
        const response = await fetch('stats_discapacidad_admin');
        const data = await response.json();

        if (data.exito) {
            actualizarValor('stat-discapacidad-total', data.total, ' Cons.');
        } else {
            console.error('Error al cargar stats de discapacidad:', data.mensaje);
            marcarErrorStats(['stat-discapacidad-total']);
        }
    } catch (error) {
        console.error('Error en la petición de stats de discapacidad:', error);
        marcarErrorStats(['stat-discapacidad-total']);
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