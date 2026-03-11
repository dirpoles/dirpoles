function abrirModalMovimientos() {
    const modalElement = document.getElementById('modalGenerico');
    const modal = new bootstrap.Modal(modalElement);

    // Configurar título del modal
    document.getElementById('modalGenericoTitle').innerHTML = '<i class="fas fa-history me-2"></i> Historial de Movimientos de Inventario';

    // Inyectar estructura de la tabla y spinner inicial
    document.getElementById('modalContenido').innerHTML = `
        <div class="modal-body">
            <div class="table-responsive">
                <table id="tabla_movimientos" class="table table-striped table-hover w-100">
                    <thead class="bg-primary text-white">
                        <tr>
                            <th>Repuesto</th>
                            <th>Empleado</th>
                            <th>Cantidad</th>
                            <th>Tipo</th>
                            <th>Razón</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- DataTables cargarán los datos aquí -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal-footer border-top-0 d-flex justify-content-end">
            <button type="button" class="btn btn-secondary shadow-sm" data-bs-dismiss="modal">
                <i class="fas fa-times me-1"></i> Cerrar
            </button>
        </div>
    `;

    modal.show();

    // Inicializar DataTables
    $('#tabla_movimientos').DataTable({
        ajax: {
            url: 'repuestos_movimientos',
            dataSrc: ''
        },
        columns: [
            { data: 'nombre_repuesto' },
            { data: 'nombre_empleado' },
            { data: 'cantidad' },
            {
                data: 'tipo_movimiento',
                render: function (data) {
                    const badgeClass = data === 'Entrada' ? 'bg-success' : 'bg-danger';
                    const icon = data === 'Entrada' ? 'fa-arrow-down' : 'fa-arrow-up';
                    return `<span class="badge ${badgeClass}"><i class="fas ${icon} me-1"></i>${data}</span>`;
                }
            },
            { data: 'razon_movimiento' },
            {
                data: 'fecha_movimiento',
                render: function (data) {
                    return typeof moment !== 'undefined' ? moment(data).format('DD/MM/YYYY hh:mm A') : data;
                }
            }
        ],
        language: {
            url: 'plugins/DataTables/js/languaje.json'
        },
        order: [[0, 'desc']], // Ordenar por ID descendente por defecto
        responsive: true,
        autoWidth: false,
        dom: '<"d-flex justify-content-between align-items-center mb-3"fB>rtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel me-1"></i> Excel',
                className: 'btn btn-success btn-sm'
            },
            {
                extend: 'pdf',
                text: '<i class="fas fa-file-pdf me-1"></i> PDF',
                className: 'btn btn-danger btn-sm'
            }
        ]
    });
}
