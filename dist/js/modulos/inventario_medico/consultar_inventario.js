$(function () {
    function inicializarDataTableGeneral() {
        $('#tabla_insumos').DataTable({
            ajax: {
                url: 'inventario_data_json',
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
                            customize: PDFCustomizer.forInventarioMedico()
                        },
                        {
                            text: '<i class="fas fa-plus"></i> Crear Insumo',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_insumos';
                            }
                        },
                        {
                            text: '<i class="fas fa-table"></i> Consultar Movimientos',
                            className: 'btn btn-secondary',
                            action: function () {
                                mostrarMovimientos();
                            }
                        },
                        {
                            text: '<i class="fa-solid fa-cart-flatbed"></i> Registrar Entrada',
                            className: 'btn btn-primary',
                            action: function () {
                                mostrarEntrada();
                            },
                            init: function (api, node, config) {
                                $(node).removeClass('btn-secondary');
                            }
                        },
                        {
                            text: '<i class="fas fa-minus"></i> Registrar Salida',
                            className: 'btn btn-danger',
                            action: function () {
                                mostrarSalida();
                            },
                            init: function (api, node, config) {
                                $(node).removeClass('btn-secondary');
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
                    data: 'nombre_insumo',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 'Sin beneficiario';
                    }
                },
                {
                    data: 'tipo_insumo',
                    deferRender: true,
                    visible: window.esAdmin || false,
                    render: function (data, type, row) {
                        return data || 'Sin empleado';
                    }
                },
                {
                    data: 'presentacion',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || row.cedula || 'Sin tipo de consulta';
                    }
                },
                {
                    data: 'cantidad',
                    deferRender: true,
                    render: function (data, type, row) {
                        return data || 0;
                    }
                },
                {
                    data: 'fecha_vencimiento',
                    deferRender: true,
                    render: function (data) {
                        if (!data) {
                            return '<span class="text-muted">No especificado</span>';
                        }
                        return moment(data).format('DD/MM/YYYY');
                    }
                },
                {
                    data: 'estatus',
                    deferRender: true,
                    render: function (data) {
                        let badgeClass = 'bg-secondary';
                        switch (data) {
                            case 'Disponible':
                                badgeClass = 'badge bg-success';
                                break;
                            case 'Agotado':
                                badgeClass = 'badge bg-warning';
                                break;
                            case 'Vencido':
                                badgeClass = 'badge bg-danger';
                                break;
                        }
                        return `<span class="badge ${badgeClass}">${data || 'No especificado'}</span>`;
                    }
                },
                // Columna de acciones simplificada
                {
                    data: 'id_insumo',
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

                console.log('DataTable de insumos inicializado correctamente');
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
            if (typeof verInsumo !== 'undefined') {
                verInsumo(id);
            } else {
                console.error('Función verInsumo no está definida');
                alert('Función de visualización no disponible');
            }
        });

        $(document).on('click', '.btn-editar', function () {
            const id = $(this).data('id');
            if (typeof editarInsumo !== 'undefined') {
                editarInsumo(id);
            } else {
                console.error('Función editarInsumo no está definida');
                alert('Función de edición no disponible');
            }
        });

        $(document).on('click', '.btn-eliminar', function () {
            const id = $(this).data('id');
            if (typeof eliminarInsumo !== 'undefined') {
                eliminarInsumo(id);
            } else {
                console.error('Función eliminarInsumo no está definida');
                alert('Función de eliminación no disponible');
            }
        });
    }

    function abrirModal(titulo, contenidoHTML, footerHTML = null) {
        $('#modalLabel').text(titulo);
        $('#modalContenido').html(contenidoHTML);

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
                url: 'movimientos_data_json',
                dataSrc: 'data'
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
                        if (data === 'Entrada') badge = 'bg-success';
                        else if (data === 'Salida') badge = 'bg-danger';
                        else if (data === 'Registro') badge = 'bg-primary';
                        return `<span class="badge ${badge}">${data}</span>`;
                    }
                },
                { data: 'cantidad' },
                { data: 'descripcion' }
            ],
            order: [[2, 'desc']] // Fecha descendente
        });
    };

    window.mostrarEntrada = function () {
        const html = `
            <form id="formRegistrarEntrada">
                <div class="mb-3">
                    <label for="id_insumo_entrada" class="form-label">Seleccionar Insumo <span class="text-danger">*</span></label>
                    <select class="form-select" id="id_insumo_entrada" name="id_insumo">
                        <option value="">Buscar insumo...</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="cantidad_entrada" class="form-label">Cantidad a Ingresar <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="cantidad_entrada" name="cantidad" min="1" >
                </div>
                <div class="mb-3">
                    <label for="descripcion_entrada" class="form-label">Motivo / Descripción <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="descripcion_entrada" name="descripcion" rows="3" ></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" form="formRegistrarEntrada" class="btn btn-primary"><i class="fas fa-save"></i> Registrar Entrada</button>
        `;

        abrirModal("Registrar Entrada de Insumo", html, footer);

        // Inicializar Select2
        $('#id_insumo_entrada').select2({
            dropdownParent: $('#modalGenerico'),
            theme: 'bootstrap-5',
            ajax: {
                url: 'insumos_validos_json',
                dataType: 'json',
                delay: 250,
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            return {
                                id: item.id_insumo,
                                text: `${item.nombre_insumo} (Actual: ${item.cantidad}) - Vence: ${item.fecha_vencimiento}`
                            };
                        })
                    };
                },
                cache: true
            }
        });

        // Inicializar validación externa
        if (typeof inicializarValidacionEntrada === 'function') {
            inicializarValidacionEntrada();
        } else {
            console.error("La función inicializarValidacionEntrada no está definida en validar_entrada.js");
        }
    };

    window.mostrarSalida = function () {
        const html = `
            <form id="formRegistrarSalida">
                <div class="mb-3">
                    <label for="id_insumo_salida" class="form-label">Seleccionar Insumo <span class="text-danger">*</span></label>
                    <select class="form-select" id="id_insumo_salida" name="id_insumo" style="width: 100%;">
                        <option value="">Buscar insumo...</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="motivo_salida" class="form-label">Motivo de Salida <span class="text-danger">*</span></label>
                    <select class="form-select" id="motivo_salida" name="motivo">
                        <option value="" selected disabled>Seleccione...</option>
                        <option value="Vencimiento">Vencimiento</option>
                        <option value="Daño">Daño / Avería</option>
                        <option value="Pérdida">Pérdida / Ajuste</option>
                        <option value="Donación">Donación</option>
                        <option value="Uso Interno">Uso Interno</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="cantidad_salida" class="form-label">Cantidad a Retirar <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="cantidad_salida" name="cantidad" min="1">
                </div>
                <div class="mb-3">
                    <label for="descripcion_salida" class="form-label">Detalles Adicionales <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="descripcion_salida" name="descripcion" rows="2"></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" form="formRegistrarSalida" class="btn btn-danger"><i class="fas fa-minus-circle"></i> Registrar Salida</button>
        `;

        abrirModal("Registrar Salida de Insumo", html, footer);

        // Inicializar Select2
        $('#id_insumo_salida').select2({
            dropdownParent: $('#modalGenerico'),
            theme: 'bootstrap-5',
            ajax: {
                url: 'insumos_para_salida_json',
                dataType: 'json',
                delay: 250,
                processResults: function (data) {
                    return {
                        results: data.map(function (item) {
                            let textoExtra = item.estatus === 'Vencido' ? ' (VENCIDO)' : '';
                            return {
                                id: item.id_insumo,
                                text: `${item.nombre_insumo} (Disponible: ${item.cantidad})${textoExtra}`
                            };
                        })
                    };
                },
                cache: true
            }
        });

        // Inicializar validación externa
        if (typeof inicializarValidacionSalida === 'function') {
            inicializarValidacionSalida();
        } else {
            console.error("La función inicializarValidacionSalida no está definida en validar_salida.js");
        }
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
        inicializarDataTableGeneral();
    } catch (error) {
        manejarErrorInicializacion(error);
    }
});