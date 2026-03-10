function editarRuta(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    // Ajustamos el título del modal genérico
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-route me-2"></i> Editar Ruta';

    // Limpiar contenido y poner un spinner de carga
    document.getElementById('modalContenido').innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Obteniendo datos de la ruta...</p>
        </div>
    `;

    modal.show();

    // Petición para obtener los datos del vehículo
    $.ajax({
        url: 'ruta_detalle',
        method: 'GET',
        data: { id_ruta: id },
        dataType: 'json',
        success: function (data) {
            if (!data) {
                document.getElementById('modalContenido').innerHTML = '<div class="alert alert-danger m-3">No se pudieron cargar los datos de la ruta.</div>';
                return;
            }

            // Inyectamos el formulario de edición con los datos cargados
            document.getElementById('modalContenido').innerHTML = `
                <form id="formEditarRuta" novalidate>
                    <input type="hidden" name="id_ruta" id="id_ruta" value="${data.id_ruta}">
                    
                    <div class="modal-body">
                        <div class="row">
                            <div id="nombreRU" class="col-md-6 mb-3">
                                <label for="nombre_ruta" class="form-label font-weight-bold">Nombre de la Ruta</label>
                                <input type="text" name="nombre_ruta" id="nombre_ruta" class="form-control" 
                                    placeholder="Escriba un nombre para la ruta" value="${data.nombre_ruta || ''}">
                                <div id="nombre_rutaError" class="invalid-feedback"></div>
                            </div>
                            
                            <div id="tipoRU" class="col-md-6 mb-3">
                                <label for="tipo_ruta" class="form-label font-weight-bold">Tipo de Ruta</label>
                                <select name="tipo_ruta" id="tipo_ruta" class="form-control">
                                    <option value="" disabled>Seleccione...</option>
                                    <option value="Extra-Urbana" ${data.tipo_ruta === 'Extra-Urbana' ? 'selected' : ''}>Extra-Urbana</option>
                                    <option value="Inter-Urbana" ${data.tipo_ruta === 'Inter-Urbana' ? 'selected' : ''}>Inter-Urbana</option>
                                    <option value="Vacacional" ${data.tipo_ruta === 'Vacacional' ? 'selected' : ''}>Vacacional</option>
                                    <option value="Extra-Urbana Vacacional" ${data.tipo_ruta === 'Extra-Urbana Vacacional' ? 'selected' : ''}>Extra-Urbana Vacacional</option>
                                    <option value="Inter-Urbana Vacacional" ${data.tipo_ruta === 'Inter-Urbana Vacacional' ? 'selected' : ''}>Inter-Urbana Vacacional</option>
                                </select>
                                <div id="tipo_rutaError" class="invalid-feedback"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div id="horarioSalidaRU" class="col-md-4 mb-3">
                                <label for="horario_salida" class="form-label font-weight-bold">Hora de Salida</label>
                                <input type="time" name="horario_salida" id="horario_salida" class="form-control" 
                                    value="${data.horario_salida || ''}">
                                <div id="horario_salidaError" class="invalid-feedback"></div>
                            </div>
                            
                            <div id="horarioLlegadaRU" class="col-md-4 mb-3">
                                <label for="horario_llegada" class="form-label font-weight-bold">Hora de Llegada</label>
                                <input type="time" name="horario_llegada" id="horario_llegada" class="form-control" 
                                    value="${data.horario_llegada || ''}">
                                <div id="horario_llegadaError" class="invalid-feedback"></div>
                            </div>
                            
                            <div id="estatusRU" class="col-md-4 mb-3">
                                <label for="estatus_ruta" class="form-label font-weight-bold">Estatus</label>
                                <select name="estatus" id="estatus_ruta" class="form-control">
                                    <option value="Activa" ${data.estatus === 'Activa' ? 'selected' : ''}>Activa</option>
                                    <option value="Inactiva" ${data.estatus === 'Inactiva' ? 'selected' : ''}>Inactiva</option>
                                </select>
                                <div id="estatus_rutaError" class="invalid-feedback"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div id="puntoPartidaRU" class="col-md-6 mb-3">
                                <label for="punto_partida" class="form-label font-weight-bold">Punto de Partida</label>
                                <input type="text" name="punto_partida" id="punto_partida" class="form-control" 
                                    placeholder="Ej: Terminal Principal" value="${data.punto_partida || ''}">
                                <div id="punto_partidaError" class="invalid-feedback"></div>
                            </div>
                            
                            <div id="puntoDestinoRU" class="col-md-6 mb-3">
                                <label for="punto_destino" class="form-label font-weight-bold">Punto de Destino</label>
                                <input type="text" name="punto_destino" id="punto_destino" class="form-control" 
                                    placeholder="Ej: Sede Universitaria" value="${data.punto_destino || ''}">
                                <div id="punto_destinoError" class="invalid-feedback"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div id="trayectoriaRU" class="col-md-12 mb-3">
                                <label for="trayectoria" class="form-label font-weight-bold">Trayectoria Detallada</label>
                                <textarea name="trayectoria" id="trayectoria" class="form-control" rows="3" 
                                        placeholder="Describa el recorrido completo de la ruta...">${data.trayectoria || ''}</textarea>
                                <div id="trayectoriaError" class="invalid-feedback"></div>
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

            // Re-vincular validaciones
            if (typeof inicializarValidacionesEditarRuta === 'function') {
                inicializarValidacionesEditarRuta();
            }
        },
        error: function () {
            document.getElementById('modalContenido').innerHTML = '<div class="alert alert-danger m-3">Error al conectar con el servidor.</div>';
        }
    });
}