//---------------------------------- VALIDACIONES

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
    event.preventDefault();

    const fechaInicioValida = validarFechaManual(
      "fecha_inicio",
      "error_fecha_inicio"
    );
    const fechaFinValida = validarFechaManual("fecha_fin", "error_fecha_fin");

    if (!fechaInicioValida || !fechaFinValida) {
      Swal.fire({
        icon: "error",
        title: "Formulario invalido.",
        text: "La fecha de inicio y fin no pueden ser fechas futuras.",
        confirmButtonText: "Entendido",
      });
      return;
    }
  });

//------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    fetch("index.php?action=reportes_jornadas&data=1")
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const general = data;

          const tipoI = document.getElementById("tipo");
          const ubicacionI = document.getElementById("ubicacion");
          const estadoI = document.getElementById("estado");

          tipoI.innerHTML = '<option value="" selected>Todos</option>';
          ubicacionI.innerHTML = '<option value="" selected>Todos</option>'
          estadoI.innerHTML = '<option value="" selected>Todos</option>';

          if (Array.isArray(general)) {
            general.forEach((item) => {
              const optionT = document.createElement("option");
              optionT.value = item.tipo_jornada;
              optionT.textContent = item.tipo_jornada;
              tipoI.appendChild(optionT);
            });

            const ubicacionUnicas = [
                ...new Set(general.map((item) => item.ubicacion)),
              ];
              ubicacionUnicas.forEach((item) => {
                const optionE = document.createElement("option");
                optionE.value = item;
                optionE.textContent = item;
                ubicacionI.appendChild(optionE);
              });

            const estadosUnicos = [
                ...new Set(general.map((item) => item.estatus)),
              ];
              estadosUnicos.forEach((item) => {
                const optionE = document.createElement("option");
                optionE.value = item;
                optionE.textContent = item;
                estadoI.appendChild(optionE);
              });
          }
        }
      })
      .catch((error) => console.error("Error al cargar la data de filtros:", error));
    });

//-------------------------------------------- DATATABLE -------------------------

