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
            // Filtros principales
            {
              element: "#fecha_iniciod",
              popover: {
                title: "Fecha de Inicio",
                description:
                  "Selecciona la fecha desde la cual deseas generar el reporte.",
                align: "center",
              },
            },
            {
              element: "#fecha_find",
              popover: {
                title: "Fecha de Fin",
                description:
                  "Selecciona la fecha hasta la cual deseas generar el reporte.",
                align: "center",
              },
            },
            {
              element: "#tipo_reported",
              popover: {
                title: "Tipo de Reporte",
                description:
                  "Elige el tipo de reporte que deseas generar: Morbilidad o Inventario.",
                align: "center",
              },
            },
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
  if (input.value && new Date(input.value) > new Date(fechaActual))
    return false;
  return true;
}

// Variables globales
let tableMed, tableInv;
let dataMorbilidad = [],
  dataInventario = [];
let lastFilteredMed = [],
  lastFilteredInv = [];

// Charts Morbilidad
let chartG = null,
  chartP = null,
  chartTS = null;
// Charts Inventario
let chartE = null,
  chartTI = null,
  chartPRE = null;

let chartTypeMed = "bar";
let chartTypeInv = "bar";

const bgColors = [
  "rgba(78, 115, 223, 0.8)",
  "rgba(28, 200, 138, 0.8)",
  "rgba(54, 185, 204, 0.8)",
  "rgba(246, 194, 62, 0.8)",
  "rgba(231, 74, 59, 0.8)",
  "rgba(133, 135, 150, 0.8)",
  "rgba(90, 92, 105, 0.8)",
  "rgba(255, 128, 66, 0.8)",
  "rgba(102, 16, 242, 0.8)",
  "rgba(253, 126, 20, 0.8)",
  "rgba(32, 201, 151, 0.8)",
  "rgba(111, 66, 193, 0.8)",
];

document.addEventListener("DOMContentLoaded", () => {
  inicializarDTMedicina();
  inicializarDTInventario();

  // Cambio de tipo de reporte
  document
    .getElementById("tipo_reporte")
    .addEventListener("change", function () {
      const tipo = this.value;
      document.getElementById("contenedor_medicina").style.display = "none";
      document.getElementById("contenedor_inventario").style.display = "none";

      // Toggle filtros
      document
        .querySelectorAll(".filtro-morb")
        .forEach(
          (el) => (el.style.display = tipo === "morbilidad" ? "" : "none"),
        );
      document
        .querySelectorAll(".filtro-inv")
        .forEach(
          (el) => (el.style.display = tipo === "inventario" ? "" : "none"),
        );

      if (tipo === "morbilidad") cargarDataMorbilidad();
      else if (tipo === "inventario") cargarDataInventario();
    });

  // Submit
  document
    .getElementById("form-reporte")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const tipo = document.getElementById("tipo_reporte").value;

      if (!tipo) {
        Swal.fire({
          icon: "error",
          title: "Formulario inválido",
          text: "Debe seleccionar un tipo de reporte.",
          confirmButtonText: "Entendido",
        });
        return;
      }
      if (
        !validarFechaManual("fecha_inicio") ||
        !validarFechaManual("fecha_fin")
      ) {
        Swal.fire({
          icon: "error",
          title: "Formulario inválido",
          text: "La fecha de inicio y fin no pueden ser fechas futuras.",
          confirmButtonText: "Entendido",
        });
        return;
      }

      if (tipo === "morbilidad") filtrarMorbilidad();
      else if (tipo === "inventario") filtrarInventario();
    });

  // Limpiar
  document.getElementById("btn-limpiar").addEventListener("click", function () {
    document.getElementById("form-reporte").reset();
    document.getElementById("contenedor_medicina").style.display = "none";
    document.getElementById("contenedor_inventario").style.display = "none";
    document
      .querySelectorAll(".filtro-morb, .filtro-inv")
      .forEach((el) => (el.style.display = "none"));
    lastFilteredMed = [];
    lastFilteredInv = [];
    if (tableMed) tableMed.clear().draw();
    if (tableInv) tableInv.clear().draw();
  });

  // Chart selectors - Morbilidad
  document
    .getElementById("select-grafica-med")
    .addEventListener("change", actualizarVisibilidadMed);
  document
    .getElementById("select-tipo-chart-med")
    .addEventListener("change", function () {
      chartTypeMed = this.value;
      if (lastFilteredMed.length > 0) renderChartsMed(lastFilteredMed);
    });

  // Chart selectors - Inventario
  document
    .getElementById("select-grafica-inv")
    .addEventListener("change", actualizarVisibilidadInv);
  document
    .getElementById("select-tipo-chart-inv")
    .addEventListener("change", function () {
      chartTypeInv = this.value;
      if (lastFilteredInv.length > 0) renderChartsInv(lastFilteredInv);
    });
});

