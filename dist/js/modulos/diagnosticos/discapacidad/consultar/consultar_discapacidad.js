$(function () {
    function inicializarDataTableGeneral() {
        $('#tabla_discapacidad').DataTable({
            ajax: {
                url: 'diagnostico_discapacidad_json',
                dataSrc: 'data'
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
                            customize: PDFCustomizer.forDiagnosticos()
                        },
                        {
                            text: '<i class="fas fa-plus"></i> Crear Diagnostico',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'diagnostico_discapacidad';
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
                    data: 'beneficiario',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin beneficiario';
                    }
                },
                {
                    data: 'empleado',
                    deferRender: true,
                    visible: window.esAdmin || false,
                    render: function (data, type, row) {
                        return data || 'Sin empleado';
                    }
                },
                {
                    data: 'tipo_discapacidad',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || row.cedula || 'Sin tipo de consulta';
                    }
                },
                {
                    data: 'grado',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'diagnostico',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'medicamentos',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'observaciones',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                // Columna de acciones simplificada
                {
                    data: 'id_discapacidad',
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
                                        title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-eliminar" 
                                        data-id="${data}"
                                        data-id-solicitud="${row.id_solicitud_serv}"
                                        data-id-beneficiario="${row.id_beneficiario}"
                                        data-bs-toggle="tooltip"
                                        title="Eliminar">
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
                    $('#tabla_diagnostico_general').DataTable().clear().draw();
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
    }

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
            if (typeof verDiagnostico !== 'undefined') {
                verDiagnostico(id);
            } else {
                console.error('Función verDiagnostico no está definida');
                alert('Función de visualización no disponible');
            }
        });

        $(document).on('click', '.btn-editar', function () {
            const id = $(this).data('id');
            if (typeof editarDiagnostico !== 'undefined') {
                editarDiagnostico(id);
            } else {
                console.error('Función editarDiagnostico no está definida');
                alert('Función de edición no disponible');
            }
        });

        $(document).on('click', '.btn-eliminar', function () {
            const id = $(this).data('id');
            const idSolicitud = $(this).data('id-solicitud');
            const id_beneficiario = $(this).data('id-beneficiario');
            if (typeof eliminarDiagnostico !== 'undefined') {
                eliminarDiagnostico(id, idSolicitud, id_beneficiario);
            } else {
                console.error('Función eliminarDiagnostico no está definida');
                alert('Función de eliminación no disponible');
            }
        });
    }

    function manejarErrorInicializacion(error) {
        console.error('Error inicializando DataTable:', error);
        $('#tabla_beneficiarios').html(
            '<div class="alert alert-danger">' +
            'Error al cargar la tabla de beneficiarios. ' +
            '<button class="btn btn-sm btn-warning" onclick="location.reload()">Reintentar</button>' +
            '</div>'
        );
    }

    try {
        inicializarDataTableGeneral();
    } catch (error) {
        manejarErrorInicializacion(error);
    }
});