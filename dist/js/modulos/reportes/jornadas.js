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
            {
              element: "#tipod",
              popover: {
                title: "Tipo",
                description:
                  "Filtra los resultados por tipo de jornada o evento.",
                align: "center",
              },
            },
            {
              element: "#ubicaciond",
              popover: {
                title: "Ubicación",
                description:
                  "Filtra los resultados por ubicación o lugar del evento.",
                align: "center",
              },
            },
            {
              element: "#estadod",
              popover: {
                title: "Estado",
                description: "Filtra los resultados por estado de la jornada.",
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
let rawData = [];
let tableGeneral;
let charts = { T: null, U: null, E: null };
let currentChartType = "bar";
let lastFilteredData = [];

//-------------------------------------------- INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  inicializarDataTable();
  cargarData();

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
    document.getElementById("contenedor_general").style.display = "none";
    tableGeneral.clear().draw();
  });

  // Selectores de Gráficas
  document
    .getElementById("select-grafica")
    .addEventListener("change", actualizarVisibilidadCharts);
  document
    .getElementById("select-tipo-chart")
    .addEventListener("change", function () {
      currentChartType = this.value;
      if (lastFilteredData.length) renderCharts(lastFilteredData);
    });
});

//-------------------------------------------- CARGA DE DATA
function cargarData() {
  fetch(BASE_URL + "reportes_jornadas_data")
    .then((r) => r.json())
    .then((data) => {
      if (!data) throw new Error("No se recibió información del servidor.");
      if (data.exito === false) throw new Error(data.mensaje);

      rawData = data;
      poblarSelects(data);
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la data de jornadas.",
      });
    });
}

function poblarSelects(data) {
  const sets = {
    tipo: new Set(),
    ubicacion: new Set(),
    estado: new Set(),
  };

  data.forEach((i) => {
    if (i.tipo_jornada) sets.tipo.add(i.tipo_jornada);
    if (i.ubicacion) sets.ubicacion.add(i.ubicacion);
    if (i.estatus) sets.estado.add(i.estatus);
  });

  Object.keys(sets).forEach((key) => {
    const sel = document.getElementById(key);
    Array.from(sets[key])
      .sort()
      .forEach((val) => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        sel.appendChild(opt);
      });
  });
}

//-------------------------------------------- FILTRADO Y RENDER
function filtrarYRenderizar() {
  const fI = document.getElementById("fecha_inicio").value;
  const fF = document.getElementById("fecha_fin").value;
  const tip = document.getElementById("tipo").value;
  const ubi = document.getElementById("ubicacion").value;
  const est = document.getElementById("estado").value;

  const filtered = rawData.filter((i) => {
    if (fI && new Date(i.fecha_inicio) < new Date(fI)) return false;
    if (fF && new Date(i.fecha_inicio) > new Date(fF)) return false;
    if (tip && i.tipo_jornada !== tip) return false;
    if (ubi && i.ubicacion !== ubi) return false;
    if (est && i.estatus !== est) return false;
    return true;
  });

  if (filtered.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Sin resultados",
      text: "No se encontraron jornadas con esos filtros.",
    });
    document.getElementById("contenedor_general").style.display = "none";
    return;
  }

  lastFilteredData = filtered;
  document.getElementById("contenedor_general").style.display = "block";

  Swal.fire({
    icon: "success",
    title: "Éxito",
    text: `Se encontraron ${filtered.length} registros.`,
    timer: 3000,
    timerProgressBar: true,
    confirmButtonText: "Entendido",
    confirmButtonColor: "#4e73df",
  });

  // Llenar tabla
  tableGeneral.clear();
  filtered.forEach((i) => {
    tableGeneral.row.add([
      formatFecha(i.fecha_inicio),
      i.nombre_jornada,
      i.tipo_jornada,
      i.ubicacion,
      i.estatus,
    ]);
  });
  tableGeneral.draw();

  renderCharts(filtered);
}

function renderCharts(data) {
  const config = (title, labels, vals) =>
    buildConfig(currentChartType, labels, vals, title);

  const dT = countBy(data, "tipo_jornada");
  const dU = countBy(data, "ubicacion");
  const dE = countBy(data, "estatus");

  Object.keys(charts).forEach((k) => {
    if (charts[k]) charts[k].destroy();
  });

  charts.T = new Chart(
    document.getElementById("chartT").getContext("2d"),
    config("Tipo", dT.labels, dT.values),
  );
  charts.U = new Chart(
    document.getElementById("chartU").getContext("2d"),
    config("Ubicación", dU.labels, dU.values),
  );
  charts.E = new Chart(
    document.getElementById("chartE").getContext("2d"),
    config("Estado", dE.labels, dE.values),
  );
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
      legend: { position: "bottom" },
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

function actualizarVisibilidadCharts() {
  const v = document.getElementById("select-grafica").value;
  document
    .querySelectorAll(".wrapper-chart")
    .forEach((el) => (el.style.display = "none"));

  if (v === "todos")
    document
      .querySelectorAll(".wrapper-chart")
      .forEach((el) => (el.style.display = ""));
  else if (v === "tipo")
    document.getElementById("wrapper-chartT").style.display = "";
  else if (v === "ubicacion")
    document.getElementById("wrapper-chartU").style.display = "";
  else if (v === "estado")
    document.getElementById("wrapper-chartE").style.display = "";
}

function inicializarDataTable() {
  tableGeneral = $("#tabla_general").DataTable({
    responsive: true,
    language: langES,
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="fas fa-file-excel"></i> Excel',
        title: "Reporte Jornadas",
        className: "btn btn-success btn-sm",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i> PDF',
        title: "Reporte Jornadas",
        className: "btn btn-danger btn-sm",
        orientation: "landscape",
        pageSize: "A4",
        customize: function (doc) {
          doc.styles.tableHeader.fillColor = "#4e73df";
          doc.styles.tableHeader.color = "white";

          const visibleCharts = [
            {
              id: "chartT",
              wrap: "wrapper-chartT",
              t: "Distribución por Tipo",
            },
            {
              id: "chartU",
              wrap: "wrapper-chartU",
              t: "Distribución por Ubicación",
            },
            {
              id: "chartE",
              wrap: "wrapper-chartE",
              t: "Distribución por Estado",
            },
          ];

          visibleCharts.forEach((c) => {
            const canvas = document.getElementById(c.id);
            const wrap = document.getElementById(c.wrap);
            if (canvas && wrap.style.display !== "none") {
              doc.content.push({
                pageBreak: "before",
                text: "Gráfica: " + c.t,
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
  tableGeneral.buttons().container().appendTo("#btn-exp-general");
}
