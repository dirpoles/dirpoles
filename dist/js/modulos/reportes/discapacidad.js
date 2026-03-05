//-------------------------------------------- CONSTANTES Y CONFIGURACIÓN
const hoy = new Date();
const fechaActual = hoy.toISOString().split("T")[0];

document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
document.getElementById("fecha_fin").setAttribute("max", fechaActual);

const bgColors = [
    "rgba(78, 115, 223, 0.8)", "rgba(28, 200, 138, 0.8)", "rgba(54, 185, 204, 0.8)",
    "rgba(246, 194, 62, 0.8)", "rgba(231, 74, 59, 0.8)", "rgba(133, 135, 150, 0.8)",
    "rgba(90, 92, 105, 0.8)", "rgba(255, 128, 66, 0.8)", "rgba(102, 16, 242, 0.8)"
];

const langES = {
    sEmptyTable: "No hay registros disponibles",
    sInfo: "Mostrando _START_ a _END_ de _TOTAL_ registros",
    sInfoEmpty: "Mostrando 0 a 0 de 0 registros",
    sInfoFiltered: "(filtrado de _MAX_ registros totales)",
    sLengthMenu: "Mostrar _MENU_ registros",
    sLoadingRecords: "Cargando...",
    sProcessing: "Procesando...",
    sSearch: "Buscar:",
    sZeroRecords: "No se encontraron resultados",
    oPaginate: { sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior" }
};

// Variables globales
let rawData = [];
let tableGeneral;
let charts = { G: null, P: null };
let currentChartType = 'bar';
let lastFilteredData = [];

//-------------------------------------------- INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
    inicializarDataTable();
    cargarData();

    // Evento Submit
    document.getElementById("form-reporte").addEventListener("submit", function (e) {
        e.preventDefault();
        filtrarYRenderizar();
    });

    // Evento Limpiar
    document.getElementById("btn-limpiar").addEventListener("click", () => {
        document.getElementById("form-reporte").reset();
        document.getElementById("contenedor_general").style.display = "none";
        tableGeneral.clear().draw();
    });

    // Selectores de Gráficas
    document.getElementById("select-grafica").addEventListener("change", actualizarVisibilidadCharts);
    document.getElementById("select-tipo-chart").addEventListener("change", function () {
        currentChartType = this.value;
        if (lastFilteredData.length) renderCharts(lastFilteredData);
    });
});

//-------------------------------------------- CARGA DE DATA
function cargarData() {
    fetch(BASE_URL + "reportes_discapacidad_data")
        .then(r => r.json())
        .then(data => {
            if (!data) throw new Error("No se recibió información del servidor.");
            if (data.exito === false) throw new Error(data.mensaje);

            rawData = data;
            poblarSelects(data);
        })
        .catch(err => {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la información.' });
        });
}

function poblarSelects(data) {
    const pnfSel = document.getElementById("pnf");
    const areaSel = document.getElementById("area");

    const pnfs = [...new Set(data.map(i => i.nombre_pnf).filter(Boolean))];
    const areas = [...new Set(data.map(i => i.area_especializacion).filter(Boolean))]; // Asumiendo que existe en el objeto si se usa

    pnfs.forEach(p => {
        const opt = document.createElement("option"); opt.value = p; opt.textContent = p; pnfSel.appendChild(opt);
    });

    areas.forEach(a => {
        const opt = document.createElement("option"); opt.value = a; opt.textContent = a; areaSel.appendChild(opt);
    });
}

