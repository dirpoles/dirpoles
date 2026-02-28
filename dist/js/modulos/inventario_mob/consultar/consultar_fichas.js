$(function () {
    function inicializarDataTableFichas() {
        $('#tabla_fichas').DataTable({
            ajax: {
                url: 'fichas_tecnicas_json',
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
                            customize: PDFCustomizer.forInventarioMob()
                        },
                        {
                            text: '<i class="fas fa-plus"></i> Crear Ficha Técnica',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_ficha_tecnica';
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
                    data: 'nombre_ficha',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin tipo de mobiliario';
                    }
                },
                {
                    data: 'servicio',
                    deferRender: true,
                    visible: window.esAdmin || false,
                    render: function (data, type, row) {
                        return data || 'Sin marca';
                    }
                },
                {
                    data: 'responsable',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin modelo';
                    }
                },
                {
                    data: 'fecha_creacion',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 0;
                    }
                },
                {
                    data: 'estatus',
                    deferRender: true,
                    render: function (data) {
                        const esActivo = (data == '1');
                        const badgeClass = esActivo ? 'bg-success' : 'bg-danger';
                        const texto = esActivo ? 'Activo' : 'Inactivo';

                        return `<span class="badge ${badgeClass}">${texto}</span>`;
                    }
                },
                {
                    data: 'id_ficha',
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
                    $('#tabla_fichas').DataTable().clear().draw();
                }

                // Inicializar tooltips
                $('[data-bs-toggle="tooltip"]').tooltip();

                // Asignar eventos a los botones de acción
                asignarEventosBotones();

                console.log('DataTable de ficha tecnica inicializado correctamente');
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
            if (typeof verFichaTecnica !== 'undefined') {
                verFichaTecnica(id);
            } else {
                console.error('Función verFichaTecnica no está definida');
                alert('Función de visualización no disponible');
            }
        });

        $(document).on('click', '.btn-editar', function () {
            const id = $(this).data('id');
            if (typeof editarFichaTecnica !== 'undefined') {
                editarFichaTecnica(id);
            } else {
                console.error('Función editarFichaTecnica no está definida');
                alert('Función de edición no disponible');
            }
        });

        $(document).on('click', '.btn-eliminar', function () {
            const id = $(this).data('id');
            if (typeof eliminarFichaTecnica !== 'undefined') {
                eliminarFichaTecnica(id);
            } else {
                console.error('Función eliminarFichaTecnica no está definida');
                alert('Función de eliminación no disponible');
            }
        });
    }

    function abrirModal(titulo, contenidoHTML, footerHTML = null) {
        $('#modalLabel').text(titulo);
        $('#modalContenido').html(contenidoHTML);
        $('#modalGenericoTitle').text(titulo);

        const footer = $('#modalFooter');
        if (footerHTML) {
            footer.html(footerHTML);
            footer.show();
        } else {
            footer.html('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>');
            footer.show();
        }

        const modal = new bootstrap.Modal(document.getElementById('modalGenerico'));
        modal.show();
    }

    function manejarErrorInicializacion(error) {
        console.error('Error inicializando DataTable:', error);
        $('#tabla_fichas').html(
            '<div class="alert alert-danger">' +
            'Error al cargar la tabla de fichas técnicas. ' +
            '<button class="btn btn-sm btn-warning" onclick="location.reload()">Reintentar</button>' +
            '</div>'
        );
    }

    try {
        inicializarDataTableFichas();
    } catch (error) {
        manejarErrorInicializacion(error);
    }
});