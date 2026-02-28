/**
 * Función para mostrar los detalles de un insumo
 * @param {number} id - ID del insumo
 */
function verInsumo(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalGenericoTitle').text('Detalle del Insumo');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalGenerico .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del insumo...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'inventario_detalle',
        method: 'GET',
        data: { id_insumo: id },
        dataType: 'json',
        success: function (data) {

            // Verificar si hay datos
            if (!data || !data.data) {
                $('#modalGenerico .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este insumo.
                    </div>
                `);
                return;
            }
            const insumo = data.data;

            //Formatear datos
            const nombre_insumo = `${insumo.nombre_insumo}`.trim();
            const descripcion = `${insumo.descripcion}`.trim();
            const nombre_presentacion = `${insumo.nombre_presentacion}`.trim();
            const tipo_insumo = `${insumo.tipo_insumo}`.trim();
            const fecha_vencimiento = `${insumo.fecha_vencimiento}`.trim();
            const fecha_creacion = `${insumo.fecha_creacion}`.trim();
            const cantidad = `${insumo.cantidad}`.trim();

            const modalContent = generarContenidoModal({
                nombre_insumo,
                descripcion,
                nombre_presentacion,
                tipo_insumo,
                fecha_vencimiento,
                fecha_creacion,
                cantidad
            });

            //Mostrar modal
            $('#modalGenerico .modal-body').html(modalContent);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //Mostrar error en el modal
            $('#modalGenerico .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del insumo. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verInsumo(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
/**
 * Genera el contenido HTML para el modal de detalles de la cita
 * @param {Object} datos - Objeto con los datos formateados de la cita
 * @returns {string} HTML del contenido del modal
 */
function generarContenidoModal(datos) {
    // Determinar icono según el tipo de insumo
    const obtenerIconoTipo = (tipo) => {
        const tipos = {
            'Medicamento': 'fas fa-pills',
            'Material': 'fas fa-box-open',
            'Quirúrgico': 'fas fa-syringe',
            'default': 'fas fa-box'
        };
        return tipos[tipo.toLowerCase()] || tipos.default;
    };

    // Determinar color según la cantidad disponible
    const determinarColorCantidad = (cantidad) => {
        if (cantidad <= 0) return 'danger';
        if (cantidad < 10) return 'warning';
        return 'success';
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return 'No especificada';
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calcular días restantes para vencimiento
    const calcularDiasVencimiento = (fechaVencimiento) => {
        if (!fechaVencimiento) return null;
        const hoy = new Date();
        const vencimiento = new Date(fechaVencimiento);
        const diffTime = vencimiento - hoy;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const diasVencimiento = calcularDiasVencimiento(datos.fecha_vencimiento);
    const colorCantidad = determinarColorCantidad(parseInt(datos.cantidad));
    const iconoTipo = obtenerIconoTipo(datos.tipo_insumo);

    return `
        <div class="card border-0 rounded-0 bg-light">
            <div class="card-body p-4">
                <div class="row">
                    <!-- Columna Izquierda - Información Básica del Insumo -->
                    <div class="col-md-6 border-end">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="${iconoTipo} me-2"></i> Información General del Insumo
                        </h6>
                        
                        <!-- Nombre del Insumo -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-tag"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Nombre del Insumo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2 fw-bold">
                                        ${datos.nombre_insumo || 'No especificado'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tipo de Insumo -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-filter"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Tipo de Insumo</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        <span class="badge bg-info">
                                            ${datos.tipo_insumo || 'No especificado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Descripción -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-align-left"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Descripción</label>
                                    <div class="form-control-plaintext bg-white rounded p-2" style="max-height: 100px; overflow-y: auto;">
                                        ${datos.descripcion || 'Sin descripción'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fecha de Registro -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-plus"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Registro</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${formatearFecha(datos.fecha_creacion)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha - Información Técnica y Stock -->
                    <div class="col-md-6">
                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                            <i class="fas fa-clipboard-check me-2"></i> Detalles de Inventario
                        </h6>

                        <!-- Presentación -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-box"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Presentación</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${datos.nombre_presentacion || 'No especificada'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cantidad Disponible -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-layer-group"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Cantidad Disponible</label>
                                    <div class="d-flex align-items-center">
                                        <div class="form-control-plaintext bg-white rounded p-2 me-2">
                                            ${datos.cantidad || '0'} unidades
                                        </div>
                                        <div class="badge bg-${colorCantidad}">
                                            ${colorCantidad === 'success' ? 'Disponible' :
            colorCantidad === 'warning' ? 'Stock Bajo' : 'Agotado'}
                                        </div>
                                    </div>
                                    ${parseInt(datos.cantidad) < 10 ?
            `<small class="text-warning d-block mt-1">
                                            <i class="fas fa-exclamation-triangle me-1"></i>
                                            Stock bajo - considerar reposición
                                        </small>` : ''
        }
                                </div>
                            </div>
                        </div>

                        <!-- Fecha de Vencimiento -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-calendar-times"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Fecha de Vencimiento</label>
                                    <div class="form-control-plaintext bg-white rounded p-2">
                                        ${formatearFecha(datos.fecha_vencimiento)}
                                    </div>
                                    ${diasVencimiento !== null ?
            `<div class="mt-2">
                                            ${diasVencimiento > 30 ?
                `<span class="badge bg-success">
                                                    <i class="fas fa-check-circle me-1"></i>
                                                    Vence en ${diasVencimiento} días
                                                </span>` :
                diasVencimiento > 0 ?
                    `<span class="badge bg-warning">
                                                    <i class="fas fa-clock me-1"></i>
                                                    Vence en ${diasVencimiento} días
                                                </span>` :
                    `<span class="badge bg-danger">
                                                    <i class="fas fa-exclamation-circle me-1"></i>
                                                    Vencido hace ${Math.abs(diasVencimiento)} días
                                                </span>`
            }
                                        </div>` :
            `<small class="text-muted">Sin fecha de vencimiento registrada</small>`
        }
                                </div>
                            </div>
                        </div>

                        <!-- Resumen de Estado -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-clipboard-list"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Resumen de Estado</label>
                                    <div class="row g-2">
                                        <!-- Estado de Stock -->
                                        <div class="col-6">
                                            <div class="bg-white rounded p-2 text-center border">
                                                <small class="d-block text-muted">Stock</small>
                                                <strong class="text-${colorCantidad}">
                                                    ${parseInt(datos.cantidad) > 0 ? 'Disponible' : 'Agotado'}
                                                </strong>
                                            </div>
                                        </div>
                                        
                                        <!-- Estado de Vencimiento -->
                                        <div class="col-6">
                                            <div class="bg-white rounded p-2 text-center border">
                                                <small class="d-block text-muted">Vencimiento</small>
                                                <strong class="${diasVencimiento !== null && diasVencimiento > 0 ?
            diasVencimiento > 30 ? 'text-success' : 'text-warning' : 'text-danger'}">
                                                    ${diasVencimiento !== null ?
            diasVencimiento > 0 ? 'Vigente' : 'Vencido' : 'N/A'
        }
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Recomendaciones -->
                        <div class="info-item mb-3">
                            <div class="d-flex align-items-start">
                                <div class="info-icon text-primary me-2 mt-1">
                                    <i class="fas fa-lightbulb"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <label class="form-label text-muted small mb-1">Recomendaciones</label>
                                    <div class="alert ${parseInt(datos.cantidad) < 10 ? 'alert-warning' : 'alert-info'} p-2 mb-0">
                                        <small>
                                            ${parseInt(datos.cantidad) <= 0 ?
            '<i class="fas fa-exclamation-triangle me-1"></i> Urgente: Insumo agotado, considerar reposición inmediata.' :
            parseInt(datos.cantidad) < 10 ?
                '<i class="fas fa-clock me-1"></i> Stock bajo, considerar reposición próximamente.' :
                '<i class="fas fa-check-circle me-1"></i> Stock en niveles adecuados.'
        }
                                            ${diasVencimiento !== null && diasVencimiento <= 30 ?
            ' <i class="fas fa-calendar-alt me-1"></i> Atención: Próximo a vencer.' : ''
        }
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer bg-light py-3">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-1"></i> Cerrar
            </button>
        </div>
    `;
}