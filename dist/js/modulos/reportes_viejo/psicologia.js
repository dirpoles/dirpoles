$("#tipo_reporte").change(function () {
  $(".divM").hide();
  $("#divC").hide();
  $("#contenedor_psG").hide();
  $("#contenedor_citas").hide();

  if ($(this).val() == "morbilidad") {
    $(".divM").show();
  } else if ($(this).val() == "citas") {
    $("#divC").show();
  }
});

$(document).ready(function () {
  let config = {};
  let tablePsG;
  let tableCitas;

  // Cargar configuración
  fetch("api/endpoint.php")
    .then((response) => response.json())
    .then((data) => {
      config = data;
      console.log("Configuración cargada:", config);
      initializeDataTables();
    })
    .catch((error) => {
      console.error("Error cargando configuración:", error);
    });

  //------------------------------------------ VALIDACIONES
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
    const tipoReporte = document.getElementById("tipo_reporte").value;
    const tipoError = document.getElementById("error_tipo_reporte");

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

  document.getElementById("tipo_reporte").addEventListener("change", function () {
    validarTipoReporte();
    cargaFiltros();
  });

  document.getElementById("form-reporte").addEventListener("submit", function (event) {
    const fechaInicioValida = validarFechaManual("fecha_inicio", "error_fecha_inicio");
    const fechaFinValida = validarFechaManual("fecha_fin", "error_fecha_fin");
    const tipoReporteValido = validarTipoReporte();

    if (!tipoReporteValido) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Formulario inválido.",
        text: "El tipo de reporte no puede estar vacío.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (!fechaInicioValida || !fechaFinValida) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Formulario inválido.",
        text: "La fecha de inicio y fin no pueden ser fechas futuras.",
        confirmButtonText: "Entendido",
      });
      return;
    }
  });

  //------------------------------------------------------------------
  function cargaFiltros() {
    let url = "";
    const tipoReporte = $("#tipo_reporte").val();

    if (tipoReporte === "morbilidad") {
      url = "index.php?action=reportes_psicologia&data=morbilidad";

      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          if (data) {
            const pnfMI = document.getElementById("pnf");
            const tipoI = document.getElementById("tipo");

            pnfMI.innerHTML = '<option value="" selected>Todos</option>';
            tipoI.innerHTML = '<option value="" selected>Todos</option>';

            if (Array.isArray(data)) {
              const pnfUnicas = [...new Set(data.map((item) => item.nombre_pnf))];
              pnfUnicas.forEach((item) => {
                const option = document.createElement("option");
                option.value = item;
                option.textContent = item;
                pnfMI.appendChild(option);
              });

              const tiposUnicos = [...new Set(data.map((item) => item.motivo))];
              tiposUnicos.forEach((item) => {
                const option = document.createElement("option");
                option.value = item;
                option.textContent = item;
                tipoI.appendChild(option);
              });
            }
          }
        })
        .catch((error) => {
          console.error("Error al cargar la data de filtros:", error);
        });
    } else if (tipoReporte === "citas") {
      url = "index.php?action=reportes_psicologia&data=citas";

      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          if (data) {
            const pnfI = document.getElementById("pnf");
            pnfI.innerHTML = '<option value="" selected>Todos</option>';

            if (Array.isArray(data)) {
              const pnfUnicas = [...new Set(data.map((item) => item.nombre_pnf))];
              pnfUnicas.forEach((item) => {
                const option = document.createElement("option");
                option.value = item;
                option.textContent = item;
                pnfI.appendChild(option);
              });
            }
          }
        })
        .catch((error) => {
          console.error("Error al cargar la data de filtros:", error);
        });
    }
  }

  // Inicialización de DataTables
  function initializeDataTables() {
    tablePsG = $("#tabla_psG").DataTable({
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
          title: "Reporte Psicologia",
          className: "btn btn-success",
        },
        {
          extend: "pdfHtml5",
          text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
          title: "Reporte Psicologia",
          className: "btn btn-danger",
          orientation: "landscape",
          pageSize: "A4",
          exportOptions: {
            columns: ":visible",
          },
          customize: function (doc) {
            doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });
            doc.content[1].bold = true;
            doc.content[1].alignment = "center";
            doc.content[1].color = "black";
            doc.content[1].fontSize = 16;

            const pageInfo = tablePsG.page.info();
            const summaryText = `Mostrando ${pageInfo.start + 1} a ${pageInfo.end} de ${pageInfo.recordsTotal} registros`;

            doc.content.push({
              text: summaryText,
              alignment: "left",
              margin: [0, 10, 0, 0],
            });

            doc.content[2].margin = [0, 0, 0, 0];
            doc.content[2].table.widths = Array(doc.content[2].table.body[0].length + 1).join("*").split("");

            // Agregar gráficos al PDF
            const chartIds = ["chartGM", "chartPM", "chartT"];
            const chartTitles = ["Gráfico por Género", "Gráfico por PNF", "Gráfico por Tipo de Consulta"];

            chartIds.forEach((chartId, index) => {
              const canvas = document.getElementById(chartId);
              if (canvas) {
                const chartImage = canvas.toDataURL("image/png");
                doc.content.push({
                  pageBreak: "before",
                  text: chartTitles[index],
                  style: "header",
                  alignment: "center",
                  margin: [0, 20, 0, 10],
                  fontSize: 16,
                  bold: true,
                });
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
          sSortAscending: ": Activar para ordenar la columna de manera ascendente",
          sSortDescending: ": Activar para ordenar la columna de manera descendente",
        },
      },
    });

    tableCitas = $("#tabla_citas").DataTable({
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
            doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });
            doc.content[1].bold = true;
            doc.content[1].alignment = "center";
            doc.content[1].color = "black";
            doc.content[1].fontSize = 16;

            const pageInfo = tableCitas.page.info();
            const summaryText = `Mostrando ${pageInfo.start + 1} a ${pageInfo.end} de ${pageInfo.recordsTotal} registros`;

            doc.content.push({
              text: summaryText,
              alignment: "left",
              margin: [0, 10, 0, 0],
            });

            doc.content[2].margin = [0, 0, 0, 0];
            doc.content[2].table.widths = Array(doc.content[2].table.body[0].length + 1).join("*").split("");

            // Agregar gráficos al PDF
            const chartIds = ["chartGC", "chartPC"];
            const chartTitles = ["Gráfico por Género", "Gráfico por PNF"];

            chartIds.forEach((chartId, index) => {
              const canvas = document.getElementById(chartId);
              if (canvas) {
                const chartImage = canvas.toDataURL("image/png");
                doc.content.push({
                  pageBreak: "before",
                  text: chartTitles[index],
                  style: "header",
                  alignment: "center",
                  margin: [0, 20, 0, 10],
                  fontSize: 16,
                  bold: true,
                });
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
          sSortAscending: ": Activar para ordenar la columna de manera ascendente",
          sSortDescending: ": Activar para ordenar la columna de manera descendente",
        },
      },
    });
  }

  // Variables para gráficos
  let chartGM = null;
  let chartPM = null;
  let chartT = null;
  let chartGC = null;
  let chartPC = null;

  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_psicologia",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        const tipoReporte = $("#tipo_reporte").val();

        if (tipoReporte === "morbilidad") {
          procesarDatosMorbilidad(data);
        } else if (tipoReporte === "citas") {
          procesarDatosCitas(data);
        }
      },
      error: function (error) {
        console.error("Error al obtener datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al obtener los datos del reporte.",
          confirmButtonText: "Entendido",
        });
      }
    });
  });

  function procesarDatosMorbilidad(data) {
    tablePsG.clear();

    const filteredData = data.filter(item =>
  (!$("#fecha_inicio").val() || !$("#fecha_fin").val() ||
    (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) &&
     new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val()))) &&
  (!$("#genero").val() || item.genero === $("#genero").val()) &&
  (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val()) &&
  (!$("#tipo").val() || item.motivo === $("#tipo").val())
);

    filteredData.forEach((item) => {
      const dateParts = item.fecha_creacion.split("-");
      const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const nombresApellidos = item.nombres + " " + item.apellidos;

      tablePsG.row.add([
        fecha_formateada,
        nombresApellidos,
        item.cedula,
        item.nombre_pnf,
        item.motivo,
        item.motivo_otro,
      ]);
    });

    tablePsG.draw();

    if (filteredData.length > 0) {
      $("#contenedor_citas").hide();
      $("#contenedor_psG").show();
      Swal.fire({
        icon: "success",
        title: "Reporte generado.",
        text: "Reporte generado con éxito.",
        confirmButtonText: "Entendido",
      });
      
      // Actualizar gráficos con los datos filtrados
      actualizarGraficosMorbilidad(filteredData);
    } else {
      Swal.fire({
        icon: "error",
        title: "Reporte no generado.",
        text: "No se encontraron registros con los filtros seleccionados.",
        confirmButtonText: "Entendido",
      });
    }
  }

  function procesarDatosCitas(data) {
    tableCitas.clear();

    const filteredData = data.filter(item => 
  (!$("#fecha_inicio").val() || !$("#fecha_fin").val() ||
    (new Date(item.fecha_creacion) >= new Date($("#fecha_inicio").val()) &&
     new Date(item.fecha_creacion) <= new Date($("#fecha_fin").val()))
  ) &&
  (!$("#genero").val() || item.genero === $("#genero").val()) &&
  (!$("#pnf").val() || item.nombre_pnf === $("#pnf").val())
);

    filteredData.forEach((item) => {
      const dateParts = item.fecha_creacion.split("-");
      const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const dateParts2 = item.fecha.split("-");
      const fecha_formateada2 = `${dateParts2[2]}-${dateParts2[1]}-${dateParts2[0]}`;
      const nombresApellidos = item.nombres + " " + item.apellidos;

      tableCitas.row.add([
        fecha_formateada,
        nombresApellidos,
        item.cedula,
        item.nombre_pnf,
        fecha_formateada2,
        item.hora,
      ]);
    });

    tableCitas.draw();

    if (filteredData.length > 0) {
      $("#contenedor_psG").hide();
      $("#contenedor_citas").show();
      Swal.fire({
        icon: "success",
        title: "Reporte generado.",
        text: "Reporte generado con éxito.",
        confirmButtonText: "Entendido",
      });
      
      // Actualizar gráficos con los datos filtrados
      actualizarGraficosCitas(filteredData);
    } else {
      Swal.fire({
        icon: "error",
        title: "Reporte no generado.",
        text: "No se encontraron registros con los filtros seleccionados.",
        confirmButtonText: "Entendido",
      });
    }
  }

  function actualizarGraficosMorbilidad(data) {
    // Gráfico por Género (Morbilidad)
    const generoSeleccionado = $("#genero").val();
    const pnfSeleccionado = $("#pnf").val();
    const tipoSeleccionado = $("#tipo").val();

    // Datos para gráfico de género
    const datosGenero = {};
    if (generoSeleccionado) {
      datosGenero[generoSeleccionado === "M" ? "Masculino" : "Femenino"] = 
        data.filter(item => item.genero === generoSeleccionado).length;
    } else {
      datosGenero["Masculino"] = data.filter(item => item.genero === "M").length;
      datosGenero["Femenino"] = data.filter(item => item.genero === "F").length;
    }
    actualizarGrafico("chartGM", chartGM, Object.keys(datosGenero), Object.values(datosGenero), "Género");

    // Datos para gráfico de PNF
    const datosPNF = {};
    if (pnfSeleccionado) {
      datosPNF[pnfSeleccionado] = data.filter(item => item.nombre_pnf === pnfSeleccionado).length;
    } else {
      const pnfsUnicos = [...new Set(data.map(item => item.nombre_pnf))];
      pnfsUnicos.forEach(pnf => {
        datosPNF[pnf] = data.filter(item => item.nombre_pnf === pnf).length;
      });
    }
    actualizarGrafico("chartPM", chartPM, Object.keys(datosPNF), Object.values(datosPNF), "PNF");

    // Datos para gráfico de Tipo
    const datosTipo = {};
    if (tipoSeleccionado) {
      datosTipo[tipoSeleccionado] = data.filter(item => item.motivo === tipoSeleccionado).length;
    } else {
      const tiposUnicos = [...new Set(data.map(item => item.motivo))];
      tiposUnicos.forEach(tipo => {
        datosTipo[tipo] = data.filter(item => item.motivo === tipo).length;
      });
    }
    actualizarGrafico("chartT", chartT, Object.keys(datosTipo), Object.values(datosTipo), "Tipo de Consulta");
  }

  function actualizarGraficosCitas(data) {
    // Gráfico por Género (Citas)
    const generoSeleccionado = $("#genero").val();
    const pnfSeleccionado = $("#pnf").val();

    // Datos para gráfico de género
    const datosGenero = {};
    if (generoSeleccionado) {
      datosGenero[generoSeleccionado === "M" ? "Masculino" : "Femenino"] = 
        data.filter(item => item.genero === generoSeleccionado).length;
    } else {
      datosGenero["Masculino"] = data.filter(item => item.genero === "M").length;
      datosGenero["Femenino"] = data.filter(item => item.genero === "F").length;
    }
    actualizarGrafico("chartGC", chartGC, Object.keys(datosGenero), Object.values(datosGenero), "Género");

    // Datos para gráfico de PNF
    const datosPNF = {};
    if (pnfSeleccionado) {
      datosPNF[pnfSeleccionado] = data.filter(item => item.nombre_pnf === pnfSeleccionado).length;
    } else {
      const pnfsUnicos = [...new Set(data.map(item => item.nombre_pnf))];
      pnfsUnicos.forEach(pnf => {
        datosPNF[pnf] = data.filter(item => item.nombre_pnf === pnf).length;
      });
    }
    actualizarGrafico("chartPC", chartPC, Object.keys(datosPNF), Object.values(datosPNF), "PNF");
  }

  function actualizarGrafico(canvasId, chartInstance, labels, dataValues, label) {
    const displayValues = dataValues.map(value => value > 10 ? 10 : value);
    const realValues = dataValues;

    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = document.getElementById(canvasId).getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: displayValues,
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
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 10,
              callback: function (value) {
                return value;
              },
            },
          }],
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const index = tooltipItem.index;
              const label = data.labels[index];
              const realVal = realValues[index];
              return `${label}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
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
              const index = context.dataIndex;
              const realVal = realValues[index];
              return realVal > 10 ? "10+" : realVal;
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    // Actualizar la referencia del gráfico
    switch(canvasId) {
      case "chartGM": chartGM = chartInstance; break;
      case "chartPM": chartPM = chartInstance; break;
      case "chartT": chartT = chartInstance; break;
      case "chartGC": chartGC = chartInstance; break;
      case "chartPC": chartPC = chartInstance; break;
    }
  }
});