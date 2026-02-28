$(function () {
    function inicializarDataTable() {
        window.dataTableInstance = $('#tabla_bitacora').DataTable({
            ajax: {
                url: 'bitacora_data_json',
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
                            customize: PDFCustomizer.forBitacora()
                        }
                    ]
                },
            },
            ordering: true,
            order: [[4, 'desc']],
            responsive: true,
            pageLength: 20,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            language: {
                url: 'plugins/DataTables/js/languaje.json'
            },
            columns: [
                {
                    data: 'modulo',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Módulo no asignado';
                    }
                },
                {
                    data: 'empleado',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin nombre';
                    }
                },
                {
                    data: 'accion',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin acción';
                    }
                },
                {
                    data: 'descripcion',
                    deferRender: true,
                    render: function (data) {
                        return data || 'No especificado';
                    }
                },
                {
                    data: 'fecha',
                    deferRender: true,
                    render: function (data, type, row) {
                        if (!data) return 'Sin fecha';

                        // Para ordenación y búsqueda, usar el valor crudo (timestamp)
                        if (type === 'sort' || type === 'type' || type === 'filter') {
                            return data;
                        }

                        // Para exportación, también el valor crudo
                        if (type === 'export') {
                            return data;
                        }

                        // Para visualización en la tabla
                        return moment(data).format("DD/MM/YYYY HH:mm A");
                    }
                },
            ],
            initComplete: function (settings, json) {
                if (json && json.error) {
                    console.error('Error: ', json.error);
                    $('#tabla_bitacora').DataTable().clear().draw();
                }

                console.log('DataTable de bitácora inicializada correctamente');
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
        inicializarDataTable();
    } catch (error) {
        manejarErrorInicializacion(error);
    }
});