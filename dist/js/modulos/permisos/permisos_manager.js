/**
 * permisos_manager.js
 * Guardado por lote (botón) para el módulo de permisos.
 * Requisitos: jQuery, SweetAlert2 (AlertManager).
 *
 * Cómo funciona (alto nivel):
 *  - Captura estado inicial de cada rol+modulo al cargar.
 *  - Detecta cambios (comparando con estado inicial).
 *  - Mantiene una "cola" de módulos modificados (pendingMap).
 *  - Permite "Guardar cambios" que envía todos los módulos modificados en un solo POST.
 *  - Soporta "Cancelar cambios" para resetear UI al estado inicial.
 *
 * Ajusta `SAVE_URL` según tu enrutador (por defecto: 'ajax_guardar_permisos_lote').
 */

(function ($) {
    "use strict";

    // === CONFIG ===
    const SELECTOR_ROOT = '#dashboard-permisos';
    const INSERT_TOOLBAR_BEFORE = SELECTOR_ROOT; // donde insertar el toolbar

    // Estado interno
    const initialState = {}; // initialState[rol][modulo] = Set(permisos...)
    const pendingMap = new Map(); // key: rol-modulo -> { id_tipo_emp, id_modulo, permisos:Set }

    // Utilitarios
    const keyFor = (rol, modulo) => `${rol}-${modulo}`;

    function setBadgeDirty(rol, modulo, isDirty) {
        // marca visual en el badge permission-count (añadir clase)
        const $badge = $(`.permission-count[data-rol="${rol}"][data-modulo="${modulo}"]`);
        if ($badge.length) {
            $badge.toggleClass('badge-dirty', !!isDirty);
            $badge.attr('title', isDirty ? 'Cambios no guardados' : 'Sin cambios');
        }
    }

    function showSavingIndicator(enable) {
        // pequeña función para cambiar texto del botón o mostrar spinner
        const $btn = $('#permisos-guardar-todo');
        if (!$btn.length) return;
        if (enable) {
            $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-1"></i> Guardando...');
        } else {
            $btn.prop('disabled', false).html('<i class="fas fa-save me-1"></i> Guardar cambios');
        }
    }

    // Construir estado inicial leyendo inputs existentes
    function buildInitialState() {
        $(SELECTOR_ROOT).find('.permission-toggle').each(function () {
            const $inp = $(this);
            const rol = $inp.data('rol');
            const modulo = $inp.data('modulo');
            const permiso = parseInt($inp.data('permiso'), 10);
            if (!initialState[rol]) initialState[rol] = {};
            if (!initialState[rol][modulo]) initialState[rol][modulo] = new Set();
            if ($inp.is(':checked')) {
                initialState[rol][modulo].add(permiso);
            }
        });
    }

    // Helper: obtiene array ordenado de permisos actuales en DOM para rol+modulo
    function getCurrentPermisosFromDOM(rol, modulo) {
        const permisos = [];
        $(SELECTOR_ROOT).find(`.permission-toggle[data-rol="${rol}"][data-modulo="${modulo}"]`).each(function () {
            const $i = $(this);
            if ($i.is(':checked')) permisos.push(parseInt($i.data('permiso'), 10));
        });
        permisos.sort((a, b) => a - b);
        return permisos;
    }

    // Comparar sets/arrays (asumiendo arrays ordenados)
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
        return true;
    }

    // Marcar módulo como pending o limpiar pending
    function updatePendingForModule(rol, modulo) {
        const current = getCurrentPermisosFromDOM(rol, modulo);
        const initial = (initialState[rol] && initialState[rol][modulo]) ? Array.from(initialState[rol][modulo]).sort((a, b) => a - b) : [];
        const changed = !arraysEqual(current, initial);

        const k = keyFor(rol, modulo);

        if (changed) {
            // guardar en pendingMap
            pendingMap.set(k, {
                id_tipo_emp: parseInt(rol, 10),
                id_modulo: parseInt(modulo, 10),
                permisos: current.slice() // copia
            });
            setBadgeDirty(rol, modulo, true);
        } else {
            // limpiar pending
            pendingMap.delete(k);
            setBadgeDirty(rol, modulo, false);
        }

        updateToolbarCount();
    }

    // Actualiza contador en toolbar
    function updateToolbarCount() {
        const count = pendingMap.size;
        $('#permisos-pending-count').text(count);
        $('#permisos-guardar-todo').toggleClass('btn-primary', count > 0);
    }

    // Construir payload 'cambios' compatible con tu controlador/modelo
    function buildPayloadCambios() {
        const cambios = [];
        for (const [k, v] of pendingMap.entries()) {
            cambios.push({
                id_tipo_emp: v.id_tipo_emp,
                id_modulo: v.id_modulo,
                permisos: v.permisos
            });
        }
        return cambios;
    }

    // Reset UI a estado inicial (sin guardar)
    function rollbackAllToInitial() {
        for (const rol in initialState) {
            for (const modulo in initialState[rol]) {
                const perms = Array.from(initialState[rol][modulo]);
                // desmarcar/ marcar los toggles del DOM según initialState
                $(SELECTOR_ROOT).find(`.permission-toggle[data-rol="${rol}"][data-modulo="${modulo}"]`).each(function () {
                    const $i = $(this);
                    const pid = parseInt($i.data('permiso'), 10);
                    $i.prop('checked', perms.indexOf(pid) !== -1);
                    // actualizar badge classes
                    const $labelBadge = $i.closest('.form-check').find('.badge');
                    if ($i.is(':checked')) {
                        $labelBadge.removeClass('bg-light text-dark').addClass('bg-success');
                    } else {
                        $labelBadge.removeClass('bg-success').addClass('bg-light text-dark');
                    }
                });
                setBadgeDirty(rol, modulo, false);
            }
        }
        pendingMap.clear();
        updateToolbarCount();
    }

    // Actualizar initialState luego de guardar con éxito
    function applySavedToInitial(savedCambios) {
        // savedCambios: array {id_tipo_emp, id_modulo, permisos:[]}
        savedCambios.forEach(item => {
            const rol = String(item.id_tipo_emp);
            const modulo = String(item.id_modulo);
            if (!initialState[rol]) initialState[rol] = {};
            initialState[rol][modulo] = new Set(item.permisos.map(x => parseInt(x, 10)));
            // limpiar pending y badge
            const k = keyFor(rol, modulo);
            pendingMap.delete(k);
            setBadgeDirty(rol, modulo, false);
            // actualizar permission-count badge visible con número de permisos activos
            const $countBadge = $(`.permission-count[data-rol="${rol}"][data-modulo="${modulo}"]`);
            if ($countBadge.length) $countBadge.text(item.permisos.length);
        });
        updateToolbarCount();
    }

    // Enviar cambios al servidor (AJAX)
    function guardarCambios() {
        if (pendingMap.size === 0) {
            Swal.fire({ icon: 'info', title: 'Sin cambios', text: 'No hay cambios pendientes para guardar.' });
            return;
        }

        const cambios = buildPayloadCambios();

        Swal.fire({
            title: 'Guardar cambios',
            text: `Se van a guardar ${cambios.length} módulos modificados. ¿Deseas continuar?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (!result.isConfirmed) return;

            showSavingIndicator(true);

            $.ajax({
                url: 'ajax_guardar_permisos_lote',
                method: 'POST',
                data: { cambios: JSON.stringify(cambios) },
                dataType: 'json',
                timeout: 20000
            }).done(function (resp) {
                showSavingIndicator(false);

                if (resp && resp.exito) {
                    // idealmente el servidor retorna la lista finalizada; si no, usamos lo enviado
                    const saved = resp.data && resp.data.savedCambios ? resp.data.savedCambios : cambios;
                    applySavedToInitial(saved);

                    Swal.fire({
                        icon: 'success',
                        title: 'Guardado',
                        text: resp.mensaje || 'Permisos actualizados correctamente.'
                    });
                } else {
                    const txt = (resp && resp.mensaje) ? resp.mensaje : 'Error desconocido al guardar.';
                    // No hacer rollback automático de UI: mostrar la opción
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: txt
                    });
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                showSavingIndicator(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de comunicación',
                    text: 'No se pudo conectar con el servidor. Comprueba la red o intenta nuevamente.'
                });
            });
        });
    }

    // Insertar toolbar (Guardar / Cancelar) en la página
    function injectToolbar() {
        const $toolbar = $(`
            <div id="permisos-toolbar" class="mb-3 d-flex justify-content-between align-items-center">
                <div>
                    <button id="permisos-guardar-todo" class="btn btn-outline-secondary me-2">
                        <i class="fas fa-save me-1"></i> Guardar cambios
                    </button>
                    <button id="permisos-cancelar-todo" class="btn btn-light">
                        <i class="fas fa-undo me-1"></i> Cancelar cambios
                    </button>
                </div>
                <div>
                    <small class="text-muted">Cambios pendientes: <span id="permisos-pending-count">0</span></small>
                </div>
            </div>
        `);

        $(INSERT_TOOLBAR_BEFORE).before($toolbar);

        $('#permisos-guardar-todo').on('click', function (e) {
            e.preventDefault();
            guardarCambios();
        });

        $('#permisos-cancelar-todo').on('click', function (e) {
            e.preventDefault();
            if (pendingMap.size === 0) {
                Swal.fire({ icon: 'info', title: 'Nada que cancelar', text: 'No hay cambios pendientes.' });
                return;
            }
            Swal.fire({
                title: '¿Descartar cambios?',
                text: 'Esto revertirá los cambios no guardados a su estado anterior.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, descartar',
                cancelButtonText: 'Cancelar'
            }).then((res) => {
                if (res.isConfirmed) {
                    rollbackAllToInitial();
                }
            });
        });
    }

    // Cambia clases de badge cuando el checkbox es toggled
    function syncBadgeForToggle($input) {
        const $badge = $input.closest('.form-check').find('.badge');
        if ($input.is(':checked')) {
            $badge.removeClass('bg-light text-dark').addClass('bg-success');
        } else {
            $badge.removeClass('bg-success').addClass('bg-light text-dark');
        }
    }

    // Inicializar listeners
    function bindEvents() {
        // Toggle individual checkbox
        $(SELECTOR_ROOT).on('change', '.permission-toggle', function () {
            const $i = $(this);
            const rol = $i.data('rol');
            const modulo = $i.data('modulo');

            syncBadgeForToggle($i);

            // Actualizar pending para este módulo
            updatePendingForModule(rol, modulo);
        });

        // Select all / Deselect all buttons
        $(SELECTOR_ROOT).on('click', '.select-all-perms', function () {
            const rol = $(this).data('rol');
            const modulo = $(this).data('modulo');

            $(SELECTOR_ROOT).find(`.permission-toggle[data-rol="${rol}"][data-modulo="${modulo}"]`).each(function () {
                $(this).prop('checked', true);
                syncBadgeForToggle($(this));
            });

            updatePendingForModule(rol, modulo);
        });

        $(SELECTOR_ROOT).on('click', '.deselect-all-perms', function () {
            const rol = $(this).data('rol');
            const modulo = $(this).data('modulo');

            $(SELECTOR_ROOT).find(`.permission-toggle[data-rol="${rol}"][data-modulo="${modulo}"]`).each(function () {
                $(this).prop('checked', false);
                syncBadgeForToggle($(this));
            });

            updatePendingForModule(rol, modulo);
        });

        // Filtro de módulos (input dentro de cada card)
        $(SELECTOR_ROOT).on('input', '.filter-modules', function () {
            const q = $(this).val().trim().toLowerCase();
            const rolId = $(this).data('rol-id');
            const $card = $(this).closest('.card');
            $card.find('.module-item').each(function () {
                const text = $(this).text().toLowerCase();
                $(this).toggle(text.indexOf(q) !== -1);
            });
        });

        // Cuando se colapsa/expande módulo podemos opcionalmente lazy-load; aquí sólo actualizamos contador si existe
        $(SELECTOR_ROOT).on('shown.bs.collapse', '.accordion-collapse', function () {
            // actualizar badge count si no tiene texto (por ejemplo, si llenas dinámicamente)
            const $collapse = $(this);
            const $button = $collapse.prev('.accordion-header').find('.permission-count');
            if ($button.length && $button.text().trim() === '') {
                // contar checks activos
                const rol = $button.data('rol');
                const modulo = $button.data('modulo');
                const cnt = getCurrentPermisosFromDOM(rol, modulo).length;
                $button.text(cnt);
            }
        });
    }

    // Inicialización general
    function init() {
        // Construir estado inicial
        buildInitialState();

        // Inyectar toolbar
        injectToolbar();

        // Bind events
        bindEvents();

        // Rellenar badges permission-count si vacíos
        $(SELECTOR_ROOT).find('.permission-count').each(function () {
            const $b = $(this);
            if ($b.text().trim() === '') {
                const rol = $b.data('rol');
                const modulo = $b.data('modulo');
                const cnt = getCurrentPermisosFromDOM(rol, modulo).length;
                $b.text(cnt);
            }
        });

        updateToolbarCount();
    }

    // Ejecutar cuando DOM esté listo
    $(function () {
        init();
    });

})(jQuery);