// ==================== CARGA DE DATA ====================
function cargarDataMorbilidad() {
  fetch(BASE_URL + "reportes_medicina_morbilidad_data")
    .then((r) => r.json())
    .then((data) => {
      if (data.exito === false) {
        Swal.fire({ icon: "error", title: "Error", text: data.mensaje });
        return;
      }
      dataMorbilidad = data;
      poblarSelectsMorb(data);
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo obtener los datos de morbilidad médica.",
      });
    });
}

function cargarDataInventario() {
  fetch(BASE_URL + "reportes_medicina_inventario_data")
    .then((r) => r.json())
    .then((data) => {
      if (data.exito === false) {
        Swal.fire({ icon: "error", title: "Error", text: data.mensaje });
        return;
      }
      dataInventario = data;
      poblarSelectsInv(data);
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo obtener los datos de inventario médico.",
      });
    });
}

function poblarSelectsMorb(data) {
  if (!Array.isArray(data)) return;
  const pnfI = document.getElementById("pnf");
  const tipoSangreI = document.getElementById("tipo_sangre");
  pnfI.innerHTML = '<option value="">Todos</option>';
  tipoSangreI.innerHTML = '<option value="">Todos</option>';

  [...new Set(data.map((i) => i.nombre_pnf).filter(Boolean))].forEach((v) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    pnfI.appendChild(o);
  });
  [...new Set(data.map((i) => i.tipo_sangre).filter(Boolean))].forEach((v) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    tipoSangreI.appendChild(o);
  });
}

function poblarSelectsInv(data) {
  if (!Array.isArray(data)) return;
  const estadoI = document.getElementById("estadoI");
  const tipoI = document.getElementById("tipoI");
  const preI = document.getElementById("presentacion");
  estadoI.innerHTML = '<option value="">Todos</option>';
  tipoI.innerHTML = '<option value="">Todos</option>';
  preI.innerHTML = '<option value="">Todos</option>';

  [...new Set(data.map((i) => i.estatus).filter(Boolean))].forEach((v) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    estadoI.appendChild(o);
  });
  [...new Set(data.map((i) => i.tipo_insumo).filter(Boolean))].forEach((v) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    tipoI.appendChild(o);
  });
  [...new Set(data.map((i) => i.nombre_presentacion).filter(Boolean))].forEach(
    (v) => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      preI.appendChild(o);
    },
  );
}

