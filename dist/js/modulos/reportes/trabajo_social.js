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
              element: "#fecha_iniciod",
              popover: {
                title: "Fecha Inicio",
                description: "Seleccione la fecha inicial para filtrar el reporte.",
                align: "center",
              },
            },
            {
              element: "#fecha_find",
              popover: {
                title: "Fecha Fin",
                description: "Seleccione la fecha final para filtrar el reporte.",
                align: "center",
              },
            },
            {
              element: "#tipoReported",
              popover: {
                title: "Tipo de Reporte",
                description: "Seleccione el tipo de reporte que desea generar.",
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
//-------------------------------------------- CONSTANTES Y CONFIGURACIÓN
const hoy = new Date();
const fechaActual = hoy.toISOString().split("T")[0];

document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
document.getElementById("fecha_fin").setAttribute("max", fechaActual);

const bancoMap = {
    "0102": "BANCO DE VENEZUELA", "0156": "100% BANCO", "0172": "BANCAMIGA", "0114": "BANCARIBE",
    "0171": "BANCO ACTIVO", "0166": "BANCO AGRICOLA", "0175": "BANCO BICENTENARIO", "0128": "BANCO CARONI",
    "0163": "BANCO DEL TESORO", "0115": "BANCO EXTERIOR", "0151": "BANCO FONDO COMUN", "0105": "BANCO MERCANTIL",
    "0191": "BANCO NACIONAL DE CREDITO", "0138": "BANCO PLAZA", "0137": "BANCO SOFITASA", "0104": "VENEZOLANO DE CREDITO",
    "0168": "BANCRECER", "0134": "BANESCO", "0177": "BANFANB", "0146": "BANGENTE", "0174": "BANPLUS",
    "0108": "BBVA PROVINCIAL", "0157": "DELSUR", "0169": "MI BANCO", "0178": "N58 BANCO DIGITAL"
};

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

// Variables globales para data y tablas
let dataBecas = [], dataEx = [], dataFames = [], dataEmb = [];
let lastFilteredBecas = [], lastFilteredEx = [], lastFilteredFames = [], lastFilteredEmb = [];
let tableBecas, tableEx, tableFames, tableEmb;

// Charts
let charts = {
    becas: { G: null, Pnf: null, B: null },
    ex: { G: null, P: null, D: null },
    fames: { G: null, P: null, PT: null, TA: null },
    emb: { P: null, PT: null, E: null }
};

let chartTypes = { becas: 'bar', ex: 'bar', fames: 'bar', emb: 'bar' };

//-------------------------------------------- INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
    inicializarDataTables();

    // Evento selector tipo reporte
    document.getElementById("tipoReporte").addEventListener("change", function () {
        const tipo = this.value;

        // Limpiar contenedores y filtros
        document.querySelectorAll(".contenedor-resultado").forEach(el => el.style.display = "none");
        document.querySelectorAll(".filtro-general, .filtro-becas, .filtro-exoneracion, .filtro-fames, .filtro-embarazo").forEach(el => el.style.display = "none");

        if (!tipo) return;

        // Mostrar filtros comunes
        document.querySelectorAll(".filtro-general").forEach(el => el.style.display = "");

        // Mostrar filtros específicos y cargar data
        if (tipo === "becas") {
            document.querySelectorAll(".filtro-becas").forEach(el => el.style.display = "");
            cargarData("becas");
        } else if (tipo === "exoneracion") {
            document.querySelectorAll(".filtro-exoneracion").forEach(el => el.style.display = "");
            cargarData("exoneracion");
        } else if (tipo === "fames") {
            document.querySelectorAll(".filtro-fames").forEach(el => el.style.display = "");
            cargarData("fames");
        } else if (tipo === "embarazo") {
            document.querySelectorAll(".filtro-embarazo").forEach(el => el.style.display = "");
            cargarData("embarazo");
        }
    });

    // Submit
    document.getElementById("form-reporte").addEventListener("submit", function (e) {
        e.preventDefault();
        const tipo = document.getElementById("tipoReporte").value;
        if (!tipo) {
            Swal.fire({ icon: 'warning', title: 'Atención', text: 'Seleccione un tipo de reporte.' });
            return;
        }

        if (!validarFechas()) return;

        if (tipo === "becas") filtrarBecas();
        else if (tipo === "exoneracion") filtrarExoneracion();
        else if (tipo === "fames") filtrarFames();
        else if (tipo === "embarazo") filtrarEmbarazo();
    });

    // Limpiar
    document.getElementById("btn-limpiar").addEventListener("click", () => {
        document.getElementById("form-reporte").reset();
        document.querySelectorAll(".contenedor-resultado").forEach(el => el.style.display = "none");
        document.querySelectorAll(".filtro-general, .filtro-becas, .filtro-exoneracion, .filtro-fames, .filtro-embarazo").forEach(el => el.style.display = "none");
    });

    // Selectores de visibilidad de gráficas
    configurarSelectoresGraficas();
});

