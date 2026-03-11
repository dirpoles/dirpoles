//Datatable de vehiculos
$('#tabla_repuestos').DataTable({
    ajax: {
        url: 'repuestos_data_json',
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
                        id: 'btnExcelRE'
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
                        id: 'btnPdfRE'
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
                    text: '<i class="fas fa-plus"></i> Crear Repuesto',
                    attr: {
                        id: 'btnCrearRE'
                    },
                    className: 'btn btn-info',
                    action: function () {
                        TransporteLoader.cargar('repuestos', 'crear', function () {
                            abrirModalCrearRepuesto();
                        });
                    }
                },
                {
                    text: '<i class="fas fa-plus"></i> Agregar Entrada',
                    attr: {
                        id: 'btnAgregarEntradaRE'
                    },
                    className: 'btn btn-success',
                    action: function () {
                        TransporteLoader.cargar('repuestos', 'agregar_entrada', function () {
                            abrirModalAgregarEntrada();
                        });
                    }
                },
                {
                    text: '<i class="fas fa-exchange-alt"></i> Movimientos del Inventario',
                    attr: {
                        id: 'btnMovimientosRE'
                    },
                    className: 'btn btn-warning',
                    action: function () {
                        TransporteLoader.cargar('repuestos', 'movimientos', function () {
                            abrirModalMovimientos();
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
            data: null,
            deferRender: true,
            render: function (data, type, row) {
                const cantidad = parseInt(row.cantidad) || 0;
                let statusBadge = '';

                if (cantidad === 0) {
                    statusBadge = '<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i> Agotado</span>';
                } else if (cantidad < 5) {
                    statusBadge = '<span class="badge bg-warning text-dark"><i class="fas fa-exclamation-triangle me-1"></i> Bajo stock</span>';
                } else {
                    statusBadge = '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i> Disponible</span>';
                }

                return `<div class="d-flex flex-column">
                            <div class="mt-1">${statusBadge}</div>
                        </div>`;
            }
        },
        {
            data: 'nombre',
            deferRender: true,
            render: function (data, type, row) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'descripcion',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'cantidad',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">0</span>';
            }
        },
        {
            data: 'nombre_proveedor',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'estatus',
            deferRender: true,
            render: function (data) {
                switch (data) {
                    case 'Nuevo':
                        return '<span class="badge bg-success">' + data + '</span>';
                    case 'Usado':
                        return '<span class="badge bg-warning">' + data + '</span>';
                    case 'Dañado':
                        return '<span class="badge bg-danger">' + data + '</span>';
                    default:
                        return '<span class="text-muted">No especificado</span>';
                }
            }
        },
        // Columna de acciones simplificada
        {
            data: 'id_repuesto',
            title: 'Acciones',
            orderable: false,
            searchable: false,
            width: '140px',
            render: function (data, type, row) {
                return `
                            <div class="btn-group btn-group-sm" role="group">
                                <button id="btnVerRE" class="btn btn-primary btn-ver" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button id="btnEditarRE" class="btn btn-info btn-editar" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Editar repuesto">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button id="btnEliminarRE" class="btn btn-danger btn-eliminar" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Eliminar repuesto">
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
 * Asigna eventos a los botones de acción de la tabla de repuestos
 * Usa delegación de eventos con scope al contenedor de la tabla
 */
function asignarEventosBotones() {
    const $tabla = $('#tabla_repuestos');

    // Eliminar eventos anteriores para evitar duplicados
    $tabla.off('click', '.btn-ver');
    $tabla.off('click', '.btn-editar');
    $tabla.off('click', '.btn-eliminar');

    // Ver detalles del repuesto
    $tabla.on('click', '.btn-ver', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('repuestos', 'ver', function () {
            verRepuesto(id);
        });
    });

    // Editar repuesto
    $tabla.on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('repuestos', ['editar', 'validar_editar'], function () {
            editarRepuesto(id);
        });
    });

    // Eliminar repuesto
    $tabla.on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('repuestos', 'eliminar', function () {
            eliminarRepuesto(id);
        });
    });
}