$(document).ready(function () {
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
  fetch("index.php?action=reportes_empleados&data=1")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const general = data;

        const cargoI = document.getElementById("cargo");

        cargoI.innerHTML = '<option value="" selected>Todos</option>';

        if (Array.isArray(general)) {
          const cargoUnicas = [...new Set(general.map((item) => item.tipo))];
          cargoUnicas.forEach((item) => {
            const optionE = document.createElement("option");
            optionE.value = item;
            optionE.textContent = item;
            cargoI.appendChild(optionE);
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

              const chartIds = ["chartE", "chartC", "chartA"];
              const chartTitles = [
                "Gráfico por Estado",
                "Gráfico por Cargo",
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

  //------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------
  let realValuesC = [];
  let realValuesE = [];
  let realValuesA = [];
  let chartC = null;
  let chartE = null;
  let chartA = null;

  function applyFilters(data) {
    return data.filter(item => {
      // Filtro por fechas
      const fechaItem = new Date(item.fecha_creacion);
      const fechaInicio = $("#fecha_inicio").val() ? new Date($("#fecha_inicio").val()) : null;
      const fechaFin = $("#fecha_fin").val() ? new Date($("#fecha_fin").val()) : null;
      
      const cumpleFechas = 
        (!fechaInicio || fechaItem >= fechaInicio) && 
        (!fechaFin || fechaItem <= fechaFin);
      
      // Filtro por estatus
      const cumpleEstatus = !$("#estatus").val() || item.estatus == $("#estatus").val();
      
      // Filtro por cargo
      const cumpleCargo = !$("#cargo").val() || item.tipo === $("#cargo").val();
      
      // Filtro por área
      const cumpleArea = !$("#area").val() || item.nombre_serv === $("#area").val();
      
      return cumpleFechas && cumpleEstatus && cumpleCargo && cumpleArea;
    });
  }

  function updateEstadoChart(filteredData) {
    const estados = {
        "Activo": 1,
        "Bloqueado": 0
    };

    // Calcular valores para ambos estados
    const conteoEstados = {
        "Activo": filteredData.filter(item => item.estatus == 1).length,
        "Bloqueado": filteredData.filter(item => item.estatus == 0).length
    };

    // Filtrar solo los estados con conteo > 0, a menos que haya un filtro específico
    const labelsE = $("#estatus").val() 
        ? [$("#estatus").val() == 1 ? "Activo" : "Bloqueado"]
        : Object.entries(conteoEstados)
              .filter(([_, count]) => count > 0)
              .map(([estado, _]) => estado);

    const dataValuesE = labelsE.map(label => conteoEstados[label]);
    const displayValuesE = dataValuesE.map(v => v > 10 ? 10 : v);
    realValuesE = dataValuesE;

    if (chartE) chartE.destroy();

    if (labelsE.length > 0) {
        const ctxE = document.getElementById("chartE").getContext("2d");
        chartE = new Chart(ctxE, {
            type: "bar",
            data: {
                labels: labelsE,
                datasets: [{
                    label: "Estado",
                    data: displayValuesE,
                    backgroundColor: labelsE.map(label => 
                        label === "Activo" ? "rgba(75, 192, 192, 0.2)" : "rgba(255, 99, 132, 0.2)"),
                    borderColor: labelsE.map(label => 
                        label === "Activo" ? "rgba(75, 192, 192, 1)" : "rgba(255, 99, 132, 1)"),
                    borderWidth: 2
                }]
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
                            stepSize: 1
                        } 
                    }] 
                },
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
        // Mostrar mensaje cuando no hay datos
        document.getElementById("chartE-container").innerHTML = "<p>No hay datos de estado para mostrar con los filtros actuales</p>";
    }
  }

  function updateCargoChart(filteredData) {
    // Agrupar por cargo y contar, solo incluir cargos con conteo > 0
    const cargosConteo = filteredData.reduce((acc, item) => {
        const cargo = item.tipo || "Cargo no especificado";
        acc[cargo] = (acc[cargo] || 0) + 1;
        return acc;
    }, {});

    const labelsC = $("#cargo").val() 
        ? [$("#cargo").val()]
        : Object.entries(cargosConteo)
              .filter(([_, count]) => count > 0)
              .map(([cargo, _]) => cargo);

    const dataValuesC = labelsC.map(cargo => cargosConteo[cargo]);
    const displayValuesC = dataValuesC.map(v => v > 10 ? 10 : v);
    realValuesC = dataValuesC;

    if (chartC) chartC.destroy();

    if (labelsC.length > 0) {
        const ctxC = document.getElementById("chartC").getContext("2d");
        chartC = new Chart(ctxC, {
            type: "bar",
            data: {
                labels: labelsC,
                datasets: [{
                    label: "Cargo",
                    data: displayValuesC,
                    backgroundColor: labelsC.map((_, i) => 
                        `rgba(${(75 + i * 30) % 255}, ${(192 - i * 50) % 255}, ${(192 + i * 20) % 255}, 0.2)`),
                    borderColor: labelsC.map((_, i) => 
                        `rgba(${(75 + i * 30) % 255}, ${(192 - i * 50) % 255}, ${(192 + i * 20) % 255}, 1)`),
                    borderWidth: 2
                }]
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
                            stepSize: 1
                        } 
                    }] 
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            const realVal = realValuesC[tooltipItem.index];
                            return `${data.labels[tooltipItem.index]}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
                        }
                    }
                },
                legend: { labels: { boxWidth: 0, fontSize: 20 } },
                plugins: {
                    datalabels: {
                        display: true,
                        color: "black",
                        formatter: (value, ctx) => realValuesC[ctx.dataIndex] > 10 ? "10+" : realValuesC[ctx.dataIndex]
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    } else {
        document.getElementById("chartC-container").innerHTML = "<p>No hay datos de cargo para mostrar con los filtros actuales</p>";
    }
  }

  function updateAreaChart(filteredData) {
    // Agrupar por área y contar, solo incluir áreas con conteo > 0
    const areasConteo = filteredData.reduce((acc, item) => {
        const area = item.nombre_serv || "Área no especificada";
        acc[area] = (acc[area] || 0) + 1;
        return acc;
    }, {});

    const labelsA = $("#area").val() 
        ? [$("#area").val()]
        : Object.entries(areasConteo)
              .filter(([_, count]) => count > 0)
              .map(([area, _]) => area);

    const dataValuesA = labelsA.map(area => areasConteo[area]);
    const displayValuesA = dataValuesA.map(v => v > 10 ? 10 : v);
    realValuesA = dataValuesA;

    if (chartA) chartA.destroy();

    if (labelsA.length > 0) {
        const ctxA = document.getElementById("chartA").getContext("2d");
        chartA = new Chart(ctxA, {
            type: "bar",
            data: {
                labels: labelsA,
                datasets: [{
                    label: "Área",
                    data: displayValuesA,
                    backgroundColor: labelsA.map((_, i) => 
                        `rgba(${(192 + i * 30) % 255}, ${(75 - i * 50) % 255}, ${(54 + i * 20) % 255}, 0.2)`),
                    borderColor: labelsA.map((_, i) => 
                        `rgba(${(192 + i * 30) % 255}, ${(75 - i * 50) % 255}, ${(54 + i * 20) % 255}, 1)`),
                    borderWidth: 2
                }]
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
                            stepSize: 1
                        } 
                    }] 
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            const realVal = realValuesA[tooltipItem.index];
                            return `${data.labels[tooltipItem.index]}: ${realVal}${realVal > 10 ? " (más de 10)" : ""}`;
                        }
                    }
                },
                legend: { labels: { boxWidth: 0, fontSize: 20 } },
                plugins: {
                    datalabels: {
                        display: true,
                        color: "black",
                        formatter: (value, ctx) => realValuesA[ctx.dataIndex] > 10 ? "10+" : realValuesA[ctx.dataIndex]
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    } else {
        document.getElementById("chartA-container").innerHTML = "<p>No hay datos de área para mostrar con los filtros actuales</p>";
    }
  }

  $("#form-reporte").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_empleados",
      data: $(this).serialize(),
      dataType: "json",
      success: function (data) {
        console.log(data);

        if (
          (validarFechaManual("fecha_inicio", "error_fecha_inicio") &&
            validarFechaManual("fecha_fin", "error_fecha_fin")) ||
          ($("#fecha_inicio").val() === "" && $("#fecha_fin").val() === "")
        ) {
          tableGeneral.clear();

          const filteredData = applyFilters(data);

          filteredData.forEach((item) => {
            const dateParts = item.fecha_nacimiento.split("-");
            const fecha_formateada = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const nombresApellidos = item.nombre + " " + item.apellido;

            tableGeneral.row.add([
              fecha_formateada,
              nombresApellidos,
              item.cedula,
              item.tipo,
              item.nombre_serv,
              item.telefono,
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

          // Actualizar todos los gráficos con los datos filtrados
          updateEstadoChart(filteredData);
          updateCargoChart(filteredData);
          updateAreaChart(filteredData);
        } else {
          tableGeneral.clear().draw();
          $("#contenedor-resultados").hide();
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