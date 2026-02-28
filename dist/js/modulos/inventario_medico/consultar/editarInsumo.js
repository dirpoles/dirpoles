/**
 * Función para mostrar los detalles de un insumo
 * @param {number} id - ID del insumo
 */

function editarInsumo(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    //configurar titulo del modal
    $('#modalGenericoTitle').text('Editar Insumo');

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
            const id_insumo = insumo.id_insumo;
            const nombre_insumo = `${insumo.nombre_insumo}`.trim();
            const descripcion = `${insumo.descripcion}`.trim();
            const nombre_presentacion = `${insumo.nombre_presentacion}`.trim();
            const tipo_insumo = `${insumo.tipo_insumo}`.trim();
            const fecha_vencimiento = `${insumo.fecha_vencimiento}`.trim();
            const fecha_creacion = `${insumo.fecha_creacion}`.trim();
            const cantidad = `${insumo.cantidad}`.trim();
            const id_presentacion = insumo.id_presentacion;

            const modalContent = generarContenidoModalEditarInsumo({
                id_insumo,
                nombre_insumo,
                descripcion,
                nombre_presentacion,
                tipo_insumo,
                fecha_vencimiento,
                fecha_creacion,
                cantidad,
                id_presentacion
            });

            //Mostrar modal
            $('#modalGenerico .modal-body').html(modalContent);
            validarEditarInsumo(id_insumo);

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
function generarContenidoModalEditarInsumo(datos) {
    return `
        <form id="formEditarInsumo" data-id="${datos.id_insumo || ''}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información Básica -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-box me-2"></i> Información Básica del Insumo
                            </h6>
                            
                            <!-- Nombre del Insumo (Editable) -->
                            <div class="mb-3">
                                <label for="editar_nombre_insumo" class="form-label text-muted small mb-1">
                                    <i class="fas fa-tag text-primary me-1"></i> Nombre del Insumo
                                    <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control form-control-sm" 
                                       id="editar_nombre_insumo" 
                                       name="nombre_insumo" 
                                       value="${datos.nombre_insumo || ''}" 
                                       required>
                                <div class="text-danger form-text" id="editar_nombre_insumoError"></div>
                            </div>

                            <!-- Descripción (Editable) -->
                            <div class="mb-3">
                                <label for="editar_descripcion" class="form-label text-muted small mb-1">
                                    <i class="fas fa-align-left text-primary me-1"></i> Descripción
                                </label>
                                <textarea class="form-control form-control-sm" 
                                          id="editar_descripcion" 
                                          name="descripcion" 
                                          rows="3">${datos.descripcion || ''}</textarea>
                                <div class="text-danger form-text" id="editar_descripcionError"></div>
                            </div>

                            <!-- Tipo de Insumo (Editable) -->
                            <div class="mb-3">
                                <label for="editar_tipo_insumo" class="form-label text-muted small mb-1">
                                    <i class="fas fa-filter text-primary me-1"></i> Tipo de Insumo
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select form-select-sm" id="editar_tipo_insumo" name="tipo_insumo" required>
                                    <option value="" disabled>Seleccione un tipo</option>
                                    <option value="Medicamento" ${datos.tipo_insumo === 'Medicamento' ? 'selected' : ''}>Medicamento</option>
                                    <option value="Material" ${datos.tipo_insumo === 'Material' ? 'selected' : ''}>Material</option>
                                    <option value="Quirúrgico" ${datos.tipo_insumo === 'Quirúrgico' ? 'selected' : ''}>Quirúrgico</option>
                                </select>
                                <div class="text-danger form-text" id="editar_tipo_insumoError"></div>
                            </div>
                        </div>

                        <!-- Columna Derecha - Información de Inventario -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-clipboard-check me-2"></i> Información de Inventario
                            </h6>

                            <!-- Presentación (Editable) -->
                            <div class="mb-3">
                                <label for="editar_presentacion" class="form-label text-muted small mb-1">
                                    <i class="fas fa-box-open text-primary me-1"></i> Presentación
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select form-select-sm" id="editar_presentacion" name="id_presentacion" required>
                                    <option value="" disabled>Seleccione una presentación</option>
                                    <!-- Las opciones se cargarán dinámicamente vía AJAX -->
                                </select>
                                <div class="text-danger form-text" id="editar_presentacionError"></div>
                            </div>

                            <!-- Cantidad (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-layer-group text-primary me-1"></i> Cantidad Disponible
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.cantidad || '0'} unidades
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> La cantidad se modifica mediante entradas y salidas en el módulo de inventario.
                                </small>
                            </div>

                            <!-- Fecha de Creación (Solo lectura) -->
                            <div class="mb-3">
                                <label class="form-label text-muted small mb-1">
                                    <i class="fas fa-calendar-plus text-primary me-1"></i> Fecha de Registro
                                </label>
                                <div class="form-control form-control-sm bg-light text-muted" style="cursor: not-allowed;">
                                    ${datos.fecha_creacion || 'No especificada'}
                                </div>
                                <small class="form-text text-muted">
                                    <i class="fas fa-info-circle me-1"></i> Este campo no puede ser modificado.
                                </small>
                            </div>

                            <!-- Fecha de Vencimiento (Editable) -->
                            <div class="mb-3">
                                <label for="editar_fecha_vencimiento" class="form-label text-muted small mb-1">
                                    <i class="fas fa-calendar-times text-primary me-1"></i> Fecha de Vencimiento
                                </label>
                                <input type="date" class="form-control form-control-sm" 
                                       id="editar_fecha_vencimiento" 
                                       name="fecha_vencimiento" 
                                       value="${datos.fecha_vencimiento || ''}">
                                <div class="text-danger form-text" id="editar_fecha_vencimientoError"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Campos ocultos para datos necesarios -->
                    <input type="hidden" name="id_insumo" id="id_insumo" value="${datos.id_insumo || ''}">
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarCambiosInsumo">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>

        <script>
            // Cargar presentaciones
            $.ajax({
                url: 'presentaciones_json',
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.data && response.data.length > 0) {
                        const selectPresentacion = $('#editar_presentacion');
                        
                        // Limpiar opciones existentes excepto la primera
                        selectPresentacion.find('option:not(:first)').remove();
                        
                        // Agregar las presentaciones al select
                        response.data.forEach(function(presentacion) {
                            const optionText = presentacion.nombre_presentacion;
                            const option = new Option(optionText, presentacion.id_presentacion);
                            
                            // Pre-seleccionar la presentación actual si existe
                            if ('${datos.id_presentacion}' && presentacion.id_presentacion == '${datos.id_presentacion}') {
                                option.selected = true;
                            }
                            
                            selectPresentacion.append(option);
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error al cargar presentaciones:', error);
                }
            });
        </script>
    `;
}