document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    const btnAyuda = e.target.closest("#btn-ayuda");
    if (btnAyuda) {
      try {
        const driverObj = window.driver.js.driver({
          showProgress: true,
          nextBtnText: "Siguiente",
          prevBtnText: "Anterior",
          doneBtnText: "Finalizar",
          popoverClass: "mi-popover",
          // popoverOffset: 30,

          steps: [
            {
              element: "#fecha_inicio",
              popover: {
                title: "Fecha Inicio",
                description: "Seleccione la fecha inicial para filtrar el reporte.",
                align: "center",
              },
            },
            {
              element: "#fecha_fin",
              popover: {
                title: "Fecha Fin",
                description: "Seleccione la fecha final para filtrar el reporte.",
                align: "center",
              },
            },
            {
              element: "#tipo_reporte",
              popover: {
                title: "Tipo de Reporte",
                description: "Seleccione el tipo de reporte que desea visualizar (Morbilidad o Citas).",
                align: "center",
              },
            },
            {
              element: "#genero",
              popover: {
                title: "Género",
                description: "Filtre los resultados especificando un género.",
                align: "center",
              },
            },
            {
              element: "#pnf",
              popover: {
                title: "PNF",
                description: "Filtre los resultados por Programa Nacional de Formación.",
                align: "center",
              },
            }
          ],
        });
        driverObj.drive();
      } catch (error) {
        console.error("Error al inicializar driver:", error);
      }
    }
  });
});
//-------------------------------------------- VALIDACIONES
const hoy = new Date();
const fechaActual = hoy.toISOString().split("T")[0];

document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
document.getElementById("fecha_fin").setAttribute("max", fechaActual);

function validarFechaManual(inputId) {
    const input = document.getElementById(inputId);
    if (input.value && new Date(input.value) > new Date(fechaActual)) {
        return false;
    }
    return true;
}

// Variables globales
let tableMorbilidad, tableCitas;
let dataMorbilidad = [];
let dataCitas = [];
let lastFilteredMorbilidad = [];
let lastFilteredCitas = [];

// Gráficos Morbilidad
let chartGM = null, chartPM = null, chartT = null;
// Gráficos Citas
let chartGC = null, chartPC = null;

// Tipo de gráfico global por sub-reporte
let chartTypeMorbilidad = 'bar';
let chartTypeCitas = 'bar';

// Colores
const bgColors = [
    "rgba(78, 115, 223, 0.8)", "rgba(28, 200, 138, 0.8)", "rgba(54, 185, 204, 0.8)",
    "rgba(246, 194, 62, 0.8)", "rgba(231, 74, 59, 0.8)", "rgba(133, 135, 150, 0.8)",
    "rgba(90, 92, 105, 0.8)", "rgba(255, 128, 66, 0.8)", "rgba(102, 16, 242, 0.8)",
    "rgba(253, 126, 20, 0.8)", "rgba(32, 201, 151, 0.8)", "rgba(111, 66, 193, 0.8)"
];

