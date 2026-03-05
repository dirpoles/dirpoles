// Configuración global
const config = {
  maxChartValue: 10,
  chartColors: {
    background: [
      "rgba(75, 192, 192, 0.2)", // aqua
      "rgba(54, 162, 235, 0.2)", // azul
      "rgba(255, 206, 86, 0.2)", // amarillo
      "rgba(144, 238, 144, 0.2)", // verde claro
      "rgba(255, 159, 64, 0.2)", // naranja
      "rgba(153, 102, 255, 0.2)", // violeta
      "rgba(255, 99, 132, 0.2)", // rosado
      "rgba(100, 149, 237, 0.2)", // azul acero claro
      "rgba(255, 140, 0, 0.2)", // naranja oscuro
      "rgba(255, 105, 180, 0.2)", // rosado fuerte
      "rgba(0, 191, 255, 0.2)", // azul cielo profundo
      "rgba(34, 139, 34, 0.2)", // verde bosque
      "rgba(220, 20, 60, 0.2)", // carmesí
      "rgba(199, 21, 133, 0.2)", // violeta medio
      "rgba(0, 206, 209, 0.2)", // turquesa oscuro
      "rgba(255, 215, 0, 0.2)", // dorado
      "rgba(70, 130, 180, 0.2)", // azul acero
      "rgba(46, 139, 87, 0.2)", // verde mar
      "rgba(255, 20, 147, 0.2)", // rosa profundo
      "rgba(255, 228, 181, 0.2)", // durazno claro
      "rgba(210, 105, 30, 0.2)", // chocolate
      "rgba(95, 158, 160, 0.2)", // azul cadete
      "rgba(0, 128, 128, 0.2)", // teal
      "rgba(106, 90, 205, 0.2)", // pizarra azul
      "rgba(186, 85, 211, 0.2)", // orquídea media
    ],
    border: [
      "rgba(75, 192, 192, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(144, 238, 144, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 99, 132, 1)",
      "rgba(100, 149, 237, 1)",
      "rgba(255, 140, 0, 1)",
      "rgba(255, 105, 180, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(34, 139, 34, 1)",
      "rgba(220, 20, 60, 1)",
      "rgba(199, 21, 133, 1)",
      "rgba(0, 206, 209, 1)",
      "rgba(255, 215, 0, 1)",
      "rgba(70, 130, 180, 1)",
      "rgba(46, 139, 87, 1)",
      "rgba(255, 20, 147, 1)",
      "rgba(255, 228, 181, 1)",
      "rgba(210, 105, 30, 1)",
      "rgba(95, 158, 160, 1)",
      "rgba(0, 128, 128, 1)",
      "rgba(106, 90, 205, 1)",
      "rgba(186, 85, 211, 1)",
    ],
  },
  plugins: [ChartDataLabels], // Plugin para mostrar valores en las barras
};

// Objetos para almacenar instancias
const tables = {};
const charts = {
  vehiculos: { vm: null, vt: null, ve: null },
  proveedores: { pe: null },
  rutas: { rut: null, rue: null, rup: null, rud: null },
  repuestos: { ree: null, rep: null },
};

// Utilidades
const utils = {
  validateDate: (inputId, errorId) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const hoy = new Date().toISOString().split("T")[0];

    if (new Date(input.value) > new Date(hoy)) {
      error.textContent = "La fecha no puede ser futura.";
      return false;
    }
    error.textContent = "";
    return true;
  },

  validateReportType: () => {
    const tipoReporte = document.getElementById("tipoReporte").value;
    const tipoError = document.getElementById("error_tipoReporte");

    if (!tipoReporte) {
      tipoError.textContent = "Este campo no puede estar vacío.";
      return false;
    }
    tipoError.textContent = "";
    return true;
  },

  showAlert: (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: "Entendido",
    });
  },

  formatDate: (dateString) => {
    if (!dateString) return "";
    const dateParts = dateString.split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  },

  toggleChartVisibility: (chartId, hasData) => {
    const chartContainer = $(`#${chartId}`).closest(".chart-container");
    if (hasData) {
      chartContainer.show();
    } else {
      chartContainer.hide();
    }
  },

  isDateInRange: (dateString, startDate, endDate) => {
    if (!startDate && !endDate) return true;

    const date = new Date(dateString);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return date >= start && date <= end;
    } else if (start) {
      return date >= start;
    } else if (end) {
      return date <= end;
    }
    return true;
  },
};

