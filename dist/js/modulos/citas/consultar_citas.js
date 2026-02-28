$(function () {
    // ============================================
    // VARIABLES GLOBALES Y CONFIGURACIÓN
    // ============================================
    window.dataTableInstance = null;
    window.inicializarDataTable = inicializarDataTable;

    // Configuración de estados (global para reutilizar)
    const estadosCita = {
        1: { nombre: 'Pendiente', clase: 'warning', icono: 'fas fa-clock' },
        2: { nombre: 'Confirmada', clase: 'info', icono: 'fas fa-check-circle' },
        3: { nombre: 'Atendida', clase: 'success', icono: 'fas fa-user-check' },
        4: { nombre: 'Cancelada', clase: 'danger', icono: 'fas fa-times-circle' },
        5: { nombre: 'No asistió', clase: 'secondary', icono: 'fas fa-user-slash' }
    };

    // ============================================
    // FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
    // ============================================
    function inicializarDataTable() {
        if ($.fn.DataTable.isDataTable('#tabla_citas')) {
            window.dataTableInstance.destroy();
        }

        window.dataTableInstance = $('#tabla_citas').DataTable({
            ajax: {
                url: 'citas_data_json',
                dataSrc: function (json) {
                    // Validar respuesta DIRPOLES 4
                    if (!json.exito) {
                        console.error('Error del servidor:', json.mensaje);
                        AlertManager.error('Error', json.mensaje || 'Error al cargar citas');
                        return [];
                    }
                    return json.data || [];
                },
                error: function (xhr, error, thrown) {
                    console.error('Error AJAX:', error, thrown);
                    AlertManager.error('Error', 'No se pudieron cargar las citas. Intente nuevamente.');
                }
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
                            customize: PDFCustomizer.forCitas()
                        },
                        {
                            text: '<i class="fas fa-calendar-plus me-1"></i> Crear Cita',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_cita';
                            }
                        }
                    ]
                },
                topEnd: {
                    search: {
                        placeholder: 'Buscar cita...'
                    }
                }
            },
            ordering: true,
            order: [[0, 'desc']], // Ordenar por fecha descendente por defecto
            responsive: true,
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            language: {
                url: 'plugins/DataTables/js/languaje.json'
            },
            columns: [
                {
                    data: 'beneficiario',
                    title: 'Beneficiario',
                    render: function (data, type, row) {
                        return data || '<span class="text-muted">No asignado</span>';
                    }
                },
                {
                    data: 'cedula_beneficiario',
                    title: 'Cedula del beneficiario',
                    render: function (data, type, row) {
                        return data || '<span class="text-muted">No asignado</span>';
                    }
                },
                {
                    data: 'empleado',
                    title: 'Psicólogo',
                    render: function (data) {
                        return data || '<span class="text-muted">No asignado</span>';
                    }
                },
                {
                    data: 'fecha',
                    title: 'Fecha',
                    render: function (data, type, row) {
                        if (!data) return '<span class="text-muted">Sin fecha</span>';

                        if (type === 'sort' || type === 'type') {
                            return data;
                        }
                        try {
                            const fecha = new Date(data + 'T00:00:00');
                            return fecha.toLocaleDateString('es-ES', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            });
                        } catch (e) {
                            return data;
                        }
                    }
                },
                {
                    data: 'hora_formateada',
                    title: 'Hora',
                    render: function (data, type, row) {
                        if (!data) return '<span class="text-muted">--:--</span>';

                        if (type === 'sort' || type === 'type') {
                            return row.hora;
                        }

                        return data;
                    }
                },
                {
                    data: 'estatus',
                    title: 'Estado',
                    orderable: true,
                    searchable: true,
                    render: function (data, type, row) {
                        // Para ordenamiento y búsqueda, usar el nombre
                        if (type === 'sort' || type === 'type') {
                            return estadosCita[data]?.nombre || 'Desconocido';
                        }

                        const estado = estadosCita[data] || {
                            nombre: 'Desconocido',
                            clase: 'secondary',
                            icono: 'fas fa-question'
                        };

                        return `
                            <span class="badge bg-${estado.clase} px-2 py-1" 
                                  style="font-size: 0.8rem; cursor: default;"
                                  data-bs-toggle="tooltip" 
                                  data-bs-placement="top" 
                                  title="${estado.nombre}">
                                <i class="${estado.icono} me-1"></i>
                                ${estado.nombre}
                            </span>
                        `;
                    }
                },
                {
                    data: 'id_cita',
                    title: 'Acciones',
                    orderable: false,
                    searchable: false,
                    width: '150px',
                    className: 'text-center',
                    render: function (data, type, row) {
                        return `
                            <div class="btn-group btn-group-sm" role="group">
                                <button class="btn btn-success btn-estado-cita" 
                                        data-id="${data}"
                                        data-id-beneficiario="${row.id_beneficiario}"
                                        data-bs-toggle="tooltip"
                                        title="Cambiar estado">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-primary btn-ver-cita" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-info btn-editar-cita" 
                                        data-id="${data}"
                                        data-bs-toggle="tooltip"
                                        title="Editar cita">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-eliminar-cita" 
                                        data-id="${data}"
                                        data-id-beneficiario="${row.id_beneficiario}"
                                        data-bs-toggle="tooltip"
                                        title="Eliminar cita">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            initComplete: function (settings, json) {
                // Inicializar tooltips
                initTooltips();

                // Asignar eventos a botones
                asignarEventosBotones();
            },
            drawCallback: function (settings) {
                // Re-inicializar tooltips después de cada redibujado
                initTooltips();

                // Re-asignar eventos (importante para paginación)
                asignarEventosBotones();
            }
        });
    }

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================

    function initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    function asignarEventosBotones() {
        // Botón de actualizar estado
        $(document).off('click', '.btn-estado-cita').on('click', '.btn-estado-cita', function (e) {
            e.preventDefault();
            const id = $(this).data('id');
            const id_beneficiario = $(this).data('id-beneficiario');
            actualizarEstadoCita(id, id_beneficiario);
        });

        // Botón VER
        $(document).off('click', '.btn-ver-cita').on('click', '.btn-ver-cita', function (e) {
            e.preventDefault();
            const id = $(this).data('id');
            verCita(id);
        });

        // Botón EDITAR
        $(document).off('click', '.btn-editar-cita').on('click', '.btn-editar-cita', function (e) {
            e.preventDefault();
            const id = $(this).data('id');
            editarCita(id);
        });

        // Botón ELIMINAR
        $(document).off('click', '.btn-eliminar-cita').on('click', '.btn-eliminar-cita', function (e) {
            e.preventDefault();
            const id = $(this).data('id');
            const id_beneficiario = $(this).data('id-beneficiario');
            eliminarCita(id, id_beneficiario);
        });
    }

    function eliminarCita(id, id_beneficiario) {
        Swal.fire({
            title: '¿Está seguro?',
            text: '¿Está seguro de eliminar esta Cita? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            reverseButtons: true,
            showCloseButton: false,
            focusCancel: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                await ejecutarEliminacion(id, id_beneficiario);
            }
        }).catch((error) => {
            console.error('Error en el modal de confirmación:', error);
        });
    }

    async function ejecutarEliminacion(id, id_beneficiario) {
        try {
            // Enviar solicitud de eliminación
            const response = await fetch('eliminar_cita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: new URLSearchParams({
                    id_cita: id,
                    id_beneficiario: id_beneficiario
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            Swal.close();

            if (data.exito) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: data.mensaje,
                    timer: 1500,
                    showConfirmButton: false,
                    timerProgressBar: true
                });

                $('#modalCita').modal('hide');
                // Recargar DataTable con Ajax
                if (window.dataTableInstance) {
                    window.dataTableInstance.ajax.reload(null, false);
                } else if ($.fn.DataTable.isDataTable('#tabla_citas')) {
                    $('#tabla_citas').DataTable().ajax.reload(null, false);
                }

            } else {
                // Mostrar mensaje de error
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || data.mensaje || 'Error al eliminar la cita',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6'
                });
            }

        } catch (error) {
            console.error('Error al eliminar cita:', error);
            Swal.close();
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error inesperado al eliminar la cita',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
        }
    }

    // ============================================
    // INICIALIZACIÓN AL CARGAR LA PÁGINA
    // ============================================

    // Inicializar DataTable cuando el DOM esté listo
    inicializarDataTable();

    // También recargar al cambiar el foco a la ventana (para notificaciones)
    $(window).on('focus', function () {
        if (window.dataTableInstance) {
            window.dataTableInstance.ajax.reload(null, false);
        }
    });
});