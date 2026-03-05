//-------------------------------------------- VALIDACIONES
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

$(document).ready(function () {
  fetch("index.php?action=reportes_general&data=1")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const general = data;

        const areaI = document.getElementById("area");
        const pnfI = document.getElementById("pnf");

        areaI.innerHTML = '<option value="" selected>Todos</option>';
        pnfI.innerHTML = '<option value="" selected>Todos</option>';

        if (Array.isArray(general)) {
          const areaUnicas = [
            ...new Set(general.map((item) => item.nombre_serv)),
          ];
          areaUnicas.forEach((item) => {
            const optionE = document.createElement("option");
            optionE.value = item;
            optionE.textContent = item;
            areaI.appendChild(optionE);
          });

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

  //-------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------

  let config = {};
  let tableGeneral;

  fetch("api/endpoint.php")
    .then((response) => response.json())
    .then((data) => {
      config = data; // Guarda las constantes en el objeto config
      console.log("Configuración cargada:", config);

      // Inicializa DataTables aquí (o llama a una función que lo haga)
      tableGeneral = $("#tabla_general").DataTable({
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
            title: "Reporte General",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte General",
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
              const pageInfo = tableGeneral.page.info();
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

              const chartIds = ["chartG", "chartP", "chartA"];
              const chartTitles = [
                "Gráfico por Genero",
                "Gráfico por PNF",
                "Gráfico por Area",
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
                    width: 800, // Aumenta este valor para hacer más grande el gráfico
                    alignment: "center",
                    margin: [0, 30, 0, 20], // Ajusta márgenes para centrar verticalmente
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

              const canvas = document.getElementById("chartGeneral");
              const chartImage = canvas.toDataURL("image/png");

              // 3. Agregar página adicional con el gráfico
              doc.content.push({
                pageBreak: "before", // Forza nueva página
                text: "Resumen Gráfico",
                style: "header",
                alignment: "center",
                margin: [0, 20, 0, 10],
              });

              doc.content.push({
                image: chartImage,
                width: 800,
                alignment: "center",
                margin: [0, 100, 0, 20],
              });

              doc.content.push({
                text: "Las barras que tengan 10+ indican que hay más de 10 registros existentes.",
                alignment: "center",
                margin: [0, 0, 0, 20],
                fontSize: 12,
                italics: true,
                color: "#444444",
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

  //-----------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------

  let realValues = [];
  let chartGeneral = null;
  let realValuesP = [];
  let chartP = null;
  let realValuesG = [];
  let chartG = null;

  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_general",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        console.log(data.tabla);

        if (
          (validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
            validarFechaManual("fecha_fin", "error_fecha_fin")) ||
          ($("fecha_inicio").val() === "" && $("fecha_fin").val() === "")
        ) {
          tableGeneral.clear();

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
                !$("#area").val() || item.nombre_serv === $("#area").val()
            )
            .filter(
              (item) => !$("#pnf").val() || item.nombre_pnf === $("#pnf").val()
            )
            .filter(
              (item) =>
                !$("#genero").val() || item.genero === $("#genero").val()
            );

          filteredData.forEach((item) => {
            const dateParts = item.fecha_creacion.split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const nombresApellidos = item.nombres + " " + item.apellidos;

            tableGeneral.row.add([
              fecha_formateada,
              nombresApellidos,
              item.cedula,
              item.nombre_pnf,
              item.nombre_serv,
            ]);
          });

          tableGeneral.draw();

          if (data.length > 0) {
            $("#contenedor_general").show();
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
          tableGeneral.clear().draw();
          $("#contenedor_general").hide();
        }

        //----------------------------------------------GRAFICOS-----------------------------------------
        //-------------------------------------------------------------------------------------------------
        //--------------------------------------------GENERO--------------------------------------------------

        const generoMap = {
          M: "Masculino",
          F: "Femenino",
        };

        function matches(item) {
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#area").val() || item.nombre_serv === $("#area").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltrados = data.filter(matches);

        // Obtener géneros únicos de los datos ya filtrados
        const generosUnicos = [
          ...new Set(datosFiltrados.map((item) => item.genero)),
        ];

        // Mapear a labels legibles (si no existe, usa "Género no especificado")
        const labelsG = generosUnicos.length
          ? generosUnicos.map((g) => generoMap[g] || "Género no especificado")
          : ["Género no especificado"];

        // Contar directamente desde datosFiltrados (sin reconversión innecesaria)
        const dataValuesG = generosUnicos.map((g) => {
          return datosFiltrados.filter((item) => item.genero === g).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesG = dataValuesG.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesG = dataValuesG; // Se mantienen sin truncar.

        if (chartG) {
          chartG.destroy();
        }

        const ctxG = document.getElementById("chartG").getContext("2d");
        chartG = new Chart(ctxG, {
          type: "bar",
          data: {
            labels: labelsG,
            datasets: [
              {
                label: "Genero",
                data: displayValuesG,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(231, 233, 237, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(231, 233, 237, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesG[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
                },
              },
            },
            legend: {
              labels: {
                boxWidth: 0,
                fontSize: 20,
              },
            },
            plugins: {
              datalabels: {
                // Si usas chartjs-plugin-datalabels para mostrar etiquetas encima de cada barra
                display: true,
                color: "black",
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesG[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-------------------------------------------------------------------------------------------------
        //--------------------------------------------PNF--------------------------------------------------
        function matchespnf(item) {
          const fechaItem = new Date(item.fecha_creacion);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#area").val() || item.nombre_serv === $("#area").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosG = data.filter(matchespnf);

        const pnfSet = $("#pnf").val()
          ? new Set([$("#pnf").val()])
          : new Set(datosFiltradosG.map((item) => item.nombre_pnf));

        const labelsP =
          pnfSet.size > 0
            ? [...pnfSet].map((nombre) => nombre || "PNF no especificado")
            : ["PNF no especificado"];

        const dataValuesP = labelsP.map((nombre) => {
          if (nombre === "PNF no especificado") return 0;

          return datosFiltradosG.filter(
            (item) =>
              item.nombre_pnf === nombre &&
              (!$("#genero").val() || item.genero === $("#genero").val()) &&
              (!$("#area").val() || item.nombre_serv === $("#area").val())
          ).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesP = dataValuesP.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesP = dataValuesP; // Se mantienen sin truncar.

        if (chartP) {
          chartP.destroy();
        }

        const ctxP = document.getElementById("chartP").getContext("2d");
        chartP = new Chart(ctxP, {
          type: "bar",
          data: {
            labels: labelsP,
            datasets: [
              {
                label: "PNF",
                data: displayValuesP,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(231, 233, 237, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(231, 233, 237, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValuesP[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
                },
              },
            },
            legend: {
              labels: {
                boxWidth: 0,
                fontSize: 20,
              },
            },
            plugins: {
              datalabels: {
                // Si usas chartjs-plugin-datalabels para mostrar etiquetas encima de cada barra
                display: true,
                color: "black",
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesP[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //-------------------------------------------------------------------------------------------------
        //--------------------------------------------AREA--------------------------------------------------
        function matchesA(item) {
          const fechaItem = new Date(item.fecha_creacion);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#area").val() || item.nombre_serv === $("#area").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        // First filter all data with the complete criteria
        const datosFiltradosA = data.filter(matchesA);

        // Generate area labels
        const areaSet = $("#area").val()
          ? new Set([$("#area").val()])
          : new Set(datosFiltradosA.map((item) => item.nombre_serv));

        const labels =
          areaSet.size > 0
            ? [...areaSet].map((area) => area || "Área desconocida")
            : ["Área desconocida"];

        // Calculate values using the ALREADY FILTERED data
        const dataValues = labels.map((area) => {
          if (area === "Área desconocida") return 0;

          return datosFiltradosA.filter(
            (item) =>
              item.nombre_serv === area &&
              (!$("#genero").val() || item.genero === $("#genero").val()) &&
              (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val())
          ).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValues = dataValues.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValues = dataValues; // Se mantienen sin truncar.

        if (chartGeneral) {
          chartGeneral.destroy();
        }

        const ctx = document.getElementById("chartGeneral").getContext("2d");
        chartGeneral = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Area",
                data: displayValues,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(231, 233, 237, 0.76)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(231, 233, 237, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const realVal = realValues[index];

                  if (realVal > 10) {
                    return `${label}: ${realVal} (más de 10)`;
                  } else {
                    return `${label}: ${realVal}`;
                  }
                },
              },
            },
            legend: {
              labels: {
                boxWidth: 0,
                fontSize: 20,
              },
            },
            plugins: {
              datalabels: {
                // Si usas chartjs-plugin-datalabels para mostrar etiquetas encima de cada barra
                display: true,
                color: "black",
                formatter: function (value, context) {
                  console.log(realValues);
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValues[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },

      error: function (xhr, status, error) {
        let mensaje = "Ha ocurrido un error inesperado.";

        // Intenta extraer el mensaje de error si está en formato JSON
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
