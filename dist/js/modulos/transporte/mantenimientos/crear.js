// Variable para almacenar los repuestos y no pedirlos al server en cada fila nueva
let listaRepuestosDisponibles = [];

function abrirModalCrearMantenimiento() {
    const modal = document.getElementById('modalGenerico');
    const fechaHoy = new Date().toISOString().split('T')[0];

    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-wrench me-2"></i> Registrar Mantenimiento de Vehículo';

    document.getElementById('modalContenido').innerHTML = `
        <form id="formCrearMantenimiento" novalidate>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="id_vehiculo_mantenimiento" class="font-weight-bold">Vehículo</label>
                        <select name="id_vehiculo_mantenimiento" id="id_vehiculo_mantenimiento" class="form-control select2">
                            <option value="" disabled selected>Cargando vehículos...</option>
                        </select>
                        <div id="id_vehiculo_mantenimientoError" class="invalid-feedback"></div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="fecha_mantenimiento" class="font-weight-bold">Fecha</label>
                        <input type="date" name="fecha_mantenimiento" id="fecha_mantenimiento" 
                               class="form-control" min="${fechaHoy}" value="${fechaHoy}">
                        <div id="fecha_mantenimientoError" class="invalid-feedback"></div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="tipo_mantenimiento" class="font-weight-bold">Tipo</label>
                        <select name="tipo_mantenimiento" id="tipo_mantenimiento" class="form-control">
                            <option value="" disabled selected>Seleccione...</option>
                            <option value="Preventivo">Preventivo</option>
                            <option value="Correctivo">Correctivo</option>
                        </select>
                        <div id="tipo_mantenimientoError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12 mb-3">
                        <label for="descripcion_mant" class="font-weight-bold">Descripción</label>
                        <textarea name="descripcion_mant" id="descripcion_mant" class="form-control" rows="2"
                                  placeholder="Trabajo realizado..." maxlength="255"></textarea>
                        <div id="descripcion_mantError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12 mb-3">
                        <label for="uso_repuestos" class="font-weight-bold">¿Usar repuestos del inventario?</label>
                        <select class="form-control" id="uso_repuestos" name="uso_repuestos">
                            <option value="0" selected>No</option>
                            <option value="1">Sí</option>
                        </select>
                    </div>
                </div>

                <div id="repuestos_container" class="mt-2 shadow-sm" style="display: none;">
                    <div class="card border-primary">
                        <div class="card-header d-flex justify-content-between align-items-center bg-light py-2">
                            <h6 class="mb-0 font-weight-bold text-primary">Repuestos utilizados</h6>
                            <button type="button" class="btn btn-primary btn-sm" id="btn-agregar-repuesto">
                                <i class="fas fa-plus"></i> Agregar
                            </button>
                        </div>
                        <div class="card-body p-3" id="repuestos_rows" style="max-height: 250px; overflow-y: auto;">
                            </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer mt-3">
                <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-success shadow-sm">
                    <i class="fas fa-save me-1"></i> Registrar Mantenimiento
                </button>
            </div>
        </form>
    `;

    TransporteLoader.cargar('mantenimientos', 'validar_crear', function () {
        if (typeof inicializarValidacionesMantenimiento === 'function') {
            inicializarValidacionesMantenimiento();
        }

        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.show();

        // 1. Cargar datos iniciales
        cargarDatosMantenimiento();

        // 2. Lógica de Toggle Repuestos
        const selectUso = document.getElementById('uso_repuestos');
        const container = document.getElementById('repuestos_container');

        selectUso.addEventListener('change', function () {
            const mostrar = this.value === "1";
            container.style.display = mostrar ? "block" : "none";
            if (mostrar && document.querySelectorAll('.repuesto-row').length === 0) {
                agregarFilaRepuesto();
            }
        });

        // 3. Botón agregar fila
        document.getElementById('btn-agregar-repuesto').addEventListener('click', agregarFilaRepuesto);
    });
}

