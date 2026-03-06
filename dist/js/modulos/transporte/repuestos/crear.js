function abrirModalCrearRepuesto() {
    const modal = document.getElementById('modalGenerico');
    const fechaHoy = new Date().toISOString().split('T')[0];

    // 1. Título del modal
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-tools me-2"></i> Registrar Nuevo Repuesto';

    // 2. Estructura del formulario
    document.getElementById('modalContenido').innerHTML = `
        <form id="formCrearRepuesto" novalidate>
            <div class="modal-body">
                <div class="row">
                    <div id="nombreRE" class="col-md-6 mb-3">
                        <label for="nombre_repuesto" class="form-label font-weight-bold">Nombre del Repuesto</label>
                        <input type="text" name="nombre_repuesto" id="nombre_repuesto" class="form-control" 
                               placeholder="Ej: Filtro de aceite" maxlength="100">
                        <div id="nombre_repuestoError" class="invalid-feedback"></div>
                    </div>

                    <div id="proveedorRE" class="col-md-6 mb-3">
                        <label for="id_proveedor" class="form-label font-weight-bold">Proveedor</label>
                        <select name="id_proveedor" id="id_proveedor" class="form-control select2">
                            <option value="" disabled selected>Cargando proveedores...</option>
                        </select>
                        <div id="id_proveedorError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row">
                    <div id="descripcionRE" class="col-md-12 mb-3">
                        <label for="descripcion" class="form-label font-weight-bold">Descripción</label>
                        <textarea name="descripcion" id="descripcion" class="form-control" rows="3" 
                                  maxlength="255" placeholder="Especificaciones técnicas del repuesto..."></textarea>
                        <div id="descripcionError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row">
                    <div id="fechaRE" class="col-md-6 mb-3">
                        <label for="fecha_creacion" class="form-label font-weight-bold">Fecha de Registro</label>
                        <input type="date" name="fecha_creacion" id="fecha_creacion" 
                               class="form-control" max="${fechaHoy}" value="${fechaHoy}">
                        <div id="fecha_creacionError" class="invalid-feedback"></div>
                    </div>

                    <div id="estatusRE" class="col-md-6 mb-3">
                        <label for="estatus_repuesto" class="form-label font-weight-bold">Estado Actual</label>
                        <select name="estatus_repuesto" id="estatus_repuesto" class="form-control">
                            <option value="" selected disabled>Seleccione un estado</option>
                            <option value="Nuevo">Nuevo</option>
                            <option value="Usado">Usado</option>
                            <option value="Dañado">Dañado</option>
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
                    <i class="fas fa-save me-1"></i> Registrar Repuesto
                </button>
            </div>
        </form>
    `;

    // 3. Inicializar validaciones y mostrar modal
    TransporteLoader.cargar('repuestos', 'validar_crear', function () {
        if (typeof inicializarValidacionesRepuesto === 'function') {
            inicializarValidacionesRepuesto();
        }

        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.show();

        // 4. Cargar proveedores de la DB
        cargarProveedoresRepuesto();
    });
}

/**
 * Carga dinámica de proveedores para el select
 */
async function cargarProveedoresRepuesto() {
    try {
        const response = await fetch('proveedores_data_json');
        const proveedores = await response.json();

        const selectProv = document.getElementById('id_proveedor');
        selectProv.innerHTML = '<option value="" selected disabled>Seleccione un proveedor</option>';

        proveedores.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id_proveedor;
            option.textContent = `${p.nombre} (${p.tipo_documento}-${p.num_documento})`;

            selectProv.appendChild(option);
        });

        $('.select2').select2({
            theme: 'bootstrap-5',
            dropdownParent: $('#modalGenerico'),
            width: '100%'
        });

    } catch (error) {
        console.error("Error al cargar proveedores:", error);
        document.getElementById('id_proveedor').innerHTML = '<option value="">Error al cargar</option>';
    }
}