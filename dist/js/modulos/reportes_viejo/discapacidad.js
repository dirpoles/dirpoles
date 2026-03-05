//--------------------------------------------- VALIDACIONES

const hoy = new Date();
const fechaActual = hoy.toISOString().split("T")[0];

document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
document.getElementById("fecha_fin").setAttribute("max", fechaActual);

function validarFechaManual(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (new Date(input.value) > new Date(fechaActual)) {
    error.textContent = "La fecha no puede ser futura.";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}


document.getElementById("fecha_inicio").addEventListener("input", function () {
  validarFechaManual("fecha_inicio", "error_fecha_inicio");
});

document.getElementById("fecha_fin").addEventListener("input", function () {
  validarFechaManual("fecha_fin", "error_fecha_fin");
});

document
  .getElementById("form-reporte")
  .addEventListener("submit", function (event) {
    const fechaInicioValida = validarFechaManual(
      "fecha_inicio",
      "error_fecha_inicio"
    );
    const fechaFinValida = validarFechaManual("fecha_fin", "error_fecha_fin");

    if (!fechaInicioValida || !fechaFinValida) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Formulario invalido.",
        text: "La fecha de inicio y fin no pueden ser fechas futuras.",
        confirmButtonText: "Entendido",
      });
      return;
    }
  });
//-----------------------------------------------------------------------------
//---------------------------------------------------------------------