/**
 * Trae Vehículos y Repuestos en paralelo
 */
async function cargarDatosMantenimiento() {
    try {
        const [resVeh, resRep] = await Promise.all([
            fetch('obtener_vehiculos_activos'),
            fetch('repuestos_data_json') //Aca modificar porque deben ser solo repuestos con stock
        ]);

        const vehiculos = await resVeh.json();
        const allRep = await resRep.json();
        // Solo repuestos que tengan stock (cantidad > 0)
        listaRepuestosDisponibles = allRep.filter(r => (parseInt(r.cantidad) || 0) > 0);

        $('.select2').select2({
            theme: 'bootstrap-5',
            allowClear: true,
            width: '100%'
        });

        // Poblar Vehículos
        const selectVeh = document.getElementById('id_vehiculo_mantenimiento');
        selectVeh.innerHTML = '<option value="" selected disabled>Seleccione un vehículo...</option>';
        vehiculos.forEach(v => {
            selectVeh.innerHTML += `<option value="${v.id_vehiculo}">${v.placa} - ${v.modelo}</option>`;
        });

    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

/**
 * Lógica para añadir filas de repuestos
 */
function agregarFilaRepuesto() {
    if (listaRepuestosDisponibles.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Inventario vacío', text: 'No hay repuestos registrados.' });
        return;
    }

    const container = document.getElementById('repuestos_rows');
    const newRow = document.createElement('div');
    newRow.className = 'row repuesto-row mb-3 align-items-center border-bottom pb-2';

    const repuestoOptions = listaRepuestosDisponibles.map(r => `
        <option value="${r.id_repuesto}" data-cantidad="${r.cantidad}">
            ${r.nombre} (Stock: ${r.cantidad})
        </option>
    `).join('');

    newRow.innerHTML = `
        <div class="col-md-6">
            <select class="form-control select2-repuesto" name="repuestos[]">
                <option value="">Seleccionar repuesto...</option>
                ${repuestoOptions}
            </select>
        </div>
        <div class="col-md-4">
            <select class="form-control cantidad-repuesto" name="cantidades[]" disabled>
                <option value="">Cantidad</option>
            </select>
        </div>
        <div class="col-md-2 text-center">
            <button type="button" class="btn btn-outline-danger btn-sm border-0 btn-eliminar-repuesto">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    container.appendChild(newRow);

    // Evento para manejar el cambio de repuesto y habilitar cantidades
    const selectRep = newRow.querySelector('.select2-repuesto');
    const selectCant = newRow.querySelector('.cantidad-repuesto');

    selectRep.addEventListener('change', function () {
        const option = this.selectedOptions[0];
        const stock = parseInt(option.dataset.cantidad) || 0;

        // Poblar cantidades según stock disponible
        selectCant.innerHTML = '<option value="">Cantidad</option>';
        for (let i = 1; i <= stock; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            selectCant.appendChild(opt);
        }
        selectCant.disabled = (stock <= 0);

        // Limpiar error visual del select de repuesto
        selectRep.classList.remove('is-invalid');

        // Verificar si este repuesto ya está seleccionado en otra fila
        if (this.value) {
            const todasFilas = document.querySelectorAll('.repuesto-row');
            let duplicado = false;
            todasFilas.forEach(fila => {
                const otroSelect = fila.querySelector('.select2-repuesto');
                if (otroSelect !== this && otroSelect.value === this.value) {
                    duplicado = true;
                }
            });
            if (duplicado) {
                this.classList.add('is-invalid');
                AlertManager.warning('Duplicado', 'Este repuesto ya fue seleccionado en otra fila. Por favor elige otro.');
            }
        }
    });

    // Limpiar error visual al seleccionar cantidad
    selectCant.addEventListener('change', function () {
        if (this.value) {
            this.classList.remove('is-invalid');
        }
    });

    // Botón eliminar
    newRow.querySelector('.btn-eliminar-repuesto').addEventListener('click', () => newRow.remove());
}