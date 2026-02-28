$(function () {
    function inicializarDataTable() {
        $('#tabla_horarios').DataTable({
            ajax: {
                url: 'horarios_data_json',
                dataSrc: 'data',
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
                            customize: PDFCustomizer.forHorarios()
                        },
                        {
                            text: '<i class="fa-solid fa-clock"></i> Crear Horario',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_horario';
                            }
                        }
                    ]
                },
            },
            ordering: true,
            order: [[0, 'asc']], // Ordenar por empleado
            responsive: true,
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            language: {
                url: 'plugins/DataTables/js/languaje.json'
            },
            // CONFIGURACIÓN ROWGROUP
            rowGroup: {
                dataSrc: 'nombre_completo', // Agrupar por empleado
                startRender: function (rows, group) {
                    // Personalizar cómo se muestra el grupo
                    return $('<tr/>')
                        .append('<td colspan="5" class="group-header">' +
                            '<strong>' + group + '</strong>' +
                            '<span class="badge bg-primary ms-2">' +
                            rows.count() + ' horario(s)</span>' +
                            '</td>');
                },
                endRender: null
            },
            columns: [
                {
                    data: 'nombre_completo',
                    visible: false, // OCULTAR esta columna porque se muestra en el grupo
                    render: function (data, type, row) {
                        return data || 'Sin nombre';
                    }
                },
                {
                    data: 'dia_semana',
                    title: 'Día',
                    render: function (data, type, row) {
                        // Traducir días si es necesario
                        const dias = {
                            'Lunes': 'Lunes',
                            'Martes': 'Martes',
                            'Miercoles': 'Miércoles',
                            'Miercoles': 'Miércoles',
                            'Jueves': 'Jueves',
                            'Viernes': 'Viernes',
                            'Sabado': 'Sábado',
                            'Domingo': 'Domingo'
                        };
                        return dias[data] || data || 'Sin día';
                    }
                },
                {
                    data: 'hora_inicio',
                    title: 'Inicio',
                    render: function (data, type, row) {
                        if (!data) return 'Sin hora';
                        return moment(data, "HH:mm").format("hh:mm A");
                    }
                },
                {
                    data: 'hora_fin',
                    title: 'Fin',
                    render: function (data) {
                        if (!data) return 'Sin hora';
                        return moment(data, "HH:mm").format("hh:mm A");
                    }
                },
                {
                    data: 'id_horario',
                    title: 'Acciones',
                    orderable: false,
                    searchable: false,
                    width: '140px',
                    render: function (data, type, row) {
                        return `
                        <div class="btn-group btn-group-sm" role="group">
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
                    $('#tabla_horarios').DataTable().clear().draw();
                }

                $('[data-bs-toggle="tooltip"]').tooltip();
                asignarEventosBotones();

                // Agregar funcionalidad para expandir/colapsar grupos
                agregarToggleGrupos();

                console.log('DataTable de horarios con RowGroup inicializado');
            },
            drawCallback: function (settings) {
                $('[data-bs-toggle="tooltip"]').tooltip();
                asignarEventosBotones();
                agregarToggleGrupos();
            }
        });
    }

    // Función para agregar toggle a grupos
    function agregarToggleGrupos() {
        $('.group-header').off('click').on('click', function () {
            var tr = $(this).closest('tr');
            var dt = $('#tabla_horarios').DataTable();
            var row = dt.row(tr.next());

            while (row.length && !row.node().classList.contains('group-header')) {
                $(row.node()).toggleClass('d-none');
                row = dt.row(row.node().nextSibling);
            }
        });
    }
    /**
     * Asigna eventos a los botones de acción de la tabla
     * Usa delegación de eventos para manejar elementos dinámicos
     */
    function asignarEventosBotones() {
        // Eliminar eventos anteriores para evitar duplicados
        $(document).off('click', '.btn-editar');
        $(document).off('click', '.btn-eliminar');

        // Asignar nuevos eventos con delegación
        $(document).on('click', '.btn-editar', function () {
            const id = $(this).data('id');
            if (typeof editarHorario !== 'undefined') {
                editarHorario(id);
            } else {
                console.error('Función editarHorario no está definida');
                alert('Función de edición no disponible');
            }
        });

        $(document).on('click', '.btn-eliminar', function () {
            const id = $(this).data('id');
            if (typeof eliminarHorario !== 'undefined') {
                eliminarHorario(id);
            } else {
                console.error('Función eliminarHorario no está definida');
                alert('Función de eliminación no disponible');
            }
        });
    }

    function manejarErrorInicializacion(error) {
        console.error('Error inicializando DataTable:', error);
        $('#tabla_horarios').html(
            '<div class="alert alert-danger">' +
            'Error al cargar la tabla de horarios. ' +
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