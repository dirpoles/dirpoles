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
              element: "#generod",
              popover: {
                title: "Género",
                description:
                  "Filtra los resultados por género del paciente: Todos, Masculino o Femenino.",
                align: "center",
              },
            },
            {
              element: "#estatusd",
              popover: {
                title: "Estado",
                description:
                  "Filtra los resultados por estado de la referencia: Aceptada, Pendiente o Rechazada.",
                align: "center",
              },
            },
            {
              element: "#id_beneficiariod",
              popover: {
                title: "Beneficiario",
                description:
                  "Busca y selecciona un beneficiario específico para filtrar los resultados.",
                align: "center",
              },
            },
            {
              element: "#areaOrd",
              popover: {
                title: "Área Origen",
                description:
                  "Filtra los resultados por el área o servicio de origen de la referencia.",
                align: "center",
              },
            },
            {
              element: "#areaDestd",
              popover: {
                title: "Área Destino",
                description:
                  "Filtra los resultados por el área o servicio de destino de la referencia.",
                align: "center",
              },
            },
            {
              element: "#empOrd",
              popover: {
                title: "Empleado Origen",
                description:
                  "Filtra los resultados por el empleado que realizó la referencia.",
                align: "center",
              },
            },
            {
              element: "#empDestd",
              popover: {
                title: "Empleado Destino",
                description:
                  "Filtra los resultados por el empleado destinatario de la referencia.",
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
let charts = { G: null, E: null, AO: null, AD: null, EO: null, ED: null };
let currentChartType = "bar";
let lastFilteredData = [];

//-------------------------------------------- INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  inicializarDataTable();
  inicializarSelect2();
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
    $("#id_beneficiario").val(null).trigger("change");
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

//-------------------------------------------- SELECT2 BENEFICIARIOS
function inicializarSelect2() {
  $("#id_beneficiario").select2({
    theme: "bootstrap-5",
    width: "100%",
    placeholder: "Buscar beneficiario (Nombre o Cédula)",
    allowClear: true,
    ajax: {
      url: BASE_URL + "beneficiarios_activos_data_json",
      dataType: "json",
      delay: 250,
      data: function (params) {
        return { q: params.term };
      },
      processResults: function (data) {
        // El servidor retorna { "data": [...] }
        const items = data.data || [];
        return {
          results: items.map((item) => ({
            id: item.id_beneficiario,
            text: `${item.nombres} ${item.apellidos} (${item.cedula})`,
          })),
        };
      },
      cache: true,
    },
    minimumInputLength: 1,
  });
}

//-------------------------------------------- CARGA DE DATA
function cargarData() {
  fetch(BASE_URL + "reportes_referencias_data")
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
        text: "No se pudo cargar la data de referencias.",
      });
    });
}

function poblarSelects(data) {
  const sets = {
    areaOr: new Set(),
    areaDest: new Set(),
    empOr: new Set(),
    empDest: new Set(),
  };

  data.forEach((i) => {
    if (i.servicio_origen) sets.areaOr.add(i.servicio_origen);
    if (i.servicio_destino) sets.areaDest.add(i.servicio_destino);
    if (i.nombre_empleado_origen) sets.empOr.add(i.nombre_empleado_origen);
    if (i.nombre_empleado_destino) sets.empDest.add(i.nombre_empleado_destino);
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
  const gen = document.getElementById("genero").value;
  const est = document.getElementById("estatus").value;
  const ben = document.getElementById("id_beneficiario").value;
  const aO = document.getElementById("areaOr").value;
  const aD = document.getElementById("areaDest").value;
  const eO = document.getElementById("empOr").value;
  const eD = document.getElementById("empDest").value;

  const filtered = rawData.filter((i) => {
    if (fI && new Date(i.fecha_referencia) < new Date(fI)) return false;
    if (fF && new Date(i.fecha_referencia) > new Date(fF)) return false;
    if (gen && i.genero !== gen) return false;
    if (est && i.estado !== est) return false;
    if (ben && i.id_beneficiario != ben) return false;
    if (aO && i.servicio_origen !== aO) return false;
    if (aD && i.servicio_destino !== aD) return false;
    if (eO && i.nombre_empleado_origen !== eO) return false;
    if (eD && i.nombre_empleado_destino !== eD) return false;
    return true;
  });

  if (filtered.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Sin resultados",
      text: "No se encontraron referencias con esos filtros.",
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
      formatFecha(i.fecha_referencia),
      `${i.nombres} ${i.apellidos}`,
      i.cedula,
      i.genero === "M" ? "Masculino" : "Femenino",
      i.servicio_origen,
      i.servicio_destino,
      i.nombre_empleado_origen,
      i.nombre_empleado_destino,
      i.motivo || "N/A",
      i.estado,
    ]);
  });
  tableGeneral.draw();

  renderCharts(filtered);
}