// Funciones para DataTables
const dataTableManager = {
  initTables: () => {
    tables.vehiculos = $("#tabla_v").DataTable(
      dataTableManager.getTableConfig("Reporte Vehículos")
    );
    tables.proveedores = $("#tabla_p").DataTable(
      dataTableManager.getTableConfig("Reporte Proveedores")
    );
    tables.rutas = $("#tabla_ru").DataTable(
      dataTableManager.getTableConfig("Reporte Rutas")
    );
    tables.repuestos = $("#tabla_re").DataTable(
      dataTableManager.getTableConfig("Reporte Repuestos")
    );
  },

  getTableConfig: (title) => ({
    responsive: true,
    autoWidth: false,
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    order: [[0, 'desc']],
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="far fa-file-excel"></i> Exportar a Excel',
        title: title,
        className: "btn btn-success",
      },
      {
        extend: "pdfHtml5",
        text: '<i class="fas fa-file-pdf"></i> Exportar a PDF',
        title: title,
        className: "btn btn-danger",
        orientation: "landscape",
        pageSize: "A4",
        exportOptions: { columns: ":visible" },
        customize: dataTableManager.customizePDF(title),
      },
    ],
    language: dataTableManager.getLanguageConfig(),
  }),

  customizePDF: (title) => (doc) => {
    doc.content.splice(0, 0, { text: " ", margin: [0, 0, 0, 0] });
    doc.content[1].bold = true;
    doc.content[1].alignment = "center";
    doc.content[1].color = "black";
    doc.content[1].fontSize = 16;

    const pageInfo = this.page.info();
    const summaryText = `Mostrando ${pageInfo.start + 1} a ${pageInfo.end} de ${
      pageInfo.recordsTotal
    } registros`;

    doc.content.push({
      text: summaryText,
      alignment: "left",
      margin: [0, 10, 0, 0],
    });

    doc.content[2].margin = [0, 0, 0, 0];
    doc.content[2].table.widths = Array(doc.content[2].table.body[0].length + 1)
      .join("*")
      .split("");

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

  getLanguageConfig: () => ({
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
      sSortDescending:
        ": Activar para ordenar la columna de manera descendente",
    },
  }),
};

