/**
 * consultar_general.js
 * Carga dinámicamente el consultar.js de cada módulo de transporte
 * la PRIMERA vez que el usuario hace click en la tab correspondiente.
 * 
 * Convención: el nombre del módulo debe coincidir con:
 *   - El data-bs-target de la tab:  "#vehiculos", "#rutas", etc.
 *   - La carpeta del script:         dist/js/modulos/transporte/vehiculos/consultar.js
 */

(function () {
    // Módulos de transporte y sus tabs correspondientes
    const modulos = [
        'vehiculos',
        'rutas',
        'repuestos',
        'proveedores',
        'asignar_recursos',
        'mantenimientos'
    ];

    // Registro de scripts ya cargados para no repetir
    const cargados = {};

    /**
     * Carga un script dinámicamente y ejecuta un callback al terminar
     * @param {string} src - URL del script
     * @param {Function} callback - función a ejecutar cuando el script cargue
     */
    function cargarScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`[Transporte] Módulo cargado: ${src}`);
            if (typeof callback === 'function') callback();
        };
        script.onerror = () => {
            console.warn(`[Transporte] No se pudo cargar el módulo: ${src}`);
        };
        document.body.appendChild(script);
    }

    /**
     * Escucha el evento shown.bs.tab en el contenedor de tabs de transporte
     * y carga el consultar.js del módulo correspondiente si aún no fue cargado
     */
    document.addEventListener('DOMContentLoaded', function () {
        const transporteTab = document.getElementById('transporteTab');
        if (!transporteTab) return;

        transporteTab.addEventListener('shown.bs.tab', function (event) {
            // Obtiene el id del panel activo, ej: "#vehiculos" → "vehiculos"
            const target = event.target.getAttribute('data-bs-target');
            if (!target) return;

            const modulo = target.replace('#', ''); // ej: "vehiculos"

            // Solo actúa si el módulo es uno de los registrados
            if (!modulos.includes(modulo)) return;

            // Solo carga el script si no fue cargado antes
            if (cargados[modulo]) return;

            cargados[modulo] = true; // Marcar como cargado antes de la petición para evitar duplicados

            const url = `${BASE_URL}dist/js/modulos/transporte/${modulo}/consultar.js`;
            cargarScript(url);
        });
    });

})();