document.addEventListener("DOMContentLoaded", () => {

    // Inicializar DataTables
    inicializarDataTableMorbilidad();
    inicializarDataTableCitas();

    // Evento: cambio de tipo de reporte
    document.getElementById("tipo_reporte").addEventListener("change", function () {
        const tipo = this.value;

        // Ocultar ambos contenedores
        document.getElementById("contenedor_morbilidad").style.display = "none";
        document.getElementById("contenedor_citas").style.display = "none";
        document.getElementById("div-filtro-tipo").style.display = "none";

        // Resetear selects dinámicos
        document.getElementById("pnf").innerHTML = '<option value="">Todos</option>';
        document.getElementById("tipo").innerHTML = '<option value="">Todos</option>';

        if (tipo === "morbilidad") {
            document.getElementById("div-filtro-tipo").style.display = "";
            cargarDataMorbilidad();
        } else if (tipo === "citas") {
            cargarDataCitas();
        }
    });

    // Submit del formulario
    document.getElementById("form-reporte").addEventListener("submit", function (e) {
        e.preventDefault();

        const tipoReporte = document.getElementById("tipo_reporte").value;

        if (!tipoReporte) {
            Swal.fire({
                icon: "error",
                title: "Formulario inválido",
                text: "Debe seleccionar un tipo de reporte.",
                confirmButtonText: "Entendido",
            });
            return;
        }

        if (!validarFechaManual("fecha_inicio") || !validarFechaManual("fecha_fin")) {
            Swal.fire({
                icon: "error",
                title: "Formulario inválido",
                text: "La fecha de inicio y fin no pueden ser fechas futuras.",
                confirmButtonText: "Entendido",
            });
            return;
        }

        if (tipoReporte === "morbilidad") {
            filtrarMorbilidad();
        } else if (tipoReporte === "citas") {
            filtrarCitas();
        }
    });

    // Limpiar
    document.getElementById("btn-limpiar").addEventListener("click", function () {
        document.getElementById("form-reporte").reset();
        document.getElementById("contenedor_morbilidad").style.display = "none";
        document.getElementById("contenedor_citas").style.display = "none";
        document.getElementById("div-filtro-tipo").style.display = "none";
        lastFilteredMorbilidad = [];
        lastFilteredCitas = [];

        if (tableMorbilidad) tableMorbilidad.clear().draw();
        if (tableCitas) tableCitas.clear().draw();
    });

    // ==================== SELECTORES MORBILIDAD ====================
    document.getElementById("select-grafica-m").addEventListener("change", function () {
        actualizarVisibilidadChartsMorbilidad();
    });

    document.getElementById("select-tipo-chart-m").addEventListener("change", function () {
        chartTypeMorbilidad = this.value;
        if (lastFilteredMorbilidad.length > 0) {
            renderChartsM(lastFilteredMorbilidad);
        }
    });

    // ==================== SELECTORES CITAS ====================
    document.getElementById("select-grafica-c").addEventListener("change", function () {
        actualizarVisibilidadChartsCitas();
    });

    document.getElementById("select-tipo-chart-c").addEventListener("change", function () {
        chartTypeCitas = this.value;
        if (lastFilteredCitas.length > 0) {
            renderChartsC(lastFilteredCitas);
        }
    });
});

// ==================== CARGA DE DATA ====================
function cargarDataMorbilidad() {
    fetch(BASE_URL + "reportes_psicologia_morbilidad_data")
        .then(r => r.json())
        .then(data => {
            if (data.exito === false) {
                Swal.fire({ icon: "error", title: "Error", text: data.mensaje });
                return;
            }
            dataMorbilidad = data;
            poblarSelectsDeMorbilidad(data);
        })
        .catch(err => {
            console.error("Error cargando morbilidad:", err);
            Swal.fire({ icon: "error", title: "Error de conexión", text: "No se pudo obtener los datos de morbilidad." });
        });
}

function cargarDataCitas() {
    fetch(BASE_URL + "reportes_psicologia_citas_data")
        .then(r => r.json())
        .then(data => {
            if (data.exito === false) {
                Swal.fire({ icon: "error", title: "Error", text: data.mensaje });
                return;
            }
            dataCitas = data;
            poblarSelectsDeCitas(data);
        })
        .catch(err => {
            console.error("Error cargando citas:", err);
            Swal.fire({ icon: "error", title: "Error de conexión", text: "No se pudo obtener los datos de citas." });
        });
}

function poblarSelectsDeMorbilidad(data) {
    if (!Array.isArray(data)) return;
    const pnfI = document.getElementById("pnf");
    const tipoI = document.getElementById("tipo");

    pnfI.innerHTML = '<option value="">Todos</option>';
    tipoI.innerHTML = '<option value="">Todos</option>';

    const pnfUnicos = [...new Set(data.map(i => i.nombre_pnf).filter(Boolean))];
    pnfUnicos.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        pnfI.appendChild(opt);
    });

    const tiposUnicos = [...new Set(data.map(i => i.tipo_consulta).filter(Boolean))];
    tiposUnicos.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        tipoI.appendChild(opt);
    });
}

function poblarSelectsDeCitas(data) {
    if (!Array.isArray(data)) return;
    const pnfI = document.getElementById("pnf");
    pnfI.innerHTML = '<option value="">Todos</option>';

    const pnfUnicos = [...new Set(data.map(i => i.nombre_pnf).filter(Boolean))];
    pnfUnicos.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        pnfI.appendChild(opt);
    });
}

