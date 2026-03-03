function abrirModalCrearVehiculo() {
    const modal = document.getElementById('modalGenerico');
    // Ajustamos el título del modal genérico
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-car me-2"></i> Registrar Nuevo Vehículo';

    // Inyectamos el contenido respetando IDs para tus validaciones
    document.getElementById('modalContenido').innerHTML = `
        <form id="formCrearVehiculo" novalidate>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="placa" class="form-label font-weight-bold">Placa</label>
                        <input type="text" name="placa" id="placa" class="form-control" 
                               placeholder="Ej: ABC1234" maxlength="7">
                        <div class="invalid-feedback" id="placaError"></div>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label for="modelo" class="form-label font-weight-bold">Modelo</label>
                        <input type="text" name="modelo" id="modelo" class="form-control" 
                               placeholder="Ej: Toyota HiAce 2023" maxlength="50">
                        <div id="modeloError" class="invalid-feedback"></div>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label for="tipo" class="form-label font-weight-bold">Tipo de Vehículo</label>
                        <select name="tipo" id="tipo" class="form-control">
                            <option value="" disabled selected>Seleccione un tipo</option>
                            <option value="Autobús">Autobús</option>
                            <option value="Camioneta">Camioneta</option>
                            <option value="Automóvil">Automóvil</option>
                        </select>
                        <div id="tipoError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row mt-2">
                    <div class="col-md-6 mb-3">
                        <label for="fecha_adquisicion" class="form-label font-weight-bold">Fecha de Adquisición</label>
                        <input type="date" name="fecha_adquisicion" id="fecha_adquisicion" class="form-control">
                        <div id="fechaError" class="invalid-feedback"></div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="estado" class="form-label font-weight-bold">Estado Actual</label>
                        <select name="estado" id="estado" class="form-control">
                            <option value="" selected disabled>Seleccione una opción</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                            <option value="Mantenimiento">Mantenimiento</option>
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
                    <i class="fas fa-save me-1"></i> Registrar Vehículo
                </button>
            </div>
        </form>
    `;

    // Mostramos el modal usando Bootstrap 5
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Importante: Aquí debes re-vincular los eventos de validación 
    // ya que al usar innerHTML, los listeners previos se pierden.
    if (typeof inicializarValidacionesVehiculo === 'function') {
        inicializarValidacionesVehiculo();
    }
}