//-------------------------------------------- FILTRADO Y RENDER
function filtrarYRenderizar() {
    const fI = document.getElementById("fecha_inicio").value;
    const fF = document.getElementById("fecha_fin").value;
    const gen = document.getElementById("genero").value;
    const pnf = document.getElementById("pnf").value;
    const area = document.getElementById("area").value;

    if (fI && new Date(fI) > new Date(fechaActual)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'La fecha de inicio no puede ser futura.' });
        return;
    }

    const filtered = rawData.filter(i => {
        if (fI && new Date(i.fecha_creacion) < new Date(fI)) return false;
        if (fF && new Date(i.fecha_creacion) > new Date(fF)) return false;
        if (gen && i.genero !== gen) return false;
        if (pnf && i.nombre_pnf !== pnf) return false;
        // if (area && i.area_especializacion !== area) return false; 
        return true;
    });

    if (filtered.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Sin resultados', text: 'No se encontraron registros con los filtros aplicados.' });
        document.getElementById("contenedor_general").style.display = "none";
        return;
    }

    lastFilteredData = filtered;

    // Mostrar contenedor y alert
    document.getElementById("contenedor_general").style.display = "block";
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Se encontraron ${filtered.length} registros.`,
        timer: 3000,
        timerProgressBar: true,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#4e73df'
    });

    // Llenar tabla
    tableGeneral.clear();
    filtered.forEach(i => {
        tableGeneral.row.add([
            formatFecha(i.fecha_creacion),
            (i.nombres + " " + (i.apellidos || '')).trim(),
            i.cedula,
            i.nombre_pnf || 'N/A',
            i.condicion_medica || 'N/A',
            i.cirugia_previa === 'si' ? 'Si' : 'No',
            i.requiere_asistencia === 'si' ? 'Si' : 'No',
            i.dispositivo_asistencia || 'N/A',
            i.apoyo_psicologico === 'si' ? 'Si' : 'No'
        ]);
    });
    tableGeneral.draw();

    // Renderizar gráficas
    renderCharts(filtered);
}

function renderCharts(data) {
    const gData = countBy(data, 'genero', { 'M': 'Masculino', 'F': 'Femenino' });
    const pData = countBy(data, 'nombre_pnf');

    if (charts.G) charts.G.destroy();
    if (charts.P) charts.P.destroy();

    charts.G = new Chart(document.getElementById("chartG").getContext("2d"), buildConfig(currentChartType, gData.labels, gData.values, "Por Género"));
    charts.P = new Chart(document.getElementById("chartP").getContext("2d"), buildConfig(currentChartType, pData.labels, pData.values, "Por PNF"));
}

//-------------------------------------------- HELPERS
function countBy(data, field, mapValues = null) {
    const count = {};
    data.forEach(i => {
        let val = i[field] || 'N/E';
        if (mapValues && mapValues[val]) val = mapValues[val];
        count[val] = (count[val] || 0) + 1;
    });
    return { labels: Object.keys(count), values: Object.values(count) };
}

function buildConfig(type, labels, values, title) {
    const config = {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                backgroundColor: bgColors.slice(0, labels.length),
                borderColor: 'white',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: 'bottom' }
        }
    };
    if (type === 'bar') {
        config.options.scales = {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    precision: 0,
                    callback: function (value) { if (value % 1 === 0) return value; }
                }
            }]
        };
        config.options.legend.display = false;
    }
    return config;
}

function formatFecha(f) {
    if (!f) return 'N/A';
    const parts = f.split(" ")[0].split("-");
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : f;
}

function actualizarVisibilidadCharts() {
    const v = document.getElementById("select-grafica").value;
    document.querySelectorAll(".wrapper-chart").forEach(el => el.style.display = "none");
    if (v === "todos") document.querySelectorAll(".wrapper-chart").forEach(el => el.style.display = "");
    else if (v === "genero") document.getElementById("wrapper-chartG").style.display = "";
    else if (v === "pnf") document.getElementById("wrapper-chartP").style.display = "";
}

function inicializarDataTable() {
    tableGeneral = $("#tabla_discapacidad").DataTable({
        responsive: true,
        language: langES,
        dom: 'Bfrtip',
        buttons: [
            { extend: 'excelHtml5', text: '<i class="fas fa-file-excel"></i> Excel', title: 'Reporte Discapacidad', className: 'btn btn-success btn-sm' },
            {
                extend: 'pdfHtml5', text: '<i class="fas fa-file-pdf"></i> PDF', title: 'Reporte Discapacidad', className: 'btn btn-danger btn-sm',
                orientation: 'landscape', pageSize: 'A4',
                customize: function (doc) {
                    doc.styles.tableHeader.fillColor = '#4e73df';
                    doc.styles.tableHeader.color = 'white';

                    const visibleCharts = [
                        { id: "chartG", wrapper: "wrapper-chartG", title: "Distribución por Género" },
                        { id: "chartP", wrapper: "wrapper-chartP", title: "Distribución por PNF" }
                    ];

                    visibleCharts.forEach(c => {
                        const canvas = document.getElementById(c.id);
                        const wrapper = document.getElementById(c.wrapper);
                        if (canvas && wrapper.style.display !== 'none') {
                            doc.content.push({ pageBreak: 'before', text: 'Gráfica: ' + c.title, alignment: 'center', margin: [0, 20, 0, 10], fontSize: 16, bold: true });
                            doc.content.push({ image: canvas.toDataURL("image/png"), width: 700, alignment: 'center' });
                        }
                    });
                }
            }
        ]
    });
    tableGeneral.buttons().container().appendTo('#btn-exp-general');
}