// ==================== FILTROS ====================
function filtrarMorbilidad() {
    const fInicio = document.getElementById("fecha_inicio").value;
    const fFin = document.getElementById("fecha_fin").value;
    const genero = document.getElementById("genero").value;
    const pnf = document.getElementById("pnf").value;
    const tipo = document.getElementById("tipo").value;

    const filtered = dataMorbilidad.filter(item => {
        let match = true;
        if (fInicio || fFin) {
            const d = new Date(item.fecha_creacion.split(' ')[0]);
            if (fInicio && d < new Date(fInicio)) match = false;
            if (fFin && d > new Date(fFin)) match = false;
        }
        if (genero && item.genero !== genero) match = false;
        if (pnf && item.nombre_pnf !== pnf) match = false;
        if (tipo && item.tipo_consulta !== tipo) match = false;
        return match;
    });

    if (filtered.length === 0) {
        Swal.fire({ icon: "warning", title: "Sin resultados", text: "No se encontraron registros con los filtros seleccionados.", confirmButtonText: "Entendido" });
        document.getElementById("contenedor_morbilidad").style.display = "none";
        tableMorbilidad.clear().draw();
        lastFilteredMorbilidad = [];
        return;
    }

    lastFilteredMorbilidad = filtered;

    tableMorbilidad.clear();
    filtered.forEach(item => {
        const dp = item.fecha_creacion.split(' ')[0].split("-");
        const fecha = dp.length === 3 ? `${dp[2]}-${dp[1]}-${dp[0]}` : item.fecha_creacion;
        tableMorbilidad.row.add([
            fecha,
            item.nombres + " " + item.apellidos,
            item.cedula,
            item.nombre_pnf || "N/A",
            item.tipo_consulta || "N/A",
            item.diagnostico || "N/A"
        ]);
    });
    tableMorbilidad.draw();

    document.getElementById("contenedor_citas").style.display = "none";
    document.getElementById("contenedor_morbilidad").style.display = "block";

    renderChartsM(filtered);
    actualizarVisibilidadChartsMorbilidad();

    Swal.fire({
        icon: "success", title: "Reporte generado",
        text: `Se encontraron ${filtered.length} registro(s) de morbilidad.`,
        confirmButtonText: "Entendido", timer: 3000, timerProgressBar: true,
    });
}

function filtrarCitas() {
    const fInicio = document.getElementById("fecha_inicio").value;
    const fFin = document.getElementById("fecha_fin").value;
    const genero = document.getElementById("genero").value;
    const pnf = document.getElementById("pnf").value;

    const filtered = dataCitas.filter(item => {
        let match = true;
        if (fInicio || fFin) {
            const d = new Date(item.fecha_creacion.split(' ')[0]);
            if (fInicio && d < new Date(fInicio)) match = false;
            if (fFin && d > new Date(fFin)) match = false;
        }
        if (genero && item.genero !== genero) match = false;
        if (pnf && item.nombre_pnf !== pnf) match = false;
        return match;
    });

    if (filtered.length === 0) {
        Swal.fire({ icon: "warning", title: "Sin resultados", text: "No se encontraron registros con los filtros seleccionados.", confirmButtonText: "Entendido" });
        document.getElementById("contenedor_citas").style.display = "none";
        tableCitas.clear().draw();
        lastFilteredCitas = [];
        return;
    }

    lastFilteredCitas = filtered;

    tableCitas.clear();
    filtered.forEach(item => {
        const dp1 = item.fecha_creacion.split(' ')[0].split("-");
        const fechaReg = dp1.length === 3 ? `${dp1[2]}-${dp1[1]}-${dp1[0]}` : item.fecha_creacion;

        let fechaCita = "N/A";
        if (item.fecha) {
            const dp2 = item.fecha.split("-");
            fechaCita = dp2.length === 3 ? `${dp2[2]}-${dp2[1]}-${dp2[0]}` : item.fecha;
        }

        tableCitas.row.add([
            fechaReg,
            item.nombres + " " + item.apellidos,
            item.cedula,
            item.nombre_pnf || "N/A",
            fechaCita,
            item.hora || "N/A"
        ]);
    });
    tableCitas.draw();

    document.getElementById("contenedor_morbilidad").style.display = "none";
    document.getElementById("contenedor_citas").style.display = "block";

    renderChartsC(filtered);
    actualizarVisibilidadChartsCitas();

    Swal.fire({
        icon: "success", title: "Reporte generado",
        text: `Se encontraron ${filtered.length} registro(s) de citas.`,
        confirmButtonText: "Entendido", timer: 3000, timerProgressBar: true,
    });
}