// ==================== FILTRO MORBILIDAD ====================
function filtrarMorbilidad() {
  const fI = document.getElementById("fecha_inicio").value;
  const fF = document.getElementById("fecha_fin").value;
  const genero = document.getElementById("genero").value;
  const pnf = document.getElementById("pnf").value;
  const tipoSangre = document.getElementById("tipo_sangre").value;

  const filtered = dataMorbilidad.filter((item) => {
    let match = true;
    if (fI || fF) {
      const d = new Date(item.fecha_creacion);
      if (fI && d < new Date(fI)) match = false;
      if (fF && d > new Date(fF)) match = false;
    }
    if (genero && item.genero !== genero) match = false;
    if (pnf && item.nombre_pnf !== pnf) match = false;
    if (tipoSangre && item.tipo_sangre !== tipoSangre) match = false;
    return match;
  });

  if (filtered.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Sin resultados",
      text: "No se encontraron registros.",
      confirmButtonText: "Entendido",
    });
    document.getElementById("contenedor_medicina").style.display = "none";
    tableMed.clear().draw();
    lastFilteredMed = [];
    return;
  }

  lastFilteredMed = filtered;
  tableMed.clear();
  filtered.forEach((item) => {
    const dp = item.fecha_creacion.split("-");
    const fecha =
      dp.length === 3 ? `${dp[2]}-${dp[1]}-${dp[0]}` : item.fecha_creacion;
    tableMed.row.add([
      fecha,
      item.nombres + " " + item.apellidos,
      item.cedula,
      item.nombre_pnf || "N/A",
      item.estatura,
      item.peso,
      item.tipo_sangre,
      item.motivo_visita || "N/A",
    ]);
  });
  tableMed.draw();

  document.getElementById("contenedor_inventario").style.display = "none";
  document.getElementById("contenedor_medicina").style.display = "block";
  renderChartsMed(filtered);
  actualizarVisibilidadMed();

  Swal.fire({
    icon: "success",
    title: "Reporte generado",
    text: `Se encontraron ${filtered.length} registro(s) de morbilidad.`,
    confirmButtonText: "Entendido",
    timer: 3000,
    timerProgressBar: true,
  });
}

// ==================== FILTRO INVENTARIO ====================
function filtrarInventario() {
  const fI = document.getElementById("fecha_inicio").value;
  const fF = document.getElementById("fecha_fin").value;
  const estado = document.getElementById("estadoI").value;
  const tipoInsumo = document.getElementById("tipoI").value;
  const presentacion = document.getElementById("presentacion").value;

  const filtered = dataInventario.filter((item) => {
    let match = true;
    if (fI || fF) {
      const d = new Date(item.fecha_creacion);
      if (fI && d < new Date(fI)) match = false;
      if (fF && d > new Date(fF)) match = false;
    }
    if (estado && item.estatus !== estado) match = false;
    if (tipoInsumo && item.tipo_insumo !== tipoInsumo) match = false;
    if (presentacion && item.nombre_presentacion !== presentacion)
      match = false;
    return match;
  });

  if (filtered.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Sin resultados",
      text: "No se encontraron registros.",
      confirmButtonText: "Entendido",
    });
    document.getElementById("contenedor_inventario").style.display = "none";
    tableInv.clear().draw();
    lastFilteredInv = [];
    return;
  }

  lastFilteredInv = filtered;
  tableInv.clear();
  filtered.forEach((item) => {
    const dpV = item.fecha_vencimiento ? item.fecha_vencimiento.split("-") : [];
    const fechaVenc =
      dpV.length === 3
        ? `${dpV[2]}-${dpV[1]}-${dpV[0]}`
        : item.fecha_vencimiento || "N/A";

    const stock =
      item.cantidad == 0
        ? "Agotado"
        : item.cantidad <= 10
          ? "Bajo"
          : item.cantidad >= 500
            ? "Máximo"
            : "Disponible";

    tableInv.row.add([
      fechaVenc,
      stock,
      item.nombre_insumo || "N/A",
      item.tipo_insumo || "N/A",
      item.nombre_presentacion || "N/A",
      item.cantidad,
      item.estatus || "N/A",
    ]);
  });
  tableInv.draw();

  document.getElementById("contenedor_medicina").style.display = "none";
  document.getElementById("contenedor_inventario").style.display = "block";
  renderChartsInv(filtered);
  actualizarVisibilidadInv();

  Swal.fire({
    icon: "success",
    title: "Reporte generado",
    text: `Se encontraron ${filtered.length} registro(s) de inventario.`,
    confirmButtonText: "Entendido",
    timer: 3000,
    timerProgressBar: true,
  });
}

