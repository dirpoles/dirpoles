// ============ CONFIGURACIÓN GLOBAL ============ //
const NOTIFICATIONS_CONFIG = {
    SSE: {
        DEBOUNCE_TOAST_MS: 3000,
        RECONNECT_DELAY: 3000,
        POLLING_INTERVAL: 120000,
        MAX_PROCESSED_IDS: 100,
        DEBUG: false // Temporalmente habilitado para diagnóstico
    }
};

// ============ ESTADO GLOBAL ============ //
const NOTIFICATION_STATE = {
    currentPage: 1,
    isLoading: false,
    dropdownVisible: false,
    lastNotificationCount: 0,
    eventSource: null,
    sseConnected: false,
    lastNotificationId: 0,
    procesandoNotificacion: false,
    notificacionesProcesadas: new Set(),
    ultimoToastTime: 0
};

// ============ SISTEMA DE LOGGING CONTROLADO ============ //
class Logger {
    static log(message, ...args) {
        if (NOTIFICATIONS_CONFIG.SSE.DEBUG) {
            console.log(`📝 ${message}`, ...args);
        }
    }

    static error(message, ...args) {
        console.error(`❌ ${message}`, ...args);
    }

    static warn(message, ...args) {
        console.warn(`⚠️ ${message}`, ...args);
    }

    static info(message, ...args) {
        if (NOTIFICATIONS_CONFIG.SSE.DEBUG) {
            console.info(`ℹ️ ${message}`, ...args);
        }
    }
}

// ============ MAPAS DE ICONOS Y COLORES ============ //
const NOTIFICATION_ICONS = {
    'empleado': 'fas fa-user',
    'beneficiario': 'fas fa-person',
    'sistema': 'fas fa-cog',
    'alerta': 'fas fa-exclamation-triangle',
    'diagnostico': 'fas fa-stethoscope',
    'referencia': 'fas fa-users',
    'jornada': 'fas fa-calendar-alt',
    'inventario': 'fas fa-boxes',
    'exito': 'fas fa-check-circle',
    'horario': 'fas fa-clock',
    'error': 'fas fa-times-circle',
    'default': 'fas fa-bell'
};

const NOTIFICATION_COLORS = {
    'empleado': 'bg-primary',
    'usuario': 'bg-info',
    'sistema': 'bg-secondary',
    'alerta': 'bg-warning',
    'diagnostico': 'bg-success',
    'referencia': 'bg-success',
    'jornada': 'bg-success',
    'exito': 'bg-success',
    'error': 'bg-danger',
    'default': 'bg-primary'
};

// ============ FUNCIONES DE UTILIDAD ============ //
class NotificationUtils {
    static formatTimeAgo(minutes) {
        if (minutes < 1) return "hace unos momentos";
        if (minutes < 60) return `hace ${minutes} minuto${minutes === 1 ? '' : 's'}`;
        if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            return `hace ${hours} hora${hours === 1 ? '' : 's'}`;
        }
        const days = Math.floor(minutes / 1440);
        return `hace ${days} día${days === 1 ? '' : 's'}`;
    }

    static getIconForType(tipo) {
        return NOTIFICATION_ICONS[tipo] || NOTIFICATION_ICONS.default;
    }

    static getColorForType(tipo) {
        return NOTIFICATION_COLORS[tipo] || NOTIFICATION_COLORS.default;
    }

    static isLoginPage() {
        const currentPath = window.location.pathname.toLowerCase();
        const currentUrl = window.location.href.toLowerCase();

        // Verificar ruta de login específicamente
        const loginPaths = ['/login', 'login.php', '/auth'];
        const isLoginPath = loginPaths.some(path => currentPath.includes(path));

        // Verificar parámetros de URL
        const loginParams = ['logout=true', 'session_expired=true'];
        const hasLoginParam = loginParams.some(param => currentUrl.includes(param));

        // Verificar formulario de login específico (no cualquier form con password)
        // Buscar forms que tengan action de login Y campos de login típicos
        const hasLoginForm = document.querySelector('form[action*="login"], form[action*="auth"], form#formLogin') !== null;

        // Verificar si hay un input de login específico (no de perfil o cambio de clave)
        // Excluimos campos que están dentro de modales de perfil
        const loginInput = document.querySelector('#login_password, input[name="login_password"], #password:not([id*="edit_"])');
        const hasLoginInputs = loginInput !== null && !document.querySelector('#user_id'); // Si hay user_id, es página autenticada

        // Si existe el elemento #user_id con data-id, el usuario está autenticado
        const isAuthenticated = document.querySelector('#user_id[data-id]') !== null;

        // Si está autenticado, NO es página de login (priorizar esta verificación)
        if (isAuthenticated) {
            return false;
        }

        return isLoginPath || hasLoginParam || (hasLoginForm && hasLoginInputs);
    }
}

