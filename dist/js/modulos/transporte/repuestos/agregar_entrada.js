function abrirModalAgregarEntrada() {
    const modal = document.getElementById('modalGenerico');
    const fechaHoy = new Date().toISOString().split('T')[0];

    // 1. Título del modal
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-tools me-2"></i> Registrar Entrada de un repuesto';

    // 2. Estructura del formulario
    // Estructura para registrar ENTRADA de repuesto
    document.getElementById('modalContenido').innerHTML = `
        <form id="formEntradaRepuesto" novalidate>
            <input type="hidden" name="tipo_movimiento" id="tipo_movimiento" value="Entrada">
            
            <div class="modal-body">
                <div class="alert alert-info border-0 shadow-sm mb-4">
                    <div class="d-flex">
                        <i class="fas fa-info-circle mt-1 me-3"></i>
                        <div>
                            <span class="fw-bold">Nota:</span> Las entradas aumentarán el stock actual del repuesto seleccionado de forma automática.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div id="repuestoRE" class="col-md-8 mb-3">
                        <label for="id_repuesto" class="form-label font-weight-bold">Repuesto a Ingresar</label>
                        <select name="id_repuesto" id="id_repuesto" class="form-control select2">
                            <option value="" disabled selected>Cargando repuestos...</option>
                        </select>
                        <div id="id_repuestoError" class="invalid-feedback"></div>
                    </div>

                    <div id="cantidadRE" class="col-md-4 mb-3">
                        <label for="cantidad" class="form-label font-weight-bold">Cantidad</label>
                        <div class="input-group">
                            <span class="input-group-text bg-white"><i class="fas fa-plus text-success"></i></span>
                            <input type="text" name="cantidad" id="cantidad" class="form-control" 
                                placeholder="0" min="1">
                            <div id="cantidadError" class="invalid-feedback"></div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div id="razonRE" class="col-md-12 mb-3">
                        <label for="razon_movimiento" class="form-label font-weight-bold">Razón de Entrada</label>
                        <textarea name="razon_movimiento" id="razon_movimiento" class="form-control" rows="2" 
                                maxlength="100" placeholder="Ej: Compra a proveedor, reposición de stock..."></textarea>
                        <div id="razon_movimientoError" class="invalid-feedback"></div>
                    </div>
                </div>
            </div>

            <div class="modal-footer border-top-0 d-flex justify-content-end mt-2">
                <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-success shadow-sm">
                    <i class="fas fa-box-open me-1"></i> Registrar Entrada
                </button>
            </div>
        </form>
    `;

    // Ejecutamos la carga dinámica después de inyectar el HTML
    cargarRepuestos();

    // 3. Inicializar validaciones y mostrar modal
    TransporteLoader.cargar('repuestos', 'validar_entrada', function () {
        if (typeof inicializarValidacionesEntrada === 'function') {
            inicializarValidacionesEntrada();
        }

        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.show();
    });
}

/**
 * Carga dinámica de repuestos para el select
 */
async function cargarRepuestos() {
    try {
        const response = await fetch('repuestos_data_json');
        const proveedores = await response.json();

        const selectProv = document.getElementById('id_repuesto');
        selectProv.innerHTML = '<option value="" selected disabled>Seleccione un repuesto</option>';

        proveedores.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id_repuesto;
            option.textContent = `${p.nombre} - (${p.cantidad} unidades)`;

            selectProv.appendChild(option);
        });

        $('.select2').select2({
            theme: 'bootstrap-5',
            dropdownParent: $('#modalGenerico'),
            width: '100%'
        });

    } catch (error) {
        console.error("Error al cargar los repuestos:", error);
        document.getElementById('id_repuesto').innerHTML = '<option value="">Error al cargar</option>';
    }
}