// ==================== VISIBILIDAD CHARTS ====================
function actualizarVisibilidadChartsMorbilidad() {
    const sel = document.getElementById("select-grafica-m").value;
    const wG = document.getElementById("wrapper-chartGM");
    const wP = document.getElementById("wrapper-chartPM");
    const wT = document.getElementById("wrapper-chartT");

    wG.style.display = (sel === 'todos' || sel === 'genero') ? '' : 'none';
    wP.style.display = (sel === 'todos' || sel === 'pnf') ? '' : 'none';
    wT.style.display = (sel === 'todos' || sel === 'tipo') ? '' : 'none';
}

function actualizarVisibilidadChartsCitas() {
    const sel = document.getElementById("select-grafica-c").value;
    const wG = document.getElementById("wrapper-chartGC");
    const wP = document.getElementById("wrapper-chartPC");

    wG.style.display = (sel === 'todos' || sel === 'genero') ? '' : 'none';
    wP.style.display = (sel === 'todos' || sel === 'pnf') ? '' : 'none';
}

// ==================== DATATABLES ====================
function crearPdfCustomize(chartMap) {
    return function (doc) {
        doc.styles.tableHeader.fillColor = '#4e73df';
        doc.styles.tableHeader.color = 'white';

        chartMap.forEach(item => {
            const wrapper = document.getElementById(item.wrapperId);
            const canvas = document.getElementById(item.id);
            if (wrapper && canvas && wrapper.style.display !== 'none') {
                doc.content.push({
                    pageBreak: "before", text: item.title,
                    alignment: "center", margin: [0, 20, 0, 10], fontSize: 16, bold: true,
                });
                doc.content.push({
                    image: canvas.toDataURL("image/png"), width: 700,
                    alignment: "center", margin: [0, 30, 0, 20],
                });
            }
        });
    };
}

function inicializarDataTableMorbilidad() {
    const chartMap = [
        { id: "chartGM", wrapperId: "wrapper-chartGM", title: "Gráfico por Género" },
        { id: "chartPM", wrapperId: "wrapper-chartPM", title: "Gráfico por PNF" },
        { id: "chartT", wrapperId: "wrapper-chartT", title: "Gráfico por Tipo de Consulta" }
    ];

    tableMorbilidad = $("#tabla_morbilidad").DataTable({
        responsive: true, autoWidth: false, paging: true,
        lengthChange: true, searching: true, ordering: true, info: true,
        dom: "Bfrtip",
        buttons: [
            { extend: "excelHtml5", text: '<i class="far fa-file-excel"></i> Excel', title: "Reporte Psicología - Morbilidad", className: "btn btn-success btn-sm m-1" },
            { extend: "pdfHtml5", text: '<i class="fas fa-file-pdf"></i> PDF', title: "Reporte Psicología - Morbilidad", className: "btn btn-danger btn-sm m-1", orientation: "landscape", pageSize: "A4", exportOptions: { columns: ":visible" }, customize: crearPdfCustomize(chartMap) }
        ],
        language: { sEmptyTable: "No hay registros disponibles", sInfo: "Mostrando _START_ a _END_ de _TOTAL_ registros", sInfoEmpty: "Mostrando 0 a 0 de 0 registros", sInfoFiltered: "(filtrado de _MAX_ registros totales)", sLengthMenu: "Mostrar _MENU_ registros", sLoadingRecords: "Cargando...", sProcessing: "Procesando...", sSearch: "Buscar:", sZeroRecords: "No se encontraron resultados", oPaginate: { sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior" } }
    });
    tableMorbilidad.buttons().container().appendTo('#botones-exportacion-m');
}

function inicializarDataTableCitas() {
    const chartMap = [
        { id: "chartGC", wrapperId: "wrapper-chartGC", title: "Gráfico por Género" },
        { id: "chartPC", wrapperId: "wrapper-chartPC", title: "Gráfico por PNF" }
    ];

    tableCitas = $("#tabla_citas").DataTable({
        responsive: true, autoWidth: false, paging: true,
        lengthChange: true, searching: true, ordering: true, info: true,
        dom: "Bfrtip",
        buttons: [
            { extend: "excelHtml5", text: '<i class="far fa-file-excel"></i> Excel', title: "Reporte Psicología - Citas", className: "btn btn-success btn-sm m-1" },
            { extend: "pdfHtml5", text: '<i class="fas fa-file-pdf"></i> PDF', title: "Reporte Psicología - Citas", className: "btn btn-danger btn-sm m-1", orientation: "landscape", pageSize: "A4", exportOptions: { columns: ":visible" }, customize: crearPdfCustomize(chartMap) }
        ],
        language: { sEmptyTable: "No hay registros disponibles", sInfo: "Mostrando _START_ a _END_ de _TOTAL_ registros", sInfoEmpty: "Mostrando 0 a 0 de 0 registros", sInfoFiltered: "(filtrado de _MAX_ registros totales)", sLengthMenu: "Mostrar _MENU_ registros", sLoadingRecords: "Cargando...", sProcessing: "Procesando...", sSearch: "Buscar:", sZeroRecords: "No se encontraron resultados", oPaginate: { sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior" } }
    });
    tableCitas.buttons().container().appendTo('#botones-exportacion-c');
}

// ==================== CHART.JS ====================
function buildChartConfig(type, labels, dataValues, labelTitle) {
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = data.labels[tooltipItem.index] || '';
                    if (label) label += ': ';
                    label += dataValues[tooltipItem.index];
                    return label;
                }
            }
        },
        legend: { display: true, position: 'bottom' }
    };

    if (type === 'bar') {
        options.scales = { yAxes: [{ ticks: { beginAtZero: true } }] };
        options.legend.display = false;
    }

    return {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: dataValues,
                backgroundColor: bgColors.slice(0, labels.length),
                borderColor: "white",
                borderWidth: 2
            }]
        },
        options: options
    };
}