// ==================== VISIBILIDAD CHARTS ====================
function actualizarVisibilidadMed() {
  const sel = document.getElementById("select-grafica-med").value;
  document.getElementById("wrapper-chartG").style.display =
    sel === "todos" || sel === "genero" ? "" : "none";
  document.getElementById("wrapper-chartP").style.display =
    sel === "todos" || sel === "pnf" ? "" : "none";
  document.getElementById("wrapper-chartTS").style.display =
    sel === "todos" || sel === "sangre" ? "" : "none";
}

function actualizarVisibilidadInv() {
  const sel = document.getElementById("select-grafica-inv").value;
  document.getElementById("wrapper-chartE").style.display =
    sel === "todos" || sel === "estado" ? "" : "none";
  document.getElementById("wrapper-chartTI").style.display =
    sel === "todos" || sel === "tipo_insumo" ? "" : "none";
  document.getElementById("wrapper-chartPRE").style.display =
    sel === "todos" || sel === "presentacion" ? "" : "none";
}

// ==================== DATATABLES ====================
function crearPdfCustomize(chartMap) {
  return function (doc) {
    doc.styles.tableHeader.fillColor = "#4e73df";
    doc.styles.tableHeader.color = "white";
    chartMap.forEach((item) => {
      const wrapper = document.getElementById(item.wrapperId);
      const canvas = document.getElementById(item.id);
      if (wrapper && canvas && wrapper.style.display !== "none") {
        doc.content.push({
          pageBreak: "before",
          text: item.title,
          alignment: "center",
          margin: [0, 20, 0, 10],
          fontSize: 16,
          bold: true,
        });
        doc.content.push({
          image: canvas.toDataURL("image/png"),
          width: 700,
          alignment: "center",
          margin: [0, 30, 0, 20],
        });
      }
    });
  };
}

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
  oPaginate: {
    sFirst: "Primero",
    sLast: "Último",
    sNext: "Siguiente",
    sPrevious: "Anterior",
  },
};

function inicializarDTMedicina() {
  const chartMap = [
    { id: "chartG", wrapperId: "wrapper-chartG", title: "Gráfico por Género" },
    { id: "chartP", wrapperId: "wrapper-chartP", title: "Gráfico por PNF" },
    {
      id: "chartTS",
      wrapperId: "wrapper-chartTS",
      title: "Gráfico por Tipo de Sangre",
    },
  ];
  tableMed = $("#tabla_medicina").DataTable({
    responsive: true,
    autoWidth: false,
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="far fa-file-excel"></i> Excel',
        title: "Reporte Medicina - Morbilidad",
        className: "btn btn-success btn-sm m-1",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i> PDF',
        title: "Reporte Medicina - Morbilidad",
        className: "btn btn-danger btn-sm m-1",
        orientation: "landscape",
        pageSize: "A4",
        exportOptions: { columns: ":visible" },
        customize: crearPdfCustomize(chartMap),
      },
    ],
    language: langES,
  });
  tableMed.buttons().container().appendTo("#botones-exportacion-med");
}

function inicializarDTInventario() {
  const chartMap = [
    { id: "chartE", wrapperId: "wrapper-chartE", title: "Gráfico por Estado" },
    {
      id: "chartTI",
      wrapperId: "wrapper-chartTI",
      title: "Gráfico por Tipo de Insumo",
    },
    {
      id: "chartPRE",
      wrapperId: "wrapper-chartPRE",
      title: "Gráfico por Presentación",
    },
  ];
  tableInv = $("#tabla_inventario").DataTable({
    responsive: true,
    autoWidth: false,
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="far fa-file-excel"></i> Excel',
        title: "Reporte Medicina - Inventario",
        className: "btn btn-success btn-sm m-1",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i> PDF',
        title: "Reporte Medicina - Inventario",
        className: "btn btn-danger btn-sm m-1",
        orientation: "landscape",
        pageSize: "A4",
        exportOptions: { columns: ":visible" },
        customize: crearPdfCustomize(chartMap),
      },
    ],
    language: langES,
  });
  tableInv.buttons().container().appendTo("#botones-exportacion-inv");
}

