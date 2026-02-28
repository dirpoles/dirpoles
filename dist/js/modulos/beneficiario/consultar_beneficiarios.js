$(function () {
    // Declarar la variable en el scope global del archivo
    window.dataTableInstance = null;
    window.inicializarDataTable = inicializarDataTable;
    window.recargarTablaBeneficiarios = recargarTablaBeneficiarios;

    function inicializarDataTable() {
        window.dataTableInstance = $('#tabla_beneficiarios').DataTable({
            ajax: {
                url: 'beneficiarios_data_json',
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
                            customize: PDFCustomizer.forBeneficiarios()
                        },
                        {
                            text: '<i class="fas fa-user-plus"></i> Crear Beneficiario',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_beneficiario';
                            }
                        },
                        {
                            text: '<i class="fas fa-sync-alt me-1"></i> Recargar',
                            className: 'btn btn-secondary btn-sm',
                            action: function () {
                                recargarTablaBeneficiarios();
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
                    data: 'seccion',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin sección';
                    }
                },
                {
                    data: 'nombre_completo',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin nombre';
                    }
                },
                {
                    data: 'cedula_completa',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || row.cedula || 'Sin cédula';
                    }
                },
                {
                    data: 'nombre_pnf',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'correo',
                    deferRender: true,
                    render: function (data) {
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'telefono',
                    deferRender: true,
                    render: function (data) {
                        return data || 'Sin teléfono';
                    }
                },
                {
                    data: 'genero',
                    deferRender: true,
                    render: function (data) {
                        // Formatear género para mostrar
                        switch (data) {
                            case 'M': return 'Masculino';
                            case 'F': return 'Femenino';
                            case 'O': return 'Otro';
                            default: return data || 'Sin género';
                        }
                    }
                },
                // Columna de estatus simplificada
                {
                    data: 'estatus',
                    title: 'Estado',
                    orderable: true,
                    searchable: true,
                    render: function (data, type, row) {
                        const estados = {
                            1: { nombre: 'Activo', clase: 'success', icono: 'fa-user-check' },
                            0: { nombre: 'Inactivo', clase: 'danger', icono: 'fa-user-slash' }
                        };

                        const estado = estados[data] || { nombre: 'Desconocido', clase: 'secondary', icono: 'fa-question' };

                        return `
                            <span class="badge bg-${estado.clase}" 
                                data-bs-toggle="tooltip" 
                                title="${estado.nombre}">
                                <i class="fas ${estado.icono} me-1"></i>
                                ${estado.nombre}
                            </span>
                        `;
                    }
                },

                // Columna de acciones simplificada
                {
                    data: 'id_beneficiario',
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
                    $('#tabla_beneficiarios').DataTable().clear().draw();
                }

                // Inicializar tooltips
                $('[data-bs-toggle="tooltip"]').tooltip();

                // Asignar eventos a los botones de acción
                asignarEventosBotones();

                console.log('DataTable de beneficiarios inicializado correctamente');
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
            if (typeof verBeneficiario !== 'undefined') {
                verBeneficiario(id);
            } else {
                console.error('Función verBeneficiario no está definida');
                alert('Función de visualización no disponible');
            }
        });

        $(document).on('click', '.btn-editar', function () {
            const id = $(this).data('id');
            if (typeof editarBeneficiario !== 'undefined') {
                editarBeneficiario(id);
            } else {
                console.error('Función editarBeneficiario no está definida');
                alert('Función de edición no disponible');
            }
        });

        $(document).on('click', '.btn-eliminar', function () {
            const id = $(this).data('id');
            if (typeof eliminarBeneficiario !== 'undefined') {
                eliminarBeneficiario(id);
            } else {
                console.error('Función eliminarBeneficiario no está definida');
                alert('Función de eliminación no disponible');
            }
        });
    }

    /**
     * Recarga la tabla de beneficiarios
     */
    function recargarTablaBeneficiarios() {
        if (window.dataTableInstance) {
            window.dataTableInstance.ajax.reload(null, false);
            console.log('Tabla de beneficiarios recargada');

            // Mostrar notificación de recarga
            if (typeof AlertManager !== 'undefined') {
                AlertManager.success('Recargado', 'Tabla actualizada correctamente');
            } else if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Recargado',
                    text: 'Tabla actualizada correctamente',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } else {
            console.error('No hay instancia de DataTable para recargar');
        }
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