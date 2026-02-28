$(function () {
    function inicializarDataTableJornadas() {
        $('#tabla_jornadas').DataTable({
            ajax: {
                url: 'jornadas_data_json',
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
                            customize: PDFCustomizer.forJornadas()
                        },
                        {
                            text: '<i class="fas fa-plus"></i> Crear Jornada',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_jornadas';
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
                    data: 'nombre_jornada',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'tipo_jornada',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'fecha_inicio',
                    deferRender: true,
                    render: function (data, type, row) {
                        // 1. Si no hay datos, mostrar mensaje
                        if (!data) return '<span class="text-muted">No especificado</span>';

                        // 2. Si DataTables pide el valor para "display" (mostrar en pantalla)
                        if (type === 'display') {
                            // Formato: DD/MM/YYYY hh:mm A (Ej: 15/11/2023 03:30 PM)
                            return moment(data).format('DD/MM/YYYY hh:mm A');
                        }

                        return data;
                    }
                },
                {
                    data: 'ubicacion',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'aforo_maximo',
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
                            case 'Cancelada':
                                return '<span class="badge bg-danger">' + data + '</span>';
                            case 'Finalizada':
                                return '<span class="badge bg-warning">' + data + '</span>';
                            default:
                                return '<span class="text-muted">No especificado</span>';
                        }
                    }
                },
                // Columna de acciones simplificada
                {
                    data: 'id_jornada',
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
                                        title="Editar Jornada">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <a href="detallar_jornada?id_jornada=${data}" class="btn btn-danger btn-detallar-jornada" 
                                        data-bs-toggle="tooltip"
                                        title="Detallar Jornada">
                                    <i class="fas fa-info-circle"></i>
                                </a>
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
    }

    /**
     * Asigna eventos a los botones de acción de la tabla
     * Usa delegación de eventos para manejar elementos dinámicos
     */
    function asignarEventosBotones() {
        // Eliminar eventos anteriores para evitar duplicados
        $(document).off('click', '.btn-ver');
        $(document).off('click', '.btn-editar');

        // Asignar nuevos eventos con delegación
        $(document).on('click', '.btn-ver', function () {
            const id = $(this).data('id');
            if (typeof verJornada !== 'undefined') {
                verJornada(id);
            } else {
                console.error('Función verJornada no está definida');
                alert('Función de visualización no disponible');
            }
        });

        $(document).on('click', '.btn-editar', function () {
            const id = $(this).data('id');
            if (typeof editarJornada !== 'undefined') {
                editarJornada(id);
            } else {
                console.error('Función editarJornada no está definida');
                alert('Función de edición no disponible');
            }
        });
    }

    function manejarErrorInicializacion(error) {
        console.error('Error inicializando DataTable:', error);
    }

    try {
        inicializarDataTableJornadas();
    } catch (error) {
        manejarErrorInicializacion(error);
    }
});