// ============ MANEJO SSE OPTIMIZADO ============ //
class SSEManager {
    static conectarSSE() {
        // Verificar si debemos detener reconexión
        if (window.sseStopReconnect || NotificationUtils.isLoginPage()) {
            Logger.info('Reconexión SSE desactivada');
            return;
        }

        Logger.info('Intentando conectar SSE...');

        this.desconectarSSE();

        NOTIFICATION_STATE.lastNotificationId = localStorage.getItem('ultimoNotificacionId') || 0;
        Logger.info('Último ID para SSE:', NOTIFICATION_STATE.lastNotificationId);

        const timestamp = Date.now();
        const url = `sse-notificaciones?ultimoId=${NOTIFICATION_STATE.lastNotificationId}&_=${timestamp}`;
        Logger.info('URL SSE:', url);

        NOTIFICATION_STATE.eventSource = new EventSource(url);

        NOTIFICATION_STATE.eventSource.onopen = this.handleOpen.bind(this);
        NOTIFICATION_STATE.eventSource.onerror = this.handleError.bind(this);
        NOTIFICATION_STATE.eventSource.onmessage = this.handleMessage.bind(this);
        NOTIFICATION_STATE.eventSource.addEventListener('nueva-notificacion', this.handleNuevaNotificacion.bind(this));
    }

    static handleOpen() {
        Logger.info('SSE CONECTADO');
        NOTIFICATION_STATE.sseConnected = true;
    }

    static handleError(event) {
        // Ignorar error si la página se está descargando/recargando
        if (window.isUnloading) return;

        // Ignorar error si el estado es CLOSED (cierre normal o interrupción de red)
        if (NOTIFICATION_STATE.eventSource?.readyState === EventSource.CLOSED) {
            Logger.info('Conexión SSE cerrada (posiblemente por navegación o timeout)');
            NOTIFICATION_STATE.sseConnected = false;

            // Intentar reconectar solo si no es un cierre intencional
            if (!window.sseStopReconnect && !NotificationUtils.isLoginPage()) {
                Logger.info('Reconectando en 3 segundos...');
                setTimeout(() => this.conectarSSE(), NOTIFICATIONS_CONFIG.SSE.RECONNECT_DELAY);
            }
            return;
        }

        Logger.error('Error SSE - Estado:', NOTIFICATION_STATE.eventSource?.readyState);
        NOTIFICATION_STATE.sseConnected = false;

        if (window.sseStopReconnect || NotificationUtils.isLoginPage()) {
            Logger.info('No reconectando - página de login o logout detectado');
            this.desconectarSSE();
            return;
        }
    }

    static handleMessage(event) {
        if (event.data && event.data.trim() === ': heartbeat') {
            Logger.info('Heartbeat recibido');
            return;
        }
        Logger.info('Mensaje SSE recibido:', event.data);
    }

    static handleNuevaNotificacion(event) {
        if (NOTIFICATION_STATE.procesandoNotificacion) {
            Logger.info('Ya se está procesando otra notificación, ignorando...');
            return;
        }

        NOTIFICATION_STATE.procesandoNotificacion = true;

        try {
            const notif = JSON.parse(event.data);
            Logger.info('Notificación SSE recibida:', notif);

            if (NOTIFICATION_STATE.notificacionesProcesadas.has(notif.id)) {
                Logger.info('Notificación ya procesada, ID:', notif.id);
                return;
            }

            NOTIFICATION_STATE.notificacionesProcesadas.add(notif.id);

            if (NOTIFICATION_STATE.notificacionesProcesadas.size > NOTIFICATIONS_CONFIG.SSE.MAX_PROCESSED_IDS) {
                const array = Array.from(NOTIFICATION_STATE.notificacionesProcesadas);
                NOTIFICATION_STATE.notificacionesProcesadas = new Set(array.slice(-50));
            }

            if (notif.id > NOTIFICATION_STATE.lastNotificationId) {
                NOTIFICATION_STATE.lastNotificationId = notif.id;
                localStorage.setItem('ultimoNotificacionId', notif.id);
                Logger.info('Nuevo último ID:', notif.id);
            }

            this.procesarNotificacion(notif);

        } catch (error) {
            Logger.error('Error procesando notificación SSE:', error);
        } finally {
            NOTIFICATION_STATE.procesandoNotificacion = false;
        }
    }

