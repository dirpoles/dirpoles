//Datatable de vehiculos
$('#tabla_vehiculos').DataTable({
    ajax: {
        url: 'vehiculos_data_json',
        dataSrc: ''
    },
    searching: true,
    layout: {
        topStart: {
            buttons: [
                {
                    extend: 'excel',
                    text: '<i class="fas fa-file-excel"></i> Excel',
                    className: 'btn btn-success',
                    attr: {
                        id: 'btnExcel'
                    },
                    exportOptions: {
                        columns: ':visible',
                        format: {
                            body: function (data, row, column, node) {
                                // Limpiar HTML para Excel
                                return data.replace(/<[^>]*>/g, '');
                            }
                        }
                    }
                },
                {
                    extend: 'pdf',
                    text: '<i class="fas fa-file-pdf"></i> PDF',
                    className: 'btn btn-danger',
                    attr: {
                        id: 'btnPdf'
                    },
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: ':visible',
                        stripHtml: true
                    },
                    customize: PDFCustomizer.forTransporte()
                },
                {
                    text: '<i class="fas fa-plus"></i> Crear Vehiculo',
                    className: 'btn btn-info',
                    attr: {
                        id: 'btnCrear'
                    },
                    action: function () {
                        TransporteLoader.cargar('vehiculos', ['crear', 'validar_crear'], function () {
                            abrirModalCrearVehiculo();
                        });
                    }
                }
            ]
        },
    },
    ordering: true,
    order: [[0, 'desc']],
    responsive: true,
    pageLength: 10,
    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
    language: {
        url: 'plugins/DataTables/js/languaje.json'
    },
    columns: [
        {
            data: 'modelo',
            deferRender: true,
            render: function (data, type, row) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'placa',
            deferRender: true,
            render: function (data, type, row) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'tipo',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'fecha_adquisicion',
            deferRender: true,
            render: function (data, type, row) {
                // 1. Si no hay datos, mostrar mensaje
                if (!data) return '<span class="text-muted">No especificado</span>';

                // 2. Si DataTables pide el valor para "display" (mostrar en pantalla)
                if (type === 'display') {
                    // Formato: DD/MM/YYYY hh:mm A (Ej: 15/11/2023 03:30 PM)
                    return moment(data).format('DD/MM/YYYY');
                }

                return data;
            }
        },
        {
            data: 'estado',
            deferRender: true,
            render: function (data) {
                switch (data) {
                    case 'Activo':
                        return '<span class="badge bg-success">' + data + '</span>';
                    case 'Inactivo':
                        return '<span class="badge bg-danger">' + data + '</span>';
                    case 'Mantenimiento':
                        return '<span class="badge bg-warning">' + data + '</span>';
                    default:
                        return '<span class="text-muted">No especificado</span>';
                }
            }
        },
        // Columna de acciones simplificada
        {
            data: 'id_vehiculo',
            title: 'Acciones',
            orderable: false,
            searchable: false,
            width: '140px',
            render: function (data, type, row) {
                return `
                            <div class="btn-group btn-group-sm" role="group">
                                <button id="btnVer" class="btn btn-primary btn-ver" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button id="btnEditar" class="btn btn-info btn-editar" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Editar vehículo">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button id="btnEliminar" class="btn btn-danger btn-eliminar" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Eliminar vehículo">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
            }
        }
    ],
    initComplete: function (settings, json) {
        if (json && json.error) {
            console.error('Error: ', json.error);
            $('#tabla_referencias').DataTable().clear().draw();
        }

        // Inicializar tooltips
        $('[data-bs-toggle="tooltip"]').tooltip();

        // Asignar eventos a los botones de acción
        asignarEventosBotones();
    },
    drawCallback: function (settings) {
        // Re-inicializar tooltips después de cada dibujado
        $('[data-bs-toggle="tooltip"]').tooltip();

        // Re-asignar eventos a los botones después de cada recarga
        asignarEventosBotones();
    }
});

/**
 * Asigna eventos a los botones de acción de la tabla de vehículos
 * Usa delegación de eventos con scope al contenedor de la tabla
 */
function asignarEventosBotones() {
    const $tabla = $('#tabla_vehiculos');

    // Eliminar eventos anteriores para evitar duplicados
    $tabla.off('click', '.btn-ver');
    $tabla.off('click', '.btn-editar');
    $tabla.off('click', '.btn-eliminar');

    // Ver detalles del vehículo
    $tabla.on('click', '.btn-ver', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('vehiculos', 'ver', function () {
            verVehiculo(id);
        });
    });

    // Editar vehículo
    $tabla.on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('vehiculos', ['editar', 'validar_editar'], function () {
            editarVehiculo(id);
        });
    });

    // Eliminar vehículo
    $tabla.on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('vehiculos', 'eliminar', function () {
            eliminarVehiculo(id);
        });
    });
}