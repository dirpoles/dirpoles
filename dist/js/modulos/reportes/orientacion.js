//-------------------------------------------- VALIDACIONES
const hoy = new Date();
const fechaActual = hoy.toISOString().split("T")[0];

document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
document.getElementById("fecha_fin").setAttribute("max", fechaActual);

function validarFechaManual(inputId) {
    const input = document.getElementById(inputId);
    if (input.value && new Date(input.value) > new Date(fechaActual)) return false;
    return true;
}

// Variables globales
let tableOr;
let dataOrientacion = [];
let lastFiltered = [];

let chartG = null, chartP = null;
let chartType = 'bar';

const bgColors = [
    "rgba(78, 115, 223, 0.8)", "rgba(28, 200, 138, 0.8)", "rgba(54, 185, 204, 0.8)",
    "rgba(246, 194, 62, 0.8)", "rgba(231, 74, 59, 0.8)", "rgba(133, 135, 150, 0.8)",
    "rgba(90, 92, 105, 0.8)", "rgba(255, 128, 66, 0.8)", "rgba(102, 16, 242, 0.8)",
    "rgba(253, 126, 20, 0.8)", "rgba(32, 201, 151, 0.8)", "rgba(111, 66, 193, 0.8)"
];

document.addEventListener("DOMContentLoaded", () => {
    inicializarDataTable();
    cargarData();

    // Submit
    document.getElementById("form-reporte").addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validarFechaManual("fecha_inicio") || !validarFechaManual("fecha_fin")) {
            Swal.fire({ icon: "error", title: "Formulario inválido", text: "La fecha de inicio y fin no pueden ser fechas futuras.", confirmButtonText: "Entendido" });
            return;
        }
        filtrarYRenderizar();
    });

    // Limpiar
    document.getElementById("btn-limpiar").addEventListener("click", function () {
        document.getElementById("form-reporte").reset();
        document.getElementById("contenedor_orientacion").style.display = "none";
        lastFiltered = [];
        if (tableOr) tableOr.clear().draw();
        // Re-poblar selects
        poblarSelects(dataOrientacion);
    });

    // Chart selectors
    document.getElementById("select-grafica").addEventListener("change", actualizarVisibilidad);
    document.getElementById("select-tipo-chart").addEventListener("change", function () {
        chartType = this.value;
        if (lastFiltered.length > 0) renderCharts(lastFiltered);
    });
});

// ==================== CARGA DE DATA ====================
function cargarData() {
    fetch(BASE_URL + "reportes_orientacion_data")
        .then(r => r.json())
        .then(data => {
            if (data.exito === false) { Swal.fire({ icon: "error", title: "Error", text: data.mensaje }); return; }
            dataOrientacion = data;
            poblarSelects(data);
        })
        .catch(err => { console.error(err); Swal.fire({ icon: "error", title: "Error de conexión", text: "No se pudo obtener los datos de orientación." }); });
}

function poblarSelects(data) {
    if (!Array.isArray(data)) return;
    const pnfI = document.getElementById("pnf");
    pnfI.innerHTML = '<option value="">Todos</option>';

    [...new Set(data.map(i => i.nombre_pnf).filter(Boolean))].forEach(v => {
        const o = document.createElement("option"); o.value = v; o.textContent = v; pnfI.appendChild(o);
    });
}

// ==================== FILTRO ====================
function filtrarYRenderizar() {
    const fI = document.getElementById("fecha_inicio").value;
    const fF = document.getElementById("fecha_fin").value;
    const genero = document.getElementById("genero").value;
    const pnf = document.getElementById("pnf").value;

    const filtered = dataOrientacion.filter(item => {
        let match = true;
        if (fI || fF) {
            const d = new Date(item.fecha_creacion);
            if (fI && d < new Date(fI)) match = false;
            if (fF && d > new Date(fF)) match = false;
        }
        if (genero && item.genero !== genero) match = false;
        if (pnf && item.nombre_pnf !== pnf) match = false;
        return match;
    });

    if (filtered.length === 0) {
        Swal.fire({ icon: "warning", title: "Sin resultados", text: "No se encontraron registros con los filtros seleccionados.", confirmButtonText: "Entendido" });
        document.getElementById("contenedor_orientacion").style.display = "none";
        tableOr.clear().draw(); lastFiltered = [];
        return;
    }

    lastFiltered = filtered;
    tableOr.clear();
    filtered.forEach(item => {
        const dp = item.fecha_creacion.split("-");
        const fecha = dp.length === 3 ? `${dp[2]}-${dp[1]}-${dp[0]}` : item.fecha_creacion;
        const cedula = (item.tipo_cedula ? item.tipo_cedula + " - " : "") + item.cedula;

        tableOr.row.add([
            fecha,
            item.nombres + " " + item.apellidos,
            cedula,
            item.nombre_pnf || "N/A",
            item.motivo_orientacion || "N/A"
        ]);
    });
    tableOr.draw();

    document.getElementById("contenedor_orientacion").style.display = "block";
    renderCharts(filtered);
    actualizarVisibilidad();

    Swal.fire({ icon: "success", title: "Reporte generado", text: `Se encontraron ${filtered.length} registro(s).`, confirmButtonText: "Entendido", timer: 3000, timerProgressBar: true });
}

