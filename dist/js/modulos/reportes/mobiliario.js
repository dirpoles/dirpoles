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
let rawData = { mobiliario: [], equipos: [] };
let rawFiltros = { mob: {}, eq: {} };
let tables = { mob: null, eq: null };
let charts = {
    mob: { T: null, MA: null, E: null, U: null },
    eq: { T: null, MA: null, E: null, U: null }
};
let currentType = 'bar';
let lastFiltered = { mob: [], eq: [] };

//-------------------------------------------- INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
    inicializarDataTables();
    cargarData();

    // Toggle de Categoría
    document.getElementById("tipoReporte").addEventListener("change", function () {
        const cat = this.value;
        document.getElementById("divSerial").style.display = (cat === 'equipos') ? "block" : "none";
        poblarFiltrosDinamicos(cat);
        limpiarResultados();
    });

    // Evento Submit
    document.getElementById("form-reporte").addEventListener("submit", function (e) {
        e.preventDefault();
        filtrarYRenderizar();
    });

    // Evento Limpiar
    document.getElementById("btn-limpiar").addEventListener("click", () => {
        document.getElementById("form-reporte").reset();
        limpiarResultados();
        poblarFiltrosDinamicos(document.getElementById("tipoReporte").value);
    });

    // Selectores de Gráficas (Mob)
    document.getElementById("sel-grafica-mob").addEventListener("change", () => actualizarVisibilidadCharts('mob'));
    document.getElementById("sel-tipo-chart-mob").addEventListener("change", function () {
        currentType = this.value;
        if (lastFiltered.mob.length) renderCharts('mob', lastFiltered.mob);
    });

    // Selectores de Gráficas (Eq)
    document.getElementById("sel-grafica-eq").addEventListener("change", () => actualizarVisibilidadCharts('eq'));
    document.getElementById("sel-tipo-chart-eq").addEventListener("change", function () {
        currentType = this.value;
        if (lastFiltered.eq.length) renderCharts('eq', lastFiltered.eq);
    });
});

function limpiarResultados() {
    document.getElementById("contenedor_mob").style.display = "none";
    document.getElementById("contenedor_equipos").style.display = "none";
    if (tables.mob) tables.mob.clear().draw();
    if (tables.eq) tables.eq.clear().draw();
}

//-------------------------------------------- CARGA DE DATA
function cargarData() {
    fetch(BASE_URL + "reportes_mobiliario_data")
        .then(r => r.json())
        .then(data => {
            if (data.exito === false) throw new Error(data.mensaje);

            rawData.mobiliario = data.mobiliario || [];
            rawData.equipos = data.equipos || [];
            rawFiltros.mob = data.filtrosMob || {};
            rawFiltros.eq = data.filtrosEq || {};

            poblarFiltrosDinamicos('mobiliario');
        })
        .catch(err => {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la data del inventario.' });
        });
}

function poblarFiltrosDinamicos(cat) {
    const f = (cat === 'mobiliario') ? rawFiltros.mob : rawFiltros.eq;

    // Poblar Tipo
    const selTipo = document.getElementById("tipo");
    selTipo.innerHTML = '<option value="">Todos</option>';
    const tipos = (cat === 'mobiliario') ? f.tipoMob : f.tipoE;
    if (tipos) tipos.forEach(t => {
        const o = document.createElement("option"); o.value = t.nombre; o.textContent = t.nombre; selTipo.appendChild(o);
    });

    // Poblar Ubicación (Servicios)
    const selUbi = document.getElementById("ubicacion");
    selUbi.innerHTML = '<option value="">Todas</option>';
    if (f.servicio) f.servicio.forEach(s => {
        const o = document.createElement("option"); o.value = s.nombre_serv; o.textContent = s.nombre_serv; selUbi.appendChild(o);
    });

    // Poblar Marca
    const selMarca = document.getElementById("marca");
    selMarca.innerHTML = '<option value="">Todas</option>';
    if (f.marca) f.marca.forEach(m => {
        if (m.marca) { const o = document.createElement("option"); o.value = m.marca; o.textContent = m.marca; selMarca.appendChild(o); }
    });

    // Poblar Modelo
    const selModel = document.getElementById("modelo");
    selModel.innerHTML = '<option value="">Todos</option>';
    if (f.modelo) f.modelo.forEach(m => {
        if (m.modelo) { const o = document.createElement("option"); o.value = m.modelo; o.textContent = m.modelo; selModel.appendChild(o); }
    });

    // Poblar Serial (Solo Equipos)
    if (cat === 'equipos') {
        const selSerial = document.getElementById("serial");
        selSerial.innerHTML = '<option value="">Todos</option>';
        if (f.serial) f.serial.forEach(s => {
            if (s.serial) { const o = document.createElement("option"); o.value = s.serial; o.textContent = s.serial; selSerial.appendChild(o); }
        });
    }
}

