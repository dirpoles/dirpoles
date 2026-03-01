//Mostrar detalles de la ruta
$(document).on('click', '[data-target="#modalDetalleRuta"]', function() {
    const idRuta = $(this).data('id');
    
    $.ajax({
        url: 'index.php?action=obtener_detalles_ruta',
        type: 'POST',
        dataType: 'json',
        data: { id_ruta: idRuta },
        success: function(response) {
            if(response.success) {
                console.log("Datos recibidos:", response.data); // Agrega esto
                // Llenar el modal con los datos
                $('#detalle_nombre_ruta').text(response.data.nombre_ruta || 'N/A');
                $('[id="detalle_tipo_ruta"]').text(response.data.tipo_ruta || 'N/A');
                $('#detalle_punto_partida').text(response.data.punto_partida || 'N/A');
                $('#detalle_punto_destino').text(response.data.punto_destino || 'N/A');
                $('#detalle_horario_salida').text(response.data.horario_salida || 'N/A');
                $('#detalle_duracion').text(response.data.duracion_estimada || 'N/A');
                
                // Vehículos asignados
                let vehiculosHTML = '<ul>';
                
                if(response.data.vehiculos && response.data.vehiculos.length > 0) {
                    response.data.vehiculos.forEach(vehiculo => {
                        vehiculosHTML += `<li>${vehiculo.modelo || ''} (${vehiculo.placa || ''})</li>`;
                    });
                } else {
                    vehiculosHTML += '<li>No hay vehículos asignados</li>';
                }
                
                vehiculosHTML += '</ul>';
                $('#detalle_vehiculos').html(vehiculosHTML);

                $('#modalDetalleRuta').modal('show');
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function() {
            Swal.fire('Error', 'Error al cargar los detalles', 'error');
        }
    });
});

//Datatable de proveedores
$(function() {
    var table = $('#tabla_proveedores').DataTable({
        "responsive": true,
        "autoWidth": false,
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<i class="far fa-file-excel"></i> Exportar a Excel',
                title: 'Proveedores',
                filename: 'Reporte_Proveedores',
                className: 'btn btn-success'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
                title: 'Reporte General de Proveedores',
                filename: 'Reporte_Proveedores',
                className: 'btn btn-danger'
            },
            {
                text: '<i class="fas fa-plus"></i> Agregar Proveedor',
                className: 'btn btn-primary',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalCrearProveedor').modal('show');
                }
            }
        ],
        "dom": 'Bfrtip',
        "language": {
            "sEmptyTable": "No hay registros de proveedores disponibles",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ proveedores",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 vehiculos",
            "sInfoFiltered": "(filtrado de _MAX_ proveedores totales)",
            "sLengthMenu": "Mostrar _MENU_ proveedores",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
});

//Datatable de vehiculos
$(function() {
    var table = $('#tabla_vehiculos').DataTable({
        "responsive": true,
        "autoWidth": false,
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<i class="far fa-file-excel"></i> Exportar a Excel',
                title: 'Vehiculos',
                filename: 'Reporte_Vehiculos',
                className: 'btn btn-success'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
                title: 'Reporte General de vehiculos',
                filename: 'Reporte_Vehiculos',
                className: 'btn btn-danger'
            },
            {
                text: '<i class="fas fa-plus"></i> Registrar Vehiculo',
                className: 'btn btn-primary',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalCrearVehiculo').modal('show');
                }
            },
            {
                text: '<i class="fas fa-wrench"></i> Asignar Mantenimiento',
                className: 'btn btn-warning',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalCrearMantenimiento').modal('show');
                }
            },
            {
                text: '<i class="fas fa-list"></i> Ver Historial de Mantenimientos',
                className: 'btn btn-info',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalVerMantenimientos').modal('show');
                }
            }
        ],
        "dom": 'Bfrtip',
        "language": {
            "sEmptyTable": "No hay registros de vehiculos disponibles",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ vehiculos",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 vehiculos",
            "sInfoFiltered": "(filtrado de _MAX_ vehiculos totales)",
            "sLengthMenu": "Mostrar _MENU_ vehiculos",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
});

