/**
 * Función para mostrar los detalles de una jornada médica
 * @param {number} id - ID de la jornada médica
 */

function editarJornada(id) {
    //Mostrar modal inmediatamente con el spinner
    const modalElement = document.getElementById('modalJornada');
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (!modal) {
        modal = new bootstrap.Modal(modalElement);
    }

    //configurar titulo del modal
    $('#modalJornadaTitle').text('Editar Jornada Médica');

    //Limpiar y mostrar spinner en el body del modal
    $('#modalJornada .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información de la jornada médica...</p>
        </div>
    `);

    //Mostrar modal
    modal.show();

    $.ajax({
        url: 'jornada_detalle',
        method: 'GET',
        data: { id_jornada: id },
        dataType: 'json',
        success: function (data) {

            // Verificar si hay datos
            if (!data) {
                $('#modalJornada .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para esta jornada médica.
                    </div>
                `);
                return;
            }
            const jornada = data;

            //Formatear datos
            const nombre_jornada = jornada.nombre_jornada;
            const tipo_jornada = jornada.tipo_jornada;
            const fecha_inicio = jornada.fecha_inicio;
            const fecha_fin = jornada.fecha_fin;
            const ubicacion = jornada.ubicacion;
            const aforo_maximo = jornada.aforo_maximo;
            const descripcion = jornada.descripcion;
            const estatus = jornada.estatus;


            const modalContent = modalEditarJornada({
                id_jornada: jornada.id_jornada,
                nombre_jornada,
                tipo_jornada,
                fecha_inicio,
                fecha_fin,
                ubicacion,
                aforo_maximo,
                descripcion,
                estatus
            });

            //Mostrar modal
            $('#modalJornada .modal-body').html(modalContent);
            validarEditarJornada(id);
        },
        error: function (xhr, status, error) {
            console.error('Error en la solicitud:', error);

            //Mostrar error en el modal
            $('#modalJornada .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información de la jornada médica. Código de error: ${xhr.status}</p>
                            <p class="mb-0 small">${error}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarJornada(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
        }
    });
}
/**
 * Genera el contenido HTML para el modal de detalles de la jornada médica
 * @param {Object} datos - Objeto con los datos formateados de la jornada médica
 * @returns {string} HTML del contenido del modal
 */