//-------------------------------------------- CARGA DE DATA
function cargarData(tipo) {
    const endpoint = {
        becas: "reportes_becas_data",
        exoneracion: "reportes_exoneracion_data",
        fames: "reportes_fames_data",
        embarazo: "reportes_embarazo_data"
    }[tipo];

    fetch(BASE_URL + endpoint)
        .then(r => r.json())
        .then(data => {
            if (!data) throw new Error("No se recibió información del servidor.");
            if (data.exito === false) throw new Error(data.mensaje);

            if (tipo === "becas") { dataBecas = data; poblarSelectsBecas(data); }
            else if (tipo === "exoneracion") { dataEx = data; poblarSelectsEx(data); }
            else if (tipo === "fames") { dataFames = data; poblarSelectsFames(data); }
            else if (tipo === "embarazo") { dataEmb = data; poblarSelectsEmb(data); }
        })
        .catch(err => {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la información.' });
        });
}

//-------------------------------------------- POBLAR SELECTS
function poblarSelectsComunes(data) {
    const pnfSel = document.getElementById("pnf");
    const currentVal = pnfSel.value;
    pnfSel.innerHTML = '<option value="">Todos</option>';
    const pnfs = [...new Set(data.map(i => i.nombre_pnf).filter(Boolean))];
    pnfs.forEach(p => {
        const opt = document.createElement("option"); opt.value = p; opt.textContent = p; pnfSel.appendChild(opt);
    });
    pnfSel.value = currentVal;
}

function poblarSelectsBecas(data) {
    poblarSelectsComunes(data);
    const bancoSel = document.getElementById("banco");
    bancoSel.innerHTML = '<option value="">Todos</option>';
    const bancos = [...new Set(data.map(i => i.tipo_banco).filter(Boolean))];
    bancos.forEach(b => {
        const opt = document.createElement("option"); opt.value = b; opt.textContent = bancoMap[b] || b; bancoSel.appendChild(opt);
    });
}

function poblarSelectsEx(data) {
    poblarSelectsComunes(data);
}

function poblarSelectsFames(data) {
    poblarSelectsComunes(data);
    const patSel = document.getElementById("patologia");
    patSel.innerHTML = '<option value="">Todos</option>';
    const pats = [...new Set(data.map(i => i.nombre_patologia).filter(Boolean))];
    pats.forEach(p => {
        const opt = document.createElement("option"); opt.value = p; opt.textContent = p; patSel.appendChild(opt);
    });
}

function poblarSelectsEmb(data) {
    poblarSelectsComunes(data);
    const patSel = document.getElementById("patologia");
    const currentPat = patSel.value;
    patSel.innerHTML = '<option value="">Todos</option>';
    const pats = [...new Set(data.map(i => i.nombre_patologia).filter(Boolean))];
    pats.forEach(p => {
        const opt = document.createElement("option"); opt.value = p; opt.textContent = p; patSel.appendChild(opt);
    });
    patSel.value = currentPat;
}

//-------------------------------------------- FILTRADO
function filtrarBecas() {
    const fI = document.getElementById("fecha_inicio").value;
    const fF = document.getElementById("fecha_fin").value;
    const pnf = document.getElementById("pnf").value;
    const gen = document.getElementById("genero").value;
    const ban = document.getElementById("banco").value;

    const filtered = dataBecas.filter(i => {
        if (fI && new Date(i.fecha_creacion) < new Date(fI)) return false;
        if (fF && new Date(i.fecha_creacion) > new Date(fF)) return false;
        if (pnf && i.nombre_pnf !== pnf) return false;
        if (gen && i.genero !== gen) return false;
        if (ban && i.tipo_banco !== ban) return false;
        return true;
    });

    if (mostrarResultado(filtered, "becas", tableBecas)) {
        lastFilteredBecas = filtered;
        tableBecas.clear();
        filtered.forEach(i => {
            tableBecas.row.add([
                formatFecha(i.fecha_creacion), i.nombres + " " + i.apellidos, i.cedula, i.nombre_pnf || 'N/A', bancoMap[i.tipo_banco] || i.tipo_banco || 'N/A', i.num_cuenta || 'N/A'
            ]);
        });
        tableBecas.draw();
        renderChartsBecas(filtered);
    }
}