// Funciones para gráficos
const chartManager = {
  createOrUpdate: (chartId, labels, dataValues, label) => {
    const filteredPairs = labels
      .map((label, index) => ({
        label,
        value: dataValues[index],
      }))
      .filter((item) => item.value > 0);

    const filteredLabels = filteredPairs.map((item) => item.label);
    const filteredValues = filteredPairs.map((item) => item.value);

    utils.toggleChartVisibility(chartId, filteredValues.length > 0);

    if (filteredValues.length === 0) {
      return;
    }

    const ctx = document.getElementById(chartId).getContext("2d");
    const displayValues = filteredValues.map((value) =>
      Math.min(value, config.maxChartValue)
    );
    const realValues = filteredValues;

    const chartType = chartId.replace("chart", "").toLowerCase();
    const reportType =
      chartId.includes("VM") || chartId.includes("VT") || chartId.includes("VE")
        ? "vehiculos"
        : chartId.includes("PE")
        ? "proveedores"
        : chartId.includes("RUT") ||
          chartId.includes("RUE") ||
          chartId.includes("RUP") ||
          chartId.includes("RUD")
        ? "rutas"
        : "repuestos";

    if (charts[reportType][chartType]) {
      charts[reportType][chartType].destroy();
    }

    charts[reportType][chartType] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: filteredLabels,
        datasets: [
          {
            label,
            data: displayValues,
            backgroundColor: config.chartColors.background,
            borderColor: config.chartColors.border,
            borderWidth: 2,
          },
        ],
      },
      options: chartManager.getChartOptions(realValues),
      plugins: config.plugins,
    });
  },

  getChartOptions: (realValues) => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            min: 0,
            max: config.maxChartValue,
            callback: (value) => value,
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const index = tooltipItem.index;
          const label = data.labels[index];
          const realVal = realValues[index];
          return `${label}: ${realVal}${
            realVal > config.maxChartValue
              ? " (más de " + config.maxChartValue + ")"
              : ""
          }`;
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
        anchor: "center",
        align: "center",
        formatter: (value, context) => {
          const index = context.dataIndex;
          const realVal = realValues[index];
          return realVal > config.maxChartValue
            ? config.maxChartValue + "+"
            : realVal;
        },
      },
    },
  }),

  updateVehicleCharts: (vehicles, filters) => {
    // Primero filtramos los vehículos por fecha si es necesario
    const filteredVehicles = vehicles.filter((vehicle) => {
      return utils.isDateInRange(
        vehicle.fecha_adquisicion,
        filters.fecha_inicio,
        filters.fecha_fin
      );
    });

    // Gráfico de modelos
    const labelsVM = filters.modelo
      ? [filters.modelo]
      : [...new Set(filteredVehicles.map((item) => item.modelo))].map(
          (modelo) => modelo || "Modelo desconocido"
        );

    const dataValuesVM = filters.modelo
      ? [
          filteredVehicles.filter(
            (item) =>
              item.modelo === filters.modelo &&
              (!filters.tipo || item.tipo === filters.tipo) &&
              (!filters.estado || item.estado === filters.estado)
          ).length,
        ]
      : [...new Set(filteredVehicles.map((item) => item.modelo))].map(
          (modelo) =>
            filteredVehicles.filter(
              (item) =>
                item.modelo === modelo &&
                (!filters.tipo || item.tipo === filters.tipo) &&
                (!filters.estado || item.estado === filters.estado)
            ).length
        );

    chartManager.createOrUpdate("chartVM", labelsVM, dataValuesVM, "Modelo");

    // Gráfico de tipos
    const labelsVT = filters.tipo
      ? [filters.tipo]
      : [...new Set(filteredVehicles.map((item) => item.tipo))].map(
          (tipo) => tipo || "Tipo desconocido"
        );

    const dataValuesVT = filters.tipo
      ? [
          filteredVehicles.filter(
            (item) =>
              item.tipo === filters.tipo &&
              (!filters.modelo || item.modelo === filters.modelo) &&
              (!filters.estado || item.estado === filters.estado)
          ).length,
        ]
      : [...new Set(filteredVehicles.map((item) => item.tipo))].map(
          (tipo) =>
            filteredVehicles.filter(
              (item) =>
                item.tipo === tipo &&
                (!filters.modelo || item.modelo === filters.modelo) &&
                (!filters.estado || item.estado === filters.estado)
            ).length
        );

    chartManager.createOrUpdate("chartVT", labelsVT, dataValuesVT, "Tipo");

    // Gráfico de estados
    const labelsVE = filters.estado
      ? [filters.estado]
      : [...new Set(filteredVehicles.map((item) => item.estado))].map(
          (estado) => estado || "Estado desconocido"
        );

    const dataValuesVE = filters.estado
      ? [
          filteredVehicles.filter(
            (item) =>
              item.estado === filters.estado &&
              (!filters.modelo || item.modelo === filters.modelo) &&
              (!filters.tipo || item.tipo === filters.tipo)
          ).length,
        ]
      : [...new Set(filteredVehicles.map((item) => item.estado))].map(
          (estado) =>
            filteredVehicles.filter(
              (item) =>
                item.estado === estado &&
                (!filters.modelo || item.modelo === filters.modelo) &&
                (!filters.tipo || item.tipo === filters.tipo)
            ).length
        );

    chartManager.createOrUpdate("chartVE", labelsVE, dataValuesVE, "Estado");
  },

  updateProviderCharts: (providers, filters) => {
    // Primero filtramos  por fecha si es necesario
    const filteredProv = providers.filter((prov) => {
      return utils.isDateInRange(
        prov.fecha_creacion,
        filters.fecha_inicio,
        filters.fecha_fin
      );
    });
    const labelsPE = filters.estatus
      ? [filters.estatus]
      : [...new Set(filteredProv.map((item) => item.estatus))].map(
          (estado) => estado || "Estado desconocido"
        );

    const dataValuesPE = filters.estatus
      ? [
          filteredProv.filter(
            (item) =>
              item.estatus === filters.estatus &&
              (!filters.nombre || item.nombre === filters.nombre)
          ).length,
        ]
      : [...new Set(filteredProv.map((item) => item.estatus))].map(
          (estado) =>
            filteredProv.filter(
              (item) =>
                item.estatus === estado &&
                (!filters.nombre || item.nombre === filters.nombre)
            ).length
        );

    chartManager.createOrUpdate("chartPE", labelsPE, dataValuesPE, "Estado");
  },

  updateRouteCharts: (routes, filters) => {
    // Filtramos rutas por fecha si es necesario
    const filteredRoutes = routes.filter((route) => {
      return utils.isDateInRange(
        route.fecha_creacion,
        filters.fecha_inicio,
        filters.fecha_fin
      );
    });

    // Gráfico de tipos de ruta
    const labelsRUT = filters.tipo_ruta
      ? [filters.tipo_ruta]
      : [...new Set(filteredRoutes.map((item) => item.tipo_ruta))].map(
          (tipo) => tipo || "Tipo desconocido"
        );

    const dataValuesRUT = filters.tipo_ruta
      ? [
          filteredRoutes.filter(
            (item) =>
              item.tipo_ruta === filters.tipo_ruta &&
              (!filters.estado || item.estado === filters.estado) &&
              (!filters.punto_partida ||
                item.punto_partida === filters.punto_partida) &&
              (!filters.punto_destino ||
                item.punto_destino === filters.punto_destino)
          ).length,
        ]
      : [...new Set(filteredRoutes.map((item) => item.tipo_ruta))].map(
          (tipo) =>
            filteredRoutes.filter(
              (item) =>
                item.tipo_ruta === tipo &&
                (!filters.estado || item.estado === filters.estado) &&
                (!filters.punto_partida ||
                  item.punto_partida === filters.punto_partida) &&
                (!filters.punto_destino ||
                  item.punto_destino === filters.punto_destino)
            ).length
        );

    chartManager.createOrUpdate("chartRUT", labelsRUT, dataValuesRUT, "Tipo");

    // Gráfico de estados de ruta
    const labelsRUE = filters.estado
      ? [filters.estado]
      : [...new Set(filteredRoutes.map((item) => item.estado))].map(
          (estado) => estado || "Estado desconocido"
        );

    const dataValuesRUE = filters.estado
      ? [
          filteredRoutes.filter(
            (item) =>
              item.estado === filters.estado &&
              (!filters.tipo_ruta || item.tipo_ruta === filters.tipo_ruta) &&
              (!filters.punto_partida ||
                item.punto_partida === filters.punto_partida) &&
              (!filters.punto_destino ||
                item.punto_destino === filters.punto_destino)
          ).length,
        ]
      : [...new Set(filteredRoutes.map((item) => item.estado))].map(
          (estado) =>
            filteredRoutes.filter(
              (item) =>
                item.estado === estado &&
                (!filters.tipo_ruta || item.tipo_ruta === filters.tipo_ruta) &&
                (!filters.punto_partida ||
                  item.punto_partida === filters.punto_partida) &&
                (!filters.punto_destino ||
                  item.punto_destino === filters.punto_destino)
            ).length
        );

    chartManager.createOrUpdate("chartRUE", labelsRUE, dataValuesRUE, "Estado");

    // Gráfico de puntos de partida
    const labelsRUP = filters.punto_partida
      ? [filters.punto_partida]
      : [...new Set(filteredRoutes.map((item) => item.punto_partida))].map(
          (partida) => partida || "Partida desconocida"
        );

    const dataValuesRUP = filters.punto_partida
      ? [
          filteredRoutes.filter(
            (item) =>
              item.punto_partida === filters.punto_partida &&
              (!filters.tipo_ruta || item.tipo_ruta === filters.tipo_ruta) &&
              (!filters.estado || item.estado === filters.estado) &&
              (!filters.punto_destino ||
                item.punto_destino === filters.punto_destino)
          ).length,
        ]
      : [...new Set(filteredRoutes.map((item) => item.punto_partida))].map(
          (partida) =>
            filteredRoutes.filter(
              (item) =>
                item.punto_partida === partida &&
                (!filters.tipo_ruta || item.tipo_ruta === filters.tipo_ruta) &&
                (!filters.estado || item.estado === filters.estado) &&
                (!filters.punto_destino ||
                  item.punto_destino === filters.punto_destino)
            ).length
        );

    chartManager.createOrUpdate(
      "chartRUP",
      labelsRUP,
      dataValuesRUP,
      "Punto de Partida"
    );

    // Gráfico de puntos de destino
    const labelsRUD = filters.punto_destino
      ? [filters.punto_destino]
      : [...new Set(filteredRoutes.map((item) => item.punto_destino))].map(
          (destino) => destino || "Destino desconocido"
        );

    const dataValuesRUD = filters.punto_destino
      ? [
          filteredRoutes.filter(
            (item) =>
              item.punto_destino === filters.punto_destino &&
              (!filters.tipo_ruta || item.tipo_ruta === filters.tipo_ruta) &&
              (!filters.estado || item.estado === filters.estado) &&
              (!filters.punto_partida ||
                item.punto_partida === filters.punto_partida)
          ).length,
        ]
      : [...new Set(filteredRoutes.map((item) => item.punto_destino))].map(
          (destino) =>
            filteredRoutes.filter(
              (item) =>
                item.punto_destino === destino &&
                (!filters.tipo_ruta || item.tipo_ruta === filters.tipo_ruta) &&
                (!filters.estado || item.estado === filters.estado) &&
                (!filters.punto_partida ||
                  item.punto_partida === filters.punto_partida)
            ).length
        );

    chartManager.createOrUpdate(
      "chartRUD",
      labelsRUD,
      dataValuesRUD,
      "Punto de Destino"
    );
  },

  updateSparePartsCharts: (spareParts, filters) => {
    // Filtramos repuestos por fecha si es necesario
    const filteredSpareParts = spareParts.filter((item) => {
      return utils.isDateInRange(
        item.fecha_creacion,
        filters.fecha_inicio,
        filters.fecha_fin
      );
    });

    // Gráfico de proveedores
    const labelsREP = filters.id_proveedor
      ? [
          ...new Set(
            filteredSpareParts
              .filter((item) => item.id_proveedor == filters.id_proveedor)
              .map((item) => item.nombre || "Repuesto sin nombre")
          ),
        ]
      : [
          ...new Set(
            filteredSpareParts.map(
              (item) => item.nombre || "Repuesto sin nombre"
            )
          ),
        ];

    const dataValuesREP = filters.id_proveedor
      ? labelsREP.map((repuesto) => {
          const filtered = filteredSpareParts.filter(
            (item) =>
              item.id_proveedor === filters.id_proveedor &&
              (!filters.estatus || item.estatus === filters.estatus) &&
              (item.nombre === repuesto || repuesto === "Repuesto sin nombre")
          );
          return filtered.reduce(
            (sum, item) => sum + (Number(item.cantidad) || 0),
            0
          );
        })
      : labelsREP.map((repuesto) => {
          const filtered = filteredSpareParts.filter(
            (item) =>
              (!filters.estatus || item.estatus === filters.estatus) &&
              (item.nombre === repuesto || repuesto === "Repuesto sin nombre")
          );
          return filtered.reduce(
            (sum, item) => sum + (Number(item.cantidad) || 0),
            0
          );
        });

    chartManager.createOrUpdate(
      "chartREP",
      labelsREP,
      dataValuesREP,
      "Proveedores"
    );

    // Gráfico de estados
    const labelsREE = filters.estatus
      ? [filters.estatus]
      : [
          ...new Set(
            filteredSpareParts.map(
              (item) => item.estatus || "Estado desconocido"
            )
          ),
        ];

    const dataValuesREE = filters.estatus
      ? [
          filteredSpareParts.filter(
            (item) =>
              item.estatus === filters.estatus &&
              (!filters.id_proveedor ||
                item.id_proveedor === filters.id_proveedor)
          ).length,
        ]
      : [...new Set(filteredSpareParts.map((item) => item.estatus))].map(
          (estatus) =>
            filteredSpareParts.filter(
              (item) =>
                item.estatus === estatus &&
                (!filters.id_proveedor ||
                  item.id_proveedor === filters.id_proveedor)
            ).length
        );

    chartManager.createOrUpdate("chartREE", labelsREE, dataValuesREE, "Estado");
  },
};

