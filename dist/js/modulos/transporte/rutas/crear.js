function abrirModalCrearRuta() {
    const modal = document.getElementById('modalGenerico');

    // Ajustamos el título del modal genérico
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-route me-2"></i> Registrar Nueva Ruta de Transporte';

    // Inyectamos el contenido respetando IDs y Names originales
    document.getElementById('modalContenido').innerHTML = `
        <form id="formCrearRuta" novalidate>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="nombre_ruta" class="form-label font-weight-bold">Nombre de la Ruta</label>
                        <input type="text" name="nombre_ruta" id="nombre_ruta" class="form-control" 
                               placeholder="Escriba un nombre para la ruta">
                        <div id="nombre_rutaError" class="invalid-feedback"></div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <label for="tipo_ruta" class="form-label font-weight-bold">Tipo de Ruta</label>
                        <select name="tipo_ruta" id="tipo_ruta" class="form-control">
                            <option value="" disabled selected>Seleccione...</option>
                            <option value="Extra-Urbana">Extra-Urbana</option>
                            <option value="Inter-Urbana">Inter-Urbana</option>
                            <option value="Vacacional">Vacacional</option>
                            <option value="Extra-Urbana Vacacional">Extra-Urbana Vacacional</option>
                            <option value="Inter-Urbana Vacacional">Inter-Urbana Vacacional</option>
                        </select>
                        <div id="tipo_rutaError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row mt-2">
                    <div class="col-md-4 mb-3">
                        <label for="horario_salida" class="form-label font-weight-bold">Hora de Salida</label>
                        <input type="time" name="horario_salida" id="horario_salida" class="form-control">
                        <div id="horario_salidaError" class="invalid-feedback"></div>
                    </div>
                    
                    <div class="col-md-4 mb-3">
                        <label for="horario_llegada" class="form-label font-weight-bold">Hora de Llegada</label>
                        <input type="time" name="horario_llegada" id="horario_llegada" class="form-control">
                        <div id="horario_llegadaError" class="invalid-feedback"></div>
                    </div>
                    
                    <div class="col-md-4 mb-3">
                        <label for="estatus_ruta" class="form-label font-weight-bold">Estatus</label>
                        <select name="estatus" id="estatus_ruta" class="form-control">
                            <option value="" selected disabled>Seleccione...</option>
                            <option value="Activa">Activa</option>
                            <option value="Inactiva">Inactiva</option>
                        </select>
                        <div id="estatus_rutaError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row mt-2">
                    <div class="col-md-6 mb-3">
                        <label for="punto_partida" class="form-label font-weight-bold">Punto de Partida</label>
                        <input type="text" name="punto_partida" id="punto_partida" class="form-control" 
                               placeholder="Ej: Terminal Principal">
                        <div id="punto_partidaError" class="invalid-feedback"></div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <label for="punto_destino" class="form-label font-weight-bold">Punto de Destino</label>
                        <input type="text" name="punto_destino" id="punto_destino" class="form-control" 
                               placeholder="Ej: Sede Universitaria">
                        <div id="punto_destinoError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row mt-2">
                    <div class="col-md-12 mb-3">
                        <label for="trayectoria" class="form-label font-weight-bold">Trayectoria Detallada</label>
                        <textarea name="trayectoria" id="trayectoria" class="form-control" rows="3" 
                                  placeholder="Describa el recorrido completo de la ruta..."></textarea>
                        <div id="trayectoriaError" class="invalid-feedback"></div>
                    </div>
                </div>
            </div>

            <div class="modal-footer border-top-0 d-flex justify-content-end">
                <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cerrar
                </button>
                <button type="submit" class="btn btn-success shadow-sm">
                    <i class="fas fa-save me-1"></i> Registrar Ruta
                </button>
            </div>
        </form>
    `;

    // Cargamos dependencias usando TransporteLoader
    TransporteLoader.cargar('rutas', 'validar_crear', function () {
        if (typeof inicializarValidacionesRuta === 'function') {
            inicializarValidacionesRuta();
        }

        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.show();
    });
}