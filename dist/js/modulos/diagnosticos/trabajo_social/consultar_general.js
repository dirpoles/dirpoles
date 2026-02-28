let tablaTS;
const BASE_URL = "<?= BASE_URL ?>";

document.addEventListener('DOMContentLoaded', function () {
    cargarTabla('becas'); // Cargar por defecto
});

function cargarTabla(tipo) {
    // Destruir tabla previa si existe
    if ($.fn.DataTable.isDataTable('#tabla_ts')) {
        $('#tabla_ts').DataTable().destroy();
        $('#tabla_ts').empty();
    }

    let columnas = [];

    // Definir columnas según el tipo
    if (tipo === 'becas') {
        columnas = [
            { title: "ID", data: "id_becas", visible: false },
            {
                title: "Beneficiario", data: null, render: function (data, type, row) {
                    return `${row.nombres} ${row.apellidos}<br><small>${row.tipo_cedula}-${row.cedula}</small>`;
                }
            },
            {
                title: "Empleado", data: null, visible: window.esAdmin || false, render: function (data, type, row) {
                    return `${row.nombre_empleado}<br><small>${row.cedula_empleado}</small>`;
                }
            },
            {
                title: "Cuenta Completa", data: null, render: function (data, type, row) {
                    return `<span class="font-monospace">${row.tipo_banco}${row.cta_bcv}</span><br><small class="text-muted">${row.nombre_banco || 'Banco no identificado'}</small>`;
                }
            },
            {
                title: "Fecha",
                data: "fecha_creacion",
                render: function (data, type, row) {
                    // Si no hay fecha, devolvemos vacío
                    if (!data) return "";

                    // Formatear con moment.js
                    return moment(data).format("DD/MM/YYYY");
                }
            },
            {
                title: "Documentos",
                data: null,
                orderable: false,
                searchable: false,
                width: '80px',
                render: function (data, type, row) {
                    return row.direccion_pdf ?
                        `<a href="${row.direccion_pdf}" target="_blank" data-bs-toggle="tooltip" class="btn btn-sm btn-danger" title="Ver PDF">
                            <i class="fas fa-file-pdf"></i>
                        </a>` :
                        '<span class="text-muted">-</span>';
                }
            },
            {
                title: "Acciones",
                data: "id_becas",
                orderable: false,
                searchable: false,
                width: '140px',
                render: function (data, type, row) {
                    return `
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-primary btn-ver" 
                                    data-id="${data}"
                                    data-tipo="becas"
                                    data-bs-toggle="tooltip"
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-info btn-editar" 
                                    data-id="${data}"
                                    data-tipo="becas"
                                    data-bs-toggle="tooltip"
                                    title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-eliminar" 
                                    data-id="${data}"
                                    data-tipo="becas"
                                    data-id-solicitud="${row.id_solicitud_serv}"
                                    data-bs-toggle="tooltip"
                                    title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ];
    } else if (tipo === 'exoneraciones') {
        columnas = [
            { title: "ID", data: "id_exoneracion", visible: false },
            {
                title: "Beneficiario", data: null, render: function (data, type, row) {
                    return `${row.nombres} ${row.apellidos}<br><small>${row.tipo_cedula}-${row.cedula}</small>`;
                }
            },
            {
                title: "Empleado", data: null, visible: window.esAdmin || false, render: function (data, type, row) {
                    return `${row.nombre_empleado}<br><small>${row.cedula_empleado}</small>`;
                }
            },
            {
                title: "Motivo", data: null, render: function (data, type, row) {
                    return row.motivo === 'Otro' ? row.otro_motivo : row.motivo;
                }
            },
            {
                title: "Fecha",
                data: "fecha_creacion",
                render: function (data, type, row) {
                    // Si no hay fecha, devolvemos vacío
                    if (!data) return "";

                    // Formatear con moment.js
                    return moment(data).format("DD/MM/YYYY");
                }
            },
            {
                title: "Documentos",
                data: null,
                orderable: false,
                searchable: false,
                width: '120px',
                render: function (data, type, row) {
                    let html = '';
                    if (row.direccion_carta) html += `<a href="${row.direccion_carta}" data-bs-toggle="tooltip" target="_blank" class="btn btn-sm btn-primary me-1" title="Carta"><i class="fas fa-envelope"></i></a>`;
                    if (row.direccion_estudiose) html += `<a href="${row.direccion_estudiose}" data-bs-toggle="tooltip" target="_blank" class="btn btn-sm btn-info text-white" title="Estudio SE"><i class="fas fa-file-invoice-dollar"></i></a>`;
                    return html || '<span class="text-muted">-</span>';
                }
            },
            {
                title: "Acciones",
                data: "id_exoneracion",
                orderable: false,
                searchable: false,
                width: '140px',
                render: function (data, type, row) {
                    return `
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-primary btn-ver" 
                                    data-id="${data}"
                                    data-tipo="exoneraciones"
                                    data-bs-toggle="tooltip"
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-info btn-editar" 
                                    data-id="${data}"
                                    data-tipo="exoneraciones"
                                    data-bs-toggle="tooltip"
                                    title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-eliminar" 
                                    data-id="${data}"
                                    data-tipo="exoneraciones"
                                    data-id-solicitud="${row.id_solicitud_serv}"
                                    data-bs-toggle="tooltip"
                                    title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ];
    } else if (tipo === 'fames') {
        columnas = [
            { title: "ID", data: "id_fames", visible: false },
            {
                title: "Beneficiario", data: null, render: function (data, type, row) {
                    return `${row.nombres} ${row.apellidos}<br><small>${row.tipo_cedula}-${row.cedula}</small>`;
                }
            },
            {
                title: "Empleado", data: null, visible: window.esAdmin || false, render: function (data, type, row) {
                    return `${row.nombre_empleado}<br><small>${row.cedula_empleado}</small>`;
                }
            },
            {
                title: "Ayuda", data: null, render: function (data, type, row) {
                    return row.tipo_ayuda === 'Otro' ? row.otro_tipo : row.tipo_ayuda;
                }
            },
            { title: "Patología", data: "nombre_patologia" },
            {
                title: "Fecha",
                data: "fecha_creacion",
                render: function (data, type, row) {
                    // Si no hay fecha, devolvemos vacío
                    if (!data) return "";

                    // Formatear con moment.js
                    return moment(data).format("DD/MM/YYYY");
                }
            },
            {
                title: "Acciones",
                data: "id_fames",
                orderable: false,
                searchable: false,
                width: '140px',
                render: function (data, type, row) {
                    return `
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-primary btn-ver" 
                                    data-id="${data}"
                                    data-tipo="fames"
                                    data-bs-toggle="tooltip"
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-info btn-editar" 
                                    data-id="${data}"
                                    data-tipo="fames"
                                    data-bs-toggle="tooltip"
                                    title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-eliminar" 
                                    data-id="${data}"
                                    data-tipo="fames"
                                    data-id-solicitud="${row.id_solicitud_serv}"
                                    data-id-detalle-patologia="${row.id_detalle_patologia}"
                                    data-bs-toggle="tooltip"
                                    title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ];
    } else if (tipo === 'embarazadas') {
        columnas = [
            { title: "ID", data: "id_gestion", visible: false },
            {
                title: "Beneficiario", data: null, render: function (data, type, row) {
                    return `${row.nombres} ${row.apellidos}<br><small>${row.tipo_cedula}-${row.cedula}</small>`;
                }
            },
            {
                title: "Empleado", data: null, visible: window.esAdmin || false, render: function (data, type, row) {
                    return `${row.nombre_empleado}<br><small>${row.cedula_empleado}</small>`;
                }
            },
            { title: "Semanas", data: "semanas_gest" },
            {
                title: "Estado", data: null, render: function (data, type, row) {
                    let color;
                    switch (row.estado) {
                        case 'En Proceso':
                        case 'En proceso':
                            color = 'warning';
                            break;
                        case 'Rechazado':
                            color = 'danger';
                            break;
                        case 'Aprobado':
                            color = 'success';
                            break;
                        default:
                            color = 'secondary';
                    }
                    return `<span class="badge text-bg-${color}">${row.estado}</span>`;
                }
            },
            {
                title: "Fecha",
                data: "fecha_creacion",
                render: function (data, type, row) {
                    // Si no hay fecha, devolvemos vacío
                    if (!data) return "";

                    // Formatear con moment.js
                    return moment(data).format("DD/MM/YYYY");
                }
            },
            {
                title: "Acciones",
                data: "id_gestion",
                orderable: false,
                searchable: false,
                width: '140px',
                render: function (data, type, row) {
                    return `
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-primary btn-ver" 
                                    data-id="${data}"
                                    data-tipo="embarazadas"
                                    data-bs-toggle="tooltip"
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-info btn-editar" 
                                    data-id="${data}"
                                    data-tipo="embarazadas"
                                    data-bs-toggle="tooltip"
                                    title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-eliminar" 
                                    data-id="${data}"
                                    data-tipo="embarazadas"
                                    data-id-solicitud="${row.id_solicitud_serv}"
                                    data-id-detalle-patologia="${row.id_detalle_patologia}"
                                    data-id-beneficiario="${row.id_beneficiario}"
                                    data-bs-toggle="tooltip"
                                    title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ];
    }

    // Inicializar DataTable
    tablaTS = $('#tabla_ts').DataTable({
        ajax: {
            url: `consultar_diagnosticos_json?tipo=${tipo}`,
            dataSrc: function (json) {
                if (!json.exito) {
                    console.error(json.mensaje);
                    return [];
                }
                return json.data;
            }
        },
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
                    }
                ]
            },
        },
        columns: columnas,
        ordering: true,
        order: [[0, 'desc']],
        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
        language: {
            url: 'plugins/DataTables/js/languaje.json'
        },
        responsive: true,
        autoWidth: false,
        initComplete: function (settings, json) {
            if (json && json.error) {
                console.error('Error: ', json.error);
            }
            // Inicializar tooltips
            $('[data-bs-toggle="tooltip"]').tooltip();

            // Cargar el script específico del tipo
            cargarScriptTipo(tipo);
        },
        drawCallback: function (settings) {
            // Re-inicializar tooltips después de cada dibujado
            $('[data-bs-toggle="tooltip"]').tooltip();
        }
    });
}

// Función para cargar dinámicamente el script del tipo
function cargarScriptTipo(tipo) {
    const scriptId = `script-${tipo}`;

    // Remover script anterior si existe
    const scriptAnterior = document.getElementById(scriptId);
    if (scriptAnterior) {
        scriptAnterior.remove();
    }

    // Crear y cargar nuevo script
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `dist/js/modulos/diagnosticos/trabajo_social/${tipo}/consultar_${tipo}.js`;
    document.body.appendChild(script);
}