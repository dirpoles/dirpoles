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
              element: "#tipoReporte",
              popover: {
                title: "Tipo de Reporte",
                description:
                  "Selecciona el tipo de reporte que deseas generar: Vehículos, Proveedores, Rutas o Repuestos.",
                align: "center",
              },
            },
            {
              element: "#fecha_iniciod",
              popover: {
                title: "Fecha de Inicio",
                description:
                  "Selecciona la fecha desde la cual deseas filtrar los registros.",
                align: "center",
              },
            },
            {
              element: "#fecha_find",
              popover: {
                title: "Fecha de Fin",
                description:
                  "Selecciona la fecha hasta la cual deseas filtrar los registros.",
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
//-------------------------------------------- CONSTANTES Y CONFIGURACIÓN
const hoy = new Date();
const fechaActual = hoy.toISOString().split("T")[0];

document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
document.getElementById("fecha_fin").setAttribute("max", fechaActual);

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
  oPaginate: {
    sFirst: "Primero",
    sLast: "Último",
    sNext: "Siguiente",
    sPrevious: "Anterior",
  },
};

// Variables globales
let rawData = { vehiculos: [], proveedores: [], rutas: [], repuestos: [] };
let rawFiltros = { v: {}, p: {}, ru: {}, re: {} };
let tables = { v: null, p: null, ru: null, re: null };
let charts = {
  v: { M: null, T: null, E: null },
  p: { E: null },
  ru: { T: null, E: null, P: null, D: null },
  re: { P: null, E: null },
};
let lastData = { key: null, data: [] }; // Para re-renderizar charts sin filtrar de nuevo

//-------------------------------------------- INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  inicializarDataTables();
  cargarData();

  // Toggle de Categoría
  document
    .getElementById("tipoReporte")
    .addEventListener("change", function () {
      actualizarInterfaz(this.value);
    });

  // Evento Submit
  document
    .getElementById("form-reporte")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      filtrarYRenderizar();
    });

  // Evento Limpiar
  document.getElementById("btn-limpiar").addEventListener("click", () => {
    document.getElementById("form-reporte").reset();
    limpiarResultados();
    actualizarInterfaz(document.getElementById("tipoReporte").value);
  });

  // Eventos de cambio de tipo de gráfico
  ["v", "p", "ru", "re"].forEach((key) => {
    const el = document.getElementById(`sel-tipo-chart-${key}`);
    if (el) {
      el.addEventListener("change", () => {
        if (lastData.key === key && lastData.data.length > 0) {
          renderCharts(key, lastData.data);
        }
      });
    }
  });

  // Evento Ayuda
  document.getElementById("btn-ayuda").addEventListener("click", () => {
    Swal.fire({
      title: "Ayuda: Reportes de Transporte",
      html: `<div class="text-left small">
                <p>1. Seleccione un <b>Tipo de Reporte</b> (Vehículos, Proveedores, etc.).</p>
                <p>2. Los filtros se adaptarán automáticamente a su selección.</p>
                <p>3. Use los filtros de fecha si desea un rango específico.</p>
                <p>4. Haga clic en <b>Generar Reporte</b> para ver las estadísticas y la tabla.</p>
                <p>5. En la parte superior de cada sección de gráficos puede cambiar el tipo de visualización.</p>
            </div>`,
      icon: "info",
      confirmButtonColor: "#4e73df",
    });
  });
});

function actualizarInterfaz(cat) {
  document
    .querySelectorAll(".f-vehiculo, .f-proveedor, .f-ruta, .f-repuesto")
    .forEach((el) => (el.style.display = "none"));
  limpiarResultados();

  if (!cat) return;

  const cls = {
    vehiculos: ".f-vehiculo",
    proveedores: ".f-proveedor",
    rutas: ".f-ruta",
    repuestos: ".f-repuesto",
  }[cat];
  document.querySelectorAll(cls).forEach((el) => (el.style.display = ""));

  poblarFiltrosDinamicos(cat);
}

function limpiarResultados() {
  document
    .querySelectorAll(".cont-rep")
    .forEach((el) => (el.style.display = "none"));
}