function filtrarExoneracion() {
    const fI = document.getElementById("fecha_inicio").value;
    const fF = document.getElementById("fecha_fin").value;
    const pnf = document.getElementById("pnf").value;
    const gen = document.getElementById("genero").value;
    const disc = document.getElementById("discapacidad").value;

    const filtered = dataEx.filter(i => {
        if (fI && new Date(i.fecha_creacion) < new Date(fI)) return false;
        if (fF && new Date(i.fecha_creacion) > new Date(fF)) return false;
        if (pnf && i.nombre_pnf !== pnf) return false;
        if (gen && i.genero !== gen) return false;
        if (disc && i.discapacidad !== disc) return false;
        return true;
    });

    if (mostrarResultado(filtered, "exoneracion", tableEx)) {
        lastFilteredEx = filtered;
        tableEx.clear();
        filtered.forEach(i => {
            tableEx.row.add([
                formatFecha(i.fecha_creacion), i.nombres + " " + i.apellidos, i.cedula, i.nombre_pnf || 'N/A', i.motivo_exoneracion || 'N/A', i.discapacidad === 'si' ? 'Si' : 'No'
            ]);
        });
        tableEx.draw();
        renderChartsEx(filtered);
    }
}

function filtrarFames() {
    const fI = document.getElementById("fecha_inicio").value;
    const fF = document.getElementById("fecha_fin").value;
    const pnf = document.getElementById("pnf").value;
    const gen = document.getElementById("genero").value;
    const pat = document.getElementById("patologia").value;
    const ayu = document.getElementById("tipoAyuda").value;

    const filtered = dataFames.filter(i => {
        if (fI && new Date(i.fecha_creacion) < new Date(fI)) return false;
        if (fF && new Date(i.fecha_creacion) > new Date(fF)) return false;
        if (pnf && i.nombre_pnf !== pnf) return false;
        if (gen && i.genero !== gen) return false;
        if (pat && i.nombre_patologia !== pat) return false;
        if (ayu && i.tipo_ayuda !== ayu) return false;
        return true;
    });

    if (mostrarResultado(filtered, "fames", tableFames)) {
        lastFilteredFames = filtered;
        tableFames.clear();
        filtered.forEach(i => {
            tableFames.row.add([
                formatFecha(i.fecha_creacion), i.nombres + " " + i.apellidos, i.cedula, i.nombre_pnf || 'N/A', i.nombre_patologia || 'N/A', i.tipo_ayuda || 'N/A', i.otros || 'N/A'
            ]);
        });
        tableFames.draw();
        renderChartsFames(filtered);
    }
}

function filtrarEmbarazo() {
    const fI = document.getElementById("fecha_inicio").value;
    const fF = document.getElementById("fecha_fin").value;
    const pnf = document.getElementById("pnf").value;
    const gen = document.getElementById("genero").value;
    const pat = document.getElementById("patologia").value;
    const est = document.getElementById("estado").value;

    const filtered = dataEmb.filter(i => {
        if (fI && new Date(i.fecha_creacion) < new Date(fI)) return false;
        if (fF && new Date(i.fecha_creacion) > new Date(fF)) return false;
        if (pnf && i.nombre_pnf !== pnf) return false;
        if (gen && i.genero !== gen) return false;
        if (pat && i.nombre_patologia !== pat) return false;
        if (est && i.estado !== est) return false;
        return true;
    });

    if (mostrarResultado(filtered, "emb", tableEmb)) {
        lastFilteredEmb = filtered;
        tableEmb.clear();
        filtered.forEach(i => {
            tableEmb.row.add([
                formatFecha(i.fecha_creacion), i.nombres + " " + i.apellidos, i.cedula, i.nombre_pnf || 'N/A', i.nombre_patologia || 'N/A', i.semana_gestacion || 'N/A', i.codigo_cp || 'N/A', i.serial_cp || 'N/A', i.num_telefono || 'N/A'
            ]);
        });
        tableEmb.draw();
        renderChartsEmb(filtered);
    }
}

