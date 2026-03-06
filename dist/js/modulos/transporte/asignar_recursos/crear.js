function abrirModalCrearAsignacion() {
    const modal = document.getElementById('modalGenerico');
    const fechaHoy = new Date().toISOString().split('T')[0];

    // 1. Ajustamos el título
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-clipboard-check me-2"></i> Nueva Asignación de Recursos';

    // 2. Inyectamos la estructura estática (selects vacíos)
    document.getElementById('modalContenido').innerHTML = `
        <form id="formAsignarRecursos" novalidate>
            <div class="modal-body">
                <div class="row">
                    <div id="rutaAR" class="col-md-6 mb-3">
                        <label for="id_ruta" class="form-label font-weight-bold">Ruta Asignada</label>
                        <select name="id_ruta" id="id_ruta" class="form-control select2">
                            <option value="" disabled selected>Cargando rutas...</option>
                        </select>
                        <div id="id_rutaError" class="invalid-feedback"></div>
                    </div>

                    <div id="fechaAR" class="col-md-6 mb-3">
                        <label for="fecha_asignacion" class="form-label font-weight-bold">Fecha de Asignación</label>
                        <input type="date" name="fecha_asignacion" id="fecha_asignacion" 
                               class="form-control" min="${fechaHoy}" value="${fechaHoy}">
                        <div id="fecha_asignacionError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row mt-2">
                    <div id="vehiculoAR" class="col-md-6 mb-3">
                        <label for="id_vehiculo" class="form-label font-weight-bold">Vehículo</label>
                        <select name="id_vehiculo" id="id_vehiculo" class="form-control select2">
                            <option value="" disabled selected>Cargando vehículos...</option>
                        </select>
                        <div id="id_vehiculoError" class="invalid-feedback"></div>
                    </div>

                    <div id="choferAR" class="col-md-6 mb-3">
                        <label for="id_empleado" class="form-label font-weight-bold">Chofer / Conductor</label>
                        <select name="id_empleado" id="id_empleado" class="form-control select2">
                            <option value="" disabled selected>Cargando personal...</option>
                        </select>
                        <div id="id_empleadoError" class="invalid-feedback"></div>
                    </div>
                </div>

                <div class="row mt-2">
                    <div id="estatusAR" class="col-md-6 mb-3">
                        <label for="estatus" class="form-label font-weight-bold">Estatus de la Asignación</label>
                        <select name="estatus" id="estatus" class="form-control">
                            <option value="" disabled selected>Seleccione...</option>
                            <option value="Activa">Activa</option>
                            <option value="Inactiva">Inactiva</option>
                        </select>
                        <div id="estatusError" class="invalid-feedback"></div>
                    </div>
                </div>
            </div>

            <div class="modal-footer border-top-0 d-flex justify-content-end">
                <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">
                    <i class="fas fa-times me-1"></i> Cerrar
                </button>
                <button type="submit" class="btn btn-success shadow-sm">
                    <i class="fas fa-save me-1"></i> Registrar Asignación
                </button>
            </div>
        </form>
    `;

    // 3. Carga de datos y validaciones
    TransporteLoader.cargar('asignar_recursos', 'validar_crear', function () {
        if (typeof inicializarValidacionesAsignacion === 'function') {
            inicializarValidacionesAsignacion();
        }

        // Abrimos el modal
        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal.show();

        // 4. Disparamos la carga de datos desde la DB
        cargarDatosRelacionalesAsignacion();
    });
}

/**
 * Función para traer los datos mediante Fetch
 */
async function cargarDatosRelacionalesAsignacion() {
    try {
        // Ejecutamos las peticiones en paralelo para ganar velocidad
        const [resRutas, resVehiculos, resChoferes] = await Promise.all([
            fetch('obtener_rutas_activas'),
            fetch('obtener_vehiculos_activos'),
            fetch('obtener_choferes_activos')
        ]);

        const rutas = await resRutas.json();
        const vehiculos = await resVehiculos.json();
        const choferes = await resChoferes.json();

        // Población de Rutas
        const selectRuta = document.getElementById('id_ruta');
        selectRuta.innerHTML = '<option value="" disabled selected>Seleccione una ruta...</option>';
        rutas.forEach(r => {
            selectRuta.innerHTML += `<option value="${r.id_ruta}">${r.nombre_ruta} (${r.tipo_ruta})</option>`;
        });

        // Población de Vehículos
        const selectVehiculo = document.getElementById('id_vehiculo');
        selectVehiculo.innerHTML = '<option value="" disabled selected>Seleccione un vehículo...</option>';
        vehiculos.forEach(v => {
            selectVehiculo.innerHTML += `<option value="${v.id_vehiculo}" data-estado="${v.estado}">${v.placa} - ${v.modelo}</option>`;
        });

        // Población de Choferes
        const selectChofer = document.getElementById('id_empleado');
        selectChofer.innerHTML = '<option value="" disabled selected>Seleccione un chofer...</option>';
        choferes.forEach(c => {
            selectChofer.innerHTML += `<option value="${c.id_empleado}">${c.nombre} ${c.apellido} (${c.cedula})</option>`;
        });

        $('.select2').select2({
            theme: 'bootstrap-5',
            dropdownParent: $('#modalGenerico'),
            width: '100%'
        });

    } catch (error) {
        console.error("Error cargando datos para el modal:", error);
        AlertManager.error('Error', 'No se pudieron cargar los datos relacionales.');
    }
}