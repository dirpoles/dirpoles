function editarVehiculo(id) {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    // Ajustamos el título del modal genérico
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-car me-2"></i> Editar Vehículo';

    // Limpiar contenido y poner un spinner de carga
    document.getElementById('modalContenido').innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Obteniendo datos del vehículo...</p>
        </div>
    `;

    modal.show();

    // Petición para obtener los datos del vehículo
    $.ajax({
        url: 'vehiculo_detalle',
        method: 'GET',
        data: { id_vehiculo: id },
        dataType: 'json',
        success: function (data) {
            if (!data) {
                document.getElementById('modalContenido').innerHTML = '<div class="alert alert-danger m-3">No se pudieron cargar los datos del vehículo.</div>';
                return;
            }

            // Inyectamos el formulario
            document.getElementById('modalContenido').innerHTML = `
                <form id="formEditarVehiculo" novalidate>
                    <!-- Campo oculto para el ID -->
                    <input type="hidden" name="id_vehiculo" id="id_vehiculo" value="${id}">
                    
                    <div class="modal-body">
                        <div class="row">
                            <div id="placaV" class="col-md-4 mb-3">
                                <label for="placa" class="form-label font-weight-bold">Placa</label>
                                <input type="text" name="placa" id="placa" class="form-control" 
                                       placeholder="Ej: ABC1234" maxlength="7" value="${data.placa || ''}">
                                <div class="invalid-feedback" id="placaError"></div>
                            </div>

                            <div id="modeloV" class="col-md-4 mb-3">
                                <label for="modelo" class="form-label font-weight-bold">Modelo</label>
                                <input type="text" name="modelo" id="modelo" class="form-control" 
                                       placeholder="Ej: Toyota HiAce 2023" maxlength="50" value="${data.modelo || ''}">
                                <div id="modeloError" class="invalid-feedback"></div>
                            </div>

                            <div id="tipoV" class="col-md-4 mb-3">
                                <label for="tipo" class="form-label font-weight-bold">Tipo de Vehículo</label>
                                <select name="tipo" id="tipo" class="form-control">
                                    <option value="" disabled>Seleccione un tipo</option>
                                    <option value="Autobús" ${data.tipo === 'Autobús' ? 'selected' : ''}>Autobús</option>
                                    <option value="Camioneta" ${data.tipo === 'Camioneta' ? 'selected' : ''}>Camioneta</option>
                                    <option value="Automóvil" ${data.tipo === 'Automóvil' ? 'selected' : ''}>Automóvil</option>
                                </select>
                                <div id="tipoError" class="invalid-feedback"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div id="fechaV" class="col-md-6 mb-3">
                                <label for="fecha_adquisicion" class="form-label font-weight-bold">Fecha de Adquisición</label>
                                <input type="date" name="fecha_adquisicion" id="fecha_adquisicion" class="form-control" value="${data.fecha_adquisicion || ''}">
                                <div id="fechaError" class="invalid-feedback"></div>
                            </div>

                            <div id="estadoV" class="col-md-6 mb-3">
                                <label for="estado" class="form-label font-weight-bold">Estado Actual</label>
                                <select name="estado" id="estado" class="form-control">
                                    <option value="" disabled>Seleccione una opción</option>
                                    <option value="Activo" ${data.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                                    <option value="Inactivo" ${data.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                                    <option value="Mantenimiento" ${data.estado === 'Mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
                                </select>
                                <div id="estadoError" class="invalid-feedback"></div>
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
            if (typeof inicializarValidacionesEditarVehiculo === 'function') {
                inicializarValidacionesEditarVehiculo();
            }
        },
        error: function () {
            document.getElementById('modalContenido').innerHTML = '<div class="alert alert-danger m-3">Error al conectar con el servidor.</div>';
        }
    });
}