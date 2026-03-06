/**
 * consultar_general.js
 * Sistema de carga perezosa (lazy loading) para el módulo de Transporte.
 * 
 * - Carga automáticamente consultar.js cuando el usuario abre una tab.
 * - Expone TransporteLoader.cargar() para cargar scripts adicionales
 *   bajo demanda (crear, editar, validar, eliminar, etc.).
 * 
 * Convención: el nombre del módulo debe coincidir con:
 *   - El data-bs-target de la tab:  "#vehiculos", "#rutas", etc.
 *   - La carpeta del script:         dist/js/modulos/transporte/vehiculos/
 */

var TransporteLoader = (function () {
    // Módulos de transporte y sus tabs correspondientes
    const modulos = [
        'vehiculos',
        'rutas',
        'repuestos',
        'proveedores',
        'asignar_recursos',
        'mantenimientos'
    ];

    // Registro de scripts ya cargados: { "vehiculos/consultar": true, "vehiculos/crear": true, ... }
    const cargados = {};

    /**
     * Genera la clave única para el registro de un script
     * @param {string} modulo - Nombre del módulo (ej: "vehiculos")
     * @param {string} archivo - Nombre del archivo sin .js (ej: "crear")
     * @returns {string} Clave única (ej: "vehiculos/crear")
     */
    function clave(modulo, archivo) {
        return modulo + '/' + archivo;
    }

    /**
     * Construye la URL completa de un script
     * @param {string} modulo - Nombre del módulo
     * @param {string} archivo - Nombre del archivo sin .js
     * @returns {string} URL completa del script
     */
    function construirUrl(modulo, archivo) {
        return BASE_URL + 'dist/js/modulos/transporte/' + modulo + '/' + archivo + '.js?v=' + Date.now();
    }

    /**
     * Carga un único script dinámicamente
     * @param {string} src - URL del script
     * @returns {Promise} Promesa que se resuelve cuando el script carga
     */
    function inyectarScript(src) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = src;
            script.onload = function () {
                console.log('[TransporteLoader] Cargado: ' + src);
                resolve();
            };
            script.onerror = function () {
                console.error('[TransporteLoader] Error al cargar: ' + src);
                reject(new Error('No se pudo cargar: ' + src));
            };
            document.body.appendChild(script);
        });
    }

    /**
     * Carga uno o varios archivos JS de un módulo bajo demanda.
     * Si ya fueron cargados antes, no los vuelve a cargar.
     * 
     * @param {string} modulo - Nombre del módulo (ej: "vehiculos")
     * @param {string|string[]} archivos - Archivo o array de archivos a cargar (ej: "crear" o ["crear", "validar_crear"])
     * @param {Function} [callback] - Función a ejecutar cuando TODOS los scripts hayan cargado
     * 
     * @example
     * // Cargar un solo archivo
     * TransporteLoader.cargar('vehiculos', 'crear', function() {
     *     abrirModalCrearVehiculo();
     * });
     * 
     * @example
     * // Cargar múltiples archivos con dependencias
     * TransporteLoader.cargar('vehiculos', ['crear', 'validar_crear'], function() {
     *     abrirModalCrearVehiculo();
     * });
     */
    function cargar(modulo, archivos, callback) {
        // Normalizar a array
        if (typeof archivos === 'string') {
            archivos = [archivos];
        }

        // Filtrar los que ya están cargados
        var pendientes = [];
        for (var i = 0; i < archivos.length; i++) {
            var key = clave(modulo, archivos[i]);
            if (!cargados[key]) {
                pendientes.push(archivos[i]);
                cargados[key] = true; // Marcar antes para evitar cargas duplicadas en paralelo
            }
        }

        // Si no hay nada pendiente, ejecutar callback inmediatamente
        if (pendientes.length === 0) {
            if (typeof callback === 'function') callback();
            return;
        }

        // Cargar scripts en secuencia (para respetar dependencias)
        var promesa = Promise.resolve();
        for (var j = 0; j < pendientes.length; j++) {
            (function (archivo) {
                promesa = promesa.then(function () {
                    return inyectarScript(construirUrl(modulo, archivo));
                });
            })(pendientes[j]);
        }

        promesa
            .then(function () {
                if (typeof callback === 'function') callback();
            })
            .catch(function (error) {
                console.error('[TransporteLoader] ' + error.message);
            });
    }

    /**
     * Verifica si un script ya fue cargado
     * @param {string} modulo - Nombre del módulo
     * @param {string} archivo - Nombre del archivo sin .js
     * @returns {boolean}
     */
    function yaCargado(modulo, archivo) {
        return !!cargados[clave(modulo, archivo)];
    }

    // ─── Carga automática de consultar.js al cambiar de tab ───
    document.addEventListener('DOMContentLoaded', function () {
        var transporteTab = document.getElementById('transporteTab');
        if (!transporteTab) return;

        transporteTab.addEventListener('shown.bs.tab', function (event) {
            var target = event.target.getAttribute('data-bs-target');
            if (!target) return;

            var modulo = target.replace('#', '');

            if (!modulos.includes(modulo)) return;

            // Cargar consultar.js automáticamente al abrir la tab
            cargar(modulo, 'consultar');
        });
    });

    // ─── API pública ───
    return {
        cargar: cargar,
        yaCargado: yaCargado
    };

})();