//-------------------------------------------- CARGA DE DATA
function cargarData() {
  fetch(BASE_URL + "reportes_transporte_data")
    .then((r) => r.json())
    .then((data) => {
      rawData.vehiculos = data.vehiculos || [];
      rawData.proveedores = data.proveedores || [];
      rawData.rutas = data.rutas || [];
      rawData.repuestos = data.repuestos || [];
      extraerFiltros();
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la data de transporte.",
      });
    });
}

function extraerFiltros() {
  rawFiltros.v.modelos = [
    ...new Set(rawData.vehiculos.map((i) => i.modelo)),
  ].filter(Boolean);
  rawFiltros.ru.partidas = [
    ...new Set(rawData.rutas.map((i) => i.punto_partida)),
  ].filter(Boolean);
  rawFiltros.ru.destinos = [
    ...new Set(rawData.rutas.map((i) => i.punto_destino)),
  ].filter(Boolean);
  rawFiltros.re.proveedores = [
    ...new Set(rawData.repuestos.map((i) => i.nombre_prov)),
  ].filter(Boolean);
}

function poblarFiltrosDinamicos(cat) {
  if (cat === "vehiculos") {
    const sel = document.getElementById("modelo");
    sel.innerHTML = '<option value="">Todos</option>';
    rawFiltros.v.modelos.forEach((m) => {
      const o = document.createElement("option");
      o.value = m;
      o.textContent = m;
      sel.appendChild(o);
    });
  } else if (cat === "rutas") {
    const selP = document.getElementById("partida");
    const selD = document.getElementById("destino");
    selP.innerHTML = selD.innerHTML = '<option value="">Todos</option>';
    rawFiltros.ru.partidas.forEach((p) => {
      const o = document.createElement("option");
      o.value = p;
      o.textContent = p;
      selP.appendChild(o);
    });
    rawFiltros.ru.destinos.forEach((d) => {
      const o = document.createElement("option");
      o.value = d;
      o.textContent = d;
      selD.appendChild(o);
    });
  } else if (cat === "repuestos") {
    const sel = document.getElementById("proveedor_re");
    sel.innerHTML = '<option value="">Todos</option>';
    rawFiltros.re.proveedores.forEach((p) => {
      const o = document.createElement("option");
      o.value = p;
      o.textContent = p;
      sel.appendChild(o);
    });
  }
}

//-------------------------------------------- FILTRADO Y RENDER
function filtrarYRenderizar() {
  const cat = document.getElementById("tipoReporte").value;
  if (!cat) {
    Swal.fire({
      icon: "info",
      title: "Atención",
      text: "Por favor seleccione un tipo de reporte.",
    });
    return;
  }

  const fI = document.getElementById("fecha_inicio").value;
  const fF = document.getElementById("fecha_fin").value;

  let filtered = [];
  const dataSet = rawData[cat];

  if (cat === "vehiculos") {
    const tip = document.getElementById("tipoV").value;
    const mod = document.getElementById("modelo").value;
    const est = document.getElementById("estadoV").value;
    filtered = dataSet.filter((i) => {
      if (fI && new Date(i.fecha_adquisicion) < new Date(fI)) return false;
      if (fF && new Date(i.fecha_adquisicion) > new Date(fF)) return false;
      if (tip && i.tipo !== tip) return false;
      if (mod && i.modelo !== mod) return false;
      if (est && i.estado !== est) return false;
      return true;
    });
  } else if (cat === "proveedores") {
    const est = document.getElementById("estadoP").value;
    filtered = dataSet.filter((i) => {
      if (fI && new Date(i.fecha_creacion) < new Date(fI)) return false;
      if (fF && new Date(i.fecha_creacion) > new Date(fF)) return false;
      if (est && i.estatus !== est) return false;
      return true;
    });
  } else if (cat === "rutas") {
    const tip = document.getElementById("tipoR").value;
    const par = document.getElementById("partida").value;
    const des = document.getElementById("destino").value;
    filtered = dataSet.filter((i) => {
      if (fI && new Date(i.fecha_creacion) < new Date(fI)) return false;
      if (fF && new Date(i.fecha_creacion) > new Date(fF)) return false;
      if (tip && i.tipo_ruta !== tip) return false;
      if (par && i.punto_partida !== par) return false;
      if (des && i.punto_destino !== des) return false;
      return true;
    });
  } else if (cat === "repuestos") {
    const pro = document.getElementById("proveedor_re").value;
    const est = document.getElementById("estadoRE").value;
    filtered = dataSet.filter((i) => {
      if (fI && new Date(i.fecha_creacion) < new Date(fI)) return false;
      if (fF && new Date(i.fecha_creacion) > new Date(fF)) return false;
      if (pro && i.nombre_prov !== pro) return false;
      if (est && i.estatus !== est) return false;
      return true;
    });
  }

  if (filtered.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Sin resultados",
      text: "No se encontraron registros con esos filtros.",
    });
    return;
  }

  limpiarResultados();
  const contMap = {
    vehiculos: "v",
    proveedores: "p",
    rutas: "ru",
    repuestos: "re",
  };
  const key = contMap[cat];
  document.getElementById(`contenedor_${key}`).style.display = "block";

  Swal.fire({
    icon: "success",
    title: "Reporte Generado",
    text: `Se encontraron ${filtered.length} registros.`,
    timer: 3000,
    timerProgressBar: true,
    confirmButtonText: "Entendido",
    confirmButtonColor: "#4e73df",
  });

  renderData(key, filtered);
}