//-------------------------------------------- GRAFICAS RENDER
function renderChartsBecas(data) {
    const gCtx = document.getElementById("chartBG").getContext("2d");
    const pCtx = document.getElementById("chartBPnf").getContext("2d");
    const bCtx = document.getElementById("chartBB").getContext("2d");

    const gData = countBy(data, 'genero', { 'M': 'Masculino', 'F': 'Femenino' });
    const pData = countBy(data, 'nombre_pnf');
    const bData = countBy(data, 'tipo_banco', bancoMap);

    if (charts.becas.G) charts.becas.G.destroy();
    if (charts.becas.Pnf) charts.becas.Pnf.destroy();
    if (charts.becas.B) charts.becas.B.destroy();

    charts.becas.G = new Chart(gCtx, buildConfig(chartTypes.becas, gData.labels, gData.values, "Por Género"));
    charts.becas.Pnf = new Chart(pCtx, buildConfig(chartTypes.becas, pData.labels, pData.values, "Por PNF"));
    charts.becas.B = new Chart(bCtx, buildConfig(chartTypes.becas, bData.labels, bData.values, "Por Banco"));
}

function renderChartsEx(data) {
    const gCtx = document.getElementById("chartEG").getContext("2d");
    const pCtx = document.getElementById("chartEP").getContext("2d");
    const dCtx = document.getElementById("chartED").getContext("2d");

    const gData = countBy(data, 'genero', { 'M': 'Masculino', 'F': 'Femenino' });
    const pData = countBy(data, 'nombre_pnf');
    const dData = countBy(data, 'discapacidad', { 'si': 'Si', 'no': 'No' });

    if (charts.ex.G) charts.ex.G.destroy();
    if (charts.ex.P) charts.ex.P.destroy();
    if (charts.ex.D) charts.ex.D.destroy();

    charts.ex.G = new Chart(gCtx, buildConfig(chartTypes.ex, gData.labels, gData.values, "Por Género"));
    charts.ex.P = new Chart(pCtx, buildConfig(chartTypes.ex, pData.labels, pData.values, "Por PNF"));
    charts.ex.D = new Chart(dCtx, buildConfig(chartTypes.ex, dData.labels, dData.values, "Por Discapacidad"));
}

function renderChartsFames(data) {
    const gData = countBy(data, 'genero', { 'M': 'Masculino', 'F': 'Femenino' });
    const pData = countBy(data, 'nombre_pnf');
    const ptData = countBy(data, 'nombre_patologia');
    const taData = countBy(data, 'tipo_ayuda');

    if (charts.fames.G) charts.fames.G.destroy();
    if (charts.fames.P) charts.fames.P.destroy();
    if (charts.fames.PT) charts.fames.PT.destroy();
    if (charts.fames.TA) charts.fames.TA.destroy();

    charts.fames.G = new Chart(document.getElementById("chartFG").getContext("2d"), buildConfig(chartTypes.fames, gData.labels, gData.values, "Por Género"));
    charts.fames.P = new Chart(document.getElementById("chartFP").getContext("2d"), buildConfig(chartTypes.fames, pData.labels, pData.values, "Por PNF"));
    charts.fames.PT = new Chart(document.getElementById("chartFPT").getContext("2d"), buildConfig(chartTypes.fames, ptData.labels, ptData.values, "Por Patología"));
    charts.fames.TA = new Chart(document.getElementById("chartFTA").getContext("2d"), buildConfig(chartTypes.fames, taData.labels, taData.values, "Por Tipo de Ayuda"));
}