// ==================== RENDER CHARTS MORBILIDAD ====================
function renderChartsM(data) {
    const generoMap = { "M": "Masculino", "F": "Femenino" };

    // Género
    const gUnicos = [...new Set(data.map(i => i.genero).filter(Boolean))];
    const gLabels = gUnicos.length ? gUnicos.map(g => generoMap[g] || g) : ["No especificado"];
    const gValues = gUnicos.map(g => data.filter(i => i.genero === g).length);
    if (chartGM) chartGM.destroy();
    chartGM = new Chart(document.getElementById("chartGM").getContext("2d"), buildChartConfig(chartTypeMorbilidad, gLabels, gValues, "Género"));

    // PNF
    const pUnicos = [...new Set(data.map(i => i.nombre_pnf).filter(Boolean))];
    const pLabels = pUnicos.length ? pUnicos : ["No especificado"];
    const pValues = pUnicos.map(p => data.filter(i => i.nombre_pnf === p).length);
    if (chartPM) chartPM.destroy();
    chartPM = new Chart(document.getElementById("chartPM").getContext("2d"), buildChartConfig(chartTypeMorbilidad, pLabels, pValues, "PNF"));

    // Tipo de Consulta
    const tUnicos = [...new Set(data.map(i => i.tipo_consulta).filter(Boolean))];
    const tLabels = tUnicos.length ? tUnicos : ["No especificado"];
    const tValues = tUnicos.map(t => data.filter(i => i.tipo_consulta === t).length);
    if (chartT) chartT.destroy();
    chartT = new Chart(document.getElementById("chartT").getContext("2d"), buildChartConfig(chartTypeMorbilidad, tLabels, tValues, "Tipo de Consulta"));
}

// ==================== RENDER CHARTS CITAS ====================
function renderChartsC(data) {
    const generoMap = { "M": "Masculino", "F": "Femenino" };

    // Género
    const gUnicos = [...new Set(data.map(i => i.genero).filter(Boolean))];
    const gLabels = gUnicos.length ? gUnicos.map(g => generoMap[g] || g) : ["No especificado"];
    const gValues = gUnicos.map(g => data.filter(i => i.genero === g).length);
    if (chartGC) chartGC.destroy();
    chartGC = new Chart(document.getElementById("chartGC").getContext("2d"), buildChartConfig(chartTypeCitas, gLabels, gValues, "Género"));

    // PNF
    const pUnicos = [...new Set(data.map(i => i.nombre_pnf).filter(Boolean))];
    const pLabels = pUnicos.length ? pUnicos : ["No especificado"];
    const pValues = pUnicos.map(p => data.filter(i => i.nombre_pnf === p).length);
    if (chartPC) chartPC.destroy();
    chartPC = new Chart(document.getElementById("chartPC").getContext("2d"), buildChartConfig(chartTypeCitas, pLabels, pValues, "PNF"));
}