$(document).ready(function () {
  let config = {};
  let tabla;

  fetch("api/endpoint.php")
    .then((response) => response.json())
    .then((data) => {
      config = data; // Guarda las constantes en el objeto config
      console.log("Configuración cargada:", config);

      // Inicializa DataTables aquí (o llama a una función que lo haga)
      tabla = $("#tabla").DataTable({
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
            title: "Reporte Jornadas",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte Jornadas",
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
              const pageInfo = tabla.page.info();
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

              const chartIds = ["chartT", "chartU", "chartE"];
              const chartTitles = [
                "Gráfico por Tipo de Jornada",
                "Gráfico por Ubicación de Jornada",
                "Gráfico por Estado de Jornada",
              ];

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

  //----VALORES DE CHARTS----
  let realValuesT = [];
  let realValuesU = [];
  let realValuesE = [];
  let chartT = null;
  let chartU = null;
  let chartE = null;

  let filteredData = null;

  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_jornadas",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        if (
          validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
          validarFechaManual("fecha_fin", "error_fecha_fin")
        ) {
          tabla.clear();

          filteredData = data
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
                !$("#tipo").val() || item.tipo_jornada === $("#tipo").val()
            )
            .filter(
              (item) => !$("#ubicacion").val() || item.ubicacion === $("#ubicacion").val()
            )
            .filter(
              (item) =>
                !$("#estado").val() || item.estatus === $("#estado").val()
            );

          filteredData.forEach((item) => {
            const fecha_formateada = item.fecha_creacion.split(" ")[0].split("-").reverse().join("-");

            tabla.row.add([
              fecha_formateada,
              item.nombre_jornada,
              item.tipo_jornada,
              item.ubicacion,
              item.estatus
            ]);
          });

          tabla.draw();

          if (filteredData.length > 0) {
            $("#contenedor").show();
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
          tabla.clear().draw();
        }

        //-----------------------------------GRAFICOS---------------------------------------------------------
        //------------------TIPO DE JORNADA------------------------------------------------
        const tiposPresentes = new Set(data.filter(item => 
          (!$("#ubicacion").val() || item.ubicacion === $("#ubicacion").val()) &&
          (!$("#estado").val() || item.estatus === $("#estado").val()) &&
          (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
           (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
            new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val()))))
        .map(item => item.tipo_jornada || "Tipo desconocido"));

        const labelsT = $("#tipo").val() 
          ? [$("#tipo").val()] 
          : Array.from(tiposPresentes);

        const dataValuesT = labelsT.map(tipo => 
          data.filter(item => 
            item.tipo_jornada === (tipo === "Tipo desconocido" ? "" : tipo) &&
            (!$("#ubicacion").val() || item.ubicacion === $("#ubicacion").val()) &&
            (!$("#estado").val() || item.estatus === $("#estado").val()) &&
            (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
             (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
              new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val())))
          ).length
        );

        const displayValuesT = dataValuesT.map(v => v > 10 ? 10 : v);
        realValuesT = dataValuesT;

        if (chartT) chartT.destroy();

        if (labelsT.length > 0) {
          chartT = new Chart(document.getElementById("chartT").getContext("2d"), {
            type: "bar",
            data: {
              labels: labelsT,
              datasets: [{
                label: "Tipo de Jornada",
                data: displayValuesT,
                backgroundColor: labelsT.map((_, i) => 
                  `rgba(${(75 + i * 50) % 255}, ${(192 - i * 30) % 255}, ${(192 + i * 20) % 255}, 0.2)`),
                borderColor: labelsT.map((_, i) => 
                  `rgba(${(75 + i * 50) % 255}, ${(192 - i * 30) % 255}, ${(192 + i * 20) % 255}, 1)`),
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
                    const realVal = realValuesT[tooltipItem.index];
                    return `${data.labels[tooltipItem.index]}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
                  }
                }
              },
              legend: { labels: { boxWidth: 0, fontSize: 20 } },
              plugins: {
                datalabels: {
                  display: true,
                  color: "black",
                  formatter: (value, ctx) => realValuesT[ctx.dataIndex] > 10 ? "10+" : realValuesT[ctx.dataIndex]
                }
              }
            },
            plugins: [ChartDataLabels]
          });
        } else {
          document.getElementById("chartT-container").innerHTML = "<p>No hay datos de tipos de jornada para mostrar</p>";
        }

        //------------------UBICACION------------------------------------------------
        const ubicacionesPresentes = new Set(data.filter(item => 
          (!$("#tipo").val() || item.tipo_jornada === $("#tipo").val()) &&
          (!$("#estado").val() || item.estatus === $("#estado").val()) &&
          (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
           (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
            new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val()))))
        .map(item => item.ubicacion || "Ubicación desconocida"));

        const labelsU = $("#ubicacion").val() 
          ? [$("#ubicacion").val()] 
          : Array.from(ubicacionesPresentes);

        const dataValuesU = labelsU.map(ubicacion => 
          data.filter(item => 
            item.ubicacion === (ubicacion === "Ubicación desconocida" ? "" : ubicacion) &&
            (!$("#tipo").val() || item.tipo_jornada === $("#tipo").val()) &&
            (!$("#estado").val() || item.estatus === $("#estado").val()) &&
            (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
             (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
              new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val())))
          ).length
        );

        const displayValuesU = dataValuesU.map(v => v > 10 ? 10 : v);
        realValuesU = dataValuesU;

        if (chartU) chartU.destroy();

        if (labelsU.length > 0) {
          chartU = new Chart(document.getElementById("chartU").getContext("2d"), {
            type: "bar",
            data: {
              labels: labelsU,
              datasets: [{
                label: "Ubicación",
                data: displayValuesU,
                backgroundColor: labelsU.map((_, i) => 
                  `rgba(${(54 + i * 60) % 255}, ${(162 + i * 20) % 255}, ${(235 - i * 30) % 255}, 0.2)`),
                borderColor: labelsU.map((_, i) => 
                  `rgba(${(54 + i * 60) % 255}, ${(162 + i * 20) % 255}, ${(235 - i * 30) % 255}, 1)`),
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
                    const realVal = realValuesU[tooltipItem.index];
                    return `${data.labels[tooltipItem.index]}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
                  }
                }
              },
              legend: { labels: { boxWidth: 0, fontSize: 20 } },
              plugins: {
                datalabels: {
                  display: true,
                  color: "black",
                  formatter: (value, ctx) => realValuesU[ctx.dataIndex] > 10 ? "10+" : realValuesU[ctx.dataIndex]
                }
              }
            },
            plugins: [ChartDataLabels]
          });
        } else {
          document.getElementById("chartU-container").innerHTML = "<p>No hay datos de ubicaciones para mostrar</p>";
        }

        //------------------ESTADO------------------------------------------------
        const estadosPresentes = new Set(data.filter(item => 
          (!$("#tipo").val() || item.tipo_jornada === $("#tipo").val()) &&
          (!$("#ubicacion").val() || item.ubicacion === $("#ubicacion").val()) &&
          (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
           (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
            new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val()))))
        .map(item => item.estatus || "Estado desconocido"));

        const labelsE = $("#estado").val() 
          ? [$("#estado").val()] 
          : Array.from(estadosPresentes);

        const dataValuesE = labelsE.map(estado => 
          data.filter(item => 
            item.estatus === (estado === "Estado desconocido" ? "" : estado) &&
            (!$("#tipo").val() || item.tipo_jornada === $("#tipo").val()) &&
            (!$("#ubicacion").val() || item.ubicacion === $("#ubicacion").val()) &&
            (!$("#fecha_inicio").val() || !$("#fecha_fin").val() || 
             (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) && 
              new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val())))
          ).length
        );

        const displayValuesE = dataValuesE.map(v => v > 10 ? 10 : v);
        realValuesE = dataValuesE;

        if (chartE) chartE.destroy();

        if (labelsE.length > 0) {
          chartE = new Chart(document.getElementById("chartE").getContext("2d"), {
            type: "bar",
            data: {
              labels: labelsE,
              datasets: [{
                label: "Estado",
                data: displayValuesE,
                backgroundColor: labelsE.map((_, i) => 
                  `rgba(${(255 + i * 40) % 255}, ${(99 + i * 30) % 255}, ${(132 - i * 20) % 255}, 0.2)`),
                borderColor: labelsE.map((_, i) => 
                  `rgba(${(255 + i * 40) % 255}, ${(99 + i * 30) % 255}, ${(132 - i * 20) % 255}, 1)`),
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
                    const realVal = realValuesE[tooltipItem.index];
                    return `${data.labels[tooltipItem.index]}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
                  }
                }
              },
              legend: { labels: { boxWidth: 0, fontSize: 20 } },
              plugins: {
                datalabels: {
                  display: true,
                  color: "black",
                  formatter: (value, ctx) => realValuesE[ctx.dataIndex] > 10 ? "10+" : realValuesE[ctx.dataIndex]
                }
              }
            },
            plugins: [ChartDataLabels]
          });
        } else {
          document.getElementById("chartE-container").innerHTML = "<p>No hay datos de estados para mostrar</p>";
        }
      },
      error: function (xhr, status, error) {
        let mensaje = "Ha ocurrido un error inesperado.";

        try {
          const response = xhr.responseText
            ? JSON.parse(xhr.responseText)
            : null;
          if (response && response.message) {
            mensaje = response.message;
          }
        } catch (e) {
          console.error("Error al parsear respuesta:", e);
          if (xhr.responseText) {
            mensaje = xhr.responseText;
          }
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