function renderChartsEmb(data) {
    const pData = countBy(data, 'nombre_pnf');
    const ptData = countBy(data, 'nombre_patologia');
    const eData = countBy(data, 'estado');

    if (charts.emb.P) charts.emb.P.destroy();
    if (charts.emb.PT) charts.emb.PT.destroy();
    if (charts.emb.E) charts.emb.E.destroy();

    charts.emb.P = new Chart(document.getElementById("chartEmbP").getContext("2d"), buildConfig(chartTypes.emb, pData.labels, pData.values, "Por PNF"));
    charts.emb.PT = new Chart(document.getElementById("chartEmbPT").getContext("2d"), buildConfig(chartTypes.emb, ptData.labels, ptData.values, "Por Patología"));
    charts.emb.E = new Chart(document.getElementById("chartEmbE").getContext("2d"), buildConfig(chartTypes.emb, eData.labels, eData.values, "Por Estado"));
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
    const parts = f.split("-");
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : f;
}

function validarFechas() {
    const fI = document.getElementById("fecha_inicio").value;
    const fF = document.getElementById("fecha_fin").value;
    if (fI && new Date(fI) > new Date(fechaActual)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'La fecha de inicio no puede ser futura.' });
        return false;
    }
    if (fF && new Date(fF) > new Date(fechaActual)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'La fecha fin no puede ser futura.' });
        return false;
    }
    return true;
}