function renderCharts(data) {
  const config = (title, labels, vals) =>
    buildConfig(currentChartType, labels, vals, title);

  const dG = countBy(data, "genero", { M: "Masculino", F: "Femenino" });
  const dE = countBy(data, "estado");
  const dAO = countBy(data, "servicio_origen");
  const dAD = countBy(data, "servicio_destino");
  const dEO = countBy(data, "nombre_empleado_origen");
  const dED = countBy(data, "nombre_empleado_destino");

  Object.keys(charts).forEach((k) => {
    if (charts[k]) charts[k].destroy();
  });

  charts.G = new Chart(
    document.getElementById("chartGenero").getContext("2d"),
    config("Género", dG.labels, dG.values),
  );
  charts.E = new Chart(
    document.getElementById("chartE").getContext("2d"),
    config("Estado", dE.labels, dE.values),
  );
  charts.AO = new Chart(
    document.getElementById("chartAO").getContext("2d"),
    config("Área Origen", dAO.labels, dAO.values),
  );
  charts.AD = new Chart(
    document.getElementById("chartAD").getContext("2d"),
    config("Área Destino", dAD.labels, dAD.values),
  );
  charts.EO = new Chart(
    document.getElementById("chartEO").getContext("2d"),
    config("Empl. Origen", dEO.labels, dEO.values),
  );
  charts.ED = new Chart(
    document.getElementById("chartED").getContext("2d"),
    config("Empl. Destino", dED.labels, dED.values),
  );
}

//-------------------------------------------- HELPERS
function countBy(data, field, mapValues = null) {
  const count = {};
  data.forEach((i) => {
    let val = i[field] || "N/E";
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
  else if (v === "genero")
    document.getElementById("wrapper-chartG").style.display = "";
  else if (v === "estatus")
    document.getElementById("wrapper-chartE").style.display = "";
  else if (v === "areaO")
    document.getElementById("wrapper-chartAO").style.display = "";
  else if (v === "areaD")
    document.getElementById("wrapper-chartAD").style.display = "";
  else if (v === "empO")
    document.getElementById("wrapper-chartEO").style.display = "";
  else if (v === "empD")
    document.getElementById("wrapper-chartED").style.display = "";
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
        title: "Reporte Referencias",
        className: "btn btn-success btn-sm",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i> PDF',
        title: "Reporte Referencias",
        className: "btn btn-danger btn-sm",
        orientation: "landscape",
        pageSize: "A4",
        customize: function (doc) {
          doc.styles.tableHeader.fillColor = "#4e73df";
          doc.styles.tableHeader.color = "white";

          const visibleCharts = [
            { id: "chartGenero", wrap: "wrapper-chartG", t: "Género" },
            { id: "chartE", wrap: "wrapper-chartE", t: "Estado" },
            { id: "chartAO", wrap: "wrapper-chartAO", t: "Área Origen" },
            { id: "chartAD", wrap: "wrapper-chartAD", t: "Área Destino" },
            { id: "chartEO", wrap: "wrapper-chartEO", t: "Empl. Origen" },
            { id: "chartED", wrap: "wrapper-chartED", t: "Empl. Destino" },
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
