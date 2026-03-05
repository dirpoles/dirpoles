$("#tipoReporte").on("change", function () {
  if ($(this).val() === "morbilidad") {
    $(".divM").show();
    $(".divI").hide();
  } else {
    $(".divM").hide();
    $(".divI").show();
  }
});

//------------------------------------------------ VALIDACIONES

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

function validarTipoReporte() {
  const tipoReporte = document.getElementById("tipoReporte").value;
  const tipoError = document.getElementById("error_tipoReporte");

  if (!tipoReporte) {
    tipoError.textContent = "Este campo no puede estar vacío.";
    return false;
  } else {
    tipoError.textContent = "";
    return true;
  }
}

document.getElementById("fecha_inicio").addEventListener("input", function () {
  validarFechaManual("fecha_inicio", "error_fecha_inicio");
});

document.getElementById("fecha_fin").addEventListener("input", function () {
  validarFechaManual("fecha_fin", "error_fecha_fin");
});

document.getElementById("tipoReporte").addEventListener("change", function () {
  validarTipoReporte();
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
    const tipoReporteValido = validarTipoReporte();

    if (!fechaInicioValida || !fechaFinValida) {
      Swal.fire({
        icon: "error",
        title: "Formulario invalido.",
        text: "La fecha de inicio y fin no pueden ser fechas futuras.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (!tipoReporteValido) {
      Swal.fire({
        icon: "error",
        title: "Formulario invalido.",
        text: "El tipo de reporte no puede estar vacio.",
        confirmButtonText: "Entendido",
      });
      return;
    }
  });

//---------------------------------------------------------------------

$(document).ready(function () {
  const tipoReporte = document.getElementById("tipoReporte");

  tipoReporte.addEventListener("change", cargarData);

  function cargarData() {
    const tipoReport = tipoReporte.value;

    if (tipoReport === "morbilidad") {
      fetch("index.php?action=reportes_medicina&data=1")
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const general = data;

            const tipoI = document.getElementById("tipo");
            const pnfI = document.getElementById("pnf");

            tipoI.innerHTML = '<option value="" selected>Todos</option>';
            pnfI.innerHTML = '<option value="" selected>Todos</option>';

            if (Array.isArray(general)) {
              const tipoUnicas = [
                ...new Set(general.map((item) => item.tipo_sangre)),
              ];
              tipoUnicas.forEach((item) => {
                const optionE = document.createElement("option");
                optionE.value = item;
                optionE.textContent = item;
                tipoI.appendChild(optionE);
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
    } else if (tipoReport === "inventario") {
      fetch("index.php?action=reportes_medicina&data=2")
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const general = data;

            const tipoI = document.getElementById("tipoI");
            const estadoI = document.getElementById("estadoI");
            const preI = document.getElementById("pre");

            tipoI.innerHTML = '<option value="" selected>Todos</option>';
            estadoI.innerHTML = '<option value="" selected>Todos</option>';
            preI.innerHTML = '<option value="" selected>Todos</option>';

            if (Array.isArray(general)) {
              const tipoUnicas = [
                ...new Set(general.map((item) => item.tipo_insumo)),
              ];
              tipoUnicas.forEach((item) => {
                const optionE = document.createElement("option");
                optionE.value = item;
                optionE.textContent = item;
                tipoI.appendChild(optionE);
              });

              const estadoUnicas = [
                ...new Set(general.map((item) => item.estatus)),
              ];
              estadoUnicas.forEach((item) => {
                const optionE = document.createElement("option");
                optionE.value = item;
                optionE.textContent = item;
                estadoI.appendChild(optionE);
              });

              const preUnicas = [
                ...new Set(general.map((item) => item.nombre_presentacion)),
              ];
              preUnicas.forEach((item) => {
                const optionE = document.createElement("option");
                optionE.value = item;
                optionE.textContent = item;
                preI.appendChild(optionE);
              });
            }
          }
        })
        .catch((error) =>
          console.error("Error al cargar la data de filtros:", error)
        );
    }
  }

  //-------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------

  let config = {};
  let tableMed;
  let tableInv;

  fetch("api/endpoint.php")
    .then((response) => response.json())
    .then((data) => {
      config = data; // Guarda las constantes en el objeto config
      console.log("Configuración cargada:", config);

      // Inicializa DataTables aquí (o llama a una función que lo haga)
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
            text: '<i class="far fa-file-excel"></i> Exportar a Excel',
            title: "Reporte Medicina",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte Medicina",
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
              const pageInfo = tableMed.page.info();
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

              const chartIds = ["chartG", "chartP", "chartT"];
              const chartTitles = [
                "Gráfico por Genero",
                "Gráfico por PNF",
                "Gráfico por Tipo de Sangre",
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

      tableInv = $("#tabla_i").DataTable({
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
            title: "Reporte Inventario Medico",
            className: "btn btn-success",
          },
          {
            extend: "pdfHtml5",
            text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
            title: "Reporte Inventario Medico",
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
              const pageInfo = tableMed.page.info();
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

              const chartIds = ["chartE", "chartTI", "chartPre"];
              const chartTitles = [
                "Gráfico por Estado",
                "Gráfico por Tipo de Insumo",
                "Gráfico por Presentacion de Insumo",
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

  //------------------------------------------------------

  let realValuesG = [];
  let realValuesP = [];
  let realValuesT = [];
  let chartG = null;
  let chartP = null;
  let chartT = null;

  let realValuesE = [];
  let realValuesTI = [];
  let realValuesPRE = [];
  let chartE = null;
  let chartTI = null;
  let chartPRE = null;

  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_medicina",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        if (
          $("#tipoReporte").val() === "morbilidad" &&
          validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
          validarFechaManual("fecha_fin", "error_fecha_fin")
        ) {
          tableMed.clear();

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
                !$("#tipo").val() || item.tipo_sangre === $("#tipo").val()
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

            tableMed.row.add([
              fecha_formateada,
              nombresApellidos,
              item.cedula,
              item.nombre_pnf,
              item.estatura,
              item.peso,
              item.tipo_sangre,
              item.motivo_visita,
            ]);
          });

          tableMed.draw();

          if (filteredData.length > 0) {
            $("#contenedor_medicina").show();
            $("#contenedor_i").hide();
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
        } else if (
          $("#tipoReporte").val() === "inventario" &&
          validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
          validarFechaManual("fecha_fin", "error_fecha_fin")
        ) {
          tableInv.clear();

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
                !$("#tipoI").val() || item.tipo_insumo === $("#tipoI").val()
            )
            .filter(
              (item) =>
                !$("#estadoI").val() || item.estatus === $("#estadoI").val()
            )
            .filter(
              (item) =>
                !$("#pre").val() || item.nombre_presentacion === $("#pre").val()
            );

          filteredData.forEach((item) => {
            const dateParts = item.fecha_creacion.split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            tableInv.row.add([
              fecha_formateada,
              item.cantidad == 0
                ? "Agotado"
                : item.cantidad <= 10
                ? "Bajo"
                : item.cantidad >= 500
                ? "Maximo"
                : "Disponible",
              item.nombre_insumo,
              item.tipo_insumo,
              item.nombre_presentacion,
              item.cantidad,
              item.estatus,
            ]);
          });

          tableInv.draw();

          if (filteredData.length > 0) {
            $("#contenedor_i").show();
            $("#contenedor_medicina").hide();
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
          tableInv.clear().draw();
          tableMed.clear().draw();
        }

        //-----------------------------------GRAFICOS---------------------------------------------------------
        //------------------GENERO------------------------------------------------
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
            (!$("#tipo").val() || item.tipo_sangre === $("#tipo").val()) &&
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
        //------------------PNF------------------------------------------------
        function matchesPNF(item) {
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
            (!$("#tipo").val() || item.tipo_sangre === $("#tipo").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        // 1. Primero filtramos TODOS los datos con los criterios completos
        const datosFiltradosPNF = data.filter(matchesPNF);

        // 2. Generamos los labels de PNF
        const pnfSet = new Set(
          datosFiltradosPNF.map((item) => item.nombre_pnf)
        );
        const labelsP = pnfSet.size > 0 ? [...pnfSet] : ["PNF no especificado"];

        // 3. Calculamos los valores usando los datos YA FILTRADOS
        const dataValuesP = labelsP.map((label) => {
          return label === "PNF no especificado"
            ? 0
            : datosFiltradosPNF.filter((item) => item.nombre_pnf === label)
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
        //------------------TIPO SANGRE------------------------------------------------
        function matchesTS(item) {
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
            (!$("#tipo").val() || item.tipo_sangre === $("#tipo").val()) &&
            (!fechaInicio || fechaItem >= fechaInicio) &&
            (!fechaFin || fechaItem <= fechaFin)
          );
        }

        const datosFiltradosTS = data.filter(matchesTS);
        const tipoSet = new Set(
          datosFiltradosTS.map((item) => item.tipo_sangre)
        );
        const labelsT =
          tipoSet.size > 0 ? [...tipoSet] : ["Tipo no especificado"];

        const dataValuesT = labelsT.map((label) => {
          return label === "Tipo no especificado"
            ? 0
            : datosFiltradosTS.filter((item) => item.tipo_sangre === label)
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
                label: "Tipo de Sangre",
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

        //-----------------------------------INVENTARIO---------------------------------------------------------
        //------------------ESTADO------------------------------------------------
        const labelsE =
          $("#estadoI").val() && $("#tipoI").val() && $("#pre").val()
            ? [
                // Todos los campos - prioriza estado
                data.find(
                  (item) =>
                    item.estatus == $("#estadoI").val() &&
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                )?.estatus || "Estado no encontrado",
              ]
            : $("#estadoI").val() && $("#tipoI").val()
            ? [
                // Estado + Tipo Insumo
                data.find(
                  (item) =>
                    item.estatus == $("#estadoI").val() &&
                    item.tipo_insumo === $("#tipoI").val()
                )?.estatus || "Estado no encontrado",
              ]
            : $("#estadoI").val() && $("#pre").val()
            ? [
                // Estado + Presentación
                data.find(
                  (item) =>
                    item.estatus == $("#estadoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                )?.estatus || "Estado no encontrado",
              ]
            : $("#estadoI").val()
            ? [
                // Solo Estado
                data.find((item) => item.estatus == $("#estadoI").val())
                  ?.estatus || "Estado no encontrado",
              ]
            : $("#tipoI").val() && $("#pre").val()
            ? [
                // Tipo Insumo + Presentación (sin estado)
                data.find(
                  (item) =>
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                )?.estatus || "Estado no encontrado",
              ]
            : $("#tipoI").val()
            ? [
                // Solo Tipo Insumo
                data.find((item) => item.tipo_insumo === $("#tipoI").val())
                  ?.estatus || "Estado no encontrado",
              ]
            : $("#pre").val()
            ? [
                // Solo Presentación
                data.find(
                  (item) => item.nombre_presentacion === $("#pre").val()
                )?.estatus || "Estado no encontrado",
              ]
            : [
                // Sin filtros - muestra todos los estados únicos
                ...new Set(data.map((item) => item.estatus)),
              ].map((estado) => estado || "Estado no encontrado");

        const dataValuesE =
          $("#estadoI").val() && $("#tipoI").val() && $("#pre").val()
            ? [
                data.filter(
                  (item) =>
                    item.estatus == $("#estadoI").val() &&
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                ).length,
              ]
            : $("#estadoI").val() && $("#tipoI").val()
            ? [
                data.filter(
                  (item) =>
                    item.estatus == $("#estadoI").val() &&
                    item.tipo_insumo === $("#tipoI").val()
                ).length,
              ]
            : $("#estadoI").val() && $("#pre").val()
            ? [
                data.filter(
                  (item) =>
                    item.estatus == $("#estadoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                ).length,
              ]
            : $("#estadoI").val()
            ? [
                data.filter((item) => item.estatus == $("#estadoI").val())
                  .length,
              ]
            : $("#tipoI").val() && $("#pre").val()
            ? [
                data.filter(
                  (item) =>
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                ).length,
              ]
            : $("#tipoI").val()
            ? [
                data.filter((item) => item.tipo_insumo === $("#tipoI").val())
                  .length,
              ]
            : $("#pre").val()
            ? [
                data.filter(
                  (item) => item.nombre_presentacion === $("#pre").val()
                ).length,
              ]
            : [
                // Sin filtros: mostrar todos los estados únicos
                ...new Set(data.map((item) => item.estatus)),
              ].map(
                (estado) => data.filter((item) => item.estatus == estado).length
              );

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
        //------------------TIPO DE INSUMOS------------------------------------------------
        const labelsTI =
          $("#tipoI").val() && $("#estadoI").val() && $("#pre").val()
            ? [
                // Tipo + Estado + Presentación
                data.find(
                  (item) =>
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.estatus == $("#estadoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                )?.tipo_insumo || "Tipo no especificado",
              ]
            : $("#tipoI").val() && $("#estadoI").val()
            ? [
                // Tipo + Estado
                data.find(
                  (item) =>
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.estatus == $("#estadoI").val()
                )?.tipo_insumo || "Tipo no especificado",
              ]
            : $("#tipoI").val() && $("#pre").val()
            ? [
                // Tipo + Presentación
                data.find(
                  (item) =>
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                )?.tipo_insumo || "Tipo no especificado",
              ]
            : $("#tipoI").val()
            ? [
                // Solo Tipo
                data.find((item) => item.tipo_insumo === $("#tipoI").val())
                  ?.tipo_insumo || "Tipo no especificado",
              ]
            : $("#estadoI").val() && $("#pre").val()
            ? [
                // Estado + Presentación (sin Tipo) – mostrar todos los tipos relacionados
                ...new Set(
                  data
                    .filter(
                      (item) =>
                        item.estatus == $("#estadoI").val() &&
                        item.nombre_presentacion === $("#pre").val()
                    )
                    .map((item) => item.tipo_insumo)
                ),
              ].map((tipo) => tipo || "Tipo no especificado")
            : $("#estadoI").val()
            ? [
                // Solo Estado – tipos relacionados
                ...new Set(
                  data
                    .filter((item) => item.estatus == $("#estadoI").val())
                    .map((item) => item.tipo_insumo)
                ),
              ].map((tipo) => tipo || "Tipo no especificado")
            : $("#pre").val()
            ? [
                // Solo Presentación – tipos relacionados
                ...new Set(
                  data
                    .filter(
                      (item) => item.nombre_presentacion === $("#pre").val()
                    )
                    .map((item) => item.tipo_insumo)
                ),
              ].map((tipo) => tipo || "Tipo no especificado")
            : [
                // Sin filtros – mostrar todos los tipos únicos
                ...new Set(data.map((item) => item.tipo_insumo)),
              ].map((tipo) => tipo || "Tipo no especificado");

        const dataValuesTI =
          $("#tipoI").val() && $("#estadoI").val() && $("#pre").val()
            ? [
                data.filter(
                  (item) =>
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.estatus == $("#estadoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                ).length,
              ]
            : $("#tipoI").val() && $("#estadoI").val()
            ? [
                data.filter(
                  (item) =>
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.estatus == $("#estadoI").val()
                ).length,
              ]
            : $("#tipoI").val() && $("#pre").val()
            ? [
                data.filter(
                  (item) =>
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                ).length,
              ]
            : $("#tipoI").val()
            ? [
                data.filter((item) => item.tipo_insumo === $("#tipoI").val())
                  .length,
              ]
            : $("#estadoI").val() && $("#pre").val()
            ? [
                data.filter(
                  (item) =>
                    item.estatus == $("#estadoI").val() &&
                    item.nombre_presentacion === $("#pre").val()
                ).length,
              ]
            : $("#estadoI").val()
            ? [
                data.filter((item) => item.estatus == $("#estadoI").val())
                  .length,
              ]
            : $("#pre").val()
            ? [
                // Mostrar todos los tipos de insumo relacionados con la presentación seleccionada
                ...new Set(
                  data
                    .filter(
                      (item) => item.nombre_presentacion === $("#pre").val()
                    )
                    .map((item) => item.tipo_insumo)
                ),
              ].map(
                (tipo) =>
                  data.filter(
                    (item) =>
                      item.tipo_insumo === tipo &&
                      item.nombre_presentacion === $("#pre").val()
                  ).length
              )
            : [
                // Sin filtros: mostrar cantidad por cada tipo_insumo único
                ...new Set(data.map((item) => item.tipo_insumo)),
              ].map(
                (tipo) =>
                  data.filter((item) => item.tipo_insumo === tipo).length
              );

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesTI = dataValuesTI.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesTI = dataValuesTI; // Se mantienen sin truncar.

        if (chartTI) {
          chartTI.destroy();
        }

        const ctxTI = document.getElementById("chartTI").getContext("2d");
        chartTI = new Chart(ctxTI, {
          type: "bar",
          data: {
            labels: labelsTI,
            datasets: [
              {
                label: "Tipo de Insumo",
                data: displayValuesTI,
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
                  const realVal = realValuesTI[index];

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
                  const realVal = realValuesTI[index];
                  return realVal > 10 ? "10+" : realVal;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });

        //--------------------------------------------------------------------------------
        //------------------PRESENTACION------------------------------------------------
        const labelsPRE =
          $("#pre").val() && $("#tipoI").val() && $("#estadoI").val()
            ? [
                data.find(
                  (item) =>
                    item.nombre_presentacion === $("#pre").val() &&
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.estatus == $("#estadoI").val()
                )?.nombre_presentacion || "Presentación no especificada",
              ]
            : $("#pre").val() && $("#tipoI").val()
            ? [
                data.find(
                  (item) =>
                    item.nombre_presentacion === $("#pre").val() &&
                    item.tipo_insumo === $("#tipoI").val()
                )?.nombre_presentacion || "Presentación no especificada",
              ]
            : $("#pre").val() && $("#estadoI").val()
            ? [
                ...new Set(
                  data
                    .filter(
                      (item) =>
                        item.nombre_presentacion === $("#pre").val() &&
                        item.estatus == $("#estadoI").val()
                    )
                    .map((item) => item.nombre_presentacion)
                ),
              ].map((pre) => pre || "Presentación no especificada")
            : $("#pre").val()
            ? [
                ...new Set(
                  data
                    .filter(
                      (item) => item.nombre_presentacion === $("#pre").val()
                    )
                    .map((item) => item.nombre_presentacion)
                ),
              ].map((pre) => pre || "Presentación no especificada")
            : $("#tipoI").val() && $("#estadoI").val()
            ? [
                ...new Set(
                  data
                    .filter(
                      (item) =>
                        item.tipo_insumo === $("#tipoI").val() &&
                        item.estatus == $("#estadoI").val()
                    )
                    .map((item) => item.nombre_presentacion)
                ),
              ].map((pre) => pre || "Presentación no especificada")
            : $("#tipoI").val()
            ? [
                ...new Set(
                  data
                    .filter((item) => item.tipo_insumo === $("#tipoI").val())
                    .map((item) => item.nombre_presentacion)
                ),
              ].map((pre) => pre || "Presentación no especificada")
            : $("#estadoI").val()
            ? [
                ...new Set(
                  data
                    .filter((item) => item.estatus == $("#estadoI").val())
                    .map((item) => item.nombre_presentacion)
                ),
              ].map((pre) => pre || "Presentación no especificada")
            : [...new Set(data.map((item) => item.nombre_presentacion))].map(
                (pre) => pre || "Presentación no especificada"
              );

        const dataValuesPRE =
          $("#pre").val() && $("#tipoI").val() && $("#estadoI").val()
            ? [
                data.filter(
                  (item) =>
                    item.nombre_presentacion === $("#pre").val() &&
                    item.tipo_insumo === $("#tipoI").val() &&
                    item.estatus == $("#estadoI").val()
                ).length,
              ]
            : $("#pre").val() && $("#tipoI").val()
            ? [
                data.filter(
                  (item) =>
                    item.nombre_presentacion === $("#pre").val() &&
                    item.tipo_insumo === $("#tipoI").val()
                ).length,
              ]
            : $("#pre").val() && $("#estadoI").val()
            ? [
                ...new Set(
                  data
                    .filter(
                      (item) =>
                        item.nombre_presentacion === $("#pre").val() &&
                        item.estatus == $("#estadoI").val()
                    )
                    .map((item) => item.nombre_presentacion)
                ),
              ].map(
                (presentacion) =>
                  data.filter(
                    (item) =>
                      item.nombre_presentacion === presentacion &&
                      item.estatus == $("#estadoI").val()
                  ).length
              )
            : $("#pre").val()
            ? [
                ...new Set(
                  data
                    .filter(
                      (item) => item.nombre_presentacion === $("#pre").val()
                    )
                    .map((item) => item.nombre_presentacion)
                ),
              ].map(
                (presentacion) =>
                  data.filter(
                    (item) => item.nombre_presentacion === presentacion
                  ).length
              )
            : $("#tipoI").val() && $("#estadoI").val()
            ? [
                ...new Set(
                  data
                    .filter(
                      (item) =>
                        item.tipo_insumo === $("#tipoI").val() &&
                        item.estatus == $("#estadoI").val()
                    )
                    .map((item) => item.nombre_presentacion)
                ),
              ].map(
                (presentacion) =>
                  data.filter(
                    (item) =>
                      item.nombre_presentacion === presentacion &&
                      item.tipo_insumo === $("#tipoI").val() &&
                      item.estatus == $("#estadoI").val()
                  ).length
              )
            : $("#tipoI").val()
            ? [
                ...new Set(
                  data
                    .filter((item) => item.tipo_insumo === $("#tipoI").val())
                    .map((item) => item.nombre_presentacion)
                ),
              ].map(
                (presentacion) =>
                  data.filter(
                    (item) =>
                      item.nombre_presentacion === presentacion &&
                      item.tipo_insumo === $("#tipoI").val()
                  ).length
              )
            : $("#estadoI").val()
            ? [
                ...new Set(
                  data
                    .filter((item) => item.estatus == $("#estadoI").val())
                    .map((item) => item.nombre_presentacion)
                ),
              ].map(
                (presentacion) =>
                  data.filter(
                    (item) =>
                      item.nombre_presentacion === presentacion &&
                      item.estatus == $("#estadoI").val()
                  ).length
              )
            : [...new Set(data.map((item) => item.nombre_presentacion))].map(
                (presentacion) =>
                  data.filter(
                    (item) => item.nombre_presentacion === presentacion
                  ).length
              );

        // Array de valores para el gráfico: se truncan a 10 si exceden ese valor.
        const displayValuesPRE = dataValuesPRE.map((value) =>
          value > 10 ? 10 : value
        );

        // Array de valores reales para usarlos en tooltips.
        realValuesPRE = dataValuesPRE; // Se mantienen sin truncar.

        if (chartPRE) {
          chartPRE.destroy();
        }

        const ctxPRE = document.getElementById("chartPRE").getContext("2d");
        chartPRE = new Chart(ctxPRE, {
          type: "bar",
          data: {
            labels: labelsPRE,
            datasets: [
              {
                label: "Presentacion",
                data: displayValuesPRE,
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
                  const realVal = realValuesPRE[index];

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
                  const realVal = realValuesPRE[index];
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
