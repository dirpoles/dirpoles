//Datatable de vehiculos
$('#tabla_historial_mantenimientos').DataTable({
    ajax: {
        url: 'mantenimientos_data_json',
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
                        id: 'btnExcelM'
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
                        id: 'btnPdfM'
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
                    text: '<i class="fas fa-plus"></i> Crear Mantenimiento',
                    className: 'btn btn-info',
                    attr: {
                        id: 'btnCrearM'
                    },
                    action: function () {
                        TransporteLoader.cargar('mantenimientos', 'crear', function () {
                            abrirModalCrearMantenimiento();
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
            data: 'tipo_mantenimiento',
            deferRender: true,
            render: function (data, type, row) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'nombre_vehiculo',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'placa_vehiculo',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'fecha',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'descripcion',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">No especificado</span>';
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
 * Asigna eventos a los botones de acción de la tabla de mantenimientos
 * Usa delegación de eventos con scope al contenedor de la tabla
 */
function asignarEventosBotones() {
    const $tabla = $('#tabla_historial_mantenimientos');

    // Eliminar eventos anteriores para evitar duplicados
    $tabla.off('click', '.btn-ver');
    $tabla.off('click', '.btn-editar');
    $tabla.off('click', '.btn-eliminar');

    // Ver detalles del mantenimiento
    $tabla.on('click', '.btn-ver', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('mantenimientos', 'ver', function () {
            verMantenimiento(id);
        });
    });

    // Editar mantenimiento
    $tabla.on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('mantenimientos', ['editar', 'validar_editar'], function () {
            editarMantenimiento(id);
        });
    });

    // Eliminar mantenimiento
    $tabla.on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        TransporteLoader.cargar('mantenimientos', 'eliminar', function () {
            eliminarMantenimiento(id);
        });
    });
}