// ==================== VISIBILIDAD CHARTS ====================
function actualizarVisibilidad() {
    const sel = document.getElementById("select-grafica").value;
    document.getElementById("wrapper-chartG").style.display = (sel === 'todos' || sel === 'genero') ? '' : 'none';
    document.getElementById("wrapper-chartP").style.display = (sel === 'todos' || sel === 'pnf') ? '' : 'none';
}

// ==================== DATATABLE ====================
function inicializarDataTable() {
    const chartMap = [
        { id: "chartG", wrapperId: "wrapper-chartG", title: "Gráfico por Género" },
        { id: "chartP", wrapperId: "wrapper-chartP", title: "Gráfico por PNF" }
    ];

    tableOr = $("#tabla_orientacion").DataTable({
        responsive: true, autoWidth: false, paging: true, lengthChange: true, searching: true, ordering: true, info: true, dom: "Bfrtip",
        buttons: [
            { extend: "excelHtml5", text: '<i class="far fa-file-excel"></i> Excel', title: "Reporte Orientación", className: "btn btn-success btn-sm m-1" },
            {
                extend: "pdfHtml5", text: '<i class="fas fa-file-pdf"></i> PDF', title: "Reporte Orientación", className: "btn btn-danger btn-sm m-1",
                orientation: "landscape", pageSize: "A4", exportOptions: { columns: ":visible" },
                customize: function (doc) {
                    doc.styles.tableHeader.fillColor = '#4e73df';
                    doc.styles.tableHeader.color = 'white';
                    chartMap.forEach(item => {
                        const wrapper = document.getElementById(item.wrapperId);
                        const canvas = document.getElementById(item.id);
                        if (wrapper && canvas && wrapper.style.display !== 'none') {
                            doc.content.push({ pageBreak: "before", text: item.title, alignment: "center", margin: [0, 20, 0, 10], fontSize: 16, bold: true });
                            doc.content.push({ image: canvas.toDataURL("image/png"), width: 700, alignment: "center", margin: [0, 30, 0, 20] });
                        }
                    });
                }
            }
        ],
        language: { sEmptyTable: "No hay registros disponibles", sInfo: "Mostrando _START_ a _END_ de _TOTAL_ registros", sInfoEmpty: "Mostrando 0 a 0 de 0 registros", sInfoFiltered: "(filtrado de _MAX_ registros totales)", sLengthMenu: "Mostrar _MENU_ registros", sLoadingRecords: "Cargando...", sProcessing: "Procesando...", sSearch: "Buscar:", sZeroRecords: "No se encontraron resultados", oPaginate: { sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior" } }
    });
    tableOr.buttons().container().appendTo('#botones-exportacion');
}

// ==================== CHART.JS ====================
function buildChartConfig(type, labels, dataValues, labelTitle) {
    let options = {
        responsive: true, maintainAspectRatio: false,
        tooltips: { callbacks: { label: function (t, d) { let l = d.labels[t.index] || ''; if (l) l += ': '; l += dataValues[t.index]; return l; } } },
        legend: { display: true, position: 'bottom' }
    };
    if (type === 'bar') { options.scales = { yAxes: [{ ticks: { beginAtZero: true } }] }; options.legend.display = false; }
    return { type, data: { labels, datasets: [{ label: labelTitle, data: dataValues, backgroundColor: bgColors.slice(0, labels.length), borderColor: "white", borderWidth: 2 }] }, options };
}

function renderCharts(data) {
    const gMap = { "M": "Masculino", "F": "Femenino" };

    // Género
    const gU = [...new Set(data.map(i => i.genero).filter(Boolean))];
    const gL = gU.length ? gU.map(g => gMap[g] || g) : ["N/E"];
    const gV = gU.map(g => data.filter(i => i.genero === g).length);
    if (chartG) chartG.destroy();
    chartG = new Chart(document.getElementById("chartG").getContext("2d"), buildChartConfig(chartType, gL, gV, "Género"));

    // PNF
    const pU = [...new Set(data.map(i => i.nombre_pnf).filter(Boolean))];
    const pL = pU.length ? pU : ["N/E"];
    const pV = pU.map(p => data.filter(i => i.nombre_pnf === p).length);
    if (chartP) chartP.destroy();
    chartP = new Chart(document.getElementById("chartP").getContext("2d"), buildChartConfig(chartType, pL, pV, "PNF"));
}