$(document).ready(function () {
fetch("index.php?action=reportes_discapacidad&data=1")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const general = data;

        const pnfI = document.getElementById("pnf");

        pnfI.innerHTML = '<option value="" selected>Todos</option>';

        if (Array.isArray(general)) {
          const pnfUnicas = [
            ...new Set(general.map((item) => item.nombre_pnf)),
          ];
          pnfUnicas.forEach((item) => {
            const optionE = document.createElement("option");
            optionE.value = item;
            optionE.textContent = item;
            pnfI.appendChild(optionE);
          });
        }
      }
    })
    .catch((error) =>
      console.error("Error al cargar la data de filtros:", error)
    );

  let config = {};
  let tableD;

  fetch("api/endpoint.php")
    .then((response) => response.json())
    .then((data) => {
      config = data; // Guarda las constantes en el objeto config
      console.log("Configuración cargada:", config);

      // Inicializa DataTables aquí (o llama a una función que lo haga)
      tableD = $("#tabla_discapacidad").DataTable({
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
            text: '<i class="far fa-file-excel"></i> Exportar a Excel',
            title: "Reporte Discapacidad",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte Discapacidad",
            className: "btn btn-danger",
            orientation: "landscape",
            pageSize: "A4",
            exportOptions: {
              columns: ":visible",
            },
            customize: function (doc) {
              // Agrega espacio para evitar superposición con el header
              doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });

              // Ajuste del título
              doc.content[1].bold = true;
              doc.content[1].alignment = "center";
              doc.content[1].color = "black";
              doc.content[1].fontSize = 16;

              // Agrega resumen de registros
              const pageInfo = tableD.page.info();
              const summaryText = `Mostrando ${pageInfo.start + 1} a ${
                pageInfo.end
              } de ${pageInfo.recordsTotal} registros`;

              doc.content.push({
                text: summaryText,
                alignment: "left",
                margin: [0, 10, 0, 0],
              });

              doc.content[2].margin = [0, 0, 0, 0];
              doc.content[2].table.widths = Array(
                doc.content[2].table.body[0].length + 1
              )
                .join("*")
                .split("");

                const chartIds = ["chartG", "chartP"];
              const chartTitles = ["Gráfico por Genero", "Gráfico por PNF"];

              // Agregar cada gráfico en una página separada
              chartIds.forEach((chartId, index) => {
                const canvas = document.getElementById(chartId);
                if (canvas) {
                  const chartImage = canvas.toDataURL("image/png");

                  // Agregar página nueva
                  doc.content.push({
                    pageBreak: "before",
                    text: chartTitles[index],
                    style: "header",
                    alignment: "center",
                    margin: [0, 20, 0, 10],
                    fontSize: 16,
                    bold: true,
                  });

                  // Agregar gráfico ocupando casi toda la página
                  doc.content.push({
                    image: chartImage,
                    width: 800,
                    alignment: "center",
                    margin: [0, 30, 0, 20],
                  });

                  doc.content.push({
                    text: "Los elementos que tengan 10+ indican que hay más de 10 registros existentes.",
                    alignment: "center",
                    margin: [0, 0, 0, 20],
                    fontSize: 12,
                    italics: true,
                  });
                }
              });

              doc.content[2].layout = {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => "#000000",
                vLineColor: () => "#000000",
                paddingLeft: () => 4,
                paddingRight: () => 4,
                paddingTop: () => 2,
                paddingBottom: () => 2,
              };

              doc.header = {
                image: "data:image/png;base64," + config.BASE_HEADER,
                width: 800,
                alignment: "center",
                opacity: 1,
                margin: [0, 0, 0, 0],
              };

              doc.background = {
                image: "data:image/png;base64," + config.BASE_FONDO,
                width: 400,
                opacity: 0.2,
              };
            },
          },
        ],
        language: {
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
          oAria: {
            sSortAscending:
              ": Activar para ordenar la columna de manera ascendente",
            sSortDescending:
              ": Activar para ordenar la columna de manera descendente",
          },
        },
      });
    })
    .catch((error) => {
      console.error("Error cargando configuración:", error);
    });

  //-------------------------------------------------------------
  //------------------------------------------------------
  let realValuesG = [];
  let realValuesP = [];
  let chartG = null;
  let chartP = null;

  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_discapacidad",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        if (
          (validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
            validarFechaManual("fecha_fin", "error_fecha_fin"))
        ) {
          tableD.clear();

          const filteredData = data
            .filter(
              (item) =>
                !$("#fecha_inicio").val() ||
                !$("#fecha_fin").val() ||
                (new Date(item.fecha_creacion) >=
                  new Date($("#fecha_inicio").val()) &&
                  new Date(item.fecha_creacion) <=
                    new Date($("#fecha_fin").val()))
            )
            .filter(
              (item) =>
                !$("#genero").val() || item.genero === $("#genero").val()
            )
            .filter(
              (item) => !$("#pnf").val() || item.nombre_pnf === $("#pnf").val()
            );

          filteredData.forEach((item) => {
            const dateParts = item.fecha_creacion.split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const nombresApellidos = item.nombres + " " + item.apellidos;

            tableD.row.add([
              fecha_formateada,
              nombresApellidos,
              item.tipo_cedula + " - " +item.cedula,
              item.nombre_pnf,
              item.condicion_medica,
              item.cirugia_prev,
              item.requiere_asistencia,
              item.dispositivo_asistencia,
              item.apoyo_psicologico,
            ]);
          });

          tableD.draw();

          if (filteredData.length > 0) {
            $("#contenedor_discapacidad").show();
            Swal.fire({
              icon: "success",
              title: "Reporte generado.",
              text: "Reporte generado con éxito.",
              confirmButtonText: "Entendido",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Reporte no generado.",
              text: "El reporte no se pudo generar.",
              confirmButtonText: "Entendido",
            });
          }
        } else {
          tableD.clear().draw();
          $("#contenedor_discapacidad").hide();
        }

//-----------------------------------GRAFICOS---------------------------------------------------------
//------------------GENERO------------------------------------------------
const generosPresentes = new Set(data.filter(item => 
  (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
  (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
   (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
    new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val())))
).map(item => item.genero));

const labelsG = $("#genero").val() 
  ? [$("#genero").val() === "M" ? "Masculino" : "Femenino"] 
  : Array.from(generosPresentes).map(g => g === "M" ? "Masculino" : "Femenino");

const dataValuesG = labelsG.map(label => 
  data.filter(item => 
    item.genero === (label === "Masculino" ? "M" : "F") &&
    (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
    (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
     (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
      new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val())))
  ).length
);

const displayValuesG = dataValuesG.map(v => v > 10 ? 10 : v);
realValuesG = dataValuesG;

if (chartG) chartG.destroy();