    static procesarNotificacion(notif) {
        Logger.info('Procesando notificación:', notif.titulo);

        this.mostrarToast(notif);

        const currentCount = parseInt($("#notificationCounter").text()) || 0;
        const newCount = currentCount + 1;
        this.actualizarContador(newCount);

        if (NOTIFICATION_STATE.dropdownVisible) {
            this.agregarAlDropdown(notif);
        }

        Logger.info('Notificación procesada exitosamente');
    }

    static mostrarToast(notif) {
        const empleadoNombre = notif.nombre_empleado === null
            ? "Sistema"
            : (notif.nombre_empleado || "Remitente desconocido");

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: 'info',
            title: notif.titulo,
            text: `De: ${empleadoNombre}`
        });

        NOTIFICATION_STATE.ultimoToastTime = Date.now();
    }

    static actualizarContador(count) {
        const badge = $("#notificationCounter");
        const badgeCounter = $("#notificationCounterBadge");

        badge.text(count).toggle(count > 0);
        if (badgeCounter.length) badgeCounter.text(count);

        if (count > 0 && !NOTIFICATION_STATE.dropdownVisible) {
            badge.addClass("badge-pulse");
            setTimeout(() => badge.removeClass("badge-pulse"), 3000);
        }

        $("#notificationHeader").text(`${count} Notificación${count !== 1 ? 'es' : ''}`);
    }

    static agregarAlDropdown(notif) {
        const container = $("#notificationItems");

        if (container.find('.text-center').length > 0) {
            container.empty();
        }

        const empleadoNombre = notif.nombre_empleado === null
            ? "Sistema"
            : (notif.nombre_empleado || "Remitente desconocido");

        const notificationIcon = NotificationUtils.getIconForType(notif.tipo);
        const iconBgClass = NotificationUtils.getColorForType(notif.tipo);

        const notificationHTML = `
            <div class="notification-item unread border-start border-primary border-3" 
                 data-id="${notif.id}">
                <div class="d-flex align-items-start p-3 hover-bg-gray-100 rounded position-relative">
                    <div class="flex-shrink-0 me-3">
                        <div class="${iconBgClass} text-white rounded-circle d-flex align-items-center justify-content-center" 
                             style="width: 40px; height: 40px;">
                            <i class="${notificationIcon} fa-sm"></i>
                        </div>
                    </div>
                    
                    <div class="flex-grow-1 me-2" style="min-width: 0;">
                        <a href="${notif.url}" class="text-decoration-none text-reset stretched-link">
                            <div class="d-flex justify-content-between align-items-start mb-1">
                                <h6 class="mb-0 text-truncate fw-bold" style="max-width: 220px;">
                                    ${this.escapeHtml(notif.titulo)}
                                </h6>
                                <small class="text-muted ms-2 flex-shrink-0">
                                    ahora
                                </small>
                            </div>
                            <p class="text-gray-600 mb-0 small text-truncate">
                                De: ${this.escapeHtml(empleadoNombre)}
                            </p>
                        </a>
                    </div>
                    
                    <div class="flex-shrink-0">
                        <button class="btn btn-sm btn-outline-danger btn-delete-notification" 
                                data-id="${notif.id}" 
                                title="Eliminar notificación"
                                style="z-index: 5; position: relative;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.prepend(notificationHTML);
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static desconectarSSE() {
        if (NOTIFICATION_STATE.eventSource) {
            Logger.info('Desconectando SSE...');
            NOTIFICATION_STATE.eventSource.close();
            NOTIFICATION_STATE.eventSource = null;
            NOTIFICATION_STATE.sseConnected = false;
        }
    }
}

// ============ MANEJO DE NOTIFICACIONES ============ //
class NotificationManager {
    static loadNotifications() {
        if (NOTIFICATION_STATE.isLoading) return;

        NOTIFICATION_STATE.isLoading = true;
        NOTIFICATION_STATE.currentPage = 1;

        Logger.info('Cargando notificaciones...');

        $.ajax({
            url: "obtenerNotificaciones",
            type: "POST",
            dataType: "json",
            success: (response) => {
                if (response.exito) {
                    Logger.info('Notificaciones recibidas:', response.notifications?.length || 0);

                    NOTIFICATION_STATE.notificacionesProcesadas.clear();
                    if (response.notifications && response.notifications.length > 0) {
                        response.notifications.forEach(notif => {
                            NOTIFICATION_STATE.notificacionesProcesadas.add(notif.id);
                        });

                        const maxId = Math.max(...response.notifications.map(n => n.id));
                        localStorage.setItem('ultimoNotificacionId', maxId);
                        NOTIFICATION_STATE.lastNotificationId = maxId;
                        Logger.info('Último ID actualizado:', maxId);
                    }

                    this.updateBadge(response.unread_count);
                    $("#notificationHeader").text(`${response.unread_count} Notificación${response.unread_count !== 1 ? 'es' : ''}`);
                    this.appendNotifications(response.notifications);
                    NOTIFICATION_STATE.lastNotificationCount = response.unread_count;
                }
            },
            error: (xhr, status, error) => {
                Logger.error('Error cargando notificaciones:', error);
            },
            complete: () => {
                NOTIFICATION_STATE.isLoading = false;
            }
        });
    }

    static updateBadge(count) {
        const badge = $("#notificationCounter");
        const badgeCounter = $("#notificationCounterBadge");

        badge.text(count).toggle(count > 0);
        if (badgeCounter.length) badgeCounter.text(count);
    }

    static appendNotifications(notifications) {
        const container = $("#notificationItems");

        if (NOTIFICATION_STATE.currentPage === 1) {
            container.empty();

            if (!notifications || notifications.length === 0) {
                container.append(`
                    <div class="text-center py-5 px-3">
                        <div class="mb-3">
                            <i class="far fa-bell-slash fa-3x text-gray-400"></i>
                        </div>
                        <p class="text-muted mb-1">No hay notificaciones</p>
                        <small class="text-gray-500">Te notificaremos cuando haya novedades</small>
                    </div>
                `);
                return;
            }
        }

        notifications.forEach((notif) => {
            const empleadoNombre = notif.nombre_empleado === null
                ? "Sistema"
                : (notif.nombre_empleado || "Remitente desconocido");

            const notificationIcon = NotificationUtils.getIconForType(notif.tipo);
            const iconBgClass = NotificationUtils.getColorForType(notif.tipo);
            const isUnread = notif.leido == 0;

            const notificationHTML = `
                <div class="notification-item ${isUnread ? 'unread border-start border-primary border-3' : 'read'}" 
                     data-id="${notif.id}">
                    <div class="d-flex align-items-start p-3 hover-bg-gray-100 rounded position-relative">
                        <div class="flex-shrink-0 me-3">
                            <div class="${iconBgClass} text-white rounded-circle d-flex align-items-center justify-content-center" 
                                 style="width: 40px; height: 40px;">
                                <i class="${notificationIcon} fa-sm"></i>
                            </div>
                        </div>
                        
                        <div class="flex-grow-1 me-2" style="min-width: 0;">
                            <a href="${notif.url}" class="text-decoration-none text-reset stretched-link">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <h6 class="mb-0 text-truncate ${isUnread ? 'fw-bold' : 'fw-normal'}" 
                                        style="max-width: 220px;">
                                        ${SSEManager.escapeHtml(notif.titulo)}
                                    </h6>
                                    <small class="text-muted ms-2 flex-shrink-0">
                                        ${NotificationUtils.formatTimeAgo(notif.time_ago)}
                                    </small>
                                </div>
                                <p class="text-gray-600 mb-0 small text-truncate">
                                    De: ${SSEManager.escapeHtml(empleadoNombre)}
                                </p>
                            </a>
                        </div>
                        
                        <div class="flex-shrink-0">
                            <button class="btn btn-sm btn-outline-danger btn-delete-notification" 
                                    data-id="${notif.id}" 
                                    title="Eliminar notificación"
                                    style="z-index: 5; position: relative;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            container.append(notificationHTML);
        });
    }

    static async deleteNotification(notificationId, element) {
        $("#notificationMenu").removeClass("show").hide();
        NOTIFICATION_STATE.dropdownVisible = false;

        try {
            const result = await AlertManager.confirm(
                '¿Eliminar notificación?',
                'Esta acción no se puede deshacer',
                'Sí, eliminar',
                'Cancelar'
            );

            if (result.isConfirmed) {
                const response = await $.ajax({
                    url: "eliminarNotificacion",
                    type: "POST",
                    data: {
                        id: notificationId,
                        id_empleado: $('#user_id').data('id')
                    },
                    dataType: 'json'
                });

                if (response.exito) {
                    element.closest('.notification-item').remove();
                    const current = parseInt($("#notificationCounter").text()) || 0;
                    const newCount = Math.max(0, current - 1);
                    this.updateBadge(newCount);
                    AlertManager.success('¡Eliminada!', 'La notificación ha sido eliminada.');
                } else {
                    AlertManager.error('Error', response.mensaje || 'No se pudo eliminar la notificación');
                }
            }
        } catch (error) {
            Logger.error('Error eliminando notificación:', error);
            AlertManager.error('Error', 'Ocurrió un error al intentar eliminar');
        }
    }

    static async markAllAsRead() {
        $("#notificationMenu").removeClass("show").hide();
        NOTIFICATION_STATE.dropdownVisible = false;

        try {
            const result = await AlertManager.confirm(
                '¿Marcar todas como leídas?',
                'Se marcarán todas las notificaciones como leídas',
                'Sí, marcar',
                'Cancelar'
            );

            if (result.isConfirmed) {
                AlertManager.loading('Procesando...', 'Marcando notificaciones como leídas');

                const response = await $.ajax({
                    url: "marcarTodasLeidas",
                    type: "POST",
                    dataType: 'json'
                });

                AlertManager.close();

                if (response.exito === true) {
                    this.loadNotifications();
                    let mensaje = response.mensaje;
                    if (response.filas_afectadas === 0) {
                        mensaje = 'No había notificaciones pendientes por leer';
                    }
                    AlertManager.success('¡Hecho!', mensaje);
                } else {
                    AlertManager.error('Error', response.mensaje);
                }
            }
        } catch (error) {
            AlertManager.close();
            AlertManager.error('Error', 'No se pudo completar la operación');
        }
    }

    static async deleteAllNotifications() {
        $("#notificationMenu").removeClass("show").hide();
        NOTIFICATION_STATE.dropdownVisible = false;

        try {
            const result = await AlertManager.confirm(
                '¿Eliminar todas las notificaciones?',
                'Esta acción no se puede deshacer. Se eliminarán todas tus notificaciones.',
                'Sí, eliminar todas',
                'Cancelar'
            );

            if (result.isConfirmed) {
                AlertManager.loading('Procesando...', 'Eliminando todas las notificaciones');

                const response = await $.ajax({
                    url: "eliminarTodasNotificaciones",
                    type: "POST",
                    dataType: 'json'
                });

                AlertManager.close();

                if (response.exito === true) {
                    this.loadNotifications();
                    this.updateBadge(0);
                    AlertManager.success('¡Hecho!', 'Todas las notificaciones han sido eliminadas');
                } else {
                    AlertManager.error('Error', response.mensaje || 'No se pudieron eliminar las notificaciones');
                }
            }
        } catch (error) {
            AlertManager.close();
            Logger.error('Error eliminando notificaciones:', error);
            AlertManager.error('Error', 'No se pudo completar la operación');
        }
    }

    static async markNotificationAsRead(notificationId, notificationElement) {
        try {
            const response = await $.ajax({
                url: "marcarLeidas",
                type: "POST",
                data: {
                    id: notificationId,
                    id_empleado: $('#user_id').data('id')
                }
            });

            if (response.exito) {
                notificationElement
                    .removeClass('unread border-start border-primary border-3')
                    .addClass('read');
                notificationElement.find('h6').removeClass('fw-bold');

                const current = parseInt($("#notificationCounter").text()) || 0;
                const newCount = Math.max(0, current - 1);
                this.updateBadge(newCount);
                $("#notificationHeader").text(`${newCount} Notificación${newCount !== 1 ? 'es' : ''}`);
            }
        } catch (error) {
            Logger.error('Error al marcar como leída:', error);
        }
    }
}

