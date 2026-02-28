$(function () {
    let dataTableInstance = null;
    function inicializarDataTable() {
        dataTableInstance = $('#miTabla').DataTable({
            ajax: {
                url: 'data_empleados_json',
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
                                stripHtml: true // Remover HTML
                            },
                            customize: function (doc) {
                                // ✅ CONFIGURACIÓN AVANZADA DEL PDF
                                var now = new Date();
                                var fecha = now.toLocaleDateString('es-ES');
                                var hora = now.toLocaleTimeString('es-ES');

                                // Margenes (izquierda, arriba, derecha, abajo)
                                doc.pageMargins = [40, 60, 40, 60];

                                // Fecha y hora de generación
                                doc.content.splice(1, 0, {
                                    text: 'Generado: ' + fecha + ' - ' + hora,
                                    alignment: 'right',
                                    margin: [0, 0, 0, 10],
                                    fontSize: 8,
                                    color: '#666666'
                                });

                                // Encabezado
                                doc['header'] = function (currentPage, pageCount, pageSize) {
                                    return {
                                        columns: [
                                            {
                                                text: 'SISTEMA DIRPOLES 4',
                                                alignment: 'left',
                                                fontSize: 10,
                                                bold: true,
                                                color: '#2E4053',
                                                margin: [40, 30]
                                            },
                                            {
                                                text: 'Página ' + currentPage + ' de ' + pageCount,
                                                alignment: 'right',
                                                fontSize: 10,
                                                margin: [0, 30, 40, 0]
                                            }
                                        ]
                                    };
                                };

                                // Pie de página
                                doc['footer'] = function (currentPage, pageCount, pageSize) {
                                    return {
                                        columns: [
                                            {
                                                text: '© ' + new Date().getFullYear() + ' - Universidad Politécnica Territorial "Andrés Eloy Blanco"',
                                                alignment: 'left',
                                                fontSize: 8,
                                                color: '#666666',
                                                margin: [40, 10]
                                            },
                                            {
                                                text: 'Confidencial - Uso Interno',
                                                alignment: 'right',
                                                fontSize: 8,
                                                italic: true,
                                                color: '#666666',
                                                margin: [0, 10, 40, 0]
                                            }
                                        ]
                                    };
                                };

                                // Título principal
                                doc.content[0].text = 'LISTADO DE EMPLEADOS REGISTRADOS';
                                doc.content[0].alignment = 'center';
                                doc.content[0].fontSize = 16;
                                doc.content[0].bold = true;
                                doc.content[0].margin = [0, 0, 0, 15];

                                // Estilo de la tabla
                                if (doc.content[2].table) {
                                    // Encabezado de tabla
                                    doc.content[2].table.headerRows = 1;
                                    doc.content[2].table.widths = Array(doc.content[2].table.body[0].length).fill('auto');

                                    // Estilo celdas encabezado
                                    doc.content[2].table.body[0].forEach(function (cell) {
                                        cell.fillColor = '#2E4053'; // Color fondo
                                        cell.color = '#FFFFFF'; // Color texto
                                        cell.bold = true;
                                        cell.alignment = 'center';
                                    });

                                    // Filas alternas
                                    for (var i = 1; i < doc.content[2].table.body.length; i++) {
                                        if (i % 2 === 0) {
                                            doc.content[2].table.body[i].forEach(function (cell) {
                                                cell.fillColor = '#F8F9F9';
                                            });
                                        }
                                    }
                                }

                                // Información adicional
                                doc.content.push({
                                    text: '\n\nTotal de empleados: ' + (doc.content[2].table.body.length - 1),
                                    alignment: 'right',
                                    fontSize: 10,
                                    bold: true,
                                    margin: [0, 20, 0, 0]
                                });
                            }
                        },
                        {
                            text: '<i class="fas fa-user-plus"></i> Crear Empleado',
                            className: 'btn btn-info',
                            action: function () {
                                window.location.href = 'crear_empleado';
                            }
                        }
                    ]
                },
                topEnd: {
                    search: {
                        placeholder: 'Realiza una búsqueda'
                    }
                },
                bottomEnd: {
                    paging: true
                }
            },
            ordering: true,
            responsive: true,
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
            language: {
                url: 'plugins/DataTables/js/languaje.json'
            },
            columns: [
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
                        return data || '<span class="text-muted">No especificado</span>';
                    }
                },
                {
                    data: 'cargo',
                    deferRender: true,
                    render: function (data) {
                        return data || 'Sin cargo';
                    }
                },
                {
                    data: 'estatus',
                    deferRender: true,
                    render: function (data) {
                        return data == 1
                            ? '<span class="badge bg-success">Activo</span>'
                            : '<span class="badge bg-danger">Inactivo</span>';
                    }
                },
                {
                    data: 'id_empleado',
                    orderable: false,
                    searchable: false,
                    deferRender: true,
                    render: function (data, type, row) {
                        return `
                            <div class="btn-group" role="group">
                                <button class="btn btn-sm btn-primary btn-ver" data-id="${data}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-info btn-editar" data-id="${data}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${data}">
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
                    $('#miTabla').DataTable().clear().draw();
                }

                // Event listeners para botones de acción
                $(document).on('click', '.btn-ver', function () {
                    var id = $(this).data('id');
                    verEmpleado(id);
                });

                $(document).on('click', '.btn-editar', function () {
                    var id = $(this).data('id');
                    editarEmpleado(id);
                });

                $(document).on('click', '.btn-eliminar', function () {
                    var id = $(this).data('id');
                    eliminarEmpleado(id);
                });
            }
        });
    }

    function manejarErrorInicializacion(error) {
        console.error('Error inicializando DataTable:', error);
        $('#miTabla').html(
            '<div class="alert alert-danger">' +
            'Error al cargar la tabla de empleados. ' +
            '<button class="btn btn-sm btn-warning" onclick="location.reload()">Reintentar</button>' +
            '</div>'
        );
    }

    try {
        inicializarDataTable();
    } catch (error) {
        manejarErrorInicializacion(error);
    }

    // Funciones para acciones (puedes implementarlas después)
    function verEmpleado(id) {
        // ✅ 1. Mostrar modal INMEDIATAMENTE con spinner
        const modalElement = document.getElementById('modalEmpleado');
        const modal = new bootstrap.Modal(modalElement);

        // Limpiar modal antes de abrir
        $('#modalEmpleado .modal-body').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando información del empleado...</p>
        </div>
    `);

        // Mostrar modal
        modal.show();

        // ✅ 2. Hacer AJAX
        $.ajax({
            url: 'empleado_detalle',
            method: 'GET',
            data: { id_empleado: id },
            dataType: 'json',
            success: function (data) {
                console.log('Datos recibidos:', data);

                // Verificar si hay datos
                if (!data || !data.data) {
                    $('#modalEmpleado .modal-body').html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este empleado.
                    </div>
                `);
                    return;
                }

                const emp = data.data;

                // ✅ 3. REEMPLAZAR TODO EL CONTENIDO DEL MODAL
                const modalContent = `
                    <!-- Tarjeta de Información Principal -->
                    <div class="card border-0 rounded-0 bg-light">
                        <div class="card-body p-4">
                            <div class="row">
                                <!-- Columna Izquierda - Datos Personales -->
                                <div class="col-md-6 border-end">
                                    <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-user-circle me-2"></i> Información Personal
                                    </h6>
                                    
                                    <!-- Nombre Completo -->
                                    <div class="info-item mb-3">
                                        <div class="d-flex align-items-start">
                                            <div class="info-icon text-primary me-2 mt-1">
                                                <i class="fas fa-user"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <label class="form-label text-muted small mb-1">Nombre Completo</label>
                                                <div class="form-control-plaintext bg-white rounded p-2">
                                                    ${emp.nombre_completo || 'No especificado'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Cédula -->
                                    <div class="info-item mb-3">
                                        <div class="d-flex align-items-start">
                                            <div class="info-icon text-primary me-2 mt-1">
                                                <i class="fas fa-id-card"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <label class="form-label text-muted small mb-1">Cédula de Identidad</label>
                                                <div class="form-control-plaintext bg-white rounded p-2">
                                                    ${emp.cedula_completa || emp.cedula || 'No especificado'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Correo -->
                                    <div class="info-item mb-3">
                                        <div class="d-flex align-items-start">
                                            <div class="info-icon text-primary me-2 mt-1">
                                                <i class="fas fa-envelope"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <label class="form-label text-muted small mb-1">Correo Electrónico</label>
                                                <div class="form-control-plaintext bg-white rounded p-2">
                                                    ${emp.correo || 'No especificado'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Teléfono -->
                                    <div class="info-item mb-3">
                                        <div class="d-flex align-items-start">
                                            <div class="info-icon text-primary me-2 mt-1">
                                                <i class="fas fa-phone"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <label class="form-label text-muted small mb-1">Teléfono</label>
                                                <div class="form-control-plaintext bg-white rounded p-2">
                                                    ${emp.telefono || 'No especificado'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Columna Derecha - Datos Laborales -->
                                <div class="col-md-6">
                                    <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                        <i class="fas fa-briefcase me-2"></i> Información Laboral
                                    </h6>

                                    <!-- Cargo -->
                                    <div class="info-item mb-3">
                                        <div class="d-flex align-items-start">
                                            <div class="info-icon text-primary me-2 mt-1">
                                                <i class="fas fa-user-tag"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <label class="form-label text-muted small mb-1">Cargo</label>
                                                <div class="form-control-plaintext bg-white rounded p-2">
                                                    ${emp.cargo || 'No especificado'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Estatus -->
                                    <div class="info-item mb-3">
                                        <div class="d-flex align-items-start">
                                            <div class="info-icon text-primary me-2 mt-1">
                                                <i class="fas fa-chart-line"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <label class="form-label text-muted small mb-1">Estado del Empleado</label>
                                                <div class="mt-1">
                                                    ${emp.estatus == 1
                        ? `<div class="d-inline-flex align-items-center bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                                                            <i class="fas fa-circle me-2" style="font-size: 0.6rem; color: white"></i>
                                                            <span class="fw-semibold" style="color: white">Activo</span>
                                                        </div>`
                        : `<div class="d-inline-flex align-items-center bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1">
                                                            <i class="fas fa-circle me-2" style="font-size: 0.6rem; color: white"></i>
                                                            <span class="fw-semibold" style="color: white">Inactivo</span>
                                                        </div>`
                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Fecha de Registro -->
                                    ${emp.fecha_registro ? `
                                    <div class="info-item mb-3">
                                        <div class="d-flex align-items-start">
                                            <div class="info-icon text-primary me-2 mt-1">
                                                <i class="fas fa-calendar-alt"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <label class="form-label text-muted small mb-1">Fecha de Registro</label>
                                                <div class="form-control-plaintext bg-white rounded p-2">
                                                    ${emp.fecha_registro}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ` : ''}

                                    <!-- Dirección -->
                                    <div class="info-item mb-3">
                                        <div class="d-flex align-items-start">
                                            <div class="info-icon text-primary me-2 mt-1">
                                                <i class="fas fa-map-marker-alt"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <label class="form-label text-muted small mb-1">Dirección</label>
                                                <div class="form-control-plaintext bg-white rounded p-2">
                                                    ${emp.direccion || 'No especificado'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-light py-3">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i> Cerrar
                        </button>
                    </div>
                `;

                // ✅ 4. Insertar el nuevo contenido
                $('#modalEmpleado .modal-body').html(modalContent);

            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud:', error);

                // ✅ 5. Mostrar error en el modal
                $('#modalEmpleado .modal-body').html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del empleado. Código de error: ${xhr.status}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="verEmpleado(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
            }
        });
    }

    function editarEmpleado(id) {
        const modalElement = document.getElementById('modalEmpleado');
        const modal = new bootstrap.Modal(modalElement);
        const modalBody = $('#modalEmpleado .modal-body');

        // Cambiar título del modal
        $('#modalEmpleado .modal-title').html('<i class="fas fa-edit me-2"></i>Editar Empleado');

        // Mostrar spinner
        modalBody.html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">Cargando información del empleado...</p>
            </div>
        `);

        // Mostrar modal
        modal.show();

        // AJAX para obtener datos del empleado
        $.ajax({
            url: 'empleado_detalle_editar',
            method: 'GET',
            data: { id_empleado: id },
            dataType: 'json',
            success: function (data) {
                console.log('Datos recibidos:', data);

                // Verificar si hay datos
                if (!data || !data.data) {
                    modalBody.html(`
                    <div class="alert alert-warning m-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No se encontraron datos para este empleado.
                    </div>
                `);
                    return;
                }

                const emp = data.data;
                const tipos = data.tipos_empleado || [];

                // Dividir teléfono
                let telefonoPrefijo = '';
                let telefonoNumero = '';

                if (emp.telefono && emp.telefono.length === 11) {
                    telefonoPrefijo = emp.telefono.substring(0, 4);
                    telefonoNumero = emp.telefono.substring(4, 11);
                }

                // Generar opciones del select para tipos de empleado
                let opcionesTipo = '<option value="">Seleccione un tipo</option>';
                tipos.forEach(tipo => {
                    const selected = (tipo.id_tipo_emp == emp.id_tipo_empleado) ? 'selected' : '';
                    opcionesTipo += `<option value="${tipo.id_tipo_emp}" ${selected}>${tipo.tipo}</option>`;
                });

                // Modal Content - FORMULARIO DE EDICIÓN
                const modalContent = `
                    <form id="formEditarEmpleado" data-id="${emp.id_empleado}">
                        <!-- Tarjeta de Información Principal -->
                        <div class="card border-0 rounded-0 bg-light">
                            <div class="card-body p-4">
                                <div class="row">
                                    <!-- Columna Izquierda - Datos Personales -->
                                    <div class="col-md-6 border-end">
                                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                            <i class="fas fa-user-circle me-2"></i> Información Personal
                                        </h6>
                                        
                                        <!-- Nombre -->
                                        <div class="mb-3">
                                            <label for="editar_nombre" class="form-label text-muted small mb-1">
                                                <i class="fas fa-user text-primary me-1"></i> Nombre
                                            </label>
                                            <input type="text" 
                                                class="form-control form-control-sm" 
                                                id="editar_nombre" 
                                                name="nombre"
                                                value="${emp.nombre || ''}">
                                            <div id="editar_nombreError" class="form-text text-danger"></div>
                                        </div>
                                        
                                        <!-- Apellido -->
                                        <div class="mb-3">
                                            <label for="editar_apellido" class="form-label text-muted small mb-1">
                                                <i class="fas fa-user text-primary me-1"></i> Apellido
                                            </label>
                                            <input type="text" 
                                                class="form-control form-control-sm" 
                                                id="editar_apellido" 
                                                name="apellido"
                                                value="${emp.apellido || ''}">
                                            <div id="editar_apellidoError" class="form-text text-danger"></div>
                                        </div>
                                        
                                        <!-- Cédula (con tipo de cédula) -->
                                        <div class="mb-3">
                                            <label class="form-label text-muted small mb-1">
                                                <i class="fas fa-id-card text-primary me-1"></i> Cédula de Identidad
                                            </label>
                                            <div class="row g-2">
                                                <div class="col-4">
                                                    <select class="form-select form-select-sm" 
                                                            id="editar_tipo_cedula" 
                                                            name="tipo_cedula">
                                                        <option value="V" ${(emp.tipo_cedula || '') === 'V' ? 'selected' : ''}>V</option>
                                                        <option value="E" ${(emp.tipo_cedula || '') === 'E' ? 'selected' : ''}>E</option>
                                                    </select>
                                                    <div id="editar_tipo_cedulaError" class="form-text text-danger"></div>
                                                </div>
                                                <div class="col-8">
                                                    <input type="text" 
                                                        class="form-control form-control-sm" 
                                                        id="editar_cedula" 
                                                        name="cedula"
                                                        value="${emp.cedula || ''}">
                                                    <div id="editar_cedulaError" class="form-text text-danger"></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Correo -->
                                        <div class="mb-3">
                                            <label for="editar_correo" class="form-label text-muted small mb-1">
                                                <i class="fas fa-envelope text-primary me-1"></i> Correo Electrónico
                                            </label>
                                            <input type="email" 
                                                class="form-control form-control-sm" 
                                                id="editar_correo" 
                                                name="correo"
                                                value="${emp.correo || ''}">
                                            <div id="editar_correoError" class="form-text text-danger"></div>
                                        </div>
                                        
                                        <!-- Teléfono CON PREFIJO + NÚMERO -->
                                        <div class="mb-3">
                                            <label class="form-label text-muted small mb-1">
                                                <i class="fas fa-phone text-primary me-1"></i> Teléfono
                                            </label>
                                            <div class="input-group input-group-sm">
                                                <select name="editar_telefono_prefijo" 
                                                        id="editar_telefono_prefijo" 
                                                        class="form-select w-auto" 
                                                        style="max-width: 100px;">
                                                    <option value="" ${!telefonoPrefijo ? 'selected' : ''} disabled>Prefijo</option>
                                                    <option value="0416" ${telefonoPrefijo === '0416' ? 'selected' : ''}>0416</option>
                                                    <option value="0426" ${telefonoPrefijo === '0426' ? 'selected' : ''}>0426</option>
                                                    <option value="0414" ${telefonoPrefijo === '0414' ? 'selected' : ''}>0414</option>
                                                    <option value="0424" ${telefonoPrefijo === '0424' ? 'selected' : ''}>0424</option>
                                                    <option value="0412" ${telefonoPrefijo === '0412' ? 'selected' : ''}>0412</option>
                                                    <option value="0422" ${telefonoPrefijo === '0422' ? 'selected' : ''}>0422</option>
                                                </select>
                                                <input type="text" 
                                                    name="editar_telefono_numero" 
                                                    id="editar_telefono_numero" 
                                                    class="form-control" 
                                                    placeholder="Número" 
                                                    maxlength="7"
                                                    value="${telefonoNumero || ''}">
                                            </div>
                                            <div id="editar_telefono_numeroError" class="form-text text-danger"></div>
                                            <div id="editar_telefonoError" class="form-text text-danger"></div>
                                        </div>
                                    </div>
                                    
                                    <!-- Columna Derecha - Datos Laborales -->
                                    <div class="col-md-6">
                                        <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                                            <i class="fas fa-briefcase me-2"></i> Información Laboral
                                        </h6>
                                        
                                        <!-- Tipo de Empleado (Select2) -->
                                        <div class="mb-3">
                                            <label for="editar_id_tipo_empleado" class="form-label text-muted small mb-1">
                                                <i class="fas fa-user-tag text-primary me-1"></i> Tipo de Empleado
                                            </label>
                                            <select class="form-select form-select-sm" 
                                                    id="editar_id_tipo_empleado" 
                                                    name="id_tipo_empleado">
                                                ${opcionesTipo}
                                            </select>
                                            <div id="editar_id_tipo_empleadoError" class="form-text text-danger"></div>
                                        </div>
                                        
                                        <!-- Fecha de Nacimiento -->
                                        <div class="mb-3">
                                            <label for="editar_fecha_nacimiento" class="form-label text-muted small mb-1">
                                                <i class="fas fa-calendar-alt text-primary me-1"></i> Fecha de Nacimiento
                                            </label>
                                            <input type="date" 
                                                class="form-control form-control-sm" 
                                                id="editar_fecha_nacimiento" 
                                                name="fecha_nacimiento"
                                                value="${emp.fecha_nacimiento || ''}">
                                            <div id="editar_fecha_nacimientoError" class="form-text text-danger"></div>
                                        </div>
                                        
                                        <!-- Dirección -->
                                        <div class="mb-3">
                                            <label for="editar_direccion" class="form-label text-muted small mb-1">
                                                <i class="fas fa-map-marker-alt text-primary me-1"></i> Dirección
                                            </label>
                                            <textarea class="form-control form-control-sm" 
                                                    id="editar_direccion" 
                                                    name="direccion"
                                                    rows="2">${emp.direccion || ''}</textarea>
                                            <div id="editar_direccionError" class="form-text text-danger"></div>
                                        </div>
                                        
                                        <!-- Estatus -->
                                        <div class="mb-3">
                                            <label for="editar_estatus" class="form-label text-muted small mb-1">
                                                <i class="fas fa-chart-line text-primary me-1"></i> Estado del Empleado
                                            </label>
                                            <select class="form-select form-select-sm" 
                                                    id="editar_estatus" 
                                                    name="estatus">
                                                <option value="1" ${emp.estatus == 1 ? 'selected' : ''}>Activo</option>
                                                <option value="0" ${emp.estatus == 0 ? 'selected' : ''}>Inactivo</option>
                                            </select>
                                            <div id="editar_estatusError" class="form-text text-danger"></div>
                                        </div>
                                        
                                        <!-- Campo oculto para ID -->
                                        <input type="hidden" name="id_empleado" value="${emp.id_empleado}">
                                        <input type="hidden" id="editar_telefono_completo" name="telefono" value="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Footer del Modal -->
                        <div class="modal-footer border-top-0 bg-light py-3">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times me-1"></i> Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary" id="btnGuardarCambios">
                                <i class="fas fa-save me-1"></i> Guardar Cambios
                            </button>
                        </div>
                    </form>
                `;

                // Insertar el nuevo contenido
                modalBody.html(modalContent);

                // Inicializar Select2 para el tipo de empleado
                $('#editar_id_tipo_empleado').select2({
                    theme: 'bootstrap-5',
                    dropdownParent: $('#modalEmpleado'),
                    placeholder: 'Seleccione un cargo',
                    width: '100%'
                });

                // Inicializar validaciones
                inicializarValidacionesEdicion(emp.id_empleado);

            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud:', error);

                // Mostrar error en el modal
                modalBody.html(`
                <div class="alert alert-danger m-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="alert-heading">Error al cargar los datos</h5>
                            <p class="mb-0">No se pudo obtener la información del empleado. Código de error: ${xhr.status}</p>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button class="btn btn-outline-danger" onclick="editarEmpleado(${id})">
                            <i class="fas fa-redo me-1"></i> Reintentar
                        </button>
                    </div>
                </div>
            `);
            }
        });
    }

    // FUNCIÓN ELIMINAR EMPLEADO
    function eliminarEmpleado(id) {
        Swal.fire({
            title: '¿Está seguro?',
            text: "Esta acción eliminará el empleado del sistema",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: 'eliminar_empleado',
                    method: 'POST',
                    data: { id_empleado: id },
                    dataType: 'json',
                    success: function (response) {
                        if (response.exito) {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Eliminado!',
                                text: response.mensaje || 'Empleado eliminado correctamente.',
                                timer: 2000,
                                showConfirmButton: false
                            });

                            // Recargar DataTable
                            if (dataTableInstance) {
                                dataTableInstance.ajax.reload(null, false);
                            }
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: response.mensaje || 'No se pudo eliminar el empleado.'
                            });
                        }
                    },
                    error: function (xhr) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de conexión',
                            text: 'No se pudo conectar con el servidor.'
                        });
                    }
                });
            }
        });
    }

    function inicializarValidacionesEdicion(idEmpleado) {
        const form = document.getElementById('formEditarEmpleado');
        if (!form) return;

        const elements = {
            tipo_cedula: document.getElementById('editar_tipo_cedula'),
            cedula: document.getElementById('editar_cedula'),
            nombre: document.getElementById('editar_nombre'),
            apellido: document.getElementById('editar_apellido'),
            correo: document.getElementById('editar_correo'),
            telefono_prefijo: document.getElementById('editar_telefono_prefijo'),
            telefono_numero: document.getElementById('editar_telefono_numero'),
            telefono_completo: document.getElementById('editar_telefono_completo'),
            id_tipo_empleado: document.getElementById('editar_id_tipo_empleado'),
            fecha_nacimiento: document.getElementById('editar_fecha_nacimiento'),
            estatus: document.getElementById('editar_estatus'),
            direccion: document.getElementById('editar_direccion')
        };

        const showError = (field, msg) => {
            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) errorElement.textContent = msg;

            field.classList.add("is-invalid");
            field.classList.remove("is-valid");

            // Si es Select2, aplicar al contenedor visible
            if ($(field).hasClass('select2')) {
                $(field).next('.select2-container').find('.select2-selection')
                    .addClass('is-invalid')
                    .removeClass('is-valid');
            }
        };

        const clearError = (field) => {
            const errorElement = document.getElementById(`${field.id}Error`);
            if (errorElement) errorElement.textContent = "";

            field.classList.remove("is-invalid");
            field.classList.add("is-valid");

            // Si es Select2, aplicar al contenedor visible
            if ($(field).hasClass('select2')) {
                $(field).next('.select2-container').find('.select2-selection')
                    .removeClass('is-invalid')
                    .addClass('is-valid');
            }
        };

        // ========== FUNCIONES DE VALIDACIÓN ==========

        async function validarCedula() {
            const cedula = elements.cedula.value.trim();
            const tipoCedula = elements.tipo_cedula.value.trim();

            // Limpiar caracteres no numéricos
            elements.cedula.value = cedula.replace(/[^0-9]/g, '');

            if (cedula === "") {
                showError(elements.cedula, "La cédula es obligatoria");
                return false;
            }

            if (tipoCedula === "") {
                showError(elements.tipo_cedula, "El tipo de cédula es obligatorio");
                return false;
            }

            if (cedula.length < 6 || cedula.length > 8) {
                showError(elements.cedula, "La cédula debe tener entre 6 y 8 dígitos");
                return false;
            }

            // En edición, solo validar si la cédula cambió (si no es readonly)
            if (!elements.cedula.readOnly) {
                try {
                    const response = await fetch('validar_cedula', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: new URLSearchParams({
                            cedula: cedula,
                            tipo_cedula: tipoCedula,
                            id_empleado: idEmpleado
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Error en la petición: ' + response.status);
                    }

                    const data = await response.json();

                    if (data.existe) {
                        showError(elements.cedula, "La cédula ya está registrada en el sistema");
                        return false;
                    }
                } catch (error) {
                    console.error('Error validando cédula:', error);
                    showError(elements.cedula, "Error al validar cédula");
                    return false;
                }
            }

            clearError(elements.cedula);
            clearError(elements.tipo_cedula);
            return true;
        }

        function validarNombre() {
            const nombre = elements.nombre.value.trim();
            const regex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]{2,50}$/;

            if (nombre === "") {
                showError(elements.nombre, "El nombre es obligatorio");
                return false;
            }

            if (!regex.test(nombre)) {
                showError(elements.nombre, "El nombre solo debe contener letras y espacios, máximo 50 caracteres");
                return false;
            }

            // Prevención XSS
            elements.nombre.value = nombre.replace(/<[^>]*>?/gm, "");

            clearError(elements.nombre);
            return true;
        }

        function validarApellido() {
            const apellido = elements.apellido.value.trim();
            const regex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]{2,50}$/;

            if (apellido === "") {
                showError(elements.apellido, "El apellido es obligatorio");
                return false;
            }

            if (!regex.test(apellido)) {
                showError(elements.apellido, "El apellido solo debe contener letras y espacios, máximo 50 caracteres");
                return false;
            }

            // Prevención XSS
            elements.apellido.value = apellido.replace(/<[^>]*>?/gm, "");

            clearError(elements.apellido);
            return true;
        }

        async function validarCorreo() {
            const correo = elements.correo.value.trim();
            const correoRegex = /^[a-zA-Z0-9._%+-]+@(hotmail|yahoo|gmail|outlook|uptaeb)\.(com|es|net|org|edu|ve)$/i;

            if (correo === "") {
                showError(elements.correo, "El correo es obligatorio");
                return false;
            }

            if (!correoRegex.test(correo)) {
                showError(elements.correo, "Formato de correo electrónico inválido");
                return false;
            }

            try {
                const response = await fetch('validar_correo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: new URLSearchParams({
                        correo: correo,
                        id_empleado: idEmpleado
                    })
                });

                if (!response.ok) throw new Error('Error en la petición');

                const data = await response.json();

                if (data.existe) {
                    showError(elements.correo, "El correo electrónico ya está registrado");
                    return false;
                }

                clearError(elements.correo);
                return true;
            } catch (error) {
                console.error('Error validando correo:', error);
                return false;
            }
        }

        async function validarTelefono() {
            const prefijo = elements.telefono_prefijo.value;
            const telefono_numero = elements.telefono_numero.value.trim();

            // Limpiar caracteres no numéricos
            elements.telefono_numero.value = telefono_numero.replace(/[^0-9]/g, '');


            if (prefijo === "") {
                showError(elements.telefono_prefijo, "El prefijo es obligatorio");
                return false;
            }

            if (telefono_numero === "") {
                showError(elements.telefono_numero, "El número de teléfono es obligatorio");
                return false;
            }

            if (telefono_numero.length !== 7) {
                showError(elements.telefono_numero, "El número debe tener 7 dígitos");
                return false;
            }

            const telefono = prefijo + telefono_numero;
            elements.telefono_completo.value = telefono;

            try {
                const response = await fetch('validar_telefono', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: new URLSearchParams({
                        telefono: telefono,
                        id_empleado: idEmpleado
                    })
                });

                if (!response.ok) throw new Error('Error en la petición');

                const data = await response.json();

                if (data.existe) {
                    showError(elements.telefono_numero, "El teléfono ya está registrado");
                    return false;
                }

                clearError(elements.telefono_prefijo);
                clearError(elements.telefono_numero);
                return true;
            } catch (error) {
                console.error('Error validando teléfono:', error);
                showError(elements.telefono_numero, "Error al validar teléfono");
                return false;
            }
        }

        function validarTipoEmpleado() {
            const id_tipo_empleado = elements.id_tipo_empleado.value;

            if (!id_tipo_empleado || id_tipo_empleado === "") {
                showError(elements.id_tipo_empleado, "El tipo de empleado es obligatorio");
                return false;
            }

            clearError(elements.id_tipo_empleado);
            return true;
        }

        function validarFechaNacimiento() {
            const fecha_nacimiento = elements.fecha_nacimiento.value;

            if (!fecha_nacimiento || fecha_nacimiento === "") {
                showError(elements.fecha_nacimiento, "La fecha de nacimiento es obligatoria");
                return false;
            }

            const fechaNac = new Date(fecha_nacimiento);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();

            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }

            if (edad < 15) {
                showError(elements.fecha_nacimiento, "Debe tener al menos 15 años");
                return false;
            }

            clearError(elements.fecha_nacimiento);
            return true;
        }

        function validarEstatus() {
            const estatus = elements.estatus.value;

            if (!estatus || estatus === "") {
                showError(elements.estatus, "El estatus es obligatorio");
                return false;
            }

            clearError(elements.estatus);
            return true;
        }

        function validarDireccion() {
            let direccion = elements.direccion.value;

            // Sanitiza: elimina etiquetas HTML
            direccion = direccion.replace(/<[^>]*>?/gm, "");

            if (!direccion || direccion === "") {
                showError(elements.direccion, "La dirección es obligatoria");
                return false;
            }

            // Bloquear espacios iniciales o finales
            if (/^\s|\s$/.test(direccion)) {
                showError(elements.direccion, "La dirección no puede iniciar ni terminar con espacios");
                return false;
            }

            // Validación de longitud
            if (direccion.length < 5) {
                showError(elements.direccion, "La dirección debe tener al menos 5 caracteres");
                return false;
            }

            if (direccion.length > 250) {
                showError(elements.direccion, "La dirección debe tener máximo 250 caracteres");
                return false;
            }

            // Validación de caracteres permitidos
            const regex = /^[A-Za-zÀ-ÿ0-9 ,.\-#]+$/;

            if (!regex.test(direccion)) {
                showError(elements.direccion, "La dirección solo puede contener letras, números, espacios, comas, puntos, guiones y #");
                return false;
            }

            elements.direccion.value = direccion;
            clearError(elements.direccion);
            return true;
        }

        // ========== EVENT LISTENERS ==========

        // Solo agregar listeners si los elementos existen
        if (elements.tipo_cedula && !elements.tipo_cedula.disabled) {
            elements.tipo_cedula.addEventListener('change', validarCedula);
        }

        if (elements.cedula && !elements.cedula.readOnly) {
            elements.cedula.addEventListener('input', validarCedula);
        }

        if (elements.nombre) {
            elements.nombre.addEventListener('input', validarNombre);
        }

        if (elements.apellido) {
            elements.apellido.addEventListener('input', validarApellido);
        }

        if (elements.correo) {
            elements.correo.addEventListener('input', validarCorreo);
        }

        if (elements.telefono_prefijo) {
            elements.telefono_prefijo.addEventListener('change', validarTelefono);
        }

        if (elements.telefono_numero) {
            elements.telefono_numero.addEventListener('input', validarTelefono);
        }

        // Select2 para tipo de empleado
        if (elements.id_tipo_empleado) {
            $(elements.id_tipo_empleado).on('change', validarTipoEmpleado);
            $(elements.id_tipo_empleado).on('select2:select', validarTipoEmpleado);
            $(elements.id_tipo_empleado).on('select2:clear', validarTipoEmpleado);
        }

        if (elements.cargo) {
            elements.cargo.addEventListener('input', validarCargo);
        }

        if (elements.fecha_nacimiento) {
            elements.fecha_nacimiento.addEventListener('input', validarFechaNacimiento);
        }

        if (elements.estatus) {
            elements.estatus.addEventListener('change', validarEstatus);
        }

        if (elements.direccion) {
            elements.direccion.addEventListener('input', validarDireccion);
        }

        // ========== SUBMIT DEL FORMULARIO ==========

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Mostrar spinner en el botón
            const btnGuardar = document.getElementById('btnGuardarCambios');
            const originalText = btnGuardar.innerHTML;
            btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Guardando...';
            btnGuardar.disabled = true;

            try {
                // Ejecutar todas las validaciones
                const validaciones = [
                    await validarCedula(),
                    validarNombre(),
                    validarApellido(),
                    await validarCorreo(),
                    await validarTelefono(),
                    validarTipoEmpleado(),
                    validarFechaNacimiento(),
                    validarEstatus(),
                    validarDireccion()
                ];


                if (validaciones.every(v => v === true)) {
                    // Preparar datos para enviar
                    const formData = new FormData(form);

                    // Enviar datos via AJAX
                    const response = await fetch('actualizar_empleado', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();

                        if (data.success || data.exito) {
                            // Mostrar éxito
                            Swal.fire({
                                icon: 'success',
                                title: '¡Éxito!',
                                text: data.message || data.mensaje || 'Empleado actualizado correctamente.',
                                confirmButtonColor: '#28a745',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                // Cerrar modal
                                const modal = bootstrap.Modal.getInstance(document.getElementById('modalEmpleado'));
                                if (modal) modal.hide();

                                if (dataTableInstance) {
                                    dataTableInstance.ajax.reload(null, false); // Recarga sin resetear la paginación
                                    console.log('DataTable recargado exitosamente');
                                } else {
                                    console.warn('DataTable instance no encontrada');
                                }
                            });
                        } else {
                            // Mostrar error del servidor
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: data.message || data.error || 'Error al actualizar el empleado',
                                confirmButtonColor: '#dc3545'
                            });
                        }
                    } else {
                        throw new Error('Error en la petición: ' + response.status);
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Formulario incompleto',
                        text: 'Corrige los campos resaltados antes de continuar',
                        confirmButtonColor: '#2E4053'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor',
                    confirmButtonColor: '#dc3545'
                });
            } finally {
                // Restaurar botón
                btnGuardar.innerHTML = originalText;
                btnGuardar.disabled = false;
            }
        });
    }
});