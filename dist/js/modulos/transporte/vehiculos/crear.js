function abrirModalCrearVehiculo() {
    const modal = document.getElementById('modalGenerico');
    document.getElementById('modalGenericoTitle').textContent = 'Registrar Nuevo Vehículo';
    document.getElementById('modalContenido').innerHTML = `
        <form id="formCrearVehiculo">
            <div class="row">
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Placa</label>
                        <input type="text" name="placa" id="placa" class="form-control" 
                               placeholder="Ej: ABC1234" maxlength="7">
                        <div class="invalid-feedback" id="placaError"></div>
                    </div>
                </div>
                <!-- ... más campos ... -->
            </div>
            <div class="text-end mt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Registrar
                </button>
            </div>
        </form>
    `;

    // Inicializar validaciones del formulario aquí
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}