// ============ INICIALIZACIÓN ============ //
$(function () {
    // Verificar si es página de login
    if (NotificationUtils.isLoginPage()) {
        Logger.info('Página de login - SSE DESACTIVADO');
        return;
    }

    Logger.info('Inicializando sistema de notificaciones...');

    // Verificar soporte SSE
    if (!window.EventSource) {
        Logger.error('Navegador no soporta SSE');
        AlertManager.warning('Compatibilidad', 'Tu navegador no soporta notificaciones en tiempo real');
        return;
    }

    // Limpiar estado
    NOTIFICATION_STATE.notificacionesProcesadas.clear();
    NOTIFICATION_STATE.ultimoToastTime = 0;
    NOTIFICATION_STATE.procesandoNotificacion = false;

    // Cargar notificaciones iniciales (Diferido 1s para no bloquear carga)
    setTimeout(() => {
        NotificationManager.loadNotifications();
    }, 1000);

    // Conectar SSE
    SSEManager.conectarSSE();

    // Configurar polling como fallback
    window.notificationPollingInterval = setInterval(() => {
        if (!NOTIFICATION_STATE.sseConnected && !NOTIFICATION_STATE.dropdownVisible) {
            Logger.info('Usando polling (SSE desconectado)');
            NotificationManager.loadNotifications();
        }
    }, NOTIFICATIONS_CONFIG.SSE.POLLING_INTERVAL);

    // Configurar event listeners
    setupEventListeners();

    Logger.info('Sistema de notificaciones inicializado');
});