function mostrarResultado(filtered, contenedorId, table) {
    if (filtered.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Sin resultados', text: 'No se encontraron registros.' });
        document.getElementById(`contenedor_${contenedorId}`).style.display = "none";
        table.clear().draw();
        return false;
    }
    document.querySelectorAll(".contenedor-resultado").forEach(el => el.style.display = "none");
    document.getElementById(`contenedor_${contenedorId}`).style.display = "block";
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Se encontraron ${filtered.length} registros.`,
        timer: 3000,
        timerProgressBar: true,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#4e73df'
    });
    return true;
}

//-------------------------------------------- DATATABLES Y PDF
function inicializarDataTables() {
    const becasCharts = [
        { id: "chartBG", wrapper: "wrapper-chartBG", title: "Por Género" },
        { id: "chartBPnf", wrapper: "wrapper-chartBPnf", title: "Por PNF" },
        { id: "chartBB", wrapper: "wrapper-chartBB", title: "Por Banco" }
    ];
    tableBecas = $("#tabla_becas").DataTable({
        responsive: true, language: langES, dom: 'Bfrtip',
        buttons: getButtons("Becas", becasCharts)
    });
    tableBecas.buttons().container().appendTo('#btn-exp-becas');

    const exCharts = [
        { id: "chartEG", wrapper: "wrapper-chartEG", title: "Por Género" },
        { id: "chartEP", wrapper: "wrapper-chartEP", title: "Por PNF" },
        { id: "chartED", wrapper: "wrapper-chartED", title: "Por Discapacidad" }
    ];
    tableEx = $("#tabla_exoneracion").DataTable({
        responsive: true, language: langES, dom: 'Bfrtip',
        buttons: getButtons("Exoneración", exCharts)
    });
    tableEx.buttons().container().appendTo('#btn-exp-ex');

    const famesCharts = [
        { id: "chartFG", wrapper: "wrapper-chartFG", title: "Por Género" },
        { id: "chartFP", wrapper: "wrapper-chartFP", title: "Por PNF" },
        { id: "chartFPT", wrapper: "wrapper-chartFPT", title: "Por Patología" },
        { id: "chartFTA", wrapper: "wrapper-chartFTA", title: "Por Tipo Ayuda" }
    ];
    tableFames = $("#tabla_fames").DataTable({
        responsive: true, language: langES, dom: 'Bfrtip',
        buttons: getButtons("FAMES", famesCharts)
    });
    tableFames.buttons().container().appendTo('#btn-exp-fames');

    const embCharts = [
        { id: "chartEmbP", wrapper: "wrapper-chartEmbP", title: "Por PNF" },
        { id: "chartEmbPT", wrapper: "wrapper-chartEmbPT", title: "Por Patología" },
        { id: "chartEmbE", wrapper: "wrapper-chartEmbE", title: "Por Estado" }
    ];
    tableEmb = $("#tabla_emb").DataTable({
        responsive: true, language: langES, dom: 'Bfrtip',
        buttons: getButtons("Gestión Embarazo", embCharts)
    });
    tableEmb.buttons().container().appendTo('#btn-exp-emb');
}

function getButtons(title, chartList) {
    return [
        { extend: 'excelHtml5', text: '<i class="fas fa-file-excel"></i> Excel', title: 'Reporte ' + title, className: 'btn btn-success btn-sm' },
        {
            extend: 'pdfHtml5', text: '<i class="fas fa-file-pdf"></i> PDF', title: 'Reporte ' + title, className: 'btn btn-danger btn-sm',
            orientation: 'landscape', pageSize: 'A4',
            customize: function (doc) {
                doc.styles.tableHeader.fillColor = '#4e73df';
                doc.styles.tableHeader.color = 'white';
                chartList.forEach(c => {
                    const canvas = document.getElementById(c.id);
                    const wrapper = document.getElementById(c.wrapper);
                    if (canvas && wrapper.style.display !== 'none') {
                        doc.content.push({ pageBreak: 'before', text: 'Gráfica: ' + c.title, alignment: 'center', margin: [0, 20, 0, 10], fontSize: 16, bold: true });
                        doc.content.push({ image: canvas.toDataURL("image/png"), width: 700, alignment: 'center' });
                    }
                });
            }
        }
    ];
}

function configurarSelectoresGraficas() {
    // Becas
    document.getElementById("select-grafica-becas").addEventListener("change", function () {
        const v = this.value;
        document.querySelectorAll(".wrapper-chart-becas").forEach(el => el.style.display = "none");
        if (v === "todos") document.querySelectorAll(".wrapper-chart-becas").forEach(el => el.style.display = "");
        else if (v === "genero") document.getElementById("wrapper-chartBG").style.display = "";
        else if (v === "pnf") document.getElementById("wrapper-chartBPnf").style.display = "";
        else if (v === "banco") document.getElementById("wrapper-chartBB").style.display = "";
    });
    document.getElementById("select-tipo-chart-becas").addEventListener("change", function () {
        chartTypes.becas = this.value; if (lastFilteredBecas.length) renderChartsBecas(lastFilteredBecas);
    });

    // Exoneracion
    document.getElementById("select-grafica-ex").addEventListener("change", function () {
        const v = this.value;
        document.querySelectorAll(".wrapper-chart-ex").forEach(el => el.style.display = "none");
        if (v === "todos") document.querySelectorAll(".wrapper-chart-ex").forEach(el => el.style.display = "");
        else if (v === "genero") document.getElementById("wrapper-chartEG").style.display = "";
        else if (v === "pnf") document.getElementById("wrapper-chartEP").style.display = "";
        else if (v === "discapacidad") document.getElementById("wrapper-chartED").style.display = "";
    });
    document.getElementById("select-tipo-chart-ex").addEventListener("change", function () {
        chartTypes.ex = this.value; if (lastFilteredEx.length) renderChartsEx(lastFilteredEx);
    });

    // FAMES
    document.getElementById("select-grafica-fames").addEventListener("change", function () {
        const v = this.value;
        document.querySelectorAll(".wrapper-chart-fames").forEach(el => el.style.display = "none");
        if (v === "todos") document.querySelectorAll(".wrapper-chart-fames").forEach(el => el.style.display = "");
        else if (v === "genero") document.getElementById("wrapper-chartFG").style.display = "";
        else if (v === "pnf") document.getElementById("wrapper-chartFP").style.display = "";
        else if (v === "patologia") document.getElementById("wrapper-chartFPT").style.display = "";
        else if (v === "ayuda") document.getElementById("wrapper-chartFTA").style.display = "";
    });
    document.getElementById("select-tipo-chart-fames").addEventListener("change", function () {
        chartTypes.fames = this.value; if (lastFilteredFames.length) renderChartsFames(lastFilteredFames);
    });

    // Embarazo
    document.getElementById("select-grafica-emb").addEventListener("change", function () {
        const v = this.value;
        document.querySelectorAll(".wrapper-chart-emb").forEach(el => el.style.display = "none");
        if (v === "todos") document.querySelectorAll(".wrapper-chart-emb").forEach(el => el.style.display = "");
        else if (v === "pnf") document.getElementById("wrapper-chartEmbP").style.display = "";
        else if (v === "patologia") document.getElementById("wrapper-chartEmbPT").style.display = "";
        else if (v === "estado") document.getElementById("wrapper-chartEmbE").style.display = "";
    });
    document.getElementById("select-tipo-chart-emb").addEventListener("change", function () {
        chartTypes.emb = this.value; if (lastFilteredEmb.length) renderChartsEmb(lastFilteredEmb);
    });
}
