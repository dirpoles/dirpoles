function editarRepuesto(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    // Ajustamos el título del modal genérico
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-route me-2"></i> Editar Repuesto';

    // Limpiar contenido y poner un spinner de carga
    document.getElementById('modalContenido').innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Obteniendo datos del Repuesto...</p>
        </div>
    `;

    modal.show();

    // Petición para obtener los datos del vehículo
    $.ajax({
        url: 'repuesto_detalle',
        method: 'GET',
        data: { id_repuesto: id },
        dataType: 'json',
        success: function (data) {
            if (!data) {
                document.getElementById('modalContenido').innerHTML = '<div class="alert alert-danger m-3">No se pudieron cargar los datos del repuesto.</div>';
                return;
            }

            // Inyectamos el formulario de edición con los datos del repuesto cargados
            document.getElementById('modalContenido').innerHTML = `
                <form id="formEditarRepuesto" novalidate>
                    <input type="hidden" name="id_repuesto" id="id_repuesto" value="${data.id_repuesto}">
                    
                    <div class="modal-body">
                        <div class="row">
                            <div id="nombreRE" class="col-md-6 mb-3">
                                <label for="nombre_repuesto" class="form-label font-weight-bold">Nombre del Repuesto</label>
                                <input type="text" name="nombre" id="nombre_repuesto" class="form-control" 
                                    placeholder="Ej: Filtro de aceite" maxlength="100" value="${data.nombre || ''}">
                                <div id="nombre_repuestoError" class="invalid-feedback"></div>
                            </div>

                            <div id="proveedorRE" class="col-md-6 mb-3">
                                <label for="id_proveedor" class="form-label font-weight-bold">Proveedor</label>
                                <select name="id_proveedor" id="id_proveedor" class="form-control select2">
                                    <option value="${data.id_proveedor}" selected>${data.nombre_proveedor || 'Seleccionando...'}</option>
                                </select>
                                <div id="id_proveedorError" class="invalid-feedback"></div>
                            </div>
                        </div>

                        <div class="row">
                            <div id="descripcionRE" class="col-md-12 mb-3">
                                <label for="descripcion" class="form-label font-weight-bold">Descripción</label>
                                <textarea name="descripcion" id="descripcion" class="form-control" rows="3" 
                                        maxlength="255" placeholder="Especificaciones técnicas...">${data.descripcion || ''}</textarea>
                                <div id="descripcionError" class="invalid-feedback"></div>
                            </div>
                        </div>

                        <div class="row">
                            <div id="fechaRE" class="col-md-6 mb-3">
                                <label for="fecha_creacion" class="form-label font-weight-bold">Fecha de Registro</label>
                                <input type="date" name="fecha_creacion" id="fecha_creacion" 
                                    class="form-control" value="${data.fecha_creacion || ''}">
                                <div id="fecha_creacionError" class="invalid-feedback"></div>
                            </div>

                            <div id="estatusRE" class="col-md-6 mb-3">
                                <label for="estatus_repuesto" class="form-label font-weight-bold">Estado Actual (Físico)</label>
                                <select name="estatus" id="estatus_repuesto" class="form-control">
                                    <option value="Nuevo" ${data.estatus === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
                                    <option value="Usado" ${data.estatus === 'Usado' ? 'selected' : ''}>Usado</option>
                                    <option value="Dañado" ${data.estatus === 'Dañado' ? 'selected' : ''}>Dañado</option>
                                </select>
                                <div id="estatus_repuestoError" class="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer border-top-0 d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cerrar
                        </button>
                        <button type="submit" class="btn btn-success shadow-sm">
                            <i class="fas fa-save me-1"></i> Guardar Cambios
                        </button>
                    </div>
                </form>
            `;
            // 2. Llamamos a la función para cargar proveedores
            cargarProveedoresEdicion(data.id_proveedor);

            // Re-vincular validaciones
            if (typeof inicializarValidacionesEditarRepuesto === 'function') {
                inicializarValidacionesEditarRepuesto();
            }
        },
        error: function () {
            document.getElementById('modalContenido').innerHTML = '<div class="alert alert-danger m-3">Error al conectar con el servidor.</div>';
        }
    });
}



/**
 * Carga los proveedores y selecciona el actual
 * @param {number} idProveedorActual - El ID que viene de la base de datos
 */
function cargarProveedoresEdicion(idProveedorActual) {
    const selectProveedor = $('#id_proveedor');

    // Inicializamos Select2 si lo usas
    if ($.fn.select2) {
        selectProveedor.select2({
            dropdownParent: $('#modalContenido'), // Para que no se oculte detrás del modal
            width: '100%',
            theme: 'bootstrap-5'
        });
    }

    $.ajax({
        url: 'proveedores_data_json',
        method: 'GET',
        dataType: 'json',
        success: function (proveedores) {
            let options = '<option value="" disabled>Seleccione un proveedor</option>';

            proveedores.forEach(prov => {
                // Si el ID del proveedor coincide con el del repuesto, lo marcamos como selected
                const selected = (prov.id_proveedor == idProveedorActual) ? 'selected' : '';
                options += `<option value="${prov.id_proveedor}" ${selected}>${prov.nombre}</option>`;
            });

            selectProveedor.html(options);

            // Refrescar Select2 para mostrar el cambio
            if ($.fn.select2) {
                selectProveedor.trigger('change');
            }
        },
        error: function () {
            selectProveedor.html('<option value="" disabled>Error al cargar proveedores</option>');
        }
    });
}