if (labelsG.length > 0) {
  chartG = new Chart(document.getElementById("chartG").getContext("2d"), {
    type: "bar",
    data: {
      labels: labelsG,
      datasets: [{
        label: "Género",
        data: displayValuesG,
        backgroundColor: labelsG.map((_, i) => 
          i % 2 ? "rgba(54, 162, 235, 0.2)" : "rgba(75, 192, 192, 0.2)"),
        borderColor: labelsG.map((_, i) => 
          i % 2 ? "rgba(54, 162, 235, 1)" : "rgba(75, 192, 192, 1)"),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { yAxes: [{ ticks: { beginAtZero: true, min: 0, max: 10 } }] },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const realVal = realValuesG[tooltipItem.index];
            return `${data.labels[tooltipItem.index]}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
          }
        }
      },
      legend: { labels: { boxWidth: 0, fontSize: 20 } },
      plugins: {
        datalabels: {
          display: true,
          color: "black",
          formatter: (value, ctx) => realValuesG[ctx.dataIndex] > 10 ? "10+" : realValuesG[ctx.dataIndex]
        }
      }
    },
    plugins: [ChartDataLabels]
  });
} else {
  document.getElementById("chartG-container").innerHTML = "<p>No hay datos de género para mostrar</p>";
}

//------------------PNF------------------------------------------------
const pnfSet = new Set(
  data
    .filter(item =>
      (!$("#genero").val() || item.genero === $("#genero").val()) &&
      (!$("#fecha_inicio").val() || !$("#fecha_fin").val() ||
        (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) &&
         new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val())))
    )
    .map(item => item.nombre_pnf)
);

const labelsP = $("#pnf").val() 
  ? [$("#pnf").val()] 
  : Array.from(pnfSet).map(pnf => pnf || "PNF no especificado");

const dataValuesP = labelsP.map(pnf => 
  data.filter(item => 
    item.nombre_pnf === (pnf === "PNF no especificado" ? "" : pnf) &&
    (!$("#genero").val() || item.genero === $("#genero").val()) &&
    (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
     (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
      new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val())))
  ).length
);

const displayValuesP = dataValuesP.map(v => v > 10 ? 10 : v);
realValuesP = dataValuesP;

if (chartP) chartP.destroy();

if (labelsP.length > 0) {
  chartP = new Chart(document.getElementById("chartP").getContext("2d"), {
    type: "bar",
    data: {
      labels: labelsP,
      datasets: [{
        label: "PNF",
        data: displayValuesP,
        backgroundColor: labelsP.map((_, i) => 
          `rgba(${(75 + i * 30) % 255}, ${(192 - i * 50) % 255}, ${(192 + i * 20) % 255}, 0.2)`),
        borderColor: labelsP.map((_, i) => 
          `rgba(${(75 + i * 30) % 255}, ${(192 - i * 50) % 255}, ${(192 + i * 20) % 255}, 1)`),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { yAxes: [{ ticks: { beginAtZero: true, min: 0, max: 10 } }] },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const realVal = realValuesP[tooltipItem.index];
            return `${data.labels[tooltipItem.index]}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
          }
        }
      },
      legend: { labels: { boxWidth: 0, fontSize: 20 } },
      plugins: {
        datalabels: {
          display: true,
          color: "black",
          formatter: (value, ctx) => realValuesP[ctx.dataIndex] > 10 ? "10+" : realValuesP[ctx.dataIndex]
        }
      }
    },
    plugins: [ChartDataLabels]
          });
        } else {
          document.getElementById("chartP-container").innerHTML = "<p>No hay datos de PNF para mostrar con los filtros actuales.</p>";
        }
      },
      error: function (xhr, status, error) {
        let mensaje = "Ha ocurrido un error inesperado.";

        if (xhr.responseJSON && xhr.responseJSON.message) {
          mensaje = xhr.responseJSON.message;
        }

        Swal.fire({
          icon: "error",
          title: "Error en el servidor",
          text: mensaje,
          confirmButtonText: "Entendido",
        });

        console.error("Error en la solicitud AJAX:", error);
      },
    });
  });
});