function renderData(key, data) {
  lastData = { key, data }; // Guardar para cambios de tipo de chart
  const table = tables[key];
  table.clear();

  if (key === "v") {
    data.forEach((i) =>
      table.row.add([
        formatFecha(i.fecha_adquisicion),
        i.placa,
        i.tipo,
        i.estado,
      ]),
    );
  } else if (key === "p") {
    data.forEach((i) =>
      table.row.add([
        formatFecha(i.fecha_creacion),
        `${i.tipo_documento}-${i.num_documento}`,
        i.nombre,
        i.telefono,
        i.correo,
        i.direccion,
      ]),
    );
  } else if (key === "ru") {
    data.forEach((i) =>
      table.row.add([
        formatFecha(i.fecha_creacion),
        i.nombre_ruta,
        i.tipo_ruta,
        i.punto_partida,
        i.punto_destino,
        i.horario_salida,
        i.horario_llegada,
      ]),
    );
  } else if (key === "re") {
    data.forEach((i) =>
      table.row.add([
        formatFecha(i.fecha_creacion),
        i.nombre,
        i.cantidad,
        i.nombre_prov,
        i.estatus,
      ]),
    );
  }
  table.draw();
  renderCharts(key, data);
}

function renderCharts(key, data) {
  const c = charts[key];
  const type = document.getElementById(`sel-tipo-chart-${key}`).value;
  const config = (t, l, v) => buildConfig(type, l, v, t);

  Object.keys(c).forEach((k) => {
    if (c[k]) c[k].destroy();
  });

  if (key === "v") {
    const dM = countBy(data, "modelo");
    const dT = countBy(data, "tipo");
    const dE = countBy(data, "estado");
    c.M = new Chart(
      document.getElementById("chartVM").getContext("2d"),
      config("Por Modelo", dM.labels, dM.values),
    );
    c.T = new Chart(
      document.getElementById("chartVT").getContext("2d"),
      config("Por Tipo", dT.labels, dT.values),
    );
    c.E = new Chart(
      document.getElementById("chartVE").getContext("2d"),
      config("Por Estado", dE.labels, dE.values),
    );
  } else if (key === "p") {
    const dE = countBy(data, "estatus");
    c.E = new Chart(
      document.getElementById("chartPE").getContext("2d"),
      config("Por Estatus", dE.labels, dE.values),
    );
  } else if (key === "ru") {
    const dT = countBy(data, "tipo_ruta");
    const dE = countBy(data, "estatus");
    const dP = countBy(data, "punto_partida");
    const dD = countBy(data, "punto_destino");
    c.T = new Chart(
      document.getElementById("chartRUT").getContext("2d"),
      config("Por Tipo", dT.labels, dT.values),
    );
    c.E = new Chart(
      document.getElementById("chartRUE").getContext("2d"),
      config("Por Estatus", dE.labels, dE.values),
    );
    c.P = new Chart(
      document.getElementById("chartRUP").getContext("2d"),
      config("Puntos Partida", dP.labels, dP.values),
    );
    c.D = new Chart(
      document.getElementById("chartRUD").getContext("2d"),
      config("Puntos Destino", dD.labels, dD.values),
    );
  } else if (key === "re") {
    const dP = countBy(data, "nombre_prov");
    const dE = countBy(data, "estatus");
    c.P = new Chart(
      document.getElementById("chartREP").getContext("2d"),
      config("Por Proveedor", dP.labels, dP.values),
    );
    c.E = new Chart(
      document.getElementById("chartREE").getContext("2d"),
      config("Por Estado", dE.labels, dE.values),
    );
  }
}

