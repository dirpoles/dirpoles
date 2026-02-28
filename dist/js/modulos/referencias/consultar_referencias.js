$(function () {
    function inicializarDataTableReferencias() {
        $('#tabla_referencias').DataTable({
            ajax: {
                url: 'referencias_data_json',
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
                            customize: PDFCustomizer.forReferencias()
                        },
                        {
                            text: '<i class="fas fa-plus"></i> Crear Referencia',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_referencias';
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
                    data: 'fecha_referencia',
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
                    data: 'beneficiario',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'empleado_origen',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'empleado_destino',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'servicio_destino',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'estado',
                    deferRender: true,
                    render: function (data) {
                        switch (data) {
                            case 'Pendiente':
                                return '<span class="badge bg-warning">' + data + '</span>';
                            case 'Aceptada':
                                return '<span class="badge bg-success">' + data + '</span>';
                            case 'Rechazada':
                                return '<span class="badge bg-danger">' + data + '</span>';
                            default:
                                return '<span class="text-muted">No especificado</span>';
                        }
                    }
                },
                // Columna de acciones simplificada
                {
                    data: 'id_referencia',
                    title: 'Acciones',
                    orderable: false,
                    searchable: false,
                    width: '140px',
                    render: function (data, type, row) {
                        return `
                            <div class="btn-group btn-group-sm" role="group">
                                <button class="btn btn-primary btn-ver" 
                                        data-id="${data}"
                                        data-estado="${row.estado}"
                                        data-bs-toggle="tooltip"
                                        title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-info btn-aceptar" 
                                        data-id="${data}"
                                        data-estado="${row.estado}"
                                        data-id-empleado="${row.id_empleado_origen}"
                                        data-bs-toggle="tooltip"
                                        title="Aceptar Referencia">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-danger btn-rechazar" 
                                        data-id="${data}"
                                        data-estado="${row.estado}"
                                        data-id-empleado="${row.id_empleado_origen}"
                                        data-bs-toggle="tooltip"
                                        title="Rechazar Referencia">
                                    <i class="fas fa-times"></i>
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
    }

    /**
     * Asigna eventos a los botones de acción de la tabla
     * Usa delegación de eventos para manejar elementos dinámicos
     */
    function asignarEventosBotones() {
        // Eliminar eventos anteriores para evitar duplicados
        $(document).off('click', '.btn-ver');
        $(document).off('click', '.btn-aceptar');
        $(document).off('click', '.btn-rechazar');

        // Asignar nuevos eventos con delegación
        $(document).on('click', '.btn-ver', function () {
            const id = $(this).data('id');
            if (typeof verReferencia !== 'undefined') {
                verReferencia(id);
            } else {
                console.error('Función verReferencia no está definida');
                AlertManager.error('Función de visualización no disponible');
            }
        });

        $(document).on('click', '.btn-aceptar', function () {
            const id = $(this).data('id');
            const estado = $(this).data('estado');
            const id_empleado_origen = $(this).data('id-empleado');

            // 1. Validar que no sea el mismo empleado que la creó (salvo Admin)
            if (id_empleado_origen === USER_SESSION.id_empleado && !USER_SESSION.es_admin) {
                AlertManager.error('No puedes aceptar una referencia que tú mismo has generado.');
                return;
            }

            if (estado === 'Rechazada') {
                AlertManager.error('Esta referencia ya ha sido rechazada y no puede ser modificada.');
                return;
            }
            if (estado === 'Aceptada') {
                AlertManager.error('Esta referencia ya ha sido aceptada.');
                return;
            }

            if (typeof aceptarReferencia !== 'undefined') {
                aceptarReferencia(id, id_empleado_origen);
            } else {
                console.error('Función aceptarReferencia no está definida');
                AlertManager.error('Función de edición no disponible');
            }
        });

        $(document).on('click', '.btn-rechazar', function () {
            const id = $(this).data('id');
            const estado = $(this).data('estado');
            const id_empleado_origen = $(this).data('id-empleado');

            // 1. Validar que no sea el mismo empleado que la creó (salvo Admin)
            if (id_empleado_origen === USER_SESSION.id_empleado && !USER_SESSION.es_admin) {
                AlertManager.error('No puedes rechazar una referencia que tú mismo has generado.');
                return;
            }

            if (estado === 'Aceptada') {
                AlertManager.error('Esta referencia ya ha sido aceptada y no puede ser rechazada.');
                return;
            }
            if (estado === 'Rechazada') {
                AlertManager.error('Esta referencia ya ha sido rechazada.');
                return;
            }

            if (typeof rechazarReferencia !== 'undefined') {
                rechazarReferencia(id, id_empleado_origen);
            } else {
                console.error('Función rechazarReferencia no está definida');
                AlertManager.error('Función de eliminación no disponible');
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
        inicializarDataTableReferencias();
    } catch (error) {
        manejarErrorInicializacion(error);
    }
});