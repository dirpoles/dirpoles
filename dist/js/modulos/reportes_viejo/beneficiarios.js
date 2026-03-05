$(document).ready(function () {
  // $("#genero").on("change", function () {
  //   if ($(this).val() === "F") {
  //     $("#embD").show();
  //   } else {
  //     $("#embD").hide();
  //   }
  // });
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

  document
    .getElementById("fecha_inicio")
    .addEventListener("input", function () {
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

  //---------------------------------------------------------------------
  fetch("index.php?action=reportes_beneficiarios&data=1")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const general = data;

        const mapeoCiudades = {
          M: "Morán",
          U: "Urdaneta",
          J: "Jiménez",
          B: "Barquisimeto",
          C: "Crespo",
        };

        const ciudadesUnicas = [
          ...new Set(
            general.map((item) => {
              const ultimoCaracter = item.seccion.slice(-1);
              return mapeoCiudades[ultimoCaracter] || "Desconocido";
            })
          ),
        ];

        const pnfI = document.getElementById("pnf");
        const trayectoI = document.getElementById("trayecto");
        const seccionI = document.getElementById("seccion");
        const sedeI = document.getElementById("sede");

        pnfI.innerHTML = '<option value="" selected>Todos</option>';

        if (Array.isArray(general)) {
          const pnfUnico = [...new Set(general.map((item) => item.nombre_pnf))];
          pnfUnico.forEach((item) => {
            const optionE = document.createElement("option");
            optionE.value = item;
            optionE.textContent = item;
            pnfI.appendChild(optionE);
          });

          const trayectoUnico = [
            ...new Set(general.map((item) => item.seccion[0])),
          ];
          trayectoUnico.forEach((item) => {
            const optionE = document.createElement("option");
            optionE.value = item;
            optionE.textContent = item;
            trayectoI.appendChild(optionE);
          });

          const seccionUnico = [
            ...new Set(
              general.map((item) => item.seccion.slice(1).split("-")[0])
            ),
          ];
          seccionUnico.forEach((item) => {
            const optionE = document.createElement("option");
            optionE.value = item;
            optionE.textContent = item;
            seccionI.appendChild(optionE);
          });

          ciudadesUnicas.forEach((ciudad) => {
            const option = document.createElement("option");
            option.value = ciudad;
            option.textContent = ciudad;
            sedeI.appendChild(option);
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

      // Inicializa DataTables aquí (o llama a una función que lo haga)
      tableGeneral = $("#tabla-resultados").DataTable({
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

              const chartIds = ["chartE", "chartP", "chartG"];
              const chartTitles = [
                "Gráfico por Estado",
                "Gráfico por PNF",
                "Gráfico por Genero",
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

  //------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------
  let realValuesP = [];
  let realValuesE = [];
  let realValuesG = [];
  let realValuesT = [];
  let realValuesS = [];
  let realValuesSD = [];
  let chartP = null;
  let chartE = null;
  let chartG = null;
  let chartT = null;
  let chartS = null;
  let chartSD = null;

  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_beneficiarios",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        console.log(data[0].fecha_creacion);

        if (
          (validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
            validarFechaManual("fecha_fin", "error_fecha_fin")) ||
          ($("#fecha_inicio").val() === "" && $("#fecha_fin").val() === "")
        ) {
          tableGeneral.clear();

          const filteredData = data
            .filter(
              (item) =>
                !$("#fecha_inicio").val() ||
                !$("#fecha_fin").val() ||
                (new Date(item.fecha_creacion.split(" ")[0]) >=
                  new Date($("#fecha_inicio").val()) &&
                  new Date(item.fecha_creacion.split(" ")[0]) <=
                    new Date($("#fecha_fin").val()))
            )
            .filter(
              (item) =>
                !$("#estatus").val() || item.estatus === $("#estatus").val()
            )
            .filter(
              (item) => !$("#pnf").val() || item.nombre_pnf === $("#pnf").val()
            )
            .filter(
              (item) =>
                !$("#genero").val() || item.genero === $("#genero").val()
            )
            .filter(
              (item) =>
                !$("#trayecto").val() ||
                item.seccion[0] === $("#trayecto").val()
            )
            .filter(
              (item) =>
                !$("#seccion").val() ||
                item.seccion.slice(1).split("-")[0] === $("#seccion").val()
            )
            .filter(
              (item) =>
                !$("#sede").val() ||
                (item.seccion.slice(-1) === "M"
                  ? "Morán"
                  : item.seccion.slice(-1) === "U"
                  ? "Urdaneta"
                  : item.seccion.slice(-1) === "J"
                  ? "Jiménez"
                  : item.seccion.slice(-1) === "B"
                  ? "Barquisimeto"
                  : item.seccion.slice(-1) === "C"
                  ? "Crespo"
                  : "Desconocido") === $("#sede").val()
            );

          filteredData.forEach((item) => {
            const dateParts = item.fecha_nac.split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const nombresApellidos = item.nombres + " " + item.apellidos;

            tableGeneral.row.add([
              fecha_formateada,
              nombresApellidos,
              item.tipo_cedula + " - " + item.cedula,
              item.nombre_pnf,
              item.telefono,
              item.direccion,
              item.seccion[0],
              item.seccion.slice(1).split("-")[0],
              item.seccion.slice(-1) === "M"
                ? "Morán"
                : item.seccion.slice(-1) === "U"
                ? "Urdaneta"
                : item.seccion.slice(-1) === "J"
                ? "Jiménez"
                : item.seccion.slice(-1) === "B"
                ? "Barquisimeto"
                : item.seccion.slice(-1) === "C"
                ? "Crespo"
                : "Desconocido",
              item.estatus == 1 ? "Activo" : "Bloqueado",
            ]);
          });

          tableGeneral.draw();

          if (filteredData.length > 0) {
            $("#contenedor-resultados").show();
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
          $("#contenedor-resultados").hide();
        }

        //-----------------------------------GRAFICOS---------------------------------------------------------
        //------------------ESTADO------------------------------------------------
        const sedeMap = {
          M: "Morán",
          U: "Urdaneta",
          J: "Jiménez",
          B: "Barquisimeto",
          C: "Crespo",
        };

        function matches(item) {
          const sede = sedeMap[item.seccion.slice(-1)] || "Desconocido";
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#estatus").val() || item.estatus == $("#estatus").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#trayecto").val() ||
              item.seccion[0] === $("#trayecto").val()) &&
            (!$("#seccion").val() ||
              item.seccion.slice(1).split("-")[0] === $("#seccion").val()) &&
            (!$("#sede").val() || sede === $("#sede").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltrados = data.filter(matches);
        const estatusSet = new Set(datosFiltrados.map((item) => item.estatus));

        const labelsE =
          estatusSet.size > 0
            ? [...estatusSet].map((estatus) =>
                estatus == 1
                  ? "Activo"
                  : estatus == 0
                  ? "Bloqueado"
                  : "Estatus no especificado"
              )
            : ["Estatus no especificado"];

        const dataValuesE = labelsE.map((label) => {
          const valor =
            label === "Activo" ? 1 : label === "Bloqueado" ? 0 : null;
          return valor === null
            ? 0
            : datosFiltrados.filter((item) => item.estatus == valor).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesE = dataValuesE.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesE = dataValuesE; // Se mantienen sin truncar.

        if (chartE) {
          chartE.destroy();
        }

        const ctxE = document.getElementById("chartE").getContext("2d");
        chartE = new Chart(ctxE, {
          type: "bar",
          data: {
            labels: labelsE,
            datasets: [
              {
                label: "Estado",
                data: displayValuesE,
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
                  const realVal = realValuesE[index];

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
                display: true,
                color: "black",
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesE[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //--------------------------------------------------------------------------------
        //------------------PNF------------------------------------------------
        function matchesPNF(item) {
          const sede = sedeMap[item.seccion.slice(-1)] || "Desconocido";
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#estatus").val() || item.estatus == $("#estatus").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#trayecto").val() ||
              item.seccion[0] === $("#trayecto").val()) &&
            (!$("#seccion").val() ||
              item.seccion.slice(1).split("-")[0] === $("#seccion").val()) &&
            (!$("#sede").val() || sede === $("#sede").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosPNF = data.filter(matchesPNF);
        const pnfSet = new Set(
          datosFiltradosPNF.map((item) => item.nombre_pnf)
        );

        const labelsP =
          pnfSet.size > 0
            ? [...pnfSet].map((pnf) => pnf || "PNF no especificado")
            : ["PNF no especificado"];

        const dataValuesP = labelsP.map((pnfFiltro) => {
          return pnfFiltro === "PNF no especificado"
            ? 0
            : datosFiltradosPNF.filter((item) => item.nombre_pnf === pnfFiltro)
                .length;
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

        //--------------------------------------------------------------------------------

        //--------------------------------------------------------------------------------
        //------------------GENERO------------------------------------------------
        function matchesG(item) {
          const sede = sedeMap[item.seccion.slice(-1)] || "Desconocido";
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#estatus").val() || item.estatus == $("#estatus").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#trayecto").val() ||
              item.seccion[0] === $("#trayecto").val()) &&
            (!$("#seccion").val() ||
              item.seccion.slice(1).split("-")[0] === $("#seccion").val()) &&
            (!$("#sede").val() || sede === $("#sede").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosG = data.filter(matchesG);
        const generosUnicos = [
          ...new Set(datosFiltradosG.map((item) => item.genero)),
        ];

        const labelsG =
          generosUnicos.length > 0
            ? generosUnicos.map((g) =>
                g === "M"
                  ? "Masculino"
                  : g === "F"
                  ? "Femenino"
                  : "Género no especificado"
              )
            : ["Género no especificado"];

        const dataValuesG = generosUnicos.map((g) => {
          return datosFiltradosG.filter((item) => item.genero === g).length;
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

        //--------------------------------------------------------------------------------
        //------------------TRAYECTO------------------------------------------------
        function matchesTR(item) {
          const sede = sedeMap[item.seccion.slice(-1)] || "Desconocido";
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#estatus").val() || item.estatus == $("#estatus").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#trayecto").val() ||
              item.seccion[0] === $("#trayecto").val()) &&
            (!$("#seccion").val() ||
              item.seccion.slice(1).split("-")[0] === $("#seccion").val()) &&
            (!$("#sede").val() || sede === $("#sede").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradostr = data.filter(matchesTR);
        const trayectosUnicos = [
          ...new Set(
            datosFiltradostr.map(
              (item) => item.seccion[0] || "Trayecto no especificado"
            )
          ),
        ];

        const labelsT =
          trayectosUnicos.length > 0
            ? trayectosUnicos
            : ["Trayecto no especificado"];

        const dataValuesT = labelsT.map((trayecto) => {
          return trayecto === "Trayecto no especificado"
            ? 0
            : datosFiltradostr.filter((item) => item.seccion[0] === trayecto)
                .length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesT = dataValuesT.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesT = dataValuesT; // Se mantienen sin truncar.

        if (chartT) {
          chartT.destroy();
        }

        const ctxT = document.getElementById("chartT").getContext("2d");
        chartT = new Chart(ctxT, {
          type: "bar",
          data: {
            labels: labelsT,
            datasets: [
              {
                label: "Trayecto",
                data: displayValuesT,
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
                  const realVal = realValuesT[index];

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
                display: true,
                color: "black",
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesT[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //--------------------------------------------------------------------------------
        //------------------SECCION------------------------------------------------

        function matchesSC(item) {
          const sede = sedeMap[item.seccion.slice(-1)] || "Desconocido";
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#estatus").val() || item.estatus == $("#estatus").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#trayecto").val() ||
              item.seccion[0] === $("#trayecto").val()) &&
            (!$("#seccion").val() ||
              item.seccion.slice(1).split("-")[0] === $("#seccion").val()) &&
            (!$("#sede").val() || sede === $("#sede").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosSC = data.filter(matchesSC);
        const seccionesUnicas = [
          ...new Set(
            datosFiltradosSC.map(
              (item) =>
                item.seccion.slice(1).split("-")[0] || "Sección no especificada"
            )
          ),
        ];

        const labelsS =
          seccionesUnicas.length > 0
            ? seccionesUnicas
            : ["Sección no especificada"];

        const dataValuesS = labelsS.map((seccion) => {
          return seccion === "Sección no especificada"
            ? 0
            : datosFiltradosSC.filter(
                (item) => item.seccion.slice(1).split("-")[0] === seccion
              ).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesS = dataValuesS.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesS = dataValuesS; // Se mantienen sin truncar.

        if (chartS) {
          chartS.destroy();
        }

        const ctxS = document.getElementById("chartS").getContext("2d");
        chartS = new Chart(ctxS, {
          type: "bar",
          data: {
            labels: labelsS,
            datasets: [
              {
                label: "Sección",
                data: displayValuesS,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(231, 233, 237, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(46, 125, 50, 0.2)", // Verde bosque
                  "rgba(93, 64, 55, 0.2)", // Marrón tierra
                  "rgba(174, 213, 129, 0.2)", // Verde claro
                  "rgba(255, 241, 118, 0.2)", // Amarillo pastel
                  "rgba(236, 179, 101, 0.2)", // Naranja suave
                  "rgba(100, 181, 246, 0.2)", // Azul cielo
                  "rgba(171, 71, 188, 0.2)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(231, 233, 237, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(46, 125, 50, 1)",
                  "rgba(93, 64, 55, 1)",
                  "rgba(174, 213, 129, 1)",
                  "rgba(255, 241, 118, 1)",
                  "rgba(236, 179, 101, 1)",
                  "rgba(100, 181, 246, 1)",
                  "rgba(171, 71, 188, 1)",
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
                  const realVal = realValuesS[index];

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
                display: true,
                color: "black",
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesS[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //--------------------------------------------------------------------------------
        //------------------SEDE------------------------------------------------
        function matchesSD(item) {
          const sede = sedeMap[item.seccion.slice(-1)] || "Desconocido";
          const fechaItem = new Date(item.fecha_creacion.split(" ")[0]);
          const fechaInicio = $("#fecha_inicio").val()
            ? new Date($("#fecha_inicio").val())
            : null;
          const fechaFin = $("#fecha_fin").val()
            ? new Date($("#fecha_fin").val())
            : null;

          return (
            (!$("#estatus").val() || item.estatus == $("#estatus").val()) &&
            (!$("#genero").val() || item.genero === $("#genero").val()) &&
            (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
            (!$("#trayecto").val() ||
              item.seccion[0] === $("#trayecto").val()) &&
            (!$("#seccion").val() ||
              item.seccion.slice(1).split("-")[0] === $("#seccion").val()) &&
            (!$("#sede").val() || sede === $("#sede").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosSD = data.filter(matchesSD);
        const sedesUnicas = [
          ...new Set(
            datosFiltradosSD.map(
              (item) => sedeMap[item.seccion.slice(-1)] || "Desconocido"
            )
          ),
        ];

        const labelsSD =
          sedesUnicas.length > 0 ? sedesUnicas : ["Sede no especificada"];

        const dataValuesSD = labelsSD.map((sede) => {
          return sede === "Sede no especificada"
            ? 0
            : datosFiltradosSD.filter(
                (item) =>
                  (sedeMap[item.seccion.slice(-1)] || "Desconocido") === sede
              ).length;
        });

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesSD = dataValuesSD.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesSD = dataValuesSD; // Se mantienen sin truncar.

        if (chartSD) {
          chartSD.destroy();
        }

        const ctxSD = document.getElementById("chartSD").getContext("2d");
        chartSD = new Chart(ctxSD, {
          type: "bar",
          data: {
            labels: labelsSD,
            datasets: [
              {
                label: "Sede",
                data: displayValuesSD,
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
                  const realVal = realValuesSD[index];

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
                display: true,
                color: "black",
                formatter: function (value, context) {
                  // Si el valor real es mayor que 10, añade un indicador.
                  const index = context.dataIndex;
                  const realVal = realValuesSD[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
    });
  });
});