//-------------------------------------------- HELPERS
function countBy(data, field) {
  const count = {};
  data.forEach((i) => {
    let val = i[field] || "N/E";
    count[val] = (count[val] || 0) + 1;
  });
  return { labels: Object.keys(count), values: Object.values(count) };
}

function buildConfig(type, labels, values, title) {
  const config = {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: bgColors.slice(0, labels.length),
          borderColor: "white",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { position: "bottom", labels: { boxWidth: 12, fontSize: 11 } },
      layout: { padding: { top: 10, bottom: 10 } },
    },
  };
  if (type === "bar") {
    config.options.scales = {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
            callback: (v) => (v % 1 === 0 ? v : ""),
          },
        },
      ],
    };
    config.options.legend.display = false;
  }
  return config;
}

function formatFecha(f) {
  if (!f) return "N/A";
  const parts = f.split(" ")[0].split("-");
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : f;
}

function inicializarDataTables() {
  const buildDT = (id, title, chartsList, btnId) => {
    const dt = $(id).DataTable({
      responsive: true,
      language: langES,
      dom: "Bfrtip",
      buttons: [
        {
          extend: "excelHtml5",
          text: '<i class="fas fa-file-excel"></i> Excel',
          title: title,
          className: "btn btn-success btn-sm",
        },
        {
          extend: "pdfHtml5",
          text: '<i class="fas fa-file-pdf"></i> PDF',
          title: title,
          className: "btn btn-danger btn-sm",
          orientation: "landscape",
          pageSize: "A4",
          customize: function (doc) {
            doc.styles.tableHeader.fillColor = "#4e73df";
            doc.styles.tableHeader.color = "white";
            chartsList.forEach((c) => {
              const canvas = document.getElementById(c);
              if (canvas) {
                doc.content.push({
                  pageBreak: "before",
                  text: "Visualización Estadística",
                  alignment: "center",
                  margin: [0, 20, 0, 10],
                  fontSize: 16,
                  bold: true,
                });
                doc.content.push({
                  image: canvas.toDataURL("image/png"),
                  width: 700,
                  alignment: "center",
                });
              }
            });
          },
        },
      ],
    });
    dt.buttons().container().appendTo(btnId);
    return dt;
  };

  tables.v = buildDT(
    "#tabla_v",
    "Reporte Vehículos",
    ["chartVM", "chartVT", "chartVE"],
    "#btn-exp-v",
  );
  tables.p = buildDT(
    "#tabla_p",
    "Reporte Proveedores",
    ["chartPE"],
    "#btn-exp-p",
  );
  tables.ru = buildDT(
    "#tabla_ru",
    "Reporte Rutas",
    ["chartRUT", "chartRUE", "chartRUP", "chartRUD"],
    "#btn-exp-ru",
  );
  tables.re = buildDT(
    "#tabla_re",
    "Reporte Repuestos",
    ["chartREP", "chartREE"],
    "#btn-exp-re",
  );
}
