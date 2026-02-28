$(function () {
    function inicializarDataTableEquipos() {
        $('#tabla_equipos').DataTable({
            ajax: {
                url: 'equipos_data_json',
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
                            text: '<i class="fas fa-plus"></i> Crear Equipo',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_inventario_mob';
                            }
                        },
                        {
                            text: '<i class="fas fa-table"></i> Consultar Movimientos',
                            className: 'btn btn-secondary',
                            action: function () {
                                mostrarMovimientos();
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
                    data: 'tipo_equipo',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin tipo de mobiliario';
                    }
                },
                {
                    data: 'marca',
                    deferRender: true,
                    visible: window.esAdmin || false,
                    render: function (data, type, row) {
                        return data || 'Sin marca';
                    }
                },
                {
                    data: 'modelo',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin modelo';
                    }
                },
                {
                    data: 'serial',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 0;
                    }
                },
                {
                    data: 'estado',
                    deferRender: true,
                    render: function (data) {
                        let badgeClass = 'bg-secondary';
                        switch (data) {
                            case 'Nuevo':
                                badgeClass = 'badge bg-success';
                                break;
                            case 'Bueno':
                                badgeClass = 'badge bg-info';
                                break;
                            case 'Regular':
                                badgeClass = 'badge bg-secondary';
                                break;
                            case 'Malo':
                                badgeClass = 'badge bg-danger';
                                break;
                            case 'En reparación':
                                badgeClass = 'badge bg-warning';
                                break;
                        }
                        return `<span class="badge ${badgeClass}">${data || 'No especificado'}</span>`;
                    }
                },
                {
                    data: 'servicio',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 0;
                    }
                },
                // Columna de acciones simplificada
                {
                    data: 'id_equipo',
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
                    $('#tabla_insumos').DataTable().clear().draw();
                }

                // Inicializar tooltips
                $('[data-bs-toggle="tooltip"]').tooltip();

                // Asignar eventos a los botones de acción
                asignarEventosBotones();

                console.log('DataTable de mobiliario inicializado correctamente');
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
            if (typeof verMobiliario !== 'undefined') {
                verMobiliario(id);
            } else {
                console.error('Función verMobiliario no está definida');
                alert('Función de visualización no disponible');
            }
        });

        $(document).on('click', '.btn-editar', function () {
            const id = $(this).data('id');
            if (typeof editarMobiliario !== 'undefined') {
                editarMobiliario(id);
            } else {
                console.error('Función editarMobiliario no está definida');
                alert('Función de edición no disponible');
            }
        });

        $(document).on('click', '.btn-eliminar', function () {
            const id = $(this).data('id');
            if (typeof eliminarMobiliario !== 'undefined') {
                eliminarMobiliario(id);
            } else {
                console.error('Función eliminarMobiliario no está definida');
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

    window.mostrarMovimientos = function () {
        const html = `
            <div class="table-responsive">
                <table id="tabla_movimientos" class="table table-striped table-bordered w-100">
                    <thead>
                        <tr>
                            <th>Insumo</th>
                            <th>Responsable</th>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
        abrirModal("Listado de Movimientos del Inventario", html);

        // Inicializar DataTable de Movimientos
        $('#tabla_movimientos').DataTable({
            ajax: {
                url: 'historial_inventario_json',
                dataSrc: ''
            },
            responsive: true,
            language: {
                url: 'plugins/DataTables/js/languaje.json'
            },
            columns: [
                { data: 'nombre_insumo' },
                { data: 'responsable' },
                { data: 'fecha_movimiento' },
                {
                    data: 'tipo_movimiento',
                    render: function (data) {
                        let badge = 'bg-secondary';
                        if (data === 'asignacion') badge = 'bg-success';
                        else if (data === 'reubicacion') badge = 'bg-info';
                        else if (data === 'baja') badge = 'bg-danger';
                        else if (data === 'modificacion') badge = 'bg-primary';
                        return `<span class="badge ${badge}">${data}</span>`;
                    }
                },
                { data: 'cantidad' },
                { data: 'descripcion' }
            ],
            order: [[2, 'desc']] // Fecha descendente
        });
    };

    function manejarErrorInicializacion(error) {
        console.error('Error inicializando DataTable:', error);
        $('#tabla_insumos').html(
            '<div class="alert alert-danger">' +
            'Error al cargar la tabla de insumos. ' +
            '<button class="btn btn-sm btn-warning" onclick="location.reload()">Reintentar</button>' +
            '</div>'
        );
    }

    try {
        inicializarDataTableEquipos();
    } catch (error) {
        manejarErrorInicializacion(error);
    }
});