// ==================== CHART.JS ====================
function buildChartConfig(type, labels, dataValues, labelTitle) {
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: function (t, d) {
          let l = d.labels[t.index] || "";
          if (l) l += ": ";
          l += dataValues[t.index];
          return l;
        },
      },
    },
    legend: { display: true, position: "bottom" },
  };
  if (type === "bar") {
    options.scales = { yAxes: [{ ticks: { beginAtZero: true } }] };
    options.legend.display = false;
  }
  return {
    type,
    data: {
      labels,
      datasets: [
        {
          label: labelTitle,
          data: dataValues,
          backgroundColor: bgColors.slice(0, labels.length),
          borderColor: "white",
          borderWidth: 2,
        },
      ],
    },
    options,
  };
}

// ==================== RENDER CHARTS MORBILIDAD ====================
function renderChartsMed(data) {
  const gMap = { M: "Masculino", F: "Femenino" };

  // Género
  const gU = [...new Set(data.map((i) => i.genero).filter(Boolean))];
  const gL = gU.length ? gU.map((g) => gMap[g] || g) : ["N/E"];
  const gV = gU.map((g) => data.filter((i) => i.genero === g).length);
  if (chartG) chartG.destroy();
  chartG = new Chart(
    document.getElementById("chartG").getContext("2d"),
    buildChartConfig(chartTypeMed, gL, gV, "Género"),
  );

  // PNF
  const pU = [...new Set(data.map((i) => i.nombre_pnf).filter(Boolean))];
  const pL = pU.length ? pU : ["N/E"];
  const pV = pU.map((p) => data.filter((i) => i.nombre_pnf === p).length);
  if (chartP) chartP.destroy();
  chartP = new Chart(
    document.getElementById("chartP").getContext("2d"),
    buildChartConfig(chartTypeMed, pL, pV, "PNF"),
  );

  // Tipo de Sangre
  const tU = [...new Set(data.map((i) => i.tipo_sangre).filter(Boolean))];
  const tL = tU.length ? tU : ["N/E"];
  const tV = tU.map((t) => data.filter((i) => i.tipo_sangre === t).length);
  if (chartTS) chartTS.destroy();
  chartTS = new Chart(
    document.getElementById("chartTS").getContext("2d"),
    buildChartConfig(chartTypeMed, tL, tV, "Tipo de Sangre"),
  );
}

// ==================== RENDER CHARTS INVENTARIO ====================
function renderChartsInv(data) {
  // Estado
  const eU = [...new Set(data.map((i) => i.estatus).filter(Boolean))];
  const eL = eU.length ? eU : ["N/E"];
  const eV = eU.map((e) => data.filter((i) => i.estatus === e).length);
  if (chartE) chartE.destroy();
  chartE = new Chart(
    document.getElementById("chartE").getContext("2d"),
    buildChartConfig(chartTypeInv, eL, eV, "Estado"),
  );

  // Tipo de Insumo
  const tiU = [...new Set(data.map((i) => i.tipo_insumo).filter(Boolean))];
  const tiL = tiU.length ? tiU : ["N/E"];
  const tiV = tiU.map((t) => data.filter((i) => i.tipo_insumo === t).length);
  if (chartTI) chartTI.destroy();
  chartTI = new Chart(
    document.getElementById("chartTI").getContext("2d"),
    buildChartConfig(chartTypeInv, tiL, tiV, "Tipo de Insumo"),
  );

  // Presentación
  const prU = [
    ...new Set(data.map((i) => i.nombre_presentacion).filter(Boolean)),
  ];
  const prL = prU.length ? prU : ["N/E"];
  const prV = prU.map(
    (p) => data.filter((i) => i.nombre_presentacion === p).length,
  );
  if (chartPRE) chartPRE.destroy();
  chartPRE = new Chart(
    document.getElementById("chartPRE").getContext("2d"),
    buildChartConfig(chartTypeInv, prL, prV, "Presentación"),
  );
}
