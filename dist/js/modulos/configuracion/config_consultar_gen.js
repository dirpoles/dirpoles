let tablaConfig;

document.addEventListener('DOMContentLoaded', function () {
    cargarTabla('patologia'); // Cargar por defecto
});

function cargarTabla(tipo) {
    // Destruir tabla previa si existe
    if ($.fn.DataTable.isDataTable('#tabla_config')) {
        $('#tabla_config').DataTable().destroy();
        $('#tabla_config').empty();
    }

    let columnas = [];

    // Definir columnas según el tipo
    // Helper functions for common renderers
    const renderStatus = (data) => {
        const clase = data == 1 ? 'bg-success' : 'bg-danger';
        const texto = data == 1 ? 'Activo' : 'Inactivo';
        return `<span class="badge ${clase}">${texto}</span>`;
    };

    const renderDate = (data) => {
        if (!data) return "";
        return moment(data).format("DD/MM/YYYY");
    };

    const renderActions = (id, type) => {
        return `
            <div class="text-center btn-group btn-group-sm d-block">
                <button class="btn btn-info btn-editar" 
                        data-id="${id}"
                        data-tipo="${type}"
                        data-bs-toggle="tooltip"
                        title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;
    };

    // Configuration object for columns
    const columnDefs = {
        'patologia': [
            { title: "ID", data: "id_patologia", visible: false },
            { title: "Nombre de la Patología", data: "nombre_patologia" }, // Simplified direct data access
            { title: "Tipo de Patología", data: "tipo_patologia" },
            { title: "Fecha de Creación", data: "fecha_creacion", render: renderDate },
            { title: "Acciones", data: "id_patologia", orderable: false, searchable: false, width: '140px', render: (data) => renderActions(data, "patologia") }
        ],
        'pnf': [
            { title: "ID", data: "id_pnf", visible: false },
            { title: "Nombre del PNF", data: "nombre_pnf" },
            { title: "Estado", data: "estatus", render: renderStatus },
            { title: "Fecha de creación", data: "fecha_creacion", render: renderDate },
            { title: "Acciones", data: "id_pnf", orderable: false, searchable: false, width: '140px', render: (data) => renderActions(data, "pnf") }
        ],
        'servicio': [
            { title: "ID", data: "id_servicios", visible: false },
            { title: "Nombre del Servicio", data: "nombre_servicio" },
            { title: "Estado", data: "estatus", render: renderStatus },
            { title: "Fecha de creación", data: "fecha_creacion", render: renderDate },
            { title: "Acciones", data: "id_servicios", orderable: false, searchable: false, width: '140px', render: (data) => renderActions(data, "servicio") }
        ],
        'tipo_empleado': [
            { title: "ID", data: "id_tipo_emp", visible: false },
            { title: "Tipo de empleado", data: "tipo_empleado" },
            { title: "Servicio Asociado", data: "servicio" }, // Assuming this is the name or ID you want to show
            { title: "Fecha de creación", data: "fecha_creacion", render: renderDate },
            { title: "Acciones", data: "id_tipo_emp", orderable: false, searchable: false, width: '140px', render: (data) => renderActions(data, "tipo_empleado") }
        ],
        'tipo_mobiliario': [
            { title: "ID", data: "id_tipo_mobiliario", visible: false },
            { title: "Tipo de mobiliario", data: "nombre_mobiliario" },
            { title: "Descripción", data: "descripcion_mobiliario" },
            { title: "Estado", data: "estatus", render: renderStatus },
            { title: "Fecha de creación", data: "fecha_creacion", render: renderDate },
            { title: "Acciones", data: "id_tipo_mobiliario", orderable: false, searchable: false, width: '140px', render: (data) => renderActions(data, "tipo_mobiliario") }
        ],
        'tipo_equipo': [
            { title: "ID", data: "id_tipo_equipo", visible: false },
            { title: "Tipo de equipo", data: "nombre_equipo" },
            { title: "Descripción", data: "descripcion_equipo" },
            { title: "Estado", data: "estatus", render: renderStatus },
            { title: "Fecha de creación", data: "fecha_creacion", render: renderDate },
            { title: "Acciones", data: "id_tipo_equipo", orderable: false, searchable: false, width: '140px', render: (data) => renderActions(data, "tipo_equipo") }
        ],
        'presentacion_insumo': [
            { title: "ID", data: "id_presentacion", visible: false },
            { title: "Presentación de insumo", data: "nombre_presentacion" },
            { title: "Fecha de creación", data: "fecha_creacion", render: renderDate },
            { title: "Acciones", data: "id_presentacion", orderable: false, searchable: false, width: '140px', render: (data) => renderActions(data, "presentacion_insumo") }
        ]
    };

    columnas = columnDefs[tipo] || [];

    // Inicializar DataTable
    tablaConfig = $('#tabla_config').DataTable({
        ajax: {
            url: `consultar_config_json?tipo=${tipo}`,
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
    script.src = `dist/js/modulos/configuracion/${tipo}/editar_${tipo}.js`;
    document.body.appendChild(script);
}