// Funciones para manejo de datos
const dataManager = {
  loadInitialData: () => {
    const tipoReporte = document.getElementById("tipoReporte");
    tipoReporte.addEventListener("change", function () {
      $(".contV, .contP, .contR, .contRe").hide();
      switch (this.value) {
        case "vehiculos":
          $(".contV").show();
          break;
        case "proveedores":
          $(".contP").show();
          break;
        case "rutas":
          $(".contR").show();
          break;
        case "repuestos":
          $(".contRe").show();
          break;
      }
      dataManager.fetchData(this.value);
    });
  },

  fetchData: (tipoReport) => {
    let url = "";
    switch (tipoReport) {
      case "vehiculos":
        url = `index.php?action=reportes_transporte&tipoReporte=vehiculos`;
        break;
      case "proveedores":
        url = `index.php?action=reportes_transporte&tipoReporte=proveedores`;
        break;
      case "rutas":
        url = `index.php?action=reportes_transporte&tipoReporte=rutas`;
        break;
      case "repuestos":
        url = `index.php?action=reportes_transporte&tipoReporte=repuestos`;
        break;
      default:
        return;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => dataManager.processData(data, tipoReport))
      .catch((error) =>
        console.error("Error al cargar la data de filtros:", error)
      );
  },

  processData: (data, tipoReport) => {
    switch (tipoReport) {
      case "vehiculos":
        dataManager.processVehiclesData(data.vehiculos);
        break;
      case "rutas":
        dataManager.processRoutesData(data.rutas);
        break;
      case "repuestos":
        dataManager.processSparePartsData(data.repuestos);
        break;
    }
  },

  processVehiclesData: (vehicles) => {
    const modeloI = document.getElementById("modelo");
    modeloI.innerHTML = '<option value="" selected>Todos</option>';

    if (Array.isArray(vehicles)) {
      vehicles.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.modelo;
        option.textContent = item.modelo;
        modeloI.appendChild(option);
      });
    }
  },

  processRoutesData: (routes) => {
    const partidaI = document.getElementById("partida");
    partidaI.innerHTML = '<option value="" selected>Todos</option>';

    const destinoI = document.getElementById("destino");
    destinoI.innerHTML = '<option value="" selected>Todos</option>';

    if (Array.isArray(routes)) {
      const partidasUnicas = [
        ...new Set(routes.map((item) => item.punto_partida)),
      ];
      partidasUnicas.forEach((partida) => {
        const option = document.createElement("option");
        option.value = partida;
        option.textContent = partida;
        partidaI.appendChild(option);
      });

      const destinoUnico = [
        ...new Set(routes.map((item) => item.punto_destino)),
      ];
      destinoUnico.forEach((destino) => {
        const option = document.createElement("option");
        option.value = destino;
        option.textContent = destino;
        destinoI.appendChild(option);
      });
    }
  },

  processSparePartsData: (spareParts) => {
    const provI = document.getElementById("proveedor");
    provI.innerHTML = '<option value="" selected>Todos</option>';

    if (Array.isArray(spareParts)) {
      const provUnico = [
        ...new Set(spareParts.map((item) => item.id_proveedor)),
      ];
      provUnico.forEach((idU) => {
        const proveedor = spareParts.find((item) => item.id_proveedor === idU);
        const option = document.createElement("option");
        option.value = idU;
        option.textContent = proveedor.nombre_prov;
        provI.appendChild(option);
      });
    }
  },

  filterData: (data, filters) => {
    return data.filter((item) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;

        if (key === "fecha_inicio" || key === "fecha_fin") {
          const fechaItem = new Date(
            item.fecha_adquisicion || item.fecha_creacion
          );
          const fechaFiltro = new Date(filters[key]);

          if (key === "fecha_inicio") return fechaItem >= fechaFiltro;
          if (key === "fecha_fin") return fechaItem <= fechaFiltro;
        }

        const fieldMap = {
          tipoV: "tipo",
          estadoV: "estado",
          nombreP: "nombre",
          estadoP: "estatus",
          tipoR: "tipo_ruta",
          estadoRU: "estado",
          estadoRE: "estatus",
        };

        const fieldName = fieldMap[key] || key;
        return item[fieldName] === filters[key];
      });
    });
  },
};

