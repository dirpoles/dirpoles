//Datatable de vehiculos
$('#tabla_asignar_recursos').DataTable({
    ajax: {
        url: 'asignaciones_rutas_data_json',
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
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: ':visible',
                        stripHtml: true
                    },
                    customize: PDFCustomizer.forTransporte()
                },
                {
                    text: '<i class="fas fa-plus"></i> Crear Asignación',
                    className: 'btn btn-info',
                    action: function () {
                        AlertManager.info("Modal que se abre para crear asignaciones");
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
            data: 'nombre_ruta',
            deferRender: true,
            render: function (data, type, row) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'fecha_asignacion',
            deferRender: true,
            render: function (data, type, row) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'modelo_vehiculo',
            deferRender: true,
            render: function (data) {
                return data || '<span class="text-muted">No especificado</span>';
            }
        },
        {
            data: 'nombre_empleado',
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
                    case 'Activa':
                        return '<span class="badge bg-success">' + data + '</span>';
                    case 'Inactiva':
                        return '<span class="badge bg-danger">' + data + '</span>';
                    default:
                        return '<span class="text-muted">No especificado</span>';
                }
            }
        },
        // Columna de acciones simplificada
        {
            data: 'id_asignacion',
            title: 'Acciones',
            orderable: false,
            searchable: false,
            width: '140px',
            render: function (data, type, row) {
                return `
                            <div class="btn-group btn-group-sm" role="group">
                                <button class="btn btn-primary btn-ver" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-info btn-editar" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Editar asignación">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-eliminar" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Eliminar asignación">
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
     * Asigna eventos a los botones de acción de la tabla
     * Usa delegación de eventos para manejar elementos dinámicos
     */
function asignarEventosBotones() {
    // Eliminar eventos anteriores para evitar duplicados
    $(document).off('click', '.btn-ver');
    $(document).off('click', '.btn-editar');
    $(document).off('click', '.btn-eliminar');

    // Asignar nuevos eventos con delegación
    $(document).on('click', '.btn-ver', function () {
        const id = $(this).data('id');
        if (typeof verAsignacion !== 'undefined') {
            verAsignacion(id);
        } else {
            console.error('Función verAsignacion no está definida');
            alert('Función de visualización no disponible');
        }
    });

    $(document).on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        if (typeof editarAsignacion !== 'undefined') {
            editarAsignacion(id);
        } else {
            console.error('Función editarAsignacion no está definida');
            alert('Función de edición no disponible');
        }
    });

    $(document).on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        if (typeof eliminarAsignacion !== 'undefined') {
            eliminarAsignacion(id);
        } else {
            console.error('Función eliminarAsignacion no está definida');
            alert('Función de eliminación no disponible');
        }
    });
}