function modalEditarJornada(datos) {
    // Helper para formatear fecha DB (YYYY-MM-DD HH:MM:SS) a datetime-local (YYYY-MM-DDTHH:MM)
    const formatForInput = (str) => {
        if (!str) return '';
        return str.replace(' ', 'T').substring(0, 16);
    };

    return `
        <form id="formEditarJornada" data-id="${datos.id_jornada || ''}">
            <!-- Tarjeta Principal -->
            <div class="card border-0 rounded-0 bg-light">
                <div class="card-body p-4">
                    <div class="row">
                        <!-- Columna Izquierda - Información General -->
                        <div class="col-md-6 border-end">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-info-circle me-2"></i> Información General
                            </h6>
                            
                            <!-- Nombre de la Jornada -->
                            <div class="mb-3">
                                <label for="editar_nombre_jornada" class="form-label text-muted small mb-1">
                                    <i class="fas fa-heading text-primary me-1"></i> Nombre de la Jornada
                                    <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" 
                                       id="editar_nombre_jornada" 
                                       name="nombre_jornada" 
                                       value="${datos.nombre_jornada || ''}" 
                                       required>
                                <div class="text-danger form-text" id="editar_nombre_jornadaError"></div>
                            </div>

                            <!-- Tipo de Jornada -->
                            <div class="mb-3">
                                <label for="editar_tipo_jornada" class="form-label text-muted small mb-1">
                                    <i class="fas fa-list-ul text-primary me-1"></i> Tipo de Jornada
                                </label>
                                <input class="form-control" list="listaTiposJornadaEditar" 
                                       id="editar_tipo_jornada" 
                                       name="tipo_jornada" 
                                       value="${datos.tipo_jornada || ''}" 
                                       placeholder="Seleccione o escriba...">
                                <datalist id="listaTiposJornadaEditar">
                                    <option value="Médica Integral">
                                    <option value="Vacunación">
                                    <option value="Odontológica">
                                    <option value="Pediátrica">
                                    <option value="Asistencia Social">
                                </datalist>
                                <div class="text-danger form-text" id="editar_tipo_jornadaError"></div>
                            </div>

                            <!-- Estatus -->
                            <div class="mb-3">
                                <label for="editar_estatus" class="form-label text-muted small mb-1">
                                    <i class="fas fa-chart-line text-primary me-1"></i> Estado
                                    <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="editar_estatus" name="estatus" required>
                                    <option value="Activa" ${datos.estatus === 'Activa' ? 'selected' : ''}>Activa</option>
                                    <option value="Cancelada" ${datos.estatus === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                                    <option value="Finalizada" ${datos.estatus === 'Finalizada' ? 'selected' : ''}>Finalizada</option>
                                </select>
                                <div class="text-danger form-text" id="editar_estatusError"></div>
                            </div>

                            <!-- Descripción -->
                            <div class="mb-3">
                                <label for="editar_descripcion" class="form-label text-muted small mb-1">
                                    <i class="fas fa-align-left text-primary me-1"></i> Descripción
                                </label>
                                <textarea class="form-control" 
                                          id="editar_descripcion" 
                                          name="descripcion" 
                                          rows="3">${datos.descripcion || ''}</textarea>
                                <div class="text-danger form-text" id="editar_descripcionError"></div>
                            </div>
                        </div>

                        <!-- Columna Derecha - Logística y Fechas -->
                        <div class="col-md-6">
                            <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                <i class="fas fa-calendar-alt me-2"></i> Logística y Cronograma
                            </h6>

                            <!-- Ubicación -->
                            <div class="mb-3">
                                <label for="editar_ubicacion" class="form-label text-muted small mb-1">
                                    <i class="fas fa-map-marker-alt text-danger me-1"></i> Ubicación
                                    <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" 
                                       id="editar_ubicacion" 
                                       name="ubicacion" 
                                       value="${datos.ubicacion || ''}" 
                                       required>
                                <div class="text-danger form-text" id="editar_ubicacionError"></div>
                            </div>

                            <!-- Aforo -->
                            <div class="mb-3">
                                <label for="editar_aforo_maximo" class="form-label text-muted small mb-1">
                                    <i class="fas fa-users text-primary me-1"></i> Aforo Máximo
                                </label>
                                <input type="number" class="form-control" 
                                       id="editar_aforo_maximo" 
                                       name="aforo_maximo" 
                                       value="${datos.aforo_maximo || ''}" 
                                       min="1">
                                <div class="text-danger form-text" id="editar_aforo_maximoError"></div>
                            </div>

                            <!-- Fecha Inicio -->
                            <div class="mb-3">
                                <label for="editar_fecha_inicio" class="form-label text-muted small mb-1">
                                    <i class="fas fa-clock text-success me-1"></i> Fecha de Inicio
                                    <span class="text-danger">*</span>
                                </label>
                                <input type="datetime-local" class="form-control" 
                                       id="editar_fecha_inicio" 
                                       name="fecha_inicio" 
                                       value="${formatForInput(datos.fecha_inicio)}" 
                                       required>
                                <div class="text-danger form-text" id="editar_fecha_inicioError"></div>
                            </div>

                            <!-- Fecha Fin -->
                            <div class="mb-3">
                                <label for="editar_fecha_fin" class="form-label text-muted small mb-1">
                                    <i class="fas fa-flag-checkered text-danger me-1"></i> Fecha de Fin
                                    <span class="text-danger">*</span>
                                </label>
                                <input type="datetime-local" class="form-control" 
                                       id="editar_fecha_fin" 
                                       name="fecha_fin" 
                                       value="${formatForInput(datos.fecha_fin)}" 
                                       required>
                                <div class="text-danger form-text" id="editar_fecha_finError"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Campos ocultos -->
                    <input type="hidden" name="id_jornada" id="id_jornada" value="${datos.id_jornada || ''}">
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="modal-footer border-top-0 bg-light py-3">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary" id="btnGuardarCambiosJornada">
                    <i class="fas fa-save me-1"></i> Guardar Cambios
                </button>
            </div>
        </form>
    `;
}