// Detectar navegación/recarga para evitar errores SSE
window.isUnloading = false;
window.addEventListener('beforeunload', () => {
    window.isUnloading = true;
    SSEManager.desconectarSSE();
});

// ============ CONFIGURACIÓN DE EVENT LISTENERS ============ //
function setupEventListeners() {
    // Abrir/cerrar dropdown de notificaciones
    $("#notificationDropdown").on("click", function (e) {
        e.stopPropagation();
        NOTIFICATION_STATE.dropdownVisible = !NOTIFICATION_STATE.dropdownVisible;

        $("#notificationMenu").toggleClass("show").css("display", NOTIFICATION_STATE.dropdownVisible ? "block" : "none");

        if (NOTIFICATION_STATE.dropdownVisible) {
            NotificationManager.loadNotifications();
        }
    });

    // Cerrar dropdown al hacer clic fuera
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#notificationDropdown, #notificationMenu").length) {
            $("#notificationMenu").removeClass("show").hide();
            NOTIFICATION_STATE.dropdownVisible = false;
        }
    });

    // Eliminar notificación
    $(document).on("click", ".btn-delete-notification", function (e) {
        e.preventDefault();
        e.stopPropagation();
        NotificationManager.deleteNotification($(this).data('id'), $(this));
    });

    // Marcar todas como leídas
    $(document).on("click", "#markAllRead", function (e) {
        e.preventDefault();
        NotificationManager.markAllAsRead();
    });

    // Eliminar todas las notificaciones
    $(document).on("click", "#deleteAllNotifications", function (e) {
        e.preventDefault();
        NotificationManager.deleteAllNotifications();
    });

    // Marcar notificación individual como leída
    $(document).on("click", ".notification-item", function (e) {
        const notifId = $(this).data('id');

        if ($(this).hasClass('unread')) {
            NotificationManager.markNotificationAsRead(notifId, $(this));
        }

        if (!$(e.target).closest('.btn-delete-notification').length) {
            const link = $(this).find('a.stretched-link').attr('href');
            if (link && link !== '#') {
                e.preventDefault();
                window.location.href = link;
            }
        }
    });
}

// ============ FUNCIONES DE DEBUG (SOLO DESARROLLO) ============ //
if (NOTIFICATIONS_CONFIG.SSE.DEBUG) {
    window.debugNotifications = () => {
        console.log('=== DEBUG SISTEMA NOTIFICACIONES ===');
        console.log('Estado SSE:', NOTIFICATION_STATE.sseConnected);
        console.log('EventSource:', NOTIFICATION_STATE.eventSource);
        console.log('Estado EventSource:', NOTIFICATION_STATE.eventSource?.readyState);
        console.log('Último ID:', NOTIFICATION_STATE.lastNotificationId);
        console.log('IDs procesados:', NOTIFICATION_STATE.notificacionesProcesadas.size);
        console.log('Procesando ahora:', NOTIFICATION_STATE.procesandoNotificacion);
        console.log('Dropdown visible:', NOTIFICATION_STATE.dropdownVisible);
        console.log('====================================');
    };

    // Debug automático cada 30 segundos
    setInterval(() => {
        Logger.info('Debug automático - SSE Conectado:', NOTIFICATION_STATE.sseConnected);
    }, 30000);
}