// Manejador de formularios
const formHandler = {
  setup: () => {
    document.getElementById("fecha_inicio").addEventListener("input", () => {
      utils.validateDate("fecha_inicio", "error_fecha_inicio");
    });

    document.getElementById("fecha_fin").addEventListener("input", () => {
      utils.validateDate("fecha_fin", "error_fecha_fin");
    });

    document
      .getElementById("tipoReporte")
      .addEventListener("change", utils.validateReportType);
    document
      .getElementById("form-reporte")
      .addEventListener("submit", formHandler.handleSubmit);
  },

  handleSubmit: (event) => {
    event.preventDefault();

    const fechaInicioValida = utils.validateDate(
      "fecha_inicio",
      "error_fecha_inicio"
    );
    const fechaFinValida = utils.validateDate("fecha_fin", "error_fecha_fin");
    const tipoReporteValido = utils.validateReportType();

    if (!tipoReporteValido) {
      utils.showAlert(
        "error",
        "Formulario inválido",
        "El formulario no puede estar vacío."
      );
      return;
    }

    if (!fechaInicioValida || !fechaFinValida) {
      utils.showAlert(
        "error",
        "Formulario inválido",
        "La fecha de inicio y fin no pueden ser fechas futuras."
      );
      return;
    }

    formHandler.submitForm();
  },

  submitForm: () => {
    $.ajax({
      type: "POST",
      url: "index.php?action=reportes_transporte",
      data: $("#form-reporte").serialize(),
      dataType: "json",
      success: formHandler.handleSuccess,
      error: formHandler.handleError,
    });
  },

  handleSuccess: (data) => {
    const tipoReporte = $("#tipoReporte").val();

    Object.values(tables).forEach((table) => table.clear());

    switch (tipoReporte) {
      case "vehiculos":
        formHandler.processVehicles(data);
        break;
      case "proveedores":
        formHandler.processProviders(data);
        break;
      case "rutas":
        formHandler.processRoutes(data);
        break;
      case "repuestos":
        formHandler.processSpareParts(data);
        break;
    }
  },

  processVehicles: (data) => {
    const filters = {
      fecha_inicio: $("#fecha_inicio").val(),
      fecha_fin: $("#fecha_fin").val(),
      modelo: $("#modelo").val(),
      tipoV: $("#tipoV").val(),
      estadoV: $("#estadoV").val(),
    };

    const filteredData = dataManager.filterData(data.vehiculos, filters);

    filteredData.forEach((item) => {
      tables.vehiculos.row.add([
        utils.formatDate(item.fecha_adquisicion),
        item.placa,
        item.tipo,
        item.estado,
      ]);
    });

    tables.vehiculos.draw();
    formHandler.showResults("contenedor_v", filteredData.length);
    chartManager.updateVehicleCharts(data.vehiculos, {
      fecha_inicio: filters.fecha_inicio,
      fecha_fin: filters.fecha_fin,
      modelo: filters.modelo,
      tipo: filters.tipoV,
      estado: filters.estadoV,
    });
  },

  processProviders: (data) => {
    const filters = {
      nombre: $("#nombreP").val(),
      estatus: $("#estadoP").val(),
      fecha_inicio: $("#fecha_inicio").val(),
      fecha_fin: $("#fecha_fin").val(),
    };

    const filteredData = dataManager.filterData(data.proveedores, filters);

    if (tables.proveedores) {
      tables.proveedores.clear().draw();
    }

    filteredData.forEach((item) => {
      const tipoDoc = `${item.tipo_documento} - ${item.num_documento}`;

      tables.proveedores.row.add([
        utils.formatDate(item.fecha_creacion),
        tipoDoc,
        item.nombre,
        item.telefono,
        item.correo,
        item.direccion,
      ]);
    });

    tables.proveedores.draw();
    formHandler.showResults("contenedor_p", filteredData.length);
    chartManager.updateProviderCharts(data.proveedores, filters);
  },

  processRoutes: (data) => {
    const filters = {
      fecha_inicio: $("#fecha_inicio").val(),
      fecha_fin: $("#fecha_fin").val(),
      tipo_ruta: $("#tipoR").val(),
      estado: $("#estadoRU").val(),
      punto_partida: $("#partida").val(),
      punto_destino: $("#destino").val(),
    };

    const filteredData = dataManager.filterData(data.rutas, filters);

    filteredData.forEach((item) => {
      tables.rutas.row.add([
        utils.formatDate(item.fecha_creacion),
        item.nombre_ruta,
        item.tipo_ruta,
        item.punto_partida,
        item.punto_destino,
        item.horario_salida,
        item.horario_llegada,
      ]);
    });

    tables.rutas.draw();
    formHandler.showResults("contenedor_ru", filteredData.length);
    chartManager.updateRouteCharts(data.rutas, filters);
  },

  processSpareParts: (data) => {
    const filters = {
      fecha_inicio: $("#fecha_inicio").val(),
      fecha_fin: $("#fecha_fin").val(),
      estatus: $("#estadoRE").val(),
      id_proveedor: $("#proveedor").val(),
    };

    const filteredData = dataManager.filterData(data.repuestos, filters);

    filteredData.forEach((item) => {
      tables.repuestos.row.add([
        utils.formatDate(item.fecha_creacion),
        item.nombre,
        item.descripcion,
        item.cantidad,
        item.nombre_prov,
        item.estatus,
      ]);
    });

    tables.repuestos.draw();
    formHandler.showResults("contenedor_re", filteredData.length);
    chartManager.updateSparePartsCharts(data.repuestos, filters);
  },

  showResults: (containerId, count) => {
    if (count > 0) {
      $("#contenedor_v, #contenedor_p, #contenedor_ru, #contenedor_re").hide();
      $(`#${containerId}`).show();
      utils.showAlert(
        "success",
        "Reporte generado",
        "Reporte generado con éxito."
      );
    } else {
      utils.showAlert(
        "error",
        "Reporte no generado",
        "El reporte no se pudo generar."
      );
    }
  },

  handleError: (xhr, status, error) => {
    let mensaje = "Ha ocurrido un error inesperado.";

    try {
      const response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      if (response && response.message) {
        mensaje = response.message;
      }
    } catch (e) {
      console.error("Error al parsear respuesta:", e);
      if (xhr.responseText) {
        mensaje = xhr.responseText;
      }
    }

    utils.showAlert("error", "Error en el servidor", mensaje);
    console.error("Error en la solicitud AJAX:", error);
  },
};

// Inicialización al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  const hoy = new Date();
  const fechaActual = hoy.toISOString().split("T")[0];
  document.getElementById("fecha_inicio").setAttribute("max", fechaActual);
  document.getElementById("fecha_fin").setAttribute("max", fechaActual);

  $(".contV, .contP, .contR, .contRe").hide();

  // Verificar que el plugin ChartDataLabels esté cargado
  if (typeof ChartDataLabels === "undefined") {
    console.error("ChartDataLabels plugin is not loaded");
    // Opcional: Cargar el plugin dinámicamente si es necesario
    // const script = document.createElement('script');
    // script.src = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0';
    // script.onload = function() {
    //   config.plugins = [ChartDataLabels];
    //   initializeApp();
    // };
    // document.head.appendChild(script);
  } else {
    initializeApp();
  }

  function initializeApp() {
    dataTableManager.initTables();
    formHandler.setup();
    dataManager.loadInitialData();
  }
});