//-------------------------------------------- FILTRADO Y RENDER
function filtrarYRenderizar() {
    const cat = document.getElementById("tipoReporte").value;
    const fI = document.getElementById("fecha_inicio").value;
    const fF = document.getElementById("fecha_fin").value;
    const tip = document.getElementById("tipo").value;
    const ubi = document.getElementById("ubicacion").value;
    const mar = document.getElementById("marca").value;
    const mod = document.getElementById("modelo").value;
    const est = document.getElementById("estado").value;
    const ser = document.getElementById("serial").value;

    const dataSet = (cat === 'mobiliario') ? rawData.mobiliario : rawData.equipos;

    const filtered = dataSet.filter(i => {
        if (fI && new Date(i.fecha_adquisicion) < new Date(fI)) return false;
        if (fF && new Date(i.fecha_adquisicion) > new Date(fF)) return false;
        if (tip && i.nombre !== tip) return false;
        if (ubi && i.nombre_serv !== ubi) return false;
        if (mar && i.marca !== mar) return false;
        if (mod && i.modelo !== mod) return false;
        if (est && i.estado !== est) return false;
        if (cat === 'equipos' && ser && i.serial !== ser) return false;
        return true;
    });

    if (filtered.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Sin resultados', text: 'No se encontraron registros con esos filtros.' });
        limpiarResultados();
        return;
    }

    limpiarResultados();
    lastFiltered[cat === 'mobiliario' ? 'mob' : 'eq'] = filtered;
    const contId = (cat === 'mobiliario') ? "contenedor_mob" : "contenedor_equipos";
    document.getElementById(contId).style.display = "block";

    Swal.fire({
        icon: 'success', title: 'Éxito', text: `Se encontraron ${filtered.length} registros.`,
        timer: 2000, timerProgressBar: true, confirmButtonColor: '#4e73df'
    });

    if (cat === 'mobiliario') renderMob(filtered);
    else renderEq(filtered);
}

function renderMob(data) {
    tables.mob.clear();
    data.forEach(i => {
        tables.mob.row.add([
            formatFecha(i.fecha_adquisicion), i.nombre, `${i.marca} / ${i.modelo}`, i.color, i.estado, i.nombre_serv
        ]);
    });
    tables.mob.draw();
    renderCharts('mob', data);
}

function renderEq(data) {
    tables.eq.clear();
    data.forEach(i => {
        tables.eq.row.add([
            formatFecha(i.fecha_adquisicion), i.nombre, `${i.marca} / ${i.modelo}`, i.serial || 'N/A', i.estado, i.nombre_serv
        ]);
    });
    tables.eq.draw();
    renderCharts('eq', data);
}

function renderCharts(cat, data) {
    const c = charts[cat];
    const prefix = cat === 'mob' ? 'M' : 'E';
    const config = (t, l, v) => buildConfig(currentType, l, v, t);

    const dT = countBy(data, 'nombre');
    const dMA = countBy(data, 'marca');
    const dE = countBy(data, 'estado');
    const dU = countBy(data, 'nombre_serv');

    Object.keys(c).forEach(k => { if (c[k]) c[k].destroy(); });

    c.T = new Chart(document.getElementById(`chart${prefix}T`).getContext("2d"), config("Tipo", dT.labels, dT.values));
    c.MA = new Chart(document.getElementById(`chart${prefix}MA`).getContext("2d"), config("Marca", dMA.labels, dMA.values));
    c.E = new Chart(document.getElementById(`chart${prefix}E`).getContext("2d"), config("Estado", dE.labels, dE.values));
    c.U = new Chart(document.getElementById(`chart${prefix}U`).getContext("2d"), config("Ubicación", dU.labels, dU.values));
}