//Datatable de Rutas
$(function() {
    var table = $('#tabla_rutas').DataTable({
        "responsive": true,
        "autoWidth": false,
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<i class="far fa-file-excel"></i> Exportar a Excel',
                title: 'Proveedores',
                filename: 'Reporte_Proveedores',
                className: 'btn btn-success'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
                title: 'Reporte General de Rutas',
                filename: 'Reporte_Rutas',
                className: 'btn btn-danger',
                orientation: 'landscape',
                pageSize: 'A1'
            },
            {
                text: '<i class="fas fa-route"></i> Registrar Ruta',
                className: 'btn btn-primary',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalCrearRuta').modal('show');
                }
            },
            {
                text: '<i class="fas fa-user-tie"></i> Asignar Ruta',
                className: 'btn btn-success',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalAsignarRecursos').modal('show');
                }
            }
        ],
        "dom": 'Bfrtip',
        "language": {
            "sEmptyTable": "No hay registros disponibles",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ de registros",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 vehiculos",
            "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
});

//Datatable de asignaciones
$(function() {
    var table = $('#tabla_asignaciones').DataTable({
        "responsive": true,
        "autoWidth": false,
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<i class="far fa-file-excel"></i> Exportar a Excel',
                title: 'Proveedores',
                filename: 'Reporte_Proveedores',
                className: 'btn btn-success'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
                title: 'Reporte General de Rutas',
                filename: 'Reporte_Rutas',
                className: 'btn btn-danger'
            }
        ],
        "dom": 'Bfrtip',
        "language": {
            "sEmptyTable": "No hay registros disponibles",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ de registros",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 vehiculos",
            "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
});

//Datatable de repuestos
$(function() {
    var table = $('#tabla_repuestos').DataTable({
        "responsive": true,
        "autoWidth": false,
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<i class="far fa-file-excel"></i> Exportar a Excel',
                title: 'Proveedores',
                filename: 'Reporte_Proveedores',
                className: 'btn btn-success'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
                title: 'Reporte General de Rutas',
                filename: 'Reporte_Rutas',
                className: 'btn btn-danger'
            },
            {
                text: '<i class="fas fa-tools"></i> Registrar Repuesto',
                className: 'btn btn-primary',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalCrearRepuesto').modal('show');
                }
            },
            {
                text: '<i class="fas fa-plus"></i> Registrar Entrada',
                className: 'btn btn-success',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalEntradaRepuesto').modal('show');
                }
            },
            {
                text: '<i class="fas fa-box"></i> Movimientos del Inventario',
                className: 'btn btn-info',
                action: function () {
                    // Abre el modal usando jQuery y Bootstrap
                    $('#modalInventarioRepuestos').modal('show');
                }
            }
        ],
        "dom": 'Bfrtip',
        "language": {
            "sEmptyTable": "No hay registros disponibles",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ de registros",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 vehiculos",
            "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
});

//Datatable de historial de mantenimientos
$(function() {
    var table = $('#tabla_historial_mantenimientos').DataTable({
        "responsive": true,
        "autoWidth": false,
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<i class="far fa-file-excel"></i> Exportar a Excel',
                title: 'Proveedores',
                filename: 'Reporte_Proveedores',
                className: 'btn btn-success'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
                title: 'Reporte General de Rutas',
                filename: 'Reporte_Rutas',
                className: 'btn btn-danger'
            }
        ],
        "dom": 'Bfrtip',
        "language": {
            "sEmptyTable": "No hay registros disponibles",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ de registros",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 vehiculos",
            "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
});

$(function() {
    var table = $('#tabla_inventario_repuestos').DataTable({
        "responsive": true,
        "autoWidth": false,
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<i class="far fa-file-excel"></i> Exportar a Excel',
                title: 'Proveedores',
                filename: 'Reporte_Proveedores',
                className: 'btn btn-success'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
                title: 'Reporte General de Rutas',
                filename: 'Reporte_Rutas',
                className: 'btn btn-danger'
            }
        ],
        "dom": 'Bfrtip',
        "language": {
            "sEmptyTable": "No hay registros disponibles",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ de registros",
            "sInfoEmpty": "Mostrando 0 a 0 de 0 vehiculos",
            "sInfoFiltered": "(filtrado de _MAX_ registros totales)",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
});