//-------------------------------------------- HELPERS
function countBy(data, field) {
    const count = {};
    data.forEach(i => {
        let val = i[field] || 'N/E';
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
        config.options.scales = { yAxes: [{ ticks: { beginAtZero: true, precision: 0, callback: v => (v % 1 === 0) ? v : '' } }] };
        config.options.legend.display = false;
    }
    return config;
}

function formatFecha(f) {
    if (!f) return 'N/A';
    const parts = f.split(" ")[0].split("-");
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : f;
}

function actualizarVisibilidadCharts(cat) {
    const selId = cat === 'mob' ? 'sel-grafica-mob' : 'sel-grafica-eq';
    const wrapCls = cat === 'mob' ? 'wrapper-chart-mob' : 'wrapper-chart-eq';
    const prefix = cat === 'mob' ? 'M' : 'E';

    const v = document.getElementById(selId).value;
    document.querySelectorAll(`.${wrapCls}`).forEach(el => el.style.display = "none");

    if (v === "todos") document.querySelectorAll(`.${wrapCls}`).forEach(el => el.style.display = "");
    else if (v === "tipo") document.getElementById(`w-chart${prefix}T`).style.display = "";
    else if (v === "marca") document.getElementById(`w-chart${prefix}MA`).style.display = "";
    else if (v === "estado") document.getElementById(`w-chart${prefix}E`).style.display = "";
    else if (v === "ubicacion") document.getElementById(`w-chart${prefix}U`).style.display = "";
}

function inicializarDataTables() {
    const buildDT = (id, title, chartsList, btnId) => {
        const dt = $(id).DataTable({
            responsive: true, language: langES, dom: 'Bfrtip',
            buttons: [
                { extend: 'excelHtml5', text: '<i class="fas fa-file-excel"></i> Excel', title: title, className: 'btn btn-success btn-sm' },
                {
                    extend: 'pdfHtml5', text: '<i class="fas fa-file-pdf"></i> PDF', title: title, className: 'btn btn-danger btn-sm',
                    orientation: 'landscape', pageSize: 'A4',
                    customize: function (doc) {
                        doc.styles.tableHeader.fillColor = '#4e73df';
                        doc.styles.tableHeader.color = 'white';
                        chartsList.forEach(c => {
                            const canvas = document.getElementById(c.id);
                            const wrap = document.getElementById(c.wrap);
                            if (canvas && wrap.style.display !== 'none') {
                                doc.content.push({ pageBreak: 'before', text: 'Gráfica: ' + c.t, alignment: 'center', margin: [0, 20, 0, 10], fontSize: 16, bold: true });
                                doc.content.push({ image: canvas.toDataURL("image/png"), width: 700, alignment: 'center' });
                            }
                        });
                    }
                }
            ]
        });
        dt.buttons().container().appendTo(btnId);
        return dt;
    };

    tables.mob = buildDT('#tabla_mob', 'Reporte Mobiliario', [
        { id: 'chartMT', wrap: 'w-chartMT', t: 'Por Tipo' },
        { id: 'chartMMA', wrap: 'w-chartMMA', t: 'Por Marca' },
        { id: 'chartME', wrap: 'w-chartME', t: 'Por Estado' },
        { id: 'chartMU', wrap: 'w-chartMU', t: 'Por Ubicación' }
    ], '#btn-exp-mob');

    tables.eq = buildDT('#tabla_equipos', 'Reporte Equipos', [
        { id: 'chartET', wrap: 'w-chartET', t: 'Por Tipo' },
        { id: 'chartEMA', wrap: 'w-chartEMA', t: 'Por Marca' },
        { id: 'chartEE', wrap: 'w-chartEE', t: 'Por Estado' },
        { id: 'chartEU', wrap: 'w-chartEU', t: 'Por Ubicación' }
    ], '#btn-exp-equipos');
}
